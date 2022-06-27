<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Küchenansicht</title>
    <script src="js/jquery.js" type="text/javascript"></script>
    <script src="js/tools.js" type="text/javascript"></script>
    <script src="js/cuisine.js" type="text/javascript"></script>
    <style rel="stylesheet">
        table, th, td {
            border: 1px solid;
        }
    </style>
</head>
<body id="body" <?php if (!isset($_GET["change_status"])) { echo 'onload="update()"'; } ?> >

    <h1>Lade Bestellungen</h1>

    <?php

    if (isset($_GET["change_status"])) {
        echo "<script> query(\"cuisine.update_status\", \"$_GET[change_status];$_GET[status]\"); window.close();</script>";
    }

    ?>

</body>
</html>