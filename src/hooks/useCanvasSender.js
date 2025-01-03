import { useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import downloadjs from 'downloadjs';

export const useCanvasSender = () => {
  const [sendingSketch, setSendingSketch] = useState(false);

  const downloadCanvas = async () => {
    try {
      const canvas = await html2canvas(document.body);
      const dataURL = canvas.toDataURL("image/jpeg", 1.0);
      downloadjs(dataURL, "MillionPainterSketch.jpg", "image/jpeg");
    } catch (error) {
      console.error("Error downloading canvas: ", error);
    }
  };

  const sendCanvasToServer = async () => {
    if (!navigator.onLine) {
      alert("You are offline! Please check your network connection.");
      return;
    }

    setSendingSketch(true);
    const serverURL = import.meta.env.VITE_SERVER_BASE + "/api/sketches";

    html2canvas(document.body, { scale: 0.7 }).then((canvas) => {
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
          setSendingSketch(false);
        },
        "image/jpeg",
        0.8
      );
    });
  };

  return {
    sendingSketch,
    downloadCanvas,
    sendCanvasToServer
  };
};
