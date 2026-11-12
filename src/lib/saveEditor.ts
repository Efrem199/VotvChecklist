// VotV UE4.27 GVAS: read tagged root properties and patch only validated fixed-width values.
// All unrecognized property bodies remain opaque and are copied verbatim, never reserialized.
export type ScalarKind = 'int' | 'float' | 'bool';
export interface EditableField { key: string; kind: ScalarKind; offset: number; value: number | boolean }
export interface Flag { id: string; offset: number; value: boolean; index: number }
export interface SaveDocument { kind: 'global' | 'world'; version: string; fields: EditableField[]; flags: Flag[]; original: Uint8Array }
interface Tag { name: string; type: string; inner?: string; struct?: string; start: number; size: number; boolOffset?: number }
const MAX_FILE = 64 * 1024 * 1024;

class Reader {
  pos = 0;
  view: DataView;
  constructor(public bytes: Uint8Array, public end = bytes.length) { this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength); }
  need(n: number) { if (!Number.isSafeInteger(n) || n < 0 || this.pos + n > this.end) throw new Error('Файл обрезан или содержит неверный размер.'); }
  skip(n: number) { this.need(n); this.pos += n; }
  u8() { this.need(1); return this.view.getUint8(this.pos++); }
  int() { this.need(4); const n = this.view.getInt32(this.pos, true); this.pos += 4; return n; }
  str() {
    const len = this.int();
    if (!len) return '';
    if (Math.abs(len) > 65536) throw new Error('Слишком длинная строка в файле.');
    const size = len < 0 ? -len * 2 : len;
    this.need(size);
    const v = this.bytes.subarray(this.pos, this.pos + size); this.pos += size;
    if (len < 0) {
      if (size < 2 || v[size - 1] || v[size - 2]) throw new Error('Некорректная строка GVAS.');
      return new TextDecoder('utf-16le', {fatal: true}).decode(v.subarray(0, size - 2));
    }
    if (v[size - 1] !== 0) throw new Error('Некорректная строка GVAS.');
    return new TextDecoder('utf-8', {fatal: true}).decode(v.subarray(0, size - 1));
  }
}
function tags(r: Reader): Tag[] {
  const result: Tag[] = [];
  for (let count = 0; count < 100000; count++) {
    const name = r.str();
    if (name === 'None') return result;
    const type = r.str(); const size = r.int(); const index = r.int();
    if (size < 0 || index < 0) throw new Error('Некорректный тег свойства.');
    let struct: string | undefined, inner: string | undefined, boolOffset: number | undefined;
    if (type === 'StructProperty') { struct = r.str(); r.skip(16); }
    else if (['ArrayProperty','SetProperty','ByteProperty','EnumProperty'].includes(type)) inner = r.str();
    else if (type === 'MapProperty') { inner = r.str(); r.str(); }
    else if (type === 'BoolProperty') { boolOffset = r.pos; if (r.u8() > 1 || size !== 0) throw new Error('Неизвестное представление BoolProperty.'); }
    else if (!['IntProperty','Int64Property','UInt32Property','UInt64Property','FloatProperty','DoubleProperty','StrProperty','NameProperty','ObjectProperty','SoftObjectProperty','TextProperty'].includes(type)) throw new Error(`Неизвестный тип свойства: ${type}`);
    const guid = r.u8(); if (guid > 1) throw new Error('Неизвестный формат GUID.'); if (guid) r.skip(16);
    const start = r.pos; r.skip(size); result.push({name,type,inner,struct,start,size,boolOffset});
  }
  throw new Error('Слишком много свойств.');
}
function unique(list: Tag[], name: string): Tag | undefined {
  const found = list.filter(p => p.name === name);
  if (found.length > 1) throw new Error(`Повторяется свойство ${name}; редактирование отключено.`);
  return found[0];
}
function bodyReader(bytes: Uint8Array, tag: Tag) { const r = new Reader(bytes, tag.start + tag.size); r.pos = tag.start; return r; }
function field(bytes: Uint8Array, tag: Tag, key: string): EditableField | undefined {
  const d = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (tag.type === 'IntProperty' && tag.size === 4) return {key,kind:'int',offset:tag.start,value:d.getInt32(tag.start,true)};
  if (tag.type === 'FloatProperty' && tag.size === 4) { const n=d.getFloat32(tag.start,true); if (!Number.isFinite(n)) throw new Error(`Некорректное значение ${key}.`); return {key,kind:'float',offset:tag.start,value:n}; }
  if (tag.type === 'BoolProperty' && tag.boolOffset !== undefined) return {key,kind:'bool',offset:tag.boolOffset,value:bytes[tag.boolOffset] === 1};
  return undefined;
}
function flagArray(bytes: Uint8Array, root: Tag[], namesKey: string, flagsKey: string): Flag[] {
  const names = unique(root,namesKey), states=unique(root,flagsKey);
  if (!names && !states) return [];
  if (!names || !states || names.type !== 'ArrayProperty' || names.inner !== 'NameProperty' || states.type !== 'ArrayProperty' || states.inner !== 'BoolProperty') throw new Error('Неизвестная структура флагов достижений.');
  const a=bodyReader(bytes,names), b=bodyReader(bytes,states); const count=a.int(), countB=b.int();
  if (count < 0 || count > 10000 || count !== countB || states.size !== 4 + count) throw new Error('Списки имён и флагов достижений не совпадают.');
  const result: Flag[] = [];
  for (let i=0; i<count; i++) { const id=a.str(); if (!id) throw new Error('Пустой идентификатор достижения.'); const offset=b.pos, n=b.u8(); if (n>1) throw new Error('Некорректный флаг достижения.'); result.push({id,offset,value:n===1,index:i}); }
  if (a.pos !== a.end || b.pos !== b.end) throw new Error('Неожиданное содержимое списка достижений.');
  return result;
}
const ROOT_FIELDS = ['Points','food','sleep','battery','health','maxHealth'];
const STRUCTS: Record<string,string> = {upgrades:'struct_upgrades', localGameRules:'struct_gameRules'};
const structFields = new Set(['upg_downloadSpd','upg_processLvl','upg_processSpeed','upg_coordDrift','upg_coordPingSpeed','upg_coordMovementSpeed','upg_coordRadarSpeed','upg_coordCooldown','upg_scanner','upg_scannerFr','upg_detecQual','upg_radarHist','upg_radar_speed','upg_compTime','upg_triangleProb','foodSpoilage','foodFatigue','physEvents','funnySetting','customContent']);
export function parseSave(input: Uint8Array): SaveDocument {
  if (input.length < 32 || input.length > MAX_FILE) throw new Error('Файл слишком мал или больше 64 МБ.');
  const bytes = input.slice(), r = new Reader(bytes);
  if (String.fromCharCode(...bytes.subarray(0,4)) !== 'GVAS') throw new Error('Это не файл GVAS.');
  r.skip(4); const saveVersion=r.int(), packageVersion=r.int();
  r.need(10); const major=r.view.getUint16(r.pos,true), minor=r.view.getUint16(r.pos+2,true); r.skip(10); r.str(); r.int(); const custom=r.int();
  if (custom < 0 || custom > 1000) throw new Error('Некорректная таблица версий.');
  r.skip(custom*20); const cls=r.str();
  if (saveVersion !== 2 || packageVersion !== 522 || major !== 4 || minor !== 27) throw new Error('Неподдерживаемая версия формата GVAS.');
  const kind = cls === '/Game/main/save_main.save_main_C' ? 'global' : cls === '/Game/main/saveSlot.saveSlot_C' ? 'world' : undefined;
  if (!kind) throw new Error('Неизвестный тип сохранения VotV.');
  const root=tags(r);
  if (r.end-r.pos !== 4 || r.int() !== 0) throw new Error('Неожиданные данные в конце файла.');
  const ver = unique(root,kind === 'global' ? 'previousVersion' : 'Version');
  if (!ver || ver.type !== 'StrProperty') throw new Error('Версия игры в файле не найдена.');
  const vr=bodyReader(bytes,ver), version=vr.str();
  if (vr.pos !== vr.end || !/^0\.9\.0[a-z]?$/i.test(version)) throw new Error(`Версия ${version || 'неизвестна'} не поддерживается: только семейство 0.9.0 (0.9.0n не отличима от других патчей по этому полю).`);
  const fields: EditableField[]=[];
  if (kind === 'world') {
    for (const name of ROOT_FIELDS) { const t=unique(root,name); if (t) {const f=field(bytes,t,name); if (!f || (name==='Points' ? f.kind!=='int' : f.kind!=='float')) throw new Error(`Неожиданный тип ${name}.`); fields.push(f);} }
    for (const [name, struct] of Object.entries(STRUCTS)) {
      const t=unique(root,name); if (!t) continue;
      if (t.type!=='StructProperty' || t.struct!==struct) throw new Error(`Неожиданный формат ${name}.`);
      const sub=bodyReader(bytes,t), props=tags(sub); if(sub.pos!==sub.end) throw new Error(`Некорректная структура ${name}.`);
      const keys=new Set<string>();
      for (const p of props) {
        const key=p.name.replace(/_\d+_[0-9A-Fa-f]{32}$/, ''); if (!structFields.has(key)) continue;
        if(keys.has(key)) throw new Error(`Повторяется ${name}.${key}.`); keys.add(key);
        const f=field(bytes,p,`${name}.${key}`); const expected=name==='upgrades' ? 'int' : 'bool';
        if(!f || f.kind!==expected) throw new Error(`Неожиданный тип ${name}.${key}.`); fields.push(f);
      }
    }
  }
  const flags=flagArray(bytes,root,kind==='global'?'achievementsNames':'advancementsNames',kind==='global'?'achievementsCompleted':'advancementsCompleted');
  if (!fields.length && !flags.length) throw new Error('Поддерживаемых полей не найдено.');
  return {kind,version,fields,flags,original:bytes};
}
export type Changes = Record<string, number | boolean>;
export function exportSave(doc: SaveDocument, changes: Changes): Uint8Array {
  const bytes=doc.original.slice(), v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  const valid=new Map<string, EditableField | Flag>([...doc.fields.map(f=>[`field:${f.key}`,f] as const), ...doc.flags.map(f=>[`flag:${f.index}`,f] as const)]);
  for (const [key,value] of Object.entries(changes)) {
    const f=valid.get(key); if(!f) throw new Error('Неизвестное поле изменения.');
    if ('kind' in f && f.kind !== 'bool') {
      if(typeof value!=='number' || !Number.isFinite(value) || value < 0 || value > 100000000 || (f.kind==='int' && !Number.isInteger(value))) throw new Error(`Недопустимое значение ${f.key}.`);
      if (f.kind==='int') v.setInt32(f.offset,value,true); else v.setFloat32(f.offset,value,true);
    } else {
      if (typeof value !== 'boolean') throw new Error('Некорректное логическое значение.');
      v.setUint8(f.offset,value?1:0);
    }
  }
  // Revalidate after patching without changing any variable-length structure.
  parseSave(bytes);
  return bytes;
}
