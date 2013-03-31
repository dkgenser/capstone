var paper = {
	planes: new Array(),
	flines: new Array(),

	init: function (){

		var topView = new View([0, boundingSphereRadius, 0], [0, 0, 0], [0, 0, -1]);
		var frontView = new View([0, 0, boundingSphereRadius], [0, 0, 0], [0, 1, 0]);
		var rightView = new View([boundingSphereRadius, 0, 0], [0, 0, 0], [0, 1, 0]);

		this.planes.push(new PlaneView([0, (planeWidth + margin)/2, 0], 0, topView, 0));
		this.planes.push(new PlaneView([0, -(planeWidth + margin)/2, 0], 0, frontView, 1));
		
		this.flines.push(new FoldingLine([0, 0, 0], 0));
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