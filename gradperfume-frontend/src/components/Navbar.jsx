import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    setUser(savedUser ? JSON.parse(savedUser) : null);

    function reloadUser() {
      const u = localStorage.getItem("user");
      setUser(u ? JSON.parse(u) : null);
    }

    window.addEventListener("userChanged", reloadUser);

    return () => {
      window.removeEventListener("userChanged", reloadUser);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    window.dispatchEvent(new Event("userChanged"));

    navigate("/login");
  }

  return (
    <nav className="w-full bg-pink-100 text-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <h1
          className="text-2xl font-bold text-pink-700 cursor-pointer hover:text-pink-500 transition"
          onClick={() => navigate("/")}
        >
          GradPerfume
        </h1>

        {/* NAV LINKS */}
        <ul className="flex items-center gap-8 text-lg font-medium">

          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-pink-700 font-bold"
                  : "hover:text-pink-500 transition"
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/notes"
              className={({ isActive }) =>
                isActive
                  ? "text-pink-700 font-bold"
                  : "hover:text-pink-500 transition"
              }
            >
              Notes
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/perfumes"
              className={({ isActive }) =>
                isActive
                  ? "text-pink-700 font-bold"
                  : "hover:text-pink-500 transition"
              }
            >
              Perfumes
            </NavLink>
          </li>

          {/* Giriş yapmamışsa Login/Register */}
          {!user && (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? "text-pink-700 font-bold"
                      : "hover:text-pink-500 transition"
                  }
                >
                  Login
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive
                      ? "text-pink-700 font-bold"
                      : "hover:text-pink-500 transition"
                  }
                >
                  Register
                </NavLink>
              </li>
            </>
          )}

          {/* Giriş yaptıysa: username + profile + logout */}
          {user && (
            <>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive
                      ? "text-pink-700 font-bold"
                      : "hover:text-pink-500 transition"
                  }
                >
                  {user.username}
                </NavLink>
              </li>

              <li
                onClick={handleLogout}
                className="cursor-pointer text-red-600 hover:text-red-800 font-bold transition"
              >
                Logout
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
}
