import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import ImageUploader from "./components/ImageUploader";
import RetrieveImages from "./components/RetrieveImages";

const App = () => {
  return (
    <Router>
      <div className="p-6">
        <h1 className="font-bold" style={{marginLeft:"40%"}}>Bounding Box Images</h1>
        <Routes>
          {/* Following are the paths for the specific pages */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<ImageUploader />} />
          <Route path="/retrieve" element={<RetrieveImages />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App