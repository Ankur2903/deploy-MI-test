export function ComputeMomentOfInertia(predefinedPoints,a, b, mx, ratio, thickness) {
    let Ix = 0;
    let Iy = 0;
    let sw = 0;
    let ol = 0;
    let acs = 0;
    let ymax = 0;
    let xmax = 0;
    let Ixy = 0;
    const aa = Math.PI/180;
    for(let i = 0;i< predefinedPoints.length;i++){
        const type = predefinedPoints[i].type;
        const x = predefinedPoints[i].x;
        const y = predefinedPoints[i].y;
        const w = predefinedPoints[i].w;
        const h = predefinedPoints[i].h;
        const r = predefinedPoints[i].r;
        const angle = predefinedPoints[i].angle;
        const rotation = predefinedPoints[i].rotation;
        const t = predefinedPoints[i].t;

        if(type === 'line'){
            Ix = Ix + (w*h)*((Math.pow(w, 2)*Math.pow(Math.sin(aa*angle), 2) + Math.pow(h, 2)*Math.pow(Math.cos(aa*angle), 2))/12 + Math.pow(y + h*Math.cos(aa*angle)/2 + w*Math.sin(aa*angle)/2 - b, 2));

            Iy = Iy + (w*h)*((Math.pow(w, 2)*Math.pow(Math.cos(aa*angle), 2) + Math.pow(h, 2)*Math.pow(Math.sin(aa*angle), 2))/12 + Math.pow(x - h*Math.sin(aa*angle)/2 + w*Math.cos(aa*angle)/2 - a, 2));

            if(w === thickness){
                sw = sw + h;
                ol = ol + 2*h;
            }
            else{
                sw = sw + w;
                ol = ol + 2*w;
            }

            acs = acs + w*h

            ymax = Math.max(ymax, Math.abs(y - b), Math.abs(y + w*Math.sin(aa*angle) - b), Math.abs(y + w*Math.sin(aa*angle) + h*Math.cos(aa*angle) - b), Math.abs(y + h*Math.cos(aa*angle) - b));
            xmax = Math.max(xmax, Math.abs(x - a), Math.abs(x + w*Math.cos(aa*angle) - a), Math.abs(x + w*Math.cos(aa*angle) - h*Math.sin(aa*angle) - a), Math.abs(x - h*Math.sin(aa*angle) - a));

            Ixy = Ixy + ((w*w*w*h/3) - (w*h*h*h/3))*Math.sin(aa*angle)*Math.cos(aa*angle) + (w*w*h*h/4)*(Math.cos(aa*angle)*Math.cos(aa*angle) - Math.sin(aa*angle)*Math.sin(aa*angle))  - w*h*(w*Math.cos(aa*angle)/2 - h*Math.sin(aa*angle)/2)*(w*Math.sin(aa*angle)/2 + h*Math.cos(aa*angle)/2) + w*h*(x + w*Math.cos(aa*angle)/2 - h*Math.sin(aa*angle)/2 - a)*(y + w*Math.sin(aa*angle)/2 + h*Math.cos(aa*angle)/2 - b);
            
        }
        else{ 
            Ix = Ix + ((Math.pow(r, 4)/4)*(aa*angle/2 - (Math.sin(aa*(2*rotation + 2*angle)) - Math.sin(aa*(2*rotation)))/4)) - (aa*angle*Math.pow(r, 2)/2)*(Math.pow((4*r*Math.sin(aa*angle/2)/(3*aa*angle))*Math.sin(aa*(rotation + angle/2)), 2) - Math.pow((y + (4*r*Math.sin(aa*angle/2)/(3*aa*angle))*Math.sin(aa*(rotation + angle/2))) - b,2))
            - (((Math.pow(r - t, 4)/4)*(aa*angle/2 - (Math.sin(aa*(2*rotation + 2*angle)) - Math.sin(aa*(2*rotation)))/4)) - (aa*angle*Math.pow(r - t, 2)/2)*(Math.pow((4*(r - t)*Math.sin(aa*angle/2)/(3*aa*angle))*Math.sin(aa*(rotation + angle/2)), 2) - Math.pow((y + (4*(r - t)*Math.sin(aa*angle/2)/(3*aa*angle))*Math.sin(aa*(rotation + angle/2))) - b,2)));

            Iy = Iy +  ((Math.pow(r, 4)/4)*(aa*angle/2 + (Math.sin(aa*(2*rotation + 2*angle)) - Math.sin(aa*(2*rotation)))/4)) - (aa*angle*Math.pow(r, 2)/2)*(Math.pow((4*r*Math.sin(aa*angle/2)/(3*aa*angle))*Math.cos(aa*(rotation + angle/2)), 2) - Math.pow((x + (4*r*Math.sin(aa*angle/2)/(3*aa*angle))*Math.cos(aa*(rotation + angle/2))) - a,2))
            - (((Math.pow(r - t, 4)/4)*(aa*angle/2 + (Math.sin(aa*(2*rotation + 2*angle)) - Math.sin(aa*(2*rotation)))/4)) - (aa*angle*Math.pow(r - t, 2)/2)*(Math.pow((4*(r - t)*Math.sin(aa*angle/2)/(3*aa*angle))*Math.cos(aa*(rotation + angle/2)), 2) - Math.pow((x + (4*(r - t)*Math.sin(aa*angle/2)/(3*aa*angle))*Math.cos(aa*(rotation + angle/2))) - a,2)));

            sw = sw + aa*angle*(r - 0.596*thickness)
            ol = ol + aa*angle*(2*r - thickness);
            acs = acs + (aa*angle)*(Math.pow(r, 2) - Math.pow(r - t,2))/2;

            xmax = Math.max(xmax, Math.abs(x + r*Math.cos(aa*rotation) - a), Math.abs(x + r*Math.cos(aa*(rotation + angle)) - a), Math.cos(x + (r-t)*Math.cos(aa*rotation) - a), Math.abs(x + (r - t)*Math.cos(aa*(rotation + angle)) - a));
            ymax = Math.max(ymax, Math.abs(y + r*Math.sin(aa*rotation) - b), Math.abs(y + r*Math.sin(aa*(rotation + angle)) - b), Math.abs(y + (r - t)*Math.sin(aa*rotation) - b), Math.abs(y + (r - t)*Math.sin(aa*(rotation + angle)) - b) );

            if(270 > rotation && 270 < rotation + angle){
                ymax = Math.max(ymax, Math.abs(y - r - b));
            }
            if(360 > rotation && 360 < rotation + angle){
                xmax = Math.max(xmax, Math.abs(x + r - a));
            }
            if(90 > rotation && 90 < rotation + angle){
                ymax = Math.max(ymax, Math.abs(y + r - b));
            }
            if(180 > rotation && 180 < rotation + angle){
                xmax = Math.max(xmax, Math.abs(x - r - a));
            }

            Ixy = Ixy + r*r*r*r*(Math.cos(aa*2*rotation) - Math.cos(aa*(2*rotation + 2*angle)))/16 - (aa*angle*r*r/2)*((4*r*Math.sin(aa*angle/2)/(3*aa*angle))*Math.cos(aa*(rotation + angle/2)))*((4*r*Math.sin(aa*angle/2)/(3*aa*angle))*Math.sin(aa*(rotation + angle/2))) + (aa*angle*r*r/2)*(x + (4*r*Math.sin(aa*angle/2)/(3*aa*angle))*Math.cos(aa*(rotation + angle/2)) - a)*(y + (4*r*Math.sin(aa*angle/2)/(3*aa*angle))*Math.sin(aa*(rotation + angle/2)) - b) - ((r - t)*(r- t)*(r - t)*(r - t)*(Math.cos(aa*2*rotation) - Math.cos(aa*(2*rotation + 2*angle)))/16 - (aa*angle*(r - t)*(r - t)/2)*((4*(r - t)*Math.sin(aa*angle/2)/(3*aa*angle))*Math.cos(aa*(rotation + angle/2)))*((4*(r - t)*Math.sin(aa*angle/2)/(3*aa*angle))*Math.sin(aa*(rotation + angle/2))) + (aa*angle*(r - t)*(r - t)/2)*(x + (4*(r - t)*Math.sin(aa*angle/2)/(3*aa*angle))*Math.cos(aa*(rotation + angle/2)) - a)*(y + (4*(r - t)*Math.sin(aa*angle/2)/(3*aa*angle))*Math.sin(aa*(rotation + angle/2)) - b));
        }
    }
    ol = ol + 2*thickness;
    
    Ix = (Ix*Math.pow(mx, 4))/(10000*Math.pow(ratio, 4));
    Iy = (Iy*Math.pow(mx, 4))/(10000*Math.pow(ratio, 4));
    sw = (sw*mx)/ratio;
    ol = (ol*mx)/ratio;
    acs = (acs*Math.pow(mx, 2))/(Math.pow(ratio, 2));
    xmax = (xmax*mx)/(10*ratio);
    ymax = (ymax*mx)/(10*ratio);
    Ixy = (Ixy*Math.pow(mx, 4))/(10000*Math.pow(ratio, 4));
  return {Ix, Iy, sw, ol, acs, xmax, ymax, Ixy};
}