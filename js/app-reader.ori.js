function getScript(e,t){t=t||"";var a=document.createElement("script");a.src=e;var n=document.getElementsByTagName("head")[0],d=!1;a.onload=a.onreadystatechange=function(){d||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(d=!0,"function"==typeof t&&t(),a.onload=a.onreadystatechange=null,n.removeChild(a))},n.appendChild(a)}function getCss(e,t){t=t||"";var a=document.createElement("link");a.rel="stylesheet",a.href=e;var n=document.getElementsByTagName("head")[0],d=!1;a.onload=a.onreadystatechange=function(){d||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(d=!0,"function"==typeof t&&t(),a.onload=a.onreadystatechange=null)},n.appendChild(a)}
getScript("../js/lazysizes.min.js");
getScript("https://cdn.jsdelivr.net/gh/aalfiann/ajax@3.0.4/dist/ajax.min.js", function(){
    getScript("https://cdn.jsdelivr.net/npm/text-obfuscator@1.0.2/dist/text-obfuscator.min.js", function(){
        getScript("../js/crypto.min.js", function(){
            getScript("../js/reader.min.js",function(){
                getScript("https://cdn.jsdelivr.net/gh/robinparisi/tingle@0.15.2/dist/tingle.min.js",function(){
                    getCss("https://cdn.jsdelivr.net/gh/robinparisi/tingle@0.15.2/dist/tingle.min.css");
                });
            });
        });
    });
});
getScript("https://platform-api.sharethis.com/js/sharethis.js#property=5df7c13594a4f20013d38900&product=custom-share-buttons&cms=sop");