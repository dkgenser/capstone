var paper = {
	planes: new Array(),
	flines: new Array(),

	init: function (){
		this.initBuffers();

		var topView = new View([0, boundingSphereRadius, 0], [0, 0, 0], [0, 0, -1]);
		var frontView = new View([0, 0, boundingSphereRadius], [0, 0, 0], [0, 1, 0]);
		var rightView = new View([boundingSphereRadius, 0, 0], [0, 0, 0], [0, 1, 0]);

		this.planes.push(new PlaneView([0, (planeWidth + margin)/2, 0], 0, topView, 0));
		this.planes.push(new PlaneView([0, -(planeWidth + margin)/2, 0], 0, frontView, 1));
		
		this.flines.push(new FoldingLine([0, 0, 0], 0));
	},

	initBuffers: function() {
		PlaneVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, PlaneVertexPositionBuffer);
		gl.bufferData(
		  gl.ARRAY_BUFFER, 
		  new Float32Array([
		    //TL corner
		    -planeWidth/2, planeWidth/2, 0,
		    //TR corner
		    planeWidth/2, planeWidth/2, 0,
		    //BL corner
		    -planeWidth/2, -planeWidth/2, 0,
		    //BR corner
		    planeWidth/2, -planeWidth/2, 0,
		    ]), 
		  gl.STATIC_DRAW);
		PlaneVertexPositionBuffer.itemSize = 3;
		PlaneVertexPositionBuffer.numItems = 4;

		PlaneVertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, PlaneVertexTextureCoordBuffer);
		gl.bufferData(
		  gl.ARRAY_BUFFER, 
		  new Float32Array([
		    //TL corner
		    0.0, 1.0,
		    //TR corner
		    1.0, 1.0,
		    //BL corner
		    0.0, 0.0,
		    //BR corner
		    1.0, 0.0,]), 
		  gl.STATIC_DRAW);
		PlaneVertexTextureCoordBuffer.itemSize = 2;
		PlaneVertexTextureCoordBuffer.numItems = 4;

		FLVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, FLVertexPositionBuffer);
		gl.bufferData(
		  gl.ARRAY_BUFFER, 
		  new Float32Array([
		    //left
		    -(planeWidth*0.75), 0, 0,
		    //right
		    (planeWidth*0.75), 0, 0,
		    ]), 
		  gl.STATIC_DRAW);
		FLVertexPositionBuffer.itemSize = 3;
		FLVertexPositionBuffer.numItems = 2;

		FLVertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, FLVertexTextureCoordBuffer);
		gl.bufferData(
		  gl.ARRAY_BUFFER, 
		  new Float32Array(4), 
		  gl.STATIC_DRAW);
		FLVertexTextureCoordBuffer.itemSize = 2;
		FLVertexTextureCoordBuffer.numItems = 2;
	},

	renderToTextures: function(){
		this.planes.forEach( function(plane){
			plane.renderToTexture();
		});
	},

	drawToScreen: function(){
		this.planes.forEach( function(plane){
			plane.draw();
		});

		this.flines.forEach( function(line){
			line.draw();
		});
	},

	addView: function(){

	},
};