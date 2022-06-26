<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Küchenansicht</title>
    <script src="js/cuisine.js" type="text/javascript"></script>
    <style rel="stylesheet">
        table, th, td {
            border: 1px solid;
        }
    </style>
</head>
<body>
    <h1>Lade Bestellungen</h1>

    <?php

    if (isset($_GET["change_status"])) {
        $conn = new mysqli("localhost", "webserver", "cloudiaserver");
        $conn->query("UPDATE smoothie2.orders SET status = {$_GET["status"]} WHERE id = {$_GET["change_status"]}");
        echo "<script>window.close();</script>";
    }

    ?>

</body>
</html>