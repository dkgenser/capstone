require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        bootstrap: 'vendor/bootstrap'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require([
    'jquery',
    'initialize',
    'interact',
    'classes/modelWorld',
    'classes/paper'

], function($, initialize, interact, modelWorld, paper) {
    'use strict';

    var canvas = document.createElement('canvas');
    var container = document.getElementById('canvasDiv');
    canvas.width = container.width;
    canvas.height = container.height;
    container.appendChild(canvas);

    var gl = initialize.initGL(canvas);

    interact.initInteraction(canvas);
    initialize.initShaders(gl);
    initialize.initFBOs(gl);

    modelWorld.init(gl);
    paper.init(gl);

    // paper.init();

    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // gl.enable(gl.DEPTH_TEST);
    // gl.depthFunc(gl.LEQUAL);

    // tick();
});
