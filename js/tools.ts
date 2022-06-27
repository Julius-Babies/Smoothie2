import * as $ from "./jquery.js";

export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
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
  d.setTime(d.getTime() + (expire_days*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

export function query(type, data = "") {
    let serverdata:String;
    // noinspection JSUnresolvedVariable
    $.ajax({
        url: "./querymaster.php",
        method: "POST",
        async: false,
        data: {
            type: type,
            data: data
        },
        success: function (response) {
            serverdata = response;
        }
    });
    return serverdata;
}

export function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
}