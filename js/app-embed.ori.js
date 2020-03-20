function getScript(e,t){t=t||"";var a=document.createElement("script");a.src=e;var n=document.getElementsByTagName("head")[0],d=!1;a.onload=a.onreadystatechange=function(){d||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(d=!0,"function"==typeof t&&t(),a.onload=a.onreadystatechange=null,n.removeChild(a))},n.appendChild(a)}function getCss(e,t){t=t||"";var a=document.createElement("link");a.rel="stylesheet",a.href=e;var n=document.getElementsByTagName("head")[0],d=!1;a.onload=a.onreadystatechange=function(){d||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(d=!0,"function"==typeof t&&t(),a.onload=a.onreadystatechange=null)},n.appendChild(a)}
getScript("../js/lazysizes.min.js");
getScript("../js/ads.js");
getScript("https://cdn.jsdelivr.net/gh/aalfiann/ajax@3.0.4/dist/ajax.min.js", function(){
    getScript("../js/ext.min.js", function(){
        getScript("../js/tobs.min.js", function(){
            getScript("../js/crypto.min.js", function(){
                getScript("../js/ai.min.js", function(){
                    getScript("https://cdn.jsdelivr.net/npm/chunk-handler@1.2.0/dist/chunkhandler.min.js",function(){
                        getScript("../js/embed.min.js",function(){
                            getCss("../css/social.min.css");
                        });
                    });
                });
            });
        });
    });
});