<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require "db.php";

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

//RECENTLY VIEWED (SON 4 PARFÜM)

$recent = [];

if ($user_id > 0) {
    $qr = $conn->prepare("
        SELECT 
            p.id,
            p.name,
            p.brand,
            p.rating_value,
            p.url,
            p.main_accords
        FROM recent_perfumes r
        JOIN perfumes p ON p.id = r.perfume_id
        WHERE r.user_id = ?
        ORDER BY r.viewed_at DESC
        LIMIT 4
    ");
    $qr->bind_param("i", $user_id);
    $qr->execute();
    $recent = $qr->get_result()->fetch_all(MYSQLI_ASSOC);
}

//RECOMMENDED (FAVORİ MARKALARA GÖRE)

$recommended = [];

if ($user_id > 0) {
    $qf = $conn->prepare("
        SELECT 
            p2.id,
            p2.name,
            p2.brand,
            p2.rating_value,
            p2.url,
            p2.main_accords
        FROM favorite_perfumes f
        JOIN perfumes p1 ON p1.id = f.perfume_id
        JOIN perfumes p2 
            ON p2.brand = p1.brand 
           AND p2.id != p1.id
        WHERE f.user_id = ?
        GROUP BY p2.id
        ORDER BY p2.rating_value DESC
        LIMIT 8
    ");
    $qf->bind_param("i", $user_id);
    $qf->execute();
    $recommended = $qf->get_result()->fetch_all(MYSQLI_ASSOC);
}

//POPULAR (GENEL EN YÜKSEK PUANLILAR)

$qp = $conn->query("
    SELECT 
        id,
        name,
        brand,
        rating_value,
        url,
        main_accords
    FROM perfumes
    ORDER BY rating_value DESC, rating_count DESC
    LIMIT 8
");
$popular = $qp->fetch_all(MYSQLI_ASSOC);

//JSON OUTPUT

echo json_encode([
    "recent" => $recent,
    "recommended" => $recommended,
    "popular" => $popular
], JSON_UNESCAPED_UNICODE);
