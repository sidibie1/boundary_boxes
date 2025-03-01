import React, { useState,useRef,useEffect } from "react";

export default function ImageUploader(){
  const [images, setImages] = useState([]);
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const startCoords = useRef(null);

  useEffect(() => {
    if (canvasRef.current && images.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = images[currentImageIndex];
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        drawBoundingBoxes(ctx);
      };
    }
  }, [currentImageIndex, images, boundingBoxes]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages(urls);
    setBoundingBoxes(new Array(urls.length).fill([]));
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    startCoords.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseUp = (e) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const rect = canvasRef.current.getBoundingClientRect();
    const endCoords = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    
    const newBox = { ...startCoords.current, width: endCoords.x - startCoords.current.x, height: endCoords.y - startCoords.current.y };
    
    setBoundingBoxes((prevBoxes) => {
      const updatedBoxes = [...prevBoxes];
      updatedBoxes[currentImageIndex] = [...updatedBoxes[currentImageIndex], newBox];
      return updatedBoxes;
    });
  };

  const drawBoundingBoxes = (ctx) => {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    boundingBoxes[currentImageIndex]?.forEach((box) => {
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    });
  };

  const saveData = async () => {
    const saveData = async () => {
      setLoading(true);
      const data = {
        images,
        boundingBoxes,
      };
      console.log("Sending data to API:", JSON.stringify(data));
      
      try {
        const response = await fetch("https://fakeapi.com/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error("Failed to save data");
        console.log("Data saved successfully");
      } catch (error) {
        console.error("Error saving data:", error);
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className="p-4">
      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="mb-4" />
      {images.length > 0 && (
        <div>
          <canvas
            ref={canvasRef}
            className="border"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          ></canvas>
          <button onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)} className="mt-4 bg-blue-500 text-white p-2 rounded">Next Image</button>
          <button onClick={saveData} className="mt-4 ml-2 bg-green-500 text-white p-2 rounded">Save Data</button>
        </div>
      )}
    </div>
  );
};

// allows users to upload multiple images
// The user can draw multiple bounding boxes, edit those boxes
// The user should be able to traverse across multiple photos
// Integrate a database to store user-generated bounding boxes and associate them with the corresponding image paths - N
// Create a user-friendly UI allowing users to retrieve images and any bounding boxes they have drawn.
// You will need to have a login page where a new user can sign up and an old user can login