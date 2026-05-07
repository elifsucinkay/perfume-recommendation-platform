import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost/gradperfume-api/login.php",   
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      // TOKEN + USER KAYDET
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.dispatchEvent(new Event("userChanged"));


      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Sunucu hatası!");
    }
  }

  return (
    <div className="auth-container">
      <h1 className="auth-title">Login</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="auth-btn">
          Login
        </button>
      </form>

      
    </div>
  );
}
