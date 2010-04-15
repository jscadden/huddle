(function($) {
	$.fn.huddle = function(canvas, options) {
		var $nodesElement = this;		
		var $canvas = canvas;
		var opts = $.extend({}, $.fn.huddle.defaults, options);	
		var $selectedNodeElement = undefined;
		var scaleMax = 100;
		var scaleMin = 0.1;
		var scale = 1;
		var baseX = 0;
		var baseY = 0;		
		var huddleMoved = true;	
		var baseDifX = 0;
		var baseDifY = 0;
		
		
		
		var pjs = Processing($canvas[0]);
		pjs.setup = setup;
		pjs.draw = draw;
		pjs.init();
		$selectedNodeElement = getRootNodeElement();
		populateNodeDetails($selectedNodeElement);
		
		$(window).resize(function() {
			opts.width = $(window).width();
			opts.height = $(window).height();
			pjs.redraw();
			$("#nodes_wrapper").css('top', $(window).height());
		});
		
		//$('body').mousewheel(function(event, delta) {
		//	scale = (delta > 0) ? scale += 0.1 : scale -= 0.1;
		//	pjs.redraw();
		//});
		
		function setup() {
			$("#nodes_wrapper").css('top', $(window).height()).hide();
			pjs.size(opts.width,opts.height);
			pjs.frameRate(10);			
			baseX = opts.width/2;
			baseY = opts.height/2;
			//fitToCanvas();
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
					$selectedNodeElement = $(nodeElement);
					populateNodeDetails($selectedNodeElement);
				}
			};
			
			$('#node_details').click(function() {
				$('#node_details').hide("slide", {direction: "left"}, 500);
			});
			
			$('#nodes').click(function() {
				$('#nodes').hide("slide", {direction: "right"}, 500);
			});
			
			/*pjs.mouseScrolled = function() {
				if (pjs.mouseScroll > 0) {
					alert("Scrollup");
				}
				else if (pjs.mouseScroll < 0) {
					alert("Scrolldown");
				}
			};*/
			
			getNumberOfGenerations();
			calculateWeights(getRootNodeElement());
						
			// Init rootNode
			var rootNodeData = getNodeData(getRootNodeElement());
			if (rootNodeData) {
				rootNodeData.data("x", 0);
				rootNodeData.data("y", 0);
				rootNodeData.data("thetaStart", 0 * Math.PI); 
				rootNodeData.data("thetaEnd", -2 * Math.PI);  
				rootNodeData.data("generation", 0);
			}
		};
		
		function draw() {
			pjs.size(opts.width,opts.height);
			pjs.background(opts.background);
			pjs.translate(baseX, baseY);
			pjs.scale(scale);
			drawGenerations();
			positionAndDrawNodes();
		}
		
		function drawGenerations() {
			var generations = getNumberOfGenerations();
			pjs.strokeWeight(2);
			pjs.stroke(0,156,255);
			pjs.noFill();
			for (var i=1; i <= generations; i++) {
				var distance = i * opts.ringGap;
				pjs.ellipse(0, 0, 2 * distance, 2 * distance);
			}
		};
		
		function calculateWeights(nodeElement) {
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
		};
		
		function positionAndDrawNodes() {
			var rootNodeData = getNodeData(getRootNodeElement());
			if (rootNodeData) {							
				if (huddleMoved) {
					positionChildNodes(getRootNodeElement());
					drawConnectionLines();
				}
				drawNode(rootNodeData);	
				drawChildNodes();				
			}			
		};
		
		function drawConnectionLines() {
			pjs.stroke(255,255,255);
			pjs.strokeWeight(1);
			getRootNodeElement().find("ol li").each(function(index, childElement) {
				var childData = getNodeData($(childElement));
				var parentData = getNodeData($($(childElement).parents("li")[0]));
				pjs.line(childData.data("x"), childData.data("y"), parentData.data("x"), parentData.data("y"));
			});
		};
		
		function drawChildNodes() {
			getRootNodeElement().find("li").each(function(index, nodeElement) {
				var $nodeElement = $(nodeElement);
				var nodeData = getNodeData($nodeElement);
				drawNode(nodeData);
			});
		};
		
		function drawNode(nodeData) {
			if ($selectedNodeElement) {
				var selectedNodeData = getNodeData($selectedNodeElement);
			 	if (nodeData.attr("id") == selectedNodeData.attr("id")) {
					pjs.fill(25,25,25);
				} else {
					pjs.fill(255, 0, 0);
				}
			}
			else {
				pjs.fill(255, 0, 0);
			}										
			pjs.strokeWeight(1);
			pjs.stroke(0,0,0);
			pjs.ellipse(nodeData.data("x"), nodeData.data("y"), opts.nodeDiameter, opts.nodeDiameter);
		};
		
		function getNumberOfGenerations() {
			var numberOfGenerations = 0;
			$nodesElement.find("ol").each(function(index, generationElement) {
				var generationNumber = 0;
				if ($(generationElement).parents("ol").size() > 0) {
					var parentGenerationNumber = $($(generationElement).parents("ol")[0]).data("generation");
					generationNumber = ++parentGenerationNumber;
				}
				$(generationElement).data("generation", generationNumber);
				if (generationNumber > numberOfGenerations) {
					numberOfGenerations = generationNumber
				}				
			});
			return numberOfGenerations;
		};
		
		function getNodeData($nodeElement) {
			if ($nodeElement) {
				return $nodeElement.children("div:first");
			}
		};
		
		function getRootNodeElement() {
			return $nodesElement.children("ol:first li:first");
		};
		
		function positionChildNodes(nodeParentElement) {
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
		};		
		
		function nodeHit(nodeData, x, y)   
		{  
		   	var disX = (nodeData.data("x") - x);  
		   	var disY = (nodeData.data("y") - y);  
		   	if(Math.sqrt(square(disX) + square(disY)) < (opts.nodeDiameter)/2 ) {  
		    	return true;  
		   	} else {  
		     	return false;  
		   	}  
		};
		
		function square(num)
		{
			return num * num;
		}
		
		this.zoom = function(value) {
			scale = value;
		};
		
		function GetMousePositionInElement(mouseX, mouseY,element) {
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
        };   

        function fitToCanvas() {
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
		
		function findNode(x, y) {
			var nodeFound = undefined;
			$nodesElement.find("li").each(function(index, nodeElement) {
				var $nodeElement = $(nodeElement);
				var nodeData = getNodeData($nodeElement);
				if (nodeHit(nodeData, x, y)) {
					nodeFound = nodeElement;
					return false;
				}
			});
			return nodeFound;
		};
		
		function populateNodeDetails($nodeElement) {
			var $nodeData = getNodeData($nodeElement);
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
				})
			}
		};
		
		function populateNodeDetailsWithResponse($nodeDataCloned, responseNode) {
			$('#nodes_wrapper').find('.reply a').attr("href", "/nodes/new?parent=" + responseNode.id);
			$nodeDataCloned.children('.description').html(responseNode.description);
			$nodeDataCloned.children('.author').html(responseNode.user.login);
			var createDate = humane_date(responseNode.created_at);
			$nodeDataCloned.children('.create_date').html(createDate);
			$nodeDataCloned.children('.comments').text(responseNode.comment_count + " Comment(s)")
			$nodedataCloned.children('.comments').children.hide();
		};
		
		return this;
	};	
	
	// plugin defaults - added as a property on our plugin function
	$.fn.huddle.defaults = {
		width: $(window).width(),
    	height: $(window).height(),
		background: 50,
		ringGap: 50,
		nodeDiameter: 15
	};
})(jQuery);



