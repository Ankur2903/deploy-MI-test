import React from 'react'

const Liney = ({x1, x2,y1,y2,text,val, textHeight}) => {
    const arrowSize = 2;
  return (
    <>
       <line
          x1={x1}
          y1={y1 + arrowSize}
          x2={x2}
          y2={y2-arrowSize}
          stroke="blue"
          strokeWidth= {1}
        />
        <polygon
          points={`
            ${x1},${y1} 
            ${x1-arrowSize},${y1 + arrowSize} 
            ${x1+arrowSize},${y1 + arrowSize}
          `}
          fill="blue"
        />
        <polygon
          points={`
            ${x2},${y2} 
            ${x2-arrowSize},${y2 - arrowSize} 
            ${x2+arrowSize},${y2 - arrowSize}
          `}
          fill="blue"
        />
        <text
          x={(x1 + x2) / 2 +  textHeight}
          y={(y1+y2)/2 }
          fill="blue"
          fontSize= {5}
          textAnchor="middle"
        >
          {text} = {val} mm
        </text>
    </>
  );
};

export default Liney
