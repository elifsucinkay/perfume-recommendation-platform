<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"] ?? 0);
$note_id = intval($data["note_id"] ?? 0);
$message = trim($data["message"] ?? "");

if (!$user_id || !$note_id || $message === "") {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}

// FAVORI KONTROLÜ
$q1 = $conn->prepare("
    SELECT id FROM favorite_notes 
    WHERE user_id=? AND note_id=? LIMIT 1
");
$q1->bind_param("ii", $user_id, $note_id);
$q1->execute();
$res = $q1->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Not authorized"]);
    exit;
}

// MESAJ EKLE
$q2 = $conn->prepare("
    INSERT INTO note_chat (note_id, user_id, message, created_at)
    VALUES (?, ?, ?, NOW())
");
$q2->bind_param("iis", $note_id, $user_id, $message);
$q2->execute();

echo json_encode(["success" => true, "message" => "Message sent"]);
