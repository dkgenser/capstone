define(function( require ) {
    'use strict';


    var $         = require( 'jquery' ),
        glMatrix  = require( 'glMatrix' );


    var Interact = function( options ) {
        this.canvas   = options.canvas;
        this.gl       = options.gl;
        this.paper    = options.paper;

        // Cache jQuery objects.
        this.$canvas = $( this.canvas );
        this.$document = $( document );
        this.$container = $( options.selectors.container );
        this.$addView = $( options.selectors.addView );
        this.$deleteView = $( options.selectors.deleteView );
        this.$editView = $( options.selectors.editView );
        this.$select = $( options.selectors.select );

        // Bind event handlers
        this.$addView.click( this.addViewHandler.bind( this ) );
        this.$deleteView.click( this.deleteViewHandler.bind( this ) );
        this.$editView.click( this.editViewHandler.bind( this ) );
        this.$select.click( this.selectHandler.bind( this ) );


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
            x: pixelCoords.x - ( this.gl.viewportWidth / 2 ),
            y: -( pixelCoords.y - ( this.gl.viewportHeight / 2 ) )
        };
    };


    Interact.prototype._worldToPlaneCoords = function( options ) {
        var plane       = options.plane;
        var worldCoords = options.coords;
        var matrix      = glMatrix.mat4.create();
        glMatrix.mat4.mul( matrix, plane.view.pMatrix, plane.view.mvMatrix );
        
        // adapted from Jeshua Bratman
        var coords = [0, 0, 0, 1];
        coords[0] = 2 * (worldCoords[0] - plane.center[0])/plane.width; 
        coords[1] = 2 * (worldCoords[1] - plane.center[1])/plane.width; 
        coords[2] = 2 * worldCoords[2] - 1;

        var invMat = glMatrix.mat4.create(); 
        glMatrix.mat4.invert( invMat, matrix );

        glMatrix.vec4.transformMat4( coords, coords, invMat ); 
        return [ coords[0]/coords[3], coords[1]/coords[3], coords[2]/coords[3] ]; 
    };


    Interact.prototype.selectHandler = function() {
        this.$select.addClass( 'btn-warning' );
        this.paper.world.modelWorld.objects.forEach( function ( obj ) {
            obj.selected = false;
        });

        //this.$container.style.cursor = "crosshair";

        this.planeSelectHandler( function( plane ) {
            var objects = this.paper.world.modelWorld.intersect({ 
                eye: this._worldToPlaneCoords({ 
                    plane: plane,
                    coords: [this.pixelCoords.x, this.pixelCoords.y, 0],
                }),
                direction: plane.getLineOfSight( plane.view ),
                min: .0001,
                max: 2 * this.paper.world.boundingSphereRadius,
            });

            objects.forEach( function ( obj ) {
                obj.selected = true;
            });

            this.$select.removeClass( 'btn-warning' );
        }.bind( this ));
    };


    Interact.prototype.deleteViewHandler = function() {
        this.$deleteView.addClass( 'btn-danger' );

        this.planeSelectHandler(function( plane ) {
            if ( this.paper.planes.indexOf( plane ) <= 1 ){
                alert( 'This plane cannot be deleted.' );
            } else {
                // TODO: make confirm or deny request instead of just an alert
                alert( 'Are you sure you want to delete this view and all ' +
                       'of it\'s children?' );
                this.paper.deletePlane( plane );
            }
            this.$deleteView.removeClass( 'btn-danger' );
        }.bind( this ));
    };


    Interact.prototype.addViewHandler = function() {
        if( this.paper.world.framebuffers.length <= 0 ) {
            alert( 'You cannot create any more views :(' );
            return;
        }
        this.$addView.addClass( 'btn-primary' );
        this.planeSelectHandler( function( plane ) {
            this.fl = this.paper.addFoldingLine({
                parent: plane,
                child: null,
                center: [ 0, 0, 0 ]
            });
            this.paper.addChildPlane( this.fl );
            plane.selected = true;
            this.foldingLineHandler( function() {
                plane.selected = false;
                this.$addView.removeClass( 'btn-primary' );
            }.bind( this ) );  
        }.bind( this ));
    };


    Interact.prototype.editViewHandler = function() {
        this.$editView.addClass( 'btn-success' );
        this.planeSelectHandler( function( plane ) {
            if ( this.paper.planes.indexOf( plane ) <= 1 || plane.children.length > 0 ) {
                alert( 'You cannot edit this view.' );
                this.$editView.removeClass( 'btn-success' );
                return;
            }
            this.fl = plane.parentLine;
            this.foldingLineHandler( function() {
                this.$editView.removeClass( 'btn-success' );
            }.bind( this ) );
        }.bind( this ));
    };


    Interact.prototype.foldingLineHandler = function( callback ) {
        this.setDefault();
        this.mouseClicked = true;

        this.$canvas.mousedown(function() {
            this.mouseClicked = !this.mouseClicked;
        }.bind( this ));

        this.$canvas.mousemove( function( e ) {
            if ( this.mouseClicked === true ) {
                return;
            }
            var coords = this.pixelToWorldCoords( this.getMouseCoords( e ) );
            this.fl.center = [ coords.x, coords.y, 0 ];
        }.bind( this ));

        this.$canvas.mouseup(function() {
            if ( this.mouseClicked === false ) {
                return;
            }
            this.setDefault();
            callback();
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
            this.paper.planes.forEach( function( plane ) {
                if( plane.intersects( [ coords.x, coords.y ] ) ) {
                    selectedPlane = plane;
                }
            });

            if ( selectedPlane !== undefined ) {
                this.setDefault();
                this.pixelCoords = coords;
                callback( selectedPlane );
            }
            this.mouseClicked = false;
        }.bind( this ));
    };


    return Interact;
});

