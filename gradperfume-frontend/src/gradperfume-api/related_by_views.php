<?php
header("Content-Type: application/json; charset=UTF-8");
require "db.php";

$perfume_id = intval($_GET['id']);
if (!$perfume_id) {
    echo json_encode(["success" => false]);
    exit;
}

$q = $conn->prepare("
    SELECT DISTINCT p.id, p.name, p.brand, p.rating_value
    FROM recent_perfumes r
    JOIN recent_perfumes r2 ON r.user_id = r2.user_id AND r2.perfume_id != r.perfume_id
    JOIN perfumes p ON p.id = r2.perfume_id
    WHERE r.perfume_id = ?
    ORDER BY r2.viewed_at DESC
    LIMIT 12
");
$q->bind_param("i", $perfume_id);
$q->execute();
$res = $q->get_result()->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    "success" => true,
    "related" => $res
]);
