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
        "content-webhook": {
            message: 'Webhook URL must using full path with scheme.',
            regex:/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            errorPlace:'error-content-webhook',
            errorAddClass: {
                "error-content-webhook":"validate-error"
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
                "error-content-images":"validate-error",
                "content-images":"line-number-danger"
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

    function removeTag(pretag, suftag, str) {
        if(str) {
            var temp1 = str.split(pretag);
            if (temp1[1]) {
                var temp2 = temp1[1].split(suftag);
                return temp2[0].trim(' ');
            }
            return str.trim(' ');
        }
        return '';
    }

    function rebuildArray(arr) {
        var newdt = [];
        for (var i = 0; i < arr.length; i++) {
            newdt.push(removeTag('[img]','[/img]',arr[i]));
        }
        return newdt;
    }

    function sanitizeArray(arr) {
        var newdt = [];
        for(var i=0; i<arr.length; i++) {
            if(arr[i]) {
                newdt.push(arr[i].trim(' '));
            }
        }
        return newdt;
    }

    document.getElementById('content-images').addEventListener('change', function(){
        var dataimg = document.getElementById("content-images").value.trim().split(/\n/);
        dataimg = [].concat(rebuildArray(sanitizeArray(dataimg)));
        var imgresult = '';
        for (var i=0; i<dataimg.length; i++) {
            imgresult += dataimg[i]+'\n';
        }
        document.getElementById("content-images").value = imgresult;
    })

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
            document.getElementById("result-form-gen").style.display = "none";
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

    function pushWebhook(url, datajson, _cb) {
        ajax({
            headers: {
              'content-type': 'application/json'
            }
        })
        .post(url,datajson)
        .then(function (response, xhr) {
            if(response.status === 'true') {
                if(_cb && typeof _cb === "function") {
                    _cb(null, response.data.link);
                }
            } else {
                if(_cb && typeof _cb === "function") {
                    _cb(response.message, null);
                }    
            }
        })
        .catch(function (response, xhr) {
            console.log(xhr.responseText);
            if(_cb && typeof _cb === "function") {
                _cb(response.message, null);
            }
        })
    }

    function generate() {
        document.getElementById("result-form-gen").style.display = "none";
        document.getElementById("result-form-source").style.display = "none";
        if(FV.validate().isValid()) {
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

            var msview = '';
            if(document.getElementById("mode-single-gen").checked) {
                msview = '&style=single';
            }

            if(document.getElementById("content-cdnify").checked) {
                if(!isEmpty("content-images")) {
                    var cdnifycover = json.cover;
                    json.images = document.getElementById("content-images").value.trim().split(/\n/);
                    json.images.push(cdnifycover);
                    json.images = [].concat(sanitizeArray(json.images));
                    msgShow("msg","msg","<b>Processing images...</b>");
                    cdnify(json.images, function(err, done) {
                        if(err) {
                            console.log(err);
                            json.images.splice(json.images.length-1,1);
                            var datajson = JSON.stringify(json,null,2);
                            var filejson = Crypto.encode(document.getElementById('content-title').value)+'.json';
                            var objdata = {};
                            objdata[filejson] = {content: datajson};
                            createGist(filejson, {
                                description: document.getElementById('content-title').value,
                                files: objdata
                            }, function(err, resdata) {
                                if(err) {
                                    msgShow("msg","msg-error","<b>Failed Upload to Gist!</b><br>Error: "+err);
                                } else {
                                    msgShow("msg","msg","<b>Failed to CDNify but Upload to Gist Success!</b>");
                                    // data link
                                    var datalink = encodeURIComponent(TextObfuscator.encode(Crypto.encode(resdata),3));
                                    document.getElementById("result-link-gen").value = website+'view/?content='+datalink+msview;
                                    document.getElementById('result-embed-genlight').value = '<iframe src="'+website+'embed/light.html?content='+datalink+msview+'" width="100%" height="600px" frameborder="0" scrolling="yes" allowfullscreen="true"></iframe>';
                                    document.getElementById('result-embed-gendark').value = '<iframe src="'+website+'embed/?content='+datalink+msview+'" width="100%" height="600px" frameborder="0" scrolling="yes" allowfullscreen="true"></iframe>';
                                    document.getElementById("result-form-gen").style.display = "block";
                                }
                            });
                        } else {
                            json.cover = done[done.length-1];
                            done.splice(done.length-1,1);
                            json.images = [].concat(done);
                            var datajson = JSON.stringify(json,null,2);
                            var filejson = Crypto.encode(document.getElementById('content-title').value)+'.json';
                            var objdata = {};
                            objdata[filejson] = {content: datajson};
                            createGist(filejson, {
                                description: document.getElementById('content-title').value,
                                files: objdata
                            }, function(err, resdata) {
                                if(err) {
                                    msgShow("msg","msg-error","<b>Failed Upload to Gist!</b><br>Error: "+err);
                                } else {
                                    msgShow("msg","msg","<b>Upload to Gist Success!</b>");
                                    // data link
                                    var datalink = encodeURIComponent(TextObfuscator.encode(Crypto.encode(resdata),3));
                                    document.getElementById("result-link-gen").value = website+'view/?content='+datalink+msview;
                                    document.getElementById('result-embed-genlight').value = '<iframe src="'+website+'embed/light.html?content='+datalink+msview+'" width="100%" height="600px" frameborder="0" scrolling="yes" allowfullscreen="true"></iframe>';
                                    document.getElementById('result-embed-gendark').value = '<iframe src="'+website+'embed/?content='+datalink+msview+'" width="100%" height="600px" frameborder="0" scrolling="yes" allowfullscreen="true"></iframe>';
                                    document.getElementById("result-form-gen").style.display = "block";
                                }
                            });
                        }
                    });
                }
            } else {
                if(!isEmpty("content-images")) {
                    json.images = document.getElementById("content-images").value.trim().split(/\n/);
                    json.images = [].concat(sanitizeArray(json.images));
                }
                var datajson = JSON.stringify(json,null,2);
                var filejson = Crypto.encode(document.getElementById('content-title').value)+'.json';
                var objdata = {};
                objdata[filejson] = {content: datajson};
                createGist(filejson, {
                    description: document.getElementById('content-title').value,
                    files: objdata
                }, function(err, resdata) {
                    if(err) {
                        msgShow("msg","msg-error","<b>Failed Upload to Gist!</b><br>Error: "+err);
                    } else {
                        msgShow("msg","msg","<b>Upload to Gist Success!</b>");
                        // data link
                        var datalink = encodeURIComponent(TextObfuscator.encode(Crypto.encode(resdata),3));
                        document.getElementById("result-link-gen").value = website+'view/?content='+datalink+msview;
                        document.getElementById('result-embed-genlight').value = '<iframe src="'+website+'embed/light.html?content='+datalink+msview+'" width="100%" height="600px" frameborder="0" scrolling="yes" allowfullscreen="true"></iframe>';
                        document.getElementById('result-embed-gendark').value = '<iframe src="'+website+'embed/?content='+datalink+msview+'" width="100%" height="600px" frameborder="0" scrolling="yes" allowfullscreen="true"></iframe>';
                        document.getElementById("result-form-gen").style.display = "block";
                    }
                });
            }
        } else {
            msgShow("msg","msg-error","<b>Failed Upload to Gist!</b><br>Some fields are required!");
        }
    }

    function generateWebhook() {
        document.getElementById("result-form-gen").style.display = "none";
        document.getElementById("result-form-source").style.display = "none";
        if(FV.validate().isValid()) {
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

            var msview = '';
            if(document.getElementById("mode-single-gen").checked) {
                msview = '&style=single';
            }

            if(document.getElementById("content-cdnify").checked) {
                if(!isEmpty("content-images")) {
                    var cdnifycover = json.cover;
                    json.images = document.getElementById("content-images").value.trim().split(/\n/);
                    json.images.push(cdnifycover);
                    json.images = [].concat(sanitizeArray(json.images));
                    msgShow("msg","msg","<b>Processing images...</b>");
                    cdnify(json.images, function(err, done) {
                        if(err) {
                            console.log(err);
                            json.images.splice(json.images.length-1,1);
                            pushWebhook(document.getElementById('content-webhook').value, json, function(err, resdata) {
                                if(err) {
                                    msgShow("msg","msg-error","<b>Failed Upload via Webhook!</b><br>Error: "+err);
                                } else {
                                    msgShow("msg","msg","<b>Failed to CDNify but Upload via Webhook Success!</b>");
                                    // data link
                                    var datalink = encodeURIComponent(TextObfuscator.encode(Crypto.encode(resdata),3));
                                    document.getElementById("result-link-gen").value = website+'view/?content='+datalink+msview;
                                    document.getElementById('result-embed-genlight').value = '<iframe src="'+website+'embed/light.html?content='+datalink+msview+'" width="100%" height="600px" frameborder="0" scrolling="yes" allowfullscreen="true"></iframe>';
                                    document.getElementById('result-embed-gendark').value = '<iframe src="'+website+'embed/?content='+datalink+msview+'" width="100%" height="600px" frameborder="0" scrolling="yes" allowfullscreen="true"></iframe>';
                                    document.getElementById("result-form-gen").style.display = "block";
                                }
                            });
                        } else {
                            json.cover = done[done.length-1];
                            done.splice(done.length-1,1);
                            json.images = [].concat(done);
                            pushWebhook(document.getElementById('content-webhook').value, json, function(err, resdata) {
                                if(err) {
                                    msgShow("msg","msg-error","<b>Failed Upload via Webhook!</b><br>Error: "+err);
                                } else {
                                    msgShow("msg","msg","<b>Upload via Webhook Success!</b>");
                                    // data link
                                    var datalink = encodeURIComponent(TextObfuscator.encode(Crypto.encode(resdata),3));
                                    document.getElementById("result-link-gen").value = website+'view/?content='+datalink+msview;
                                    document.getElementById('result-embed-genlight').value = '<iframe src="'+website+'embed/light.html?content='+datalink+msview+'" width="100%" height="600px" frameborder="0" scrolling="yes" allowfullscreen="true"></iframe>';
                                    document.getElementById('result-embed-gendark').value = '<iframe src="'+website+'embed/?content='+datalink+msview+'" width="100%" height="600px" frameborder="0" scrolling="yes" allowfullscreen="true"></iframe>';
                                    document.getElementById("result-form-gen").style.display = "block";
                                }
                            });
                        }
                    });
                }
            } else {
                if(!isEmpty("content-images")) {
                    json.images = document.getElementById("content-images").value.trim().split(/\n/);
                    json.images = [].concat(sanitizeArray(json.images));
                }
                pushWebhook(document.getElementById('content-webhook').value, json, function(err, resdata) {
                    if(err) {
                        msgShow("msg","msg-error","<b>Failed Upload via Webhook!</b><br>Error: "+err);
                    } else {
                        msgShow("msg","msg","<b>Upload via Webhook Success!</b>");
                        // data link
                        var datalink = encodeURIComponent(TextObfuscator.encode(Crypto.encode(resdata),3));
                        document.getElementById("result-link-gen").value = website+'view/?content='+datalink+msview;
                        document.getElementById('result-embed-genlight').value = '<iframe src="'+website+'embed/light.html?content='+datalink+msview+'" width="100%" height="600px" frameborder="0" scrolling="yes" allowfullscreen="true"></iframe>';
                        document.getElementById('result-embed-gendark').value = '<iframe src="'+website+'embed/?content='+datalink+msview+'" width="100%" height="600px" frameborder="0" scrolling="yes" allowfullscreen="true"></iframe>';
                        document.getElementById("result-form-gen").style.display = "block";
                    }
                });
            }
        } else {
            msgShow("msg","msg-error","<b>Failed Upload via Webhook!</b><br>Some fields are required!");
        }
    }

    function generateSource() {
        document.getElementById("result-form-source").style.display = "none";
        document.getElementById("result-form-gen").style.display = "none";
        if(FV.validate().isValid()) {   
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

            if(document.getElementById("content-cdnify").checked) {
                if(!isEmpty("content-images")) {
                    var cdnifycover = json.cover;
                    json.images = document.getElementById("content-images").value.trim().split(/\n/);
                    json.images.push(cdnifycover);
                    json.images = [].concat(sanitizeArray(json.images));
                    msgShow("msg","msg","<b>Processing images...</b>");
                    cdnify(json.images, function(err, done) {
                        if(err) {
                            console.log(err);
                            msgShow("msg","msg","<b>Failed to CDNify but Generate still Success!</b><br>Upload this json source into your webserver.");
                            json.images.splice(json.images.length-1,1);
                            document.getElementById("result-source").value = JSON.stringify(json,null,2);
                            document.getElementById("result-form-source").style.display = "block";
                            document.getElementById("result-source").select();
                        } else {
                            json.cover = done[done.length-1];
                            done.splice(done.length-1,1);
                            json.images = [].concat(done);
                            msgShow("msg","msg","<b>Generate Success!</b><br>Upload this json source into your webserver.");
                            document.getElementById("result-source").value = JSON.stringify(json,null,2);
                            document.getElementById("result-form-source").style.display = "block";
                            document.getElementById("result-source").select();
                        }
                    });
                }
            } else {
                if(!isEmpty("content-images")) {
                    json.images = document.getElementById("content-images").value.trim().split(/\n/);
                    json.images = [].concat(sanitizeArray(json.images));
                }
                msgShow("msg","msg","<b>Generate Success!</b><br>Upload this json source into your webserver.");
                document.getElementById("result-source").value = JSON.stringify(json,null,2);
                document.getElementById("result-form-source").style.display = "block";
                document.getElementById("result-source").select();
            }
        } else {
            msgShow("msg","msg-error","<b>Failed to Generate!</b><br>Some fields are required!");
        }
    }

    function generateLink() {
        if(FVLink.validate().isValid()){
            var link = encodeURIComponent(TextObfuscator.encode(Crypto.encode(document.getElementById('content-link').value),3));
            document.getElementById('result-link').value = website+'view/?content='+link;
            var emlight = '',mosingle='';
            if(document.getElementById("embed-light").checked) {
                emlight = 'light.html';
            }
            if(document.getElementById("mode-single").checked) {
                mosingle = '&style=single';
            }
            document.getElementById('result-embed').value = '<iframe src="'+website+'embed/'+emlight+'?content='+link+mosingle+'" width="100%" height="600px" frameborder="0" scrolling="yes" allowfullscreen="true"></iframe>';
            msgShow("msg-link","msg","<b>Generate Success!</b><br>Your content is ready.");
            document.getElementById("result-form-link").style.display = "block";
            document.getElementById('result-link').select();
        } else {
            document.getElementById("result-form-link").style.display = "none";
            msgShow("msg-link","msg-error","<b>Failed to Generate!</b><br>Some fields are required!");
        }
        
    }

    // event
    document.getElementById("git-login").addEventListener("click", function(){
        gitLogin();
    });

    document.getElementById("git-logout").addEventListener("click", function(){
        gitLogout();
    });

    document.getElementById("generate").addEventListener("click", function(){
        generate();
    });

    document.getElementById("generate-webhook").addEventListener("click", function(){
        generateWebhook();
    });

    document.getElementById("generate-source").addEventListener("click", function(){
        generateSource();
    });

    document.getElementById("generate-source-reset").addEventListener("click", function(){
        resetSource("form-source");
    });

    document.getElementById("content-webhook").addEventListener("blur", function(){
        FV.element(this.id).validate();
    });

    document.getElementById("content-webhook").addEventListener("keyup", function(){
        if(this.value.length > 0) {
            document.getElementById('generate-webhook').style.display = 'inline';
        } else {
            document.getElementById('generate-webhook').style.display = 'none';
        }
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