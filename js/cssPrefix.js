var cssPrefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

  var css = '-' + pre + '-';

  var cssMatrix = dom + "CSSMatrix";
	var cssTransform = css + "transform";
	if(css === "-moz-"){
		cssTransform = "transform";
    // WebKitCSSMatrix alternative for Firefox
    cssMatrix = "FirminCSSMatrix";
  }

  var cssAnimation = css + "Animation";
  var cssKeyframe = css;

  return {
    dom: dom,
    lowercase: pre,
    css: css,
    js: pre[0].toUpperCase() + pre.substr(1),
    cssTransform: cssTransform,
    cssKeyframe: cssKeyframe,
    cssAnimation: cssAnimation,
    cssMatrix: cssMatrix
  };
})();