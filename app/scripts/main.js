require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        bootstrap: 'vendor/bootstrap',
        glMatrix: '../components/gl-matrix/dist/gl-matrix'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
    }
});

require( [ 'World' ], function( World ) {
    'use strict';

    var world = new World({
        selectors: {
            canvas: '#app-canvas',
            addView: '#add-view',
            deleteView: '#delete-view',
            editView: '#edit-view',
            select: '#select',
        },
        textureLen: 6,
        framebufferWidth: 512,
        framebufferHeight: 512,
        boundingSphereRadius: 100
    });

    world.tick();

});
