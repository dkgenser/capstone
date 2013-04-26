define(function( require ) {
    'use strict';

    var $ = require( 'jquery' );

    var Interact = function( options ) {
        this.canvas = options.canvas;
        this.gl     = options.gl;

        var styles = document.defaultView.getComputedStyle( this.canvas, null );
        var getStyle = function( prop ) {
            return parseInt( styles[prop], 10 ) || 0;
        };
        this.doc = {
            stylePaddingLeft: getStyle( 'paddingLeft' ),
            stylePaddingTop: getStyle( 'paddingTop' ),
            styleBorderLeft: getStyle( 'borderLeftWidth' ),
            styleBorderTop: getStyle( 'borderTopWidth' ),
            // Some pages have fixed-position bars (like the stumbleupon bar)
            // at the top or left of the page. They will mess up mouse
            // coordinates and this fixes that.
            htmlTop: document.body.parentNode.offsetTop,
            htmlLeft: document.body.parentNode.offsetLeft
        };

        // Cache jQuery objects.
        this.$canvas = $( this.canvas );
        this.$document = $( document );

        this.setDefault();
    };


    Interact.prototype.mouseDown = function( handler ) {
        this.$canvas.mousedown( handler );
    };


    Interact.prototype.mouseMove = function( handler ) {
        this.$document.mousemove( handler );
    };


    Interact.prototype.mouseUp = function( handler ) {
        this.$document.mouseup( handler );
    };


    Interact.prototype.mouseDblClick = function( handler ) {
        this.$canvas.dblclick( handler );
    };


    Interact.prototype.setDefault = function() {
        this.$canvas.unbind( 'mousedown' );
        this.$canvas.unbind( 'dblclick' );
        this.$document.unbind( 'mouseup' );
        this.$document.unbind( 'mousemove' );
        this.mouseClicked = false;
    };

    // TODO: cache this in the constructor.
    Interact.prototype._getMouse = function(e) {
        var element = this.canvas,
            offsetX = 0,
            offsetY = 0;

        // Compute the total offset. It's possible to cache this if you want.
        if ( element.offsetParent !== undefined ) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
                element = element.offsetParent;
            } while ( element !== undefined );
        }

        // Add padding and border style widths to offset. Also add the
        // <html> offsets in case there's a position:fixed bar (like the
        // stumbleupon bar). This part is not strictly necessary; it depends
        // on your styling.
        offsetX += this.doc.stylePaddingLeft + this.doc.styleBorderLeft + this.doc.htmlLeft;
        offsetY += this.doc.stylePaddingTop + this.doc.styleBorderTop + this.doc.htmlTop;

        return {
            x: e.pageX - offsetX,
            y: e.pageY - offsetY
        };
    };


    return Interact;
});

