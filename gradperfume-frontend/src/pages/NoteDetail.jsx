import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NoteChat from "../components/NoteChat";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [noteName, setNoteName] = useState("");
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFav, setIsFav] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  /*  Fragrantica URL → Image URL */
  function getFragranticaImage(url) {
    if (!url) return null;
    const match = url.match(/-(\d+)\.html$/);
    if (!match) return null;
    return `https://fimgs.net/mdimg/perfume/375x500.${match[1]}.jpg`;
  }

  const formatName = (str) =>
    str?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
//nota detaylarını çekiyorum
  useEffect(() => {
    loadNote();
    if (user) checkFavorite();
  }, [id]);
//notaya ait parfümleri phpden alıyorum
  async function loadNote() {
    try {
      const res = await fetch(
        `http://localhost/gradperfume-api/note_detail.php?id=${id}`
      );
      const json = await res.json();

      if (json.success) {
        setNoteName(json.note_name);

        const items = json.perfumes.map((p) => ({
          ...p,
          imageUrl: getFragranticaImage(p.url),
        }));

        setPerfumes(items);
      }
    } catch {
      Swal.fire("Error loading note", "", "error");
    } finally {
      setLoading(false);
    }
  }
//notayı favorilere ekleme
  async function checkFavorite() {
    const res = await fetch(
      `http://localhost/gradperfume-api/check_favorite_note.php?user_id=${user.id}&note_id=${id}`
    );
    const json = await res.json();
    setIsFav(json.favorite);
  }
//php ekleme-silme kararı veriyo
  async function toggleFavorite() {
    if (!user) return navigate("/login");

    const res = await fetch(
      "http://localhost/gradperfume-api/favorite_note_toggle.php",
      {
        method: "POST",
        body: JSON.stringify({
          user_id: user.id,
          note_id: id,
        }),
      }
    );

    const json = await res.json();
    setIsFav(json.favorited);
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <>
      <div className="p-8 max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-pink-700 tracking-tight">
            {formatName(noteName)}
          </h1>

          <button
            onClick={toggleFavorite}
            className={`px-5 py-2 rounded-lg shadow text-white font-semibold transition 
              ${isFav ? "bg-red-500 hover:bg-red-600" : "bg-pink-600 hover:bg-pink-700"}`}
          >
            {isFav ? "❤️ Remove Favorite" : "💖 Add Favorite"}
          </button>
        </div>

        {/* PERFUMES */}
        <h2 className="text-2xl font-semibold mb-4">
          Perfumes with this note
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {perfumes.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/perfumes/${p.id}`)}
              className="group cursor-pointer rounded-xl p-[2px]
                         bg-gradient-to-br from-pink-300 to-yellow-200
                         hover:shadow-xl hover:scale-[1.02] transition"
            >
              <div className="bg-white rounded-xl p-4 flex gap-4 group-hover:bg-pink-50 transition">
                <img
                  src={p.imageUrl || "/placeholder-perfume.jpg"}
                  alt={p.name}
                  className="w-24 h-32 object-cover rounded-lg shadow-sm border"
                />

                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {formatName(p.name)}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {formatName(p.brand)}
                    </p>
                    <p className="text-pink-600 text-sm">
                      Role: {p.role}
                    </p>
                  </div>

                  <div>
                    <p className="text-yellow-600 font-semibold">
                      ⭐ {p.rating_value}
                    </p>
                    <span className="text-pink-600 text-sm font-semibold hover:underline">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* nota kişisel chat*/}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-3">Note Chat</h2>

          {!user ? (
            <p className="text-gray-600">You must log in to view chat.</p>
          ) : !isFav ? (
            <p className="text-gray-600">
              ⭐ Add this note to your favorites to join chat.
            </p>
            //favoriyse chat açılıyo
          ) : (
            <NoteChat noteId={id} user={user} />
          )}
        </div>
      </div>

      {/* BOŞLUK */}
      <div className="mt-32" />

      {/*FOOTER*/}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-bold text-white tracking-wide">
              GradPerfume
            </h3>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Your intelligent fragrance discovery platform.
              Discover, review and define your scent identity.
            </p>
          </div>

          {/* EXPLORE */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wide">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/perfumes" className="hover:text-pink-400">Perfumes</a></li>
              <li><a href="/notes" className="hover:text-pink-400">Notes</a></li>
              <li><a href="/reviews" className="hover:text-pink-400">Reviews</a></li>
              <li><a href="/community" className="hover:text-pink-400">Community</a></li>
            </ul>
          </div>

          {/* PROJECT */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wide">
              Project
            </h4>
            <p className="text-sm text-gray-400">
              Graduation Project<br />
              Computer Engineering
            </p>
            <p className="text-xs text-gray-500 mt-6">
              © {new Date().getFullYear()} GradPerfume
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
          Crafted with 💖 for fragrance lovers
        </div>
      </footer>
    </>
  );
}
