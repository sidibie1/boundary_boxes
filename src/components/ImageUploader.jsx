import React, { useState,useRef,useEffect } from "react";

export default function ImageUploader() {
  //using state for images upload
  const [images, setImages] = useState([]);
  //using state for bounding box uploads
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  //using state for image values taken
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        drawBoundingBoxes(ctx);
      };
    }
  }, [currentImageIndex, images, boundingBoxes]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Failed to upload image");
      const data = await response.json();
      console.log(data.message);
      setImages(urls);
      setBoundingBoxes(new Array(urls.length).fill([]));

    } catch (error) {
      console.error("Error uploading image:", error);
    }
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
    
    const newBox = {
      ...startCoords.current,
      width: endCoords.x - startCoords.current.x,
      height: endCoords.y - startCoords.current.y,
    };
    
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
    const data = { images, boundingBoxes };
    console.log("Sending data to API:", JSON.stringify(data));
    
    try {
      const response = await fetch("http://localhost:5000/bounding-boxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok){
        throw new Error("Failed to save data");
      }else{
        alert("Data saved successfully");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="image-uploader-container">
      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="file-input" />
      {images.length > 0 && (
        <div className="canvas-container">
          <canvas ref={canvasRef} className="canvas" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}></canvas>
          <div className="button-group">
            <button onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)} className="nav-button">Next Image</button>
            <button onClick={()=>saveData()} className="save-button">Save Data</button>
            <button 
              onClick={()=> window.location.href = "http://localhost:3000/retrieve"} className="nav-button">Retrieve</button>
          </div>
        </div>
      )}
    </div>
  );
}