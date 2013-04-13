define([
], function() {
    'use strict';

    var stylePaddingLeft;
    var stylePaddingTop;
    var styleBorderLeft;
    var styleBorderTop;
    var htmlTop;
    var htmlLeft;

    return {
        initInteraction: function(canvas) {
            stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null).paddingLeft, 10)      || 0;
            stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null).paddingTop, 10)       || 0;
            styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null).borderLeftWidth, 10)  || 0;
            styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null).borderTopWidth, 10)   || 0;
            // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
            // They will mess up mouse coordinates and this fixes that
            var html = document.body.parentNode;
            htmlTop = html.offsetTop;
            htmlLeft = html.offsetLeft;
        }
    };
});
