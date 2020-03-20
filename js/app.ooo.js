(function(){

    var fullpath = window.location.href.split('?');
    var website = fullpath[0];
    var FV = new FormValidation();
    var FVLink = new FormValidation();

    FV.rules({
        "content-cover": {
            required: true,
            message: 'Link for image cover is required!',
            regex:/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            errorPlace:'error-content-cover',
            errorAddClass: {
                "error-content-cover":"validate-error"
            }
        },
        "content-title": {
            required: true,
            message: 'Title must be min 3-250 chars!',
            minLength:3,
            maxLength:250,
            errorPlace:'error-content-title',
            errorAddClass: {
                "error-content-title":"validate-error"
            }
        },
        "content-chapter": {
            required: false,
            message: 'Chapter must be a positive number!',
            regex: /^[0-9]/,
            errorPlace:'error-content-chapter',
            errorAddClass: {
                "error-content-chapter":"validate-error"
            }
        },
        "content-per-page": {
            required: false,
            message: 'Item per page must be a positive number!',
            regex: /^[0-9]/,
            errorPlace:'error-content-per-page',
            errorAddClass: {
                "error-content-per-page":"validate-error"
            }
        },
        "content-backlink": {
            required: false,
            message: 'Wrong format link!',
            regex:/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            errorPlace:'error-content-backlink',
            errorAddClass: {
                "error-content-backlink":"validate-error"
            }
        },
        "content-download": {
            required: false,
            message: 'Wrong format link!',
            regex:/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            errorPlace:'error-content-download',
            errorAddClass: {
                "error-content-download":"validate-error"
            }
        },
        "content-images": {
            required: true,
            message: 'Images data is required!',
            errorPlace:'error-content-images',
            errorAddClass: {
                "error-content-images":"validate-error"
            }
        }
    });

    FVLink.rules({
        "content-link": {
            required: true,
            message: 'Link of your json source is required!',
            regex: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            errorPlace:'error-content-link',
            errorAddClass: {
                "error-content-link":"validate-error"
            }
        }
    });

    function msgShow(el,className,content) {
        var msg = document.createElement("div");
        msg.setAttribute("class",className);
        msg.innerHTML = content;
        var x = document.getElementById(el);
        if(x.childNodes[0]) x.removeChild(x.childNodes[0]);
        x.style.display = "block";
        x.appendChild(msg);
    }

    function isEmpty(id) {
        var str = document.getElementById(id).value;
        str = str.trim();
        if(str.length > 0) {
            return false;
        }
        return true;
    }

    function resetSource(formid) {
        document.getElementById(formid).reset();
        if(formid === "form-source") {
            document.getElementById("result-form-source").style.display = "none";
            document.getElementById("msg").style.display = "none";
            var x = document.querySelectorAll(".validate-error");
            var z = x.length;
            if(document.getElementById("error-content-link").style.display === "none") {
                for (var i = 0; i < z; i++) {
                    x[i].classList.remove('validate-error');
                }
            } else {
                for (var i = 0; i < (z-1); i++) {
                    x[i].classList.remove('validate-error');
                }
            }
        }
        if(formid === "form-link") {
            document.getElementById("result-form-link").style.display = "none";
            document.getElementById("msg-link").style.display = "none";
            document.getElementById("error-content-link").classList.remove('validate-error');
        }
    }

    function generateSource() {
        if(FV.validate().isValid()) {
            msgShow("msg","msg","<b>Generate Success!</b><br>Upload this json source into your webserver.");
            
            var json = {};

            if(!isEmpty("content-cover")) {
                json.cover = document.getElementById("content-cover").value.trim();
            }

            if(!isEmpty("content-title")) {
                json.title = document.getElementById("content-title").value.trim();
            }

            if(!isEmpty("content-origin-title")) {
                json.original = document.getElementById("content-origin-title").value.trim();
            }

            if(!isEmpty("content-genre")) {
                json.genre = document.getElementById("content-genre").value.trim();
            }

            if(!isEmpty("content-author")) {
                json.author = document.getElementById("content-author").value.trim();
            }

            if(!isEmpty("content-chapter")) {
                json.chapter = document.getElementById("content-chapter").value.trim();
            }

            if(!isEmpty("content-release")) {
                json.release_date = document.getElementById("content-release").value.trim();
            }

            if(!isEmpty("content-isbn")) {
                json.isbn = document.getElementById("content-isbn").value.trim();
            }

            if(!isEmpty("content-publisher")) {
                json.publisher = document.getElementById("content-publisher").value.trim();
            }
            
            if(!isEmpty("content-translator")) {
                json.translator = document.getElementById("content-translator").value.trim();
            }

            if(!isEmpty("content-language")) {
                json.language = document.getElementById("content-language").value.trim();
            }

            if(!isEmpty("content-status")) {
                json.status = document.getElementById("content-status").value.trim();
            }

            if(!isEmpty("content-per-page")) {
                json.item_per_page = document.getElementById("content-per-page").value.trim();
            }

            if(!isEmpty("content-backlink")) {
                json.backlink = document.getElementById("content-backlink").value.trim();
            }

            if(!isEmpty("content-download")) {
                json.download = document.getElementById("content-download").value.trim();
            }

            if(!isEmpty("content-description")) {
                json.description = document.getElementById("content-description").value.trim();
            }

            if(document.getElementById("content-comment").checked) {
                json.use_comment = false;
            }

            if(!isEmpty("content-images")) {
                json.images = document.getElementById("content-images").value.trim().split(/\n/);
            }
            document.getElementById("result-source").value = JSON.stringify(json,null,2);
            document.getElementById("result-form-source").style.display = "block";
            document.getElementById("result-source").select();
        } else {
            document.getElementById("result-form-source").style.display = "none";
            msgShow("msg","msg-error","<b>Failed to Generate!</b><br>Some fields are required!");
        }
    }

    function generateLink() {
        if(FVLink.validate().isValid()){
            var link = encodeURIComponent(TextObfuscator.encode(Crypto.encode(document.getElementById('content-link').value),3));
            document.getElementById('result-link').value = website+'view?content='+link;
            msgShow("msg-link","msg","<b>Generate Success!</b><br>Your content is ready at this link.");
            document.getElementById("result-form-link").style.display = "block";
            document.getElementById('result-link').select();
        } else {
            document.getElementById("result-form-link").style.display = "none";
            msgShow("msg-link","msg-error","<b>Failed to Generate!</b><br>Some fields are required!");
        }
        
    }

    // event
    document.getElementById("generate-source").addEventListener("click", function(){
        generateSource();
    });

    document.getElementById("generate-source-reset").addEventListener("click", function(){
        resetSource("form-source");
    });

    document.getElementById("content-cover").addEventListener("blur", function(){
        FV.element("content-cover").validate();
    });

    document.getElementById("content-title").addEventListener("blur", function(){
        FV.element("content-title").validate();
    });

    document.getElementById("content-chapter").addEventListener("blur", function(){
        FV.element("content-chapter").validate();
    });

    document.getElementById("content-per-page").addEventListener("blur", function(){
        FV.element("content-per-page").validate();
    });

    document.getElementById("content-backlink").addEventListener("blur", function(){
        FV.element("content-backlink").validate();
    });

    document.getElementById("content-download").addEventListener("blur", function(){
        FV.element("content-download").validate();
    });

    document.getElementById("content-images").addEventListener("blur", function(){
        FV.element("content-images").validate();
    });

    document.getElementById("generate-link").addEventListener("click", function(){
        generateLink();
    });

    document.getElementById("generate-link-reset").addEventListener("click", function(){
        resetSource("form-link");
    });

    document.getElementById("content-link").addEventListener("blur", function(){
        FVLink.element("content-link").validate();
    });

    document.getElementById("btnMore").addEventListener("click", function(){
        var moreInfo = document.getElementById("more-info");
        if(moreInfo.style.display === "none") {
            moreInfo.style.display = "inline";
        } else {
            moreInfo.style.display = "none";
        }
    });

    document.getElementById('copyrightyear').innerHTML= new Date().getFullYear();
    document.getElementById('website').innerHTML = website;

})();