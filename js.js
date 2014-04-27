/**
 * JS Helpers (functions) v.1.0
 * Copyright (c) 2014 Ruslan Lobarev - ruslan@lobarev.com | http://lobarev.com
 */

var js = (function () {

	/**
	 * Get elements by Class, ID or Tag name
	 * @param  {string} selector 	.classname or #id_element or tag
	 * @return {object}
	 */
	function $(selector) {
		switch (selector.charAt(0)) {
			case '#':
				return document.getElementById(selector.substr(1, selector.length));
				break;
			case '.':
				var className = selector.substr(1, selector.length);
				return document.getElementsByClassName(className) || node.getElementsByClassName(className);
				break;
			default:
				return document.getElementsByTagName(selector);
		}
	}

	function $$(tag, selector) {
		var el = document.createElement(tag);

		if (selector) {
			switch (selector.charAt(0)) {
				case '#':
					el.id = selector.substr(1, selector.length);
					break;
				default:
					el.className = selector;
			}
		}
		return el;
	}

	function addEvent(elem, type, handler) {
		if (typeof window.addEventListener === 'function') {
			elem.addEventListener(type, handler, false);
		} else if (typeof document.attachEvent === 'function') {
			elem.attachEvent('on'+type, handler);
		} else {
			elem['on'+type] = handler;
		}
	}

	function on(elem, type, handler) {
		if (elem != null) {
			var l = elem.length;

			console.dir(typeof l);

			if (typeof l !== 'undefined') {
				for (var i=0; i<l; i++) {
					addEvent(elem[i], type, handler);
				}
			} else {
				addEvent(elem, type, handler);
			}
		}
	}
	

	function remove(elem) {
		return elem.parentNode ? elem.parentNode.removeChild(elem) : elem;
	}

	function ajax(url, o) {
		var o 			= o || {},
			type 		= o.type || 'GET',
			dataType 	= o.dataType || 'html',
			data 		= o.data || '',
			success 	= o.success || function () { return true; };

		var i, xhr, activeXids = [
			'MSXML2.XMLHTTP.3.0',
			'MSXML2.XMLHTTP',
			'Microsoft.XMLHTTP'];

		if (window.XMLHttpRequest) { // native XHR
			xhr =  new XMLHttpRequest();
		} else { // IE before 7
			for (i = 0; i < activeXids.length; i += 1) {
				try {
					xhr = new ActiveXObject(activeXids[i]);
					break;
				} catch (e) {}
			}
		}

		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) {
				return false;
			}
			if (xhr.status !== 200) {
				alert("Error, status code: " + xhr.status);
				return false;
			}

			if (dataType == 'html') {
				return success(xhr.responseText);
			}
		};

		xhr.open(type, url, true);
		if (type == 'POST') {
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}
		xhr.send(data);
	}

	function loadScript(url, callback) {
		var script = document.createElement('script');
		
		script.src = url;
		script.onreadystatechange = callback;
		script.onload = callback;
		document.getElementsByTagName('head')[0].appendChild(script);
	}

	return {
		$: $,
		$$: $$,
		on: on,
		remove: remove,
		ajax: ajax,
		loadScript: loadScript
	};
}());



var animate = function (elem, duration, opts) {
	var delay = opts.delay || 10,
		step = delay / duration,
		progress = 0,
		start = {
			x: +elem.style.left.replace('px', ''),
			y: +elem.style.top.replace('px', '')
		},
		len = {
			x: opts.x ? opts.x - start.x : 0,
			y: opts.y ? opts.y - start.y : 0
		};
	

	var timer = setInterval(function() {

		if (progress > 1) progress = 1;

		if (len.x != 0) {
			elem.style.left = start.x + len.x*progress + 'px';
		}
		if (len.y != 0) {
			elem.style.top = start.y + len.y*progress + 'px';
		}
		
		if (progress == 1) {
			clearInterval(timer);
		}

		progress = progress + step;
	}, delay);
};

/**
 * Working with Cookies
 * @return {object}
 */
var cookie = function() {
	var storage = {};
	// возвращает cookie с именем name
	function getCookie(name) {
		var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	function setCookie(name, value, options) {
		options = options || {};

		var expires = options.expires;

		if (typeof expires == "number" && expires) {
			var d = new Date();
			d.setTime(d.getTime() + expires*1000);
			expires = options.expires = d;
		}

		if (expires && expires.toUTCString) {
			options.expires = expires.toUTCString();
		}

		value = encodeURIComponent(value);

		var updatedCookie = name + "=" + value;

		for(var propName in options) {
			updatedCookie += "; " + propName;
			var propValue = options[propName];
			if (propValue !== true) {
				updatedCookie += "=" + propValue;
			}
		}
		document.cookie = updatedCookie;
	}

	function deleteCookie(name) {
		setCookie(name, "", { expires: -1 });
	}

	return {
		get: getCookie,
		set: setCookie,
		delete: deleteCookie
	};
};

/**
 * Popups
 * @return {}
 */
var popup = (function () {
	var popups = [];

	return {
		open: function (className, html, o) {
			var o = o || {},
				className = className || 'popup',
				$popup		= $$('div', className),
				$overlay 	= $('.overlay').length > 0 ? $('.overlay') : $$('div', 'overlay'),
				trans 		= o.trans || 1;
			
			$popup.innerHTML = html || '';
			$overlay.style.opacity = trans;

			document.body.appendChild($overlay);
			document.body.appendChild($popup);

			popups.push(className);
		},
		close: function (className) {
			var classes = [];
			
			classes = (typeof className == 'string') ? classes.push(className) : popups;

			if (typeof className == 'string') {
				remove($('.'+className)[0]);
				var _popups = [];
				popups.forEach(function (cl, i) {
					if (cl != className) _popups.push(cl);
				});
				popups = _popups;
			} else {
				popups.forEach(function (cl, i) {
					remove($('.'+cl)[0]);
				});
				remove($('.overlay')[0]);
				popups = [];
			}
		},
		get: function () {
			return popups;
		}
	};
}());