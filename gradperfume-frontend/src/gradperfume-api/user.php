<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require "../db.php";

$token = $_GET["token"] ?? "";

if (!$token) {
    echo json_encode(["success" => false]);
    exit;
}

$userData = json_decode(base64_decode($token), true);
$userId = $userData["id"];

$stmt = $conn->prepare("
    SELECT id, username, email, name, surname, birthdate, bio, profile_image
    FROM users
    WHERE id=? AND is_active=1
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$res = $stmt->get_result();

echo json_encode([
    "success" => true,
    "user" => $res->fetch_assoc()
]);
?>
