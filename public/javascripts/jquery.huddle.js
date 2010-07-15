(function($) {
	// Shortcuts (to increase compression)
	var huddlePublic,
	
	// Cached jQuery Object Variables
	$nodesElement,
	$selectedNodeElement,	
	
	// Variables for cached values or use across multiple functions
	opts,
	pjs,
	scaleMax = 100,
	scaleMin = 0.1,
	scale = 1,
	baseX = 0,
	baseY = 0,		
	huddleMoved = true,
	baseDifX = 0,
	baseDifY = 0,
	
	/*
	 * Private methods 
	 */
	
	init = function($canvas) {
		pjs = Processing($canvas[0]);
		pjs.setup = setup;
		pjs.draw = draw;
		pjs.init();
		
		// Init rootNode
		var rootNodeData = getNodeData(getRootNodeElement());
		if (rootNodeData) {
			rootNodeData.data("x", 0);
			rootNodeData.data("y", 0);
			rootNodeData.data("thetaStart", 0 * Math.PI); 
			rootNodeData.data("thetaEnd", -2 * Math.PI);  
			rootNodeData.data("generation", 0);
		}
		
		pjs.mousePressed = function() {
			var x = pjs.mouseX; //GetMousePositionInElement(pjs.mouseX, pjs.mouseY, $canvas[0]).x
			var y = pjs.mouseY; //GetMousePositionInElement(pjs.mouseX, pjs.mouseY, $canvas[0]).y
			baseDifX = x - baseX;
			baseDifY = y - baseY;
		};
		
		pjs.mouseDragged = function() {
			var x = pjs.mouseX; //GetMousePositionInElement(pjs.mouseX, pjs.mouseY, $canvas[0]).x
			var y = pjs.mouseY; //GetMousePositionInElement(pjs.mouseX, pjs.mouseY, $canvas[0]).y
			var xLocation = (x - baseX) / scale;
			var yLocation = (y - baseY) / scale;
			baseX = baseX + (xLocation - baseDifX) * scale;
			baseY = baseY + (yLocation - baseDifY) * scale;
			pjs.redraw();
		};
		
		pjs.mouseMoved = function(event) {
			var x = pjs.mouseX; //GetMousePositionInElement(pjs.mouseX, pjs.mouseY, $canvas[0]).x
			var y = pjs.mouseY; //GetMousePositionInElement(pjs.mouseX, pjs.mouseY, $canvas[0]).y
			var xLocation = (x - baseX) / scale;
			var yLocation = (y - baseY) / scale;
			$("#xValue").val(x);
			$("#yValue").val(y);
		};
		
		pjs.mouseClicked = function() {
			var x = pjs.mouseX; //GetMousePositionInElement(pjs.mouseX, pjs.mouseY, $canvas[0]).x
			var y = pjs.mouseY; //GetMousePositionInElement(pjs.mouseX, pjs.mouseY, $canvas[0]).y
			var xLocation = (x - baseX) / scale;
			var yLocation = (y - baseY) / scale;
			var nodeElement = findNode(xLocation, yLocation);
			if (nodeElement) {
				selectNodePrivate($(nodeElement));
			}
		};
		
		$(window).resize(function() {
			pjs.redraw();
			$("#nodes_wrapper").css('top', $(window).height());
		});
		
		selectNodePrivate(getRootNodeElement());
	},
	
	setup = function() {
		$("#nodes_wrapper").css('top', $(window).height()).hide();
		pjs.size(opts.width,opts.height);
		pjs.frameRate(10);			
		baseX = opts.width/2;
		baseY = opts.height/2;
		//fitToCanvas();
		getNumberOfGenerations();
		calculateWeights(getRootNodeElement());	
	},
	
	draw = function() {
		pjs.size(opts.width,opts.height);
		pjs.background(opts.background);
		pjs.translate(baseX, baseY);
		pjs.scale(scale);
		drawGenerations();
		positionAndDrawNodes();
	},
	
	drawGenerations = function() {
		var generations = getNumberOfGenerations();
		pjs.strokeWeight(2);
		pjs.stroke(0,156,255);
		pjs.noFill();
		for (var i=1; i <= generations; i++) {
			var distance = i * opts.ringGap;
			pjs.ellipse(0, 0, 2 * distance, 2 * distance);
		}
	},
	
	calculateWeights = function(nodeElement) {
		var nodeData = getNodeData(nodeElement);
		var weight = 0.;
		
		var generation = 0;
		if (nodeElement.parents("ol").size() > 0) { 
			generation = $(nodeElement.parents("ol")[0]).data("generation");
		}

		weight = 1.0/Math.pow((generation + 1) * opts.ringGap, 2);
	    nodeData.data("indWeight", weight);

		var childrenList = nodeElement.children("ol");
		if (childrenList) {
			childrenList.children().each(function(index, childElement) {
				weight += calculateWeights($(childElement));
			});
		}
		nodeData.data("weight", weight);
		return weight;
	},
	
	positionAndDrawNodes = function() {
		var rootNodeData = getNodeData(getRootNodeElement());
		if (rootNodeData) {							
			if (huddleMoved) {
				positionChildNodes(getRootNodeElement());
				drawConnectionLines();
			}
			drawNode(rootNodeData);	
			drawChildNodes();				
		}			
	},
	
	drawConnectionLines = function() {
		pjs.stroke(255,255,255);
		pjs.strokeWeight(1);
		getRootNodeElement().find("ol li").each(function(index, childElement) {
			var childData = getNodeData($(childElement));
			var parentData = getNodeData($($(childElement).parents("li")[0]));
			pjs.line(childData.data("x"), childData.data("y"), parentData.data("x"), parentData.data("y"));
		});
	},
	
	drawChildNodes = function() {
		getRootNodeElement().find("li").each(function(index, nodeElement) {
			var $nodeElement = $(nodeElement);
			var nodeData = getNodeData($nodeElement);
			drawNode(nodeData);
		});
	},
	
	drawNode = function($nodeData) {
		if ($selectedNodeElement) {
			var selectedNodeData = getNodeData($selectedNodeElement);
		 	if ($nodeData.attr("id") == selectedNodeData.attr("id")) {
				// Draws the target around the selected node
				pjs.strokeWeight(2);
				pjs.stroke(255,255,255);
				// Top left
				pjs.line($nodeData.data("x") - 10, $nodeData.data("y") - 10, $nodeData.data("x") - 5, $nodeData.data("y") - 10); // horizontal
				pjs.line($nodeData.data("x") - 10, $nodeData.data("y") - 10, $nodeData.data("x") - 10, $nodeData.data("y") - 5); // vertical
				// Top right
				pjs.line($nodeData.data("x") + 10, $nodeData.data("y") - 10, $nodeData.data("x") + 5, $nodeData.data("y") - 10); // horizontal
				pjs.line($nodeData.data("x") + 10, $nodeData.data("y") - 10, $nodeData.data("x") + 10, $nodeData.data("y") - 5); // vertical
				// bottom left
				pjs.line($nodeData.data("x") - 10, $nodeData.data("y") + 10, $nodeData.data("x") - 10, $nodeData.data("y") + 5); // horizontal
				pjs.line($nodeData.data("x") - 10, $nodeData.data("y") + 10, $nodeData.data("x") - 5, $nodeData.data("y") + 10); // vertical
				// bottom right
				pjs.line($nodeData.data("x") + 10, $nodeData.data("y") + 10, $nodeData.data("x") + 5, $nodeData.data("y") + 10); // horizontal
				pjs.line($nodeData.data("x") + 10, $nodeData.data("y") + 10, $nodeData.data("x") + 10, $nodeData.data("y") + 5); // vertical
			} else {
				pjs.fill(255, 0, 0);
			}
		}
		
		if ($nodeData.hasClass("viewed")) {
			pjs.fill(255, 0, 0);
		}
		else {
			pjs.fill(50,50,50);
		}										
		pjs.strokeWeight(1);
		pjs.stroke(255,255,0);
		pjs.ellipse($nodeData.data("x"), $nodeData.data("y"), opts.nodeDiameter, opts.nodeDiameter);
	},
	
	getNumberOfGenerations = function() {
		var numberOfGenerations = 0;
		$nodesElement.find("ol").each(function(index, generationElement) {
			var generationNumber = 0;
			if ($(generationElement).parents("ol").size() > 0) {
				var parentGenerationNumber = $($(generationElement).parents("ol")[0]).data("generation");
				generationNumber = ++parentGenerationNumber;
			}
			$(generationElement).data("generation", generationNumber);
			if (generationNumber > numberOfGenerations) {
				numberOfGenerations = generationNumber;
			}				
		});
		return numberOfGenerations;
	},
	
	getNodeData = function($nodeElement) {
		if ($nodeElement) {
			return $nodeElement.children("div:first");
		} else {
		    return null;
		}
	},
	
	getRootNodeElement = function() {
		return $nodesElement.children("ol:first li:first");
	},
	
	positionChildNodes = function(nodeParentElement) {
			var nodeParentData = getNodeData(nodeParentElement);
			var factor  = (nodeParentData.data("thetaEnd") - nodeParentData.data("thetaStart")) / (nodeParentData.data("weight") - nodeParentData.data("indWeight"));
			var thetaStart  = nodeParentData.data("thetaStart");

			var childrenList = nodeParentElement.children("ol");
			if (childrenList) {
				childrenList.children().each(function(index, childElement) {
					var $childElement = $(childElement);
					var childData = getNodeData($childElement);
					var deltaTheta = factor * childData.data("weight");
					childData.data("thetaStart", thetaStart);
					childData.data("thetaEnd", thetaStart + deltaTheta);
					var x = ($childElement.parent().data("generation")) * opts.ringGap * Math.cos(thetaStart + deltaTheta/2);
					var y = ($childElement.parent().data("generation")) * opts.ringGap * Math.sin(thetaStart + deltaTheta/2);
					childData.data("x", x);
					childData.data("y", y);

					positionChildNodes($childElement);
					thetaStart = childData.data("thetaEnd");
				});
			}		
	},
	
	nodeHit = function(nodeData, x, y)   
	{  
	   	var disX = (nodeData.data("x") - x);  
	   	var disY = (nodeData.data("y") - y);  
	   	if(Math.sqrt(square(disX) + square(disY)) < (opts.nodeDiameter)/2 ) {  
	    	return true;  
	   	} else {  
	     	return false;  
	   	}  
	},	
	
	square = function(num)
	{
		return num * num;
	},
		
	GetMousePositionInElement = function(mouseX, mouseY,element) {
        var x = 0; // x position
        var y = 0; // y position

        /* This loop moves up the tree of offsetParents and adds the offsetTop and offsetLeft of each unitl offsetParent equals null. 
           Eventually, regardless of the actual composition of the offsetParent tree,
           this leads to the real coordinates of the element on the screen */

         while(element.offsetParent != null) {

         	x = element.offsetLeft + x;
         	y = element.offsetTop + y;

          	element=element.offsetParent;
        }
        /* gets the mouse position relative to the element by subtracting the position of the element (relative to the page) from 
           the mouse position (relative to the page). */ 

        x = mouseX - x; 
        y = mouseY - y;        

        return { x: x, y: y}; //returns the muse position relative to the element
    },

	selectNodePrivate = function($nodeElement) {
		$selectedNodeElement = $nodeElement;
		var $selectedNodeData = getNodeData($selectedNodeElement);
		$selectedNodeData.addClass("viewed");
		if (opts.onNodeSelected) {
			opts.onNodeSelected($selectedNodeData);
		}
	},
	
	findNode = function(x, y) {
		var nodeFound = undefined;
		$nodesElement.find("li").each(function(index, nodeElement) {
			var $nodeElement = $(nodeElement);
			var nodeData = getNodeData($nodeElement);
			if (nodeHit(nodeData, x, y)) {
				nodeFound = nodeElement;
				return false;
			} else {
			    return true
			}
		});
		return nodeFound;
	},
	
	findNodeElement = function(nodeId) {
		return $("#node_" + nodeId).parent();
	};
	
	fitToCanvas = function() {
		var scaleX = undefined;
		var scaleY = undefined;
		var xTranslate = opts.width / 2;
		var yTranslate = opts.height / 2;
		var xScale = 1;
		var yScale = 1;
		
		scale = Math.min(scale, scaleMax);
		scale = Math.max(scale, scaleMin);
		scale = Math.min(scale, (Math.min(opts.width,opts.height)/opts.ringGap));
		scale *= 0.8;
		xtrans = opts.width / 2. - scale * opts.width / 2.;
		ytrans = opts.height / 2. - scale * opts.height / 2.;				
		scaleValue = scale;
		translateX = xtrans;
		translateY = ytrans;
	};
	
	/*
	* Public methods
	*/
	huddlePublic = $.fn.huddle = function($canvas, options) {
		$nodesElement = this;
		opts = $.extend({}, $.fn.huddle.defaults, options);
		init($canvas);
		return this;
	};	
	
	huddlePublic.zoom = function(value) {
		scale = value;
	};
	
	huddlePublic.redraw = function() {
		getNumberOfGenerations();
		calculateWeights(getRootNodeElement());
		pjs.redraw();
	};

	huddlePublic.addNode = function(nodeJson) {
		$rootNode = getRootNodeElement();
	};
	
	huddlePublic.selectNode = function(id) {
		selectNodePrivate(findNodeElement(id));
	};
	
	// plugin defaults - added as a property on our plugin function
	huddlePublic.defaults = {
		width: $(window).width(),
    		height: $(window).height(),
		background: 50,
		ringGap: 50,
		nodeDiameter: 15,
		onNodeSelected: false
	};
})(jQuery);



