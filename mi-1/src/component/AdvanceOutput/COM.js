export function COM(predefinedPoints) {
    let a = 0;
    let b = 0;
    let sum = 0;
    const aa = Math.PI/180;
    for(let i = 0;i< predefinedPoints.length;i++){
        const id = predefinedPoints[i].id;
        const type = predefinedPoints[i].type;
        const x = predefinedPoints[i].x;
        const y = predefinedPoints[i].y;
        const w = predefinedPoints[i].w;
        const h = predefinedPoints[i].h;
        const r = predefinedPoints[i].r;
        const angle = predefinedPoints[i].angle;
        const rotation = predefinedPoints[i].rotation;
        const t = predefinedPoints[i].t;
        if(predefinedPoints[i].type === 'line'){
            sum = sum + w * h;
            a = a + (x - h*Math.sin(aa*angle)/2 + w*Math.cos(aa*angle)/2)*(w*h);
            b = b + (y + h*Math.cos(aa*angle)/2 + w*Math.sin(aa*angle)/2)*(w*h);
        }
        else{
            sum = sum + (aa*angle*r*r - aa*angle*(r - t)*(r - t))/2;
            a = a + (x + (4*r*Math.sin(aa*angle/2)/(3*aa*angle))*Math.cos(aa*(rotation + angle/2)))*(aa*angle*r*r)/2 - (x + (4*(r - t)*Math.sin(aa*angle/2)/(3*aa*angle))*Math.cos(aa*(rotation + angle/2)))*(aa*angle*(r - t)*(r - t))/2;
            b = b + (y + (4*r*Math.sin(aa*angle/2)/(3*aa*angle))*Math.sin(aa*(rotation + angle/2)))*(aa*angle*r*r)/2 - (y + (4*(r - t)*Math.sin(aa*angle/2)/(3*aa*angle))*Math.sin(aa*(rotation + angle/2)))*(aa*angle*(r - t)*(r - t))/2;
        }
    }
    a = (a/sum).toFixed(2);
    b = (b/sum).toFixed(2);
  return {a, b};
}