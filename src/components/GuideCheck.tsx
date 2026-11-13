export default function GuideCheck({ id, label, marks, onStep, disabled = false }: { id: string; label: string; marks: Record<string, boolean>; onStep: (id: string, value: boolean) => void; disabled?: boolean }) {
 return <label className="mt-2 flex cursor-pointer items-start gap-2 text-xs text-phos-300"><input type="checkbox" className="mt-0.5 shrink-0" disabled={disabled} checked={Boolean(marks[id])} onChange={e => onStep(id, e.target.checked)}/><span>{label}</span></label>;
}
