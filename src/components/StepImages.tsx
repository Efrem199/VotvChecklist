import { imageUrl, type GuideIllustration } from '@/data/achievementIllustrations';

export default function StepImages({ images }: { images: GuideIllustration[] }) {
  if (!images.length) return null;
  return <div className="mt-2 flex flex-wrap gap-3">{images.map(image => <figure key={image.file} className="w-44 max-w-full text-xs text-phos-500">
    <a href={`https://voicesofthevoid.wiki.gg/wiki/File:${image.file}`} target="_blank" rel="noreferrer"><img className="h-32 w-full rounded border border-phos-900 bg-ink-950/40 object-contain" src={imageUrl(image)} loading="lazy" alt={image.caption} onError={e => { e.currentTarget.hidden = true; }}/><figcaption className="mt-1 underline">{image.caption} · файл вики ↗</figcaption></a>
  </figure>)}</div>;
}
