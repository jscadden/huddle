(function($) {
	$.fn.huddle = function(options) {
		var nodesElement = this;
		var pjs = undefined;
		var opts = $.extend({}, $.fn.huddle.defaults, options);		
		
		setupAndStartProcessing();
		drawGenerations();
		calculateWeights(getRootNodeElement());
		positionAndDrawNodes();
		
		function setupAndStartProcessing() {
			pjs = Processing(opts.canvas);
			pjs.size(opts.width,opts.height);
			pjs.background(opts.background);
			pjs.frameRate(0);
			pjs.noLoop();
			pjs.translate(opts.width/2, opts.height/2);
			
			// Init rootNode
			var rootNodeData = getNodeData(getRootNodeElement());
			if (rootNodeData) {
				rootNodeData.data("x", 0.0);
				rootNodeData.data("y", 0.0);
				rootNodeData.data("thetaStart", 0.0 * Math.PI); 
				rootNodeData.data("thetaEnd", -2 * Math.PI);  
				rootNodeData.data("generation", 0);
			}
		};
		
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
			var wt = 0.;
			
			var generation = 0;
			if (nodeElement.parents("ol").size() > 0) { 
				generation = $(nodeElement.parents("ol")[0]).data("generation");
			}

			wt = 1.0/Math.pow((generation + 1) * opts.ringGap, 2);
		    nodeData.data("indWeight", wt);

			var childrenList = nodeElement.children("ol");
			if (childrenList) {
				childrenList.children().each(function(index, childElement) {
					wt += calculateWeights($(childElement));
				});
			}
			nodeData.data("weight", wt);
			return wt;
		};
		
		function positionAndDrawNodes() {
			var rootNodeData = getNodeData(getRootNodeElement());
			if (rootNodeData) {				
				positionChildNodes(getRootNodeElement());
				drawConnections();
				drawNode(rootNodeData);
				drawChildNodes();				
			}			
		};
		
		function drawConnections() {
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
		
		function drawNode(node) {
			pjs.fill(255, 0, 0);
			pjs.strokeWeight(1);
			pjs.stroke(0,0,0);
			pjs.ellipse(node.data("x"), node.data("y"), 15, 15);
		};
		
		function getNumberOfGenerations() {
			var numberOfGenerations = 0;
			nodesElement.find("ol").each(function(index, generationElement) {
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
		
		function getNodeData(nodeElement) {
			if (nodeElement) {
				return nodeElement.children("div:first");
			}
		};
		
		function getRootNodeElement() {
			return nodesElement.children("ol:first li:first");
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
		
		return this;
	};	
	
	// plugin defaults - added as a property on our plugin function
	$.fn.huddle.defaults = {
		canvas: undefined,
		width: 1000,
    	height: 600,
		background: 50,
		ringGap: 50
	};
})(jQuery);



