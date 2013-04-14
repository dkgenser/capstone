define([
], function() {
    'use strict';

    var requestAnimationFrame = (function() {
        return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function( callback ) {
                    window.setTimeout( callback, 1000 / 60 );
                };
    })().bind(window);

    return {

        radians: function( angle ) {
            return angle * Math.PI / 180;
        },

        degrees: function( radians ) {
            return radians * 180 / Math.PI;
        },

        requestAnimationFrame: requestAnimationFrame
    };
});
