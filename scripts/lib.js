var lib = function () {
    var libary = {
        version: '0.0.1'
    };
    var libDate = new Date();
    libary.inArray = function (needle, array) {
        if ("string" === typeof(needle) || "number" === typeof(needle)) {
            for (var i in array) {
                if (needle === array[i]) {
                    return true;
                }
            }
            return false;
        }
    };
    libary.findNeeded = function(arr,neededKey,indexVal,keyOnly){
        var _r =keyOnly?null:{};
        for(var i  in arr){
            if( "undefined" === (typeof arr[i][neededKey])){
                continue;
            }
            if(indexVal === arr[i][neededKey] && "object" === typeof(arr[i])){
                _r = true === keyOnly?i:arr[i];
                break;
            }
        }
        return _r;
    };
    libary.findNeededFields = function(arr,neededKey,indexVal,fields){
        var _r = {};
        var _k = Object.keys(fields);
        var temp = libary.findNeeded(arr,neededKey,indexVal,false);
        for(var i in temp){
            if(libary.inArray(i,_k)){
                _r[fields[i]] = temp[i];
            }
        }
        return _r;
    };
    libary.replaceFields = function(arr,neededKey,indexVal,newValues){
        var temp = libary.findNeeded(arr,neededKey,indexVal,true);
        for(var i in arr[temp]){
            if("undefined" !== typeof(newValues[i])){
                arr[temp][i] = newValues[i];
            }
        }
        return arr;
    };
    libary.removeElement = function(arr,neededKey,indexVal){
        var i = libary.findNeeded(arr,neededKey,indexVal,true);
        if(null !== i){
            arr.splice(parseInt(i),1);
        }
        return arr;
    };
    libary.Date = {
        'year': libDate.getFullYear(),
        'month': libDate.getMonth() + 1,
        'date': libDate.getDate()
    };
    return libary;
}();


/***********************************************/

var getCaretPosition=function(editableDiv) {
    var caretPos = 0,
        containerEl = null,
        sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode == editableDiv) {
                caretPos = range.endOffset;
            }
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == editableDiv) {
            var tempEl = document.createElement("span");
            editableDiv.insertBefore(tempEl, editableDiv.firstChild);
            var tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
        }
    }
    return caretPos;
}
var  setEndOfContenteditable=function(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}
var funParabola=function(d,t,g){var i={speed:166.67,curvature:0.001,progress:function(){},complete:function(){}};var p={};g=g||{};for(var v in i){p[v]=g[v]||i[v]}var u={mark:function(){return this},position:function(){return this},move:function(){return this},init:function(){return this}};var e="margin",r=document.createElement("div");if("oninput" in r){["","ms","webkit"].forEach(function(b){var a=b+(b?"T":"t")+"ransform";if(a in r.style){e=a}})}var s=p.curvature,q=0,o=0;var k=true;if(d&&t&&d.nodeType==1&&t.nodeType==1){var n={},j={};var h={},m={};var f={},l={};u.mark=function(){if(k==false){return this}if(typeof f.x=="undefined"){this.position()}d.setAttribute("data-center",[f.x,f.y].join());t.setAttribute("data-center",[l.x,l.y].join());return this};u.position=function(){if(k==false){return this}var b=document.documentElement.scrollLeft||document.body.scrollLeft,a=document.documentElement.scrollTop||document.body.scrollTop;if(e=="margin"){d.style.marginLeft=d.style.marginTop="0px"}else{d.style[e]="translate(0, 0)"}n=d.getBoundingClientRect();j=t.getBoundingClientRect();h={x:n.left+(n.right-n.left)/2+b,y:n.top+(n.bottom-n.top)/2+a};m={x:j.left+(j.right-j.left)/2+b,y:j.top+(j.bottom-j.top)/2+a};f={x:0,y:0};l={x:-1*(h.x-m.x),y:-1*(h.y-m.y)};q=(l.y-s*l.x*l.x)/l.x;return this};u.move=function(){if(k==false){return this}var a=0,b=l.x>0?1:-1;var c=function(){var z=2*s*a+q;a=a+b*Math.sqrt(p.speed/(z*z+1));if((b==1&&a>l.x)||(b==-1&&a<l.x)){a=l.x}var w=a,A=s*w*w+q*w;d.setAttribute("data-center",[Math.round(w),Math.round(A)].join());if(e=="margin"){d.style.marginLeft=w+"px";d.style.marginTop=A+"px"}else{d.style[e]="translate("+[w+"px",A+"px"].join()+")"}if(a!==l.x){p.progress(w,A);window.requestAnimationFrame(c)}else{p.complete();k=true}};window.requestAnimationFrame(c);k=false;return this};u.init=function(){this.position().mark().move()}}return u};(function(){var b=0;var c=["webkit","moz"];for(var a=0;a<c.length&&!window.requestAnimationFrame;++a){window.requestAnimationFrame=window[c[a]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[c[a]+"CancelAnimationFrame"]||window[c[a]+"CancelRequestAnimationFrame"]}if(!window.requestAnimationFrame){window.requestAnimationFrame=function(h,e){var d=new Date().getTime();var f=Math.max(0,16.7-(d-b));var g=window.setTimeout(function(){h(d+f)},f);b=d+f;return g}}if(!window.cancelAnimationFrame){window.cancelAnimationFrame=function(d){clearTimeout(d)}}}());
/************************************************/