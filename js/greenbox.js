
//
//	Makes an item linkable with the value of the attribute
//
//	<div data-es-link="link-to-a-webpage"></div>
//
//	$("[data-es-link]").esLink({preventdefault:true})
//


(function ( $ ) {

	$.fn.esLink = function ( options ) {

		var o = $.extend({}, $.fn.esLink.defaultOptions, options),
			wrap = this[0] ? $(this) : $(o.selector),
			linkSelector = this.selector;

		return wrap.each(function(){

			var linkedItem = $(this).css(o.css);
			linkHref = linkedItem.attr(linkSelector.replace("[", "").replace("]", ""));

			linkedItem.on("click", function(e) {
				if (o.preventDefault) {e.preventDefault();}
				if (linkHref !== "" && linkHref !== undefined) {
					document.location.href = linkHref;
				}
			});
		});
	};

	$.fn.esLink.defaultOptions = {
		selector: "[data-es-link]",		//	default selector
		preventDefault: false,
		css: {
			"cursor": "pointer"
		}
	};

} (jQuery));;/*
	@desc		Ajax source loader
	@tested

	todo		több elemmel is kipróbálni
	todo		megoldani rekurzív függvényhívás problémáját
	todo		onloadra event triggert csinálni
	todo		kipróbálni, hogy mi van ha ajahívós diven belül alapból is ajaxhívós div van
*/

/*
	Research	http://stackoverflow.com/questions/16542595/jquery-plugin-to-apply-also-on-dynamically-created-elements
				http://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
				https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver?redirectlocale=en-US&redirectslug=DOM/MutationObserver
				http://jsfiddle.net/7cqXC/9/

	Custom event
				http://www.sitepoint.com/jquery-custom-events/
*/


/*
	Adott html elembe tölti a data-ajax-source-ban megadott url-t

	Example
	<div data-ajax-source="http://source-of-the-content"></div>
*/

(function(){

	$.fn.esAjaxSource = function( options ) {

		var defaults = {
			dom_wrap: "[data-ajax-source]"
		};

		var o = $.fn.extend(true, defaults, options);

		var wrap = this;
		if (this.length === 0) { wrap = $(o.dom_wrap); }

		//	remove attribute square brackets
		function ra( selector ) {
			var replaced = selector.replace(/\[/g, "").replace(/\]/, "");
			return replaced;
		}

		//	load ajax source
		return wrap.each(function() {

			var container = $(this);

			if (container.attr(ra(o.dom_wrap)) !== "") {
				container.load(container.attr(ra(o.dom_wrap)), function(response, status, xhr) {
					$(this).find(o.dom_wrap).esAjaxSource();
					container.removeAttr(ra(o.dom_wrap));
				});
			}
		});
	};

	//	to apply on ajax loaded content
//	$(document).on("ready.esolr.ajaxsource ajaxComplete.esolr.ajaxsource", function(){
	$(document).on("ready.esolr.ajaxsource", function(){
		$.fn.esAjaxSource();
	});

	/*$(document).on("ajaxComplete.esolr.ajaxsource", function(){
		$.fn.esAjaxSource();
	});*/

	/*$(document).on("ooo", "[data-ajax-source]", function(e){
		console.log("Betöltve");
	});*/
})(jQuery);


$("button").on("click", function(e){
	e.preventDefault
	$(this).after( $("<div></div>").attr("data-ajax-source", "esolr.responsiveimg.ajax.html").esAjaxSource());
});;/*
	@desc		Ajax source loader
	@tested

	todo		több elemmel is kipróbálni
	todo		megoldani rekurzív függvényhívás problémáját
	todo		onloadra event triggert csinálni
	todo		kipróbálni, hogy mi van ha ajahívós diven belül alapból is ajaxhívós div van
*//*
	Research	http://stackoverflow.com/questions/16542595/jquery-plugin-to-apply-also-on-dynamically-created-elements
				http://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
				https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver?redirectlocale=en-US&redirectslug=DOM/MutationObserver
				http://jsfiddle.net/7cqXC/9/

	Custom event
				http://www.sitepoint.com/jquery-custom-events/
*//*
	Adott html elembe tölti a data-ajax-source-ban megadott url-t

	Example
	<div data-ajax-source="http://source-of-the-content"></div>
*/(function(){$.fn.esAjaxSource=function(e){function i(e){var t=e.replace(/\[/g,"").replace(/\]/,"");return t}var t={dom_wrap:"[data-ajax-source]"},n=$.fn.extend(!0,t,e),r=this;this.length===0&&(r=$(n.dom_wrap));return r.each(function(){var e=$(this);e.attr(i(n.dom_wrap))!==""&&e.load(e.attr(i(n.dom_wrap)),function(t,r,s){$(this).find(n.dom_wrap).esAjaxSource();e.removeAttr(i(n.dom_wrap))})})};$(document).on("ready.esolr.ajaxsource",function(){$.fn.esAjaxSource()})})(jQuery);$("button").on("click",function(e){e.preventDefault;$(this).after($("<div></div>").attr("data-ajax-source","esolr.responsiveimg.ajax.html").esAjaxSource())});;/*
	@desc		Ajax source loader
	@tested

	todo		megoldani rekurzív függvényhívás problémáját
	todo		onloadra event triggert csinálni
	todo		kipróbálni, hogy mi van ha ajahívós diven belül alapból is ajaxhívós div van
*/

/*
	Research	http://stackoverflow.com/questions/16542595/jquery-plugin-to-apply-also-on-dynamically-created-elements
				http://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
				https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver?redirectlocale=en-US&redirectslug=DOM/MutationObserver
				http://jsfiddle.net/7cqXC/9/
*/


/*
	Adott html elembe tölti a data-ajax-source-ban megadott url-t

	Example
	<div data-ajax-source="http://source-of-the-content"></div>
*/

(function(){

	$.fn.esAjaxSource = function( options ) {

		var defaults = {
			dom_wrap: "[data-ajax-source]"
		};

		var o = $.fn.extend(true, defaults, options);
		var wrap = this;

		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		//	remove attribute square brackets
		function ra( selector ) {
			var replaced = selector.replace(/\[/g, "").replace(/\]/, "");
			return replaced;
		}

//		$(wrap).load($(wrap).attr(ra(o.dom_wrap)), function(response, status, xhr) {
//			console.log("ó", $(this).find(o.dom_wrap));
//			$(this).find(o.dom_wrap).esAjaxSource();
//		});

		return wrap.each(function() {

			var container = $(this);

			if (container.attr(ra(o.dom_wrap)) !== "") {
				container.load(container.attr(ra(o.dom_wrap)), function(response, status, xhr) {
//					console.log(container.find(o.dom_wrap));
//					console.log($(this).find(o.dom_wrap));
//					container.find(o.dom_wrap).esAjaxSource()
				});
			}


//			$(this).trigger("esolr.ajaxsource.ready", this);
		});
//		}, $(o.dom_wrap));
	};

//	ajaxComplete.esolr.ajaxsource

	//	to apply on ajax loaded content
//	$(document).on("ready.esolr.ajaxsource ajaxComplete.esolr.ajaxsource", function(){
	$(document).on("ready.esolr.ajaxsource", function(){
		$.fn.esAjaxSource();
	});

})(jQuery);

;/*
	@desc		Ajax linking into html selector
	@tested
*/

/*
	Research
*/


/*
	A data-ajax-target-ben megadott wrapperbe tölti a href hivatkozását

	Example
	<a href="http://target-link" data-ajax-target=".any-selector">Load content with ajax</a>
*/

(function(){

	$.fn.esAjaxTarget = function( options ) {

		var defaults = {
			dom_wrap: "[data-ajax-target]"
		};

		var o = $.fn.extend(true, defaults, options);
		var wrap = this;

		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		//	remove attribute square brackets
		function ra( selector ) {
			var replaced = selector.replace(/\[/g, "").replace(/\]/, "");
			return replaced;
		}

		$("body").on("click.esolr.ajaxtarget", o.dom_wrap, function(e){
			e.preventDefault();
			var link = $(this);

			if (link.attr(ra(o.dom_wrap)) !== "") {
				$(link.attr(ra(o.dom_wrap))).load(link.attr("href"), function() {});
			}
		});

		return wrap;
	};

	//	to apply on ajax loaded content
	$(document).on("ready.esolr.ajaxtarget ajaxComplete.esolr.ajaxtarget", function(){
		$.fn.esAjaxTarget();
	});

})(jQuery);;/*
	Character counter

	A source —input or textarea— and a target where the value appears needs to be added,
	otherwise it puts into a tag option.

	todo	lekódolni
*/



(function ( $ ) {

	$.fn.esCharCounter = function( options ) {

		var defaults = {
			dom_wrap:	""
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		return wrap.each( function () {


		});
	};

	//	to apply on ajax loaded content
//	$(document).on("ready.esolr.tab ajaxComplete.esolr.tab", function(){
//		$.fn.esCharCounter();
//	});

} (jQuery));;/*
	todo lekezelni a szökőéveket
	todo lekezelni a böngésző alapnyelvét és ahhoz igazítani
*/


//	aktuális dátum kiírása
var esDate = {

	dateFormat:	"hu",

	getDate: function() {

		var month_hu = new Array(
			["január", "jan"],
			["február", "feb"],
			["március", "már"],
			["április", "ápr"],
			["május", "máj"],
			["június", "jún"],
			["július", "júl"],
			["augusztus", "aug"],
			["szeptember", "szep"],
			["október", "okt"],
			["november", "nov"],
			["december", "dec"]
		);

		var year = new Date().getFullYear();
		var month = new Date().getMonth();
		var day = new Date().getDate();

		return year + ". " + month_hu[month][0] + " " + day + ".";
	}
};;/*	Example
*/

//	todo lekezelni, ha túlfutottunk a dátumon: 0-t írni
//	todo lekezelni, hogy magyar dátumformátumot egyen meg éééé/hh/nn alakban
//	todo általánosra megcsinálni, hogy órát, percet és másodpercet is mutasson


(function ( $ ) {

	$.fn.esBackCounter = function (y, m, d) {

		return this.each( function ( ) {

			var elem = $(this);
			var result;

			if ( elem.attr("data-backcounter-until") !== undefined ) {
				result = Math.round((new Date( elem.attr("data-backcounter-until") ) - new Date() ) / 1000 / 60 / 60 / 24);
			} else {
				result = Math.round((new Date( m + "/" + d + "/" + y ) - new Date() ) / 1000 / 60 / 60 / 24);
			}

			elem.text( result );
		});
	};

} (jQuery));;//
//	esolr designer mód bekapcsolása: body.data-design-mode="true"
//	megjeleníti a grid-eket és kezeli a baseline shift-et
//	attributes:	data-baseline-shift
//


(function(){

	$.fn.esDesignMode = function( options ) {

		var defaults = {
			dom_wrap: "[data-design-mode]",
			baseline_shift: "0",
			grid: {
				columns: "12"
			}
		};

		var o = $.fn.extend(true, defaults, options);
		var wrap = this;

		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		//	remove attribute square brackets
		function ra( selector ) {
			var replaced = selector.replace(/\[/g, "").replace(/\]/, "");
			return replaced;
		}

		return wrap.each(function() {

			//	if design mode is turned on
			if ($(this).attr(ra(o.dom_wrap)) === "true" || $(this).attr(ra(o.dom_wrap)) === "True" || $(this).attr(ra(o.dom_wrap)) === "1") {

				if ($(this).attr("data-baseline-shift") !== undefined) {
					o.baseline_shift = $(this).attr("data-baseline-shift");

					$("body").css({
						"background-position": "100% " + o.baseline_shift + ", 100% " + o.baseline_shift
					});
				}

				$("body").prepend(
					$("<div>").addClass("esolr-grid-system")
						.prepend( $("<div>").addClass("row").prepend( function(){
							var columns = [];
							for (var i = 0; i < o.grid.columns; i++) {
								columns.push( $("<div>").addClass("column small-1").prepend( $("<div>").addClass("grid") ));
							}
							return columns;
						} ) )
				);
			}
		});
	};
})(jQuery);;//@version:		2.0
//@release notes:
//				• javítva a json export bug, ami nem exportálta ki az area vagy fn tartalmát ha egy data-es-portlet elemük volt
//				• json exporternél megadható nem exportálandó attribútom (pl.: style)
//@requirements:
//
// Az alábbi elemekből áll:
//
//		[data-es-portlet-area]
//			Ezekbe lehet elhelyezni a [data-es-portlet] portleteket
//
//		[data-es-portlet-area][data-es-portlet-area-unused]0
//			vagy
//		[data-es-portlet-area="unused"] (esetleg = false, 0)
//			A nem törölhető portletek forráskonténere, illetve ide kerülnek vissza ha „törlődnek” valamilyen eseménynél fogva.
//
//		[data-es-fn]
//			Klónozható forrás funkció csoport. Alapesetben több portletet is tartalmazhat. Ha olyan effektet
//			szeretnénk készíteni, amelyik csak egy portletet fogad, a portletek számát adjuk meg paraméterként.
//			Paraméter megadása nélkül korlátlan számú elemet fogad.
//			pl.:	[data-es-fn="1"] egy portletet fogadó fn esetén
//					[data-es-fn] korlátlan portletet fogadó fn esetén
//					[data-es-fn="5"] maximum öt elemet fogadó portlet esetén
//
//			[data-es-fn="slider"]		slider funkció
//			[data-es-fn="portlettab"]	portlet tab funkció
//			[data-es-param]  paraméterek > [data-es-fn-param]?
//
//		[data-es-portlet], [data-es-portlet="portlet_type"]
//			A portletkezelő csak egy típust mozgat: [data-es-portlet]
//			Ebben a propertyben tároljuk el a portlet típusát
//
// Az alábbi tulajdonságok állíthatók be, illetve léteznek:
//
//		[data-es-readonly]	A portlet-area-t csak olvashatóvá teszi, nem lehet bele elemeket húzni.
//		[data-es-unremovable]	A portleteket törölhetetlenné teszi, csak mozgathatók. A töröltek egy spec "unused" areába kerülnek.
//		[data-es-cloneable]	Klónozható portlet, róla vele megegyező tulajdonságú példányokat húzhatunk le.
//		[data-es-hidden]		Nem biztos, hogy kell, de esetleg beteszem

//	remove
//		1. sima törlés
//		2. átmozgatás a nem használtak közé
//		3. ungroup
//
//	target
//		sima area
//		forrás area (törölteket fogad)
//
//	draggable
//		sima
//		klónozható
//
//	fn-portlet
//		sima, mint egy mezei portlet
//		keretező

//	Research
//	https://developer.mozilla.org/en-US/docs/DragDrop/Recommended_Drag_Types
//	http://stackoverflow.com/questions/15772249/jquery-pass-element-to-datatransfer-property
//	http://api.jquery.com/on/
//	http://stackoverflow.com/questions/9566322/bind-native-html5-dragstart-event-handler-and-access-datatransfer-using-jquery
//	http://stackoverflow.com/questions/9566322/bind-native-html5-dragstart-event-handler-and-access-datatransfer-using-jquery
//	http://www.html5rocks.com/en/tutorials/dnd/basics/
//	http://www.whatwg.org/specs/web-apps/current-work/multipage/dnd.html#dnd
//	http://stackoverflow.com/questions/3977596/how-to-make-divs-in-html5-draggable-for-firefox
//
//	For scrolling:
//	https://developer.mozilla.org/en-US/docs/Web/API/document.elementFromPoint
//	https://www.planbox.com/blog/news/updates/html5-drag-and-drop-scrolling-the-page.html
//	https://github.com/martindrapeau/jQueryDndPageScroll/blob/master/jquery.dnd_page_scroll.js

//	A draggeléssel elveszik a cloneable és a readonly állapot is ha együtt lett megadva

//	hold	rekurzív visszatörlés, míg ki nem tisztulnak a portletek ha egy olyan sorozatos egymásbaágyazás van, aminek a végén csak egy gyermekelem van.
//	hold	megoldani, hogy csak egy vagy több elemet tartalmazhasson
//	done	fn törlésekor a tartalmát is törölni, de ha unused, akkor nem
//	done	portlet törléskor levizsgálni, hogy a szülő fn e és ha igen, üres-e, mert akkor törlés
//	done	a readonly-ból is lehessen törölni, de unuse-olni és unwrap-elni ne
//	todo	lehetőség beállítani, hogy mely fn portlet milyen egyéb portletet fogadhat
//	todo	a row-column szerű működés nem jó
//	todo	már lehúzott fn-portlet IS tud wrappelni, pedig nagyon nem kellene neki

(function ( $ ) {

	$.fn.esDnDPortlet = function ( options ) {

		var o = $.extend({}, $.fn.esDnDPortlet.defaultOptions, options),
			portlet,								// normal portlet
			fn,										// fn portlet
			area,									// normal area
			selectedPortlet,
			targetPortlet,
			targetArea,
			removeBtn = $(o.f.remove.selector),		// remove button
			unuseBtn = $(o.f.unuse.selector),		// unuse button
			unwrapBtn = $(o.f.unwrap.selector);		// unwrap button


		function init() {
			portlet = $(o.portlet.selector);
			fn = $(o.fn.selector);
			area = $(o.area.selector);

			//	Makes draggable items compatible with HTML5 DnD API by adding draggable="true" property
			portlet.each(function(){
				$(this).attr("draggable", "true");
			});
		}

		//	Removes selector prefix (., #, []) if exists. Accept multiple selectors.
		function r( selector ) {
			return selector.replace(/\./g, "").replace(/\#/, "").replace(/\[/, "").replace(/\]/, "");
		}

		//	Returns the clean selector if it is #id, else "<empyt string>"
		function ifClass(selector) {
			if (selector[0] == ".") {
				return selector.replace(/\./g, "");
			} else {
				return "";
			}
		}

		//	Returns the clean selector if it is .class, else "<empyt string>"
		function ifID(selector) {
			if (selector[0] == "#") {
				return selector.replace(/\#/, "");
			} else {
				return "";
			}
		}

		//	Returns the clean selector if it is [attribute], else "<empyt string>"
		function ifAttr(selector) {
			if (selector[0] == "[" && selector[selector.length - 1] == "]") {
				return selector.replace(/\[/, "").replace(/\]/, "");
			} else {
				return "";
			}
		}

		//	Initialize scrolling helpers for DnD scrolling – turns on top and bottom sensitive areas durring scroll event
		function initHelpers() {

			$(o.helper.scroll.top.html, {
				id: ifID(o.helper.scroll.top.selector),
				class: ifClass(o.helper.scroll.top.selector)
			})
				.css(o.helper.scroll.top.css)
				.on({
					dragover: function(e){
						var scrollContainer = $(document, "html, body");
						var scrollTo = scrollContainer.scrollTop() + o.helper.scroll.speed * -1;
						scrollContainer.scrollTop(scrollTo);
					}
				})
				.appendTo(o.helper.scroll.top.to);

			$(o.helper.scroll.bottom.html, {
				id: ifID(o.helper.scroll.bottom.selector),
				class: ifClass(o.helper.scroll.bottom.selector)
			})
				.css(o.helper.scroll.bottom.css)
				.on({
					dragover: function(e){
						var scrollContainer = $(document, "html, body");
						var scrollTo = scrollContainer.scrollTop() + o.helper.scroll.speed;
						scrollContainer.scrollTop(scrollTo);
					}
				})
				.appendTo(o.helper.scroll.bottom.to);
		}

		//	Ha törlünk egy elemet és az db-ből generált, akkor annak az ID-jét a fizikai törlés előtt eltárolja
		function idToTrash (item) {
			if (item.attr("id") !== o.newID && item.attr("id") !== undefined) {
				if ($.inArray(item.attr("id"), o.portletHandlerTrash) < 0) {
					o.portletHandlerTrash.push(item.attr("id"));
				}
			}
		}

		//	Replace two portlets
		//	todo Ezt az ADD-hoz hasonlóan fel kell tápolni
		function dndReplace(source, target) {
//			target.replaceWith(source);
//			dndInsert(dndClone(source), target);
//			dndAdd(target, source);
//			source.remove();
//			return true;
		}

		//	Remove normal portlet and moves uremovables to unused area
		function dndRemove(source) {

			var source = source.closest(o.portlet.selector);

			if (source.is(o.fn.selector)) {
				dndEmpty(source);
				return true;
			}

			idToTrash(source);
			source.remove();

			return source;
		}

		//	Empty (group) portlet
		//	Normal portlets will be removed, unremovables move to area.unused
		function dndEmpty(source) {

			var children = source.children(o.portlet.selector);

			if (children.length > 0) {

				children.each(function(){

					var child = $(this);

					if (child.is(o.unremovable.selector)) {
						dndUnuse(child)
					} else {
						dndRemove(child);
					}
				});
			}

			source.remove();
			return true;
		}


		//	Moves uremovables to unused area
		function dndUnuse(source) {

			var source = source.closest(o.portlet.selector);

			//	if this is an unremovable or identified portlet
			if (source.is(o.unremovable.selector)) {
				dndAppend(source, area.filter(o.area.unused.selector));
			}

			return source;
		}

		//	returns the number of children or false if empty
		function isEmpty(source) {
			var childrenCounter = source.children(o.portlet.selector).length;
			return childrenCounter > 0 ? false : true;
		}

		//	Return with cloned source
		function dndClone(source) {

			//	If source is NOT exists
			if (!source) { return false;}

			var clone = source.clone(true);
			clone.removeSelector(o.cloneable.selector).removeSelector(o.readonly.selector).attr("id", o.newID);			//	eSolr specific
			return clone;
		}

		//	Append source at the end of the target
		function dndAppend(source, target) {
			source.appendTo(target);
			return source;
		}

		//	Insert source before the target
		function dndInsert(source, target) {
			source.insertBefore(target);
			return source;
		}

		// Primary ADD function
		// This function is called at all drop events and
		// it contains the logic 								todo	kiszervezni egy tömbbe, hogy paraméterezhető maradjon
		function dndAdd(source, target) {

			//	If source or target NOT exists > stop
			if (!source || !target ) { return false; }

			//	If source is the same as the target
			if (source.is(target)) { return false; }

			//	If target is readonly > stop
			if (target.is(o.readonly.selector)) { return false; }

			//	If source is NOT unremovable but the target is area.unused > stop
			if (!source.is(o.unremovable.selector) && targetArea.is(o.area.unused.selector)) { return false; }

			//	If source is cloneable, fn but NOT fn-display and target is portlet
			if (source.is(o.cloneable.selector)
				&& source.is(o.fn.selector)
				&& !source.is(o.fn.display.selector)
				&& target.is(o.portlet.selector)) {

				dndWrap(dndClone(source), target);
				init();
				return source;
			}

			//	if source is cloneable
			if (source.is(o.cloneable.selector)) {
				dndAdd(dndClone(source), target);
				init();
				return source;
			}

			//
			/*if (source.is(o.fn.selector)
				&& !source.is(o.fn.display.selector)
				&& isEmpty(source)
				&& target.is(o.portlet.selector)) {
				dndInsert(source, target);
				dndAppend(target, source);
				return source;
			}*/

			//	If target is area
			if (target.is(o.area.selector)) {
				dndAppend(source, target);
				return source;
			}

			//	If target is a simple portlet
			dndInsert(source, target);
			return source;
		}

		//	Source wraps the target around
		function dndWrap(source, target) {
			dndAdd(source, target);
			dndAppend(target, source);
			return source;
		}

		//	Unwrap (ungroup) fn potlets which contans other portlets
		function dndUnwrap(source) {
			var wrapper = source.closest(o.fn.selector),
				wrappedItems = wrapper.children(o.portlet.selector);
			dndInsert(wrappedItems, wrapper);
			dndRemove(wrapper);
			return wrappedItems;
		}

		//	function to manipulate DnD behavior – TEMPORARY UNAVAILABLE
		function dndSetReadonly() {}
		function dndSetRW() {}
		function dndSetCloneable() {}


		//	add hover effect to portlet and area
		function addHover(item) {
			area.removeClass(ifClass(o.hover.selector));	// force remove hover state from areas
			if (!selectedPortlet.is(targetPortlet) && (selectedPortlet && targetPortlet || item && item.is(o.area.selector))) {
				item.addClass(ifClass(o.hover.selector));
			}
		}


		//	remove hover effect from portlet and area
		function removeHover(item) {
			if (selectedPortlet && targetPortlet || item && item.is(o.area.selector)) {
				item.siblings().andSelf().removeClass(ifClass(o.hover.selector));
			}
		}

		//	set the mouse pointer
		function setDragType(source) {
			if ((source.is(o.fn.selector) && !source.is(o.fn.display.selector) && source.is(o.cloneable.selector) && targetPortlet)
				|| (source.is(o.fn.selector) && !source.is(o.fn.display.selector) && !source.is(o.cloneable.selector) && targetPortlet && isEmpty(source))) {
				return "link"
			}
			return "copy";
		}


		//	handling DnD effect
		//	this is the complex logic which item goes where to
		function dragend() {
			dndAdd(selectedPortlet, targetArea && targetPortlet ? targetPortlet : targetArea);
			init();
			return true;
		}


		//	initialize portlets, areas and more
		//	set the helpers for scrolling during drag event
		init();
		initHelpers();


		//	Event handlers
		//	portlets, areas and buttons

		//	this is required for native HTML5 DnD because it is not supported by jQuery by default
		jQuery.event.props.push('dataTransfer');

		portlet
			.on({
				dragstart: function(e){

					e.stopPropagation();
					e.dataTransfer.effectAllowed = "move";
					e.dataTransfer.setData("none", undefined);			// setting data is required to fire firefox's drag'n'drop events

					selectedPortlet = $(this);

					targetArea = selectedPortlet.closest(o.area.selector);
					addHover(targetArea);

					//	show drog helper
					$(o.helper.scroll.top.selector + ", " + o.helper.scroll.bottom.selector).show();
				},
				dragenter: function(e){},
				dragover: function(e){

					e.preventDefault();	// necessary to catch drop event
					e.stopPropagation();
					e.dataTransfer.dropEffect = setDragType(selectedPortlet);

//					targetPortlet = $(this).is(selectedPortlet) ? undefined : $(this);
					targetPortlet = $(this);

					if (targetPortlet) {
						targetArea = targetPortlet.closest(o.area.selector);
					} else {
						targetArea = selectedPortlet.closest(o.area.selector);
					}

					addHover(targetPortlet);
					addHover(targetArea);

					return false;
				},
				dragleave: function(e){
					removeHover(targetPortlet);
				},
				drop: function(e){
					e.stopPropagation();
//					e.dataTransfer.dropEffect = "copy";

					dragend();
					removeHover(targetPortlet);
					removeHover(targetArea);

					return false;
				},
				dragend: function(e){
					e.stopPropagation();
//					e.dataTransfer.dropEffect = "copy";

					selectedPortlet = undefined;

					//	hide scroll helper
					$(o.helper.scroll.top.selector + ", " + o.helper.scroll.bottom.selector).hide();
				}
			}).end()
			.filter(fn)
			.on("dragover", function(e){
			});

		area
			.on({
				dragstart: function(e){},
				dragover: function(e){

					e.preventDefault();
					e.dataTransfer.dropEffect = setDragType(selectedPortlet);

					removeHover(targetArea);
					targetArea = $(this);
					targetPortlet = undefined;
					addHover(targetArea);
				},
				dragleave: function(e){
					removeHover(targetArea);
				},
				drop: function(e){
					dragend();
					removeHover(targetArea);
				}
			});


		removeBtn.each(function(){

			$(this).on("click", function(e){
				e.preventDefault();
				dndRemove($(this));
			});
		});

		unuseBtn.each(function(){

			$(this).on("click", function(e){
				e.preventDefault();
				dndUnuse($(this));
			});
		});

		unwrapBtn.each(function(){

			$(this).on("click", function(e){
				e.preventDefault();
				dndUnwrap($(this))
			});
		});
	};

	$.fn.esDnDPortlet.defaultOptions = {
		portletHandlerTrash: [],			// nem newID-val rendelkező, azaz már eltárolt, de törölt elemek azonosítója
		newID:				"0",			// default value of newly created items
		area: {
			proto:			"portlet-area",
			selector:		"[data-es-portlet-area]",
			unused: {
				selector:	"[data-es-portlet-area-unused]"
			}
		},
		portlet: {
			proto:			"portlet",
			selector:		"[data-es-portlet]"
		},
		fn: {
			proto:			"portlet-fn",
			selector:		"[data-es-fn]",
			display: {
				selector:	"[data-es-fn='display']"
			}
		},
		unremovable: {
			selector:		"[data-es-unremovable]"
		},
		readonly: {
			selector:		"[data-es-readonly]"
		},
		cloneable: {
			selector:		"[data-es-cloneable]"
		},
		hover: {
			selector:		".es-item-hover"
		},
		f: {
			remove: {
				selector:	"[data-es-portlet-remove]"
			},
			unuse: {
				selector:	"[data-es-portlet-unuse]"
			},
			unwrap: {
				selector:	"[date-es-fn-ungroup]"
			}
		},
		helper: {
			scroll: {
				speed:		30,
				top: {
					html:		"<div />",
					selector:	"#dnd-scroll-helper-top",
					css:		{
						position: "fixed",
						left: 0, right: 0, top: 0,
						width: "100%", height: "20px",
						display: "none",
						opacity: ".85",
						"z-index": 99999
					},
					to: "body"
				},
				bottom: {
					html:		"<div />",
					selector:	"#dnd-scroll-helper-bottom",
					css:		{
						position: "fixed",
						left: 0, right: 0, bottom: 0,
						width: "100%", height: "20px",
						display: "none",
						opacity: ".85",
						"z-index": 99999
					},
					to: "body"
				}
			}
		}
	};


	//	eltávolítja az adott selectort az attribútumok közül
	$.fn.removeSelector = function ( selector ) {

		return $(this).each(function(){

			var item = $(this),
				removableAttr;

			if (selector) {

				if (selector[0] == "#" && selector.substr(1) == item.attr("id")) {
					removableAttr = "id";

				} else if (selector[0] == "." && selector.substr(1) == item.attr("class")) {
					removableAttr = "class"

				} else if (selector[0] == "[" && selector[selector.length-1] == "]" && item.filter(selector).length > 0) {
					removableAttr = selector.substr(1, selector.length-2);
				}

				item.removeAttr(removableAttr);
			}
		});
	};


	$.fn.toObject = function (item) {

		/*
		 Ez a függvény a megadott jquery wrapper alapján generál egy objektumot,
		 mely követi a html struktúrát és objektum propertiként eltárolja azok attribútumait.
		 A generálásnál csak a portletek szempontjából nevezetes elemeket veszi figyelembe:
		 • portlet-area
		 • portlet-group
		 • portlet

		 pl.: $.fn.portletHandler.toObject("[data-es-portlet-area]:not([data-es-portlet-area-unused])");

		 http://stackoverflow.com/questions/1181575/javascript-determine-whether-an-array-contains-a-value
		 */

		var denied_attributes = {
			style: "false"
		};

		var arr = new Array();

		$(item).each(function(){

			var obj = {};

			//  bepakolja egy objektumba az elem attribútuait
			for (var k in this.attributes) {

				if (this.attributes.hasOwnProperty(k) && this.attributes[k].name !== undefined && !(this.attributes[k].name in denied_attributes)) {
					obj[this.attributes[k].name] = this.attributes[k].value;
				}
			}

			//  és ha vannak benne további elemek, berámolja egy objektumba
			if ($(this).children().length > 0) {
				obj.content = $.fn.toObject($(this).children());
			}

			//  portlet típusjelzés beküldése
			if ($(this).attr("data-es-portlet-area") !== undefined) {													// ha portlet-area
				obj.proto = "portlet-area";																				// ellátja típusjelzéssel
				arr.push(obj);																							// és a fentieket kiegészítve bepusholja

			} else if ($(this).attr("data-es-fn") !== undefined) {
				obj.proto = "portlet-fn";
				arr.push(obj);

			} else if ($(this).attr("data-es-portlet") !== undefined && $(this).attr("data-es-fn") == undefined && $(this).attr("data-es-fn-begin") == undefined) {
				obj.proto  = "portlet";
				arr.push(obj);
			}
		});

		return arr;
	};


	$.fn.toJSONString = function (item) {

		/*
		 A függvény alapműködése nem plugin specifikus, azaz bármilyen objektumból, tömbből és további típusból álló
		 objektumot elfogad bemenetként. A portlekezelő speciális működése miatt az elején eltárolja a sablon nevét
		 (remplate_name), a sablont szerkesztő felhasználó azonosítóját (user_id) és a nyelvet (lan).
		 */

		var js = "{" +
			"\"template_name\":\"" + template_name + "\"," +
			"\"user_id\":\"" + user_id + "\"," +
			"\"lan\":\"" + lan + "\"," +
			"\"trash\":" + ($.fn.esDnDPortlet.defaultOptions.portletHandlerTrash.length > 0 ? "[\"" + $.fn.esDnDPortlet.defaultOptions.portletHandlerTrash.join("\",\"") + "\"]": "[]") + "," +
			"\"areas\":[" + generateJSON(item) + "]}";

		function generateJSON (item) {

			var js = "";

			for (var key in item) {
				if (item.hasOwnProperty(key)) {
					if ( $.type(item[key]) === "object" ) {
						js += "{";
						if (sizeOf(item[key]) > 0) {
							js += generateJSON(item[key]);
						}
						js += "},";
					} else if ( $.type(item[key]) === "array" ) {
						js += "\"" + key + "\"" + ":[";
						if (sizeOf(item[key]) > 0) {
							js += generateJSON(item[key]);
						}
						js += "],";
					} else {
						js += "\"" + key + "\"" + ":" + "\"" + item[key] + "\",";
					}
				}
			}
			return js.replace(/\,\]/g, "]").replace(/\,\}/g, "}").substr(0, js.length - 1);								// kiszedi a kósza vesszőket a folyószövegből és a végéről is
		}

		function sizeOf(obj) {
			var counter = 0;
			for (var k in obj) { if (obj.hasOwnProperty(k)) { counter++; } }
			return counter;
		}

		return js;
	};

} (jQuery));;//
//	Set a "manual" resizeend event which is triggered after window resize event ends with 250ms default delay.
//	As a parameter the delay value can me modified.
//
//	$.fn.esEventResizeend(); or
//

(function( $ ){

	$.fn.esEventResizeend = function(delay) {

		var	timer = window.setTimeout(function(){}, 0),
			defaultEventName = "resizeend",
			defaultDelay = 250;

		$(window).on('resize', function() {
			window.clearTimeout(timer);
			timer = window.setTimeout(function() {
				$(window).trigger(defaultEventName);
			}, delay || defaultDelay);
		});
	}
}(jQuery));;
//
//
//


(function ( $ ) {

	$.fn.esFluidHeight = function ( options ) {

		var o = $.extend(true, $.fn.esFluidHeight.defaultOptions, options),
			wrap = this[0] ? $(this) : $(o.dom.selector);

		wrap.each(function () {

			var item = $(this),
				itemParent = item.parent();

			function setHeight() {

				//	calculating heights doing care of margins
				var itemMargin = Number(item.css("margin-top").replace("px","")) + Number(item.css("margin-bottom").replace("px","")),
//					itemPadding = Number(item.css("padding-top").replace("px","")) + Number(item.css("padding-bottom").replace("px","")),
					parentHeight = itemParent.innerHeight();

				//	if parent is higher then current item
//				if (item.outerHeight() < parentHeight - itemMargin) {
//					item.outerHeight(parentHeight - itemMargin);
//					return true;
//				}

				item.outerHeight(parentHeight - itemMargin);

				return false;
			}

			setHeight();

			$(window).on("resize.esolr.fluidheight", function () {
				setHeight();
			});
		});
	};


//	--------------------------------------------------------------------------------------------------------------------
//	Default values

	$.fn.esFluidHeight.defaultOptions = {
		dom: {
			selector:		".js-fluid-height"
		}
	};
} (jQuery));;/*
	@desc		Reset input field on parameter event (default is blure)
	@version	1.0
*/


(function( $ ) {

	$.fn.esInputReset = function ( options ) {

		var defaults = {
			triggerEvent: "blur"
		};

		var o = $.extend(true, defaults, options);

		return this.each(function() {

			$(this).on(o.triggerEvent + ".esolr.input.reset", function() {
				$(this).val("");
			});
		});
	};
}) (jQuery);;/*	Example

 */

(function ( $ ) {

	$.fn.esInputChar = function ( options ) {

		var defaults = {
			max: undefined
		};

		var o = $.extend(true, defaults, options);

		return $(this).each( function () {

			var formItem = $(this);

			formItem.on("focus.esInputChar", function(){
				formItem.on("keyup.esInputChar", function(){
					if (formItem.val().length > o.max) {
						formItem.val(formItem.val().substr(0, o.max))
					}
				});
			});
		});
	};

} (jQuery));;/*
	@desc		Select to button group convert
	@tested		Safari, Chrome, Fireforx, Opera, IE

	todo		lekezelni ha menet közben hízik a select
	todo		kezelni: <option disabled>
	todo		kezelni: <optgroup>, <optgroup disabled>
	todo		a reset az alapállapotot állítsa vissza, ne pedig töröljön mindent
	todo		megoldani, hogy a class-nál megadott formázásokat vegye át a generált, vagy egy data-class… be lehessen betenni a classokat
*/

/*
	Research	https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress
*/


/*
	Ez a függvény a normál selectből horizotális kapcsolószerű gombsort csinál.
	Kezeli a multiselect select-eket és ha kell azok mellé utolsó gombként egy reset-et is elhelyez
	ha a select rendelkezik data-multiple-reset kapcsolóval <select multiple data-multiple-reset>...

	Example

*/

(function ( $ ) {

	$.fn.esSelectBtn = function ( options ) {

		var defaults = {
			dom_wrap:		".select-btn",
			groupClass:		"select-btn-group",
			groupHTML:		"<div></div>",
			buttonClass:	"btn btn-select",
			buttonHTML:		"<a href='#'></a>",
			resetHTML:		"✕",
			resetClass:		"reset",
			selectedClass:	"selected",
			reset:			undefined
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		return wrap.each( function () {

			var select = $(this);
			o.reset = select.is("[data-multiple-reset]");

			select.hide().after(o.groupHTML).next().addClass(o.groupClass).end().children().each(function() {

				var optionIdx = $(this).index();

				select.next()
					.append(o.buttonHTML).children().eq(optionIdx).text(this.text)
					.addClass(function(){
						if (select.children().eq(optionIdx).attr("selected")) {
							return o.buttonClass + " " + o.selectedClass;
						} else {
							return o.buttonClass;
						}
					})
					.on("click.esolr.selectbtn", function(e){
						e.preventDefault();
						if (select.prop("multiple")) {
							$(this).toggleClass(o.selectedClass);
							if ($(this).parent().prev().children().eq($(this).index()).attr("selected")) {
								$(this).parent().prev().children().eq($(this).index()).removeAttr("selected");
							} else {
								$(this).parent().prev().children().eq($(this).index()).attr("selected","");
							}
						} else {
							$(this).siblings().removeClass(o.selectedClass).end().addClass(o.selectedClass)
								.parent().prev().children().removeAttr("selected").eq($(this).index()).prop("selected", true);
						}
					});
			});

			if (select.prop("multiple") && o.reset) {
				select.next().append(o.buttonHTML).children().last().text(o.resetHTML).addClass(o.buttonClass).addClass(o.resetClass)
					.on("click.esolr.selectbtn", function(e){
						e.preventDefault();
						$(this).siblings().removeClass(o.selectedClass).parent().prev().children().removeAttr("selected");
					});
			}
		});
	};

	$.fn.esSelectBtn();

}) (jQuery);;/*
	desc		Select Direction
	ajax
	tested

	todo		Multiselecttel is megcsinálni
	todo		a selectnek oda-vissza működnie kellene
*/


/*
	Selectből irányválasztó gombcsoportot csinál
*/


(function ( $ ) {

	$.fn.esSelectDir = function ( options ) {

		var defaults = {
			dom_wrap:			".select-dir",
			groupClass:			"select-dir-group",
			groupHTML:			"<div></div>",
			buttonClass:		"btn btn-dir",
			buttonHTML:			"<a href='#'></a>",
			selectedClass:		"selected",
			disabledClass:		"disabled",
			unusedClass:		"unused",
			dirClassPrefix:		"btn-dir-",
			directionValues: {
				auto:			"smart",
				center:			"center",
				top:			"top",
				topright:		"topright",
				right:			"right",
				bottomright:	"bottomright",
				bottom:			"bottom",
				bottomleft:		"bottomleft",
				left:			"left",
				topleft:		"topleft"
			},
			buttonOrder: [
				"topleft",		"top",		"topright",
				"left",			"center",	"right",
				"bottomleft",	"bottom",	"bottomright"
			]
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		return wrap.each( function () {

			var select = $(this);

			//	létrehozza a csoportkonténert
			select.hide().after( $(o.groupHTML).addClass(o.groupClass) );

			//	a sorrendnek megfelelően létrehozza az iránygombokat a megfelelő classokkal
			for (var i = 0; i < o.buttonOrder.length; i++) {

				//	létrehoz egy iránygombot és a selectnek megfelelően felparaméterezi
				select.next().append( $(o.buttonHTML).addClass(o.buttonClass).addClass(function(){

					var classes = "";

					//	hozzáadja az iránynak megfelelő class-t prefix-szel
					classes += " " + o.dirClassPrefix + o.directionValues[o.buttonOrder[i]];

					select.children().each(function(){

						var option = $(this);
						var value = option.val();

						if (value ==  o.directionValues[o.buttonOrder[i]]) {
							if (option.attr("selected")) {
								classes += " " + o.selectedClass;
							}
							if (option.attr("disabled")) {
								classes += " " + o.disabledClass;
							}
						}
					});

					return classes;

				}).on("click.esolr.selectdir", function(e){
						e.preventDefault();
						var btn = $(this);

						//	ha selectedre kattintok, akkor visszaáll alapállapotba
						if (btn.hasClass(o.selectedClass)) {
							btn.siblings().addBack().removeClass(o.selectedClass);
							select.children().eq(0).prop("selected", true)

						//	ha új irányt választok, akkor azt kijelöli
						} else {
							btn.siblings().removeClass(o.selectedClass).end().addClass(o.selectedClass);

							//	kiválasztja a gombnak megfelelő selectet
							select.children().each(function(){
								var option = $(this);
								if (option.val() == o.directionValues[o.buttonOrder[btn.index()]]) {
									option.prop("selected", true);
								}
							});
						}

					}) );
			}
		});
	};

	//	to apply on ajax loaded content
	$(document).on("ready.esolr.selectdir ajaxComplete.esolr.selectdir", function(){
		$.fn.esSelectDir();
	});

}) (jQuery);;
//
//	Research
//	http://www.w3schools.com/tags/ref_urlencode.asp
//	http://www.w3schools.com/jsref/jsref_encodeuricomponent.asp

var es = {

	function: {

		encodeURL: function(url) {

			return true;
		}
	}
};;/*
	desc		Image crop
	ajaxload	tested
	autoload	yes
*/


/*
	A plugin csak img tageken fut végig, azokon is csak a dom_wrap-ben szereplő attribútumúakon.

	Example


*/


(function ( $ ) {

	$.fn.esImgCrop = function ( options ) {

		var defaults = {
			dom_wrap:		"[data-es-crop]",
			classPrefix:	"bg-align-",
			alignClass:		"bg-align"
		};

		var o = $.extend(true, defaults, options);
		var wrap = $(o.dom_wrap);

		//	remove attribute square brackets
		function ra( selector ) {
			var replaced = selector.replace(/\[/g, "").replace(/\]/, "");
			return replaced;
		}

		//	minden img tagről (és csak arról!) leszedi a data-es-crop attribútumot ás áthelyezi a szülőre
		return wrap.each( function () {

			var _img = $(this);
			var isImg = _img.is("img");
			var positionClass = o.alignClass + " " + o.classPrefix + _img.attr(ra(o.dom_wrap));

			//	ha kép, akkor a szülőjéhez rendeli a croppolási classokat, mert a responsive image már átrámolta
			//	a saját src-jét a szülő bg-jébe
			if (isImg) {
				_img.parent().addClass(positionClass);

			//	ellenkező esetben a tag kapja meg a croppolásra vonatkozó classokat
			} else {
				_img.addClass(positionClass);
			}
		});
	};

	//	to apply on ajax loaded content
	$(document).on("ready.esolr.imgcrop ajaxComplete.esolr.imgcrop", function(){
		$.fn.esImgCrop();
	});

} (jQuery));;/*	Example
 */

//	todo lekezelni a szökőéveket
//	todo URL-t konfigolhatóvá tenni


var esNameday = {

	url:	"../js/js-data/esolr.nameday.hu.min.json",

	getName: function(url) {

		esNameday.url = typeof urlClass === "undefined" ? esNameday.url : url;

		var firstDay = "01/01/" + new Date().getFullYear();
		var json = null;
		var diff = parseInt( ( new Date() - new Date( firstDay ) ) / 1000 / 60 / 60 / 24 );

		$.ajax({
			'async': false,
			'global': false,
			'url': esNameday.url,
			'dataType': "json",
			'success': function(data) {
				json = data;
			}
		});

		return json.namedays[ diff ][ 2 ];
	}
};;/*
	todo	a paraméterezés nem működik… ellenőrizni, miért
*/

/*
	Example

	<div class="paginate-wrap">
		<div>…</div>
		<div>…</div>
		…
	</div>


*/

/*
	Research	http://stackoverflow.com/questions/8073673/how-can-i-add-new-array-elements-at-the-top-of-an-array-in-javascript
*/

(function ( $ ) {

	$.fn.esPaginate = function ( options ) {

		var defaults = {
			dom_wrap:		".paginate-wrap",

			set: {
				itemNumber:		5,						// hány elemenként lapozzon
				maxPageNumber:	5,						// hány lapozószám jelenjen meg – lehet nulla is
				currentPage:	1,						// melyik lapra ugorjon alapesetben (számozás itt 1-től kezdődik, nem 0-tól)
				firstLast:		true,					// első és utolsó gomb megjelenjen-e
				prevNext:		true,					// előző és következő gomb megjelenjen-e
				position:		"after"					// before|after (inside|outside?)

			},

			p: {
				container: {
					html:	"<div></div>",
					class:	"pagination"
				},
				wrap: {
					html:	"<ul></ul>",
					class:	""
				},
				first: {
					html:	"<li><a href='#'>first</a></li>",
					class:	"first"
				},
				last: {
					html:	"<li><a href='#'>last</a></li>",
					class:	"last"
				},
				prev: {
					html:	"<li><a href='#'>previous</a></li>",
					class:	"prev"
				},
				next: {
					html:	"<li><a href='#'>next</a></li>",
					class:	"next"
				},
				page: {
					html:	"<li><a href='#'></a></li>",
					class:	"page"
				},
				currentClass:	"current",
				disabledClass:	"disabled"
			}
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

//		console.log(o.p.first.html)
//		console.log(o.p.container.html)

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		return wrap.each( function () {

			var wrapper = $(this);
			var items = $(this).children();
			var pages = Math.ceil(items.length / o.set.itemNumber);		// number of pages based on item / page
			var pagination;
			var current = o.set.currentPage - 1;						// -1 because this numbering begins with 1 instead of 0

			//	a paramétereknek megfelelően legenerálja az oldalszámokat és elrejti az összes elemet
			function init() {

				items.hide();

				pagination = $(o.p.container.html).addClass(o.p.container.class).append(
					$(o.p.wrap.html).addClass(o.p.wrap.class).append(function(){
						var pager = [];

						//	add a .page item for every itemNumber amount item
						for (var i = 0; i < pages; i++) {
							pager.push(
								$(o.p.page.html).addClass(o.p.page.class).text(i + 1).on("click.esolr.paginate", function(e){
									e.preventDefault();
									var currenPage = pagination.find("." + o.p.page.class).index($(this));
									setPage(currenPage);
								})
							);
						}

						//	add previous/next if enabled
						if (o.set.prevNext) {
							pager.unshift(
								$(o.p.prev.html).addClass(o.p.prev.class).on("click.esolr.paginate", function(e){
									e.preventDefault();
									setPage(current - 1);
								})
							);
							pager.push(
								$(o.p.next.html).addClass(o.p.next.class).on("click.esolr.paginate", function(e){
									e.preventDefault();
									setPage(current + 1);
								})
							);
						}

						//	add first/last if enabled
						if (o.set.firstLast) {
							pager.unshift(
								$(o.p.first.html).addClass(o.p.first.class).on("click.esolr.paginate", function(e){
									e.preventDefault();
									setPage(0);
								})
							);
							pager.push(
								$(o.p.last.html).addClass(o.p.last.class).on("click.esolr.paginate", function(e){
									e.preventDefault();
									setPage(items.length - 1);
								})
							);
						}

						return pager;
					})
				);

				//	embed pagination according to position setting (before|after)
				if (o.set.position == "before") {
//					wrapper.prepend(pagination);
					wrapper.before(pagination);
				} else {
//					wrapper.append(pagination);
					wrapper.after(pagination);
				}

				//	set default settins (pagination and items also)
				setPage(current);
			}

			//	beállítja az adott oldalszámot
			function setPage(pageNum) {

				//	checking pageNum parameter and correct if it is too small or large
				if (pageNum < 0) {
					current = 0;
				} else if (pageNum >= pages) {
					current = pages - 1;
				} else {
					current = pageNum;
				}

				//	sets the correct page number in pagination
				pagination.find("." + o.p.page.class).removeClass(o.p.currentClass).eq(current).addClass(o.p.currentClass);

				//	removes disabled class before sets the final one
				pagination.find("." + o.p.page.class).siblings().removeClass(o.p.disabledClass);

				//	sets disabled status if required
				if (current == 0) {
					pagination.find("." + o.p.first.class + ", ." + o.p.prev.class).addClass(o.p.disabledClass);
				} else if (current == pages - 1) {
					pagination.find("." + o.p.last.class + ", ." + o.p.next.class).addClass(o.p.disabledClass);
				}

				showItems(current);
			}

			//	megjeleníti az adott oldalszámnak megfelelő elemeket
			function showItems(pageNum) {

				items.hide();

				//	sets
				for (var i = pageNum * o.set.itemNumber; i < (pageNum + 1) * o.set.itemNumber; i++) {
					items.eq(i).show();
				}
			}

			//	ha több elem van, mint a lapozáshoz szükségs minimális érték végrehajtja a lapozó funkciót
			if (items.length > o.set.itemNumber) {
				init();
			}
		});
	};

} (jQuery));;//@version:		2.0
//@release notes:
//				• javítva a json export bug, ami nem exportálta ki az area vagy fn tartalmát ha egy data-es-portlet elemük volt
//				• json exporternél megadható nem exportálandó attribútom (pl.: style)
//@requirements:
//
// Az alábbi elemekből áll:
//
//		[data-es-portlet-area]
//			Ezekbe lehet elhelyezni a [data-es-portlet] portleteket
//
//		[data-es-portlet-area][data-es-portlet-area-unused]0
//			vagy
//		[data-es-portlet-area="unused"] (esetleg = false, 0)
//			A nem törölhető portletek forráskonténere, illetve ide kerülnek vissza ha „törlődnek” valamilyen eseménynél fogva.
//
//		[data-es-fn]
//			Klónozható forrás funkció csoport. Alapesetben több portletet is tartalmazhat. Ha olyan effektet
//			szeretnénk készíteni, amelyik csak egy portletet fogad, a portletek számát adjuk meg paraméterként.
//			Paraméter megadása nélkül korlátlan számú elemet fogad.
//			pl.:	[data-es-fn="1"] egy portletet fogadó fn esetén
//					[data-es-fn] korlátlan portletet fogadó fn esetén
//					[data-es-fn="5"] maximum öt elemet fogadó portlet esetén
//
//			[data-es-fn="slider"]		slider funkció
//			[data-es-fn="portlettab"]	portlet tab funkció
//			[data-es-param]  paraméterek > [data-es-fn-param]?
//
//		[data-es-portlet], [data-es-portlet="portlet_type"]
//			A portletkezelő csak egy típust mozgat: [data-es-portlet]
//			Ebben a propertyben tároljuk el a portlet típusát
//
// Az alábbi tulajdonságok állíthatók be, illetve léteznek:
//
//		[data-es-readonly]	A portlet-area-t csak olvashatóvá teszi, nem lehet bele elemeket húzni.
//		[data-es-unremovable]	A portleteket törölhetetlenné teszi, csak mozgathatók. A töröltek egy spec "unused" areába kerülnek.
//		[data-es-cloneable]	Klónozható portlet, róla vele megegyező tulajdonságú példányokat húzhatunk le.
//		[data-es-hidden]		Nem biztos, hogy kell, de esetleg beteszem

/*
	remove
		1. sima törlés
		2. átmozgatás a nem használtak közé
		3. ungroup

	target
		sima area
		forrás area (törölteket fogad)

	draggable
		sima
		klónozható

	fn-portlet
		sima, mint egy mezei portlet
		keretező
*/

/*
	Research
	https://developer.mozilla.org/en-US/docs/DragDrop/Recommended_Drag_Types
	http://stackoverflow.com/questions/15772249/jquery-pass-element-to-datatransfer-property
	http://api.jquery.com/on/
	http://stackoverflow.com/questions/9566322/bind-native-html5-dragstart-event-handler-and-access-datatransfer-using-jquery
	http://stackoverflow.com/questions/9566322/bind-native-html5-dragstart-event-handler-and-access-datatransfer-using-jquery
	http://www.html5rocks.com/en/tutorials/dnd/basics/
	http://www.whatwg.org/specs/web-apps/current-work/multipage/dnd.html#dnd
	http://stackoverflow.com/questions/3977596/how-to-make-divs-in-html5-draggable-for-firefox

	For scrolling:
	https://developer.mozilla.org/en-US/docs/Web/API/document.elementFromPoint
	https://www.planbox.com/blog/news/updates/html5-drag-and-drop-scrolling-the-page.html
	https://github.com/martindrapeau/jQueryDndPageScroll/blob/master/jquery.dnd_page_scroll.js
*/


(function ( $ ) {

	$.fn.esDnDPortlet = function ( options ) {

		var o = $.extend({}, $.fn.esDnDPortlet.defaultOptions, options),
			portlet,			// normal portlet
			fn,					// fn portlet
			area,				// normal area
			selectedPortlet,
			targetPortlet,
			targetArea,
			removeBtn = $(o.f.remove.selector),		// remove button
			unuseBtn = $(o.f.unuse.selector),		// unuse button
			unwrapBtn = $(o.f.unwrap.selector);		// unwrap button

		function init() {
			portlet = $(o.portlet.selector);		// normal portlet
			fn = $(o.fn.selector);					// fn portlet
			area = $(o.area.selector);				// normal area

			//	makes draggable items compatible with HTML5 DnD API
			portlet.each(function(){
				$(this).attr("draggable", "true");
			});
		}

		//	removes selector prefix (., #, []) if exists. Accept multiple selectors.
		function r( selector ) {
			return selector.replace(/\./g, "").replace(/\#/, "").replace(/\[/, "").replace(/\]/, "");
		}

		//	returns the clean selector if it is #id, else "<empyt string>"
		function ifClass(selector) {
			if (selector[0] == ".") {
				return selector.replace(/\./g, "");
			} else {
				return "";
			}
		}

		//	returns the clean selector if it is .class, else "<empyt string>"
		function ifID(selector) {
			if (selector[0] == "#") {
				return selector.replace(/\#/, "");
			} else {
				return "";
			}
		}

		//	returns the clean selector if it is [attribute], else "<empyt string>"
		function ifAttr(selector) {
			if (selector[0] == "[" && selector[selector.length - 1] == "]") {
				return selector.replace(/\[/, "").replace(/\]/, "");
			} else {
				return "";
			}
		}

		//	initialize scrolling helpers for DnD scrolling
		function initHelpers() {

			$(o.helper.scroll.top.html, {
				id: ifID(o.helper.scroll.top.selector),
				class: ifClass(o.helper.scroll.top.selector)
			})
				.css(o.helper.scroll.top.css)
				.on({
					dragover: function(e){
						var scrollContainer = $(document, "html, body");
						var scrollTo = scrollContainer.scrollTop() + o.helper.scroll.speed * -1;
						scrollContainer.scrollTop(scrollTo);
					}
				})
				.appendTo(o.helper.scroll.top.to);

			$(o.helper.scroll.bottom.html, {
				id: ifID(o.helper.scroll.bottom.selector),
				class: ifClass(o.helper.scroll.bottom.selector)
			})
				.css(o.helper.scroll.bottom.css)
				.on({
					dragover: function(e){
						var scrollContainer = $(document, "html, body");
						var scrollTo = scrollContainer.scrollTop() + o.helper.scroll.speed;
						scrollContainer.scrollTop(scrollTo);
					}
				})
				.appendTo(o.helper.scroll.bottom.to);
		}

		//	Ha törlünk egy elemet és az db-ből generált, akkor annak az ID-jét a fizikai törlés előtt eltárolja
		function idToTrash (item) {
			if (item.attr("id") !== o.newID && item.attr("id") !== undefined) {
				if ($.inArray(item.attr("id"), o.portletHandlerTrash) < 0) {
					o.portletHandlerTrash.push(item.attr("id"));
				}
			}
		}

		function dndReplace(source, target) {
			target.replaceWith(source);
		}

		function dndRemove(source) {

			var source = source.closest(o.portlet.selector);

			idToTrash(source);
			source.remove();
		}

		function dndUnuse(source) {

			var source = source.closest(o.portlet.selector);

			//	if this is an unremovable or identified portlet
			if (source.is(o.unremovable.selector)) {
				dndAppend(source, area.filter(o.area.unused.selector));
			}
		}

		function dndClone(source, target) {

			var clone = source.clone(true);
			clone.removeSelector(o.cloneable.selector).attr("id", o.newID);

			dndInsert(clone, target);
			init();
		}

		function dndCloneAndWrap(source, target) {

			var clone = source.clone(true);
			clone.removeSelector(o.cloneable.selector).attr("id", o.newID);

			dndWrap(clone, target);
			init();
		}

		function dndAppend(source, target) {
			source.appendTo(target);
		}

		function dndInsert(source, target) {
			source.insertBefore(target);
		}

		function dndWrap(source, target) {
			dndInsert(source, target);
			dndAppend(target, source);
		}


		//	unwrap (ungroup) fn potlets which contans other portlets
		function dndUnwrap(source) {

			var wrapper = source.closest(o.fn.selector),
				wrappedItems = wrapper.children(o.portlet.selector);

			wrapper.after(wrappedItems).remove();
		}


		//	looking for empty fn portlets and removes them
		function cleanUp() {

		}


		//	function to manipulate DnD behavior
		function dndSetReadonly() {}
		function dndSetRW() {}
		function dndSetCloneable() {}


		//	add hover effect to portlet and area
		function addHover(item) {

			area.removeClass(ifClass(o.hover.selector));	// force remove hover state from areas

			if (selectedPortlet && targetPortlet || item && item.is(o.area.selector)) {
				item.addClass(ifClass(o.hover.selector));
			}
		}


		//	remove hover effect from portlet and area
		function removeHover(item) {

			if (selectedPortlet && targetPortlet || item && item.is(o.area.selector)) {
				item.siblings().andSelf().removeClass(ifClass(o.hover.selector));
			}
		}

		//	set the mouse pointer
		function setDragType(source) {

			if (source.is(o.fn.selector) && !source.is(o.fn.display.selector) && source.is(o.cloneable.selector) && targetPortlet) {
				return "link"
			}

			return "copy";
		}


		//	handling DnD effect
		//	this is the complex logic which item goes where to
		function dragend() {

			//	todo	szétbontani target area|portlet mentén, majd selected portlet|fn|fn-display mentén

			//	if selected portlet exists and area is not read only and not area-unused
			if (selectedPortlet && !targetArea.is(o.readonly.selector) && !targetArea.is(o.area.unused.selector)) {

				//	drop over a portlet
				if (targetArea && targetPortlet) {

					//	source is fn, cloneable but not fn display
					if (selectedPortlet.is(o.cloneable.selector) && selectedPortlet.is(o.fn.selector) && !selectedPortlet.is(o.fn.display.selector)) {
						dndCloneAndWrap(selectedPortlet, targetPortlet);

					//	selected is cloneable
					} else if (selectedPortlet.is(o.cloneable.selector)) {
						dndClone(selectedPortlet, targetPortlet);

					} else {
						dndInsert(selectedPortlet, targetPortlet);
					}

				//	drop over an area
				} else if (targetArea && !selectedPortlet.is(o.cloneable.selector)) {
					dndAppend(selectedPortlet, targetArea);

				} else if (targetArea && selectedPortlet.is(o.cloneable.selector) && selectedPortlet.is(o.fn.display.selector)) {
					dndAppend(selectedPortlet, targetArea);
				}
			}
			//	if selected portlet is unremovable and area is unused and area is not read only
			else if (selectedPortlet.is(o.unremovable.selector) && targetArea.is(o.area.unused.selector) && !targetArea.is(o.readonly.selector) ) {

				if (targetPortlet) {
					dndInsert(selectedPortlet, targetPortlet);
				} else {
					dndAppend(selectedPortlet, targetArea);
				}
			}

			return false;
		}


		//	initialize portlets, areas and more
		//	set the helpers for scrolling during drag event
		init();
		initHelpers();


		//	event handlers
		//	portlets, areas and buttons

		//	this is required for native HTML5 DnD because it is not supported by jQuery by default
		jQuery.event.props.push('dataTransfer');

		portlet
			.on({
				dragstart: function(e){

					e.stopPropagation();
					e.dataTransfer.effectAllowed = "move";
					e.dataTransfer.setData("none", undefined);			// setting data is required to fire firefox's drag'n'drop events

					selectedPortlet = $(this);

					targetArea = selectedPortlet.closest(o.area.selector);
					addHover(targetArea);

					//	show drog helper
					$(o.helper.scroll.top.selector + ", " + o.helper.scroll.bottom.selector).show();
				},
				dragenter: function(e){},
				dragover: function(e){

					e.preventDefault();	// necessary to catch drop event
					e.stopPropagation();
					e.dataTransfer.dropEffect = setDragType(selectedPortlet);

					targetPortlet = $(this).is(selectedPortlet) ? undefined : $(this);
					if (targetPortlet) {
						targetArea = targetPortlet.closest(o.area.selector);
					} else {
						targetArea = selectedPortlet.closest(o.area.selector);
					}

					addHover(targetPortlet);
					addHover(targetArea);

					return false;
				},
				dragleave: function(e){
					removeHover(targetPortlet);
				},
				drop: function(e){
					e.stopPropagation();
//					e.dataTransfer.dropEffect = "copy";

					dragend();
					removeHover(targetPortlet);
					removeHover(targetArea);

					return false;
				},
				dragend: function(e){
					e.stopPropagation();
//					e.dataTransfer.dropEffect = "copy";

					selectedPortlet = undefined;

					//	hide scroll helper
					$(o.helper.scroll.top.selector + ", " + o.helper.scroll.bottom.selector).hide();

					cleanUp();
				}
			}).end()
			.filter(fn)
			.on("dragover", function(e){
			});

		area
			.on({
				dragstart: function(e){},
				dragover: function(e){

					e.preventDefault();
					e.dataTransfer.dropEffect = setDragType(selectedPortlet);

					removeHover(targetArea);
					targetArea = $(this);
					targetPortlet = undefined;
					addHover(targetArea);
				},
				dragleave: function(e){
					removeHover(targetArea);
				},
				drop: function(e){
					dragend();
					removeHover(targetArea);
				}
			});


		removeBtn.each(function(){

			$(this).on("click", function(e){
				e.preventDefault();
				dndRemove($(this));
			});
		});

		unuseBtn.each(function(){

			$(this).on("click", function(e){
				e.preventDefault();
				dndUnuse($(this));
			});
		});

		unwrapBtn.each(function(){

			$(this).on("click", function(e){
				e.preventDefault();
				dndUnwrap($(this))
			});
		});
	};

	$.fn.esDnDPortlet.defaultOptions = {
		portletHandlerTrash: [],			// nem newID-val rendelkező, azaz már eltárolt, de törölt elemek azonosítója
		newID:				"0",			// default value of newly created items
		area: {
			proto:			"portlet-area",
			selector:		"[data-es-portlet-area]",
			unused: {
				selector:	"[data-es-portlet-area-unused]"
			}
		},
		portlet: {
			proto:			"portlet",
			selector:		"[data-es-portlet]"
		},
		fn: {
			proto:			"portlet-fn",
			selector:		"[data-es-fn]",
			display: {
				selector:	"[data-es-fn='display']"
			}
		},
		unremovable: {
			selector:		"[data-es-unremovable]"
		},
		readonly: {
			selector:		"[data-es-readonly]"
		},
		cloneable: {
			selector:		"[data-es-cloneable]"
		},
		hover: {
			selector:		".es-item-hover"
		},
		f: {
			remove: {
				selector:	"[data-es-portlet-remove]"
			},
			unuse: {
				selector:	"[data-es-portlet-unuse]"
			},
			unwrap: {
				selector:	"[date-es-fn-ungroup]"
			}
		},
		helper: {
			scroll: {
				speed:		30,
				top: {
					html:		"<div />",
					selector:	"#dnd-scroll-helper-top",
					css:		{
						position: "fixed",
						left: 0, right: 0, top: 0,
						width: "100%", height: "20px",
						display: "none",
						opacity: ".85"
					},
					to: "body"
				},
				bottom: {
					html:		"<div />",
					selector:	"#dnd-scroll-helper-bottom",
					css:		{
						position: "fixed",
						left: 0, right: 0, bottom: 0,
						width: "100%", height: "20px",
						display: "none",
						opacity: ".85"
					},
					to: "body"
				}
			}
		}
	};


	//	eltávolítja az adott selectort az attribútumok közül
	$.fn.removeSelector = function ( selector ) {

		return $(this).each(function(){

			var item = $(this),
				removableAttr;

			if (selector) {

				if (selector[0] == "#" && selector.substr(1) == item.attr("id")) {
					removableAttr = "id";

				} else if (selector[0] == "." && selector.substr(1) == item.attr("class")) {
					removableAttr = "class"

				} else if (selector[0] == "[" && selector[selector.length-1] == "]" && item.filter(selector).length > 0) {
					removableAttr = selector.substr(1, selector.length-2);
				}

				item.removeAttr(removableAttr);
			}
		});
	};


	$.fn.toObject = function (item) {

		/*
		 Ez a függvény a megadott jquery wrapper alapján generál egy objektumot,
		 mely követi a html struktúrát és objektum propertiként eltárolja azok attribútumait.
		 A generálásnál csak a portletek szempontjából nevezetes elemeket veszi figyelembe:
		 • portlet-area
		 • portlet-group
		 • portlet

		 pl.: $.fn.portletHandler.toObject("[data-es-portlet-area]:not([data-es-portlet-area-unused])");

		 http://stackoverflow.com/questions/1181575/javascript-determine-whether-an-array-contains-a-value
		 */

		var denied_attributes = {
			style: "false"
		};

		var arr = new Array();

		$(item).each(function(){

			var obj = {};

			//  bepakolja egy objektumba az elem attribútuait
			for (var k in this.attributes) {

				if (this.attributes.hasOwnProperty(k) && this.attributes[k].name !== undefined && !(this.attributes[k].name in denied_attributes)) {
					obj[this.attributes[k].name] = this.attributes[k].value;
				}
			}

			//  és ha vannak benne további elemek, berámolja egy objektumba
			if ($(this).children().length > 0) {
				obj.content = $.fn.toObject($(this).children());
			}

			//  portlet típusjelzés beküldése
			if ($(this).attr("data-es-portlet-area") !== undefined) {													// ha portlet-area
				obj.proto = "portlet-area";																				// ellátja típusjelzéssel
				arr.push(obj);																							// és a fentieket kiegészítve bepusholja

			} else if ($(this).attr("data-es-fn") !== undefined) {
				obj.proto = "portlet-fn";
				arr.push(obj);

			} else if ($(this).attr("data-es-portlet") !== undefined && $(this).attr("data-es-fn") == undefined && $(this).attr("data-es-fn-begin") == undefined) {
				obj.proto  = "portlet";
				arr.push(obj);
			}
		});

		return arr;
	};


	$.fn.toJSONString = function (item) {

		/*
		 A függvény alapműködése nem plugin specifikus, azaz bármilyen objektumból, tömbből és további típusból álló
		 objektumot elfogad bemenetként. A portlekezelő speciális működése miatt az elején eltárolja a sablon nevét
		 (remplate_name), a sablont szerkesztő felhasználó azonosítóját (user_id) és a nyelvet (lan).
		 */

		var js = "{" +
			"\"template_name\":\"" + template_name + "\"," +
			"\"user_id\":\"" + user_id + "\"," +
			"\"lan\":\"" + lan + "\"," +
			"\"trash\":" + ($.fn.esDnDPortlet.defaultOptions.portletHandlerTrash.length > 0 ? "[\"" + $.fn.esDnDPortlet.defaultOptions.portletHandlerTrash.join("\",\"") + "\"]": "[]") + "," +
			"\"areas\":[" + generateJSON(item) + "]}";

		function generateJSON (item) {

			var js = "";

			for (var key in item) {
				if (item.hasOwnProperty(key)) {
					if ( $.type(item[key]) === "object" ) {
						js += "{";
						if (sizeOf(item[key]) > 0) {
							js += generateJSON(item[key]);
						}
						js += "},";
					} else if ( $.type(item[key]) === "array" ) {
						js += "\"" + key + "\"" + ":[";
						if (sizeOf(item[key]) > 0) {
							js += generateJSON(item[key]);
						}
						js += "],";
					} else {
						js += "\"" + key + "\"" + ":" + "\"" + item[key] + "\",";
					}
				}
			}
			return js.replace(/\,\]/g, "]").replace(/\,\}/g, "}").substr(0, js.length - 1);								// kiszedi a kósza vesszőket a folyószövegből és a végéről is
		}

		function sizeOf(obj) {
			var counter = 0;
			for (var k in obj) { if (obj.hasOwnProperty(k)) { counter++; } }
			return counter;
		}

		return js;
	};

} (jQuery));;//@version:		2.0
//@release notes:
//				• javítva a json export bug, ami nem exportálta ki az area vagy fn tartalmát ha egy data-es-portlet elemük volt
//				• json exporternél megadható nem exportálandó attribútom (pl.: style)
//@requirements:
//
// Az alábbi elemekből áll:
//
//		[data-es-portlet-area]
//			Ezekbe lehet elhelyezni a [data-es-portlet] portleteket
//
//		[data-es-portlet-area][data-es-portlet-area-unused]0
//			vagy
//		[data-es-portlet-area="unused"] (esetleg = false, 0)
//			A nem törölhető portletek forráskonténere, illetve ide kerülnek vissza ha „törlődnek” valamilyen eseménynél fogva.
//
//		[data-es-fn]
//			Klónozható forrás funkció csoport. Alapesetben több portletet is tartalmazhat. Ha olyan effektet
//			szeretnénk készíteni, amelyik csak egy portletet fogad, a portletek számát adjuk meg paraméterként.
//			Paraméter megadása nélkül korlátlan számú elemet fogad.
//			pl.:	[data-es-fn="1"] egy portletet fogadó fn esetén
//					[data-es-fn] korlátlan portletet fogadó fn esetén
//					[data-es-fn="5"] maximum öt elemet fogadó portlet esetén
//
//			[data-es-fn="slider"]		slider funkció
//			[data-es-fn="portlettab"]	portlet tab funkció
//			[data-es-param]  paraméterek > [data-es-fn-param]?
//
//		[data-es-portlet], [data-es-portlet="portlet_type"]
//			A portletkezelő csak egy típust mozgat: [data-es-portlet]
//			Ebben a propertyben tároljuk el a portlet típusát
//
// Az alábbi tulajdonságok állíthatók be, illetve léteznek:
//
//		[data-es-readonly]	A portlet-area-t csak olvashatóvá teszi, nem lehet bele elemeket húzni.
//		[data-es-unremovable]	A portleteket törölhetetlenné teszi, csak mozgathatók. A töröltek egy spec "unused" areába kerülnek.
//		[data-es-cloneable]	Klónozható portlet, róla vele megegyező tulajdonságú példányokat húzhatunk le.
//		[data-es-hidden]		Nem biztos, hogy kell, de esetleg beteszem

/*
	remove
		1. sima törlés
		2. átmozgatás a nem használtak közé
		3. ungroup

	target
		sima area
		forrás area (törölteket fogad)

	draggable
		sima
		klónozható

	fn-portlet
		sima, mint egy mezei portlet
		keretező
*/

/*
	Research
	http://api.jquery.com/on/
	http://stackoverflow.com/questions/9566322/bind-native-html5-dragstart-event-handler-and-access-datatransfer-using-jquery
	http://stackoverflow.com/questions/9566322/bind-native-html5-dragstart-event-handler-and-access-datatransfer-using-jquery
	http://www.html5rocks.com/en/tutorials/dnd/basics/
	http://www.whatwg.org/specs/web-apps/current-work/multipage/dnd.html#dnd
	http://stackoverflow.com/questions/3977596/how-to-make-divs-in-html5-draggable-for-firefox
*/

//	todo	draggelés közben egépozíció lekérése

(function ( $ ) {


	$.fn.portletHandler2 = function ( options ) {

		var o = $.extend({}, $.fn.portletHandler2.defaultOptions, options),
			portlet = $("[" + o.portlet.attr + "]"),	// normal portlet
			fn = $("[" + o.fn.attr + "]"),				// fn portlet
			area = $("[" + o.area.attr + "]"),			// normal area
			selectedPortlet,
			targetPortlet,
			targetArea,
			dragY,
			mouse = {x: 0, y: 0},
			dragSrc = null;

//		az összes portletet draggelhetővé teszi ha nem lett volna az
		portlet.each(function(){
			$(this).attr("draggable", "true");
		});

		window.addEventListener('mousedown', function(e){
			mouse.x = e.clientX || e.pageX;
			mouse.y = e.clientY || e.pageY;
		}, false);

		function dragend() {

//			console.log(selectedPortlet, targetPortlet);
			targetPortlet.after(selectedPortlet);
//			console.log(targetArea, targetPortlet);
		}

//		set portlet which is dragged
		portlet
			.on({
				dragstart: function(e){
					$(this).css({
						"opacity": ".5"
					});

					dragSrc = this;

					e.originalEvent.dataTransfer.effectAllowed = "move";
					e.originalEvent.dataTransfer.setData("text/html", this.innerHTML);			// setting data is required to fire firefox's drag'n'drop events

					console.log(e.type);
				},
				dragenter: function(e){

					e.stopPropagation();

					$(this).css({
						"border": "2px solid green"
					})
				},
				dragover: function(e){
					if (e.preventDefault) {
						e.preventDefault(); // Necessary. Allows us to drop.
					}
					e.originalEvent.dataTransfer.dropEffect = "link";
					return false;
				},
//				dragleave: function(e){
//					e.stopPropagation();
//					$(this).css({
//						"border": "none",
//					})
//				},
				drop: function(e){	// elkapó esemény

					e.stopPropagation();

					$(this).css({
						"opacity": "1"
					});

//					if it is not istelf
					if (dragSrc != this) {
						dragSrc.innerHTML = this.innerHTML;
						this.innerHTML = e.originalEvent.dataTransfer.getData("text/html");
					}

//					e.originalEvent.dataTransfer.getData('text');

					return false;
//				},
//				dragend: function(e){
//					e.stopPropagation();
//					return false;
				}
			});

//		area

	};

	$.fn.portletHandler2.defaultOptions = {
		area: {
			proto:			"portlet-area",
			attr:			"data-es-portlet-area",
			unused: {
				attr:		"data-es-portlet-area-unused",
				html:		"<div></div>",
				visible:	false
			}
		},
		portlet: {
			proto:			"portlet",
			attr:			"data-es-portlet",
			dragend:		function() {
//				console.log("hohó");
			}
		},
		fn: {
			proto:			"portlet-fn",
			html:			"<div></div>",
			attr:			"data-es-fn",
			begin: {
				attr:		"data-es-fn-begin",
				html:		"<div><strong>Function portlet </strong><br/> " +
					"<a href='#' data-es-fn-remove>remove group</a> | " +
					"<a href='#' date-es-fn-ungroup>ungroup</a></div>"
			}
		},
		placeholder: {
			attr:			"data-es-dragging-placeholder",
			before: {
				value:		"before",
				html:		"<div class='placeholder'></div>"
			},
			after: {
				value:		"after",
				html:		"<div class='placeholder'></div>"
			}
		},
		unremovable: {
			attr:			"data-es-unremovable"
		},
		readonly: {
			attr:			"data-es-readonly"
		},
		cloneable: {
			attr:			"data-es-cloneable"
		}
	}

} (jQuery));;//@version:		2.0
//@release notes:
//				• javítva a json export bug, ami nem exportálta ki az area vagy fn tartalmát ha egy data-es-portlet elemük volt
//				• json exporternél megadható nem exportálandó attribútom (pl.: style)
//@requirements:
//
// Az alábbi elemekből áll:
//
//		[data-es-portlet-area]
//			Ezekbe lehet elhelyezni a [data-es-portlet] portleteket
//
//		[data-es-portlet-area][data-es-portlet-area-unused]0
//			vagy
//		[data-es-portlet-area="unused"] (esetleg = false, 0)
//			A nem törölhető portletek forráskonténere, illetve ide kerülnek vissza ha „törlődnek” valamilyen eseménynél fogva.
//
//		[data-es-fn]
//			Klónozható forrás funkció csoport. Alapesetben több portletet is tartalmazhat. Ha olyan effektet
//			szeretnénk készíteni, amelyik csak egy portletet fogad, a portletek számát adjuk meg paraméterként.
//			Paraméter megadása nélkül korlátlan számú elemet fogad.
//			pl.:	[data-es-fn="1"] egy portletet fogadó fn esetén
//					[data-es-fn] korlátlan portletet fogadó fn esetén
//					[data-es-fn="5"] maximum öt elemet fogadó portlet esetén
//
//			[data-es-fn="slider"]		slider funkció
//			[data-es-fn="portlettab"]	portlet tab funkció
//			[data-es-param]  paraméterek > [data-es-fn-param]?
//
//		[data-es-portlet], [data-es-portlet="portlet_type"]
//			A portletkezelő csak egy típust mozgat: [data-es-portlet]
//			Ebben a propertyben tároljuk el a portlet típusát
//
// Az alábbi tulajdonságok állíthatók be, illetve léteznek:
//
//		[data-es-readonly]	A portlet-area-t csak olvashatóvá teszi, nem lehet bele elemeket húzni.
//		[data-es-unremovable]	A portleteket törölhetetlenné teszi, csak mozgathatók. A töröltek egy spec "unused" areába kerülnek.
//		[data-es-cloneable]	Klónozható portlet, róla vele megegyező tulajdonságú példányokat húzhatunk le.
//		[data-es-hidden]		Nem biztos, hogy kell, de esetleg beteszem

/*
	remove
		1. sima törlés
		2. átmozgatás a nem használtak közé
		3. ungroup

	target
		sima area
		forrás area (törölteket fogad)

	draggable
		sima
		klónozható

	fn-portlet
		sima, mint egy mezei portlet
		keretező
*/

/*
	Research
	https://developer.mozilla.org/en-US/docs/DragDrop/Recommended_Drag_Types
	http://stackoverflow.com/questions/15772249/jquery-pass-element-to-datatransfer-property
	http://api.jquery.com/on/
	http://stackoverflow.com/questions/9566322/bind-native-html5-dragstart-event-handler-and-access-datatransfer-using-jquery
	http://stackoverflow.com/questions/9566322/bind-native-html5-dragstart-event-handler-and-access-datatransfer-using-jquery
	http://www.html5rocks.com/en/tutorials/dnd/basics/
	http://www.whatwg.org/specs/web-apps/current-work/multipage/dnd.html#dnd
	http://stackoverflow.com/questions/3977596/how-to-make-divs-in-html5-draggable-for-firefox
*/

//	todo	draggelés közben egépozíció lekérése

(function ( $ ) {


	$.fn.portletHandler2 = function ( options ) {

		var o = $.extend({}, $.fn.portletHandler2.defaultOptions, options),
			portlet = $("[" + o.portlet.attr + "]"),	// normal portlet
			fn = $("[" + o.fn.attr + "]"),				// fn portlet
			area = $("[" + o.area.attr + "]"),			// normal area
			selectedPortlet,
			targetPortlet,
			targetArea,
			dragY,
			mouse = {x: 0, y: 0},
			dragSrc = null;

//		az összes portletet draggelhetővé teszi ha nem lett volna az
		portlet.each(function(){
			$(this).attr("draggable", "true");
		});

		window.addEventListener('mousedown', function(e){
			mouse.x = e.clientX || e.pageX;
			mouse.y = e.clientY || e.pageY;
		}, false);

		function dragend() {

//			console.log(selectedPortlet, targetPortlet);
			targetPortlet.after(selectedPortlet);
//			console.log(targetArea, targetPortlet);
		}

//		Ezzel lehet engedélyezni, hogy legyen dataTransfer objektuma jQuery-nek, különben event.originalEvent.dataTransferrel lehet csak rá hivatkozni
//		jQuery.event.props.push('dataTransfer');

//		set portlet which is dragged
		portlet
			.on({
				dragstart: function(e){
					$(this).css({
						"opacity": ".5"
					});

					dragSrc = this;

					e.originalEvent.dataTransfer.effectAllowed = "move";
//					e.originalEvent.dataTransfer.setData("text/html", this.innerHTML);			// setting data is required to fire firefox's drag'n'drop events
					e.originalEvent.dataTransfer.setData("punci", "pincipunci");			// setting data is required to fire firefox's drag'n'drop events

					console.log(e.type);
				},
				dragenter: function(e){

					e.stopPropagation();

					$(this).css({
						"border": "2px solid green"
					})
				},
				dragover: function(e){
					if (e.preventDefault) {
						e.preventDefault(); // Necessary. Allows us to drop.
					}
					e.originalEvent.dataTransfer.dropEffect = "move";
					return false;
				},
//				dragleave: function(e){
//					e.stopPropagation();
//					$(this).css({
//						"border": "none",
//					})
//				},
				drop: function(e){	// elkapó esemény

					e.stopPropagation();

					$(this).css({
						"opacity": "1"
					});

//					if it is not istelf
					if (dragSrc != this) {
//						dragSrc.innerHTML = this.innerHTML;
//						this.innerHTML = e.originalEvent.dataTransfer.getData("text/html");
						console.log(e.originalEvent.dataTransfer.getData("punci"));
					}

//					e.originalEvent.dataTransfer.getData('text');

					return false;
//				},
//				dragend: function(e){
//					e.stopPropagation();
//					return false;
				}
			});

//		area

	};

	$.fn.portletHandler2.defaultOptions = {
		area: {
			proto:			"portlet-area",
			attr:			"data-es-portlet-area",
			unused: {
				attr:		"data-es-portlet-area-unused",
				html:		"<div></div>",
				visible:	false
			}
		},
		portlet: {
			proto:			"portlet",
			attr:			"data-es-portlet",
			dragend:		function() {
//				console.log("hohó");
			}
		},
		fn: {
			proto:			"portlet-fn",
			html:			"<div></div>",
			attr:			"data-es-fn",
			begin: {
				attr:		"data-es-fn-begin",
				html:		"<div><strong>Function portlet </strong><br/> " +
					"<a href='#' data-es-fn-remove>remove group</a> | " +
					"<a href='#' date-es-fn-ungroup>ungroup</a></div>"
			}
		},
		placeholder: {
			attr:			"data-es-dragging-placeholder",
			before: {
				value:		"before",
				html:		"<div class='placeholder'></div>"
			},
			after: {
				value:		"after",
				html:		"<div class='placeholder'></div>"
			}
		},
		unremovable: {
			attr:			"data-es-unremovable"
		},
		readonly: {
			attr:			"data-es-readonly"
		},
		cloneable: {
			attr:			"data-es-cloneable"
		}
	}

} (jQuery));;//@version:		0.9.11
//@release notes:
//				• javítva a json export bug, ami nem exportálta ki az area vagy fn tartalmát ha egy data-es-portlet elemük volt
//				• json exporternél megadható nem exportálandó attribútom (pl.: style)
//@requirements:
//
// Az alábbi elemekből áll:
//
//		[data-es-portlet-area]
//			Ezekbe lehet elhelyezni a [data-es-portlet] portleteket
//
//		[data-es-portlet-area][data-es-portlet-area-unused]0
//			vagy
//		[data-es-portlet-area="unused"] (esetleg = false, 0)
//			A nem törölhető portletek forráskonténere, illetve ide kerülnek vissza ha „törlődnek” valamilyen eseménynél fogva.
//
//		[data-es-fn] (a korábbi [data-group])
//			Klónozható forrás funkció csoport. Alapesetben több portletet is tartalmazhat. Ha olyan effektet
//			szeretnénk készíteni, amelyik csak egy portletet fogad, a portletek számát adjuk meg paraméterként.
//			Paraméter megadása nélkül korlátlan számú elemet fogad.
//			pl.:	[data-es-fn="1"] egy portletet fogadó fn esetén
//					[data-es-fn] korlátlan portletet fogadó fn esetén
//					[data-es-fn="5"] maximum öt elemet fogadó portlet esetén
//
//			[data-es-fn="slider"]		slider funkció
//			[data-es-fn="portlettab"]	portlet tab funkció
//			[data-es-param]  paraméterek > [data-es-fn-param]?
//
//		[data-es-portlet], [data-es-portlet="portlet_type"]
//			A portletkezelő csak egy típust mozgat: [data-es-portlet]
//			Ebben a propertyben tároljuk el a portlet típusát
//
// Az alábbi tulajdonságok állíthatók be, illetve léteznek:
//
//		[data-es-readonly]	A portlet-area-t csak olvashatóvá teszi, nem lehet bele elemeket húzni.
//		[data-es-unremovable]	A portleteket törölhetetlenné teszi, csak mozgathatók. A töröltek egy spec "unused" areába kerülnek.
//		[data-es-cloneable]	Klónozható portlet, róla vele megegyező tulajdonságú példányokat húzhatunk le.
//		[data-es-hidden]		Nem biztos, hogy kell, de esetleg beteszem
//
//
//
//@todos:
//
//hold:
//hold	a kósza sima szövegeket, amik NEM text-ben vannak, valamiképp ignoráltatni kell vele!
//hold	úgy fest, a style visszatölt és nem megy rendesen, mert release esetén olakor változik a dobozméret
//hold	a readonly portletet most klónozható
//hold	ha a groupból kidobok mindent, akkor a group törlődjön
//hold	data-removable, azaz törölhető portlet kapcsoló
//hold	ne csak portleteket indexeljen, hanem mindent, de a „js-” vagy megadott kezdetűeket külön kezelje
//hold	felállítani egy függőségi listát, hogy melyik portletfajta mihez tapadhat, hova kerülhet be
//hold	csekkolni, hogy ami klónozható, az kapásból readonly legyen, ne kelljen külön kezelni (kipróbáltam és nem kavar ha kiveszem a readonly property-t)
// *
// *
//active:
//todo	átírni a plugint úgy, hogy a változói kívülről is elérhetők legyenek > portletHandlerTrash miatt is
//done	a generált fn dobozok kiürítésekor IS automatikusan törlődniük kell > cleanup
//done	trash tömb, amibe a NEM newID-val rendelkező elemek azonosítója kerül
//todo	fn klónoknál forrásspecifikus HTML-t bevezetni, hogy látszódjon, mit dobtam rá!
//todo	saját eseménykezelést bevezetni a release eseményre külső hívások részére
//todo	az egyes portleten végrehajtható műveleteket csoportosítani (pl.: a) dobd mögé/elé b) dobd portletarába c) wrappeld bele stb.)
//done	üres unused areára nem tudok visszahúzni portletet
//done	háromféle stílus hiányzik (illetve kettő): portlet alapállapot, portlet egér felette, portlet draggelve (done)
//todo	eventeket specializálni esolr-ra, hogy nehogy más kilője!!!
//todo	az attribútum tilts lehetőségét json exportba is megadni! vagy inkább csak ott
//todo	klónozott fn-t még lehet fn-be tenni
//done	Hogy betölthető legyen: szétválasztani a megjelenítést, ami csak a látványt szolgálja ki, de a beállításokat data-ban rögzíti
//done	jsonnál a nem generálandó areát külön jelezni (lehet elég a readonly állapot is) > nem kell legenerálni
//done  duplikátumoknak id="0"-t megadni
//done  az fn (group) portlet portletként történő mozgatása nem műx
//done  klónozásnál a hozzárendeléseket release esetén kellene megtenni, mert úgy tulajdonságtól függően lehet lekezelni a release eseményt
//todo	egymásba ágyazott fn -eknél nem jól műxik az ungroup
//todo	lekezelni az egymásra helyezett areák esetét és mindig a legfelsőnek adni a fókuszt
//done  csoport elhagyásakor csekkolni, hogy van-e még benne elemés ha nincs, törölni
//done  a forrás és cél fn-ek előkészítése, hogy jól generálható legyen a cucc > a forrást a cloneable opció teljesen jól lefedi
//done  a két o.i.fn és o.i.fn objektumokat összefésülni
//done  klónozásnál egyelőre nem viszi magával a portletszámra vonatkozó korlázotást: data-es-fn="1" > data-es-param="max-item:1"
//done  unused areába csak unremovable portletet lehessen húzni!
//done  hogy különböztessem meg a forrás [data-es-fn]-t és a már élő változatát? Csak a [data-es-cloneable] legyen a difi? > IGEN
//done  a data-es-fn tulajdonsához is hozzárendelni a clónozhatóságot, ne csak a cloneable-höz, ami teljesen általános > NEM KELL
//todo	lekezelni, hogy multiple-parent, azaz megengedi, hogy dobjunk bele
//done  hol tároljuk a portlet típusát? (content-list, content-list-expanded, calendar, download, article, video etc.) > [data-es-portlet]-ben
//todo	talán magát az appot is prefixelni kellene: data-es-ph-
//todo	betervezni portlet tartalmakat is (fejléc stb.) és kapcsolhatvá tenni, miből generáljon objektet, majd json-t
//done  csoport törlés / ungroup nem megy zökkenőmentesen
//done  data-es- prefixet bevezetni, hogy elkerüljük a későbbi ütközést
//todo	a data- attribútumokat átvezetni .data() kezelés alá
//done  placeholder  egységesítése, mert most nincs szinkronban az objektummal
//done  az area hover valami miatt nem műx
//done  read-only portletek NEM törölhetők, illetve ga olyan csoportot törlök, amiben read-only portlet volt, azokat unwrappelje > unused portlet-area
//done  [portlet-area-unused]-t atomatikusan csekkolni és létrehozni ha nincs
//done  áttérni .portlet-area-tól [data-es-portlet-area]-ra
//done  Valszeg kell egy portletObj-t frissítő a windows.resize-hoz.
//done  másolt portlet mindig az area aljára esik
//done  .placeholder fix drótozására kitalálni valamit (mouseup-nál) > data-placeholder-[begin/end] lett belőle
//done  ha group portletet nem area felett engedek el, akkor törli az elemet
//done  megoldani, hogy a portleten kívül, de az area-n belül is érzékeljen, azaz a portletnek ebből a szempontból csak a magassága számítson
//done  ha üres portlet-areara húzunk elemet, annak is illene jelezni a portlet-area-ban a lehetséges landolási szándékát
//hold	ha stickivel jelölt portletet mozgatok, akkor a sticky is mozogjon vele együtt
//done  groupot lehessen együtt is mozgatni
//todo	data-es-param="max-item:1" kapcsoló, azaz csak portleten elengedve és adott portlehez tapadva jelenik meg és ne lehessen többet beletenni
//todo	data-writeonly area megjelölése (kb. csak a törlés funckció ilyen)
//done  data-group a keretező effekteknek – több komponensű feature portlet. (Ezen belül csak egy portletes vagy „n” portletes)
//done  readonly portletet readonly area-n belül ne lehessen duplikálni
//done  readonly portletet még area-n belül se lehessen mozgatni
//done  levenni az area számítást a resize-ról, mert sok portletnél belassul > set interval; Sima függvényhívás megoldotta.
//done  Kérdés, hogy draggeléskor mindig az aktuális eredetit viszem és a másolat marad, vagy fordítva. > mindig az aktuális eredeti mozog
//todo	portlet duplikálás readonlyról és normálról (+) gombbal és vagy billenttyűzetről
//todo	vezérlés billentyűzetről (bal-jobb area, föl-le portlet váltás): új / törlés / duplikálás
//todo	touch eszközöket tesztelni és frissíteni a kódod ha kell
//done  a portlet-area és portlet koordinátáit objektumba tárolni praktikusabb lenne
//done  Csak forrás (read only) area megjelölése.
//done  függetleníteni az o.portlet objektumtól
//done  neveket picit rendebtenni, mert a targetArea és a targetPortlet ugyanolyan funkciót lát el, de ez nem látszik jól
//todo	megoldást találni a .-tal kezdődő nevek problematikájára
//done  lekezelni a gyors egérmozgást > egér lenyomásakor az ablakhoz rendelt eseménykezelővel figyeltetem a mousemove-ot
//done  placeholder classt automatizálni
//done  teljesen dinamikussá tenni a portletek kezelését, hogy init alatt történjen
//done  portlet törlése, ami ugyanaz mint a fenti csak fordítva
//todo	megoldani, hogy ha a képernyő szélei felé közelítek, finoman kezdjen scrollozni a hosszabb oldalaknál
//todo	json bemenet
//done  json kimenet




(function ( $ ) {

	var portletHandlerTrash = [];				// nem newID-val rendelkező, azaz már eltárolt, de törölt elemek azonosítója


	$.fn.portletHandler = function ( options ) {

		var defaults = {
			portletObj:				this,		// continuosly updates portlet "container"
			newID:					"0",		// default value of newly created items

			i: {																										// items
				area: {
					proto:			"portlet-area",
					attr:			"data-es-portlet-area",
					unused: {
						attr:		"data-es-portlet-area-unused",
						html:		"<div></div>",
						visible:	false
					}
				},
				portlet: {
					proto:			"portlet",
					attr:			"data-es-portlet"
				},
				fn: {
					proto:			"portlet-fn",
					html:			"<div></div>",
					attr:			"data-es-fn",
					begin: {
						attr:		"data-es-fn-begin",
						html:		"<div><strong>Function portlet </strong><br/> " +
									"<a href='#' data-es-fn-remove>remove group</a> | " +
									"<a href='#' date-es-fn-ungroup>ungroup</a></div>"
					}
				},
				placeholder: {
					attr:			"data-es-dragging-placeholder",
					before: {
						value:		"before",
						html:		"<div class='placeholder'></div>"
					},
					after: {
						value:		"after",
						html:		"<div class='placeholder'></div>"
					}
				},
				unremovable: {
					attr:			"data-es-unremovable"
				},
				readonly: {
					attr:			"data-es-readonly"
				},
				cloneable: {
					attr:			"data-es-cloneable"
				}
			},

			s: {																										// states
				area: {
					over: {																								// area over state
						attr:		"data-es-over"
					}
				},
				portlet: {
					default: {
						style: {
							"position":"static"
						}
					},
					draggable: {																						// portlet dragging state
						attr:			"data-es-draggable",
						style: {
							"cursor":	"move",
							"z-index":	100000
						}
					},
					over: {																								// portlet over state
						style: {
							"cursor":	"move"
						}
					}
				}
			},

			f: {																										// functions
				portlet: {
					remove: {
						attr:   "data-es-portlet-remove",
						do:		(function () {

							//  removes the portlet
							$("[" + o.f.portlet.remove.attr + "]").each( function () {

								$(this).on("mousedown", function ( e ) {
									e.preventDefault();
									e.stopPropagation();

									var $this = $(this);

									if ($this.closest("[" + o.i.portlet.attr + "]").attr(o.i.unremovable.attr) !== undefined) {
										//  if portlet unremovable it is moved to data-es-portlet-area-unused
										$("[" + o.i.area.unused.attr + "]").append($this.closest("[" + o.i.portlet.attr + "]"));
									} else {
										//  if portlet is "normal" removable
										idToTrash($this.closest("[" + o.i.portlet.attr + "]"));
										$this.closest("[" + o.i.portlet.attr + "]").remove();
									}
									scan();
									o.f.fn.cleanup();
								});
							});
						})
					}
				},
				fn: {
					remove: {
						attr:   "data-es-fn-remove",
						do:		(function () {

							//  removes the group includong portlets except unremovable portlets and stays as it is
							$("[" + o.f.fn.remove.attr + "]").each( function () {

								$(this).on("mousedown", function ( e ) {
									e.preventDefault();
//									e.stopPropagation();

									var $this = $(this);

									$this.parents("[" + o.i.fn.attr + "]").after($this.parents("[" + o.i.fn.attr + "]").children("[" + o.i.unremovable.attr + "]"));
									idToTrash($this.parents("[" + o.i.fn.attr + "]"));
									$this.parents("[" + o.i.fn.attr + "]").remove();
									scan();
									o.f.fn.cleanup();
								});
							});
						})
					},
					ungroup: {
						attr:   "date-es-fn-ungroup",
						do:		(function () {

							//  removes the wrapper "effect" portlet, but keeps the portlets
							$("[" + o.f.fn.ungroup.attr + "]").each( function () {

								$(this).on("mousedown", function ( e ) {
									e.preventDefault();
//									e.stopPropagation();

									var $this = $(this);

									idToTrash($this.parents("[" + o.i.fn.attr + "]"));
									$this.parents("[" + o.i.fn.attr + "]").children().unwrap();							// removes the encapsuling fn portlet
									$this.closest("[" + o.i.fn.begin.attr + "]").remove();								// removes the top of the fn group
									scan();
									o.f.fn.cleanup();
								});
							});
						})
					},
					cleanup:	(function () {

						// removes empty fn portlets if exists (e.g. after the last portlet is removed or moved out and the fn become empty)
						$("[" + o.i.fn.attr + "]:not([" + o.i.cloneable.attr + "])").each( function () {
							var $this = $(this);
							if ( !$this.children().is("[" + o.i.portlet.attr + "]") ) {
								idToTrash($this);
								$this.remove();
								scan();
								o.f.fn.cleanup();
							}
						});
					})
				}
			}
		};

		var o = $.extend(true, defaults, options );	// overwrites default options with new parameters
		var areaFields = new Object();				// contains the up-to-date area coordinates (left, top, right, bottom) and other properties
		var portletFields = new Object();			// contains the up-to-date portlet coordinates (left, top, right, bottom)
		var selectedPortlet;						// idx of dragged portlet
		var targetArea;								// idx of area dragging over
		var targetPortlet;							// idx of portlet dragging over
		var beforePortlet;							// position (before, after) of portlet draging over
		var cloneInProgress = false;				// records that cloning (and dragging event) is in progress


		//  Ennek az a szerepe, hogy valós időben frissítse a portletek dinamikusan változó állományát
		function scan () {
			o.portletObj = $("[" + o.i.portlet.attr + "]");
		}

		//	Ha törlünk egy elemet és az db-ből generált, akkor annak az ID-jét a fizikai törlés előtt eltárolja
		function idToTrash (item) {
			if (item.attr("id") !== o.newID && item.attr("id") !== undefined) {
				if ($.inArray(item.attr("id"), portletHandlerTrash) < 0) {
					portletHandlerTrash.push(item.attr("id"));
				}
			}
		}


		//  Aktiválja az unused areát a nem törölhető portletek számára
		function initPortletAreaUnused () {

			if ( $("[" + o.i.area.unused.attr + "]").length == 0 ) {
				if ( o.i.area.unused.visible ) {
					$("body").prepend( $(o.i.area.unused.html).attr(o.i.area.unused.attr, "").attr(o.i.area.attr, "") );
				} else {
					$("body").prepend( $(o.i.area.unused.html).attr(o.i.area.unused.attr, "").attr(o.i.area.attr, "").hide() );
				}
			}
		}


		//	Megnézi, hogy adott egérpozíció alatt dragging közben melyik portlet-area fekszik
		function areaSelect (x, y) {

			var area = $("[" + o.i.area.attr + "]");
			var overArea;

			//  Search for the hover area
			for (var i = 0; i < areaFields.length; i++ ) {
				if ( areaFields[i].left <= x  && x <= areaFields[i].right && areaFields[i].top <= y  && y <= areaFields[i].bottom) {
//					console.log(i, "portlet-area");
					overArea = i;
//					area.siblings("[" + o.i.area.attr + "]").removeAttr(o.s.area.over.attr).eq(i).attr(o.s.area.over.attr, "");
					area.removeAttr(o.s.area.over.attr).eq(i).attr(o.s.area.over.attr, "");
					return overArea;
				}
			}

			//  Ha nem áll terület felett, akkor a szülő lesz a targetArea
			return o.portletObj.eq(selectedPortlet).parent().siblings("[" + o.i.area.attr + "]").andSelf().index( o.portletObj.eq(selectedPortlet).parent() );
		}


		//	Megnézi, hogy adott egérpozíció alatt dragging közben melyik portlet fekszik és megjelöli a portlet tulajdonságának megfelelő lehetséges helyet
		function targetPortletSelect (x, y) {

			var overPortlet;
			var half;

			//  megnézi, mely portlet felett állunk
			for (var i = 0; i < portletFields.length; i++ ) {
				if ( i !== selectedPortlet ) {
					if ( portletFields[i].left <= x && x <= portletFields[i].right && portletFields[i].top <= y && y <= portletFields[i].bottom ) {
						overPortlet = i;
//						console.log(i, " Portlet space");
//						console.log(o.portletObj.eq(i).parents("[" + o.i.area.attr + "]"));
//						console.log(o.portletObj.eq(i).is("[" + o.i.portlet.attr + "]:first-child:not([" + o.i.fn.begin.attr + "])"));
					}
				}
			}

			//  Ha nem read only area felett állunk, akkor megjelöli placeholder-rel a lehetséges beszúrási helyeket (előtte-e vagy utána)
			if ( overPortlet !== undefined && !(areaFields[targetArea].readonly)) {

				half = Math.round( (portletFields[overPortlet].bottom - portletFields[overPortlet].top) / 2 );

				$( "[" + o.i.placeholder.attr + "]").remove();  // törli a placeholdert

				if (portletFields[selectedPortlet].fn && portletFields[selectedPortlet].cloneable) { // klónozható group portlet esetén
//					console.log("group")
					$(o.portletObj).eq(targetPortlet).before( $(o.i.placeholder.before.html).attr(o.i.placeholder.attr, o.i.placeholder.before.value) );
					$(o.portletObj).eq(targetPortlet).after( $(o.i.placeholder.after.html).attr(o.i.placeholder.attr, o.i.placeholder.after.value) );

//						console.log($(o.portletObj).eq(targetPortlet).attr("[" + o.i.placeholder.attr + "]"))
//						if ($(o.portletObj).eq(targetPortlet).attr("[" + o.i.placeholder.attr + "]") == undefined) {
//							$(o.portletObj).eq(targetPortlet).wrap("<div style='background-color: #fff;padding: 2px;' data-es-dragging-placeholder></div>");
//							console.log("O")
//						}

				} else {	// sima portlet esetén
					if ( portletFields[overPortlet].top <= y && y <= portletFields[overPortlet].top + half) {
						beforePortlet = true;
						$(o.portletObj).eq(targetPortlet).before( $(o.i.placeholder.before.html).attr(o.i.placeholder.attr, o.i.placeholder.before.value) );
					} else {
						beforePortlet = false;
						$(o.portletObj).eq(targetPortlet).after( $(o.i.placeholder.after.html).attr(o.i.placeholder.attr, o.i.placeholder.after.value) );
					}
				}
			}
			return overPortlet;
		}


		// újrakalkulálja a portlet területek paramétereit
		function getCoordinates () {

			//  activating "button related" functions for dynamically generated buttons
			o.f.portlet.remove.do();	// call "remove portlet" buttons if exist
			o.f.fn.remove.do();			// call "remove fn portlet" buttons if exists
			o.f.fn.ungroup.do();		// call "ungroup fn portlet" button if exists

			//  portlet-area-k koordinátáinak rögzítése
			areaFields = {};
			for (var i = 0; i < $("[" + o.i.area.attr + "]").length; i++) {
				(function () {
					var area = $("[" + o.i.area.attr + "]").eq(i);
					areaFields[i] = {
						left:		Math.round(area.offset().left),
						top:		Math.round(area.offset().top),
						right:		Math.round(area.offset().left + area.outerWidth(true)),
						bottom:		Math.round(area.offset().top + area.outerHeight(true)),
						readonly:	area.attr(o.i.readonly.attr) !== undefined,
						unused:		area.attr(o.i.area.unused.attr) !== undefined
					};
				} ());
				areaFields.length = i + 1;
			}

			//  portletek koordinátáinak rögzítése
			portletFields = {};
			for (var j = 0; j < o.portletObj.length; j++) {
				(function () {
					var area = $(o.portletObj[j]);
					portletFields[j] = {
						left:		Math.round(area.parents("[" + o.i.area.attr + "]").offset().left),					// amiatt parent, hogy már az area fülő érve is adott portletet érzékelne
						top:		Math.round(area.offset().top),
						right:		Math.round(area.parents("[" + o.i.area.attr + "]").offset().left + area.parents("[" + o.i.area.attr + "]").outerWidth(true)),
						bottom:		Math.round(area.offset().top + area.outerHeight(true)),
						readonly:	area.attr(o.i.readonly.attr) !== undefined,
						cloneable:	area.attr(o.i.cloneable.attr) !== undefined,
						fn:			area.attr(o.i.fn.attr) !== undefined,
						unremovable:area.attr(o.i.unremovable.attr) !== undefined
					};
				} ());
				portletFields.length = j + 1;
			}
		}


		//	Recover simple links which has a href attribute
		function recoverLinks() {
			o.portletObj.find("a[href]").each(function(){
				var link = $(this);
				link.on("mouseup.esolr.portlethandler.link", function(e){
					e.preventDefault();
					console.log(link.attr("href"));
					document.location.href = link.attr("href");
				})
			});
		}


		// újrakalkulálja a portlet területek paramétereit arra az esetre ha responsive lenne a felület vagy átméretezné a felhasználó
		$(window).resize( function () {
			getCoordinates();
		});

		scan();
//		getCoordinates();
		initPortletAreaUnused();													// ha nincs portlet-area unused elemeknek, akkor csinál egyet
		getCoordinates();															// beállítja az alapkoordinátákat

		// Portlet events
		return o.portletObj.each( function () {

			//  events starting with dragging
			$(this).on( "mousedown", function (ev) {

				ev.preventDefault();												// kilövi a selection-t
				ev.stopPropagation();												// hogy egymásba ágyazás esetén a szülő ne kapja el a kattintást

				var port = $(this);
				var styleAttr = port.attr("style");									// style-ként megadott jellemzők elmentése (ha van)
				targetArea = areaSelect(ev.pageX, ev.pageY);						// amiatt szerepel itt is, mert ha nem draggelem csak kattintok, akkor is értelmezett legyen a release eseménynél
				selectedPortlet = findObj(this, o.portletObj);						// visszaadja a kiválasztott portlet indexszét


				//  watch mouse position while dragging
				$(window).on("mousemove", function (e) {							// azért kell, hogy gyors egérmozgásnál se veszítsen pozíciót a megragadott portlet

					port.children().hide();											// ha groupot mozgatok, a benne lévőket elhide-olja

					//  ha a portlet nem readonly, akkor mozgatja a kiválasztott portletet
					if (!portletFields[selectedPortlet].readonly) {
						port.offset({
							left: e.pageX - port.outerWidth() / 2,
							top: e.pageY - port.outerHeight() / 2
						});

						targetArea = areaSelect(e.pageX, e.pageY);					// mozgás közben figyeli, mely portlet area felett állunk
						targetPortlet = targetPortletSelect(e.pageX, e.pageY);		// mozgás közben figyeli, mely portlet felett állunk

						getCoordinates();											// mozgás közben folyamatosan újraszámolja az alapparamétereket
					} else {
						port.trigger("mouseup");									// ha megmozdítom az egeret readonly portlet felett, egyből olyan, mintha felengedném
					}
				});


				//  events white dragging
				port.on( "mousemove", function () {

					//  akkor hajtja végre, ha nem readonly, vagy ha readonly, de cloneozható
					if (!portletFields[selectedPortlet].readonly || (portletFields[selectedPortlet].readonly && portletFields[selectedPortlet].cloneable)) {

						if (portletFields[selectedPortlet].cloneable && !(cloneInProgress)) {							// felveszi a dragging állapotot
							port.removeAttr(o.i.readonly.attr).attr(o.s.portlet.draggable.attr, "").attr("id", o.newID)
								.clone(true).removeAttr(o.s.portlet.draggable.attr).attr(o.i.readonly.attr, "").attr(o.i.cloneable.attr, "")
								.off("mousemove mouseout mouseup").insertAfter(this);									// jó és van esemény a másolaton
							scan();																						// így a menet közben újonan hozzáadott portletek is azonnal használatba kerülnek, sorszámot kapnak
							getCoordinates();																			// ide is kell, mert különben mindig az area aljára dobná az új portletet
							cloneInProgress = true;																		// azért kell, hogy a duplikálás csak egyszer történjen a drag esemény közben
						}

						port.removeAttr("style");																		// drag kezdetén lekapja a style attribútumot, hogy az inline style ne kavarjon be a .draggable-nek
						port.css(o.s.portlet.draggable.style).attr(o.s.portlet.draggable.attr, "");						// drag kezdetén hozzácsapjuk az egérkurzort és a .draggable-et
					}
				});


				//  end of dragging
				port.on( "mouseup", function () {

					var released = $(this);

					released.children().show(); // a group hide-olt elemeit visszakapcsolja

					released.off("mouseup mouseout mousemove")															// eseménykezelőt kilövi,
						.removeAttr(o.s.portlet.draggable.attr).css(o.s.portlet.default.style);							// mozgatás közbeni megjelenést kilövi
//							.removeAttr(o.i.cloneable.attr)																// egér felengedésekor a klónozhatóságot jelző tulajdonságot kilövi

					$(window).off("mousemove");																			// eseményfigyelést kilövi, hogy ne halmozódjon


					// ha portlet és portlet-area felett van és az nem readonly
					if ( targetPortlet !== undefined && !areaFields[targetArea].readonly && !portletFields[targetPortlet].readonly && !areaFields[targetArea].unused) {
						//  dragging over a portlet and duplicating (apply) a fn portlet
						if (portletFields[selectedPortlet].fn && portletFields[selectedPortlet].cloneable && !portletFields[targetPortlet].fn && $(o.portletObj).eq(targetPortlet).parent("[" + o.i.fn.attr + "]").length == 0) {
							$(o.portletObj).eq(targetPortlet).wrap(released.empty().removeAttr(o.i.cloneable.attr).attr(o.i.portlet.attr, ""));
							$(o.portletObj).eq(targetPortlet).before( $(o.i.fn.begin.html).attr(o.i.fn.begin.attr, "") );
							released.remove();
							scan();

							//  normal porltlet
						} else {
							if ( beforePortlet ) {
								$(o.portletObj).eq(targetPortlet).before( released.removeAttr(o.i.cloneable.attr) );
							} else {
								$(o.portletObj).eq(targetPortlet).after( released.removeAttr(o.i.cloneable.attr) );
							}
						}

						// ha nem readonly unused area felett áll és a portlet unremovable
					} else if ( !areaFields[targetArea].readonly && areaFields[targetArea].unused && portletFields[selectedPortlet].unremovable ) {

						if ( targetPortlet !== undefined) {
							// ha portlet fölött álltunk és nem üres az unused portlet ares
							if ( beforePortlet ) {
								$(o.portletObj).eq(targetPortlet).before( released.removeAttr(o.i.cloneable.attr) );
							} else {
								$(o.portletObj).eq(targetPortlet).after( released.removeAttr(o.i.cloneable.attr) );
							}
						} else {
							// ha üres az unused portlet area
							$("[" + o.i.area.attr + "]").eq(targetArea).append( released );
						}

						// ha a portlet area nem readonly és nem unused
					} else if ( !areaFields[targetArea].readonly && !areaFields[targetArea].unused) {
						//  dragging over a portlet-area or empty portlet area
						if (portletFields[selectedPortlet].fn && portletFields[selectedPortlet].cloneable) {			// ha groupot draggelek, akkor törli, nem csinál semmit
							released.remove();
							scan();
						} else {																						// ha sima portletet, akkor bedobja az area végére
							$("[" + o.i.area.attr + "]").eq(targetArea).append( released );
						}

						// ha readonly portlet-area felett klónozunk
					} else if ( (areaFields[targetArea].readonly && cloneInProgress) || (areaFields[targetArea].unused && portletFields[selectedPortlet].cloneable) ) {
						released.remove();
						scan();
					}

					o.f.fn.cleanup();
					getCoordinates();

					//  reset
					$("[" + o.i.placeholder.attr + "]").remove();
					$("[" + o.i.area.attr + "]").removeAttr(o.s.area.over.attr);
					selectedPortlet = undefined;
					targetArea = undefined;
					targetPortlet = undefined;
					beforePortlet = undefined;
					cloneInProgress = false;

					if ( styleAttr !== undefined ) {																	// visszaállítja a style attribútumát ha volt (így nem ugrál)
						released.attr("style", styleAttr);
					}
				});

			}).on("mouseover", function () {
					$(this).css(o.s.portlet.over.style);
				});

			recoverLinks();
		});


		/*
		 Helpers –––––––––––––––––––––––––––––––––––––––––––––––––––––––
		 */

		// Returns the index of obj1 in obj2, otherwise false
		function findObj (obj, inObj) {
			for (var n = 0; n < inObj.length; n++) {
				if ( obj === inObj[n] ) {
					return n;
				}
			}
			return false;
		}

		// Removes selector prefix (. and #) if exists. Accept multiple selectors.
		function r( selector ) {
			var replaced = selector.replace(/\./g, "").replace(/\#/, "");
			return replaced;
		}

		//	Enable links for data-stoppropagation links
		$("[" + o.i.portlet.attr + "] a[data-stoppropagation]").on("mousedown", function(e){
			e.stopPropagation();
		});
	};


	$.fn.portletHandler.toObject = function (item) {

		/*
		Ez a függvény a megadott jquery wrapper alapján generál egy objektumot,
		mely követi a html struktúrát és objektum propertiként eltárolja azok attribútumait.
		A generálásnál csak a portletek szempontjából nevezetes elemeket veszi figyelembe:
		• portlet-area
		• portlet-group
		• portlet

		pl.: $.fn.portletHandler.toObject("[data-es-portlet-area]:not([data-es-portlet-area-unused])");

		http://stackoverflow.com/questions/1181575/javascript-determine-whether-an-array-contains-a-value
		*/

		var denied_attributes = {
			style: "false"
		};

		var arr = new Array();

		$(item).each(function(){

			var obj = {};

			//  bepakolja egy objektumba az elem attribútuait
			for (var k in this.attributes) {

				if (this.attributes.hasOwnProperty(k) && this.attributes[k].name !== undefined && !(this.attributes[k].name in denied_attributes)) {
					obj[this.attributes[k].name] = this.attributes[k].value;
				}
			}

			//  és ha vannak benne további elemek, berámolja egy objektumba
			if ($(this).children().length > 0) {
				obj.content = $.fn.portletHandler.toObject($(this).children());
			}

			//  portlet típusjelzés beküldése
			if ($(this).attr("data-es-portlet-area") !== undefined) {													// ha portlet-area
				obj.proto = "portlet-area";																				// ellátja típusjelzéssel
				arr.push(obj);																							// és a fentieket kiegészítve bepusholja

			} else if ($(this).attr("data-es-fn") !== undefined) {
				obj.proto = "portlet-fn";
				arr.push(obj);

			} else if ($(this).attr("data-es-portlet") !== undefined && $(this).attr("data-es-fn") == undefined && $(this).attr("data-es-fn-begin") == undefined) {
				obj.proto  = "portlet";
				arr.push(obj);
			}
		});

		return arr;
	};


	$.fn.portletHandler.toJSONString = function (item) {

		/*
		A függvény alapműködése nem plugin specifikus, azaz bármilyen objektumból, tömbből és további típusból álló
		objektumot elfogad bemenetként. A portlekezelő speciális működése miatt az elején eltárolja a sablon nevét
		(remplate_name), a sablont szerkesztő felhasználó azonosítóját (user_id) és a nyelvet (lan).
		*/

		var js = "{" +
			"\"template_name\":\"" + template_name + "\"," +
			"\"user_id\":\"" + user_id + "\"," +
			"\"lan\":\"" + lan + "\"," +
			"\"trash\":" + (portletHandlerTrash.length > 0 ? "[\"" + portletHandlerTrash.join("\",\"") + "\"]": "[]") + "," +
			"\"areas\":[" + generateJSON(item) + "]}";

		function generateJSON (item) {

			var js = "";

			for (var key in item) {
				if (item.hasOwnProperty(key)) {
					if ( $.type(item[key]) === "object" ) {
						js += "{";
						if (sizeOf(item[key]) > 0) {
							js += generateJSON(item[key]);
						}
						js += "},";
					} else if ( $.type(item[key]) === "array" ) {
						js += "\"" + key + "\"" + ":[";
						if (sizeOf(item[key]) > 0) {
							js += generateJSON(item[key]);
						}
						js += "],";
					} else {
						js += "\"" + key + "\"" + ":" + "\"" + item[key] + "\",";
					}
				}
			}
			return js.replace(/\,\]/g, "]").replace(/\,\}/g, "}").substr(0, js.length - 1);								// kiszedi a kósza vesszőket a folyószövegből és a végéről is
		}

		function sizeOf(obj) {
			var counter = 0;
			for (var k in obj) { if (obj.hasOwnProperty(k)) { counter++; } }
			return counter;
		}

		return js;
	};

} (jQuery));;/*
	@desc		Portlet to virtual tabbed portlet converter
	@version	1.0
	@author

	todo		todo lekezelni, ha a portletnek nincs címe
	todo		utolsó loopot kiszedni és each-csel megoldani
	todo		portletkezelőnek megfelelő szintaxissal parse-olni a paramétereket
*/


/*
	Expected structure:

	<div data-es-fn="portlet-tab" data-group-title="title" data-portlet-title="[no, 0, false]" data-selected="0">
		<div class="portlet">…</div>
		<div class="portlet">…</div>
	</div>

	<script>
		$.fn.esPortletTab();
	</script>
*/

(function ( $ ) {

	$.fn.esPortletTab = function ( options ) {

		var defaults = {
			dom_wrap:				"[data-es-fn='portlet-tab']",
			class: {
				portlet:			"portlet",
				portletTitle:		"portlet-title",
				groupTitle:			"portlet-group-title",
				tabs:				"tabs",
				tabSelected:		"selected"
			},
			attr: {
				groupTitle:			"data-group-title",
				portletTitle:		"data-portlet-title",
				tabSelected:		"data-selected"
			},
			defaultTab:				0
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}
		
		return wrap.each( function () {

//			fülek helyének kialakítása
			$(this).prepend("<ul class='" + o.class.tabs + "'></ul>");			// létrehozza az üres ul.tabs-ot

			var tabCounter = $(this).children("." + o.class.portlet).length;	// megszámolja a .portlet-eket
			var tabs = $(this).find("." + o.class.tabs);
			var portlets = $(this).children().siblings("." + o.class.portlet);
			var selectedTab = o.defaultTab;

//			elsőnek kiválasztott füll megadása ha a paraméter értelmezhető
			if ( $(this).attr(o.attr.tabSelected) !== undefined && $(this).attr(o.attr.tabSelected) >= 0 && $(this).attr(o.attr.tabSelected) < tabCounter ) {
				selectedTab = $(this).attr(o.attr.tabSelected);
			}

//			csoport címének megjelenításe ha van
			if ( $(this).attr(o.attr.groupTitle) !== undefined ) {
				$(this).prepend("<h1 class='" + o.class.groupTitle + "'>" + $(this).attr(o.attr.groupTitle) + "</h1>");
			}

//			portletek címének letiltása ha a paraméter értéke: "no", 0, "false"
			if ( $(this).attr(o.attr.portletTitle) == "no" || $(this).attr(o.attr.portletTitle) == 0 || $(this).attr(o.attr.portletTitle) == "false" ) {
				$(this).find("." + o.class.portletTitle).hide();
			}

			portlets.hide();													// minden portletet elrejt

			for ( var i = 0; i < tabCounter; i++ ) {
				//	létrehozza a portletek címével egyező tabokat
				tabs.append("<li><a href='#'>" + tabs.siblings("." + o.class.portlet).eq(i).find("." + o.class.portletTitle).text() + "</a></li>");
				if ( i == selectedTab ) {
					tabs.children().eq(i).addClass(o.class.tabSelected);		// aktív tab megjelölése
					portlets.eq(i).show();										// az aktív portlet megjelenítése
				}
				tabs.children().eq(i).on("click.esolr.esportlettab", function( e ) {
					e.preventDefault();
					var currentTab = $(this).index();
					$(this).siblings().removeClass(o.class.tabSelected);		// .selected eltávolítása a fülekről
					$(this).addClass(o.class.tabSelected);						// aktív tab megjelölése
					$(this).parent().siblings("." + o.class.portlet).hide()
						.eq(currentTab).show();									// megfelelő portlet megjelenítése
				});
			}
		});
	};

} (jQuery));;/*
	@desc		Responsive image loader for <img> tag or any other as background
	@ajaxload	tested
	@autoload	yes

	todo		tetszőleges számú töréspontot hozzáadni
	todo		egyelőre csak div konténerrel működik. Ha más elembe teszem, megszakad a script futása

*/


/*	Example

	<img src="small.png"
		 data-m-src="medium.png"
		 data-l-src="large.png"
		 data-xl-src="xlarge.png"
		 data-xxl-src="xxlarge.png"
		 class="js-responsive-img" />

	or

	 <div data-s-src="img/s.png"
		  data-m-src="img/m.png"
		  data-l-src="img/l.png"
		  data-xl-src="img/xl.png"
		  data-es-responsive
		  alt=""></div>
 */


(function ( $ ) {

	$.fn.esResponsiveImg = function ( options ) {

		var defaults = {
			dom_wrap:	"[data-es-responsive]",
			medium:		300,
			large:		600,
			xlarge:		900,
			xxlarge:	1200,
			attrM:		"data-m-src",
			attrL:		"data-l-src",
			attrXL:		"data-xl-src",
			attrXXL:	"data-xxl-src",
			s: {
				size:	300,
				attr:	"data-s-src"
			},
			m: {									// ez lesz majd a tetszőleges töréspont alapja, egyelőre nincs funkciója
				size:	300,
				attr:	"data-m-src"
			},
			l: {
				size:	600,
				attr:	"data-l-src"
			},
			xl: {
				size:	900,
				attr:	"data-xl-src"
			},
			xxl: {
				size:	1200,
				attr:	"data-xxl-src"
			},
			hiddenClass: {
				"-ms-filter":		"'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)'",
				"filter":			"alpha(opacity=0)",
				"-webkit-opacity":	"0",
				"-moz-opacity":		"0",
				"opacity":			"0"
			},
			URLRegExp: [
				[/'/g,"%27"],
				[/,/g,"%2C"],
				[/ /g,"%20"]
			]
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		//	az URLRegExp tömbben szereplő párokat végigcseréli, ezzel biztonságosabbá téve az URL-t
		function secureURL(URL) {

			if (!URL) { return false; }

			for (var i = 0; i < o.URLRegExp.length; i++) {
				URL = URL.replace(o.URLRegExp[i][0], o.URLRegExp[i][1]);
			}
			return URL;
		}

		return wrap.each( function () {

			var _img = $(this);
			var imgURLs = [_img.attr("src")||_img.attr(o.s.attr),
				_img.attr( o.m.attr ),
				_img.attr( o.l.attr ),
				_img.attr( o.xl.attr ),
				_img.attr( o.xxl.attr )];

			var parentBG = _img.attr("data-esolr-responsive") == "bg" || _img.attr("data-esolr-responsive") == "BG" ? true : false;
			var isImg = _img.attr("src") ? true : false;	// ellenőrzi, hogy img tag-e vagy bármi más


//			Ha hiányszik valamelyik töréspont, az egyel kisebb értékét veszi fel

			for ( var i = 1; i < imgURLs.length; i++ ) {
				if ( imgURLs[i] == undefined ) {			// ==
					imgURLs[i] = imgURLs[i-1];
				}
			}

			var previousWidth = _img.width();
			var previousStatus = 0;
			var currentStatus = 0;

//			Aktuális állás megállapítása

			switch ( true ) {
				case (previousWidth < o.medium):
					currentStatus = 0;
					break;
				case (o.medium <= previousWidth && previousWidth < o.large):
					currentStatus = 1;
					break;
				case (o.large <= previousWidth && previousWidth < o.xlarge):
					currentStatus = 2;
					break;
				case (o.xlarge <= previousWidth && previousWidth < o.xxlarge):
					currentStatus = 3;
					break;
				case (o.xxlarge <= previousWidth ):
					currentStatus = 4;
					break;
			}

//			Aktuális állás szerinti forrás betöltése ha img tag
			if (isImg) {
				_img.attr("src", imgURLs[ currentStatus ] );

//			Ha nem img tagről van szó, átemeli háttérképnek
			} else {
				_img.css({
					"background-image": "url(" + secureURL(imgURLs[ currentStatus ]) + ")"
				});
			}

//			Ha a hívó attribútum értéke "bg" vagy "BG", akkor átemeli a szülő elembe háttérképként
			if (parentBG && isImg) {
				_img.css(o.hiddenClass).parent().css({
					"background-image": "url(" + secureURL(imgURLs[ currentStatus ]) + ")"
				});
			}

//			Ablak méretének változására, helyes képméretek betöltése

			$(window).on("resize.esolr.responsive-img", function () {		// ha változik az event neve, akkor a slidernél is frissíteni!

				var currentWidth = _img.width();

				if ( currentWidth !== previousWidth ) {

					switch ( true ) {
						case (currentWidth < o.medium):
							currentStatus = 0;
							break;
						case (o.medium <= currentWidth && currentWidth < o.large):
							currentStatus = 1;
							break;
						case (o.large <= currentWidth && currentWidth < o.xlarge):
							currentStatus = 2;
							break;
						case (o.xlarge <= currentWidth && currentWidth < o.xxlarge):
							currentStatus = 3;
							break;
						case (o.xxlarge <= currentWidth ):
							currentStatus = 4;
							break;
					}
					previousWidth = currentWidth;
				}

				if ( currentStatus !== previousStatus ) {
					previousStatus = currentStatus;

//					Ha img tagről van szó
					if (isImg) {
						_img.attr("src", imgURLs[ currentStatus ] );

//					Ha nem img tagről van szó, átemeli háttérképnek
					} else {
						_img.css({
							"background-image": "url(" + secureURL(imgURLs[ currentStatus ]) + ")"
						});
					}

//					Átemelés háttérképként
					if (parentBG && isImg) {
						_img.parent().css({
							"background-image": "url('" + imgURLs[ currentStatus ] + "')"
						});
					}
				}
			});
		});
	};

	//	to apply on ajax loaded content
	$(document).on("ready.esolr.responsive-img ajaxComplete.esolr.responsive-img", function(){
		$.fn.esResponsiveImg();
	});

} (jQuery));;/*
	 Sets the height of an item to the same as the window.
	 Exceptions can be added as propery or parameter which decrease the height.

	 Usage with default method:

	 <div data-window-height> or <div data-window-height=".except, .except-2 > header, [data-except-3]">

	 <script>
		 $.fn.esSetWindowsHeight();
	 </script>

	 Usage with custom selector and parameter
	 „minus” array contains optional exceptions decreasing the height as jquery wrap

	 <div class="splash">

	 <script>
		 $(".splash").esSetWindowsHeight({
			 minus: [
			 ".main-header"
			 ]
	 });
 </script>

 */
(function( $ ) {

	$.fn.esSetWindowsHeight = function ( options ) {

		var defaults = {
			dom_wrap: "[data-window-height]",
			dom_minHeight_wrap: "[data-window-height-min]",
			minus: undefined
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		//	todo levizsgálni, hogy az elem bal felső pontja a képernyőn van-e vagy már elscrolloztuk-e, mert így furi ha az ablakmagasságot átméretezzük
		//	todo levizsgálni, hogy a benne lévő elemeknek mennyi az összmagassága és annál nem lehet kisebb;
		return wrap.each(function() {

			var item = $(this);
			var minusSum = 0;
			var minHeight = 0;

			//	remove attribute square brackets
			function ra( selector ) {
				var replaced = selector.replace(/\[/g, "").replace(/\]/, "");
				return replaced;
			}

			//	ha default o.dom_wrap alapján hívjuk és adunk meg kivételt
			if (item.is(o.dom_wrap) && item.attr(ra(o.dom_wrap)) !== "") {
				//	összeszámolja azoknak az elemeknek a magasságát, amik nem számítanak bele a magasságba (pl. fejléc stb.)
				$(item.attr(ra(o.dom_wrap))).each(function(){
					minusSum =+ $(this).outerHeight();
				});
			}

//				window.alert(item.attr("data-window-height-min"));
//				window.alert(item.is(o.minHeight));

			if (item.is(o.dom_minHeight_wrap) && item.attr(ra(o.dom_minHeight_wrap)) !== "") {
				minHeight = $(item.attr(ra(o.dom_minHeight_wrap))).outerHeight();
			}

			//	ha nem default o.dom_wrap alapján hívjuk és paraméterként adjuk át a kivételeket
			if (o.minus !== undefined) {
				$(o.minus.join()).each(function(){
					minusSum =+ $(this).outerHeight();
				});
			}

			$(window).on("resize.esolr.setheight", function(){

				var newHeight = $(window).height() - minusSum;

//					console.log(item.attr("class"), "Magasság:", item.outerHeight(), "Min:", minHeight, "Ablak:", $(window).height() - minusSum);
//					console.log("M: ", item.outerHeight(), "WH: ", $(window).height() - minusSum, "NEW: ", newHeight);

				item.outerHeight(newHeight);
				if (newHeight > minHeight) {
					item.outerHeight(newHeight);
				}
			});

			$(window).trigger("resize.esolr.setheight");
		});
	};

	$(document).ready(function(){
		$.fn.esSetWindowsHeight();
	});
}) (jQuery);;/*
	Show Items on scroll

	Ha elér a scroll addig a pontig, hogy egy elem megjelenik, akkor adott elemhez hozzárendel egy class-t,
	vagy default befade-el.

	todo	lekódolni
*/



(function ( $ ) {

	$.fn.esShowOnScroll = function( options ) {

		var defaults = {
			dom_wrap:	"data-es-videoload"
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		return wrap.each( function () {


		});
	};

	//	to apply on ajax loaded content
//	$(document).on("ready.esolr.tab ajaxComplete.esolr.tab", function(){
//		$.fn.esShowOnScroll();
//	});

} (jQuery));;/*
	@name:		Slider plugin for eSolr
	@version:		1.0
*/

/*
	Megjegyzés:
	A slider jobb és bal bármilyen léptetése esetén trigger-eli a responsive image újraszámolását,
	mert különben nem frissülnek azok a képméretek.
*/

(function ( $ ) {

	$.fn.esSlider = function ( options ) {

		var defaults = {
			dom_wrap:			"[data-es-fn='slider']",
			containerClass:		"portlet-content",
			currentClass:		"current",
			prevClass:			"pager-prev",
			nextClass:			"pager-next",
			prevHTML:			"<div class='pager-prev'><a href='#'>‹</a></div>",
			nextHTML:			"<div class='pager-next'><a href='#'>›</a></div>",
			counterClass:		"pager-counter",
			counterHTML:		"<ul class='pager-counter'></ul>",
			counterSubHTML:		"<li></li>",
			currentDefault:		0
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		return wrap.each( function () {

			var Slider = $(this);
			var Container = $(this).find("." + o.containerClass);
			var Current = Container.find("." + o.currentClass).index();
			var Counter = Container.children().length;

			//	csak akkor jelennek meg a vezérlők, ha több lapozható elem is van
			if ( Counter > 1 ) {

				//	ha nincs default érték megadva html-ben, a currentDefault értékét veszi fel (0)
				if ( Container.find("." + o.currentClass).index() < 0 ) {
					Current = o.currentDefault;
					Container.children().eq(o.currentDefault).addClass(o.currentClass);
				}

				Slider.append(o.prevHTML).append(o.nextHTML);												//	Adding pager buttons
				Slider.append().append(o.counterHTML);														//	Adding counter container
				for ( var i = 0; i < Counter ; i++ ) {																			//	Adding counter items
					Slider.find("." + o.counterClass).append(o.counterSubHTML);
					Slider.find("." + o.counterClass).children().eq(Current).addClass(o.currentClass);
					Slider.find("." + o.counterClass).children().eq(i).on("click.esolr.slider", function( e ) {
						e.preventDefault();
						$(this).parent().parent().find("." + o.containerClass).children().removeClass(o.currentClass).hide().eq($(this).index()).addClass(o.currentClass).show();
						$(this).parent().children().removeClass(o.currentClass).eq($(this).index()).addClass(o.currentClass);

						//	ha responsive image is van benne
						$(window).trigger("resize.esolr.responsive-img");
					});
				}
				Container.children().hide().eq(Current).show();																//	Show current content panel

				var _prev = Slider.find("." + o.prevClass);
				var _next = Slider.find("." + o.nextClass);

				_prev.on("click.esolr.slider", function( e ) {

					e.preventDefault();

					var Counter = Container.children().length;
					var Current = Container.find("." + o.currentClass).index();
					var prevSlide = (Current == 0) ? Counter - 1 : --Current;

					//	kiválasztja a megfelelő panelt
					$(this).parent().find("." + o.containerClass).children().removeClass(o.currentClass).hide().eq(prevSlide).addClass(o.currentClass).show();
					//	beállítjaa megfelelő countert
					$(this).parent().find("." + o.counterClass).children().removeClass(o.currentClass).eq(prevSlide).addClass(o.currentClass);

					//	ha responsive image is van benne
					$(window).trigger("resize.esolr.responsive-img");
				});

				_next.on("click.esolr.slider", function( e ) {

					e.preventDefault();

					var Counter = Container.children().length;
					var Current = Container.find("." + o.currentClass).index();
					var nextSlide = (Current == Counter - 1) ? 0 : ++Current;

					//	kiválasztja a megfelelő panelt
					$(this).parent().find("." + o.containerClass).children().removeClass(o.currentClass).hide().eq(nextSlide).addClass(o.currentClass).show();
					//	beállítjaa megfelelő countert
					$(this).parent().find("." + o.counterClass).children().removeClass(o.currentClass).eq(nextSlide).addClass(o.currentClass);

					//	ha responsive image is van benne
					$(window).trigger("resize.esolr.responsive-img");
				});

			}
		});
	};
} (jQuery));;/*
	@name:		Slider pro plugin for eSolr
	@version:	1.0

	todo		slider létrehozása után törölni a portletet
	todo		lekezelni, hogy van-e kép, mekkora a minimum magasság
	done		kapcsolható thumbnail
	todo		automatikus betöltés?
	todo		preloader: true|false
	todo		a thumbnailek szélességét automatára állítani [minimum és maximum szám]
	todo		mi van ha túl sok a thumbnail? thumbnailOverflow: enabled|disabled
	todo		navigációs bogyókák generálása
	todo		Play/Pause button true|false
	todo		a nagy kép rálinkelése a valamelyik elemre, mert alapból azt nem viszi magával
*/

/*
	Megjegyzés:
	A slider jobb és bal bármilyen léptetése esetén trigger-eli a responsive image újraszámolását,
	mert különben nem frissülnek azok a képméretek.
*/

(function ( $ ) {

	$.fn.esSliderPro = function ( options ) {

		/*
		Azonosítani

			1) egy konténert, amin belül az ismétlődő elemek vannak (.portlet-content) > ebből lesz a tartalom
			2) a képeket vagy azok konténerét > ebből lesz a háttérkép, a többit a helyén hagyja

		Mechanizmus

			A konténer(ek)-ből az elemeket az új helyükre másolom különválasztva a háttérképeket
			a szöveges tartalmaktól és
			A dom_wrap-en belüli elemeket azonnal elrejtjük!!! Így nem lesz a kellemetlen villódzás.

		Beállítani

			1) az első állapotot ha van kezdőérték, vagy ha nincs (.selected)
			2) autoloop be/ki
				a) loop hosszát [szám]
				b) timer be/ki
					• timer típusát (töltőcsík, számláló stb.)
				c) overStop be/ki – megáll-e rolloverre
			3) thumbnail be/ki
				a) thumbnail szélességét 100% / megjelenített elemre
				b) thumbnail-re hint?, szöveg?
			4) állapot pontok be/ki

		Lekezelni
			1) ha csak egy elem van
			2) maximum elemek számát
			3) a maximálisan megjelenített elemek számát, ami nem kell, hogy egyenlő legyen a 2-vel
		*/
		/*
			Állapotok
			• current [szám]
			• áttűnés effekt [fade, slide, cube stb]
			• preloader (?)
		*/



		var defaults = {
			dom_wrap:			"[data-es-fn='sliderpro']",
			portlet_wrap:		".portlet",
			container_wrap:		".portlet-content",
			img_wrap:			".entry-featured",
			content_wrap:		".entry-content",

			currentClass:		"current",	// van különbség?

			set: {
				loop: {
					label:		"Looping",
					status:		true,
					length:		3000
				},
				thumbnail: {
					label:		"Thumbnails",
					show:		false
				},
				counter: {
					label:		"Counter",
					show:		false			// még inaktív
				},
				timer: {
					label:		"Timer visibility",
					show:		false			// még inaktív
				},
				effect:	{
					label:		"Slider effect",
					type:		"none",			// none, dissolve, slide, class
					length:		2000			// length in ms
				},
				navigation: {
					label:		"Navigation elements",
					show:		true
				},
				pause: {
					label:		"Play/Pause button",
					show:		false			// még inaktív
				}
			},

			slider: {
				wrap: {
					html:		"<div></div>",
					class:		"portlet slider",
					attr:		""
				},
				scene: {
					wrap: {
						html:	"<div></div>",
						class:	"slider-scene",
						attr:	""
					},
					item: {
						html:	"<div></div>",
						class:	"slider-scene-item",
						attr:	""
					}
				},
				pager: {
					prev: {
						html:	"<a href='#'>‹</a>",
						class:	"slider-pager slider-pager-prev",
						attr:		""
					},
					next: {
						html:	"<a href='#'>›</a> ",
						class:	"slider-pager slider-pager-next",
						attr:		""
					}
				},
				counter: {
					html:		"<ul></ul>",
					class:		"slider-counter",
					attr:		"",
					item: {
						html:	"<li></li>",
						class:	"slider-counter-item",
						attr:		""
					}
				},
				thumb: {
					wrap: {
						html:	"<div></div>",
						class:	"slider-thumb",
						attr:	""
					},
					item: {
						html:	"<div></div>",
						class:	"slider-thumb-item",
						attr:	""
					}
				},
				timer: {
					html:		"<div></div>",
					class:		"slider-timer",
					attr:		"",
					progress: {
						html:	"<div></div>",
						class:	"slider-timer-progress",
						attr:		""
					}
				},
				play: {
					html:		"<div>play</div>",
					class:		"slider-playpause slider-play",
					attr:		""
				},
				pause: {
					html:		"<div>pause</div>",
					class:		"slider-playpause slider-pause",
					attr:		""
				}
			}
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		return wrap.each( function () {

			var sliderFn = $(this);											// alap wrapper
			var sourcePortlet = $(this).find(o.portlet_wrap);				// forrás portlet azonosítása
			var sceneSource = sliderFn.find(o.container_wrap).children();	// ezek maguk a slider scene feldolgozandó elemei
			var slider;														// generált slider (lesz)
			var scenes;														// scene konténer
			var sceneLength;												// scene-ek száma
			var	thumbs;														// thumbnailek konténer
			var current;													// az aktuálisan kiválasztott elem
			var looping;													// setInterval változója


			//	Alapleképezés legenerálása
			function init() {

				/*
					Létrehozás sorrendje:
					1. létrehozza a scene containert
					2. létrehozza a scene-item-et
					3. klónozza a forrásképet a scenébe
					4. bemozgatja a forrástartalmat a scenébe
					5. bemozgatja a forrásképet a thumbnailbe
				*/

				slider = $(o.slider.wrap.html).addClass(o.slider.wrap.class);
				thumbs = $(o.slider.thumb.wrap.html).addClass(o.slider.thumb.wrap.class);

				sliderFn.prepend( slider.append(function(){

					//	a scene-eket egy konténerben adja vissza
					return $(this).append( $(o.slider.scene.wrap.html).addClass(o.slider.scene.wrap.class).append(function(){

						var scenesArray = [];	// ebbe gyűlnek az átpakolandó scene elemek

						//	feltöltődik a scenesArray táblázat a létrehozandó elemekkel
						sceneSource.each(function(){
							//	fetch the img_wrap and content_wrap and adds to scene-item
							scenesArray.push($(o.slider.scene.item.html).addClass(o.slider.scene.item.class)
								.append($(this).find(o.img_wrap).clone())
								.append($(this).find(o.content_wrap)).hide());
						});

						//	scene-ék száma
						sceneLength = scenesArray.length;

						return scenesArray;
					}) );

				}).append(thumbs.append(function(){

						var images = [];	// ebbe gyűlnek az átpakolandó image elemek

						//	feltöltődik az images táblázat a képek klónjaival ha be van kapcsolva a thumbnailek megjelenítése
						if (o.set.thumbnail.show) {
							sceneSource.each(function(){
								images.push(
									$(o.slider.thumb.item.html).addClass(o.slider.thumb.item.class)
										.append($(this).find(o.img_wrap)
											.on("click.esolr.sliderpro", function(e){
												e.preventDefault();
												setCurrent($(this).parent().index());		//	az aktuális indexnek megfelelő
												loopStop();
											})).css("width", (100 / sceneLength) + "%")
								);
							});
						} else {
							images = "";
						}

						return images;
					}))
				);


				//	a létrehozott scene konténer azonosítása
				scenes = slider.find("." + o.slider.scene.wrap.class);

				//	lapozógombok megjelenítése
				if (o.set.navigation.show && sceneLength > 1) {

					slider.append($(o.slider.pager.prev.html).addClass(o.slider.pager.prev.class).on("click.esolr.sliderpro", function(e){
							e.preventDefault();
							loopStop();
							//	a loop miatt mindig + 1, ezért a bal gombra nem csinálna semmi, amit így megelőzhetünk
							if (looping !== undefined) {
								setCurrent(current - 2);
							} else {
								setCurrent(current - 1);
							}
							looping = undefined;

						})).append($(o.slider.pager.next.html).addClass(o.slider.pager.next.class).on("click.esolr.sliderpro", function(e){
							e.preventDefault();
							loopStop();

							//	a loop miatt mindig + 1, ezért a jobb gombra kettőt ugrana, amit így megelőzhetünk
							if (looping !== undefined) {
								setCurrent(current);
							} else {
								setCurrent(current + 1);
							}
							looping = undefined;
						}));
				}

				//	todo beépíteni
				//	play/pause button
				if (o.set.pause.show) {

					var pauseButton = $(o.slider.pause.html).addClass(o.slider.pause.class).on("click.esolr.sliderpro", function(e){
						e.preventDefault();
						loopStop();
					});

					var playButton = $(o.slider.play.html).addClass(o.slider.play.class).on("click.esolr.sliderpro", function(e){
						e.preventDefault();
						loopStart();
					});

//					slider.append( pauseButton );

//					if (o.set.navigation.show) {
//						slider.find("." + o.slider.pager.prev.class).after( pauseButton );
//					}
				}

				//	forrás portlet törlése
				sourcePortlet.remove();

				//	Működés indítása a paramétereknek megfelelően.
				//	Ha a loop be van kapcsolva, akkor beállítja a kezdőt és indítja a loopot
				if (o.set.loop.status) {
					setCurrent();
					loopStart();
				} else {
					setCurrent();
				}
			}


			//	Beállítja az aktuális állapotot
			function setCurrent(number) {


				//	az aktuális állapot beállítása lekezelve a túlcsordulásokat is
				switch (true) {
					case (number == undefined):
						current = 0;
						break;
					case (number < 0):
						current = sceneLength - 1;
						break;
					case (0 <= number && number < sceneLength):
						current = number;
						break;
					case (sceneLength <= number):
						current = 0;
						break;
				}

				//	megfelelő slide beállítása
				scenes.children().removeClass(o.currentClass).eq(current).addClass(o.currentClass);

				//	megfelelő thumbnail beállítása
				thumbs.children().removeClass(o.currentClass).eq(current).addClass(o.currentClass);

				switch (o.set.effect.type) {
					case "none":
						scenes.children().hide().eq(current).show();
						break;
					case "dissolve":
						scenes.children().fadeOut(o.set.effect.length).eq(current).fadeIn(o.set.effect.length);
						break;
					case "slide":
						//	todo megcsinálni slide-olósra
						break;
					case "class":
						//	todo megcsinálni class cserélgetősre
						break;
				}

				//	ha responsive image is van benne
				$(window).trigger("resize.esolr.responsive-img");
			}

			function loopStart() {
				looping = setInterval(function(){
					current++;
					setCurrent(current);
				}, o.set.loop.length);
			}

			function loopStop() {
				clearInterval(looping);
			}

			init();

			//	csak akkor jelennek meg a vezérlők, ha több lapozható elem is van

		});
	};
} (jQuery));;/*
	Sticky footer

	If the content part is not long enough the footer to reach the bottom of the page,
	sticky footer keeps it there.

	todo	lekódolni
	todo	azonosítani mit szeretnénk stickyvé tenni
	todo	azonosítani mihez képest (default az előző elem lehet, hm?)
*/



(function ( $ ) {

	$.fn.esStickyFooter = function( options ) {

		var defaults = {
			dom_wrap:	"data-es-stickyfooter"
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		return wrap.each( function () {


		});
	};

	//	to apply on ajax loaded content
//	$(document).on("ready.esolr.tab ajaxComplete.esolr.tab", function(){
//		$.fn.esTab();
//	});

} (jQuery));;/*
	Sticky header
*/



(function( $ ) {

	$.fn.esStickyHeader = function ( options ) {

		var defaults = {
			fixed: {
				css: {
					position:	"fixed",
					width:		"100%",
					top: 0,
					left: 0,
					"z-index":	99999
				},
				class: ""				// when scroll even is triggered these classes will be added for the time of scrolling (e.g. .has-shadow etc.)
			},
			blank: {
				html: "<div></div>",
				css: {
					display: "block"
				}
			},
			start: 0					// ennél az y scrolltop koordinátánál aktiválódik, addig simán görget
		};

		var o = $.extend(true, defaults, options);

		return this.each(function() {

			var fixedItem = $(this);
			var _height = fixedItem.height();
			var _is_blank = false;
			var _top;

			$(window).on("scroll", function(){
				if (!_is_blank && $(window).scrollTop() > o.start) {
					fixedItem.after(o.blank.html).next().css(o.blank.css).height(fixedItem.height());
					fixedItem.css(o.fixed.css).toggleClass(o.fixed.class);
					_top = fixedItem.next().offset().top;
					_is_blank = true;
				} else {
					if ($(window).scrollTop() <= o.start && _is_blank) {
						fixedItem.next().remove();
						fixedItem.css("position", "static").toggleClass(o.fixed.class);
						_top = undefined;
						_is_blank = false;
					}
				}
			});

			//	ellenőrzi, az átméretezés változta-e a magasságán
			$(window).on("resize", function(){
				_height = fixedItem.height();
			});
		});
	};
}) (jQuery);;/*	Example

	<a href="#" class="js-switch" data-switch-target=".mobile">Toggle mobile menu</a>
	...
	<nav class="mobile">
		<ul>
			<li>menu1</li>
			<li>menu2</li>
			<li>menu3</li>
		</ul>
	</nav>
*/


(function ( $ ) {

	$.fn.esSwitch = function ( options ) {

		var defaults = {
			dom_wrap:	"[data-switch-target]",
			targetAttr:	"data-switch-target"
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		return wrap.each( function () {

			var menuButton = $(this);
			var targetClass = menuButton.attr(o.targetAttr);

			menuButton.on("click.esolr.esswitch", function( e ) {

				e.preventDefault();

				$(targetClass).each( function() {

					var toggleItem = $(this);

					if (toggleItem.is(":hidden") ) {
						toggleItem.show();
					} else {
						toggleItem.hide();
					}
				});
			});
		});
	};

} (jQuery));;/*
	Füles plugin

	Követelmények:
	A fülek egy „konténerben” kell legyenek. Pl.: ul > li; div > a; vagy akár span > span
	A fülekhez tartozó panelek is egy konténerben kell legyenek. Pl.: ul > li; div > div; span > span etc.
	A tartalom konténer a fül konténerrel egy szinten kell legyen vagy alatta bárhol.
	A fül- és a tartalom konténer nem kell, hogy kövessék egymást.
	Plugin hívásánál a fül konténerét kell azonosítani.

	Szükséges class-ok
	* A fül konténernek nem kell a plugon szempontjából, lehet akár pseudo class de sima class vagy id is.
	* Kell egy aktív fület jelző class,
	* ami alapból .selected
	* Kell egy tartalom konténert azonosító class, hogy bárhol lehessenek egymáshoz képest,
	* ami alapból .tab-panels
*
* */

//	TODO automatikusan váltakozó füleket belőni
//	TODO url hivatkozást is bekötni, hogy adott fül tartalmára is hivatkozhassunk
//	TODO eseményeket létrehozni: tab megjelenítése, tab elhagyása


(function ( $ ) {

	$.fn.esTab = function( options ) {

		var defaults = {
			dom_wrap:			".tabs",
			selectedClass:		"selected",
			containerClass:		"tab-panels",
			disabledClass:		".disabled",
			animating:			false,
			looping:			false,
			setUniqueID:		false,

			animate: {
				type:			"none"		// [none, fade]
			},

			loop: {
				timer:			3000	// ms
			}
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		return wrap.each( function () {

			var tabs = $(this);

			//	Ha nincs default érték, az első fület állítja br
			if (tabs.children("." + o.selectedClass).length == 0) {
				tabs.children().eq(0).addClass(o.selectedClass);
			}

			tabs.parent()
				.find( "." + o.containerClass + "," + "#" + o.containerClass ).children().hide()
				.eq( tabs.children( "." + o.selectedClass ).index() ).show();

			//	if button not disabled click event will be binded
			$(this).children().not(o.disabledClass).on("click.esolr.tab", function (e) {

				e.preventDefault();
				var tab = $(this);

				tab.siblings().removeClass( o.selectedClass )
					.end().addClass( o.selectedClass )
					.parent().parent().find( "." + o.containerClass ).children().hide()
					.siblings().eq( tab.index() ).show();
			});
		});
	};

	//	to apply on ajax loaded content
	$(document).on("ajaxComplete.esolr.tab", function(){
		$.fn.esTab();
	});
//	$(document).on("ready.esolr.tab ajaxComplete.esolr.tab", function(){
//		$.fn.esTab();
//	});

} (jQuery));;/*
	@name:		Class toggle with multiple classes
	@version:	1.0

	Example

	toggle this:
	<div class="container">Search</div>

	with this:
	<a href="#" data-toggle-target=".container" data-toggle-class=".open">Toggle</a> – [data-switch-target=".container"][data-switch-class=".open"]<br/>

	using this:
	$("[data-toggle-target]").esToggle({});

	@todos
			todo a targetet data-jquery-target-tel kiegészíteni
*/



(function ( $ ) {

	$.fn.esToggle = function ( options ) {

		var defaults = {
			dom_wrap:		"[data-toggle-target]",
			targetClass:	"data-toggle-target",
			toggledClass:	"data-toggle-class"
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		// Removes selector prefix (. and #) if exists.
		function r( selector ) {
			var replaced = selector.replace(/\./g, "").replace(/\#/, "");
			return replaced;
		}

		return wrap.each( function () {

			$(this).on("click.esolr.estoggle", function( e ) {

				e.preventDefault();
				var sourceButton = $(this);

				$( sourceButton.attr(o.targetClass) ).each( function() {
					$(this).toggleClass(r(sourceButton.attr(o.toggledClass)));
				});
			});
		});
	};

} (jQuery));;/*
	@desc		Vertical align: middle
	@ajax
	@tested

	todo		kapcsolhatóvá tenni, hogy akkor is igazítson középre, ha a szülő már kisebb mint az igazítandó elem
*/

/*
	Research
*/


/*
	A data-valign-middle elemet függőlegesen középre igazítja a konténerében
	ha a fenti paraméternek egy mértkegység nélküli számot adok meg,
	az adott képett annyi pixellel tolja fel vagy le a középponthoz képest

	Example
	<div data-window-height=".except-these-items" data-window-height-min=".content-shouldnt-shorter-than-this">
		<div class=".content-shouldnt-shorter-than-this">...</div>
	</div>
*/

(function( $ ) {

	$.fn.esValignMiddle = function( options ) {

		var defaults = {
			dom_wrap: "[data-valign-middle]",
			overflow: "[data-valign-overflow]"
		};

		var o = $.fn.extend(true, defaults, options);
		var wrap = this;

		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		//	remove attribute square brackets
		function ra( selector ) {
			var replaced = selector.replace(/\[/g, "").replace(/\]/, "");
			return replaced;
		}

		return wrap.each(function(){

			var item = $(this);

			$(window).on("resize.esolr.esvalignmiddle", function(){
				if (item.parent().height() - item.outerHeight() > 0) {
					item.css("top", (item.parent().height() - item.outerHeight()) / 2 + Number(item.attr(ra(o.dom_wrap))));
				}
			});

			$(window).trigger("resize.esolr.esvalignmiddle");
		});
	};

//	$(document).on("ready.esolr.esvalignmiddle", function(){
//		$.fn.esValignMiddle();
//	});

}) (jQuery);;/*
	Video loader

	A videó tartalmaknál ki lehet választani, hogy mi történjen:
	1. a videó beágyazva jelenjen meg,
	2. a videó teasere jelenjen meg, majd rákattintva a videó maga
	3. a videó modal vindow-ban jelenik meg

	Az alábbi pici script lecserél egy teaser képet egy videó beágyazásra.
	Előnyben részesített formátumok: vimeo, youtube, indexvideo

 	todo	lekódolni
*/



(function ( $ ) {

	$.fn.esVideoLoader = function( options ) {

		var defaults = {
			dom_wrap:	"data-es-videoload"
		};

		var o = $.extend(true, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		return wrap.each( function () {


		});
	};

	//	to apply on ajax loaded content
//	$(document).on("ready.esolr.tab ajaxComplete.esolr.tab", function(){
//		$.fn.esVideoLoader();
//	});

} (jQuery));;/*
	DOM item visibility setting
*/

(function($){

	$.fn.esVisible = function(partial,hidden){

		var $t				= $(this).eq(0),
			t				= $t.get(0),
			$w				= $(window),
			viewTop			= $w.scrollTop(),
			viewBottom		= viewTop + $w.height(),
			_top			= $t.offset().top,
			_bottom			= _top + $t.height(),
			compareTop		= partial === true ? _bottom : _top,
			compareBottom	= partial === true ? _top : _bottom,
			clientSize		= hidden === true ? t.offsetWidth * t.offsetHeight : true;

		return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop));
	};

})(jQuery);