function update() {

    setTimeout(function () {
        let html = "<table id='table_ids'><tr><th>In Zubereitung</th><th>Abholbereit</th></tr>";
        let inProgress = [];
        let finished = [];

        let orders = query("id_viewer.get_ids").split("\n");
        orders.forEach(function (order) {
            if (order !== "EMPTY" && order !== "") {
                order = order.split("\n");
                for (let i = 0; i < order.length; ++i) {
                    if (order[i] !== "") {
                        let item = order[i].split(";");
                        if (item[1] === "0") {
                            inProgress.push(item[0]);
                        }
                        if (item[1] === "1") {
                            finished.push(item[0]);
                        }
                    }
                }
            }
        });

        let rows;

        if (inProgress.length < finished.length) {
            rows = finished.length;
        } else {
            rows = inProgress.length;
        }

        for (let i = 0; i < rows; ++i) {
            let progress_id0 = inProgress[2 * i];
            if (progress_id0 === undefined) { progress_id0 = ""; } else { progress_id0 = `<span>${progress_id0}</span>`; }
            let progress_id1 = inProgress[2 * i + 1];
            if (progress_id1 === undefined) { progress_id1 = ""; } else { progress_id1 = `<span>${progress_id1}</span>`; }
            let finished_id = finished[i];
            if (finished_id === undefined) { finished_id = ""; } else { finished_id = `<span>${finished_id}</span>`; }
            html = `${html}
<tr><td>${progress_id0}${progress_id1}</td><td>${finished_id}</td></tr>`;
        }

        document.getElementById("id_viewer").innerHTML = html + "</table>";

        html = "";

        let products = query("id_viewer.get_products").split("\n");

        let not_available = Array();
        html = "";
        products.forEach(function (product) {
            if (product !== "" && product !== "EMPTY") {
                product = product.split(";");
                html = html + (`<tr id='products.${product[0]}'><td>${product[0]}</td><td style="font-size: 15px; white-space: nowrap">${(product[1] / 100).toFixed(2)} €</td></tr>`);
                if (product[2] === "0") {
                    not_available.push(product[0])
                }
            }
        });

        document.getElementById("table_products").innerHTML = html;
        not_available.forEach(function(item) {
            document.getElementById("products." + item).classList.add("not-available");
        });

        update();

    }, 500);
}