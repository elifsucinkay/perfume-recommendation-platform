<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require "db.php";

$user_id = intval($_GET["user_id"] ?? 0);
$note_id = intval($_GET["note_id"] ?? 0);

$q = $conn->prepare("
    SELECT id FROM favorite_notes 
    WHERE user_id=? AND note_id=? LIMIT 1
");
$q->bind_param("ii", $user_id, $note_id);
$q->execute();
$res = $q->get_result();

echo json_encode([
    "success" => true,
    "favorite" => ($res->num_rows > 0)
]);
