define([
], function() {
    'use strict';

    var Interact = function( options ) {
        this.canvas = options.canvas;
        this.gl     = options.gl;

        this.doc = {
            stylePaddingLeft:  parseInt(document.defaultView.getComputedStyle(options.canvas, null).paddingLeft, 10)      || 0,
            stylePaddingTop:   parseInt(document.defaultView.getComputedStyle(options.canvas, null).paddingTop, 10)       || 0,
            styleBorderLeft:   parseInt(document.defaultView.getComputedStyle(options.canvas, null).borderLeftWidth, 10)  || 0,
            styleBorderTop:    parseInt(document.defaultView.getComputedStyle(options.canvas, null).borderTopWidth, 10)   || 0,
            // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
            // They will mess up mouse coordinates and this fixes that
            htmlTop: document.body.parentNode.offsetTop,
            htmlLeft: document.body.parentNode.offsetLeft,
        };
        
        this.setDefault();
    };

    Interact.prototype.mouseDown = function(handler){
        $(canvas).mousedown(handler);
    };

    Interact.prototype.mouseMove = function(handler){
        $(document).mousemove(handler);
    };

    Interact.prototype.mouseUp = function(handler){
        $(document).mouseup(handler);
    };

    Interact.prototype.mouseDblClick = function(handler){
        $(canvas).dblclick(handler);
    };

    Interact.prototype.setDefault = function(){
        $(this.canvas).unbind('mousedown');
        $(this.canvas).unbind('dblclick');
        $(document).unbind('mouseup');
        $(document).unbind('mousemove');
        this.mouseClicked = false;
    };

    Interact.prototype._getMouse = function(e){
        var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

        // Compute the total offset. It's possible to cache this if you want
        if (element.offsetParent !== undefined) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
        }

        // Add padding and border style widths to offset
        // Also add the <html> offsets in case there's a position:fixed bar (like the stumbleupon bar)
        // This part is not strictly necessary, it depends on your styling
        offsetX += this.doc.stylePaddingLeft + this.doc.styleBorderLeft + this.doc.htmlLeft;
        offsetY += this.doc.stylePaddingTop + this.doc.styleBorderTop + this.doc.htmlTop;

        mx = e.pageX - offsetX;
        my = e.pageY - offsetY;

        // We return a simple javascript object with x and y defined
        return {x: mx, y: my};
    };


    return Interact;
});

/*

function pixelToWorldCoords(pixelCoords){
    var newX = pixelCoords.x - gl.viewportWidth/2;
    var newY = -(pixelCoords.y - gl.viewportHeight/2);

    return {x: newX, y: newY};
}
*/