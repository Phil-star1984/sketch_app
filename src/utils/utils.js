import html2canvas from "html2canvas";
import downloadjs from "downloadjs";

// Funktion zum Herunterladen der Skizze als Bild
export const downloadCanvas = async () => {
  /* event.preventDefault(); */
  /* console.log(canvasRef.current); */
  try {
    const canvas = await html2canvas(document.body);
    const dataURL = canvas.toDataURL("image/jpeg", 1.0);
    downloadjs(dataURL, "MillionPainterSketch.jpg", "image/jpeg");
  } catch (error) {
    console.error("Error downloading canvas: ", error);
  }
};
