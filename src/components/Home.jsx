import { useState, useRef, useEffect } from "react";
import { CirclePicker } from "react-color";
import { Link } from "react-router-dom";
/* import { downloadCanvas } from "../utils/utils.js"; */
import { useCanvasSender } from "../hooks/useCanvasSender.js";

function Home() {
  const { sendingSketch, sendCanvasToServer, downloadCanvas } =
    useCanvasSender();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineBrushWidth, setLineBrushWidth] = useState(5);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState("white");

  const [eraserEnabled, setEraserEnabled] = useState(false);

  // Festgelegte Farben für den CirclePicker
  const customColors = ["#b0daff", "#ffeb33", "#f9a1ff"];

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
    context.lineJoin = "bevel";
    context.lineWidth = lineBrushWidth;

    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = lineBrushWidth; // Aktualisiere nur die lineWidth
    }
  }, [lineBrushWidth]); // Füge eine neue useEffect für die lineBrushWidth hinzu

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

  const handleColorChange = (color) => {
    setCanvasBackgroundColor(color.hex);
  };

  const toggleEraser = () => {
    setEraserEnabled(!eraserEnabled);
    if (!eraserEnabled) {
      contextRef.current.globalCompositeOperation = "destination-out";
      contextRef.current.lineWidth = lineBrushWidth; // You can adjust the size of the eraser
    } else {
      contextRef.current.globalCompositeOperation = "source-over"; // Reset to default composite operation
      contextRef.current.lineWidth = lineBrushWidth;
    }
  };

  const clearCanvas = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="header">
        <div className="logo">
          <p>Millionpainter</p>
        </div>

        <div className="options">
          <div className="brush_options">
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
            <label className="eraser_option">
              <input
                type="checkbox"
                ckecked={eraserEnabled.toString()}
                onChange={toggleEraser}
              />
              Eraser
            </label>
          </div>
          <CirclePicker
            color={canvasBackgroundColor || "defaultColor"}
            onChangeComplete={handleColorChange}
            colors={customColors}
            width="72px"
            circleSize={18}
            circleSpacing={6}
          />
          <div className="processing_options">
            <button className="clear_canvas_button" onClick={clearCanvas}>
              Clear
            </button>
            <button className="download_canvas_button" onClick={downloadCanvas}>
              Save
            </button>
            <Link to="/sketches">
              <button className="all_sketches_button">All</button>
            </Link>
            <button className="send_canvas_button" onClick={sendCanvasToServer}>
              Publish
            </button>
          </div>
        </div>
      </div>
      {sendingSketch && (
        <div className="sending_sketch_container">
          <p>Sending Sketch</p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          backgroundColor: `${canvasBackgroundColor}`,
          width: "100%",
          height: "100vh",
        }}
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

export default Home;
