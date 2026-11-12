import { useState } from "react";

interface Props {
  onAdd: (loc: { name: string; x?: number; y?: number; desc?: string }) => void;
}

function parseNum(s: string): number | undefined {
  const t = s.trim().replace(",", ".");
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

export default function AddCustomLocation({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [desc, setDesc] = useState("");

  const submit = () => {
    const n = name.trim();
    if (!n) return;
    onAdd({ name: n, x: parseNum(x), y: parseNum(y), desc: desc.trim() || undefined });
    setName("");
    setX("");
    setY("");
    setDesc("");
  };

  return (
    <form
      className="border-t border-phos-800/40 bg-ink-950/40 px-4 py-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <p className="panel-title mb-2">Добавить точку</p>
      <div className="grid gap-2 sm:grid-cols-[1fr_5rem_5rem]">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Название (напр. «Ящик у дороги к Oscar»)" className="input-term" aria-label="Название точки" required />
        <input value={x} onChange={(e) => setX(e.target.value)} placeholder="X" className="input-term" inputMode="decimal" aria-label="Координата X" />
        <input value={y} onChange={(e) => setY(e.target.value)} placeholder="Y" className="input-term" inputMode="decimal" aria-label="Координата Y" />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Описание (необязательно)" className="input-term flex-1" aria-label="Описание" />
        <button type="submit" className="btn-term border-phos-600 text-phos-300" disabled={!name.trim()}>
          + добавить
        </button>
      </div>
      <p className="mt-2 text-[10px] text-phos-700">Координаты — как на цифровой карте в игре (X вправо/восток, Y вниз/юг). С ними точка появится на схеме.</p>
    </form>
  );
}
