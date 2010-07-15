var nodeIdAdded = undefined;

$(document).ready(function() {
	init_huddle_canvas();
	init_huddle_scaling_slider();
	init_new_node_fancy_box();
	init_node_list();
});

function init_huddle_canvas() {
    $("#nodes").huddle($('canvas'), {
	    width: 240,
	    height: 240,
	    onNodeSelected: nodeSelected // called when huddle is loaded
    });
    $("#huddle_wrapper").css("position", "fixed");
}

function init_huddle_scaling_slider() {
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

    fdSliderController.removeOnLoadEvent();
    fdSliderController.createSlider(options);
}

function init_new_node_fancy_box() {
    $("#nodes_wrapper .reply a").fancybox({
	'hideOnContentClick': false,
	'scrolling': 'no',
	'titleShow': false
    });
    $(".node a.reply").fancybox({
	'hideOnContentClick': false,
	'scrolling': 'no',
	'titleShow': false
    });
}

function init_node_list() {
    $("#content .node").click(function () {
	var self = $(this);
	var node_id = $(this).attr("class").replace(/.*node_(\d+).*/, "$1");
	$.fn.huddle.selectNode(node_id);
    });

    var height = $(window).height();
    height -= $("#tree_nodes").offset().top;
    var bottom = $("#tree_nodes").outerHeight() + $("#tree_nodes").offset().top;
    bottom = $(document).height() - bottom;
    height -= bottom;
    console.log("height: " + height);
    $("#tree_nodes").css("height", "" + height + "px");
}

function closeAddNodeForm(request) {
	nodeIdAdded = request.responseText;
	$.fancybox.close();
}

function stompOnMessageFrame(frame) {
	var nodeJson = eval('(' + frame.body + ')').node;
	addNode(nodeJson);
}

function addNode(nodeJson) {
	$parentNode = nodeJson.parent_id > 0 ? $('#nodes #node_' + nodeJson.parent_id) : $('#nodes div:first');
	var $generation = $parentNode.siblings("ol");
	if ($generation.length == 0) {
		console.log("generation is length 0"); // leaf node
		$generation = $('<ol/>');
		$parentNode.parent().append($generation);
	}
	var $nodeDataCloned = $parentNode.clone();
	populateNodeDetailsWithResponse($nodeDataCloned, nodeJson);
	$('<li/>').append($nodeDataCloned).appendTo($generation);

	add_node_in_content(nodeJson);

	if (nodeIdAdded == nodeJson.id) {
		$.fn.huddle.selectNode(nodeJson.id);
	}
	$.fn.huddle.redraw();
}

function add_node_in_content(nodeJson) {
    var parent = nodeJson.parent_id > 0 ? $(".node.node_" + nodeJson.parent_id) : $("#content .node").eq(0);

    var node = $("<div/>")
	.addClass("node")
	.addClass("node_" + nodeJson.id);
    var title_and_author = $("<div/>").addClass("title_and_author");
    var title = $("<span/>").addClass("title").append(nodeJson.title);
    var author = $("<spanr/>").addClass("author")
	.append(nodeJson.user.login);
    title_and_author.append(title).append("\n").append(author);
    var avatar = $("<div/>").addClass("avatar");
    var img = $("<img/>")
	.attr("src", nodeJson.avatar_url ? nodeJson.avatarUrl : "/images/missing.png")
	.attr("alt", "");
    avatar.append(img);
    var description = $("<description/>").addClass("description")
	.append(nodeJson.description);
    node.append(title_and_author).append(avatar).append(description);
    parent.after(node);
}

function updateZoom(cbObj) {
	$.fn.huddle.zoom(cbObj.value);
}

function nodeSelected($nodeData) {
    var node = $(".node." + $nodeData.attr("id"));

    $(".node").removeClass("selected");
    node.addClass("selected");
    var idx = $("#tree_nodes .node").index(node);
    var scrollTo = Math.max(0, (idx - 2) * $(node).outerHeight());
    $("#tree_nodes").animate({"scrollTop": scrollTo});
    populateNodeDetails($nodeData);
}

function populateNodeDetails($nodeData) {
	var $nodeDataCloned = $nodeData.clone();
	$('#node_contents').hide().html("").append($nodeDataCloned).fadeIn(160);
	var hieght = $(window).height() - 150;
	/*
	if ($('#nodes_wrapper').is(':hidden')) {
		$('#nodes_wrapper').stop().show().animate({top: hieght}, {queue:false, duration:160});
	}
	*/
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

// fill in a node html structure with values from "responseNode", which is the
// json returned to us by the server -- EAW
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

// sets the parent id for the new node form -- EAW
function setReplyLink(parentId) {
	$('#nodes_wrapper').find('.reply a').attr("href", "/nodes/new?parent=" + parentId);
}