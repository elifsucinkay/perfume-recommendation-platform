import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Perfumes() {
  const [perfumes, setPerfumes] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function getFragranticaImage(url) {
    if (!url) return null;
    const m = url.match(/-(\d+)\.html$/);
    return m
      ? `https://fimgs.net/mdimg/perfume-thumbs/375x500.${m[1]}.avif`
      : null;
  }

  const capitalize = (str) =>
    str
      ?.split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

  async function loadPerfumes(reset = false) {
    setLoading(true);

    const res = await fetch(
      `http://localhost/gradperfume-api/perfumes.php?page=${page}&q=${search}`
    );
    const json = await res.json();

    if (json.success) {
      setPerfumes((prev) =>
        reset ? json.data : [...prev, ...json.data]
      );
      setHasMore(json.hasMore);
    }

    setLoading(false);
  }

  /* arama değişince */
  useEffect(() => {
    setPage(1);
    loadPerfumes(true);
  }, [search]);

  /* sayfa artınca */
  useEffect(() => {
    if (page > 1) loadPerfumes();
  }, [page]);

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-700 mb-6 text-center">
          Perfumes
        </h1>

        <input
          type="text"
          placeholder="Search perfumes..."
          className="w-full p-4 mb-10 rounded-2xl border border-pink-200 shadow focus:ring-2 focus:ring-pink-400 outline-none text-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {perfumes.map((p) => {
            const img = getFragranticaImage(p.imageUrl);

            return (
              <div
                key={p.id}
                onClick={() => navigate(`/perfumes/${p.id}`)}
                className="cursor-pointer bg-white shadow border border-pink-100 rounded-2xl p-4 hover:shadow-xl hover:-translate-y-1 transition"
              >
                <div className="w-full h-64 bg-pink-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={img || "/placeholder-perfume.jpg"}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                    alt={p.name}
                  />
                </div>

                <h3 className="text-xl font-semibold text-pink-700">
                  {capitalize(p.name)}
                </h3>

                <p className="text-gray-600">{capitalize(p.brand)}</p>

                <p className="text-yellow-600 font-semibold mt-1">
                  ⭐ {p.rating_value || "N/A"}
                </p>
              </div>
            );
          })}
        </div>

        {hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold shadow transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      {/* BOŞLUK */}
      <div className="mt-32" />


     <Footer />
    </>
  );
}
