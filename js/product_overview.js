import { query } from "./tools.js";
export function initPage() {
    let ingredients = document.getElementsByClassName("ingredient");
    for (let i = 0; i < ingredients.length; i++) {
        ingredients.item(i).onclick = function () {
            query("administration.change_ingredient", `${ingredients.item(i).id.split("_")[1]};${ingredients.item(i).id.split("_")[2]}`);
            window.location.reload();
        };
    }
}
//# sourceMappingURL=product_overview.js.map