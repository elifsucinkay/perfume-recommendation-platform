<?php
// ------------------ CORS & JSON FIX ------------------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}
// -----------------------------------------------------

require "db.php";

// JSON POST al
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["success" => false, "message" => "No input received"]);
    exit;
}

$user_id = intval($input["user_id"] ?? 0);
$perfume_id = intval($input["perfume_id"] ?? 0);

if ($user_id === 0 || $perfume_id === 0) {
    echo json_encode(["success" => false, "message" => "Invalid parameters"]);
    exit;
}

// Önce favori var mı kontrol et
$check = $conn->prepare("SELECT id FROM favorite_perfumes WHERE user_id=? AND perfume_id=?");
$check->bind_param("ii", $user_id, $perfume_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    // Sil
    $del = $conn->prepare("DELETE FROM favorite_perfumes WHERE user_id=? AND perfume_id=?");
    $del->bind_param("ii", $user_id, $perfume_id);
    $del->execute();

    echo json_encode([
        "success" => true,
        "favorited" => false,
        "message" => "Removed from favorites"
    ]);
    exit;

} else {
    // Ekle
    $ins = $conn->prepare("INSERT INTO favorite_perfumes (user_id, perfume_id, created_at) VALUES (?, ?, NOW())");
    $ins->bind_param("ii", $user_id, $perfume_id);
    $ins->execute();

    echo json_encode([
        "success" => true,
        "favorited" => true,
        "message" => "Added to favorites"
    ]);
    exit;
}
?>
