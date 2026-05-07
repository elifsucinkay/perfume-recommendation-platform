import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const LIMIT = 60;

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  function cleanText(text) {
    if (!text) return "";
    return text
      .normalize("NFKD")
      .replace(/\uFFFD/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  async function fetchNotes(reset = false) {
    setLoading(true);

    const offset = reset ? 0 : page * LIMIT;

    const res = await fetch(
      `http://localhost/gradperfume-api/notes.php?limit=${LIMIT}&offset=${offset}&search=${encodeURIComponent(
        search
      )}`
    );

    const json = await res.json();

    if (json.success) {
      if (reset) {
        setNotes(json.data);
      } else {
        setNotes((prev) => [...prev, ...json.data]);
      }

      // LIMIT kadar geldiyse devamı var
      setHasMore(json.data.length === LIMIT);
    }

    setLoading(false);
  }

  // 🔁 Search değişince reset
  useEffect(() => {
    setPage(0);
    fetchNotes(true);
  }, [search]);

  // ➕ Load more
  useEffect(() => {
    if (page === 0) return;
    fetchNotes();
  }, [page]);

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-pink-700 mb-3">
            Fragrance Notes
          </h1>
          <p className="text-gray-500">
            Discover perfume notes and explore scents built around them
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative mb-10">
          <input
            type="text"
            placeholder="Search notes (e.g. vanilla, oud, amber...)"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-pink-200 shadow focus:ring-2 focus:ring-pink-400 outline-none text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400 text-xl">
            🔍
          </span>
        </div>

        {/* CONTENT */}
        {notes.length === 0 && !loading ? (
          <p className="text-center text-gray-400 text-lg">
            No notes found
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {notes.map((note) => (
                <Link key={note.id} to={`/notes/${note.id}`}>
                  <div className="group h-full bg-white rounded-2xl p-6 shadow border border-pink-100 hover:border-pink-400 hover:shadow-lg transition cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 text-sm bg-pink-100 text-pink-700 rounded-full font-semibold">
                        Note
                      </span>
                      <span className="text-pink-300 group-hover:text-pink-500 transition">
                        →
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-pink-700 transition">
                      {cleanText(note.name)}
                    </h3>

                    <p className="text-sm text-gray-400 mt-2">
                      Explore perfumes built around this note
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* ✅ LOAD MORE – ARTIK HER ZAMAN ÇALIŞIR */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="px-10 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold shadow transition disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* BOŞLUK */}
      <div className="mt-32" />

     <Footer />
    </>
  );
}
