import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    surname: "",
    bio: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost/gradperfume-api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const text = await res.text();

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error("Server did not return JSON. Response:\n" + text);
      }

      if (!json.success) {
        setError(json.message || "Registration failed");
        return;
      }

      alert("🎉 Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Server error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-[calc(100vh-1px)] flex justify-center items-center bg-gradient-to-b from-pink-50 to-white px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-lg p-10 rounded-3xl shadow-xl border border-pink-200"
        >
          <h1 className="text-4xl font-bold text-center text-pink-600 mb-2">
            Join GradPerfume
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Create your scent identity
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 text-center p-3 rounded-xl mb-4 border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <input
              name="username"
              placeholder="Username *"
              value={form.username}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="email"
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <input
            name="password"
            type="password"
            placeholder="Password *"
            value={form.password}
            onChange={handleChange}
            required
            className="input mt-4"
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <input
              name="name"
              placeholder="Name (optional)"
              value={form.name}
              onChange={handleChange}
              className="input"
            />
            <input
              name="surname"
              placeholder="Surname (optional)"
              value={form.surname}
              onChange={handleChange}
              className="input"
            />
          </div>

          <textarea
            name="bio"
            placeholder="Short bio (optional)"
            value={form.bio}
            onChange={handleChange}
            className="input mt-4 resize-none h-24"
          />

          <button
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold text-lg shadow hover:scale-[1.02] transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-pink-600 font-bold cursor-pointer"
            >
              Login
            </span>
          </p>
        </form>

        <style>
          {`
            .input {
              width: 100%;
              padding: 14px;
              border-radius: 14px;
              border: 2px solid #fbcfe8;
              outline: none;
              transition: 0.2s;
            }
            .input:focus {
              border-color: #ec4899;
              box-shadow: 0 0 0 3px rgba(236,72,153,0.18);
            }
          `}
        </style>
      </div>

      <Footer />
    </>
  );
}
