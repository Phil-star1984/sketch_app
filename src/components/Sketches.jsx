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
