(function(){
    var pagenow = 1;
    var totalpage = 1;
    var itemPerPage = 50;
    var result = [];
    
    var dataitem = parse_query_string(window.location.search)['style'];
    var viewmode = 'default';

    var hash = parse_query_string(window.location.search)['content'];
    if(hash) {
        var link = Crypto.decode(TextObfuscator.decode(hash,3));
    }

    function hasValue(str) {
        str = str.trim();
        if(str.length > 0) {
            return true;
        }
        return false;
    }

    function escapeHTML (unsafe_str) {
        return unsafe_str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/\'/g, '&#39;')
            .replace(/\//g, '&#x2F;');
    }

    function isContain(text,value) {
        return text.indexOf(value) !== -1;
    }

    function loadImages(el,url,fullwidth,index) {
        fullwidth = (fullwidth === undefined)?false:fullwidth;
        var div = document.createElement('div');
        var img = document.createElement("img");
        img.setAttribute("class","disable-select lazyload lazypreload");
        img.setAttribute("style","display:block");
        if(fullwidth) {
            img.setAttribute("id","img_cover");
            img.setAttribute("width","100%");
        } else {
            img.setAttribute("id","img_"+index);
            img.setAttribute("style","max-width:100%;max-height:100%;display:block;");
        }
        if (!isContain(url,'img-proxy.imgfo.com')) {
            img.setAttribute("referrerpolicy","no-referrer");
        }
        img.setAttribute("data-src", url);
        div.appendChild(img);
        var src = document.getElementById(el);
        src.appendChild(div);
    }

    function loadImagePerPage(data) {
        document.getElementById("content-images").innerHTML = "";
        data.forEach(function(item,index){
            loadImages("content-images",item,false,index);
        });
    }

    function showError(el,content) {
        document.getElementById('error').innerHTML = '';
        var msg = document.createElement("div");
        msg.setAttribute("class","msg-error");
        msg.innerHTML= content;
        var x = document.getElementById(el);
        x.appendChild(msg);
        document.getElementById("data-content").style.visibility = 'hidden';
        document.getElementById("content-images").style.visibility = 'hidden';
    }

    function removeLoader(){
        document.getElementById("xoxo").innerHTML = "";
        var element = document.getElementById('preloader');
            element.parentNode.removeChild(element);
    }

    function scrollFunction() {
        var mybutton = document.getElementById("goTopBtn");
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }

    function topFunction(focus) {
        focus = (focus === undefined)?false:true;
        if(focus) {
            setTimeout(function(){
                document.getElementById('data-content').scrollIntoView();
            },100);
        } else {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
    }

    function getData(link) {
        ajax().get(link)
            .then(function(json,xhr) {
                try {
                    var newtitle = "Read Online: ";
                    if(json.hasOwnProperty('title')){
                        if(hasValue(json.title)) {
                            var atitle = escapeHTML(json.title);
                            newtitle = newtitle+atitle;
                            document.getElementById("data-content").innerHTML = "<h3>"+atitle+"</h3>";
                        }
                    }

                    if(json.hasOwnProperty('chapter')){
                        if(hasValue(json.chapter)) {
                            var achapter = escapeHTML(json.chapter);
                            newtitle = newtitle+" - Chapter: "+achapter;
                        }
                    }

                    if(json.hasOwnProperty('iframe_src')){
                        if(hasValue(json.iframe_src)) {
                            insertIframeAds(json.iframe_src);
                        }
                    }

                    if(json.hasOwnProperty('description')){
                        if(hasValue(json.description)) {
                            var adesc = escapeHTML(json.description);
                            var meta = document.createElement('meta');
                            meta.name = "description";
                            meta.content = adesc;
                            document.getElementsByTagName('head')[0].appendChild(meta);
                        }
                    }

                    if(json.hasOwnProperty('images')){
                        var ch = new ChunkHandler();
                        var totalimg = json.images.length;
                        if(json.hasOwnProperty('item_per_page')){
                            if(hasValue(json.item_per_page)) itemPerPage = json.item_per_page;
                        }
                        if(totalimg > 1 && itemPerPage > 1) {
                            var styleview = document.getElementsByClassName('change-style');
                            var xx = styleview;
                            for(var i=0;i<xx.length;i++) {
                                xx[i].style.display = "inline";
                                if(dataitem && dataitem.toLowerCase() == 'single') {
                                    itemPerPage = 1;
                                    xx[i].textContent = 'Mode Default';
                                    xx[i].href = window.location.href.replace('#','').replace('&style=single','');
                                    viewmode = 'single';
                                } else {
                                    xx[i].textContent = 'Mode Single';
                                    xx[i].href = window.location.href.replace('#','')+'&style=single';
                                    viewmode = 'default';
                                }
                            }
                        }
                        if(itemPerPage > totalimg) {
                            itemPerPage = totalimg;
                        } else {
                            showPagination();
                        }
                        result = ch.make(json.images,itemPerPage);
                        totalpage = result.length;
                        var datapage = parse_query_string(window.location.search)['page'];
                        if(datapage) {
                            var reqpage = parseInt(datapage);
                            if(reqpage > totalpage) {
                                pagenow = totalpage;
                                checkPage();
                            } else {
                                if(reqpage >= 1) {
                                    pagenow = reqpage;
                                }
                            }
                        }
                        loadImagePerPage(result[pagenow-1]);
                        fillPage('pagination-top',totalpage);
                        fillPage('pagination-bottom',totalpage);
                        setOption("pagination-top",pagenow);
                        setOption("pagination-bottom",pagenow);
                    }
                    
                    if(json.hasOwnProperty('title')){
                        if(hasValue(json.title)) document.title = newtitle;
                    }

                    var comment = document.getElementById("comment");
                    if(json.hasOwnProperty('use_comment')){
                        if(hasValue(json.use_comment)) {
                            if(json.use_comment == false || json.use_comment == 'false') {
                                comment.style.display = "none";
                            } else {
                                comment.style.display = "block";
                            }
                        } else {
                            comment.style.display = "block";
                        }
                    } else {
                        comment.style.display = "block";
                    }

                    removeLoader();
                } catch (e) {
                    showError("error","<b>Whoops!</b><p>The data source is not using a valid format!</p>");
                    removeLoader();
                }
            })
            .catch(function(error, xhr) {
                if(link.indexOf('glcdn.githack.com') > -1) {
                    link = link.replace('glcdn.githack.com','imgfo-cream.000webhostapp.com/gitlab');
                    getData(link);
                } else if(link.indexOf('rawcdn.githack.com') > -1) {
                    link = link.replace('rawcdn.githack.com','imgfo-cream.000webhostapp.com/raw');
                    getData(link);
                } else if(link.indexOf('gistcdn.githack.com') > -1) {
                    link = link.replace('gistcdn.githack.com','imgfo-cream.000webhostapp.com/gist');
                    getData(link);
                } else {
                    showError("error","<b>Whoops!</b><p>We failed to find the document you are looking for!<br>Maybe the document has been removed or deleted by the owner.</p>");
                    removeLoader();
                }
            });
    }

    if(link){
        if(isSecured()) {
            if(!isHeadless()) {
                document.getElementById("xoxo").innerHTML = "Are you human?<br>Touch the screen or Move your mouse.";
                AI.onUser(function () { 
                    if(!window.devtools.isOpen) {
                        if(document.getElementById('aiueo')){
                            if(!isBlacklistExt()) {
                                if(!isBlacklistedMobileBrowser()) {
                                    document.getElementById("xoxo").innerHTML = "Loading...";
                                    getData(link);
                                    if(isMobileDevice()) {
                                        if(isExtDetected()) {
                                            var warn = document.getElementById("warning");
                                            warn.innerHTML = '<b>Bad Extension Detected!</b><p>Please disable any image downloader extension or we give you an images with low quality!</p>';
                                            warn.style.display = 'block';
                                        }
                                    }
                                } else {
                                    showError("error","<b>This browser is not allowed for security reason!</b><p>Please use another well known browsers.</p>");
                                    removeLoader();
                                }
                            } else {
                                showError("error","<b>Bad Extension Detected!</b><p>Please disable any image downloader extensions.</p>");
                                removeLoader();
                            }
                        } else {
                            showError("error","<b>Adblocker Detected!</b><p>Please support us by disable Adblocker then reload this page!</p>");
                            removeLoader();
                        }
                    } else {
                        showError("error","<b>Whoops!</b><p>Please close the devtools and reload this page!</p>");
                        removeLoader();
                    } 
                });
            } else {
                showError("error","<b>Whoops!</b><p>Your browser is too old! Please update your browser into the latest version and reload this page!</p>");
                removeLoader();
            }
        } else {
            getData(link);
        }
    } else {
        showError("error","<b>Whoops!</b><p>There is no any data source detected!</p><p>Try to clear your browser cache sometimes will fix this.</p>");
        removeLoader();
    }

    window.onscroll = function() {scrollFunction()};

    document.getElementById("goTopBtn").addEventListener("click", function(){
        topFunction();
    });

    // pagination
    var btnPrevTop = document.getElementById("prev-page-top");
    var btnPrevBottom = document.getElementById("prev-page-bottom");
    var btnNextTop = document.getElementById("next-page-top");
    var btnNextBottom = document.getElementById("next-page-bottom");
    var paginationTop = document.getElementById("pagination-top");
    var paginationBottom = document.getElementById("pagination-bottom");
    var pagination = document.getElementsByClassName("pagination-view");

    function showPagination() {
        var x = pagination;
        for(var i=0;i<x.length;i++) {
            x[i].style.display = "inline";
        }
    }

    function setOption(el,value) {
        var div = document.getElementById(el);
        div.value =value;
    }

    function fillPage(el,totalpage) {
        var select = document.getElementById(el);
        for (var i = 1; i<=totalpage; i++){
            var opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = i;
            select.appendChild(opt);
        }
    }

    function prevPage() {
        if(pagenow >1) {
            pagenow -= 1;
            loadImagePerPage(result[pagenow-1]);
            paginationTop.value = pagenow;
            paginationBottom.value = pagenow;
        }
    }

    function nextPage(totalpage) {
        if(pagenow < totalpage) {
            pagenow += 1;
            loadImagePerPage(result[pagenow-1]);
            paginationTop.value = pagenow;
            paginationBottom.value = pagenow;
        }
    }

    function isFirstPage() {
        if(pagenow === 1) {
            return true;
        }
        return false;
    }

    function isLastPage() {
        if(pagenow === totalpage) {
            return true;
        }
        return false;
    }

    function checkPage() {
        if(isFirstPage()) {
            btnPrevTop.style.display = "none";
            btnPrevBottom.style.display = "none";
        } else {
            btnPrevTop.style.display = "inline";
            btnPrevBottom.style.display = "inline";
        }
        if(isLastPage()) {
            btnNextTop.style.display = "none";
            btnNextBottom.style.display = "none";
        } else {
            btnNextTop.style.display = "inline";
            btnNextBottom.style.display = "inline";
        }
    }

    function nextImageSingle() {
        nextPage(totalpage);
        checkPage();
        topFunction(true);
    }

    paginationTop.addEventListener("change", function(){
        pagenow = parseInt(this.options[this.selectedIndex].value);
        loadImagePerPage(result[pagenow-1]);
        setOption("pagination-bottom",pagenow);
        checkPage();
    });

    paginationBottom.addEventListener("change", function(){
        pagenow = parseInt(this.options[this.selectedIndex].value);
        loadImagePerPage(result[pagenow-1]);
        setOption("pagination-top",pagenow);
        checkPage();
        topFunction(true);
    });

    document.getElementById("prev-page-top").addEventListener("click", function(){
        prevPage();
        checkPage();
    });

    document.getElementById("next-page-top").addEventListener("click", function(){
        nextPage(totalpage);
        checkPage();
    });

    document.getElementById("prev-page-bottom").addEventListener("click", function(){
        prevPage();
        checkPage();
        topFunction(true);
    });

    document.getElementById("next-page-bottom").addEventListener("click", function(){
        nextPage(totalpage);
        checkPage();
        topFunction(true);
    });

    document.getElementById("content-images").addEventListener("click", function(){
        if(viewmode === 'single' || itemPerPage == 1) {
            nextImageSingle();
        }
    });

    document.onkeydown = function(e) {
        if(isSecured()) {
            if (e.ctrlKey && 
                (e.keyCode === 67 || //ctrl+c
                    e.keyCode === 86 || //ctrl+v
                    e.keyCode === 85 || //ctrl+u
                    e.keyCode === 117 || //ctrl+F6
                    e.shiftKey && e.keyCode===73)) { //ctrl+shift+i
                return false;
            } else if (e.keyCode === 123){ //F12
                return false;
            } else if (e.keyCode == '37') { // Left Arrow
                if(pagination[0].style.display === "inline") {
                    prevPage();
                    checkPage();
                    topFunction(true);
                }
            }
            else if (e.keyCode == '39') { // Right Arrow
                if(pagination[0].style.display === "inline") {
                    nextPage(totalpage);
                    checkPage();
                    topFunction(true);
                }
            }
        } else {
            if (e.keyCode == '37') { // Left Arrow
                if(pagination[0].style.display === "inline") {
                    prevPage();
                    checkPage();
                    topFunction(true);
                }
            }
            else if (e.keyCode == '39') { // Right Arrow
                if(pagination[0].style.display === "inline") {
                    nextPage(totalpage);
                    checkPage();
                    topFunction(true);
                }
            }
        }
    };

    document.addEventListener('lazyloaded',function(e) {
        var imgp = e.target.parentNode;
        if(screen.width > 870) {
            var cvs = document.createElement('canvas');
            if(e.target.id === 'img_cover') {
                cvs.id = e.target.id+"_cvs";
                cvs.setAttribute("width",e.target.clientWidth);
                cvs.setAttribute("height",e.target.clientHeight);
                imgp.appendChild(cvs);
                var c = document.getElementById(e.target.id+"_cvs");
                var ctx = c.getContext("2d");
                var img = document.getElementById(e.target.id);
                ctx.drawImage(img, 0,0,e.target.clientWidth,e.target.clientHeight);
            } else if (e.target.id !== 'frm_banner_top' && e.target.id !== 'frm_banner_bottom') {
                cvs.id = e.target.id+"_cvs";
                cvs.setAttribute("width",e.target.clientWidth);
                cvs.setAttribute("height",e.target.clientHeight);
                cvs.setAttribute("style","display:block");
                imgp.appendChild(cvs);
                var c = document.getElementById(e.target.id+"_cvs");
                var ctx = c.getContext("2d");
                var img = document.getElementById(e.target.id);
                ctx.drawImage(img, 0,0,e.target.clientWidth,e.target.clientHeight);
            }
            if (e.target.id !== 'frm_banner_top' && e.target.id !== 'frm_banner_bottom') {
                var image_x = document.getElementById(e.target.id);
                image_x.parentNode.removeChild(image_x);
            }
        } else if(isExtDetected()) {
            var cvs = document.createElement('canvas');
            if(e.target.id === 'img_cover') {
                cvs.id = e.target.id+"_cvs";
                cvs.setAttribute("width",e.target.clientWidth);
                cvs.setAttribute("height",e.target.clientHeight);
                imgp.appendChild(cvs);
                var c = document.getElementById(e.target.id+"_cvs");
                var ctx = c.getContext("2d");
                var img = document.getElementById(e.target.id);
                ctx.drawImage(img, 0,0,e.target.clientWidth,e.target.clientHeight);
            } else if (e.target.id !== 'frm_banner_top' && e.target.id !== 'frm_banner_bottom') {
                cvs.id = e.target.id+"_cvs";
                cvs.setAttribute("width",e.target.clientWidth);
                cvs.setAttribute("height",e.target.clientHeight);
                cvs.setAttribute("style","display:block");
                imgp.appendChild(cvs);
                var c = document.getElementById(e.target.id+"_cvs");
                var ctx = c.getContext("2d");
                var img = document.getElementById(e.target.id);
                ctx.drawImage(img, 0,0,e.target.clientWidth,e.target.clientHeight);
            }
            if (e.target.id !== 'frm_banner_top' && e.target.id !== 'frm_banner_bottom') {
                var image_x = document.getElementById(e.target.id);
                image_x.parentNode.removeChild(image_x);
            }
        }
    });

    window.addEventListener('devtoolschange', function(event) {
        if(event.detail.isOpen) {
            if(isSecured()) {
                var z = pagination;
                for(var i=0;i<z.length;i++) {
                    z[i].style.display = "none";
                }
                var zz = document.getElementsByClassName('change-style');
                for(var i=0;i<zz.length;i++) {
                    zz[i].style.display = "none";
                }
                document.getElementById("data-content").innerHTML = '';
                document.getElementById("content-images").innerHTML = '';
                showError("error","<b>Whoops!</b><p>Please close the devtools and reload this page!</p>");
            }
        }
    });

    // banner ads
    // function insertBannerAds(el,src,width,height) {
    //     var ifrm = document.createElement("iframe");
    //     ifrm.setAttribute("class", "lazyload");
    //     ifrm.setAttribute("id","frm_"+el);
    //     ifrm.setAttribute("src", src);
    //     ifrm.setAttribute("width",width);
    //     ifrm.setAttribute("height",height);
    //     ifrm.setAttribute("scrolling","no");
    //     ifrm.setAttribute("marginwidth","0");
    //     ifrm.setAttribute("marginheight","0");
    //     ifrm.setAttribute("frameborder","0");
    //     document.getElementById(el).appendChild(ifrm);
    // }

    // native ads
    function insertNativeAds(el,idzone,src) {
        var ntv = document.createElement('script');
        ntv.setAttribute('data-idzone',idzone);
        ntv.setAttribute('src',src);
        ntv.setAttribute('async','');
        document.getElementById(el).appendChild(ntv);
    }

    function insertIframeAds(src) {
        var ifr = document.createElement('iframe');
        ifr.setAttribute('src', src);
        ifr.setAttribute('frameborder', '0');
        ifr.setAttribute('scrolling', 'no');
        ifr.setAttribute('style', 'width:100%;max-width:300px;height:100%;max-height:300px;');
        ifr.setAttribute('async','');
        document.getElementById('native_content_bottom').appendChild(ifr);
    }

    if(isMobileDevice()) {
        insertNativeAds('native_content','3668865','https://a.exdynsrv.com/nativeads.js');
        // insertNativeAds('native_top','3668863','https://a.exdynsrv.com/nativeads.js');
        // insertNativeAds('native_bottom','3668865','https://a.exdynsrv.com/nativeads.js');
    } else {
        insertNativeAds('native_content','3654503','https://a.exdynsrv.com/nativeads.js');
        // insertNativeAds('native_top','3654495','https://a.exdynsrv.com/nativeads.js');
        // insertNativeAds('native_bottom','3654503','https://a.exdynsrv.com/nativeads.js');
    }

    // Disqus comment
    document.getElementById("show-comment").addEventListener("click", function(){
        getScript('../js/disqus.min.js',function(){
            showComment(hash);
        });
        this.style.display = "none";
    });

    var fullpath = window.location.href;
    fullpath = fullpath.replace('embed','view');
    document.getElementById('view-original').href = fullpath;

    // Set Fullscreen
    document.getElementById("fullscreenBtn").style.display = "block";
    document.getElementById("fullscreenBtn").addEventListener("click", function(){
        setFullscreen('main-content');
    });
    function setFullscreen(elementid){
        var el = document.getElementById(elementid);
        if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (el.requestFullscreen) {
                el.requestFullscreen();
            } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            }
        } else {
            if (document.cancelFullScreen) {  
                document.cancelFullScreen();  
            } else if (document.mozCancelFullScreen) {  
                document.mozCancelFullScreen();  
            } else if (document.webkitCancelFullScreen) {  
                document.webkitCancelFullScreen();  
            }
        }
    }

})();