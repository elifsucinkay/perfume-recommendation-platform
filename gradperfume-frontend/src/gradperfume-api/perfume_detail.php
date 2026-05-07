<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require "db.php";

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

$q1 = $conn->prepare("
    SELECT id, url, name, brand, country, gender, rating_value, rating_count, year,
           perfumer1, perfumer2, main_accords, created_at, description
    FROM perfumes
    WHERE id = ?
    LIMIT 1
");
$q1->bind_param("i", $id);
$q1->execute();
$res = $q1->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Perfume not found"]);
    exit;
}

$perfume = $res->fetch_assoc();

/* ---- NOTES ---- */

$q2 = $conn->prepare("
    SELECT n.id, n.name, pn.role
    FROM perfume_notes pn
    JOIN notes n ON pn.note_id = n.id
    WHERE pn.perfume_id = ?
    ORDER BY 
        CASE pn.role
            WHEN 'top' THEN 1
            WHEN 'middle' THEN 2
            WHEN 'base' THEN 3
            ELSE 4
        END
");
$q2->bind_param("i", $id);
$q2->execute();
$notesRes = $q2->get_result();

$top = [];
$middle = [];
$base = [];

while ($r = $notesRes->fetch_assoc()) {
    if ($r["role"] === "top") $top[] = $r;
    else if ($r["role"] === "middle") $middle[] = $r;
    else if ($r["role"] === "base") $base[] = $r;
}

/* ---- SIMILAR PERFUMES (BY COMMON ACCORD COUNT) ---- */

$similar = [];

if (!empty($perfume["main_accords"])) {

    // ['woody','sweet','vanilla'] → array
    $accords = json_decode(
        str_replace("'", '"', $perfume["main_accords"]),
        true
    );

    if (is_array($accords) && count($accords) > 0) {

        $conditions = [];
        $params = [];
        $types = "";

        foreach ($accords as $a) {
            $conditions[] = "main_accords LIKE ?";
            $params[] = "%$a%";
            $types .= "s";
        }

        // SCORE = kaç tane LIKE eşleşti
        $scoreSql = implode(" + ", array_map(
            fn($c) => "($c)",
            $conditions
        ));

        $sql = "
            SELECT id, name, brand, rating_value,
                   ($scoreSql) AS score
            FROM perfumes
            WHERE id != ?
            ORDER BY score DESC, rating_value DESC
            LIMIT 6
        ";

        $params[] = $id;
        $types .= "i";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();

        $similar = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}

/* ---- FAVORITE FLAG ---- */

$is_favorite = false;
if ($user_id > 0) {
    $q4 = $conn->prepare("
        SELECT 1 FROM favorite_perfumes
        WHERE user_id = ? AND perfume_id = ?
        LIMIT 1
    ");
    $q4->bind_param("ii", $user_id, $id);
    $q4->execute();
    $favRes = $q4->get_result();
    $is_favorite = ($favRes->num_rows > 0);

    // RECENT VIEW KAYDI
    $q5 = $conn->prepare("
        INSERT INTO recent_perfumes (user_id, perfume_id, viewed_at)
        VALUES (?, ?, NOW())
        ON DUPLICATE KEY UPDATE viewed_at = NOW()
    ");
    $q5->bind_param("ii", $user_id, $id);
    $q5->execute();
}

echo json_encode([
    "success" => true,
    "perfume" => $perfume,
    "notes" => [
        "top" => $top,
        "middle" => $middle,
        "base" => $base
    ],
    "similar" => $similar,
    "is_favorite" => $is_favorite
], JSON_UNESCAPED_UNICODE);
