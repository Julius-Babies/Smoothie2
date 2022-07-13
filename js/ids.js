import { query } from "./tools.js";
export function update(recursion = true) {
    setTimeout(function () {
        const rawData = query("cuisine.get_orders").split("\n");
        let mainTable = document.createElement("table");
        mainTable.style.tableLayout = "fixed";
        mainTable.style.borderCollapse = "collapse";
        let mainTableHeader = document.createElement("tr");
        let tableHead = document.createElement("th");
        tableHead.style.width = "100px";
        tableHead.innerText = "Bestell-ID";
        mainTableHeader.appendChild(tableHead);
        tableHead = document.createElement("th");
        tableHead.style.width = "800px";
        tableHead.innerText = "Bestellung";
        mainTableHeader.appendChild(tableHead);
        tableHead = document.createElement("th");
        tableHead.style.width = "300px";
        tableHead.innerText = "Datum";
        mainTableHeader.appendChild(tableHead);
        tableHead = document.createElement("th");
        tableHead.style.width = "300px";
        tableHead.innerText = "Schließen";
        mainTableHeader.appendChild(tableHead);
        mainTable.appendChild(mainTableHeader);
        rawData.forEach(function (item) {
            if (item !== "" && item !== "EMPTY") {
                let orderData = item.split(";");
                let row = document.createElement("tr");
                if (orderData[2] === "1") {
                    row.style.background = "lawngreen";
                }
                let id = document.createElement("td");
                id.innerText = orderData[0];
                row.appendChild(id);
                const orderComponents = query("cuisine.get_order_details", orderData[0]).split("\n");
                let orderComponentTable = document.createElement("table");
                orderComponents.forEach(function (item) {
                    if (item !== "") {
                        const orderComponent = item.split(";");
                        let orderRow = document.createElement("tr");
                        let cell = document.createElement("td");
                        cell.innerText = orderComponent[0];
                        orderRow.appendChild(cell);
                        cell = document.createElement("td");
                        cell.innerText = orderComponent[1];
                        orderRow.appendChild(cell);
                        orderComponentTable.appendChild(orderRow);
                    }
                });
                let mainTableOrderData = document.createElement("td");
                mainTableOrderData.appendChild(orderComponentTable);
                row.appendChild(mainTableOrderData);
                let orderDate = document.createElement("td");
                orderDate.innerText = orderData[1];
                row.appendChild(orderDate);
                let orderAction = document.createElement("td");
                if (orderData[2] === "0") {
                    orderAction.innerText = "Fertig";
                }
                else {
                    orderAction.innerText = "Ausgegeben";
                }
                orderAction.classList.add("order_action");
                orderAction.id = "order_action_" + orderData[0];
                row.appendChild(orderAction);
                mainTable.appendChild(row);
            }
        });
        document.querySelector("body").innerHTML = mainTable.outerHTML;
        let buttons = document.getElementsByClassName("order_action");
        for (let i = 0; i < buttons.length; i++) {
            buttons.item(i).onclick = function () {
                if (buttons.item(i).innerText == "Fertig") {
                    query("cuisine.update_status", `${buttons.item(i).id.split("_")[2]};1`);
                }
                else {
                    query("cuisine.update_status", `${buttons.item(i).id.split("_")[2]};2`);
                }
                buttons.item(i).innerText = "Bitte warten...";
            };
        }
        if (recursion) {
            update();
        }
    }, 3000);
}
//# sourceMappingURL=ids.js.map