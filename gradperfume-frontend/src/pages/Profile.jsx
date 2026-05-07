import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaUserEdit, FaKey, FaTrash, FaGlobe } from "react-icons/fa";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [favNotes, setFavNotes] = useState([]);
  const [favPerfumes, setFavPerfumes] = useState([]);
  const [recent, setRecent] = useState([]);

  const [rep, setRep] = useState(null);

  /* ---------------- UTIL ---------------- */
  const formatName = (str) =>
    str?.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

  function getFragranticaImage(url) {
    if (!url) return null;
    const m = url.match(/-(\d+)\.html$/);
    return m ? `https://fimgs.net/mdimg/perfume-thumbs/375x500.${m[1]}.avif` : null;
  }

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    const u = JSON.parse(stored);
    setUser(u);

    fetch(`http://localhost/gradperfume-api/favorite_notes.php?user_id=${u.id}`).then(r=>r.json()).then(setFavNotes);
    fetch(`http://localhost/gradperfume-api/favorite_perfumes.php?user_id=${u.id}`).then(r=>r.json()).then(setFavPerfumes);
    fetch(`http://localhost/gradperfume-api/recent_views.php?user_id=${u.id}`).then(r=>r.json()).then(setRecent);

    fetch(`http://localhost/gradperfume-api/reputation.php?user_id=${u.id}`).then(r=>r.json()).then(j=>{
      if(j.success) setRep(j);
    });


  }, []);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  /* ---------------- SAVE PROFILE ---------------- */
  async function saveChanges() {
    const res = await fetch("http://localhost/gradperfume-api/update_profile.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const json = await res.json();

    if (json.success) {
      localStorage.setItem("user", JSON.stringify(json.user));
      setUser(json.user);
      setEditMode(false);

      Swal.fire({
        toast: true,
        icon: "success",
        title: "Profile updated",
        position: "top-end",
        timer: 1600,
        showConfirmButton: false,
      });
    } else {
      Swal.fire("Error", json.message, "error");
    }
  }

  /* ---------------- PASSWORD ---------------- */
  async function changePassword() {
    const { value } = await Swal.fire({
      title: "Change Password",
      html: `
        <input id="old" type="password" class="swal2-input" placeholder="Current password">
        <input id="new" type="password" class="swal2-input" placeholder="New password">
      `,
      showCancelButton: true,
      confirmButtonText: "Change",
      preConfirm: () => ({
        old: document.getElementById("old").value,
        new: document.getElementById("new").value,
      }),
    });

    if (!value) return;

    const r = await fetch("http://localhost/gradperfume-api/change_password.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, ...value }),
    });

    const json = await r.json();

    Swal.fire({
      icon: json.success ? "success" : "error",
      title: json.success ? "Password Changed" : "Error",
      text: json.message,
    });
  }

  /* ---------------- DELETE ---------------- */
  async function deleteAccount() {
    const res = await Swal.fire({
      title: "Delete account?",
      text: "This action is irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!res.isConfirmed) return;

    const r = await fetch("http://localhost/gradperfume-api/delete_account.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    });

    const json = await r.json();

    Swal.fire({
      icon: json.success ? "success" : "error",
      title: json.success ? "Deleted" : "Error",
      text: json.message || "Done",
    });

    if (json.success) {
      localStorage.clear();
      navigate("/login");
    }
  }

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-10">
      {/* HEADER */}
      <div className="flex items-center gap-8 mb-14">
        <div className="w-32 h-32 rounded-full bg-pink-200 overflow-hidden shadow-lg">
          {user.profile_image ? (
            <img src={user.profile_image} className="w-full h-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl font-bold text-pink-700">
              {user.username[0].toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-bold text-pink-700">{user.username}</h1>
          <p className="text-gray-500">{user.email}</p>

          <div className="flex gap-6 mt-3 text-sm text-gray-600">
            {rep && <span><b className="text-pink-700">{rep.score}</b> Reputation</span>}
          </div>

          <div className="flex gap-3 mt-5 flex-wrap">
            <ActionBtn icon={<FaUserEdit />} onClick={() => setEditMode(!editMode)}>
              Edit Profile
            </ActionBtn>
            <ActionBtn icon={<FaKey />} onClick={changePassword}>
              Change Password
            </ActionBtn>
            <ActionBtn danger icon={<FaTrash />} onClick={deleteAccount}>
              Delete Account
            </ActionBtn>
          </div>
        </div>
      </div>

      {/* EDIT */}
      {editMode && (
        <div className="bg-white rounded-2xl shadow border p-8 mb-14">
          <h2 className="text-2xl font-bold text-pink-700 mb-6">Edit Profile</h2>

          <div className="grid grid-cols-2 gap-4">
            <input className="input" name="name" placeholder="Name" value={user.name || ""} onChange={handleChange} />
            <input className="input" name="surname" placeholder="Surname" value={user.surname || ""} onChange={handleChange} />
          </div>

          <input className="input mt-4" type="date" name="birthdate" value={user.birthdate || ""} onChange={handleChange} />
          <input className="input mt-4" name="profile_image" placeholder="Avatar Image URL" value={user.profile_image || ""} onChange={handleChange} />
          <textarea className="input mt-4" name="bio" placeholder="Bio" value={user.bio || ""} onChange={handleChange} />

          <button onClick={saveChanges} className="btn w-full mt-6">
            Save Changes
          </button>
        </div>
      )}


      {/* FAVORITE NOTES */}
      {favNotes.length > 0 && (
        <Section title="Favorite Notes">
          <div className="flex flex-wrap gap-3">
            {favNotes.map((n) => (
              <span key={n.id} className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full font-semibold shadow-sm hover:scale-105 transition">
                🌸 {formatName(n.name)}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* FAVORITE PERFUMES */}
      {favPerfumes.length > 0 && (
        <Section title="Favorite Perfumes">
          {favPerfumes.map((p) => (
            <PerfumeCard
              key={p.id}
              name={formatName(p.name)}
              brand={formatName(p.brand)}
              img={getFragranticaImage(p.image_url || p.url)}
              onClick={() => navigate(`/perfumes/${p.id}`)}
            />
          ))}
        </Section>
      )}

      {/* RECENT */}
      {recent.length > 0 && (
        <Section title="Recently Viewed">
          {recent.map((p) => (
            <PerfumeCard
              key={p.id}
              name={formatName(p.name)}
              brand={formatName(p.brand)}
              img={getFragranticaImage(p.image_url || p.url)}
              onClick={() => navigate(`/perfumes/${p.id}`)}
            />
          ))}
        </Section>
      )}
    </div>
  );
}

/* ---------- UI ---------- */
function ActionBtn({ icon, children, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold shadow transition
      ${danger ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-pink-100 text-pink-700 hover:bg-pink-200"}`}
    >
      {icon} {children}
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-14">
      <h2 className="text-2xl font-bold text-pink-700 mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">{children}</div>
    </div>
  );
}

function PerfumeCard({ name, brand, img, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer bg-white rounded-xl shadow hover:shadow-xl transition p-4">
      <img src={img || "/placeholder-perfume.jpg"} className="w-full h-56 object-contain mb-3" />
      <h3 className="font-semibold text-pink-700">{name}</h3>
      <p className="text-gray-500 text-sm">{brand}</p>
    </div>
  );
}
