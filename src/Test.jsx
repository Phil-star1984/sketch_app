Funktionierende App (ohne Smooting):

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import downloadjs from "downloadjs";
import { CirclePicker } from "react-color";
import "./App.css";

function App() {
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
    //es wird ein Blob/Link erstellt, eine URL, dann wird ein click auf den Link simmuliert, und dann folgt evtl. ein cleanup
    const canvas = await html2canvas(document.body);
    const dataURL = canvas.toDataURL("image/png");
    downloadjs(dataURL, "downloadSplash.png", "image/png");
  };

  const handleColorChange = (color, event) => {
    setCanvasBackgroundColor(color.hex);
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

export default App;


Funktionierende App mit Smoothing (aber Linienstärke ändert sich bei allen Zeichnungen, bei einem Linienswitch):

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import downloadjs from "downloadjs";
import { CirclePicker } from "react-color";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineBrushWidth, setLineBrushWidth] = useState(5);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState("#f2f2f2");
  const [points, setPoints] = useState([]);
  const [drawings, setDrawings] = useState([]); // Speichert alle Zeichnungen

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
    context.lineJoin = "round";
    context.lineWidth = lineBrushWidth;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = lineBrushWidth; // Aktualisiere nur die lineWidth
    }
  }, [lineBrushWidth]); // Füge eine neue useEffect für die lineBrushWidth hinzu

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return event.type.includes("mouse")
      ? { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY }
      : {
          x: event.touches[0].clientX - rect.left,
          y: event.touches[0].clientY - rect.top,
        };
  };

  const startDrawing = (event) => {
    event.preventDefault();
    const { x, y } = getCoordinates(event);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
    setPoints([{ x, y }]);
  };

  const finishDrawing = (event) => {
    event.preventDefault();
    if (isDrawing) {
      contextRef.current.lineTo(
        points[points.length - 1].x,
        points[points.length - 1].y
      );
      contextRef.current.stroke(); // Zeichnet die finale Linie der aktuellen Zeichnung
      contextRef.current.closePath();
      setIsDrawing(false);
      if (points.length > 1) {
        const newPoints = [...points, getCoordinates(event)]; // Fügt den letzten Punkt hinzu
        setPoints(newPoints);
        drawSmoothLine(newPoints); // Zeichnet eine geglättete Linie
      }
      setPoints([]); // Bereitet die Punkte für die nächste Zeichnung vor
    }
  };

  const draw = (event) => {
    if (!isDrawing) {
      return;
    }
    event.preventDefault();
    const { x, y } = getCoordinates(event);
    points.push({ x, y });
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const drawSmoothLine = (points) => {
    const smoothedPoints = smoothLine(points); // Funktion zur Glättung der Linie
    drawings.push(smoothedPoints); // Speichert die geglättete Linie
    redrawCanvas();
  };

  // Glättet eine Linie basierend auf ihren Punkten
  const smoothLine = (points) => {
    const smoothedPoints = []; // Implementiere hier die Logik zur Linien-Glättung
    // Beispiel: Verwendung von Quadratischen Bézier-Kurven
    smoothedPoints.push(points[0]); // Fügt den ersten Punkt hinzu
    for (let i = 1; i < points.length - 2; i++) {
      const c = (points[i].x + points[i + 1].x) / 2;
      const d = (points[i].y + points[i + 1].y) / 2;
      smoothedPoints.push({ x: c, y: d });
    }
    smoothedPoints.push(points[points.length - 1]); // Fügt den letzten Punkt hinzu
    return smoothedPoints;
  };

  // Neuzeichnen des Canvas mit allen gespeicherten Zeichnungen
  const redrawCanvas = () => {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    drawings.forEach((line) => {
      contextRef.current.beginPath();
      contextRef.current.moveTo(line[0].x, line[0].y);
      line.forEach((point, index) => {
        if (index > 0) contextRef.current.lineTo(point.x, point.y);
      });
      contextRef.current.stroke();
    });
  };

  const handleBrushChange = (newWidth) => {
    setLineBrushWidth(newWidth);
  };

  const downloadCanvas = async (event) => {
    event.preventDefault();
    const canvas = await html2canvas(document.body);
    const dataURL = canvas.toDataURL("image/png");
    downloadjs(dataURL, "downloadSplash.png", "image/png");
  };

  const handleColorChange = (color) => {
    setCanvasBackgroundColor(color.hex);
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

export default App;







// Sketch.js file 13.06.2024

import React, { useState, useEffect } from "react";
import axios from "axios";

function Sketches() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await axios.get(
          import.meta.env.VITE_SERVER_BASE + "/uploads"
        );
        result.data.files.shift();
        /* console.log(result.data.files); */
        setImages(result.data.files);
      } catch (error) {
        console.error("Fehler beim Abrufen der Bilder:", error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="sketches_wrapper">
      <h1>Sketches</h1>
      <div className="sketches_container">
        {images.map((image) => (
          <div key={image} className="sketches_card">
            <img src={image} alt="Sketch" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sketches;
