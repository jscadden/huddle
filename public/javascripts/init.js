var huddle = undefined;

$(document).ready(function() {
	
	//$("#node_details").hide();
	huddle = $("#nodes").huddle($('canvas'));
	
	fdSliderController.removeOnLoadEvent();
	var options = {
	        // A reference to the input
	        inp:            $("#slider").get(0),
	        // A String containing the increment value (and the return precision, in this case 2 decimal places "x.20")
	        inc:            "0.1",
	        // Maximum keyboard increment (automatically uses double the normal increment if not given)
	        maxInc:         "0.1",
	        // Numeric range
	        range:          [0.1,2],
	        // Callback functions
	        callbacks:      { "update":[updateZoom], "create":[updateZoom] },
	        // String representing the classNames to give the created slider
	        classNames:     "horizontalclass",
	        // Tween the handle onclick?
	        tween:          false,
	        // Is this a vertical slider
	        vertical:       true,
	        // Do we hide the associated input on slider creation
	        hideInput:      true,
	        // Does the handle jump to the nearest click value point when the bar is clicked (tween cannot then be true)
	        clickJump:      true,
	        // Full ARIA required
	        fullARIA:       false,
	        // Do we disable the mouseWheel for this slider
	        noMouseWheel:   false
	};
	fdSliderController.createSlider(options);
});

function updateZoom(cbObj) {
	huddle.zoom(cbObj.value);
}