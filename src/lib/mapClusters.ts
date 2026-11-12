/** Группирует соседние маркеры; каждый исходный элемент входит ровно в одну группу. */
export function clusterPoints<T extends { px: number; py: number }>(points: T[], radius: number): T[][] {
 const clusters: T[][] = [];
 const remaining = [...points];
 while (remaining.length) {
   const cluster = [remaining.shift()!];
   // Транзитивное объединение: точки, касающиеся любого маркера группы.
   for (let i=0; i<cluster.length; i++) {
     for (let j=remaining.length-1; j>=0; j--) {
       if (Math.hypot(cluster[i].px-remaining[j].px, cluster[i].py-remaining[j].py) <= radius) cluster.push(remaining.splice(j,1)[0]);
     }
   }
   clusters.push(cluster);
 }
 return clusters;
}
