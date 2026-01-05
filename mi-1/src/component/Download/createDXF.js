import Drawing from "dxf-writer";

export function createDXF(shapes = []) {
  const d = new Drawing();
  // Layers
  d.addLayer("LINES", Drawing.ACI.BLUE, "CONTINUOUS");
  d.addLayer("CIRCLES", Drawing.ACI.RED, "CONTINUOUS");

  shapes.forEach((shape,i) => {
    // ---------- LINE ----------
    if ( shape.type === "LINE" && shape.vertices && shape.vertices.length === 2) {
      d.setActiveLayer("LINES");
      const line = d.drawLine(
        shape.vertices[0].x,
        shape.vertices[0].y,
        shape.vertices[1].x,
        shape.vertices[1].y
      );
      line.lineweight = shape.lineweight;
    }
    // ---------- CIRCLE ----------
    if ( shape.type === "ARC" && shape.center !== undefined && shape.radius !== undefined) {
      const { x: x, y: y } = shape.center;
      d.setActiveLayer("CIRCLES");
      const arc =  d.drawArc(
        x,
        y,
        shape.radius,
        shape.startAngle,
        shape.endAngle
      );
      arc.lineweight = shape.lineweight;
    }
  });

  return d.toDxfString();
}
