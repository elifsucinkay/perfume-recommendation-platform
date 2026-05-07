<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require "db.php";

$page  = isset($_GET["page"]) ? max(1, intval($_GET["page"])) : 1;
$limit = 24;
$offset = ($page - 1) * $limit;

$search = isset($_GET["q"]) ? trim($_GET["q"]) : "";

if ($search !== "") {
    $stmt = $conn->prepare("
        SELECT 
            id,
            url AS imageUrl,
            name,
            brand,
            rating_value,
            rating_count,
            main_accords
        FROM perfumes
        WHERE name LIKE ?
        ORDER BY rating_value DESC
        LIMIT ? OFFSET ?
    ");
    $like = "%$search%";
    $stmt->bind_param("sii", $like, $limit, $offset);
} else {
    $stmt = $conn->prepare("
        SELECT 
            id,
            url AS imageUrl,
            name,
            brand,
            rating_value,
            rating_count,
            main_accords
        FROM perfumes
        ORDER BY rating_value DESC
        LIMIT ? OFFSET ?
    ");
    $stmt->bind_param("ii", $limit, $offset);
}

$stmt->execute();
$res = $stmt->get_result();
$data = $res->fetch_all(MYSQLI_ASSOC);

//toplam sayı (arama varsa ona göre)
if ($search !== "") {
    $countStmt = $conn->prepare("SELECT COUNT(*) FROM perfumes WHERE name LIKE ?");
    $countStmt->bind_param("s", $like);
    $countStmt->execute();
    $total = $countStmt->get_result()->fetch_row()[0];
} else {
    $total = $conn->query("SELECT COUNT(*) FROM perfumes")->fetch_row()[0];
}

echo json_encode([
    "success" => true,
    "data" => $data,
    "page" => $page,
    "total" => intval($total),
    "hasMore" => ($offset + $limit) < $total
], JSON_UNESCAPED_UNICODE);
