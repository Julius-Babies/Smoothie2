import * as $ from './jquery.js';
import { query } from "./tools";
function update(recursion = true) {
    setTimeout(function () {
        const data = query("cuisine.get_orders").split("\n");
        let html = "<table style='table-layout: fixed; border-collapse: collapse'><tr><th style='width: 100px'>Bestell-ID</th><th style='width: 800px'>Bestellung</th><th style='width: 300px;'>Datum</th><th style='width: 300px;'>Schließen</th></tr>";
        data.forEach(function (item) {
            if (item !== "" && item !== "EMPTY") {
                let order_data = item.split(";");
                if (order_data[2] === "1") {
                    html = html + "<tr style='background: lawngreen'><td>" + order_data[0] + "</td>";
                }
                else {
                    html = html + "<tr><td>" + order_data[0] + "</td>";
                }
                const order_components = query("cuisine.get_order_details", order_data[0]).split("\n");
                let table = "<table>";
                order_components.forEach(function (item) {
                    if (item !== "") {
                        const order_component = item.split(";");
                        table = `${table}<tr><td>${order_component[0]}</td><td>${order_component[1]}</td></tr>`;
                    }
                });
                table = table + "</table>";
                if (order_data[2] === "0") {
                    html = `${html}<td>${table}</td><td>${order_data[1]}</td><td><a href='cuisine.php?change_status=${order_data[0]}&status=1' target='_blank'>Fertig!</a></td></tr>`;
                }
                else {
                    html = `${html}<td>${table}</td><td>${order_data[1]}</td><td><a href='cuisine.php?change_status=${order_data[0]}&status=2' target='_blank'>Ausgegeben!</a></td></tr>`;
                }
            }
        });
        html = html + "</table>";
        document.getElementById("body").innerHTML = html;
        if (recursion) {
            update();
        }
    }, 2000);
}
$(document.body).addEventListener("onload", function () { update(true); });
//# sourceMappingURL=cuisine.js.map