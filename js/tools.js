// export for others scripts to use
export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
export function setCookie(name, value, expire_days) {
    const d = new Date();
    d.setTime(d.getTime() + (expire_days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
export function query(type, data = "") {
    return ajax("./querymaster.php", "POST", `type=${type}&data=${data}`, false);
}
export function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
}
export function ajax(url, method, data, async) {
    method = typeof method !== 'undefined' ? method : 'GET';
    async = typeof async !== 'undefined' ? async : false;
    let xhReq;
    if (window.XMLHttpRequest) {
        xhReq = new XMLHttpRequest();
    }
    else {
        xhReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (method == 'POST') {
        xhReq.open(method, url, async);
        xhReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhReq.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhReq.send(data);
    }
    else {
        if (typeof data !== 'undefined' && data !== null) {
            url = url + '?' + data;
        }
        xhReq.open(method, url, async);
        xhReq.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhReq.send(null);
    }
    return xhReq.responseText;
    //alert(serverResponse);
}
export function readTextFile(file, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == 200) {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}
//# sourceMappingURL=tools.js.map