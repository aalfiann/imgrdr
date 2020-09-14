function getScript(e,t){t=t||"";var a=document.createElement("script");a.src=e;var n=document.getElementsByTagName("head")[0],d=!1;a.onload=a.onreadystatechange=function(){d||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(d=!0,"function"==typeof t&&t(),a.onload=a.onreadystatechange=null,n.removeChild(a))},n.appendChild(a)}function getCss(e,t){t=t||"";var a=document.createElement("link");a.rel="stylesheet",a.href=e;var n=document.getElementsByTagName("head")[0],d=!1;a.onload=a.onreadystatechange=function(){d||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(d=!0,"function"==typeof t&&t(),a.onload=a.onreadystatechange=null)},n.appendChild(a)}
getScript("js/lazysizes.min.js");
getScript("https://cdn.jsdelivr.net/npm/native-form-validation@1.0.1/dist/formvalidation.min.js", function(){
    getScript("js/tobs.min.js", function(){
        getScript("js/crypto.min.js", function(){
            getScript("js/app.min.js", function() {
                getScript("js/tln.min.js", function() {
                    getCss("css/tln.min.css", function() {
                        TLN.append_line_numbers('content-images');
                    });
                })
            });
        });
    });
});