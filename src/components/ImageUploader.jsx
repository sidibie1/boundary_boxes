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
      //This gets the 2D drawing context.
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = images[currentImageIndex];

      img.onload = () => {
        ////canvas is resized to match the image dimensions.
        canvas.width = img.width;
        canvas.height = img.height;

        //Previous drawing is cleared with 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Image is drawn on the canvas 
        ctx.drawImage(img, 0, 0);
        drawBoundingBoxes(ctx);
      };
    }
    //every time currentImageIndex, images, or boundingBoxes change, the canvas updates automatically.
  }, [currentImageIndex, images, boundingBoxes]);

  const handleImageUpload = async (e) => {
    
    //converts into an array for easy processing that contains the selected images.
    const files = Array.from(e.target.files);

    const urls = files.map((file) => URL.createObjectURL(file));

    //FormData is used to send multipart/form-data.
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    
    try {
      //Calling upload API
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Failed to upload image");
      const data = await response.json();
      console.log(data.message);
      setImages(urls);

      //Initializes empty bounding boxes for each uploaded image.
      setBoundingBoxes(new Array(urls.length).fill([]));

    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleMouseDown = (e) => {
    // Check if user started drawing a bounding box.
    isDrawing.current = true;

    // Gets the canvas position relative to the screen
    const rect = canvasRef.current.getBoundingClientRect();

    // Storing starting coordinates
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
    
    // Storing new bounding box inside boundingBoxes
    setBoundingBoxes((prevBoxes) => {
      const updatedBoxes = [...prevBoxes];
      updatedBoxes[currentImageIndex] = [...updatedBoxes[currentImageIndex], newBox];
      return updatedBoxes;
    });
  };

  const drawBoundingBoxes = (ctx) => {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    // Looping all bounding boxes for the current image and draw them 
    boundingBoxes[currentImageIndex]?.forEach((box) => {
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    });
  };

  const saveData = async () => {
    const data = { images, boundingBoxes };
    console.log("Sending data to API:", JSON.stringify(data));
    
    try {
      //Calling bouding box APIs to store the date
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