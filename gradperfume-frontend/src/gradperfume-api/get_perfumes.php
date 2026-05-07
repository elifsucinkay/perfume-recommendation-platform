<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require "db.php";

$perfume_id = intval($_GET["id"] ?? 0);

$query = "
    SELECT r.id, r.perfume_id, r.user_id, r.message, r.created_at,
           u.username, u.profile_image
    FROM perfume_reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.perfume_id = ?
    ORDER BY r.created_at DESC
";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $perfume_id);
$stmt->execute();
$res = $stmt->get_result();

$reviews = [];
while ($row = $res->fetch_assoc()) {
    $reviews[] = $row;
}

echo json_encode([
    "success" => true,
    "reviews" => $reviews
]);
