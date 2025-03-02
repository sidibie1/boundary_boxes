import React, { useState, useEffect } from "react";
import "../App.css";

export default function RetrieveImages() {
  const [images, setImages] = useState([]);
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImagesAndBoundingBoxes();
  }, []);

  const fetchImagesAndBoundingBoxes = async () => {
    try {
      const response = await fetch("http://localhost:5000/images");
      if (!response.ok) throw new Error("Failed to fetch images and bounding boxes");
      const data = await response.json();
      setImages(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImageClick = async (imageUrl) => {
    setSelectedImage(imageUrl);
    try {
      const response = await fetch("http://localhost:5000/bounding-boxes");
      if (!response.ok) throw new Error("Failed to fetch bounding boxes");
      const data = await response.json();
      
      const selectedBoundingBox = data.find(item => item.imageUrl === imageUrl)?.boundingBoxes[0][0] || [];
      setBoundingBoxes([selectedBoundingBox]);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="retrieve-images-container">
      <button onClick={fetchImagesAndBoundingBoxes} className="fetch-button">Retrieve Images</button>
      <div className="image-grid">
        {images.map(({ imageUrl }, index) => (
          <div key={index} className="image-item" onClick={() => handleImageClick(imageUrl)}>
            <img
              src={imageUrl}
              alt={`Image ${index + 1}`}
              className="retrieved-image"
            />
            {selectedImage === imageUrl && (
              <svg className="bounding-boxes-overlay">
                {boundingBoxes.map((box, i) => (
                  <rect
                    key={i}
                    x={box.x}
                    y={box.y}
                    width={box.width}
                    height={box.height}
                    stroke="red"
                    fill="transparent"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
