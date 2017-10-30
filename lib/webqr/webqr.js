// QRCODE reader Copyright 2011 Lazar Laszlo
// http://www.webqr.com

webqr_confg = {
    callback: function(_message) {
        console.log(_message);
    },
    debug: {
        console_show_result: false,
    },
    check_interval: 500,
    loop: true,
    zoom: CONFIG.counter.zoom
};

// --------------

var gCtx = null;
var gCanvas = null;
var c=0;
var stype=0;
var gUM=false;
var webkit=false;
var moz=false;
var v=null;
var captureToCanvasTimer = null;



var imghtml='<div id="qrfile"><canvas id="out-canvas" width="320" height="240"></canvas>'+
    '<div id="imghelp">drag and drop a QRCode here'+
	'<br>or select a file'+
	'<input type="file" onchange="handleFiles(this.files)"/>'+
	'</div>'+
'</div>';

var vidhtml = '<video id="v" autoplay></video>';

function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
}
function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;
    if (files.length > 0) {
        handleFiles(files);
    } else if (dt.getData('URL')) {
        qrcode.decode(dt.getData('URL'));
    }
}

function handleFiles(f) {
    var o = [];

    for (var i = 0; i < f.length; i++) {
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
                qrcode.decode(e.target.result);
            };
        })(f[i]);
        reader.readAsDataURL(f[i]);
    }
}

function initCanvas(w,h) {
    gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
}

captureToCanvas = function () {
    if(gUM)
    {
        try{
            var x = webqr_confg.zoom.x_offset*-1;
            var y = webqr_confg.zoom.y_offset*-1;
            gCtx.drawImage(v, x, y);
            /*
            var imageData = gCtx.getImageData(x, y, webqr_confg.zoom.width, webqr_confg.zoom.height);
            
            var data = imageData.data;
            //console.log(data);

            for(var i = 0; i < data.length; i += 4) {
              var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
              // red
              data[i] = 0;
              // green
              data[i + 1] = 0;
              // blue
              data[i + 2] = 0;
            }

            // overwrite original image
            gCtx.putImageData(imageData, x, y);
            */
            
            try{
                qrcode.decode();
                if (webqr_confg.loop === true) {
                    clearTimeout(captureToCanvasTimer);
                    captureToCanvasTimer = setTimeout(captureToCanvas, webqr_confg.check_interval);
                }
            }
            catch(e){       
                //console.log(e);
                if (webqr_confg.debug.console_show_result === true) {
                    console.log(e);
                }
                if (typeof(webqr_confg.callback) === "function") {
                    webqr_confg.callback(false);
                }
                clearTimeout(captureToCanvasTimer);
                captureToCanvasTimer = setTimeout(captureToCanvas, webqr_confg.check_interval);
            };
        }
        catch(e){       
                if (webqr_confg.debug.console_show_result === true) {
                    console.log(e);
                }
                if (typeof(webqr_confg.callback) === "function") {
                    webqr_confg.callback(false);
                }
                clearTimeout(captureToCanvasTimer);
                captureToCanvasTimer = setTimeout(captureToCanvas, webqr_confg.check_interval);
        };
    }
};   // captureToCanvas()

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function read(a)
{
    var html="<br>";
    if(a.indexOf("http://") === 0 || a.indexOf("https://") === 0)
        html+="<a target='_blank' href='"+a+"'>"+a+"</a><br>";
    html+="<b>"+htmlEntities(a)+"</b><br><br>";
    //document.getElementById("result").innerHTML = html;
    if (webqr_confg.debug.console_show_result === true) {
        console.log(a);
    }
    if (typeof(webqr_confg.callback) === "function") {
        webqr_confg.callback(a);
    }
}	

function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}

function success(stream) {
    if(webkit)
        v.src = window.URL.createObjectURL(stream);
    else
    if(moz)
    {
        v.mozSrcObject = stream;
        v.play();
    }
    else
        v.src = stream;
    gUM=true;
    clearTimeout(captureToCanvasTimer);
    captureToCanvasTimer = setTimeout(captureToCanvas, webqr_confg.check_interval);
}
		
function error(error) {
    gUM=false;
    return;
}

function load(callback, check_interval) {
    
    if (isCanvasSupported() && window.File && window.FileReader) {
        if (typeof(callback) === "function") {
            webqr_confg.callback = callback;
        }
        if (typeof(check_interval) === "number") {
            webqr_confg.check_interval = check_interval;
        }
        
        initCanvas(webqr_confg.zoom.width, webqr_confg.zoom.height);
        
        qrcode.callback = read;
        document.getElementById("mainbody").style.display = "inline";
        setwebcam();
    } 
    else {
        document.getElementById("mainbody").style.display = "inline";
        document.getElementById("mainbody").innerHTML = '<p id="mp1">QR code scanner for HTML5 capable browsers</p><br>' +
                '<br><p id="mp2">sorry your browser is not supported</p><br><br>' +
                '<p id="mp1">try <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or <a href="http://www.opera.com"><img src="Opera-logo.png"/></a></p>';
    }
}

function setwebcam() {
    var options = true;
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
            navigator.mediaDevices.enumerateDevices()
                    .then(function (devices) {
                        devices.forEach(function (device) {
                            if (device.kind === 'videoinput') {
                                if (device.label.toLowerCase().search("back") > -1) {
                                    options = {'deviceId': {'exact': device.deviceId}, 'facingMode': 'environment'};
                                }
                            }
                            else {
                                //console.log("a");
                            }
                            //console.log(device.kind + ": " + device.label +" id = " + device.deviceId);
                        });
                        setwebcam2(options);
                    });
        } 
        catch (e) {
            console.log(e);
        }
    } else {
        console.log("no navigator.mediaDevices.enumerateDevices");
        setwebcam2(options);
    }
}

function setwebcam2(options)
{
    //console.log(options);
    //document.getElementById("result").innerHTML="- scanning -";
    if(stype===1)
    {
        setTimeout(captureToCanvas, webqr_confg.check_interval);    
        return;
    }
    var n=navigator;
    document.getElementById("outdiv").innerHTML = vidhtml;
    v = document.getElementById("v");

    if(n.getUserMedia) {
        webkit = true;
        n.getUserMedia({video: options, audio: false}, success, error);
    }
    else if(n.webkitGetUserMedia) {
        webkit=true;
        n.webkitGetUserMedia({video:options, audio: false}, success, error);
    }
    else if(n.mozGetUserMedia) {
        moz=true;
        n.mozGetUserMedia({video: options, audio: false}, success, error);
    }

    //document.getElementById("qrimg").style.opacity=0.2;
    //document.getElementById("webcamimg").style.opacity=1.0;

    //stype=1;
    setTimeout(captureToCanvas, webqr_confg.check_interval);
    //setTimeout(setwebcam2, 500);
}

function setimg()
{
    document.getElementById("result").innerHTML="";
    if(stype === 2) {
        return;
    }
    document.getElementById("outdiv").innerHTML = imghtml;
    //document.getElementById("qrimg").src="qrimg.png";
    //document.getElementById("webcamimg").src="webcam2.png";
    document.getElementById("qrimg").style.opacity=1.0;
    document.getElementById("webcamimg").style.opacity=0.2;
    var qrfile = document.getElementById("qrfile");
    qrfile.addEventListener("dragenter", dragenter, false);  
    qrfile.addEventListener("dragover", dragover, false);  
    qrfile.addEventListener("drop", drop, false);
    stype=2;
}
