<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require "db.php";

$user_id = intval($_GET["user_id"] ?? 0);
if (!$user_id) {
    echo json_encode(["success" => false, "message" => "No user id"]);
    exit;
}

// Örnek: yorum sayısı + review_like sayısından reputasyon
$reviews = $conn
  ->query("SELECT COUNT(*) AS c FROM reviews WHERE user_id = $user_id")
  ->fetch_assoc()["c"] ?? 0;

$likes = $conn
  ->query("SELECT COUNT(*) AS c FROM review_likes WHERE user_id = $user_id")
  ->fetch_assoc()["c"] ?? 0;

$score = (int)($reviews * 5 + $likes * 2);

$badge = null;
$level = 1;

if ($score > 200) { $badge = "Sillage Master"; $level = 4; }
elseif ($score > 100) { $badge = "Fragrance Guru"; $level = 3; }
elseif ($score > 40) { $badge = "Note Explorer"; $level = 2; }

echo json_encode([
  "success" => true,
  "score"   => $score,
  "badge"   => $badge,
  "level"   => $level
], JSON_UNESCAPED_UNICODE);
