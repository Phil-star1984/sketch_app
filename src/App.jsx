import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineBrushWidth, setLineBrushWidth] = useState(5);
  /* const [isChecked, setIsChecked] = useState(true); */

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = lineBrushWidth;
    contextRef.current = context;
  }, [lineBrushWidth]);

  const getCoordinates = (event) => {
    if (event.type.includes("mouse")) {
      return { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
    } else {
      const touch = event.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
  };

  const startDrawing = (event) => {
    event.preventDefault();
    const { x, y } = getCoordinates(event);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const finishDrawing = (event) => {
    event.preventDefault();
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (event) => {
    if (!isDrawing) {
      return;
    }
    event.preventDefault();
    const { x, y } = getCoordinates(event);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const handleBrushChange = (newWidth) => {
    setLineBrushWidth(newWidth);
  };

  return (
    <>
      <div className="header">
        <div className="logo">
          <h3>Millionpainter</h3>
        </div>

        <div>
          <label>
            Stroke
            <input
              type="radio"
              name="brushWidth"
              checked={lineBrushWidth === 5}
              onChange={() => handleBrushChange(5)}
            />
            Light
          </label>
          <label>
            <input
              type="radio"
              name="brushWidth"
              checked={lineBrushWidth === 15}
              onChange={() => handleBrushChange(15)}
            />
            Bold
          </label>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        style={{ backgroundColor: "#f9a1ff", width: "100%", height: "100vh" }}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={finishDrawing}
        onTouchMove={draw}
      ></canvas>
    </>
  );
}

export default App;
