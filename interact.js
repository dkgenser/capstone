var interact = {

	mouseDown: function(handler){
		$(canvas).mousedown(handler);
	},

	mouseMove: function(handler){
		$(document).mousemove(handler);
	},

	mouseUp: function(handler){
		$(document).mouseup(handler);
	},

	mouseDblClick: function(handler){
		$(canvas).dblclick(handler);
	},

	setDefault: function(){
		$(canvas).unbind('mousedown');
		$(canvas).unbind('dblclick');
		$(document).unbind('mouseup');
		$(document).unbind('mousemove');
	},
};

var addView = {
	mouseClicked: false,

	start: function (){
		//TODO: select view to add to
		var pPlane = paper.planes[1];

		foldingLine = new FoldingLine(0, pPlane, null);
		paper.flines.push(foldingLine);

		addView.mouseClicked=true;

		//bind function
		interact.mouseDown(this.handleMouseDown);
		interact.mouseUp(this.handleMouseUp(foldingLine));
		interact.mouseMove(this.handleMouseMove(foldingLine));
	},

	handleMouseDown: function(event){
		addView.mouseClicked = !addView.mouseClicked;
	},

	handleMouseUp: function(foldingLine){
		return function(event){
			if(addView.mouseClicked) return;

			paper.planes.push(foldingLine.createChild());

			interact.setDefault();
		};
	},

	handleMouseMove: function(foldingLine){
		return function(event) {
			if (!addView.mouseClicked) {
			  return;
			}
			var planeCenter = {
				x: foldingLine.parentPlane.center[0],
				y: foldingLine.parentPlane.center[1]
			};
			var coords = pixelToWorldCoords(getMouse(event, canvas));
			
			var angle = Math.atan2(coords.y - planeCenter.y, coords.x - planeCenter.x);
			angle = (angle * 180 / Math.PI) % 360;

			foldingLine.setOrientation(90+angle);
		};
	},

};



var stylePaddingLeft;
var stylePaddingTop;
var styleBorderLeft;
var styleBorderTop;
var htmlTop;
var htmlLeft;

function initInteraction(){
	stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
	stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
	styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
	styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
	// Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
	// They will mess up mouse coordinates and this fixes that
	var html = document.body.parentNode;
	htmlTop = html.offsetTop;
	htmlLeft = html.offsetLeft;
}

function getMouse(e, canvas){
    var element = canvas, offsetX = 0, offsetY = 0, mx, my;

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
    offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
    offsetY += stylePaddingTop + styleBorderTop + htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    // We return a simple javascript object with x and y defined
    return {x: mx, y: my};
}

function pixelToWorldCoords(pixelCoords){
    var newX = pixelCoords.x - gl.viewportWidth/2;
    var newY = -(pixelCoords.y - gl.viewportHeight/2);

    return {x: newX, y: newY};
}