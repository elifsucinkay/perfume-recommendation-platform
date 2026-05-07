<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data["user_id"] ?? 0;

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "No user id"]);
    exit;
}

$stmt = $conn->prepare("SELECT id, username, email, name, surname, bio, birthdate, profile_image FROM users WHERE id=?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

echo json_encode([
    "success" => true,
    "user" => $res->fetch_assoc()
]);
?>
