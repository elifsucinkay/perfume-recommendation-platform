<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require "db.php";

$user_id = intval($_GET["user_id"] ?? 0);
$note_id = intval($_GET["note_id"] ?? 0);

if (!$user_id || !$note_id) {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

// FAVORI KONTROLÜ
$chk = $conn->prepare("
    SELECT id FROM favorite_notes 
    WHERE user_id=? AND note_id=? LIMIT 1
");
$chk->bind_param("ii", $user_id, $note_id);
$chk->execute();
$c = $chk->get_result();

if ($c->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Not authorized"]);
    exit;
}

// MESAJLARI ÇEK
$q = $conn->prepare("
    SELECT nc.id, nc.message, nc.created_at,
           u.username, u.profile_image
    FROM note_chat nc
    JOIN users u ON nc.user_id = u.id
    WHERE nc.note_id=?
    ORDER BY nc.created_at ASC
");
$q->bind_param("i", $note_id);
$q->execute();
$res = $q->get_result();

echo json_encode([
    "success" => true,
    "messages" => $res->fetch_all(MYSQLI_ASSOC)
]);
