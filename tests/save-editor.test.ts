import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseSave,exportSave,inspectSaveHeader} from '../src/lib/saveEditor';
const i=(n:number)=>{const b=Buffer.alloc(4); b.writeInt32LE(n); return b};
const s=(text:string)=>Buffer.concat([i(Buffer.byteLength(text)+1),Buffer.from(text),Buffer.from([0])]);
const p=(name:string,type:string,body:Buffer,extra=Buffer.alloc(0))=>Buffer.concat([s(name),s(type),i(body.length),i(0),extra,Buffer.from([0]),body]);
const str=(name:string,v:string)=>p(name,'StrProperty',s(v));
const int=(name:string,v:number)=>p(name,'IntProperty',i(v));
const bool=(name:string,v:boolean)=>p(name,'BoolProperty',Buffer.alloc(0),Buffer.from([+v]));
const array=(name:string,inner:string,body:Buffer)=>p(name,'ArrayProperty',body,s(inner));
const struct=(name:string,kind:string,body:Buffer)=>p(name,'StructProperty',body,Buffer.concat([s(kind),Buffer.alloc(16)]));
function fixture(kind:'global'|'world'='world',version='0.9.0', mismatch=false) {
 const header=Buffer.concat([Buffer.from('GVAS'),i(2),i(522),Buffer.from([4,0,27,0,0,0,0,0,0,0]),s('++UE4+Release-4.27'),i(3),i(0),s(kind==='world'?'/Game/main/saveSlot.saveSlot_C':'/Game/main/save_main.save_main_C')]);
 const names=kind==='world'?'advancementsNames':'achievementsNames', completed=kind==='world'?'advancementsCompleted':'achievementsCompleted';
 const entries=[str(kind==='world'?'Version':'previousVersion',version),array(names,'NameProperty',Buffer.concat([i(2),s('sandbox'),s('sandbox')])),array(completed,'BoolProperty',Buffer.concat([i(mismatch?1:2),Buffer.from([0,1])])),p('unknown','TextProperty',Buffer.from([1,2,3,4,5]))];
 if(kind==='world') entries.push(int('Points',100),struct('upgrades','struct_upgrades',Buffer.concat([int('upg_downloadSpd_3_0123456789ABCDEF0123456789ABCDEF',3),s('None')])),struct('localGameRules','struct_gameRules',Buffer.concat([bool('funnySetting_29_0123456789ABCDEF0123456789ABCDEF',false),s('None')])));
 return Buffer.concat([header,...entries,s('None'),i(0)]);
}
test('GVAS: выбранные флаги и поля меняются без перезаписи остальных байтов',()=>{
 for(const kind of ['global','world'] as const) {
  const input=fixture(kind), doc=parseSave(input); assert.equal(doc.kind,kind); assert.equal(doc.flags.length,2);
  assert.deepEqual(Buffer.from(exportSave(doc,{})),input);
  const changes=kind==='world'?{'flag:0':true,'field:Points':200,'field:localGameRules.funnySetting':true}:{'flag:0':true};
  const output=exportSave(doc,changes); const again=parseSave(output); assert.equal(again.flags[0].value,true); assert.equal(again.flags[1].value,true);
  if(kind==='world') { assert.equal(again.fields.find(x=>x.key==='Points')?.value,200); assert.equal(again.fields.find(x=>x.key==='localGameRules.funnySetting')?.value,true); }
  const allowed=new Set([doc.flags[0].offset,...(kind==='world'?doc.fields.filter(f=>['Points','localGameRules.funnySetting'].includes(f.key)).flatMap(f=>Array.from({length:f.kind==='bool'?1:4},(_,j)=>f.offset+j)):[])]);
  for(let x=0;x<input.length;x++) if(output[x]!==input[x]) assert.ok(allowed.has(x),`неожиданная запись в ${x}`);
  assert.deepEqual(Buffer.from(doc.original),input);
 }
});
test('отклоняются чужой формат, другая версия, обрезанные файлы и несовпадающие списки',()=>{
 assert.throws(()=>parseSave(new Uint8Array(40)),/GVAS/);
 assert.throws(()=>parseSave(fixture('world','0.10.0')),/не поддерживается/);
 assert.throws(()=>parseSave(fixture('global','0.9.0',true)),/не совпадают/);
 const original=fixture(); for(const cut of [1,10,100,original.length-5]) assert.throws(()=>parseSave(original.subarray(0,cut)));
});
test('запись отклоняет неизвестные поля и некорректные значения',()=>{
 const doc=parseSave(fixture());
 for(const n of [-1,1.5,Infinity,100000001]) assert.throws(()=>exportSave(doc,{'field:Points':n}));
 assert.throws(()=>exportSave(doc,{'field:unknown':1}));
 assert.throws(()=>exportSave(doc,{'flag:0':1}));
 assert.equal(parseSave(fixture('global','0.9.0n')).version,'0.9.0n');
});

test('диагностика заголовка не разрешает редактирование другой версии',()=>{
 const input=fixture('world','0.10.0');
 assert.deepEqual(inspectSaveHeader(input),{saveVersion:2,packageVersion:522,engine:'4.27.0',className:'/Game/main/saveSlot.saveSlot_C'});
 assert.throws(()=>parseSave(input),/не поддерживается/);
 assert.throws(()=>inspectSaveHeader(input.subarray(0,20)));
});
