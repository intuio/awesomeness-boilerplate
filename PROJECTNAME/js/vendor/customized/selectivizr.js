/*
selectivizr v1.0.2 - (c) Keith Clark, freely distributable under the terms 
of the MIT license.

selectivizr.com
*/
/* 
  
Notes about this source
-----------------------

 * The #DEBUG_START and #DEBUG_END comments are used to mark blocks of code
   that will be removed prior to building a final release version (using a
   pre-compression script)
  
  
References:
-----------
 
 * CSS Syntax          : http://www.w3.org/TR/2003/WD-css3-syntax-20030813/#style
 * Selectors           : http://www.w3.org/TR/css3-selectors/#selectors
 * IE Compatability    : http://msdn.microsoft.com/en-us/library/cc351024(VS.85).aspx
 * W3C Selector Tests  : http://www.w3.org/Style/CSS/Test/CSS3/Selectors/current/html/tests/
 
*/


define(function(){

	var Selectivizr = function(){
		
		this.root = document.documentElement;
		this.xhr = this.getXHRObject();
		this.ieVersion = /MSIE (\d+)/.exec(navigator.userAgent)[1];
		
		// If were not in standards mode, IE is too old / new or we can't create
		// an XMLHttpRequest object then we should get out now.
		if (document.compatMode != 'CSS1Compat' || this.eVersion<6 || this.ieVersion>8 || !this.xhr) {
			return;
		}
		
		
		// ========================= Common Objects ============================

		// Compatiable selector engines in order of CSS3 support. Note: '*' is
		// a placholder for the object key name. (basically, crude compression)
		this.selectorEngines = {
			"NW"								: "*.Dom.select",
			"MooTools"							: "$$",
			"DOMAssistant"						: "*.$", 
			"Prototype"							: "$$",
			"YAHOO"								: "*.util.Selector.query",
			"Sizzle"							: "*", 
			"jQuery"							: "*",
			"dojo"								: "*.query"
		};


		this.enabledWatchers 					= [];     // array of :enabled/:disabled elements to poll
		this.ie6PatchID 							= 0;      // used to solve ie6's multiple class bug
		this.patchIE6MultipleClasses				= true;   // if true adds class bloat to ie6
		this.namespace 							= "slvzr";
		
		// Stylesheet parsing regexp's
		this.RE_COMMENT							= /(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)\s*/g;
		this.RE_IMPORT							= /@import\s*(?:(?:(?:url\(\s*(['"]?)(.*)\1)\s*\))|(?:(['"])(.*)\3))[^;]*;/g;
		this.RE_ASSET_URL 						= /\burl\(\s*(["']?)(?!data:)([^"')]+)\1\s*\)/g;
		this.RE_PSEUDO_STRUCTURAL				= /^:(empty|(first|last|only|nth(-last)?)-(child|of-type))$/;
		this.RE_PSEUDO_ELEMENTS					= /:(:first-(?:line|letter))/g;
		this.RE_SELECTOR_GROUP					= /(^|})\s*([^\{]*?[\[:][^{]+)/g;
		this.RE_SELECTOR_PARSE					= /([ +~>])|(:[a-z-]+(?:\(.*?\)+)?)|(\[.*?\])/g; 
		this.RE_LIBRARY_INCOMPATIBLE_PSEUDOS		= /(:not\()?:(hover|enabled|disabled|focus|checked|target|active|visited|first-line|first-letter)\)?/g;
		this.RE_PATCH_CLASS_NAME_REPLACE			= /[^\w-]/g;
		
		// HTML UI element regexp's
		this.RE_INPUT_ELEMENTS					= /^(INPUT|SELECT|TEXTAREA|BUTTON)$/;
		this.RE_INPUT_CHECKABLE_TYPES			= /^(checkbox|radio)$/;

		// Broken attribute selector implementations (IE7/8 native [^=""], [$=""] and [*=""])
		this.BROKEN_ATTR_IMPLEMENTATIONS			= this.ieVersion>6 ? /[\$\^*]=(['"])\1/ : null;

		// Whitespace normalization regexp's
		this.RE_TIDY_TRAILING_WHITESPACE			= /([(\[+~])\s+/g;
		this.RE_TIDY_LEADING_WHITESPACE			= /\s+([)\]+~])/g;
		this.RE_TIDY_CONSECUTIVE_WHITESPACE		= /\s+/g;
		this.RE_TIDY_TRIM_WHITESPACE				= /^\s*((?:[\S\s]*\S)?)\s*$/;
		
		// String constants
		this.EMPTY_STRING						= "";
		this.SPACE_STRING						= " ";
		this.PLACEHOLDER_STRING					= "$1";
	};

	Selectivizr.prototype = {

		startup: function(){
			for (var engine in this.selectorEngines) {
				var members, member, context = window;
				if (window[engine]) {
					members = this.selectorEngines[engine].replace("*", engine).split(".");
					while ((member = members.shift()) && (context = context[member])) {}
					if (typeof context == "function") {
						this.selectorMethod = context;
						this.init();
						return;
					}
				}
			}
		},

			// =========================== Patching ================================

		// --[ this.patchStyleSheet() ]----------------------------------------------
		// Scans the passed cssText for selectors that require emulation and
		// creates one or more patches for each matched selector.
		patchStyleSheet: function( cssText ) {

			var that = this;
			return cssText.replace(this.RE_PSEUDO_ELEMENTS, this.PLACEHOLDER_STRING).
				replace(this.RE_SELECTOR_GROUP, function(m, prefix, selectorText) {	
	    			var selectorGroups = selectorText.split(",");
	    			for (var c = 0, cs = selectorGroups.length; c < cs; c++) {
	    				var selector = that.normalizeSelectorWhitespace(selectorGroups[c]) + that.SPACE_STRING;
	    				var patches = [];
	    				selectorGroups[c] = selector.replace(that.RE_SELECTOR_PARSE, 
	    					function(match, combinator, pseudo, attribute, index) {
	    						if (combinator) {
	    							if (patches.length>0) {
	    								that.applyPatches( selector.substring(0, index), patches );
	    								patches = [];
	    							}
	    							return combinator;
	    						}		
	    						else {
	    							var patch = (pseudo) ? that.patchPseudoClass( pseudo ) : that.patchAttribute( attribute );
	    							if (patch) {
	    								patches.push(patch);
	    								return "." + patch.className;
	    							}
	    							return match;
	    						}
	    					}
	    				);
	    			}
	    			return prefix + selectorGroups.join(",");
	    		});
		},

		// --[ this.patchAttribute() ]-----------------------------------------------
		// returns a patch for an attribute selector.
		patchAttribute: function( attr ) {
			return (!this.BROKEN_ATTR_IMPLEMENTATIONS || this.BROKEN_ATTR_IMPLEMENTATIONS.test(attr)) ? 
				{ className: this.createClassName(attr), applyClass: true } : null;
		},

		// --[ this.patchPseudoClass() ]---------------------------------------------
		// returns a patch for a pseudo-class
		patchPseudoClass: function( pseudo ) {

			var applyClass = true;
			var className = this.createClassName(pseudo.slice(1));
			var isNegated = pseudo.substring(0, 5) == ":not(";
			var activateEventName;
			var deactivateEventName;
			var that = this;

			// if negated, remove :not() 
			if (isNegated) {
				pseudo = pseudo.slice(5, -1);
			}
			
			// bracket contents are irrelevant - remove them
			var bracketIndex = pseudo.indexOf("(")
			if (bracketIndex > -1) {
				pseudo = pseudo.substring(0, bracketIndex);
			}		
			
			// check we're still dealing with a pseudo-class
			if (pseudo.charAt(0) == ":") {
				switch (pseudo.slice(1)) {

					case "root":
						applyClass = function(e) {
							return isNegated ? e != this.root : e == this.root;
						}
						break;

					case "target":
						// :target is only supported in IE8
						if (this.ieVersion == 8) {
							applyClass = function(e) {
								var handler = function() { 
									var hash = location.hash;
									var hashID = hash.slice(1);
									return isNegated ? (hash == that.EMPTY_STRING || e.id != hashID) : (hash != that.EMPTY_STRING && e.id == hashID);
								};
								that.addEvent( window, "hashchange", function() {
									that.toggleElementClass.call(that, e, className, handler());
								})
								return handler();
							}
							break;
						}
						return false;
					
					case "checked":
						applyClass = function(e) { 
							if (this.RE_INPUT_CHECKABLE_TYPES.test(e.type)) {
								this.addEvent( e, "propertychange", function() {
									if (event.propertyName == "checked") {
										that.toggleElementClass.call(that, e, className, e.checked !== isNegated);
									} 							
								})
							}
							return e.checked !== isNegated;
						}
						break;
						
					case "disabled":
						isNegated = !isNegated;

					case "enabled":
						applyClass = function(e) { 
							if (this.RE_INPUT_ELEMENTS.test(e.tagName)) {
								this.addEvent( e, "propertychange", function() {
									if (event.propertyName == "$disabled") {
										that.toggleElementClass.call(that, e, className, e.$disabled === isNegated );
									} 
								});
								this.enabledWatchers.push(e);
								e.$disabled = e.disabled;
								return e.disabled === isNegated;
							}
							return pseudo == ":enabled" ? isNegated : !isNegated;
						}
						break;
						
					case "focus":
						activateEventName = "focus";
						deactivateEventName = "blur";
									
					case "hover":
						if (!activateEventName) {
							activateEventName = "mouseenter";
							deactivateEventName = "mouseleave";
						}
						applyClass = function(e) {
							that.addEvent( e, isNegated ? deactivateEventName : activateEventName, function() {
								that.toggleElementClass.call(that, e, className, true );
							})
							that.addEvent( e, isNegated ? activateEventName : deactivateEventName, function() {
								that.toggleElementClass.call(that, e, className, false );
							})
							return isNegated;
						}
						break;
						
					// everything else
					default:
						// If we don't support this pseudo-class don't create 
						// a patch for it
						if (!this.RE_PSEUDO_STRUCTURAL.test(pseudo)) {
							return false;
						}
						break;
				}
			}
			return { className: className, applyClass: applyClass };
		},

		// --[ this.applyPatches() ]-------------------------------------------------
		// uses the passed selector text to find DOM nodes and patch them	
		applyPatches: function(selectorText, patches) {
			var elms;
			
			// Although some selector libraries can find :checked :enabled etc. 
			// we need to find all elements that could have that state because 
			// it can be changed by the user.
			var domSelectorText = selectorText.replace(this.RE_LIBRARY_INCOMPATIBLE_PSEUDOS, this.EMPTY_STRING);
			
			// If the dom selector equates to an empty string or ends with 
			// whitespace then we need to append a universal selector (*) to it.
			if (domSelectorText == this.EMPTY_STRING || domSelectorText.charAt(domSelectorText.length - 1) == this.SPACE_STRING) {
				domSelectorText += "*";
			}
			
			// Ensure we catch errors from the selector library
			try {
				elms = this.selectorMethod( domSelectorText );
			} catch (ex) {
				// #DEBUG_START
				this.log( "Selector '" + selectorText + "' threw exception '" + ex + "'" );
				// #DEBUG_END
			}


			if (elms) {
				for (var d = 0, dl = elms.length; d < dl; d++) {	
					var elm = elms[d];
					var cssClasses = elm.className;
					for (var f = 0, fl = patches.length; f < fl; f++) {
						var patch = patches[f];
						
						if (!this.hasPatch(elm, patch)) {
							if (patch.applyClass && (patch.applyClass === true || patch.applyClass(elm) === true)) {
								cssClasses = this.toggleClass(cssClasses, patch.className, true );
							}
						}
					}
					elm.className = cssClasses;
				}
			}
		},

		// --[ this.hasPatch() ]-----------------------------------------------------
		// checks for the exsistence of a patch on an element
		hasPatch: function( elm, patch ) {
			return new RegExp("(^|\\s)" + patch.className + "(\\s|$)").test(elm.className);
		},
		
		
		// =========================== Utility =================================
		
		createClassName: function( className ) {
			return this.namespace + "-" + ((this.ieVersion == 6 && this.patchIE6MultipleClasses) ?
				this.ie6PatchID++
			:
				className.replace(this.RE_PATCH_CLASS_NAME_REPLACE, function(a) { return a.charCodeAt(0) }));
		},

		// --[ this.log() ]----------------------------------------------------------
		// #DEBUG_START
		log: function( message ) {
			if (window.console) {
				window.console.log(message);
			}
		},
		// #DEBUG_END

		// --[ this.trim() ]---------------------------------------------------------
		// removes leading, trailing whitespace from a string
		trim: function( text ) {
			return text.replace(this.RE_TIDY_TRIM_WHITESPACE, this.PLACEHOLDER_STRING);
		},

		// --[ this.normalizeWhitespace() ]------------------------------------------
		// removes leading, trailing and consecutive whitespace from a string
		normalizeWhitespace: function( text ) {
			return this.trim(text).replace(this.RE_TIDY_CONSECUTIVE_WHITESPACE, this.SPACE_STRING);
		},

		// --[ normalizeSelectorWhitespace() ]----------------------------------
		// tidies whitespace around selector brackets and combinators
		normalizeSelectorWhitespace: function( selectorText ) {
			return this.normalizeWhitespace(selectorText.
				replace(this.RE_TIDY_TRAILING_WHITESPACE, this.PLACEHOLDER_STRING).
				replace(this.RE_TIDY_LEADING_WHITESPACE, this.PLACEHOLDER_STRING)
			);
		},

		// --[ this.toggleElementClass() ]-------------------------------------------
		// toggles a single className on an element
		toggleElementClass: function ( elm, className, on ) {
			var oldClassName = elm.className;
			var newClassName = this.toggleClass(oldClassName, className, on);
			if (newClassName != oldClassName) {
				elm.className = newClassName;
				elm.parentNode.className += this.EMPTY_STRING;
			}
		},

		// --[ this.toggleClass() ]--------------------------------------------------
		// adds / removes a className from a string of classNames. Used to 
		// manage multiple class changes without forcing a DOM redraw
		toggleClass: function( classList, className, on ) {
			var re = RegExp("(^|\\s)" + className + "(\\s|$)");
			var classExists = re.test(classList);
			if (on) {
				return classExists ? classList : classList + this.SPACE_STRING + className;
			} else {
				return classExists ? this.trim(classList.replace(re, this.PLACEHOLDER_STRING)) : classList;
			}
		},
		
		// --[ this.addEvent() ]-----------------------------------------------------
		addEvent: function(elm, eventName, eventHandler) {
			elm.attachEvent("on" + eventName, eventHandler);
		},

		// --[ this.getXHRObject() ]-------------------------------------------------
		getXHRObject: function()
		{
			if (window.XMLHttpRequest) {
				return new XMLHttpRequest;
			}
			try	{ 
				return new ActiveXObject('Microsoft.XMLHTTP');
			} catch(e) { 
				return null;
			}
		},

		// --[ this.loadStyleSheet() ]-----------------------------------------------
		loadStyleSheet: function( url ) {
			this.xhr.open("GET", url, false);
			this.xhr.send();
			return (this.xhr.status==200) ? this.xhr.responseText : this.EMPTY_STRING;	
		},
		
		// --[ this.resolveUrl() ]---------------------------------------------------
		// Converts a URL fragment to a fully qualified URL using the specified
		// context URL. Returns null if same-origin policy is broken
		resolveUrl: function( url, contextUrl ) {
		
			function getProtocolAndHost( url ) {
				return url.substring(0, url.indexOf("/", 8));
			};
			
			// absolute path
			if (/^https?:\/\//i.test(url)) {
				return getProtocolAndHost(contextUrl) == getProtocolAndHost(url) ? url : null;
			}
			
			// root-relative path
			if (url.charAt(0)=="/")	{
				return getProtocolAndHost(contextUrl) + url;
			}

			// relative path
			var contextUrlPath = contextUrl.split(/[?#]/)[0]; // ignore query string in the contextUrl	
			if (url.charAt(0) != "?" && contextUrlPath.charAt(contextUrlPath.length - 1) != "/") {
				contextUrlPath = contextUrlPath.substring(0, contextUrlPath.lastIndexOf("/") + 1);
			}
			
			return contextUrlPath + url;
		},
		
		// --[ this.parseStyleSheet() ]----------------------------------------------
		// Downloads the stylesheet specified by the URL, removes it's comments
		// and recursivly replaces @import rules with their contents, ultimately
		// returning the full cssText.
		parseStyleSheet: function( url ) {
			var that = this;
			if (url) {
				return this.loadStyleSheet(url).replace(this.RE_COMMENT, this.EMPTY_STRING).
				replace(this.RE_IMPORT, function( match, quoteChar, importUrl, quoteChar2, importUrl2 ) { 
					return that.parseStyleSheet.call(that, that.resolveUrl(importUrl || importUrl2, url));
				}).
				replace(this.RE_ASSET_URL, function( match, quoteChar, assetUrl ) { 
					quoteChar = quoteChar || that.EMPTY_STRING;
					return " url(" + quoteChar + that.resolveUrl.call(that, assetUrl, url) + quoteChar + ") "; 
				});
			}
			return this.EMPTY_STRING;
		},
		
		// --[ this.init() ]---------------------------------------------------------
		init: function() {
			// honour the <base> tag
			var that = this;
			var url, stylesheet;
			var baseTags = document.getElementsByTagName("BASE");
			var baseUrl = (baseTags.length > 0) ? baseTags[0].href : document.location.href;
			
			/* Note: This code prevents IE from freezing / crashing when using 
			@font-face .eot files but it modifies the <head> tag and could
			trigger the IE stylesheet limit. It will also cause FOUC issues.
			If you choose to use it, make sure you comment out the for loop 
			directly below this comment.

			var head = doc.getElementsByTagName("head")[0];
			for (var c=doc.styleSheets.length-1; c>=0; c--) {
				stylesheet = doc.styleSheets[c]
				head.appendChild(doc.createElement("style"))
				var patchedStylesheet = doc.styleSheets[doc.styleSheets.length-1];
				
				if (stylesheet.href != this.EMPTY_STRING) {
					url = this.resolveUrl(stylesheet.href, baseUrl)
					if (url) {
						patchedStylesheet.cssText = this.patchStyleSheet( this.parseStyleSheet( url ) )
						stylesheet.disabled = true
						setTimeout( function () {
							stylesheet.owningElement.parentNode.removeChild(stylesheet.owningElement)
						})
					}
				}
			}
			*/
			for (var c = 0; c < document.styleSheets.length; c++) {
				
				stylesheet = document.styleSheets[c]
				if (stylesheet.href != this.EMPTY_STRING) {
					
					url = this.resolveUrl(stylesheet.href, baseUrl);
					if (url) {
						var patchedText = this.patchStyleSheet( this.parseStyleSheet( url ) );
						stylesheet.cssText = patchedText;
					}
				}
			}
			
			// :enabled & :disabled polling script (since we can't hook 
			// onpropertychange event when an element is disabled) 
			if (this.enabledWatchers.length > 0) {
				setInterval( function() {
					for (var c = 0, cl = that.enabledWatchers.length; c < cl; c++) {
						var e = that.enabledWatchers[c];
						if (e.disabled !== e.$disabled) {
							if (e.disabled) {
								e.disabled = false;
								e.$disabled = true;
								e.disabled = true;
							}
							else {
								e.$disabled = e.disabled;
							}
						}
					}
				},250)
			}
		}



	};

	return Selectivizr;

});
