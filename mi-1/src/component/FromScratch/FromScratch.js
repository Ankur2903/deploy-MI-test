import React, { useState, useCallback, useEffect ,useRef} from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../../App.css'
import CircleSector from '../Graph/Shap/Circle';
import 'jspdf-autotable';
import logo from '../Image/logo.192.jpg'
import LineAtTheta from '../Graph/Shap/LineAtθ';

const FromScratch = () => {
  const [viewBox, setViewBox] = useState('0 0 200 200');
  const [isDragging, setIsDragging] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [click,setClick] = useState(0);
  const [no, setno] = useState(0);
  const [points, setPoints] = useState([]);
  const [distance, setDistance] = useState(null);
  const [dimensioning, setDimensioning] = useState(false)

  const [startX, setStartX] = useState(30);
  const [startY, setStartY] = useState(30);
  const [endX, setEndX] = useState(60);
  const [endY, setEndY] = useState(60);

  const [newShapeType, setNewShapeType] = useState(null);
  const [newShapeLength, setNewShapeLength] = useState(60);//Used for rectangle width
  const [newShapeRadius, setNewShapeRadius] = useState(10); // Used for circle radius
  const [newShapeAngle, setNewShapeAngle] = useState(90); // Used for circle radius

  const [shapes, setShapes] = useState([]);
  const [thickness, setThickness] = useState(2);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [shapeLength, setShapeLength] = useState(100); // Rectangle shape edit state
  const [shapeRadius, setShapeRadius] = useState(50); // Circle shape edit state
  const [shapeAngle, setShapeAngle] = useState(90); // Used for circle radius
  const [stripWidth, setStripWidth] = useState(0);
  const [crossSection, setCrossSection] = useState(0);
  const [weightPerLength, setWeightPerLength] = useState(0);
  const [length, setLength] = useState(6);
  const [totalWeight, setTotalWeight] = useState(0)
  const [outLine, setOutLine] = useState(0)

  const handleSVGClick = (event) => {
    if(!dimensioning) return;
    const svg = event.target.closest('svg');
    const { left, top, width, height } = svg.getBoundingClientRect();

    const viewBox = svg.viewBox.baseVal;
    const scaleX = viewBox.width / width;  
    const scaleY = viewBox.height / height;

    const newPoint = {
      x: (event.clientX - left)*scaleX + viewBox.x ,
      y: (event.clientY - top)*scaleY + viewBox.y,
    };
    if (points.length === 1) {
      const p1 = points[0];
      const p2 = newPoint;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const calculatedDistance = Math.sqrt(dx * dx + dy * dy).toFixed(2);
      setDistance(calculatedDistance);
    }
    setPoints((prevPoints) => prevPoints.length === 1 ? [prevPoints[0], newPoint] : [newPoint]);
  };

  const addShape = () => {
    const newShape = {
      id: shapes.length + 1,
      type: newShapeType,
      length: newShapeLength,
      radius: newShapeRadius,
      angle: newShapeAngle,
      color: "black",

      stripwidth: (shapes.length === 0 && newShapeType === "Line") ? newShapeLength :
      (shapes.length === 0) ? Math.PI*(newShapeRadius - 0.596*thickness)*(newShapeAngle/180) :
      (newShapeType === "Line") ? shapes[shapes.length - 1].stripwidth + newShapeLength : shapes[shapes.length - 1].stripwidth + Math.PI*(newShapeRadius - 0.596*thickness)*(newShapeAngle/180),

      outline: (shapes.length === 0 && newShapeType === "Line") ? 2*newShapeLength :
      (shapes.length === 0) ? Math.PI*(newShapeRadius)*(newShapeAngle/180) + Math.PI*(newShapeRadius - thickness)*(newShapeAngle/180) :
      (newShapeType === "Line") ? shapes[shapes.length - 1].outline + 2*newShapeLength : shapes[shapes.length - 1].outline + Math.PI*(newShapeRadius)*(newShapeAngle/180),

      anglefromx: (shapes.length === 0) ? 0 : (shapes[shapes.length - 1].type === "Line") ? shapes[shapes.length - 1].anglefromx : (shapes[shapes.length - 1].type === "clockwise") ? (360 + shapes[shapes.length - 1].anglefromx + shapes[shapes.length - 1].angle)%360 : (360 + shapes[shapes.length - 1].anglefromx - shapes[shapes.length - 1].angle)%360,

      x: (shapes.length ===0 ) ? 30 : 
      (shapes[shapes.length - 1].type === "Line" && newShapeType === "Line") ?  shapes[shapes.length - 1].x + shapes[shapes.length - 1].length*Math.cos((Math.PI/180)*(shapes[shapes.length - 1].anglefromx)) : 
      (shapes[shapes.length - 1].type === "Line" && newShapeType === "clockwise") ? shapes[shapes.length - 1].x  + shapes[shapes.length - 1].length*Math.cos((Math.PI/180)*(shapes[shapes.length - 1].anglefromx))  - newShapeRadius*Math.sin((Math.PI/180)*(shapes[shapes.length - 1].anglefromx)):
      (shapes[shapes.length - 1].type === "Line" && newShapeType === "anticlockwise") ? shapes[shapes.length - 1].x  + shapes[shapes.length - 1].length*Math.cos((Math.PI/180)*(shapes[shapes.length - 1].anglefromx))  + (newShapeRadius - thickness)*Math.sin((Math.PI/180)*(shapes[shapes.length - 1].anglefromx)) : 
      (shapes[shapes.length - 1].type === "clockwise" && newShapeType === "Line") ? shapes[shapes.length - 1].x + shapes[shapes.length - 1].radius*Math.cos((Math.PI/180)*(90 - (shapes[shapes.length - 1].anglefromx + shapes[shapes.length - 1].angle))) :
      (shapes[shapes.length - 1].type === "clockwise" && newShapeType === "clockwise") ? shapes[shapes.length - 1].x :
      (shapes[shapes.length - 1].type === "clockwise" && newShapeType === "anticlockwise") ? shapes[shapes.length - 1].x + (shapes[shapes.length - 1].radius + newShapeRadius - thickness)*Math.cos((Math.PI/180)*(90 - (shapes[shapes.length - 1].anglefromx + shapes[shapes.length - 1].angle))) :
      (shapes[shapes.length - 1].type === "anticlockwise" && newShapeType === "Line") ? shapes[shapes.length - 1].x + (shapes[shapes.length - 1].radius - thickness)*Math.cos((Math.PI/180)*(90 - shapes[shapes.length - 1].angle + shapes[shapes.length - 1].anglefromx)) : 
      (shapes[shapes.length - 1].type === "anticlockwise" && newShapeType === "clockwise") ? shapes[shapes.length - 1].x + (shapes[shapes.length - 1].radius + newShapeRadius - thickness)*Math.cos((Math.PI/180)*(90 - shapes[shapes.length - 1].angle + shapes[shapes.length - 1].anglefromx)) : 
      (shapes[shapes.length - 1].type === "anticlockwise" && newShapeType === "anticlockwise") ? shapes[shapes.length - 1].x : 0,
      

      y: (shapes.length ===0) ? 30 : 
      (shapes[shapes.length - 1].type === "Line" && newShapeType === "Line") ? shapes[shapes.length - 1].y + shapes[shapes.length - 1].length*Math.sin((Math.PI/180)*(shapes[shapes.length - 1].anglefromx)) : 
      (shapes[shapes.length - 1].type === "Line" && newShapeType === "clockwise") ? shapes[shapes.length - 1].y  + shapes[shapes.length - 1].length*Math.sin((Math.PI/180)*(shapes[shapes.length - 1].anglefromx))  + newShapeRadius*Math.cos((Math.PI/180)*(shapes[shapes.length - 1].anglefromx)) : 
      (shapes[shapes.length - 1].type === "Line" && newShapeType === "anticlockwise") ? shapes[shapes.length - 1].y  + shapes[shapes.length - 1].length*Math.sin((Math.PI/180)*(shapes[shapes.length - 1].anglefromx))  - (newShapeRadius - thickness)*Math.cos((Math.PI/180)*(shapes[shapes.length - 1].anglefromx)) : 
      (shapes[shapes.length - 1].type === "clockwise" && newShapeType === "Line") ? shapes[shapes.length - 1].y - shapes[shapes.length - 1].radius*Math.sin((Math.PI/180)*(90 - (shapes[shapes.length - 1].anglefromx + shapes[shapes.length - 1].angle))) : 
      (shapes[shapes.length - 1].type === "clockwise" && newShapeType === "clockwise") ? shapes[shapes.length - 1].y :
      (shapes[shapes.length - 1].type === "clockwise" && newShapeType === "anticlockwise") ? shapes[shapes.length - 1].y - (shapes[shapes.length - 1].radius + newShapeRadius - thickness)*Math.sin((Math.PI/180)*(90 - (shapes[shapes.length - 1].anglefromx + shapes[shapes.length - 1].angle))) : 
      (shapes[shapes.length - 1].type === "anticlockwise" && newShapeType === "Line") ? shapes[shapes.length - 1].y + (shapes[shapes.length - 1].radius - thickness)*Math.sin((Math.PI/180)*(90 - shapes[shapes.length - 1].angle + shapes[shapes.length - 1].anglefromx)) : 
      (shapes[shapes.length - 1].type === "anticlockwise" && newShapeType === "clockwise") ? shapes[shapes.length - 1].y + (shapes[shapes.length - 1].radius + newShapeRadius - thickness)*Math.sin((Math.PI/180)*(90 - shapes[shapes.length - 1].angle + shapes[shapes.length - 1].anglefromx)) : 
      (shapes[shapes.length - 1].type === "anticlockwise" && newShapeType === "anticlockwise") ? shapes[shapes.length - 1].y : 0,
    };

    newShape.startx = 
    (newShape.type === 'Line') ? Math.min(startX , newShape.x + newShape.length*Math.cos((Math.PI/180)*(newShape.anglefromx))) : 
    (newShape.type === 'clockwise' && (newShape.anglefromx<=270 && newShape.angle + newShape.anglefromx >= 270)) ?  Math.min(startX , newShape.x - newShape.radius) : Math.min(startX , newShape.x + newShape.radius*Math.cos((Math.PI/180)*(90 - newShape.anglefromx - newShape.angle)));


    newShape.endx = 
    (newShape.type === 'Line') ? Math.max(endX , newShape.x + newShape.length*Math.cos((Math.PI/180)*(newShape.anglefromx))) : 
    (newShape.type === 'clockwise' && (newShape.anglefromx<=90 && newShape.angle + newShape.anglefromx >= 90)) ?  Math.max(endX , newShape.x + newShape.radius) : Math.max(endX , newShape.x + newShape.radius*Math.cos((Math.PI/180)*(90 - newShape.anglefromx - newShape.angle)));

    newShape.starty =
    (newShape.type === 'Line') ? Math.min(startY , newShape.y + newShape.length*Math.sin((Math.PI/180)*(newShape.anglefromx))) : 
    (newShape.type === 'clockwise' && (newShape.anglefromx<=360 && newShape.angle + newShape.anglefromx >= 0)) ?  Math.min(startY , newShape.y - newShape.radius) : Math.min(startY , newShape.y + newShape.radius*Math.cos((Math.PI/180)*(90 - newShape.anglefromx - newShape.angle)));


    newShape.endy = 
    (newShape.type === 'Line') ? Math.max(endY , newShape.y + newShape.length*Math.sin((Math.PI/180)*(newShape.anglefromx))) : 
    (newShape.type === 'clockwise' && (newShape.anglefromx<=180 && newShape.angle + newShape.anglefromx >= 180)) ?  Math.max(endY , newShape.y + newShape.radius) : Math.max(endY , newShape.y + newShape.radius*Math.cos((Math.PI/180)*(90 - newShape.anglefromx - newShape.angle)));

    setShapes([...shapes, newShape]);
    console.log(shapes.length);

    setStartX(Math.min(startX,newShape.startx));
    setStartY(Math.min(startY,newShape.starty));
    setEndX(Math.max(endX , newShape.endx));
    setEndY(Math.max(endY,newShape.endy))

    setNewShapeType(null);
    setno(0);
  };

  const removeShape =()=>{
    setShapes(prevArray => prevArray.slice(0, -1));
    setStartX((shapes.length > 1) ? shapes[shapes.length - 2].startx :30);
    setStartY((shapes.length > 1) ? shapes[shapes.length - 2].starty :30);
    setEndX((shapes.length > 1) ? shapes[shapes.length - 2].endx :60)
    setEndY((shapes.length > 1) ? shapes[shapes.length - 2].endy :60)
  }

  const resetClick = () => {
    setShapes([]);
  }
  

  useEffect(() => {
    const newWidth =  (endX - startX)/ scale;
    const newHeight = (endY - startY)/ scale;
    setViewBox(`${startX - 30} ${startY - 30} ${Math.max(newWidth,newHeight) + 60} ${Math.max(newWidth,newHeight) + 60}`);
  }, [startX, startY, endX, endY])

  const thicknessChange = async(e) => {
    setThickness(parseFloat(e.target.value));
  }

  useEffect(() => {
    for (let i = 0; i < shapes.length; i++) {
      shapes[i].x = (i === 0) ? 50 :
        (shapes[i - 1].type === "Line" && shapes[i].type === "Line") ? shapes[i - 1].x + shapes[i - 1].length * Math.cos((Math.PI / 180) * (shapes[i - 1].anglefromx)) :
        (shapes[i - 1].type === "Line" && shapes[i].type === "clockwise") ? shapes[i - 1].x + shapes[i - 1].length * Math.cos((Math.PI / 180) * (shapes[i - 1].anglefromx)) - newShapeRadius * Math.sin((Math.PI / 180) * (shapes[i - 1].anglefromx)) :
        (shapes[i - 1].type === "Line" && shapes[i].type === "anticlockwise") ? shapes[i - 1].x + shapes[i - 1].length * Math.cos((Math.PI / 180) * (shapes[i - 1].anglefromx)) + (newShapeRadius - thickness) * Math.sin((Math.PI / 180) * (shapes[i - 1].anglefromx)) :
        (shapes[i - 1].type === "clockwise" && shapes[i].type === "Line") ? shapes[i - 1].x + shapes[i - 1].radius * Math.cos((Math.PI / 180) * (90 - (shapes[i - 1].anglefromx + shapes[i - 1].angle))) :
        (shapes[i - 1].type === "clockwise" && shapes[i].type === "clockwise") ? shapes[i - 1].x :
        (shapes[i - 1].type === "clockwise" && shapes[i].type === "anticlockwise") ? shapes[i - 1].x + (shapes[i - 1].radius + newShapeRadius - thickness) * Math.cos((Math.PI / 180) * (90 - (shapes[i - 1].anglefromx + shapes[i - 1].angle))) :
        (shapes[i - 1].type === "anticlockwise" && shapes[i].type === "Line") ? shapes[i - 1].x + (shapes[i - 1].radius - thickness) * Math.cos((Math.PI / 180) * (90 - shapes[i - 1].angle + shapes[i - 1].anglefromx)) :
        (shapes[i - 1].type === "anticlockwise" && shapes[i].type === "clockwise") ? shapes[i - 1].x + (shapes[i - 1].radius + newShapeRadius - thickness) * Math.cos((Math.PI / 180) * (90 - shapes[i - 1].angle + shapes[i - 1].anglefromx)) :
        (shapes[i - 1].type === "anticlockwise" && shapes[i].type === "anticlockwise") ? shapes[i - 1].x : 0;

      shapes[i].y = (i === 0) ? 50 :
        (shapes[i - 1].type === "Line" && shapes[i].type === "Line") ? shapes[i - 1].y + shapes[i - 1].length * Math.sin((Math.PI / 180) * (shapes[i - 1].anglefromx)) :
        (shapes[i - 1].type === "Line" && shapes[i].type === "clockwise") ? shapes[i - 1].y + shapes[i - 1].length * Math.sin((Math.PI / 180) * (shapes[i - 1].anglefromx)) + newShapeRadius * Math.cos((Math.PI / 180) * (shapes[i - 1].anglefromx)) :
        (shapes[i - 1].type === "Line" && shapes[i].type === "anticlockwise") ? shapes[i - 1].y + shapes[i - 1].length * Math.sin((Math.PI / 180) * (shapes[i - 1].anglefromx)) - (newShapeRadius - thickness) * Math.cos((Math.PI / 180) * (shapes[i - 1].anglefromx)) :
        (shapes[i - 1].type === "clockwise" && shapes[i].type === "Line") ? shapes[i - 1].y - shapes[i - 1].radius * Math.sin((Math.PI / 180) * (90 - (shapes[i - 1].anglefromx + shapes[i - 1].angle))) :
        (shapes[i - 1].type === "clockwise" && shapes[i].type === "clockwise") ? shapes[i - 1].y :
        (shapes[i - 1].type === "clockwise" && shapes[i].type === "anticlockwise") ? shapes[i - 1].y - (shapes[i - 1].radius + newShapeRadius - thickness) * Math.sin((Math.PI / 180) * (90 - (shapes[i - 1].anglefromx + shapes[i - 1].angle))) :
        (shapes[i - 1].type === "anticlockwise" && shapes[i].type === "Line") ? shapes[i - 1].y + (shapes[i - 1].radius - thickness) * Math.sin((Math.PI / 180) * (90 - shapes[i - 1].angle + shapes[i - 1].anglefromx)) :
        (shapes[i - 1].type === "anticlockwise" && shapes[i].type === "clockwise") ? shapes[i - 1].y + (shapes[i - 1].radius + newShapeRadius - thickness) * Math.sin((Math.PI / 180) * (90 - shapes[i - 1].angle + shapes[i - 1].anglefromx)) :
        (shapes[i - 1].type === "anticlockwise" && shapes[i].type === "anticlockwise") ? shapes[i - 1].y : 0;

        shapes[i].startx = 
        (shapes[i].type === 'Line') ? Math.min(startX , shapes[i].x + shapes[i].length*Math.cos((Math.PI/180)*(shapes[i].anglefromx))) : 
        (shapes[i].type === 'clockwise' && (shapes[i].anglefromx<=270 && shapes[i].angle + shapes[i].anglefromx >= 270)) ?  Math.min(startX , shapes[i].x - shapes[i].radius) : Math.min(startX , shapes[i].x + shapes[i].radius*Math.cos((Math.PI/180)*(90 - shapes[i].anglefromx - shapes[i].angle)));

        shapes[i].endx = 
        (shapes[i].type === 'Line') ? Math.max(endX , shapes[i].x + shapes[i].length*Math.cos((Math.PI/180)*(shapes[i].anglefromx))) : 
        (shapes[i].type === 'clockwise' && (shapes[i].anglefromx<=90 && shapes[i].angle + shapes[i].anglefromx >= 90)) ?  Math.max(endX , shapes[i].x + shapes[i].radius) : Math.max(endX , shapes[i].x + shapes[i].radius*Math.cos((Math.PI/180)*(90 - shapes[i].anglefromx - shapes[i].angle)));

        shapes[i].starty =
        (shapes[i].type === 'Line') ? Math.min(startY , shapes[i].y + shapes[i].length*Math.sin((Math.PI/180)*(shapes[i].anglefromx))) : 
        (shapes[i].type === 'clockwise' && (shapes[i].anglefromx<=360 && shapes[i].angle + shapes[i].anglefromx >= 0)) ?  Math.min(startY , shapes[i].y - shapes[i].radius) : Math.min(startY , shapes[i].y + shapes[i].radius*Math.cos((Math.PI/180)*(90 - shapes[i].anglefromx - shapes[i].angle)));

        shapes[i].endy = 
        (shapes[i].type === 'Line') ? Math.max(endY , shapes[i].y + shapes[i].length*Math.sin((Math.PI/180)*(shapes[i].anglefromx))) : 
        (shapes[i].type === 'clockwise' && (shapes[i].anglefromx<=180 && shapes[i].angle + shapes[i].anglefromx >= 180)) ?  Math.max(endY , shapes[i].y + shapes[i].radius) : Math.max(endY , shapes[i].y + shapes[i].radius*Math.cos((Math.PI/180)*(90 - shapes[i].anglefromx - shapes[i].angle)));

        setStartX(Math.min(startX,shapes[i].startx));
        setStartY(Math.min(startY,shapes[i].starty));
        setEndX(Math.max(endX , shapes[i].endx));
        setEndY(Math.max(endY,shapes[i].endy))
    }
    setShapes([...shapes]);
  }, [thickness, click]);


  const selectShape = (id) => {
    if(dimensioning)  return
    const selectedShape = shapes.find(shape => shape.id === id);
    if(selectedShapeId !==null) shapes[shapes.findIndex((shape) => shape.id === selectedShapeId)].color = "black"
    selectedShape.color = "red";
    setSelectedShapeId(id);
    if (selectedShape.type === 'Line') {
      setShapeLength(selectedShape.length);
    } 
    else{
      setShapeRadius(selectedShape.radius); 
      setShapeAngle(selectedShape.angle); 
    }
  };

  const updateDimensions = () => {
    for(let i = 0;i < shapes.length;i++){
        shapes[i].length = 
        (shapes[i].id === selectedShapeId) ? shapeLength : shapes[i].length;

        shapes[i].radius = 
        (shapes[i].id === selectedShapeId) ? shapeRadius : shapes[i].radius;

        shapes[i].angle = 
        (shapes[i].id === selectedShapeId) ? shapeAngle : shapes[i].angle;

        shapes[i].color = 
        (shapes[i].id === selectedShapeId) ? "black" : shapes[i].color;
    }
    setClick(1 - click)
    setSelectedShapeId(null)
  };

  const clickOndimensioning = ()=> {
    setSelectedShapeId(null)
    setDimensioning(!dimensioning);
    setPoints([])
    if(selectedShapeId !==null) shapes[shapes.findIndex((shape) => shape.id === selectedShapeId)].color = "black"
  }

  const submitClick = () => {
    setStripWidth((shapes[shapes.length-1].stripwidth).toFixed(2));
    setCrossSection((shapes[shapes.length-1].stripwidth*thickness).toFixed(2));
    setWeightPerLength((7850*(shapes[shapes.length-1].stripwidth*thickness)*0.000001).toFixed(2))
    setTotalWeight((7850*(shapes[shapes.length-1].stripwidth*thickness)*length*0.000001).toFixed(2))
    setOutLine((shapes[shapes.length-1].outline + 2*thickness).toFixed(2))
  }

  const handlePan = useCallback((dx, dy) => {
    setViewBox((prevViewBox) => {
      const [x, y, w, h] = prevViewBox.split(' ').map(Number);
      return `${x - dx} ${y - dy} ${w} ${h}`;
    });
  }, []);

  const startDrag = (x, y) => {
    setIsDragging(true);
    setStartCoords({ x, y });
  };

  const handleDrag = (x, y) => {
    if (isDragging) {
      const dx = x - startCoords.x;
      const dy = y - startCoords.y;
      handlePan(dx, dy);
      setStartCoords({ x, y });
    }
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (event) => {
    startDrag(event.clientX, event.clientY);
  };

  const handleMouseMove = (event) => {
    handleDrag(event.clientX, event.clientY);
  };

  const handleMouseUp = () => {
    stopDrag();
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    handleDrag(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    stopDrag();
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, startCoords, handlePan]);

  const zoomIn = () => {
    setScale((prevScale) => prevScale * 1.2);
  };

  const zoomOut = () => {
    setScale((prevScale) => prevScale / 1.2);
  };
  const resetZoom = () => {
    setScale(1); // Reset scale to initial state
    const newWidth =  (endX - startX)/ scale;
    const newHeight = (endY - startY)/ scale;
    setViewBox(`${startX - 30} ${startY - 30} ${Math.max(newWidth,newHeight) + 60} ${Math.max(newWidth,newHeight) + 60}`);
  };
  
  const updateViewBox = () => {
    const newWidth =  (endX - startX)/ scale;
    const newHeight = (endY - startY)/ scale;
    setViewBox(`${startX - 30} ${startY - 30} ${Math.max(newWidth,newHeight) + 60} ${Math.max(newWidth,newHeight) + 60}`);
  };

  useEffect(() => {
    updateViewBox();
  }, [scale]);

  const cChannelGraphRef = useRef()
  const handleDownload = () => {
    const doc = new jsPDF();
    html2canvas(cChannelGraphRef.current).then((canvas) => {
    doc.setDrawColor("black").setLineWidth(.2).line(4,0,4,300);
    doc.addImage(logo, 'PNG', 75, 2, 60, 10);
    doc.setFont('helvetica',"bold").setFontSize(16).setTextColor('blue').text('Section Characteristics Report', 70, 17);
    doc.setDrawColor("black").setLineWidth(.2).line(0,20,210,20);
    doc.setFont('helvetica',"bold").setFontSize(12).setTextColor('blue').text('Inputs: ', 6, 25);
    // doc.setFontSize(10).setTextColor('black').text(`Width(w): ${side1}   Height(h): ${side2}   Lip(l): ${side3}   Thickness(t): ${thickness}   Length(L): ${length}`, 6, 30);
    doc.setFontSize(12).setTextColor('blue').text('Image: ', 6, 40);
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 70, 50, 70, 70); // Adjust dimensions as needed
    doc.setFontSize(12).setTextColor('blue').text('Standard Output: ', 90,130);
    const rows1 = [
      ["Weight per meter", `${weightPerLength} Kg/m`, "Weight of 6m length", `${totalWeight} kg`],
      ["Calculated strip width", `${stripWidth} mm`, "Outline length", `${outLine} mm`],
      ["Area of cross-section", `${(stripWidth*thickness).toFixed(2)} mm^2`, "Inner bend radius(r)", "0 mm"],
    ];
    doc.autoTable({
      body: rows1,
      startY: 135,  // Position from top
    });
    doc.setDrawColor("black").setLineWidth(.2).line(0,165,210,165);
    doc.setFontSize(12).setTextColor('blue').text('Complete Output: ', 90,175);
    const rows2 = [
      ["Center of mass (x)", "at Origin", "Moment of resistance W(y)", "___ cm^3"],
      ["Center of mass (y)", "at Origin", "Moment of resistance W(y)", "___ cm^3"],
      ["Moment of inertia I(x)",  "0 cm^4", "Polar moment of inertia Ip", "___ cm^4"],
      ["Moment of inertia I(y)", "0 cm^4", "Centrifugal moment I(xy)", "___ cm^4"],
      ["Moment of resistance W(v)", `___ cm^3`,"Principal axis angle", "___ deg"],
      ["Radius of gyration i(v)", `___ cm`, "Moment of resistance W(x)", "___ cm^3"],
      ["Radius of gyration i(u)", `___ cm`, "Radius of gyration i(x)", "___ cm"],
      ["Moment of inertia I(u)", `___ cm^4`, "Radius of gyration i(y)", "___ cm"],
      ["Moment of inertia I(v)", `___ cm^4`, "Moment of resistance W(u)", "___ cm^3"],
    ];
    doc.autoTable({
      body: rows2,
      startY: 180,  // Position from top
    });
    doc.save('file.pdf'); // Specify the file name
    });
  };



  return (
    <>
       <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
      <h1 className="heading">1</h1>
      <button style={{marginLeft: 'auto', transform: 'translateX(-35%)'}} onClick={handleDownload}>
      <i class="fa-solid fa-download"></i>
    </button>
    </div>
      <div className = "container">
        
      <div className="box">
        <h3>Input</h3>
        {shapes.length !==0 && 
        <>
        <div className="container1">
          <lable className="label">Thickness: (t) mm</lable>
          <input className="input-field" type="number" value={thickness} onChange={thicknessChange}/>
        </div>
        <div className="container1">
          <lable className="label">Length: (L) mm</lable>
          <input className="input-field" type="number" value={length} onChange={(e) => setLength(Number(e.target.value))}/>
        </div>
        </>
        }
        {selectedShapeId === null && 
        <><h5>Add a New Shape</h5>
        <button className="btn btn mx-2 my-2" style={{backgroundColor: "#fff", border:no===1 ? "2px solid red": "2px solid black"}} type="button" onClick={()=>{setNewShapeType("clockwise"); setno(1)}}><img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Uhrzeigersinn.png" style={{height: "40px"}}/></button>
        <button className="btn btn mx-2 my-2" style={{backgroundColor: "#fff", border:no===2 ? "2px solid red": "2px solid black"}} type="button" onClick={()=>{setNewShapeType("Line"); setno(2)}}><img src="https://i.pinimg.com/originals/66/15/24/661524af491cfda437692eac19eed959.jpg" style={{height: "40px"}}/></button>
        <button className="btn btn mx-2 my-2" style={{backgroundColor: "#fff", border:no===3 ? "2px solid red": "2px solid black"}} type="button" onClick={()=>{setNewShapeType("anticlockwise"); setno(3)}}><img src="https://static.thenounproject.com/png/655477-200.png" style={{height: "40px"}}/></button></>
      }
        
        {newShapeType === 'clockwise' && selectedShapeId === null &&  (
          <>
            <div className="container1">
              <lable className="label">Outer Radius: (r) mm</lable>
              <input className="input-field" type="number" value={newShapeRadius} step="0.01" onChange={(e) => setNewShapeRadius(Number(e.target.value))}/>
             </div>
            <div className="container1">
              <lable className="label">Angle: (θ) degree</lable>
              <input className="input-field" type="number" value={newShapeAngle} step="0.01" onChange={(e) => setNewShapeAngle(Number(e.target.value))}/>
            </div>
            <button type='button' className="btn btn-dark mx-2 my-4" onClick={addShape}>Add Shape</button>

          </>
        )}
        {newShapeType === 'Line' && selectedShapeId === null && (
          <>
            <div className="container1">
              <lable className="label">Length: (l) mm</lable>
              <input className="input-field" type="number" value={newShapeLength} step="0.01" onChange={(e) => setNewShapeLength(Number(e.target.value))}/>
            </div>
            <button type='button' className="btn btn-dark mx-2 my-4" onClick={addShape}>Add Shape</button>

          </>
          
        )}
        {newShapeType === 'anticlockwise' && selectedShapeId === null && (
          <>
          <div className="container1">
            <lable className="label">Outer Radius: (r) mm</lable>
            <input className="input-field" type="number" value={newShapeRadius} step="0.01" onChange={(e) => setNewShapeRadius(Number(e.target.value))}/>
           </div>
          <div className="container1">
            <lable className="label">Angle: (θ) degree</lable>
            <input className="input-field" type="number" value={newShapeAngle} step="0.01" onChange={(e) => setNewShapeAngle(Number(e.target.value))}/>
          </div>
          <button type='button' className="btn btn-dark mx-2 my-4" onClick={addShape}>Add Shape</button>
        </>
        )}
        

      {selectedShapeId !== null && !dimensioning && (
        <div className="controls">
          <h5>Edit Selected Shape</h5>
          {shapes.find(shape => shape.id === selectedShapeId).type !== 'Line' ? (
            <>
              <div className="container1">
              <lable className="label">Outer Radius: (r) mm</lable>
              <input className="input-field" type="number" value={shapeRadius} step="0.01" onChange={(e) => setShapeRadius(Number(e.target.value))}/>
             </div>
            <div className="container1">
              <lable className="label">Angle: (θ) degree</lable>
              <input className="input-field" type="number" value={shapeAngle} step="0.01" onChange={(e) => setShapeAngle(Number(e.target.value))}/>
            </div>
            </>
          ) : (
            <div className="container1">
              <lable className="label">Length: (l) mm</lable>
              <input className="input-field" type="number" value={shapeLength} step="0.01" onChange={(e) => setShapeLength(Number(e.target.value))}/>
            </div>
          )}

          <button type='button' className="btn btn-dark mx-2 my-4" onClick={updateDimensions}>Update Shape</button>
        </div>
      )}

      <div>    
      <button disabled={shapes.length===0 ? true : false} type="button" className="btn btn-dark mx-2 my-4" onClick={submitClick}>Submit</button>
      <button type='button' disabled={(shapes.length ===0 || selectedShapeId === shapes.length) ? true : false} className="btn btn-dark mx-2 my-4" onClick={removeShape}>Remove Shape</button>
      <button disabled={shapes.length===0 ? true : false}  type="button" onClick={resetClick} className="btn btn-dark mx-2 my-4">Reset</button>
      </div>   
      </div>
      
        

        <div className='box'>
        <div ref={cChannelGraphRef}>
        <div style={{ position: 'relative' }}>
        <div className="form-check form-switch">
            <input className="form-check-input" onClick={clickOndimensioning} type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
            <label className="form-check-label" for="flexSwitchCheckDefault">DIMENSIONING FUNCTION</label>
          </div>
          <svg viewBox={viewBox} style={{ width: '100%', height: 'auto', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }} onMouseDown={handleMouseDown} onClick={handleSVGClick} onTouchStart={handleTouchStart}>
              {/* Define grid pattern */}
              <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
              </pattern>
            </defs>
            {/* Apply grid pattern as background */}
            <rect x='-1000' y='-1000' width="2000" height="2000" fill="url(#grid)" />

            {shapes.length>0 && ((shapes[0].type === "Line") ? <LineAtTheta x={shapes[0].x} y={shapes[0].y - 5} w={0.5} h={10 + thickness} angle={0} color={"black"}/> : (shapes[0].type === "clockwise") ? <LineAtTheta x={shapes[0].x} y={shapes[0].y - 5 - shapes[0].radius} w={0.5} h={10 + thickness} angle={0} color={"black"}/>:<LineAtTheta x={shapes[0].x} y={shapes[0].y - 5 + shapes[0].radius - thickness} w={0.5} h={10 + thickness} angle={0} color={"black"}/>)}

            {shapes.map((shape) => (
              (shape.type==="Line") && <a key = {shape.id} onClick={() => selectShape(shape.id)}><LineAtTheta x={shape.x} y={shape.y} w={shape.length} h={thickness} angle={shape.anglefromx} color={shape.color}/></a>
            ))}
            
            {shapes.map((shape) => (
              (shape.type ==="clockwise") && <a key = {shape.id} onClick={() => selectShape(shape.id)}><CircleSector radius={shape.radius} centerX={shape.x} centerY={shape.y} angle={shape.angle} rotation={270 + shape.anglefromx} thickness={thickness}  color={shape.color}/></a>
            ))}

            {shapes.map((shape) => (
              (shape.type ==="anticlockwise") && <a key = {shape.id} onClick={() => selectShape(shape.id)}><CircleSector radius={shape.radius} centerX={shape.x} centerY={shape.y} angle={shape.angle} rotation={90 + shape.anglefromx - shape.angle} thickness={thickness}  color={shape.color}/></a>
            ))}

            {points.map((point, index) => (
              <circle key={index} cx={point.x} cy={point.y} r={2} fill={index === 0 ? "blue" : "red"} />
            ))}

            {points.length === 2 && (<line x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} stroke="black"/>)}

            {points.length === 2 && <text  x={(points[0].x + points[1].x)/2 + 3} y={(points[0].y + points[1].y)/2 - 3} fontSize="4"> {distance} mm</text>}

            </svg>
            <button className='mx-2 my-2' onClick={zoomIn}><i className="fa-solid fa-magnifying-glass-plus"></i></button>
            <button className='mx-2 my-2' onClick={resetZoom}><i className="fa-solid fa-maximize"></i> </button>
            <button className='mx-2 my-2' onClick={zoomOut}> <i className="fa-solid fa-magnifying-glass-minus"></i> </button>
          </div>
          </div>
        </div>
        <div className='box'>
        <div style={{ fontWeight: 'bold', textAlign: 'center'}}><h3>Output</h3></div>
        <p className="output-text"><b>Weight per meter:</b> {weightPerLength} Kg/m</p>
        <p className="output-text"><b>Weight of {length}m length:</b> {totalWeight} Kg</p>
        <p className="output-text"><b>Calculated strip width:</b> {stripWidth} mm</p>
        <p className="output-text"><b>Outline length:</b> {outLine} mm</p>
        <p className="output-text"><b>Area of cross section:</b> {crossSection} mm^2</p>
        </div>
      </div>
    </>
  );
}

export default FromScratch






