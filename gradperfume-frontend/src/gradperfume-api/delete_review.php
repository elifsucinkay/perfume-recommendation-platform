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
