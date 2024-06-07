import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

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
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

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
    const { x, y } = getCoordinates(event);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (event) => {
    if (!isDrawing) {
      return;
    }
    const { x, y } = getCoordinates(event);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  return (
    <>
      <div>
        <h2 style={{ textAlign: "center", padding: 0, margin: 10 }}>
          Millionpainter
        </h2>
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
      </div>
    </>
  );
}

export default App;
