/*!
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function(c){c.support.touch="ontouchend" in document;
if(!c.support.touch){return;}var d=c.ui.mouse.prototype,f=d._mouseInit,b;function a(k){var i=window.pageXOffset,h=window.pageYOffset,g=k.clientX,j=k.clientY;
if(k.pageY===0&&Math.floor(j)>Math.floor(k.pageY)||k.pageX===0&&Math.floor(g)>Math.floor(k.pageX)){g=g-i;j=j-h;}else{if(j<(k.pageY-h)||g<(k.pageX-i)){g=k.pageX-i;
j=k.pageY-h;}}return{clientX:g,clientY:j};}function e(h,i){if(h.originalEvent.touches.length>1){return;}h.preventDefault();var k=h.originalEvent.changedTouches[0],g=document.createEvent("MouseEvents"),j=a(k);
g.initMouseEvent(i,true,true,window,1,k.screenX,k.screenY,j.clientX,j.clientY,false,false,false,false,0,null);h.target.dispatchEvent(g);}d._touchStart=function(h){var g=this;
if(b||!g._mouseCapture(h.originalEvent.changedTouches[0])){return;}b=true;g._touchMoved=false;e(h,"mouseover");e(h,"mousemove");e(h,"mousedown");};d._touchMove=function(g){if(!b){return;
}this._touchMoved=true;e(g,"mousemove");};d._touchEnd=function(g){if(!b){return;}e(g,"mouseup");e(g,"mouseout");if(!this._touchMoved){e(g,"click");}b=false;
};d._mouseInit=function(){var g=this;g.element.bind("touchstart",c.proxy(g,"_touchStart")).bind("touchmove",c.proxy(g,"_touchMove")).bind("touchend",c.proxy(g,"_touchEnd"));
f.call(g);};})(jQuery);