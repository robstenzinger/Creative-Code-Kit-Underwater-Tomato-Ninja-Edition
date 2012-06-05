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