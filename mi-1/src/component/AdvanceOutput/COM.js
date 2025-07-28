export function COM(predefinedPoints) {
    let a = 0;
    let b = 0;
    let sum = 0;
    const aa = Math.PI/180;
    for(let i = 0;i< predefinedPoints.length;i++){
        if(predefinedPoints[i].type === 'line'){
            sum = sum + predefinedPoints[i].w * predefinedPoints[i].h;
            a = a + (predefinedPoints[i].x - predefinedPoints[i].h*Math.sin(aa*predefinedPoints[i].angle)/2 + predefinedPoints[i].w*Math.cos(aa*predefinedPoints[i].angle)/2)*(predefinedPoints[i].w*predefinedPoints[i].h);
            b = b + (predefinedPoints[i].y + predefinedPoints[i].h*Math.cos(aa*predefinedPoints[i].angle)/2 + predefinedPoints[i].w*Math.sin(aa*predefinedPoints[i].angle)/2)*(predefinedPoints[i].w*predefinedPoints[i].h);
        }
        else{
            sum = sum + aa*predefinedPoints[i].angle*predefinedPoints[i].r*predefinedPoints[i].r;
            a = a + (predefinedPoints[i].x + (4*predefinedPoints[i].r*Math.sin(aa*predefinedPoints[i].angle/2)/(3*aa*predefinedPoints[i].angle))*Math.cos(aa*(predefinedPoints[i].rotation + predefinedPoints[i].angle/2)))*(aa*predefinedPoints[i].angle*predefinedPoints[i].r*predefinedPoints[i].r);
            b = b + (predefinedPoints[i].y +(4*predefinedPoints[i].r*Math.sin(aa*predefinedPoints[i].angle/2)/(3*aa*predefinedPoints[i].angle))*Math.sin(aa*(predefinedPoints[i].rotation + predefinedPoints[i].angle/2)))*(aa*predefinedPoints[i].angle*predefinedPoints[i].r*predefinedPoints[i].r);
        }
    }
    a = (a/sum).toFixed(2);
    b = (b/sum).toFixed(2);
  return {a, b};
}