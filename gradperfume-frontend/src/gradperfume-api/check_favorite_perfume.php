<?php
// ------------------ CORS FIX ------------------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}
// ------------------------------------------------

require "db.php";

$user_id = intval($_GET["user_id"] ?? 0);
$perfume_id = intval($_GET["perfume_id"] ?? 0);

if ($user_id === 0 || $perfume_id === 0) {
    echo json_encode(["success" => false, "favorite" => false]);
    exit;
}

$q = $conn->prepare("SELECT id FROM favorite_perfumes WHERE user_id=? AND perfume_id=?");
$q->bind_param("ii", $user_id, $perfume_id);
$q->execute();
$res = $q->get_result();

echo json_encode([
    "success" => true,
    "favorite" => $res->num_rows > 0
]);
?>
