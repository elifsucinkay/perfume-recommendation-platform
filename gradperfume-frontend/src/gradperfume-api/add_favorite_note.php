<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"]);
$note_id = intval($data["note_id"]);

if (!$user_id || !$note_id) {
    echo json_encode(["success" => false, "message" => "Incomplete information was sent"]);
    exit;
}

$check = $conn->prepare("SELECT 1 FROM favorite_notes WHERE user_id=? AND note_id=?");
$check->bind_param("ii", $user_id, $note_id);
$check->execute();
$exists = $check->get_result();

if ($exists->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "This note is already in your favorites"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO favorite_notes (user_id, note_id) VALUES (?, ?)");
$stmt->bind_param("ii", $user_id, $note_id);
$stmt->execute();

echo json_encode(["success" => true, "message" => "Note added to favorites!"]);
