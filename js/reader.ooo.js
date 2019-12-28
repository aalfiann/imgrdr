(function(){
    var imgreader_version = "1.5.0";
    var pagenow = 1;
    var totalpage = 1;
    var itemPerPage = 50;
    var result = [];
    
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

    function loadImages(el,url,fullwidth,index) {
        fullwidth = (fullwidth === undefined)?false:fullwidth;
        var div = document.createElement('div');
        var img = document.createElement("img");
        img.setAttribute("class","lazyload");
        img.setAttribute("style","display:block");
        if(fullwidth) {
            img.setAttribute("id","img_cover");
            img.setAttribute("width","100%");
        } else {
            img.setAttribute("id","img_"+index);
            img.setAttribute("style","max-width:100%;max-height:100%;");
        }
        img.setAttribute("referrerpolicy","no-referrer")
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
        var msg = document.createElement("div");
        msg.setAttribute("class","msg-error");
        msg.innerHTML= content;
        var x = document.getElementById(el);
        x.appendChild(msg);
        document.getElementById("data-content").style.visibility = 'hidden';
        document.getElementById("content-images").style.visibility = 'hidden';
    }

    function removeLoader(){
        var element = document.getElementById('preloader');
            element.parentNode.removeChild(element);
    }

    function showAbout(){
        var modal = new tingle.modal({
            footer: true,
            stickyFooter: false,
            closeMethods: ['overlay', 'button', 'escape']
        });
        modal.setContent('<h3>ImgReader - v.'+imgreader_version+'</h3><p>Makes your images content to become easier to read.</p>');
        modal.addFooterBtn('Create Your Own', 'tingle-btn tingle-btn--primary', function() {
            window.location='../';
        });

        modal.open();
    }

    function scrollFunction() {
        var mybutton = document.getElementById("goTopBtn");
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }

    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    function getData(link) {
        ajax().get(link)
            .then(function(json,xhr) {
                try {
                    var newtitle = "Read Online: ";
                    if(json.hasOwnProperty('title')){
                        if(hasValue(json.title)) {
                            var atitle = escapeHTML(json.title);
                            document.getElementById('content-title').innerHTML = atitle;
                            newtitle = newtitle+atitle;
                        }
                    }

                    if(json.hasOwnProperty('original')){
                        if(hasValue(json.original)) {
                            document.getElementById('content-original').innerHTML = escapeHTML(json.original);
                            document.getElementById('tb-original').style.display = "block";
                        }
                    }

                    if(json.hasOwnProperty('genre')){
                        if(hasValue(json.genre)) {
                            document.getElementById('content-genre').innerHTML = escapeHTML(json.genre);
                            document.getElementById('tb-genre').style.display = "block";
                        }
                    }

                    if(json.hasOwnProperty('author')){
                        if(hasValue(json.author)) {
                            document.getElementById('content-author').innerHTML = escapeHTML(json.author);
                            document.getElementById('tb-author').style.display = "block";
                        }
                    }

                    if(json.hasOwnProperty('chapter')){
                        if(hasValue(json.chapter)) {
                            var achapter = escapeHTML(json.chapter);
                            document.getElementById('content-chapter').innerHTML = achapter;
                            document.getElementById('tb-chapter').style.display = "block";
                            newtitle = newtitle+" - Chapter: "+achapter;
                        }
                    }

                    if(json.hasOwnProperty('release_date')){
                        if(hasValue(json.release_date)) {
                            document.getElementById('content-release').innerHTML = escapeHTML(json.release_date);
                            document.getElementById('tb-release').style.display = "block";
                        }
                    }

                    if(json.hasOwnProperty('description')){
                        if(hasValue(json.description)) {
                            var adesc = escapeHTML(json.description);
                            var div_desc = document.getElementById('content-description');
                            div_desc.setAttribute("class","hero");
                            div_desc.innerHTML = "<b>Description:</b><p>"+adesc+"</p>";
                            var meta = document.createElement('meta');
                            meta.name = "description";
                            meta.content = adesc;
                            document.getElementsByTagName('head')[0].appendChild(meta);
                        }
                    }

                    if(json.hasOwnProperty('backlink')){
                        if(hasValue(json.backlink)) {
                            document.getElementById('backlink').innerHTML = '&#x2190; Back';
                            document.getElementById('backlink').href = json.backlink;
                        } else {
                            document.getElementById('backlink').href = "../";
                        }
                    } else {
                        document.getElementById('backlink').href = "../";
                    }

                    if(json.hasOwnProperty('cover')){
                        if(hasValue(json.cover)) {
                            loadImages("content-cover",json.cover,true);
                        }
                    }

                    if(json.hasOwnProperty('download')){
                        if(hasValue(json.download)) {
                            var dl = document.createElement('a');
                            dl.href = json.download;
                            dl.innerText = "Download";
                            document.getElementById("menunav").appendChild(dl);
                        }
                    }

                    if(json.hasOwnProperty('images')){
                        var ch = new ChunkHandler();
                        if(json.hasOwnProperty('item_per_page')){
                            if(hasValue(json.item_per_page)) itemPerPage = json.item_per_page;
                        }
                        var totalimg = json.images.length;
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
                        document.getElementById('content-files').innerText = totalimg;
                    }

                    if(json.hasOwnProperty('translator')){
                        if(hasValue(json.translator)) {
                            document.getElementById('content-translator').innerHTML = escapeHTML(json.translator);
                            document.getElementById('tb-translator').style.display = "block";
                        }
                    }

                    if(json.hasOwnProperty('status')){
                        if(hasValue(json.status)) {
                            document.getElementById('content-status').innerHTML = escapeHTML(json.status);
                            document.getElementById('tb-status').style.display = "block";
                        }
                    }
                    
                    if(json.hasOwnProperty('title')){
                        if(hasValue(json.title)) document.title = newtitle;
                    }

                    document.getElementById("share").style.display = "block";

                    removeLoader();
                } catch (e) {
                    showError("error","<b>Whoops!</b><p>The data source is not using a valid format!</p>");
                    removeLoader();
                }
            })
            .catch(function(error, xhr) {
                showError("error","<b>Whoops!</b><p>We failed to find the document you are looking for!<br>Maybe the document has been removed or deleted by the owner.</p>");
                removeLoader();
            });
    }

    if(link){
        if(isSecured()) {
            if(!isHeadless()) {
                document.getElementById("xoxo").innerHTML = "Are you human?<br>Touch the screen or Move your mouse.";
                AI.onUser(function () { 
                    if(!window.devtools.isOpen) {
                        if(document.getElementById('aiueo')){
                            getData(link);
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
        showError("error","<b>Whoops!</b><p>There is no any data source detected!</p>");
        removeLoader();
    }

    window.onscroll = function() {scrollFunction()};

    document.getElementById("goTopBtn").addEventListener("click", function(){
        topFunction();
    });

    document.getElementById("about").addEventListener("click", function(){
        showAbout();
    });

    document.getElementById('copyrightyear').innerHTML= new Date().getFullYear();

    // pagination
    var btnPrevTop = document.getElementById("prev-page-top");
    var btnPrevBottom = document.getElementById("prev-page-bottom");
    var btnNextTop = document.getElementById("next-page-top");
    var btnNextBottom = document.getElementById("next-page-bottom");
    var paginationTop = document.getElementById("pagination-top");
    var paginationBottom = document.getElementById("pagination-bottom");
    var pagination = document.getElementsByClassName("pagination");

    function showPagination() {
        var x = pagination;
        for(var i=0;i<x.length;i++) {
            x[i].style.display = "block";
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
    });

    document.getElementById("next-page-bottom").addEventListener("click", function(){
        nextPage(totalpage);
        checkPage();
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
                if(pagination[0].style.display === "block") {
                    prevPage();
                    checkPage();
                }
            }
            else if (e.keyCode == '39') { // Right Arrow
                if(pagination[0].style.display === "block") {
                    nextPage(totalpage);
                    checkPage();
                }
            }
        } else {
            if (e.keyCode == '37') { // Left Arrow
                if(pagination[0].style.display === "block") {
                    prevPage();
                    checkPage();
                }
            }
            else if (e.keyCode == '39') { // Right Arrow
                if(pagination[0].style.display === "block") {
                    nextPage(totalpage);
                    checkPage();
                }
            }
        }
    };

    document.addEventListener('lazyloaded',function(e) {
        var imgp = e.target.parentNode;
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
        } else {
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
        var image_x = document.getElementById(e.target.id);
        image_x.parentNode.removeChild(image_x);
    });

    // social media
    var curlink = encodeURIComponent(window.location.href);
    var curtitle = encodeURIComponent(document.title);
    document.getElementById("sb_facebook").href = "https://facebook.com/sharer/sharer.php?u="+curlink;
    document.getElementById("sb_twitter").href = "https://twitter.com/intent/tweet/?text="+curtitle+"&amp;url="+curlink;
    document.getElementById("sb_email").href = "mailto:?subject="+curtitle+"&amp;body="+curlink;
    document.getElementById("sb_reddit").href = "https://reddit.com/submit/?url="+curlink+"&amp;resubmit=true&amp;title="+curtitle;
    document.getElementById("sb_xing").href = "https://www.xing.com/app/user?op=share;url="+curlink+";title="+curtitle;
    document.getElementById("sb_whatsapp").href = "whatsapp://send?text="+curtitle+"%20"+curlink;
    document.getElementById("sb_hacker").href = "https://news.ycombinator.com/submitlink?u="+curlink+"&amp;t="+curtitle;
    document.getElementById("sb_vk").href = "http://vk.com/share.php?title="+curtitle+"&amp;url="+curlink;

})();