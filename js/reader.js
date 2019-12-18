(function(){
    var imgreader_version = "1.1.2";
    function parse_query_string(e){for(var o=e.replace("?","").split("&"),n={},t=0;t<o.length;t++){var d=o[t].split("="),p=decodeURIComponent(d[0]),r=decodeURIComponent(d[1]);if(void 0===n[p])n[p]=decodeURIComponent(r);else if("string"==typeof n[p]){var i=[n[p],decodeURIComponent(r)];n[p]=i}else n[p].push(decodeURIComponent(r))}return n}
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

    function loadImages(el,url,fullwidth) {
        fullwidth = (fullwidth === undefined)?false:fullwidth;
        var img = document.createElement("img");
        img.setAttribute("class","lazyload");
        img.setAttribute("style","display:block");
        if(fullwidth) {
            img.setAttribute("width","100%");
        } else {
            img.setAttribute("style","max-width:100%;max-height:100%;");
        }
        img.setAttribute("referrerpolicy","no-referrer")
        img.setAttribute("data-src", url);
        var src = document.getElementById(el);
        src.appendChild(img);
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

    if(link){
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
                        json.images.forEach(function(item,index){
                            loadImages("content-images",item,false,index);
                        });
                        document.getElementById('content-files').innerText = json.images.length;
                    }
                    
                    if(json.hasOwnProperty('title')){
                        if(hasValue(json.title)) document.title = newtitle;
                    }

                    var share = document.createElement('a');
                    share.href = window.location.href;
                    share.setAttribute("class","a2a_dd");
                    share.innerText = "Share";
                    document.getElementById("menunav").appendChild(share);
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

    
    document.oncontextmenu = document.body.oncontextmenu = function() {return false;}
    document.onkeydown = function(e) {
        if (e.ctrlKey && 
            (e.keyCode === 67 || //ctrl+c
                e.keyCode === 86 || //ctrl+v
                e.keyCode === 85 || //ctrl+u
                e.keyCode === 117 || //ctrl+F6
                e.shiftKey && e.keyCode===73)) { //ctrl+shift+i
            return false;
        } else if (e.keyCode === 123){ //F12
            return false;
        } else {
            return true;
        }
    };

})();