<?php
header("Content-Type: application/json; charset=UTF-8");
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$uid = intval($data["user_id"] ?? 0);
$rid = intval($data["review_id"] ?? 0);

if (!$uid || !$rid) {
    echo json_encode(["success" => false]);
    exit;
}

$q = $conn->query("SELECT 1 FROM review_likes WHERE user_id=$uid AND review_id=$rid");

if ($q->num_rows) {
    $conn->query("DELETE FROM review_likes WHERE user_id=$uid AND review_id=$rid");
    echo json_encode(["success" => true, "liked" => false]);
} else {
    $conn->query("INSERT INTO review_likes (user_id, review_id) VALUES ($uid,$rid)");
    echo json_encode(["success" => true, "liked" => true]);
}
