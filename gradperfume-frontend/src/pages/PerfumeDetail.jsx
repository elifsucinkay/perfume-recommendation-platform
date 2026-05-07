import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function PerfumeDetail() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [tab, setTab] = useState("top");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  const [isFav, setIsFav] = useState(false);

  // ⭐ Yorumlar
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");

  // -------------------------------------
  // 🔥 Fragrantica URL → Görsel URL
  // -------------------------------------
  function getFragranticaImage(url) {
    if (!url) return null;
    const m = url.match(/-(\d+)\.html$/);
    if (!m) return null;
    return `https://fimgs.net/mdimg/perfume-thumbs/375x500.${m[1]}.avif`;
  }

  const capitalize = (str) =>
    str
      ? str
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ")
      : "";

  // ---------------------------
  // PERFUME + FAVORITE + REVIEWS
  // ---------------------------
  useEffect(() => {
    loadPerfume();
    if (userId) {
      checkFavorite();
    }
    loadReviews();
  }, [id]);

  async function loadPerfume() {
    try {
      const uid = userId ? `&user_id=${userId}` : "";
      const res = await axios.get(
        `http://localhost/gradperfume-api/perfume_detail.php?id=${id}${uid}`
      );
      setData(res.data);
    } catch (e) {
      console.log(e);
    }
  }


  async function checkFavorite() {
    try {
      const res = await fetch(
        `http://localhost/gradperfume-api/check_favorite_perfume.php?user_id=${userId}&perfume_id=${id}`
      );
      const json = await res.json();
      setIsFav(json.favorite);
    } catch {}
  }

  // favori
  async function toggleFavorite() {
    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "Login required",
        text: "You must log in first.",
      });
      return;
    }

    try {
      const res = await fetch(
        "http://localhost/gradperfume-api/favorite_perfume_toggle.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, perfume_id: Number(id) }),
        }
      );

      const json = await res.json();
      if (json.success) {
        setIsFav((prev) => !prev);
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: json.success ? "success" : "info",
        title: json.message,
        showConfirmButton: false,
        timer: 1600,
      });
    } catch {
      Swal.fire("Server error", "", "error");
    }
  }

  //review

  async function loadReviews() {
    const r = await fetch(
      `http://localhost/gradperfume-api/get_reviews.php?id=${id}`
    );
    const json = await r.json();
    if (json.success) setReviews(json.reviews);
  }

  async function handleDelete(reviewId) {
    Swal.fire({
      title: "Delete Review?",
      text: "Are you sure you want to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it"
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const res = await fetch("http://localhost/gradperfume-api/delete_review.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_id: reviewId, user_id: userId })
      });

      const json = await res.json();
      if (json.success) {
        loadReviews();
      }

      Swal.fire({
        toast: true,
        icon: json.success ? "success" : "error",
        title: json.message,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    });
  }


  async function handleEdit(review) {
    const { value: newText } = await Swal.fire({
      title: "Edit Review",
      input: "textarea",
      inputValue: review.message,
      inputAttributes: { rows: 5 },
      showCancelButton: true,
    });

    if (!newText || newText.trim() === "") return;

    const res = await fetch("http://localhost/gradperfume-api/update_review.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        review_id: review.id,
        user_id: userId,
        message: newText,
      }),
    });

    const json = await res.json();

    if (json.success) {
      loadReviews();
    }

    Swal.fire({
      toast: true,
      icon: json.success ? "success" : "error",
      title: json.message,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    });
  }



  async function submitReview() {
    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "Login required",
        text: "You must log in to write a review.",
      });
      return;
    }

    if (!reviewText.trim()) return;

    const res = await fetch("http://localhost/gradperfume-api/add_review.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        perfume_id: Number(id),
        user_id: userId,
        message: reviewText,
      }),
    });

    const json = await res.json();

    if (json.success) {
      setReviewText("");
      loadReviews();
    }

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: json.success ? "success" : "error",
      title: json.message,
      showConfirmButton: false,
      timer: 1600,
    });
  }

  // --------------------------------------

  if (!data)
    return <div className="text-center p-20 text-gray-500">Loading...</div>;
  if (!data.success) return <h2>Perfume Not Found</h2>;

  const p = data.perfume;
  const notes = data.notes;
  const perfumeImage =
    getFragranticaImage(p.url) || "/placeholder-perfume.jpg";

  // --------------------------------------
  // RETURN UI
  // --------------------------------------

  return (
    <div
      className="fade-in"
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "auto",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ----------------------------------
           ÜST KISIM
      ---------------------------------- */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          background: "linear-gradient(135deg, #fff5fa, #ffeef8)",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "380px",
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={perfumeImage}
            alt={p.name}
            style={{
              width: "100%",
              borderRadius: "16px",
              objectFit: "cover",
            }}
          />
        </div>

        <div style={{ flex: 2 }}>
          <h1
            style={{
              fontSize: "46px",
              fontWeight: "700",
              color: "#d63384",
            }}
          >
            {capitalize(p.name)}
          </h1>

          <h3
            style={{
              fontSize: "22px",
              color: "#d4af37",
              marginTop: "-5px",
            }}
          >
            {capitalize(p.brand)}
          </h3>

          {/* FAVORITE BUTTON */}
          <button
            onClick={toggleFavorite}
            style={{
              marginTop: "20px",
              padding: "12px 26px",
              background: isFav
                ? "linear-gradient(135deg,#c81e1e,#e64a4a)"
                : "linear-gradient(135deg,#d63384,#d960a7)",
              color: "white",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(214,51,132,0.3)",
              transition: "0.3s",
            }}
          >
            {isFav ? "❤️ Remove Favorite" : "💖 Add Favorite"}
          </button>

          {/* MAIN ACCORDS */}
          <h2
            style={{
              marginTop: "35px",
              fontSize: "26px",
              fontWeight: "600",
            }}
          >
            Main Accords
          </h2>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "10px",
            }}
          >
            {p.main_accords
              .replace(/[\[\]']+/g, "")
              .split(",")
              .map((a, i) => (
                <span
                  key={i}
                  style={{
                    background: "#ffe4ef",
                    padding: "8px 16px",
                    borderRadius: "30px",
                    color: "#d63384",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {capitalize(a.trim())}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* ------------------------
          NOTE TABS
      ------------------------- */}
      <div style={{ marginTop: "50px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "600" }}>Notes</h2>

        <div style={{ display: "flex", gap: "20px", margin: "15px 0" }}>
          {["top", "middle", "base"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "10px 20px",
                borderRadius: "14px",
                border: `2px solid ${
                  tab === t ? "#d63384" : "#ffd6e6"
                }`,
                background: tab === t ? "#d63384" : "white",
                color: tab === t ? "white" : "#d63384",
                cursor: "pointer",
                fontWeight: "600",
                transition: "0.3s",
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          {notes[tab].map((n) => (
            <p
              key={n.id}
              style={{ fontSize: "18px", marginBottom: "6px" }}
            >
              {capitalize(n.name)}
            </p>
          ))}
        </div>
      </div>

      {/* ------------------------
          DESCRIPTION
      ------------------------- */}
      <div style={{ marginTop: "50px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "600" }}>
          Description
        </h2>
        <p
          style={{
            marginTop: "10px",
            lineHeight: "1.8",
            fontSize: "17px",
            background: "white",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          }}
        >
          {p.description}
        </p>
      </div>

      {/* ------------------------
          SIMILAR PERFUMES
      ------------------------- */}
      <div style={{ marginTop: "50px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "600" }}>
          Similar Perfumes
        </h2>

        <div
          className="similar-scroll"
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            paddingBottom: "10px",
            marginTop: "15px",
          }}
        >
          {data.similar.map((s) => (
            <div
              key={s.id}
              onClick={() =>
                (window.location = `/perfumes/${s.id}`)
              }
              className="hover-scale"
              style={{
                minWidth: "220px",
                background: "white",
                padding: "18px",
                borderRadius: "18px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              <h3
                style={{
                  color: "#d63384",
                  fontWeight: "600",
                  fontSize: "18px",
                }}
              >
                {capitalize(s.name)}
              </h3>
              <p style={{ color: "#555" }}>{capitalize(s.brand)}</p>
              <p
                style={{
                  color: "#d4af37",
                  marginTop: "5px",
                  fontWeight: "600",
                }}
              >
                ⭐ {s.rating_value}
              </p>
            </div>
          ))}
        </div>
      </div>

{/* ======================================
        USER REVIEWS
====================================== */}
<div className="mt-16">
  <h2 className="text-3xl font-semibold mb-6 text-pink-700">
    User Reviews
  </h2>

  {/* YORUM EKLEME */}
  {user ? (
    <div className="mb-8 p-5 bg-white rounded-2xl shadow border border-pink-100">
      <textarea
        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition resize-none"
        placeholder="Share your experience with this perfume..."
        rows={3}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />

      <button
        onClick={submitReview}
        className="mt-3 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold shadow transition"
      >
        Submit Review 💬
      </button>
    </div>
  ) : (
    <p className="text-gray-600">Login to write a review.</p>
  )}

  {/* YORUMLAR LİSTESİ */}
  <div className="space-y-4">
    {reviews.length === 0 && (
      <p className="text-gray-500">No reviews yet. Be the first!</p>
    )}

    {reviews.map((r) => (
      <div
        key={r.id}
        className="p-5 bg-white border border-pink-100 rounded-2xl shadow-sm hover:shadow-md transition"
      >
        <div className="flex items-center mb-2">
          {/* AVATAR */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-pink-200 flex items-center justify-center">
            {r.profile_image ? (
              <img
                src={`${r.profile_image}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-pink-800 font-bold">
                {r.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="ml-3 flex-1">
            <p className="font-semibold text-pink-700">{r.username}</p>
            <p className="text-xs text-gray-400">{r.created_at}</p>
          </div>
        </div>

        {/* YORUM METNİ */}
        <p className="text-gray-800 leading-relaxed pl-1">{r.message}</p>
      </div>
    ))}
  </div>
</div>



      {/* ------------------------
          EXTRA CSS
      ------------------------- */}
      <style>
        {`
          .fade-in {
            animation: fadeIn 0.6s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .hover-scale:hover {
            transform: scale(1.03);
          }
          .similar-scroll::-webkit-scrollbar {
            height: 8px;
          }
          .similar-scroll::-webkit-scrollbar-thumb {
            background: #d63384;
            border-radius: 10px;
          }
        `}
      </style>

    </div>
    
  );
}
