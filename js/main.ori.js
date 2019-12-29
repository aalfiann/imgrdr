var domainorigin = 'imgfo.com';
var uniquepath = '';
var urla = window.location.href;
var urlb = urla.split('//');
var urlc = urlb[1];
var domain = '';
if(urlc.indexOf('/')>0) {
    urlc = urlc.split('/');
    domain = urlc[0];
} else {
    domain = urlc;
}
if(domain !== domainorigin) {
    urla = urla.replace(domain,domainorigin);
    if(uniquepath) {
        if(urla.indexOf(uniquepath)>0) { // detect if direct mirror ("view" is the unique path of your address)
            location.href = urla;
        } else { // detect if proxy mirror
            location.href = domainorigin;
        }
    } else {
        location.href = domainorigin;
    }
}
function getScript(e,t){t=t||"";var a=document.createElement("script");a.src=e;var n=document.getElementsByTagName("head")[0],d=!1;a.onload=a.onreadystatechange=function(){d||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(d=!0,"function"==typeof t&&t(),a.onload=a.onreadystatechange=null,n.removeChild(a))},n.appendChild(a)}function getCss(e,t){t=t||"";var a=document.createElement("link");a.rel="stylesheet",a.href=e;var n=document.getElementsByTagName("head")[0],d=!1;a.onload=a.onreadystatechange=function(){d||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(d=!0,"function"==typeof t&&t(),a.onload=a.onreadystatechange=null)},n.appendChild(a)}
getScript("https://cdn.jsdelivr.net/npm/native-form-validation@1.0.1/dist/formvalidation.min.js", function(){
    getScript("js/tobs.min.js", function(){
        getScript("js/crypto.min.js", function(){
            getScript("js/app.min.js");
        });
    });
});