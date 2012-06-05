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

	document.body.appendChild(parallax);
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