import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import ImageUploader from "./components/ImageUploader";

const App = () => {
  return (
    <Router>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Image Annotation Tool</h1>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<ImageUploader />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App