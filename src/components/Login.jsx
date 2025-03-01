import React, { useState } from "react";

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logging in with", email, password);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
            <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            </div>
            <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Login
            </button>
        </form>
        </div>
    );
};
  