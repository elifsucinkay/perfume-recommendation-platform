<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require "db.php"; // mysqli bağlantısı $conn

if (!isset($_GET["user_id"])) {
    echo json_encode([]);
    exit;
}

$user_id = intval($_GET["user_id"]);

// FAVORİ PARFÜMLERİ ÇEK
$q = $conn->prepare("
    SELECT 
        p.id,
        p.name,
        p.brand,
        p.url AS image_url,
        p.rating_value
    FROM favorite_perfumes fp
    JOIN perfumes p ON fp.perfume_id = p.id
    WHERE fp.user_id = ?
    ORDER BY fp.created_at DESC
");

$q->bind_param("i", $user_id);
$q->execute();
$res = $q->get_result();

$rows = [];
while ($r = $res->fetch_assoc()) {
    $rows[] = $r;
}

echo json_encode($rows, JSON_UNESCAPED_UNICODE);
