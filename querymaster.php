<?php


function stringStartsWith($haystack, $needle, $case = true): bool
{
    if ($case) {
        return strpos($haystack, $needle) === 0;
    }
    return stripos($haystack, $needle) === 0;
}

$conn = new mysqli("localhost", $_GET["username"], $_GET["pass"]);


if ($_GET["data"] !== "" && $_GET["data"] != "LAST_ROW_ID") {
    $result = $conn->query($_GET["query"]);
    while ($row = mysqli_fetch_assoc($result)) {
        $columns = explode(";", $_GET["data"]);
        for ($i = 0; $i < count($columns); ++$i) {
            echo $row[$columns[$i]] . ";";
        }
        echo "\n";
    }
    if (mysqli_num_rows($result) === 0) {
        echo "EMPTY";
    }
} else {
    $conn->query($_GET["query"]);
    if (stringStartsWith($_GET["query"], "INSERT") && $_GET["data"] == "LAST_ROW_ID") {
        echo mysqli_insert_id($conn);
    }
}

$conn->query("DELETE FROM smoothie2.live_orders WHERE amount < 1");