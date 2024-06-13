import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import downloadjs from "downloadjs";
import { CirclePicker } from "react-color";
import axios from "axios";

function Home() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineBrushWidth, setLineBrushWidth] = useState(5);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState("#f2f2f2");

  // Festgelegte Farben für den CirclePicker
  const customColors = ["#b0daff", "#bafab4", "#f9a1ff"];

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

  const downloadCanvas = async (event) => {
    event.preventDefault();
    console.log(canvasRef.current);
    const canvas = await html2canvas(document.body);
    const dataURL = canvas.toDataURL("image/jpeg", 1.0);
    downloadjs(dataURL, "MillionPainterSketch.jpg", "image/jpeg");
  };

  const handleColorChange = (color, event) => {
    setCanvasBackgroundColor(color.hex);
  };

  const sendCanvasToServer = async (event) => {
    event.preventDefault();
    const serverURL = import.meta.env.VITE_SERVER_BASE + "/skizzen";

    // Verwende html2canvas, um das Bild zu erfassen
    html2canvas(document.body, {
      scale: 0.7,
    }).then((canvas) => {
      canvas.toBlob(
        async (blob) => {
          const formData = new FormData();
          formData.append("image", blob, "MillionPainterSketch.jpg");

          try {
            const response = await axios.post(serverURL, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            console.log("Bild erfolgreich gesendet:", response.data);
          } catch (error) {
            console.error("Fehler beim Senden des Bildes:", error);
          }
        },
        "image/jpeg",
        0.8
      );
    });
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
          </div>
          <CirclePicker
            color={canvasBackgroundColor}
            onChangeComplete={handleColorChange}
            colors={customColors}
            width="72px"
            circleSize={18}
            circleSpacing={6}
          />
          <button className="download_canvas_button" onClick={downloadCanvas}>
            Save
          </button>
          <button className="send_canvas_button" onClick={sendCanvasToServer}>
            Send
          </button>
        </div>
      </div>
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
