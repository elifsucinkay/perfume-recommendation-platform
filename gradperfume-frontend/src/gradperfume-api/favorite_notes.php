<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require "db.php";

$user_id = $_GET["user_id"] ?? null;

if (!$user_id) {
    echo json_encode([]);
    exit;
}

$q = $conn->query("
    SELECT n.id, n.name
    FROM favorite_notes fn
    JOIN notes n ON fn.note_id = n.id
    WHERE fn.user_id=$user_id
");

echo json_encode($q->fetch_all(MYSQLI_ASSOC));
?>
