// Huddle object - Main object
function Huddle(width, height, script, canvas) {
    this.width = width;
	this.height = height;
	this.pjs = undefined;
	this.numberOfGenerations = undefined;
	this.ringGap = 50;
}

// Processing() needs to be called before this method is called
Huddle.prototype.initHuddle = function() {
	this.drawRings();
	this.drawNodes();
};

Huddle.prototype.drawRings = function() {
	var generations = this.getNumberOfGenerations();
	for (var i=0; i<=generations; i++) {
		this.pjs.stroke(0,156,255);
		this.pjs.ellipse(this.width/2, this.height/2, i * this.ringGap, i * this.ringGap);
	}
};

Huddle.prototype.drawNodes = function() {
	var rootNode = this.getRootNode();
	rootNode.setX(0.0);
	rootNode.setY(0.0);
	rootNode.calculateThetaAAndB();
	this.drawNode(rootNode);
	$("nodes ol").each(function(index, node) {
		if (node.contains("li")) {
			node.children("li").each(index, childnode) {
				
			}
		}
	});
};

Huddle.prototype.getRootNode = function() {
	var nodeElement = $("nodes ol:first li:first");
	var node = new Node(nodeElement, pjs);
	return 
};

Huddle.prototype.getNumberOfGenerations = function() {
	if (!this.numberOfGenerations) {
		return $("#nodes ol").size() - 1;
	}
};

Huddle.prototype.calculateThetaAAndB = function(node) {
	//var factor = node.getThetaB()
	//var thetaA = 
};

// Node
function Node(nodeElement) {
	this.pjs = pjs;
	this.nodeElement = nodeElement;
	this.x = undefined;
	this.y = undefined;
	this.thetaA = undefined;
	this.thetaB = undefined;
}

Node.prototype.setX(x) = function() {
	this.x = x;
};

Node.prototype.setY() = function() {
	this.y = y;
};

Node.prototype.getThetaB() = function() {
	return this.thetaB;
};

Node.prototype.getThetaA() = function() {
	return this.thetaA;
};

Node.prototype.calculateThetaAAndB = function() {
	factor  = (this.getThetaB() - this.getThetaA()) / (this.getWeight() - this.getIndWeight());
	thetaA  = this.getThetaA();
	var numberOfChildren = this.childCount();
	this.nodeElement.children().each(function(index, childElement) {
		var child = new Node(childElement);
		var deltaTheta = child.getWeight() * factor;
		child.setThetaA(thetaA);
		child.setThetaB(thetaA + deltaTheta);
		var x = (child.getLevel()) * 
	});
	for ( var i=0; i < numberOfChildren; i++ ) {
		nodeChild = this.getChildAt(i);
		//  Factor based on all the nodes connected to the child
						deltaTheta = nodeChild.getWeight()*factor;
						nodeChild.setThetaA( thetaA );
						nodeChild.setThetaB( thetaA + deltaTheta );
						x=(nodeChild.getLevel())*Decorations.getInstance().getRGeneration()
			                					*Math.cos(thetaA+deltaTheta/2.);
						y=(nodeChild.getLevel())*Decorations.getInstance().getRGeneration()
			                					*Math.sin(thetaA+deltaTheta/2.);
	
						nodeChild.setPedX(x);
						nodeChild.setPedY(y);
	
						calculateThetaAAndB(nodeChild);
						thetaA = nodeChild.getThetaB();
	}
};

Node.prototype.childCount = function() {
	return this.nodeElement.children("li").size();
};

Node.prototype.drawNode() = function() {
	
};