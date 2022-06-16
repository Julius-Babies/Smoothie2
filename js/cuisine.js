function update() {
    setTimeout(function () {
        const data = query("SELECT * FROM smoothie2.orders WHERE status = 0 ORDER BY create_time ASC", "id;create_time").split("\n");
        let html = "<table border=\"2\"><tr><th>Bestell-ID</th><th>Bestellung</th><th>Datum</th><th>Schließen</th></tr>";
        data.forEach(function (item) {
            if (item != "" && item != "EMPTY") {
                let order_data = item.split(";");
                html = html + "<tr><td>" + order_data[0] + "</td>";
                const order_components = query("SELECT * FROM smoothie2.order_details LEFT JOIN smoothie2.products ON order_details.product_id = products.id WHERE order_details.order_id = " + order_data[0], "name;amount").split("\n");
                table = "<table border=\"1\">";
                order_components.forEach(function (item) {
                    if (item != "") {
                        const order_component = item.split(";");
                        table = table + "<tr><td>" + order_component[0] + "</td><td>" + order_component[1] + "</td></tr>"
                    }
                });
                table = table + "</table>";
                html = html + "<td>" + table + "</td><td>" + order_data[1] + "</td><td onclick='query(\"UPDATE smoothie2.orders SET status = 1 WHERE id = " + order_data[0] + "\")'>Beendet!</td></tr>"
            }
        });
        html = html + "</table>";
        document.getElementById("body").innerHTML = html;
        update();
    }, 500)
}