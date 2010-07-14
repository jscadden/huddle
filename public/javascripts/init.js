var nodeIdAdded = undefined;

$(document).ready(function() {
	//$("#node_details").hide();
	$("#nodes").huddle($('canvas'), {
		width: 240,
		height: 240,
		onNodeSelected: nodeSelected
	});
	
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
	
	$("#nodes_wrapper .reply a").fancybox({
		'hideOnContentClick': false,
		'scrolling': 'no',
		'titleShow': false
	});
});

function closeAddNodeForm(request) {
	nodeIdAdded = request.responseText;
	$.fancybox.close();
}

function stompOnMessageFrame(frame) {
	//$.fancybox.close();
	var nodeJson = eval('(' + frame.body + ')').node;
	addNode(nodeJson);
}

function addNode(nodeJson) {
	$parentNode = nodeJson.parent_id > 0 ? $('#nodes #node_' + nodeJson.parent_id) : $('#nodes div:first');
	var $generation = $parentNode.siblings("ol");
	if ($generation.length == 0) {
		$generation = $('<ol/>');
		$parentNode.parent().append($generation);
	}
	var $nodeDataCloned = $parentNode.clone();
	populateNodeDetailsWithResponse($nodeDataCloned, nodeJson);
	$('<li/>').append($nodeDataCloned).appendTo($generation);
	if (nodeIdAdded == nodeJson.id) {
		$.fn.huddle.selectNode(nodeJson.id);
	}
	$.fn.huddle.redraw();
}

function updateZoom(cbObj) {
	$.fn.huddle.zoom(cbObj.value);
}

function nodeSelected($nodeData) {
	populateNodeDetails($nodeData);
}

function populateNodeDetails($nodeData) {
	var $nodeDataCloned = $nodeData.clone();
	$('#node_contents').hide().html("").append($nodeDataCloned).fadeIn(160);
	var hieght = $(window).height() - 150;
	if ($('#nodes_wrapper').is(':hidden')) {
		$('#nodes_wrapper').stop().show().animate({top: hieght}, {queue:false, duration:160});
	}
	if (!$nodeData.data("cached")) {
		$.getJSON("/nodes/" + $nodeDataCloned.attr("id").replace("node_", ""), function(response) {
			populateNodeDetailsWithResponse($nodeDataCloned, response.node);
			populateNodeDetailsWithResponse($nodeData, response.node);  // cache the node details so that we don't have to request it again
			$nodeData.data("cached", true);
		});
	}
	else {
		setReplyLink($nodeDataCloned.attr('id').replace('node_', ''));
	}
}

function populateNodeDetailsWithResponse($nodeDataCloned, responseNode) {
	setReplyLink(responseNode.id);
	$nodeDataCloned.attr('id', 'node_' + responseNode.id);
	if (responseNode.viewed_by_user) {
		$nodeDataCloned.addClass('viewed');
	}
	else {
		$nodeDataCloned.removeClass('viewed');
	}
	$nodeDataCloned.children('.title').html(responseNode.title);
	$nodeDataCloned.children('.description').html(responseNode.description);
	$nodeDataCloned.children('.author').html(responseNode.user.login);
	var createDate = humane_date(responseNode.created_at);
	$nodeDataCloned.children('.create_date').html(createDate);
	$nodeDataCloned.children('.comments').text(responseNode.comment_count + " Comment(s)");
	$nodeDataCloned.children('.comments').children().hide();
}

function setReplyLink(parentId) {
	$('#nodes_wrapper').find('.reply a').attr("href", "/nodes/new?parent=" + parentId);
}