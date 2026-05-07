<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");

require "db.php";

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
if ($user_id <= 0) {
    echo json_encode([]);
    exit;
}

$q = $conn->prepare("
    SELECT 
      p.id,
      p.name,
      p.brand,
      p.url,
      p.rating_value,
      r.viewed_at
    FROM recent_perfumes r
    JOIN perfumes p ON p.id = r.perfume_id
    WHERE r.user_id = ?
    ORDER BY r.viewed_at DESC
    LIMIT 4
");
$q->bind_param("i", $user_id);
$q->execute();

$res = $q->get_result();
echo json_encode($res->fetch_all(MYSQLI_ASSOC), JSON_UNESCAPED_UNICODE);
