// HTML5 Game Starter Kit

/*

By Rob Stenzinger and others as noted


MIT License

Copyright (C) 2012 Rob Stenzinger

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the 
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

// SETTINGS ------------------------------------------------------

//
var gameWidth = 640;
var gameHeight = 480;
var gameZoomLevel = 1;

// screen size variables
var	SCREEN_WIDTH = window.innerWidth;
var	SCREEN_HEIGHT = window.innerHeight;
var	HALF_WIDTH = window.innerWidth / 2;
var	HALF_HEIGHT = window.innerHeight / 2;

// mouse variables
var	mouseX = HALF_WIDTH; 
var	mouseY = HALF_HEIGHT; 
var	mouseDown = false;

// particle variables
var	particles = [];
var	spareParticles = []; 
var	MAX_PARTICLES = 5;

// layers to contain the game elements
var	container =	document.createElement('div');

// avatar
var	avatar = null;

// the particle emitter
var emitter = new Emitter(container);

// container
container.className = "container"; 
container.style.width = gameWidth+"px"; 
container.style.height = gameHeight+"px"; 
container.dataset.width = gameWidth;
container.dataset.height = gameHeight;
container.dataset.x = Math.floor((SCREEN_WIDTH - gameWidth)/2);
container.dataset.y = Math.floor((SCREEN_HEIGHT - gameHeight)/2);
container.dataset.y = (container.dataset.y > 0) ? container.dataset.y : 0;
container.style.top = container.dataset.y + "px";
container.style.left = container.dataset.x + "px"; 
document.body.appendChild(container);

var ground = document.createElement('div');


// SIZE and POSITION ------------------------------------------------------

function getPosition(domElement){
	var domElementTransform = new WebKitCSSMatrix(window.getComputedStyle(domElement).webkitTransform);
	//x, y
	return [Number(String(domElementTransform.e).replace("px","")), Number(String(domElementTransform.f).replace("px",""))]
}

function getSize(domElement){
	var domElementWidth = Number(String(domElement.style.width).replace("px","")),
		domElementHeight = Number(String(domElement.style.height).replace("px",""));
	//width, height
	return [domElementWidth, domElementHeight]
}


// CSS PREFIX HELPER ------------------------------------------------------

// css prefix finder

var domPrefixes = "Webkit Moz O ms Khtml".split(" ");
var animation = false;
var transformation = false;
var transition = false;
var animationstring = "animation";
var transformstring = "transform";
var transitionstring = "transition";
var keyframeprefix = "";
var pfx = "";

function prepareCSSPrefix(){

	var e = document.body;

	if( e.style.animationName ) { animation = true; }    
	if( e.style.transform ) { transformation = true; }    
	if( e.style.transition ) { transition = true; }    

	if( animation === false ) {
		for( var i = 0; i < domPrefixes.length; i++ ) {
		  if( e.style[ domPrefixes[i] + "AnimationName" ] !== undefined ) {
		    pfx = domPrefixes[ i ];
		    animationstring = pfx + "Animation";
		    keyframeprefix = "-" + pfx.toLowerCase() + "-";
		    animation = true;
		    break;
		  }
		}
	}

	if( transformation === false ) {
		for( var i = 0; i < domPrefixes.length; i++ ) {
		  if( e.style[ domPrefixes[i] + "Transform" ] !== undefined ) {
		    pfx = domPrefixes[ i ];
		    transformstring = pfx + "Transform";
		    transformation = true;
		    break;
		  }
		}
	}

	if( transition === false ) {
		for( var i = 0; i < domPrefixes.length; i++ ) {
		  if( e.style[ domPrefixes[i] + "Transition" ] !== undefined ) {
		    pfx = domPrefixes[ i ];
		    transitionstring = pfx + "Transition";
		    transition = true;
		    break;
		  }
		}
	}	

}

// PARALLAX ------------------------------------------------------

// parallax 

function parallaxLayer(imageURL, width, height, x, y, className){

	var parallax = document.createElement("div");

	parallax.dataset.x = x;
	parallax.dataset.y = y;
	parallax.dataset.width = width;
	parallax.dataset.height = height;	

	parallax.className = (className) ? className : "";
	parallax.style.background = "url(" + imageURL + ")";
	parallax.style.width = width + "px";
	parallax.style.height = height + "px";
	parallax.style.backgroundSize = width + "px " + height + "px";
	parallax.style.position = "absolute";
	parallax.style.display = "block";
	parallax.style[transformstring + "Origin"] = "0px 0px";

	if(container){
		container.appendChild(parallax);
	}else{
		document.body.appendChild(parallax);
	}

	return parallax;
}


function verticalParallax(parallaxPanel, parallaxPanel2, directionY, speedY, distanceFactor, zoomFactor, zFactor){
	
	distanceFactor = (distanceFactor) ? distanceFactor:.5;
	zoomFactor = (zoomFactor) ? zoomFactor:1;
	zFactor = (zFactor) ? zFactor:0;

	var parallaxPanelY = Number(parallaxPanel.dataset.y);
	var parallaxPanel2Y = Number(parallaxPanel2.dataset.y);
	var height = Number(parallaxPanel.dataset.height);

	if (directionY === 1){
		parallaxPanelY += speedY*distanceFactor;
		parallaxPanelY = (parallaxPanelY > height) ? 0:parallaxPanelY;
		parallaxPanel2Y = (parallaxPanelY < height) ? parallaxPanelY-height:parallaxPanelY+height;

		parallaxPanel2Y = zoomFactor * parallaxPanel2Y;
		parallaxPanelY = zoomFactor * parallaxPanelY;		
	}else{
		parallaxPanelY = parallaxPanelY - (speedY*distanceFactor);
		parallaxPanelY = (parallaxPanelY < height && parallaxPanelY > (-1*height)) ? parallaxPanelY:0;
		parallaxPanel2Y = (parallaxPanelY > (-1*height)) ? parallaxPanelY+height:parallaxPanelY-height;

		parallaxPanel2Y = zoomFactor * parallaxPanel2Y;
		parallaxPanelY = zoomFactor * parallaxPanelY;		
	}

	parallaxPanel.dataset.y = parallaxPanelY;
	parallaxPanel2.dataset.y = parallaxPanel2Y;

	parallaxPanel.style[ transformstring ] = "translate3d(0px, " + parallaxPanelY + "px, " + zFactor + "px) scale(" + zoomFactor + ")";
	parallaxPanel2.style[ transformstring ] = "translate3d(0px, " + parallaxPanel2Y + "px, " + zFactor + "px) scale(" + zoomFactor + ")";

}


function horizontalParallax(parallaxPanel, parallaxPanel2, directionX, speedX, distanceFactor, zoomFactor, zFactor){
	
	distanceFactor = (distanceFactor) ? distanceFactor:.5;
	zoomFactor = (zoomFactor) ? zoomFactor:1;
	zFactor = (zFactor) ? zFactor:0;

	var parallaxPanelX = Number(parallaxPanel.dataset.x);
	var parallaxPanel2X = Number(parallaxPanel2.dataset.x);
	var width = Number(parallaxPanel.dataset.width);

	if (directionX === 1){
		parallaxPanelX += speedX*distanceFactor;
		parallaxPanelX = (parallaxPanelX > width) ? 0:parallaxPanelX;
		parallaxPanel2X = (parallaxPanelX < width) ? parallaxPanelX-width:parallaxPanelX+width;

		parallaxPanel2X = zoomFactor * parallaxPanel2X;
		parallaxPanelX = zoomFactor * parallaxPanelX;		
	}else{
		parallaxPanelX = parallaxPanelX - (speedX*distanceFactor);
		parallaxPanelX = (parallaxPanelX < width && parallaxPanelX > (-1*width)) ? parallaxPanelX:0;
		parallaxPanel2X = (parallaxPanelX > (-1*width)) ? parallaxPanelX+width:parallaxPanelX-width;

		parallaxPanel2X = zoomFactor * parallaxPanel2X;
		parallaxPanelX = zoomFactor * parallaxPanelX;		
	}

	parallaxPanel.dataset.x = parallaxPanelX;
	parallaxPanel2.dataset.x = parallaxPanel2X;

	parallaxPanel.style[ transformstring ]  = "translate3d("+parallaxPanelX+"px, 0px, " + zFactor + "px) scale(" + zoomFactor + ")";
	parallaxPanel2.style[ transformstring ] = "translate3d("+parallaxPanel2X+"px, 0px, " + zFactor + "px) scale(" + zoomFactor + ")";

}

// PARTICLES ------------------------------------------------------


/*
DOMParticle by Seb Lee-Delisle, sebleedelisle.com
with updates by Rob Stenzinger, interactive-storyteller.com


Copyright (c)2010-2011, Seb Lee-Delisle, sebleedelisle.com
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/
function DOMParticle(posx, posy, imageSRC, imageWidth, imageHeight) {

	// use this code if you want to use an Image DOM object
	// this.domElement = new Image(); 
	// this.domElement.src = imageSRC;  
	// 
	// this.domElement.style.position = 'absolute';
	
	// and this if you want it to be a div with a background
	this.domElement = document.createElement('div');

	this.domElement.style.background = 'url('+imageSRC+')'; 
	this.domElement.style.position = 'absolute';
	this.domElement.style.display = 'block'; 
	this.domElement.style.width = imageWidth+"px"; 
	this.domElement.style.height = imageHeight+"px";
	
	//this.domElement.style.zIndex = "1000";

	// the position of the particle
	this.posX = posx; 
	this.posY = posy; 
	// the velocity 
	this.velX = 0; 
	this.velY = 0; 
	this.transform3D = false; 
	
	// multiply the particle size by this every frame
	this.shrink = 1; 
	this.size = 1; 
	
	// multiply the velocity by this every frame to create
	// drag. A number between 0 and 1, closer to one is 
	// more slippery, closer to 0 is more sticky. values
	// below 0.6 are pretty much stuck :) 
	this.drag = 1; 
	
	// add this to the yVel every frame to simulate gravity
	this.gravity = 0; 
	
	// current transparency of the image
	this.alpha = 1; 
	// subtracted from the alpha every frame to make it fade out
	this.fade = 0; 

	this.update = function() {
	
		// simulate drag
		this.velX *= this.drag; 
		this.velY *= this.drag;
		
		// add gravity force to the y velocity 
		this.velY += this.gravity; 
		
		// and the velocity to the position
		this.posX += this.velX;
		this.posY += this.velY; 
		
		// shrink the particle
		this.size *= this.shrink;
		
		// and fade it out
		this.alpha -= this.fade; 
	 
	};
	
	this.render = function() {
		var dom = this.domElement,
			styleStr,
			//optimised Math.round snaps to pixels
			px = (0.5 + this.posX) >> 0,
			py = (0.5 + this.posY) >>0 ;
			
		if(this.transform3D)
			styleStr = "translate3d("+px+"px, "+py+"px, 0px) scale("+this.size+")"; 
		else
		 	styleStr = "translate("+px+"px, "+py+"px) scale("+this.size+")"; 
		
		dom.style[ transformstring ] = dom.style.MozTransform = dom.style.OTransform = dom.style.transform = styleStr; 
	};


}

/*
Emitter (particle emitter) by Seb Lee-Delisle, sebleedelisle.com
*/
function Emitter(domContainer){
	
	var particles=[], 
		spareParticles=[];
		
	this.container = domContainer;  
	
	this.update = function(){
		
		for(var i=0; i<particles.length; i++){
			var particle = particles[i]; 
			if(!particle.enabled) continue; 
			particle.update(); 
			if(!particle.enabled) this.removeParticle(particle); 
		}
		
	};

	this.removeAllParticles = function(){
		for(var i=0; i<particles.length; i++){
			var particle = particles[i]; 
			particle.enabled = false; 
			this.removeParticle(particle); 
		}		
	}
	
	this.removeParticle = function(particle) {
		particle.domElement.style.visibility = "hidden"; 
	};
	
	this.makeExplosion = function(xpos, ypos, zpos){
		
		for(var i=0; i<5; i++) {
			var particle = this.makeParticle(); 
			particle.x = xpos; 
			particle.y = ypos; 
			particle.z = zpos; 
			
			particle.xVel = Math.random() - 0.5; 
			particle.yVel = Math.random() - 0.5; 
			particle.zVel = Math.random() - 0.5;
			
			var speed = Math.sqrt((particle.xVel * particle.xVel)+(particle.yVel * particle.yVel)+(particle.zVel * particle.zVel));
			particle.xVel *= 40/speed;
			particle.yVel *= 40/speed;
			particle.zVel *= 40/speed;
			
			particle.scale = 4; 
		
			particle.update(); 
			
		}
		
	};	
	
	this.makeParticle = function(){
		
		var particle; 
		
		if(spareParticles.length>0){
			particle = spareParticles.shift();
			particle.domElement.style.visibility = "visible"; 
		
		} else {
			particle = new Particle("image/particle/smoke-or-dust-small.png"); 
			particles.push(particle); 
			this.container.appendChild(particle.domElement);
		}
		
		particle.enabled = true;  
	
		return particle; 
		
	};
	
}

/*
Particle by Seb Lee-Delisle, sebleedelisle.com
*/
function Particle(imgPath){
	
	var domElement = this.domElement = document.createElement('div');

	this.domElement.style.background = 'url('+imgPath+') transparent'; 
	
	domElement.style.position = 'absolute';
	domElement.style.display = 'block'; 
	domElement.style.width = "32px"; 
	domElement.style.height = "32px";
	domElement.style.webkitTransformOrigin = "16px 16px"; 



	
	this.x = 0; 
	this.y = 0;
	this.z = 0; 
	this.xVel = 0; 
	this.yVel = 0; 
	this.zVel = 0; 
	this.size = 1; 
	
	this.enabled = true; 
	
	this.update = function(){
		
		var drag = 0.84; 
		
		this.xVel*=drag; 
		this.yVel*=drag; 
		this.zVel*=drag; 
		
		this.x+=this.xVel; 
		this.y+=this.yVel; 
		this.z+=this.zVel; 
		
		this.size*=0.9; 

		domElement.style[ transformstring ] = "translate3d("+this.x+"px, "+this.y+"px, "+this.z+"px) scale("+this.size+")"; 
		
		if(this.size<0.05) this.enabled = false; 

	};
	
}


/*
Character by Rob Stenzinger, interactive-storyteller.com
based on the DOMParticle pattern by Seb Lee-Delisle, sebleedelisle.com
*/
function Character(imgPath, w, h, scale){


	
	var domElement = this.domElement = document.createElement('div');


	this.domElement.id = "avatar";
	this.domElement.style.background = 'url('+imgPath+') transparent'; 
	scale = scale||1;
	w = ((w*scale)||32);
	h = (h*scale||32);
	halfw = w/2;
	halfh = h/2;
	domElement.style.position = 'absolute';
	domElement.style.display = 'block'; 
	domElement.style.width = w + "px"; 
	domElement.style.height = h + "px";
	domElement.style.backgroundSize = w + "px " + h + "px";	
	domElement.style.webkitTransformOrigin = halfh + "px " + halfw + "px"; 

	this.emitter = null; //= this.emitter = new Emitter(domElement);

	this.width = w;
	this.height = h;

	this.health = 100;
	
	this.jumping = false;
	this.falling = false;
	this.transitioning = false;
	this.attacking = false;
	this.status = 0;
	
	this.x = 0; 
	this.y = 0;
	this.z = 0; 
	this.xVel = 0; 
	this.yVel = 0; 
	this.zVel = 0; 
	this.drag = 1;
	this.xAccel = 1;
	this.yAccel = 1; 
	this.zAccel = 1; 

	this.size = 1; 
	
	this.targetX = 0;
	this.targetY = 0;
	this.targetZ = 0;
	this.enabled = true; 
	
	this.xHistory = [0,0];
	this.yHistory = [0,0];
	this.zHistory = [0,0];
	
	this.xDirection = "";
	this.yDirection = "";
	this.zDirection = "";
	
	this.rotate = 5;
	this.rotateMax = 5;
	this.rotateDirection = 1;
	
	this.scale = 1;

	this.scaleMax = 1.2;
	this.scaleMin = .97;
	this.scaleDirection = 1;
	this.scaleIncrement = .0125;

	this.scaleX = 1;
	this.scaleY = 1;
	
	this.wobble = false;

	this.fullStop = false;

	this.hurt = function(amount){
		//brief shake
		//1-3 particles fall off the mid section

		if(this.emitter){
			this.emitter.makeExplosion(this.x, this.y, this.z);
		}

		this.health -= amount;

		if(this.health < 0){
			this.burst();
		}
	}

	this.burst = function(){
		//colored particle burst
		//fade/hide the main image

		if(this.emitter){
			this.emitter.makeExplosion(this.x, this.y, this.z);
		}

		this.knockout();
	}

	this.knockout = function(){

		// stop normal animation and moving
		this.fullStop = true;

		// simulate falling to the ground by rotating and repositioning
	    this.domElement.style[ transformstring ] = "translateX(" + this.x + "px) translateY(" + (this.y + this.height) + "px) translateZ(-37px) rotateX(69deg) rotateY(6deg) rotateZ(69deg)";

	    if(this.emitter){
	    	this.emitter.removeAllParticles();
	    }
	}

	this.stand = function(){

		// resume animating and moving
		this.fullStop = false;

		// rotate and position to normal
	    this.domElement.style[ transformstring ] = "translateX(" + this.x + "px) translateY(" + this.y + "px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
	}


	this.dust = function(){
		//kick up a little dust (puff of dust particles) from the ground position of the character
	}

	this.move = function(){

		// console.log(ground);
		if(this.fullStop){
			return;
		}
		// -----------------------				
		var collision = isCollidingRectDomElement(this.domElement, ground, 0, -7);

		// // AVATAR MOVEMENT & JUMPING
		if(this.xDirection !== "stop" && this.jumping === false){				
		// FALLING					
			if(collision == 0){
				//fall to the ground
				// console.log("falling to the ground");
				this.targetY = getPosition(ground)[1] - getSize(this.domElement)[1];
				this.targetX = this.x;
			}else if(collision > 0 && this.jumping === false){
				// console.log("falling to the ground ???");

				var groundPosition = getPosition(ground);
				var avatarPosition = getPosition(this.domElement);
				var avatarSize = getSize(this.domElement);
				var bounceHeight = -10;
				
				this.status = 0;
				
				// position of avatar "on the ground"
				var avatarGroundPositionY = Math.floor(groundPosition[1] - avatarSize[1]);
				var avatarActualPositionY = Math.floor(avatarPosition[1]);// - avatarSize[1];
				var avatarActualPositionX = Math.floor(avatarPosition[0]);// - avatarSize[1];
				
				if(avatarGroundPositionY == avatarActualPositionY){
					// console.log("1");
					this.targetY = avatarActualPositionY + bounceHeight; //(bounce height)
				}
				if(avatarActualPositionX > container.dataset.width){
					// console.log("2");
					this.targetX = container.dataset.width - avatarSize[0];
				}else if(avatarActualPositionX < 0){
					// console.log("3");
					this.targetX = avatarSize[0];
				}
			}
		}else if(this.jumping === true && this.status === 0){
			// BEGINNING JUMP					
			// console.log("beginning jump");
			//todo, move this to its own function
			var groundPosition = getPosition(ground);
			var avatarPosition = getPosition(this.domElement);
			var avatarSize = getSize(this.domElement);
			// var bounceHeight = -10;

			// position of avatar "on the ground"
			// var avatarGroundPositionY = Math.floor(groundPosition[1] - avatarSize[1]);
			var avatarActualPositionY = Math.floor(avatarPosition[1]);// - avatarSize[1];

			// console.log("avatarActualPositionY: " + avatarActualPositionY);
			// console.log("avatarPosition: " + avatarPosition);

			//starting jump
			this.status = 1;
			//todo calculate jump height
			//this.targetY = avatarActualPositionY + (-1 * (avatarSize[1]*3));
			this.targetY = 0;//Math.floor(avatarActualPositionY + (-1 * (gameHeight/2)));

			// console.log("this.targetY: " + this.targetY);


			// //todo: allow avatar to jump higher than the game container
			// if(this.targetY < 0){
			// 	this.targetY = 10;
			// }
			this.jumpY = this.targetY;
			// this.targetX = avatarPosition[0] + ((avatarSize[0]*3));

			// this.targetX = Math.floor(avatarPosition[0] + avatarSize[0]*2) + 150;
			// if(this.scaleX < 0){
			// 	this.targetX *= -1; 
			// }

			if(this.xDirection !== "stop"){
				if(this.scaleX < 0){
					this.targetX = Math.floor(avatarPosition[0] - (avatarSize[0]*2));
				}else{
					this.targetX = Math.floor(avatarPosition[0] + (avatarSize[0]*2));
				}
			}
		}else if(this.jumping === true && this.status === 1){
			// console.log("jumping...");
			// JUMPING
			this.yVel = 3;
			this.xVel = 50;
			this.drag = .025;

			if(this.jumpY <= this.y){ 
				// console.log("top of jump reached!");
			//hit the apex, now time to fall
			// TOP OF JUMP REACHED - START FALLING	    
			this.status = 2;
			this.yVel = 1;
			this.xVel = 2;
			this.drag = .0000021
				    
			//todo, move this to its own function
			var groundPosition = getPosition(ground);
			var avatarPosition = getPosition(this.domElement);
			var avatarSize = getSize(this.domElement);
			// var bounceHeight = -10;

			// position of avatar "closer the ground"
			var avatarGroundPositionY = Math.floor(groundPosition[1] - avatarSize[1]);
			var avatarActualPositionY = Math.floor(avatarPosition[1]);// - avatarSize[1];

			this.targetY = avatarGroundPositionY; //avatarActualPositionY + (-1 * (avatarSize[1]*3));

			if(this.xDirection !== "stop"){
				if(this.scaleX < 0){
					this.targetX = Math.floor(avatarPosition[0] - (avatarSize[0]*2));
				}else{
					this.targetX = Math.floor(avatarPosition[0] + (avatarSize[0]*2));
				}
			}

			}
		}else if(this.jumping === true && this.status === 2){
		// FALLING

			// console.log("falling...");
		    //todo, move this to its own function
		    var groundPosition = getPosition(ground);
		    var avatarPosition = getPosition(this.domElement);
		    var avatarSize = getSize(this.domElement);
		    // var bounceHeight = -10;

		    // position of avatar "closer the ground"
		    var avatarGroundPositionY = Math.floor(groundPosition[1] - avatarSize[1]);
		    var avatarActualPositionY = Math.floor(avatarPosition[1]);// - avatarSize[1];

		    this.yVel = .25;
		    this.drag = .10;
		    this.xVel = 2;

			if(avatarGroundPositionY == avatarActualPositionY || collision > 0){
			  this.jumping = false;
			  this.status = 0;
			  this.jumpY = 0;
			}
		}

		//console.log("moving status... " + this.xDirection + ";" + this.yDirection + ";" + this.zDirection);

	}

	this.prepare = function(){
		this.domElement.style[ transformstring ] = "translate3d("+this.x+"px, "+this.y+"px, "+this.z+"px)";
	}
	
	this.update = function(){

		if(this.fullStop){
			return;
		}


		this.move();

		var drag = 0.84; 
		
		if(Math.abs(this.rotate) > this.rotateMax){
			this.rotate = 0;
			this.rotateDirection = this.rotateDirection * -1;
		}else{
			this.rotate = (Math.abs(this.rotate) + 1) * this.rotateDirection;
		}
		
		if(this.scale >= this.scaleMax){
			this.scaleDirection = this.scaleDirection * -1;
			this.scale = this.scaleMax-this.scaleIncrement;
		}else if(this.scale <= this.scaleMin){
			this.scaleDirection = this.scaleDirection * -1;
			this.scale = this.scaleMin+this.scaleIncrement;
		}else{
			this.scale = this.scale + (this.scaleIncrement * this.scaleDirection);
		}


		this.xVel*=this.drag;
		this.yVel*=this.drag;
		this.zVel*=this.drag;
		
		if (this.x < this.targetX){
			this.x+=this.xVel + (.5* Math.abs(Math.abs(this.x)-Math.abs(this.targetX)));		
		}else{
			this.x+=this.xVel - (.5* Math.abs(Math.abs(this.x)-Math.abs(this.targetX)));			
		}

		if (this.y < this.targetY){
			this.y+=(.5* Math.abs(Math.abs(this.y)-Math.abs(this.targetY)));		
		}else{
			this.y+= -1*(.5* Math.abs(Math.abs(this.y)-Math.abs(this.targetY)));			
		}

		if (this.z < this.targetZ){
			this.z+=this.zVel + (.5* Math.abs(Math.abs(this.z)-Math.abs(this.targetZ)));		
		}else{
			this.z+=this.zVel - (.5* Math.abs(Math.abs(this.z)-Math.abs(this.targetZ)));			
		}
		
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		this.z = Math.round(this.z);

        this.xHistory.push(this.x);
        this.xHistory.limit(2);
        
        this.yHistory.push(this.y);
        this.yHistory.limit(2);
        
        this.zHistory.push(this.z);
        this.zHistory.limit(2);
        
        if(this.xHistory[0] < this.xHistory[1]){
            this.xDirection = "right";
            this.scaleX = 1;
        }else if(this.xHistory[0] > this.xHistory[1]){
            this.xDirection = "left";
            this.scaleX = -1;
        }else if(this.xHistory[0] === this.xHistory[1]){
            this.xDirection = "stop";
        }
        
        if(this.yHistory[0] < this.yHistory[1]){
            this.yDirection = "down";
        }else if(this.yHistory[0] > this.yHistory[1]){
            this.yDirection = "up";
        }else if(this.yHistory[0] === this.yHistory[1]){
            this.yDirection = "stop";
        }

        if(this.zHistory[0] < this.zHistory[1]){
            this.zDirection = "closer";
        }else if(this.zHistory[0] > this.zHistory[1]){
            this.zDirection = "further";
        }else if(this.zHistory[0] === this.zHistory[1]){
            this.zDirection = "stop";
        }       


		if(this.xDirection === "stop" && this.wobble === false){
	        this.domElement.style[ transformstring ] = "translate3d("+this.x+"px, "+this.y+"px, "+this.z+"px) scale("+this.scale+") scaleX("+this.scaleX+") scaleY("+this.scaleY+")";
		}else{
	        this.domElement.style[ transformstring ] = "translate3d("+this.x+"px, "+this.y+"px, "+this.z+"px) rotate("+this.rotate+"deg) scale("+this.scale+") scaleX("+this.scaleX+") scaleY("+this.scaleY+")";
		}
		
		// update particles
		if(this.emitter){
			this.emitter.update();
		}

	};
	
}

// COLLISION ------------------------------------------------------


// currently (as of May 24, 2012) collision detection is only supported in WebKit based browsers:
// Primarily: Apple Safari and Google Chrome

/*
//http://www.webkit.org/blog/386/3d-transforms/
//http://stackoverflow.com/questions/4628876/is-it-possible-to-find-the-current-x-y-z-of-an-element-as-it-moves-using-trans
*/
// returns 1-4 or 0 if not colliding
function isCollidingRectDomElement(a,b,plusMinusX,plusMinusY){
	plusMinusX = (plusMinusX||0);
	plusMinusY = (plusMinusY||0);
	var aTransform = new WebKitCSSMatrix(window.getComputedStyle(a).webkitTransform);
	var bTransform = new WebKitCSSMatrix(window.getComputedStyle(b).webkitTransform);
	var aWidth = Number(String(a.style.width).replace("px","")),
		aHeight = Number(String(a.style.height).replace("px","")),
		aTop = aTransform.f,
		aLeft = aTransform.e,
		bWidth = Number(String(b.style.width).replace("px","")),
		bHeight = Number(String(b.style.height).replace("px","")),
		bTop = bTransform.f,
		bLeft = bTransform.e;

	// console.log(aWidth);
	// console.log(aHeight);
	// console.log(aTop);
	// console.log(aLeft);
	// console.log(bWidth);
	// console.log(bHeight);
	// console.log(bTop);
	// console.log(bLeft);
	// console.log("----------------------");

	//top left a
	if(aLeft > bLeft + plusMinusX
	&& aLeft < (bLeft + bWidth) + plusMinusX
	&& aTop < (bTop + bHeight) + plusMinusY
	&& aTop > bTop + plusMinusY){
		// console.log("collision - top left");
		return 1;
	}
	//top right a
	else if(aLeft + aWidth > bLeft + plusMinusX
	&& aLeft + aWidth < (bLeft + bWidth) + plusMinusX
	&& aTop > bTop + plusMinusY
	&& aTop < (bTop + bHeight) + plusMinusY){
		// console.log("collision - top right");
		return 2;
	}
	//bottom left a
	else if(aLeft > bLeft + plusMinusX
	&& aLeft < (bLeft + bWidth) + plusMinusX
	&& aTop + aHeight < (bTop + bHeight) + plusMinusY
	&& aTop + aHeight > bTop + plusMinusY){
		// console.log("collision - bottom left");
		return 3;
	}
	//bottom right a
	else if(aLeft + aWidth > bLeft + plusMinusX
	&& aLeft + aWidth < (bLeft + bWidth) + plusMinusX
	&& aTop + aHeight < (bTop + bHeight) + plusMinusY
	&& aTop + aHeight > bTop + plusMinusY){
		// console.log("collision - bottom right");
		return 4;
	}
	return 0;
}


function isCollidingPointDomElement(x,y,target){
	var targetTransform = new WebKitCSSMatrix(window.getComputedStyle(target).webkitTransform);
	var targetWidth = Number(String(target.style.width).replace("px","")),
		targetHeight = Number(String(target.style.height).replace("px","")),
		targetTop = targetTransform.f,
		targetLeft = targetTransform.e;
		
	if(x > targetLeft
	&& x < targetLeft + targetWidth
	&& y < targetTop + targetHeight
	&& y > targetTop){
		// console.log("collision - point");
		return 1;
	}else{
		return 0;
	}
}

// UTILITIES ------------------------------------------------------

//http://stackoverflow.com/questions/237104/array-containsobj-in-javascript
Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}
Array.prototype.indexOfContains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return i;
		}
	}
	return -1;
}

// Array Remove - By John Resig (MIT Licensed)
//http://ejohn.org/blog/javascript-array-remove/
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// Array Limit - By Rob Stenzinger (MIT Licensed)
// useful for imposing a queue limit on an array
Array.prototype.limit = function(l, direction) {
	direction = (direction || 1);
	if(direction === 1 && this.length > l){
		this.remove(0,this.length - l);
	}else if(direction === -1 && this.length > l){
		this.remove(l, this.length);
	}
	return this;
};

//random
function randomRange(min, max) {
	return ((Math.random()*(max-min)) + min); 
}





// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());



