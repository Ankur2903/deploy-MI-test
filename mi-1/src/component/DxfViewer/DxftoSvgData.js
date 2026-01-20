function arcFromBulge(p1, p2) {// ---------- ARC from bulge ----------
  const b = p1.bulge;

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const L = Math.hypot(dx, dy);

  const R = (L * (1 + b * b)) / (4 * Math.abs(b));

  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;

  const h = (L / 2) * (1 - b * b) / (2 * Math.abs(b));

  const nx = -dy / L;
  const ny = dx / L;

  const sign = b > 0 ? 1 : -1;

  const cx = mx + sign * h * nx;
  const cy = my + sign * h * ny;

  const startAngle = Math.atan2(p1.y - cy, p1.x - cx);
  const endAngle = Math.atan2(p2.y - cy, p2.x - cx);
  return {type: "ARC", center: { x: cx, y: cy }, radius: R, startAngle: b > 0 ? startAngle : endAngle, endAngle: b > 0 ? endAngle : startAngle, clockwise: b < 0};
}
// ---------- Convert polyline ----------
export function convertDXFPolyline(points) {
  const shapes = [];

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length]; // closed polyline
    if (p1.bulge === undefined) {
      const angle = (p2.y >= p1.y && p2.x >= p1.x) ? Math.atan((p2.y - p1.y)/(p2.x - p1.x)) : (p2.y <= p1.y && p2.x < p1.x) ? Math.PI + Math.atan((p2.y - p1.y)/(p2.x - p1.x)) : (p2.y > p1.y && p2.x <= p1.x) ? Math.PI + Math.atan((p2.y - p1.y)/(p2.x - p1.x)) : 2*Math.PI + Math.atan((p2.y - p1.y)/(p2.x - p1.x));
      shapes.push({ type: "LINE", start: p1, end: p2, angle : angle});
    } else {
      shapes.push(arcFromBulge(p1, p2));
    }
  }
  return shapes;
}
