export function ComputeMomentOfInertia(predefinedPoints,a, b, mx, ratio, thickness) {
    let Ix = 0;
    let Iy = 0;
    let sw = 0;
    let ol = 0;
    let acs = 0;
    const aa = Math.PI/180;
    for(let i = 0;i< predefinedPoints.length;i++){
        if(predefinedPoints[i].type === 'line'){
            Ix = Ix + (predefinedPoints[i].w*predefinedPoints[i].h)*((Math.pow(predefinedPoints[i].w, 2)*Math.sin(aa*predefinedPoints[i].angle) + Math.pow(predefinedPoints[i].h, 2)*Math.cos(aa*predefinedPoints[i].angle))/12 + Math.pow(predefinedPoints[i].y + predefinedPoints[i].h*Math.cos(aa*predefinedPoints[i].angle)/2 + predefinedPoints[i].w*Math.sin(aa*predefinedPoints[i].angle)/2 - b, 2));

            Iy = Iy + (predefinedPoints[i].w*predefinedPoints[i].h)*((Math.pow(predefinedPoints[i].w, 2)*Math.cos(aa*predefinedPoints[i].angle) + Math.pow(predefinedPoints[i].h, 2)*Math.sin(aa*predefinedPoints[i].angle))/12 + Math.pow(predefinedPoints[i].x - predefinedPoints[i].h*Math.sin(aa*predefinedPoints[i].angle)/2 + predefinedPoints[i].w*Math.cos(aa*predefinedPoints[i].angle)/2 - a, 2));

            if(predefinedPoints[i].w === thickness){
                sw = sw + predefinedPoints[i].h;
                ol = ol + 2*predefinedPoints[i].h;
            }
            else{
                sw = sw + predefinedPoints[i].w;
                ol = ol + 2*predefinedPoints[i].w;
            }

            acs = acs + predefinedPoints[i].w*predefinedPoints[i].h
        }
        else{ 
            Ix = Ix + ((Math.pow(predefinedPoints[i].r, 4)/4)*(aa*predefinedPoints[i].angle/2 - (Math.sin(aa*(4*predefinedPoints[i].rotation + 2*predefinedPoints[i].angle)) - Math.sin(aa*(4*predefinedPoints[i].rotation)))/4)) - (aa*predefinedPoints[i].angle*Math.pow(predefinedPoints[i].r, 2)/2)*(Math.pow((predefinedPoints[i].y + (4*predefinedPoints[i].r*Math.sin(aa*predefinedPoints[i].angle/2)/(3*aa*predefinedPoints[i].angle))*Math.sin(aa*(predefinedPoints[i].rotation + predefinedPoints[i].angle/2))) - predefinedPoints[i].y, 2) - Math.pow((predefinedPoints[i].y + (4*predefinedPoints[i].r*Math.sin(aa*predefinedPoints[i].angle/2)/(3*aa*predefinedPoints[i].angle))*Math.sin(aa*(predefinedPoints[i].rotation + predefinedPoints[i].angle/2))) - b,2))
            - (((Math.pow(predefinedPoints[i].r - predefinedPoints[i].t, 4)/4)*(aa*predefinedPoints[i].angle/2 - (Math.sin(aa*(4*predefinedPoints[i].rotation + 2*predefinedPoints[i].angle)) - Math.sin(aa*(4*predefinedPoints[i].rotation)))/4)) - (aa*predefinedPoints[i].angle*Math.pow(predefinedPoints[i].r - predefinedPoints[i].t, 2)/2)*(Math.pow((predefinedPoints[i].y + (4*(predefinedPoints[i].r - predefinedPoints[i].t)*Math.sin(aa*predefinedPoints[i].angle/2)/(3*aa*predefinedPoints[i].angle))*Math.sin(aa*(predefinedPoints[i].rotation + predefinedPoints[i].angle/2))) - predefinedPoints[i].y, 2) - Math.pow((predefinedPoints[i].y + (4*(predefinedPoints[i].r - predefinedPoints[i].t)*Math.sin(aa*predefinedPoints[i].angle/2)/(3*aa*predefinedPoints[i].angle))*Math.sin(aa*(predefinedPoints[i].rotation + predefinedPoints[i].angle/2))) - b,2)));

            Iy = Iy +  ((Math.pow(predefinedPoints[i].r, 4)/4)*(aa*predefinedPoints[i].angle/2 + (Math.sin(aa*(4*predefinedPoints[i].rotation + 2*predefinedPoints[i].angle)) - Math.sin(aa*(4*predefinedPoints[i].rotation)))/4)) - (aa*predefinedPoints[i].angle*Math.pow(predefinedPoints[i].r, 2)/2)*(Math.pow((predefinedPoints[i].x + (4*predefinedPoints[i].r*Math.sin(aa*predefinedPoints[i].angle/2)/(3*aa*predefinedPoints[i].angle))*Math.cos(aa*(predefinedPoints[i].rotation + predefinedPoints[i].angle/2))) - predefinedPoints[i].x, 2) - Math.pow((predefinedPoints[i].x + (4*predefinedPoints[i].r*Math.sin(aa*predefinedPoints[i].angle/2)/(3*aa*predefinedPoints[i].angle))*Math.cos(aa*(predefinedPoints[i].rotation + predefinedPoints[i].angle/2))) - a,2))
            - (((Math.pow(predefinedPoints[i].r - predefinedPoints[i].t, 4)/4)*(aa*predefinedPoints[i].angle/2 + (Math.sin(aa*(4*predefinedPoints[i].rotation + 2*predefinedPoints[i].angle)) - Math.sin(aa*(4*predefinedPoints[i].rotation)))/4)) - (aa*predefinedPoints[i].angle*Math.pow(predefinedPoints[i].r - predefinedPoints[i].t, 2)/2)*(Math.pow((predefinedPoints[i].x + (4*(predefinedPoints[i].r - predefinedPoints[i].t)*Math.sin(aa*predefinedPoints[i].angle/2)/(3*aa*predefinedPoints[i].angle))*Math.cos(aa*(predefinedPoints[i].rotation + predefinedPoints[i].angle/2))) - predefinedPoints[i].x, 2) - Math.pow((predefinedPoints[i].x + (4*(predefinedPoints[i].r - predefinedPoints[i].t)*Math.sin(aa*predefinedPoints[i].angle/2)/(3*aa*predefinedPoints[i].angle))*Math.cos(aa*(predefinedPoints[i].rotation + predefinedPoints[i].angle/2))) - a,2)));

            sw = sw + aa*predefinedPoints[i].angle*(predefinedPoints[i].r - 0.596*thickness)

            ol = ol + aa*predefinedPoints[i].angle*(2*predefinedPoints[i].r - thickness);
            acs = acs + (aa*predefinedPoints[i].angle)*(Math.pow(predefinedPoints[i].r, 2) - Math.pow(predefinedPoints[i].r - predefinedPoints[i].t,2))/2;
        }
    }
    ol = ol + 2*thickness;
    
    Ix = ((Ix*Math.pow(mx, 4))/(10000*Math.pow(ratio, 4))).toFixed(3);
    Iy = ((Iy*Math.pow(mx, 4))/(10000*Math.pow(ratio, 4))).toFixed(3);
    sw = ((sw*mx)/ratio).toFixed(3);
    ol = ((ol*mx)/ratio).toFixed(3);
    acs = ((acs*Math.pow(mx, 2))/(Math.pow(ratio, 2))).toFixed(3);
  return {Ix, Iy, sw, ol, acs};
}