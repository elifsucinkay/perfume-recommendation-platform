<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"] ?? 0);
$note_id = intval($data["note_id"] ?? 0);

if (!$user_id || !$note_id) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}

// CHECK IF EXISTS
$q = $conn->prepare("
    SELECT id FROM favorite_notes 
    WHERE user_id=? AND note_id=? LIMIT 1
");
$q->bind_param("ii", $user_id, $note_id);
$q->execute();
$res = $q->get_result();

if ($res->num_rows > 0) {
    // REMOVE FAVORITE
    $del = $conn->prepare("DELETE FROM favorite_notes WHERE user_id=? AND note_id=?");
    $del->bind_param("ii", $user_id, $note_id);
    $del->execute();

    echo json_encode([
        "success" => true,
        "favorited" => false,
        "message" => "Removed from favorites"
    ]);
    exit;
}

// ADD FAVORITE
$ins = $conn->prepare("
    INSERT INTO favorite_notes (user_id, note_id, created_at)
    VALUES (?, ?, NOW())
");
$ins->bind_param("ii", $user_id, $note_id);
$ins->execute();

echo json_encode([
    "success" => true,
    "favorited" => true,
    "message" => "Added to favorites"
]);
