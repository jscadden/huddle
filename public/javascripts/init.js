var huddle = undefined;
var pjs = undefined;

$(document).ready(function() {
	// Pass the script through to a string using jQuery.ajax();
  	//var script = $.ajax({url: "processingscripts/main.pjs", async: false}).responseText;
  	//script += $.ajax({url: "circle.pjs", async: false}).responseText;

  	// Store the Canvas element in an object alias
  	var canvas = $('canvas');

	//pjs = Processing(canvas[0], script);
	
	$("#nodes").huddle({
		canvas: canvas[0],
	});
	
  	//huddle = new Huddle(640,480, script, canvas[0]);
	//huddle.initHuddle();
});