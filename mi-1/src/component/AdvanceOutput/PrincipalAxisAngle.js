export function ComputePrincipalAxisAngle(predefinedPoints,a, b, mx, ratio, thickness, Paa) {
    let umax = 0;
    let vmax = 0;
    const aa = Math.PI/180;
    const au = a*Math.cos(aa*Paa) - b*Math.sin(aa*Paa);
    const bv = b*Math.cos(aa*Paa) + a*Math.sin(aa*Paa);
    for(let i = 0;i< predefinedPoints.length;i++){
        const type = predefinedPoints[i].type;
        const x = predefinedPoints[i].x*Math.cos(aa*Paa) - predefinedPoints[i].y*Math.sin(aa*Paa);
        const y = predefinedPoints[i].y*Math.cos(aa*Paa) + predefinedPoints[i].x*Math.sin(aa*Paa);
        const w = predefinedPoints[i].w;
        const h = predefinedPoints[i].h;
        const r = predefinedPoints[i].r;
        const angle = predefinedPoints[i].angle;
        const rotation = predefinedPoints[i].rotation + Number(Paa);
        const t = predefinedPoints[i].t;
        if(type === 'line'){
            umax = Math.max(umax, Math.abs(x - au), Math.abs(x + w*Math.cos(aa*angle  + aa*Number(Paa)) - au), Math.abs(x + w*Math.cos(aa*angle  + aa*Number(Paa)) - h*Math.sin(aa*angle  + aa*Number(Paa)) - au), Math.abs(x - h*Math.sin(aa*angle  + aa*Number(Paa)) - au));

            vmax = Math.max(vmax, Math.abs(y - bv), Math.abs(y + w*Math.sin(aa*angle  + aa*Number(Paa)) - bv), Math.abs(y + w*Math.sin(aa*angle  + aa*Number(Paa)) + h*Math.cos(aa*angle  + aa*Number(Paa)) - bv), Math.abs(y + h*Math.cos(aa*angle  + aa*Number(Paa)) - bv));
        }
    
        else{ 

            umax = Math.max(umax, Math.abs(x + r*Math.cos(aa*rotation) - au), Math.abs(x + r*Math.cos(aa*(rotation + angle)) - au), Math.cos(x + (r-t)*Math.cos(aa*rotation) - au), Math.abs(x + (r - t)*Math.cos(aa*(rotation + angle)) - au));
            vmax = Math.max(vmax, Math.abs(y + r*Math.sin(aa*rotation) - bv), Math.abs(y + r*Math.sin(aa*(rotation + angle)) - bv), Math.abs(y + (r - t)*Math.sin(aa*rotation) - bv), Math.abs(y + (r - t)*Math.sin(aa*(rotation + angle)) - bv) );

            if(270 > (rotation)%360 && 270 < (rotation + angle)%300){
                vmax = Math.max(vmax, Math.abs(y - r - bv));
            }
            if(360 > (rotation)%360 && 360 < (rotation + angle)%360){
                umax = Math.max(umax, Math.abs(x + r - au));
            }
            if(90 > (rotation)%360 && 90 < (rotation + angle)%360){
                vmax = Math.max(vmax, Math.abs(y + r - bv));
            }
            if(180 > (rotation)%360 && 180 < (rotation + angle)%360){
                umax = Math.max(umax, Math.abs(x - r - au));
            }
        }
    }
    vmax = (vmax*mx)/(10*ratio);
    umax = (umax*mx)/(10*ratio);
  return {umax, vmax};
}