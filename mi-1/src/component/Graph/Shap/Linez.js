import React from 'react'

const Linez = ({x1,y1,thickness,text,val, textHeight}) => {
    const arrowSize = 2;
  return (
    <>
       <line
          x1={x1-8}
          y1= {y1}
          x2={x1 - arrowSize}
          y2= {y1}
          stroke="blue"
          strokeWidth= {1}
        /><line
          x1={x1 + thickness + arrowSize}
          y1= {y1}
          x2={x1 + 8 + thickness}
          y2= {y1}
          stroke="blue"
          strokeWidth= {1}
        />

          <polygon
          points={`
            ${x1},${y1}
            ${x1 - arrowSize},${y1 + arrowSize} 
            ${x1 - arrowSize},${y1 - arrowSize}
          `}
          fill="blue"
        />

          <polygon
          points={`
            ${x1 + thickness},${y1}
            ${x1 + arrowSize + thickness},${y1 + arrowSize} 
            ${x1 + arrowSize + thickness},${y1 - arrowSize}
          `}
          fill="blue"
        />

          <text
          x={x1/2 + textHeight}
          y={y1-5}
          fill="blue"
          fontSize={5}
          textAnchor="middle"
        >
          {text} = {val} mm
        </text>
    </>
  );
};

export default Linez;