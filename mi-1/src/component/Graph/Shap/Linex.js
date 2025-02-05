import React from 'react'

const Linex = ({x1, x2,y1,y2,text,val, textHeight, unit}) => {
    const arrowSize = 2;
  return (
    <>
       <line
          x1={x1 + arrowSize}
          y1={y1}
          x2={x2 - arrowSize}
          y2={y2}
          stroke="blue"
          strokeWidth= {1}
        />
        <polygon
          points={`
            ${arrowSize + x1},${y1 - arrowSize} 
            ${arrowSize + x1},${y1 + arrowSize} 
            ${x1},${y1}
          `}
          fill="blue"
        />
        <polygon
          points={`
            ${x2 - arrowSize},${y2 - arrowSize} 
            ${x2 - arrowSize},${y2 + arrowSize} 
            ${x2},${y2}
          `}
          fill="blue"
        />
        <text
          x={(x1 + x2) / 2}
          y={(y1+y2)/2 + textHeight}
          fill="blue"
          fontSize= {5}
          textAnchor="middle"
        >
          {text} = {val} {unit ? unit: 'mm'}
        </text>
    </>
  );
};

export default Linex;
