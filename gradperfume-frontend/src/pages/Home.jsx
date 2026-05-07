import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import slide1 from "../assets/1.jpg";
import slide2 from "../assets/2.jpg";
import slide3 from "../assets/3.jpg";

export default function Home() {
  const [data, setData] = useState(null);
  const [slide, setSlide] = useState(0);

  const slides = [slide1, slide2, slide3];

  const saved = localStorage.getItem("user");
  const user = saved ? JSON.parse(saved) : null;
  const userId = user ? user.id : 0;

  //SLIDER AUTO PLAY
  
  useEffect(() => {
    const i = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  //FETCH HOME DATA

  useEffect(() => {
    fetch(
      `http://localhost/gradperfume-api/home_recommendations.php?user_id=${userId}`
    )
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [userId]);

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <h1 className="text-4xl font-bold text-pink-700">
          Welcome to GradPerfume 💖
        </h1>
        <p className="text-gray-600 mt-2">
          Loading your personal scent world...
        </p>
      </div>
    );
  }

  //HELPERS

  const formatName = (str) =>
    str?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const getImageFromUrl = (url) => {
    if (!url) return "/placeholder-perfume.jpg";
    const clean = url.split("?")[0];
    const m = clean.match(/-(\d+)\.html$/);
    return m
      ? `https://fimgs.net/mdimg/perfume-thumbs/375x500.${m[1]}.avif`
      : "/placeholder-perfume.jpg";
  };

  //CARD
 
  const card = (p) => (
    <div
      key={p.id}
      onClick={() => (window.location.href = `/perfumes/${p.id}`)}
      className="bg-white rounded-2xl border border-pink-100 shadow-md hover:shadow-xl cursor-pointer transform hover:-translate-y-1 transition p-4"
    >
      <div className="w-full h-64 bg-pink-50 rounded-xl mb-3 overflow-hidden">
        <img
          src={getImageFromUrl(p.url)}
          alt={p.name}
          className="w-full h-full object-contain hover:scale-105 transition"
        />
      </div>

      <h3 className="text-xl font-semibold text-pink-700">
        {formatName(p.name)}
      </h3>
      <p className="text-gray-600">{formatName(p.brand)}</p>

      <p className="text-yellow-600 font-semibold text-sm mt-1">
        ⭐ {p.rating_value}
      </p>
    </div>
  );

  const section = (title, arr) =>
    arr && arr.length > 0 && (
      <div className="mt-14">
        <h2 className="text-3xl font-bold text-pink-600 mb-6">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {arr.map(card)}
        </div>
      </div>
    );

  //RENDER
 
  return (
    <div className="w-full">
      {//HERO SLIDER
     }
      <div className="relative h-[420px] overflow-hidden">
        {slides.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              slide === i ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Discover Your{" "}
              <span className="text-pink-300">Scent Identity</span>
            </h1>

            <p className="mt-4 text-lg text-white/90 max-w-xl">
              Personalized perfume discovery, reviews and scent intelligence.
            </p>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => (window.location.href = "/perfumes")}
                className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow-lg transition"
              >
                Explore Perfumes
              </button>

              {!user && (
                <button
                  onClick={() => (window.location.href = "/register")}
                  className="px-6 py-3 rounded-xl bg-white/90 hover:bg-white text-pink-700 font-semibold shadow-lg transition"
                >
                  Join GradPerfume
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {//CONTENT
     }
      <div className="max-w-6xl mx-auto mt-16 p-4">
        {/* SADECE LOGIN VARSA */}
        {user && section("Recently Viewed", data.recent)}
        {user && section("Because You Liked These Brands", data.recommended)}

        {/* HERKES GÖRÜR */}
        {section("Top Rated on GradPerfume", data.popular)}

        {/* LOGIN YOKSA TEŞVİK */}
        {!user && (
          <div className="mt-20 bg-gradient-to-r from-pink-50 to-white border border-pink-100 rounded-3xl p-10 text-center">
            <h3 className="text-3xl font-bold text-pink-700 mb-4">
              Get Personalized Recommendations 💖
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Create your profile, like perfumes and notes, and unlock your
              personal scent feed.
            </p>
            <button
              onClick={() => (window.location.href = "/register")}
              className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold shadow"
            >
              Create Free Account
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
