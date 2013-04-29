define(function( require ) {
    'use strict';

    var $ = require( 'jquery' );

    var Interact = function( options ) {
        this.canvas   = options.canvas;
        this.gl       = options.gl;
        this.paper    = options.paper;

        // Cache jQuery objects.
        this.$canvas = $( this.canvas );
        this.$document = $( document );
        this.$addView = $( options.selectors.addView );
        this.$deleteView = $( options.selectors.deleteView );

        // Bind event handlers
        this.$addView.click( this.addView.bind( this ) );
        this.$deleteView.click( this.deleteViewHandler.bind( this ) );

        var styles = document.defaultView.getComputedStyle( this.canvas, null );
        var getStyle = function( prop ) {
            return parseInt( styles[ prop ], 10 ) || 0;
        };
        this.doc = {
            paddingLeft: getStyle( 'paddingLeft' ),
            paddingTop: getStyle( 'paddingTop' ),
            borderLeft: getStyle( 'borderLeftWidth' ),
            borderTop: getStyle( 'borderTopWidth' ),
            // Some pages have fixed-position bars (like the stumbleupon bar)
            // at the top or left of the page. They will mess up mouse
            // coordinates and this fixes that.
            htmlTop: document.body.parentNode.offsetTop,
            htmlLeft: document.body.parentNode.offsetLeft
        };

        this.mouseOffset = this._getMouseOffset();

        this.setDefault();
    };


    Interact.prototype.setDefault = function() {
        this.$canvas.unbind( 'mousedown' );
        this.$canvas.unbind( 'mouseup' );
        this.$canvas.unbind( 'mousemove' );
        this.mouseClicked = false;
    };


    Interact.prototype._getMouseOffset = function() {
        var element = this.canvas,
            offset = { x: 0, y: 0 };

        // Compute the total offset. It's possible to cache this if you want.
        // TODO: cache this in the constructor.
        if ( element.offsetParent !== undefined ) {
            do {
                offset.x += element.offsetLeft;
                offset.y += element.offsetTop;
            } while ( ( element = element.offsetParent ) );
        }

        // Add padding and border style widths to offset. Also add the
        // <html> offsets in case there's a position:fixed bar (like the
        // stumbleupon bar). This part is not strictly necessary; it depends
        // on your styling.
        return {
            x: offset.x + this.doc.paddingLeft +
                    this.doc.borderLeft + this.doc.htmlLeft,
            y: offset.y + this.doc.paddingTop +
                    this.doc.borderTop + this.doc.htmlTop
        };
    };


    Interact.prototype.getMouseCoords = function( e ) {
        return {
            x: e.pageX - this.mouseOffset.x,
            y: e.pageY - this.mouseOffset.y
        };
    };


    Interact.prototype.pixelToWorldCoords = function( pixelCoords ) {
        return {
            x: pixelCoords.x - (this.gl.viewportWidth / 2),
            y: -( pixelCoords.y - (this.gl.viewportHeight / 2) )
        };
    };

    Interact.prototype.addView = function() {
        this.planeSelectHandler( function( plane ) {
            //TODO: highlight selected plane (currently not working)
            plane.selected = true;
            this.addViewHandler( plane );
            plane.selected = false;
        }.bind( this ));
    };

    Interact.prototype.addViewHandler = function( plane ) {
        this.setDefault();

        //TODO: add plane selection
        this.fl = this.paper.addFoldingLine({
            parent: plane,
            child: null,
            center: [ 0, 0, 0 ]
        });

        this.mouseClicked = true;

        this.$canvas.mousedown(function() {
            this.mouseClicked = !this.mouseClicked;
        }.bind( this ));

        this.$canvas.mousemove( function( e ) {
            if ( this.mouseClicked === true ) {
                return;
            }

            var coords = this.pixelToWorldCoords( this.getMouseCoords( e ) );
            this.fl.center = [coords.x, coords.y, 0];

        }.bind( this ));

        this.$canvas.mouseup(function( e ) {
            if ( this.mouseClicked === false ) {
                return;
            }

            this.paper.addChildPlane( this.fl );
            this.setDefault();

        }.bind( this ));
    };

    Interact.prototype.planeSelectHandler = function( callback ) {
        this.setDefault();

        this.$canvas.mousedown(function() {
            this.mouseClicked = true;
        }.bind( this ));

        this.$canvas.mouseup(function( e ) {
            if ( this.mouseClicked === false ) {
                return;
            }
            var coords = this.pixelToWorldCoords( this.getMouseCoords( e ) );

            var selectedPlane; 
            this.paper.planes.forEach( function(plane) {
                if( plane.intersects( [coords.x, coords.y] ) ) {
                    selectedPlane = plane;
                }
            });

            if(selectedPlane != null) {
                this.setDefault();
                callback(selectedPlane);
            }

            this.mouseClicked = false;
        }.bind( this ));
    };

    Interact.prototype.deleteViewHandler = function( e ) {
        alert( 'delete view ' + e );
    };


    return Interact;
});

