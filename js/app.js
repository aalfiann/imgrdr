(function(){

    var FV = new FormValidation();
    var FVLink = new FormValidation();

    FV.rules({
        "content-cover": {
            required: true,
            message: 'Link for image cover is required!',
            regex:/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            errorPlace:'error-content-cover'
        },
        "content-title": {
            required: true,
            message: 'Title must be min 3-250 chars!',
            minLength:3,
            maxLength:250,
            errorPlace:'error-content-title'
        },
        "content-chapter": {
            required: false,
            message: 'Chapter must be a number!',
            regex: /^[0-9]/,
            errorPlace:'error-content-chapter'
        },
        "content-backlink": {
            required: false,
            message: 'Wrong format link!',
            regex:/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            errorPlace:'error-content-backlink'
        },
        "content-images": {
            required: true,
            message: 'Images data is required!',
            errorPlace:'error-content-images'
        }
    });

    FVLink.rules({
        "content-link": {
            required: true,
            message: 'Link of your json source is required!',
            regex: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            errorPlace:'error-content-link'
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
        }
        if(formid === "form-link") {
            document.getElementById("result-form-link").style.display = "none";
            document.getElementById("msg-link").style.display = "none";
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

            if(!isEmpty("content-backlink")) {
                json.backlink = document.getElementById("content-backlink").value.trim();
            }

            if(!isEmpty("content-description")) {
                json.description = document.getElementById("content-description").value.trim();
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
            document.getElementById('result-link').value = window.location.href+'view?content='+link;
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

    document.getElementById("content-backlink").addEventListener("blur", function(){
        FV.element("content-backlink").validate();
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

    document.getElementById('copyrightyear').innerHTML= new Date().getFullYear();
    document.getElementById('website').innerHTML = window.location.href;

})();