"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../lib/api";

export default function AuthForm({ mode = "login" }) {
  const isRegister = mode === "register";
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister ? formData : { email: formData.email, password: formData.password };

      const response = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      localStorage.setItem("govigi_token", response.token);
      localStorage.setItem("govigi_user", JSON.stringify(response.user));
      document.cookie = `govigi_token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
      router.push("/products");
      router.refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 style={{ marginTop: 0 }}>{isRegister ? "Create retailer account" : "Welcome back"}</h1>
        <p className="subtitle">
          {isRegister ? "Register to browse products and place bulk orders." : "Login to manage produce orders."}
        </p>

        <form className="form" onSubmit={handleSubmit}>
          {isRegister && <input className="input" name="name" placeholder="Retailer name" value={formData.name} onChange={handleChange} required />}
          <input className="input" name="email" type="email" placeholder="Email address" value={formData.email} onChange={handleChange} required />
          <input className="input" name="password" type="password" placeholder="Password" minLength={6} value={formData.password} onChange={handleChange} required />
          <button className="button" type="submit" disabled={isLoading}>{isLoading ? "Please wait..." : isRegister ? "Register" : "Login"}</button>
        </form>

        {message ? <p style={{ color: "#c0392b", marginTop: 14 }}>{message}</p> : null}

        <p className="muted" style={{ marginBottom: 0 }}>
          {isRegister ? "Already have an account?" : "New retailer?"} {" "}
          <a href={isRegister ? "/login" : "/register"} style={{ color: "#1f8f55", fontWeight: 700 }}>
            {isRegister ? "Login" : "Register"}
          </a>
        </p>
      </div>
    </div>
  );
}
