import * as $ from "./jquery.js";
import {query} from "./tools";

function update() {

    setTimeout(function () {
        let html = "<table id='table_ids'><tr><th>In Zubereitung</th><th>Abholbereit</th></tr>";
        let inProgress = [];
        let finished = [];

        let orders = query("SELECT * FROM smoothie2.orders ORDER BY change_time", "id;status").split("\n");
        orders.forEach(function (order) {
            if (order !== "EMPTY" && order !== "") {
                let order_details = order.split("\n");
                for (let i = 0; i < order_details.length; ++i) {
                    if (order_details[i] !== "") {
                        let item = order_details[i].split(";");
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

        let products = query(`SELECT smoothie2.products.name  AS product_name,
                                                     smoothie2.products.price AS product_price,
                                                     MIN(i.available)         AS ingredients_exists
                                              FROM smoothie2.products
                                                       LEFT JOIN smoothie2.ingredient_assign ia on products.id = ia.product_id
                                                       LEFT JOIN smoothie2.ingredients i on i.id = ia.ingredient_id
                                              GROUP BY smoothie2.products.name`, "product_name;product_price;ingredients_exists").split("\n");

        let not_available = Array();
        html = "";
        products.forEach(function (product) {
            if (product !== "" && product !== "EMPTY") {
                let product_details = product.split(";");
                html = html + (`<tr id='products.${product_details[0]}'><td>${product_details[0]}</td><td style="font-size: 15px; white-space: nowrap">${(parseInt(product_details[1]) / 100).toFixed(2)} €</td></tr>`);
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

$(document.body).addEventListener("onload", function () { update(); });