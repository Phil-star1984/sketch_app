import React, { useState, useEffect } from "react";
import axios from "axios";

function Sketches() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await axios.get(
          import.meta.env.VITE_SERVER_BASE + "/api/sketches"
        );

        setImages(result.data);
        /* console.log(result.data); */
      } catch (error) {
        console.error("Fehler beim Abrufen der Bilder:", error);
      }
    };
    fetchImages();
  }, []);

  const deleteSketch = async (e) => {
    try {
      const result = await axios.delete(
        `${import.meta.env.VITE_SERVER_BASE}/api/sketches/${e.target.value}`
      );
      console.log(result.data.message);
      setImages((prevImages) =>
        prevImages.filter((image) => image.name !== e.target.value)
      );
    } catch (error) {
      console.error(`Fail: deleting image ${e.target.value}`, error);
    }
  };

  return (
    <div className="sketches_wrapper">
      <h1>Sketches</h1>
      <div className="sketches_container">
        {images.map((image, index) => (
          <div>
            <div key={image.name} className="sketches_card">
              <img src={image.url} alt="Sketch" />
            </div>
            <div className="sketch_infos">
              <p>Sketched by: Phil Splash</p>
              <p>Date: {Date.now()}</p>
              <p>From: Sri Lanka</p>
              <button onClick={deleteSketch} value={image.name}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sketches;
