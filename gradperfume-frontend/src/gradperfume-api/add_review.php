<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

require "DB.php";

$data = json_decode(file_get_contents("php://input"), true);

$perfume_id = intval($data["perfume_id"] ?? 0);
$user_id    = intval($data["user_id"] ?? 0);
$message    = trim($data["message"] ?? "");

if ($perfume_id <= 0 || $user_id <= 0 || $message === "") {
    echo json_encode([
        "success" => false,
        "message" => "Invalid data"
    ]);
    exit;
}

$stmt = $conn->prepare("
    INSERT INTO perfume_reviews (perfume_id, user_id, message)
    VALUES (?, ?, ?)
");

$stmt->bind_param("iis", $perfume_id, $user_id, $message);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Review added successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
}
