/*
 Makes a select autocomplete

 Inputok:
 1. select tartalma
 2. generált json átadva üres selectnek, eredmények visszaírva selectbe
 3. kintről felszippantott json kattintásra, üres selectnek, eredmények visszaírása selectbe

 ------------
 Leírás

 Forrás:
 Az autocomplete egyelőre csal selecttel működik. Három forrásból szippantja fel:
 • forrásból a select option-jeit felhasználva,
 • json formátumú változóból
 • azonos szerverről hívott json-ból

 Két állása lehet:
 • normál – sima select –, vagy
 • multiple.
 Utóbbi esetén a kiválasztott elemek tagként jelennek meg.
 Ha a select inputja maga a forrás, akkor a select változásai tükrözése kerülnek a virtuális selectből a selected property megjelölésével.
 Ha a select tartalma úgy került betöltésre változóból vagy jsonból, akkor egyrészt a benne lévő tartalom törlésre kerül és a selectbe csak
 a form postolásához szükséges option-ök kerülnek átvezetése megjelölve őket a selected propery-vel.

 Elvárt objektumnevek

 Események
 Változások esetén a forrás selecten elsüti a change() event-et.

 Research:
 http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes

 todo kapcsolhatóvá tenni, hogy a nem létező elemeket újként adja hozzá a listához (tageknél kifejezetten kell)
 todo disabled attribútumot lekezelni!
 done copy style
 done copy class
 todo ha az első elem üres, akkor a form is üres, ha az első elemnek van értéke, akkor legyen az az első > vagy ezt paraméterezni
 todo sima selectre is működjön, hogy módosítoom az id-t, mert pl nem a value-ba teszem a cuccokar
 todo showFirstAsDefault kellene, hogy a legelsőt is mint opciót mutassa
 todo showFirstEmpty, amikor manuálisan betenne egy üres elemet a tetejére
 todo törlés gombot normál select viselkedéshez
 done a focus-szal egyszerre az ac-select is kapjon egy focus class-t
 done ha multiple ÉS saját a forrás, akkor a selectbe való visszaírást le kell kezelni!
 done betöltéshez class rendelés, hogy látványosabb lehessen az állapot
 todo ha van value nélküli első elem, azt ne is emelje át!
 todo sima selectnél lehessen beállítani olyat is, hogy „egyik sem”, ami legelsőként épül be!
 todo lekezelni az értékkel rendelkező, de megjelenítés nélkli elemeket
 todo a keresés indítását eseménykezelőhöz kötni, hogy a gépelést ne fogja meg
 todo tömb sorbarendezés
 todo tömb bontás abc szerinti résztömbökre
 todo disabled állapot lekezelése select alapján
 todo hoverre ne a hovert állítsa, hanem a rendes highlightot, amit billentyűütésre csekkoljunk, jó helyen van-e
 done a select legenerálását szétválasztani a tartalommal való feltöltéstől > lehessen kezelni a betöltés eseményt
 todo ha az alap select NEM multiple, akkor a generált select sem lehet az, mert a visszaírás nem fog működni! ha az alap input, akkor ez nem gond
 done select visszaíráskor triggelni rajta egy onChange-et
 todo összekötés több mezőn keresztüli szűréshez (egyik eredménye alapján módosul a következő)
 todo már betöltött ac_select tartalmának frissítése|resetelése
 done tag törlése x-szel
 todo megadni mi legyen a target (input és akkor hogy szerparálja az eredményeket) vagy select
 done szippantsa fel a selected elemeket a selectből
 done kezdőérték megadás
 todo valós idejű beleírás lehetősége
 todo csak szókezdő egyezés|bárhol egyezés
 todo késleltetés
 todo lista fel/lenyílás pozíciótól függően
 todo mobil megjelenés
 todo opt groupos/kétszintű feldolgozás > kétszintű json feldolgozás
 todo átvenni a select szélesség beállításait
 todo maximális magasságot megadni listaelemszámban
 done a select feletti klikkelést – inputWrap
 todo alternatív outputot megadni és abba milyen módon generálja a listát
 */

(function ( $ ) {

	$.fn.autoComplete = function ( options ) {

		var defaultOptions = {
			id:					"id",					// string|number – az option value érték alapértelmezett elvárt objektumneve
			text:				"text",					// string|number – az option-ben megjelenített szöveg alapértelmezett elvárt objektumneve
			placeholderLoading:	"loading...",
			placeholder: 		"",						// input placeholder szöveg
			minimumCaracter:	0,						// minimum karakterszám, ami után elkezd szűrni
			typeDelay: 			300,					// billentyűleütés utáni késleltetés ms-ban
			typeRepeat: 		300,					// hány mp-enként ellenőrizze a begépelt stringet a szűrő algoritmus
			multiple:			false,					// true|false – az alap select alapján állítja be
//			caseSensitive:		false,					// ture|false – egyezésnél számítson-e a kis és nagybetű
			preload:			true,					// true|false – ha true, akkor a dokival együtt töltődik be, false esetén kattintásra
			firstLetterMatch:	false,					// true|false – szó eleji egyezés
			preSelected:		[],						// ha az inputban van egyezés, akkor ezeket megjelöli. Ha több adat van és a select nem multiple, akkor csak az elsőt
			filterEmptyValues:	true,					// true|false – kiszedi az value nélküli vagy üres value-val rendelkező elemeket elemeket
			copyClass:			true,					// true|false – átveszi a selector class tartalmát
			copyStyle:			true,					// true|false – átveszi a selector style tartalmát
			data: {
				src:			undefined,
				dataType:		"object"				// object|array
			},
			json: {
				src:			undefined,
//				type:			"json",					// json|jsonp
				dataType:		"object"				// object|array
			},
			selectors: {
				wrapID:					"ac-select-",
				wrapClass:				"ac-select",
				multiWrapClass:			"ac-select-multi-wrap",
				tagWrapClass:			"ac-select-tag-wrap",
				inputWrapClass:			"ac-select-input-wrap",
				multiTagClass: 			"ac-select-tag",
				multiTagTextClass: 		"ac-select-tag-text",
				multiTagRemoveClass: 	"ac-select-tag-remove",
				multiTagRemoveHTML: 	"×",
				inputClass:				"ac-select-input",
				inputFieldClass:		"ac-select-input-field",
				listClass:				"ac-select-list",
				hiddenSelectClass:		"ac-hidden-select",
				showClass:				"ac-show",
				multipleClass: 			"ac-select-multiple",
				multipleSelectedHide: 	"ac-multi-hide",		// ez az a hide, amikor multiple selectben a listából el akarom tüntetni
				listHighlight: 			"ac-select-hl",
				selectFocus: 			"ac-select--focus",
				loadingClass:			"ac-select-loading"
			}
		};

		var wrap = $(this),
			selectorType = this.selector.substr(0,1),	// selector típusa, de szinte felesleges, mert csak id lehet
			selectID = this.selector.substr(1);			// selector neve; később ez belekerül az egyedi azonosítókba

		return wrap.each(function() {

			var o = $.extend(true, {}, defaultOptions, options),
				selectItem = $(this),					// kiválasztott select
				selectWrap,								// létrehozott virtuális automplete-es select wrappere
				selectMultiWrap,
				selectTagWrap,
				selectInput,
				selectInputWrap,
				selectInputField,
				selectList,
				selectListItems,
				current,								// billentyűn való lépdelés aktuális pozíciója a fileterdList-en belül
				data = [],								// json formátumú tömb
				dataList = [],							// html lista tömbje
				selectedData = [],						// ebbe gyűlnek a kiválasztott értékpárok
				filteredList,							// a billentyűzetről való lépdeléshez kell egy aktuális szűrt lista
				keyPressTimer,							// a billentyű leütése után mennyivel indítson keresést. Ha ennél gyorsabban gépelünk, a timert lenullázza
				inputValPrevious,
				inputValCurrent,
				charCounter;							// filternél char counter


			// Alapbeállítások -----------------------------------------------------------------------------------------

			// selector elrejtése, hogy ne legyen „pislogás”
			selectItem.addClass(o.selectors.hiddenSelectClass);

			// multiselect beállításe az eredeti select alapján
			o.multiple = selectItem.prop("multiple");

			// ha nem külső forrásból töli be a json-t, akkor nem jelenik meg a betöltő szöveg
			if (!o.json.src && !o.data.src) {
				o.placeholderLoading = o.placeholder;
			}

			// Feldolgozás ---------------------------------------------------------------------------------------------

			// kiüríti a select tartalmát, akármi is volt benne
			function emptySelect() {
				selectItem.empty();
			}


			// kezdő adatokkal való feltöltés
			function setPreselected() {

				if (o.preSelected.length > 0) {

					// ha nem multiple, de több elem van megadva, akkor csak a tömb első eleme maradjon, a többi törlésre kerül
					if (!o.multiple) {
						o.preSelected.splice(1);
					}

					for (var i = 0; i < o.preSelected.length; i++) {
						selectListItems.filter("[data-value='" + o.preSelected[i] + "']").first().trigger("mousedown");		// mousemove amiatt, mert az elemeken is ezt az eseményt kapja el
					}
				}
			}


			// külső fileból betölti a json tartalmát és elindítja a feldolgozást
			function loadData() {

				initACSelect();							// lista legenerálása html string alapján

				$.getJSON(o.json.src, function (data) {
					dataToHTML(data);					// átalakítás html stringgé (tömb)
					generateList();
					setEvents();						// általános eseménykezelők beállításe
					setSelectEvents();					// lista elmeinek eseménykezelője
					setPreselected();					// ha vannak indítóelemek kiválasztva, akkor azokat beteszi
				});
			}


			// json formátumú tömbből html listát generál
			function dataToHTML(dataArray) {

				if (dataArray.length > 0) {
					for (var i = 0; i < dataArray.length; i++) {
						dataList.push("<li data-value='" + dataArray[i][o.id] + "'>" + dataArray[i][o.text] + "</li>")
					}
				}
			}


			// a sima select tartalmából html listát generál
			function selectToHTML() {

				if (selectItem.find("option").length > 0) {
					selectItem.find("option").each(function() {
//							data.push({"id": this.value, "text": this.text })											// select alapján készít egy jsont
						dataList.push("<li data-value='" + this.value + "'>" + this.text + "</li>")						// select alapján leképez egy html listát
					});
				}
			}


			// legenerálja a html string (tömb) alapján a listát
			function initACSelect() {

				o.selectors.wrapID = selectorType + o.selectors.wrapID + selectID;										// egyedi ac_select-esített id, amibe belefűzi az eredeti id-t is

				// ac_select_multiple
				selectWrap = $("<div/>").attr("id", o.selectors.wrapID).addClass(function() {
					var classes = o.selectors.wrapClass;
					if (o.multiple == true) { classes += " " + o.selectors.multipleClass}								// ha multiple, akkor az ac_select kap egy plusz class-t is
					if (o.copyClass) {
						classes += " " + selectItem.attr("class").toString().replace(o.selectors.hiddenSelectClass, "");// ha engedélyezve van, akkor a select classait átemeli a generált selectre
					}
					return classes;
				}).attr("style", function() {
					if (o.copyStyle) {
						return selectItem.attr("style");
					}
				});

				// kijön
//				selectMultiWrap = $("<div/>").addClass(o.selectors.multiWrapClass);

				selectWrap.addClass(o.selectors.loadingClass);															// loading class hozzárendelve
				selectInput = $("<div/>").addClass(o.selectors.inputClass);
				selectTagWrap = $("<ul/>").addClass(o.selectors.tagWrapClass);
				selectInputWrap = $("<div/>").addClass(o.selectors.inputWrapClass);
				selectInputField = $("<input/>").attr({"placeholder": o.placeholderLoading}).addClass(o.selectors.inputFieldClass);
				selectList = $("<ul/>").addClass(o.selectors.listClass);

				if (o.multiple) {
					selectItem.after( selectWrap.append( selectInput.append( selectTagWrap).append( selectInputWrap.append( selectInputField ) ) ).append( selectList ) );				// az új listaelemek beágyazása
				} else {
					selectItem.after( selectWrap.append( selectInput.append( selectInputField ) ).append( selectList ) );				// az új listaelemek beágyazása
				}
			}


			// a betöltött json vagy változó alapján html lista generálása
			function generateList() {
				selectList.html( dataList.join("") );
				selectListItems = selectList.children();
				selectWrap.removeClass(o.selectors.loadingClass);
				selectInputField.attr("placeholder", o.placeholder);
			}


			// eseménykezelők definiálása
			function setEvents() {

				// billentyűlenyomásra vár

				$(window).on({
					keydown: function (e) {
						// esc – bezárja a listákat és leveszi a fókuszt az inputról
						if (e.keyCode == 27) {
							selectList.removeClass(o.selectors.showClass);
							selectInputField.blur();
							inputWatcherStop();
						}
					}
				});

				selectWrap.on("click", function() {
						selectInputField.focus();
					});

				selectList.on({
					mousemove: function(e) {
//						selectListItems.removeClass(o.selectors.listHighlight);	// hogy ne legyen egyszerre két highlight
					}
				});

				selectInputField.on({
					click: function (e) {
						e.stopPropagation();
						selectList.addClass(o.selectors.showClass);
					},
					keydown: function (e) {

						if (!filteredList) {
							filteredList = selectListItems.not("." + o.selectors.listHighlight);
							current = 0;
						}

						// lista kinyitása ha még nem volna nyitva ha a billentyű nem: shift, backspace (8), tab (9), ctrl (17), alt (18), capslock (20), del (46), bal cmd/win (91), jobb cmd (93)
						if (!e.shiftKey && [8, 9, 17, 18, 20, 46, 91, 93].indexOf(e.keyCode) < 0) {
							selectList.addClass(o.selectors.showClass);
						}

						// backspace – tag-et töröl ha üres az input és van tag
						if (e.keyCode == 8 && selectInputField.val() == "" && selectTagWrap.children().length > 0) {
							removeTag( selectTagWrap.children().last() );
						}

						// tab esetén
						// todo ha már volt kiválasztva és úgy ugrunk, akkor dupla kiemelés lesz, meg kell szüntetni
						if (e.keyCode == 9 || e.shiftKey && e.keyCode == 9) {

							// sima select esetén tabra kiválasztja az aktuális állapotot, multiple estén csak ugrik a következőre
							if (!o.multiple) {
								listItemSelected( filteredList.filter("." + o.selectors.listHighlight).first() );			// a highlighttal rendelkezőt hozzáadja
							}
							inputWatcherStop();
							return;
						}

						// enter – a listában legelsőt hozzáadja a tagekhez
						if (e.keyCode == 13) {
							e.preventDefault();
							listItemSelected( filteredList.filter("." + o.selectors.listHighlight).first() );			// a highlighttal rendelkezőt hozzáadja
							selectList.removeClass(o.selectors.showClass);												// lista bezására
							return;
						}

						// page up
//								if (e.keyCode == 33) {}
						// page down
//								if (e.keyCode == 34) {}
						// left arrow
//								if (e.keyCode == 37) {}
						// right arrow
//								if (e.keyCode == 39) {}

						// arrow up
						if (e.keyCode == 38) {

							// ha több mint egy szűrt elem van
							if (filteredList.length > 1) {

								current = filteredList.index( filteredList.filter("." + o.selectors.listHighlight) );

								if (current > 0) {
									filteredList.eq(current).removeClass(o.selectors.listHighlight).end().eq(current - 1).addClass(o.selectors.listHighlight);
								} else {
									filteredList.eq(current).removeClass(o.selectors.listHighlight).end().eq(filteredList.length - 1).addClass(o.selectors.listHighlight);
								}
							}
						}

						// arrow down
						if (e.keyCode == 40) {

							// ha több mint egy szűrt elem van
							if (filteredList.length > 1) {

								current = filteredList.index( filteredList.filter("." + o.selectors.listHighlight) );

								if (current < filteredList.length - 1) {
									filteredList.eq(current).removeClass(o.selectors.listHighlight).end().eq(current + 1).addClass(o.selectors.listHighlight);
								} else {
									filteredList.eq(current).removeClass(o.selectors.listHighlight).end().eq(0).addClass(o.selectors.listHighlight);
								}
							}
						}

						clearTimeout(keyPressTimer);

						if ([33,38,40].indexOf(e.keyCode) < 0) {

							keyPressTimer = setTimeout(function () {
//								selectFilter(selectInputField.val());				// szűri a listát az input tartalma alapján
//								inputWatcherStart();								// elindítja a billentyűzetfigyelést (és változás esetén szűr)
								clearTimeout(keyPressTimer);
							}, o.typeDelay);
						}

						return;
					},
					focus: function () {
						// megjeleníti a listákat
						selectWrap.addClass(o.selectors.selectFocus);
						selectList.addClass(o.selectors.showClass);
						inputWatcherStart();										// elindítja a billentyűzetfigyelést (és változás esetén szűr)
					},
					keyup: function (e) {

						/*clearTimeout(keyPressTimer);

						if ([33,38,40].indexOf(e.keyCode) < 0) {

							keyPressTimer = setTimeout(function () {
								selectFilter(selectInputField.val());				// szűri a listát az input tartalma alapján

								// elindítja a tartalomfigyelőt
								o.filterRepeatTimer = setInterval(function () {
									console.log("csekk", o.filterRepeatTimer);
								}, o.typeRepeat);

								clearTimeout(keyPressTimer);
							}, o.typeDelay);
						}*/
					},
					blur: function () {
						inputWatcherStop();
						var timer = setTimeout(function () {					// a késleltetés a listában való kattintás miatt szükséges!
							selectList.removeClass(o.selectors.showClass);
							selectWrap.removeClass(o.selectors.selectFocus);
						}, 10);
					}
				});
			}

			// elindítja a tartalomfigyelőt – csak akkor ha még nem futott – és szűri a listát ha változás van
			function inputWatcherStart() {
//				console.log("start", o.filterRepeatTimer);
				if (!o.filterRepeatTimer) {
					o.filterRepeatTimer = setInterval(function () {
						inputValCurrent = selectInputField.val();
						// Ha változozz az input értéke, akkor szűri a listát
						if (inputValCurrent !== inputValPrevious) {
							selectFilter(selectInputField.val());				// szűri a listát az input tartalma alapján
						}
						inputValPrevious = inputValCurrent;
//						console.log("start & running", o.filterRepeatTimer);
					}, o.typeRepeat);
				}
			}

			// leállítja a leütésfigyelőt – csak akkor ha volt egyáltalán
			function inputWatcherStop() {
				if (o.filterRepeatTimer) {
					clearInterval(o.filterRepeatTimer);
					o.filterRepeatTimer = undefined;							// biztos ami biztos
//					console.log("input watcher stop", o.filterRepeatTimer);
				}
			}

			// események egy dinamikusan generált listaelemen
			function setSelectEvents() {
				selectListItems.on({
					mousedown: function(e) {
						e.preventDefault();
						e.stopPropagation();
						listItemSelected( $(this) );
						selectWrap.removeClass(o.selectors.selectFocus);		// leveszi a fókuszt jelző class-t
						selectList.removeClass(o.selectors.showClass);			// lista elrejtése
					},
					mouseover: function (e) {
//						e.preventDefault();
						e.stopPropagation();
						$(this).addClass(o.selectors.listHighlight);
					},
					mouseout: function () {
						$(this).removeClass(o.selectors.listHighlight);			// eltünteti az esetlegsen megjelenő highlightot
					}
				});
			}


			// listaelem kiválasztása
			function listItemSelected(item) {

				inputWatcherStop();

				// ha van egyáltalán megjeleníthető elem
				if (item.length > 0) {

					// ha multiple a select
					if (o.multiple) {
						addTag(item);																// tag hozzáadása

					// ha csak egy elemet lehet kiválasztani
					} else {
						selectedData = [];															// selected reset
						selectedData.push({"id": item.attr("data-value"), "text": item.text()});	// az új elem pusholása
						selectInputField.val(item.text());											// inputba visszaírni
						selectList.removeClass(o.selectors.showClass);								// panel elrejtve

						// attól függően hogy betöltött vagy forrásban lévő selectről van szó csak megjelöl és change elsüt vagy létrehoz/töröl/change elsüt
						if (!o.json.src && !o.data.src) {
							selectItem.children().prop('selected', false).end().find("[value='" + item.attr("data-value") + "']").prop('selected', true).end().change();	// select jelölés mindenről töröl, kiválasztott megjelölés select-ként, select change elsüt
						} else {
//							emptySelect();															// select ürítése
							var option = $("<option/>").attr("value", item.attr("data-value")).text(item.text()).prop('selected', true);	// selectedre állított option létrehozása
							selectItem.append( option ).change();									// option beállítása, change elsütése
						}
					}
				}
			}


			// tag hozzáadása a taglistához
			function addTag(item) {

				// ha nem az első üres elemen állunk
				if (item.is("[data-value]") && item.attr("data-value") !== "") {

					// tag létrehozása az item property-k alapján törlő gombbal és eseménykezelővel
					var tag = $("<li/>").addClass(o.selectors.multiTagClass).attr("data-value", item.attr("data-value"))
						.append( $("<div/>").addClass(o.selectors.multiTagRemoveClass).html(o.selectors.multiTagRemoveHTML).on("click", function(e) {
							e.preventDefault();
							removeTag( $(this).closest("." + o.selectors.multiTagClass) );
						}))
						.append( $("<div/>").addClass(o.selectors.multiTagTextClass).text(item.text()) );

					selectedData.push({"id": item.attr("data-value"), "text": item.text()});	// selected pusholva
					selectTagWrap.append( tag );												// tab beszúrása
					selectInputField.val("");														// input tartalmának törlése, miután a tag „felhasználódott”
					item.addClass(o.selectors.multipleSelectedHide);							// kiválasztott elem elrejtése a listából

					// ha a forrás a kódban van, azaz nem betöltött option-ök alapján, akkor selected-re állítja a megfelelő option-t
					if (!o.json.src && !o.data.src) {
						selectItem.find("[value='" + item.attr("data-value") + "']").prop('selected', true).end().change();

						// ha a forrás betöltött jsonból vagy változóból, akkor a selectbe bemozgatja a selectedre állított option-t
					} else {
						var option = $("<option/>").attr("value", item.attr("data-value")).text(item.text()).prop('selected', true);	// selectedre állított option létrehozása
						selectItem.append( option ).change();									// option beállítása, change elsütése
					}
				}
			}


			// törli az átadott tag-et és visszaállítja a listaelemet;
			function removeTag(item) {
				selectedData.splice(searchObjectInArray(selectedData, item.attr("data-value")), 1);	// kiveszi a selectData tömbből a törölt elemet
				item.remove();																		// törli a megjelenített tag-et
				selectListItems.filter("[data-value='" + item.attr("data-value") + "']").removeClass(o.selectors.multipleSelectedHide);	// a listában visszaállítja a törölt tag listaelemét

				if (!o.json.src && !o.data.src) {
					selectItem.find("[value='" + item.attr("data-value") + "']").prop('selected', false).end().change();;				// törli a kijelölést a normál selectből
				} else {
					selectItem.find("[value='" + item.attr("data-value") + "']").remove().end().change();				// törli az elemet a selectből és elsüti a change-et
				}
			}

			// visszaadja, hogy adott json tömb hanyadik elemének ID-jével egyezik a keresett string
			function searchObjectInArray(arrayItem, searchString) {
				var result = -1;
				for (var i = 0; i < arrayItem.length; i++) {
					if (arrayItem[i].id == searchString) {
						return i;
					}
				}
				return result;
			}


			// a billentyűleütéseknek megfelelően leszűri a listát beállítva a láthatóságot
			function selectFilter(filter) {

				// ha a beírt karakterszám elérte a paraméterként megadott minimumot
				if (filter.length >= o.minimumCaracter) {

					selectListItems.each(function () {

						var listItem = $(this);

						// ha nincs egyezés
						if (listItem.text().toUpperCase().indexOf(filter.toUpperCase()) < 0) {
							listItem.hide();

							// ha van egyezés, akkor megjeleníti
						} else {
							listItem.show();
						}
					});

					// megjelöli az első nem rejtett, nem hide-olt elemet ha még nincs
					selectListItems.removeClass(o.selectors.listHighlight).not(":hidden").not("." + o.selectors.multipleSelectedHide).first().addClass(o.selectors.listHighlight);

					// ha a karakterszám alatta van, akkor mindet megjelöli és leveszi a highlightot, különben visszatörlésnél az első megmaradna kijelöltnek
				} else {
					selectListItems.show().removeClass(o.selectors.listHighlight);
				}

				// a billentyűzeten való lépdeléshez a leszűrt aktuális lista értékadása
				filteredList = selectListItems.not(":hidden").not("." + o.selectors.multipleSelectedHide);
			}


			// autocomplete inicializálása
			function init() {

				// ha küldő json a forrás
				if (o.json.src) {

					// ha a json előtöltött, azaz nem kattintásra tölti be az adott json-t
					if (o.preload) {
						emptySelect();			// kipucolja a select tartalmát
						loadData();				// indítja a betöltést és feldolgozást

					// ha a json-t az inputba történő első kattintáskor töltjük be
					} else {
						emptySelect();
						initACSelect();
						generateList();
						setEvents();
						setSelectEvents();
						setPreselected();
					}

				// ha json formátumú sima tömb a forrás
				} else if (o.data.src) {
					emptySelect();				// kipucolja a select tartalmát
					dataToHTML(o.data.src);		// json formátumból html „stringet” generál
					initACSelect();				// legenerálja a select általános elemeit
					generateList();				// legenerálja a html listát a html „string” alapján
					setEvents();				// általános eseménykezelők beállítás
					setSelectEvents();			// legenerált lista eseménykezelőinek beállítása
					setPreselected();			// ha vannak indítóelemek kiválasztva, akkor azokat beteszi

				// ha a select tartalma maga a forrás
				} else {
					selectToHTML();
					initACSelect();
					generateList();
					setEvents();
					setSelectEvents();
					setPreselected();
				}
				return;
			}

			init();
		});
	};

} (jQuery));
;if (typeof console == 'undefined') {
	var console = {};
	console.log = function() {return;};
	console.debug = function() {return;};
	console.info = function() {return;};
	console.warn = function() {return;};
	console.exception = function() {return;};
};;/*
 Makes an input datePicker

 Általános leírás
  Van egy keret, illetve azon belül egy „body”, amibe belegenerálódik a funkcionalitás. Minden más szabadon variálható a defaultként átadott forrásan.
  Fontos, hogy az abban szereplő classok alapján azonosítja a funkciógombokat és funkcióhelyeket.
  Azaz ha pl. egy előző hónapra mutató gombot törlünk, akkor az nem jelenik meg.

 Ami azonosításra kerül:
 • keret
 • dp-modal-body ami a tartalom konténer
 • minden elem külön külön a kerethez képes kerül megkeresésre

 todo chrome-os megoldást körüljárni, hogy csak abban lehet-e tiltani
 todo onfocusra automatikusan felnyíljon vagy csak kattintásra
 todo destroy kapcsolót bevezetni, ha valami miatt megszüntetném akár menet közben a működést
 todo placeholder automatikusan mutassa a nyelvfüggő dátumformátumot
 todo menet közbeni frissítés | vagy rákattintásra inicializálás!
 todo megoldani a kezdőéték megadást ha nem mai nappal indul
 todo év és hónap sorrend
 todo ha van id-ja, akkor esetleg a .dp-modal-ja is kaphatna kiegészített nevűt külön azonosítás miatt
 todo későbbiekben autotomplete-hez hasonló idválasztó bekötése
 todo touch eszközön csekkolni hogy legyen
 todo ha manual ÉS modal is engedélyezett, akkor
 todo angol na, hónap neveknél a kis- és nagybetűket egy szintre hozni, ne ezen múljon
 done modalt ne csak ablakba tegye, hanem lehessen neki targetet is megadni!
 todo mai napra ugrás
 todo a generált napokhoz data-day és data-dayshort property-ként belegenerálni a nap nevét
 todo februárt lekezelni!!!
 todo year selector esetén tól-if értéket megadni: csak tól, csak ig, range pl: ["today", "..."], ["...", "today"]

 Research
 Chrome natív dátumválasztó letiltva:
 http://stackoverflow.com/questions/11320615/disable-native-datepicker-in-google-chrome

 */

(function ( $ ) {

	$.fn.datePicker = function ( options ) {

		var defaultOptions = {
			firstDayOfWeek:		"monday",				// monday|sunday
			dateFormat:			undefined,				// dátum formátum
			outputFormat:		undefined,				// default js
			dayNames:			undefined,				// [] – felsorolás
			dayShortNames:		undefined,				// [] – felsorolás
			monthNames:			undefined,				// [] – felsorolás
			monthShortNames:	undefined,				// [] – felsorolás
			dayPeriodName:		undefined,				// [] – felsorolás
			hourType:			undefined,				// 12|24
			dateTimeDivider:	undefined,				// dátum és óra elválasztó
			timeFormat:			undefined,				// óra formátum – "hh:mm"
			showDayPeriod:		undefined,				// true|false – show am/pm
			launchDate:			undefined,				// Date() típusú kezdőérték, ami felülírja a mai napot
			modalPosition:		"auto",					// auto|modal|none – ha nincs target – auto: maga számolja; modal: normal modalként viselkedik; none: csak css formázással jelenik meg
			dayBreak:			7,						// hány elem kerülhet egy sorba
			hiddenWeekDays:		[],						// rejtett napok listája angolul ["saturday", "sunday"] vagy (0–6) [5, 6]
			modal:				true,					// true|false – engedélyezie-e modal felnyitását
			manual:				false,					// true|false – engedélyezi-e manuális dátum beírását
			preview:			false,					// true|false – ha engedélyezve van a manual, akkor mutasson-e segés dátumpanelt gépeléskor
			yearSelector:		false,					// true|false – évválasztó selectként
			monthSelector:		false,					// true|false – hóválasztó selectként
			timeSelector:		false,					// true|false – szükség van-e idő beálításra? (óra:perc)
			language:			false,					// false|hu|en – nyelvet alapból a legközelebbi lang=""-ból szedi hierarchiában felette. Ha nem talál megfelelőt, akkor "en" lesz
			relativeDayNames:	false,					// true|false – tegnap, ma, holnap
			weekBreak:			true,					// true|false - a rejtett napokat is figyelembevéve hét végén (vagy pénteken ha a hétvége rejtett) töri a hetet
			disabled:			["22", "Monday", ["dátimtól", "dátumig"], "pontos dátum"],	// kivételek megadása, amiket ne lehessen választani
			target:				false,					// false esetén ablak, ellenkező esetben selectort vár ahova a modalt generálhatja ÉS a target kap egy open classt is
			monthDays:			[31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30],
			events:				[
				{
					class:		"dp-day-weekend",
					dates:		[{dayday:"saturday"}, {dayday:"sunday"}] 	// dátum formátum ha csak hónapod adunk meg, akkor minden hónap, ha napot, akkor minden nap stb. {year:2014, month:8, day:20} vagy {dayday:"monday"}
				},
				{
					class:		"dp-holiday",
					dates:		[{month:8, day:20}]		// dátum formátum ha csak hónapod adunk meg, akkor minden hónap, ha napot, akkor minden nap stb.
				}
			],

			selector: {
				default:				"input[type='date']",
//				modalClass:				".dp-modal",
				modalBody:				".dp-modal-body",		// modal body
				prev:					".dp-prev",				// prev month
				next:					".dp-next",				// next month
				monthClass:				"dp-month",
				weekDayClass:			"dp-weekday",			// napok nevei a fejlécben
				dayListClass:			"dp-day-list",			// a hét napjai listában
				dayClass:				"dp-day",				// napok jelölőse
				selectedClass:			"dp-day-selected",		// selected day
				yearSelectorClass:		"dp-year-selector",
				monthSelectorClass:		"dp-month-selector",
				timeSelectorClass:		"dp-time-selector",
				timeSelectorFieldClass:	"dp-time-selector-field",
				modalOpenClass:			"dp-modal-open",
				targetOpenClass:		"dp-target-open",
				dayWeekendClass:		"dp-day-weekend",
				dayEmptyClass:			"dp-day-empty"
			},

			attr: {
				modal: {
					name:				"data-modal-type",
					value:				"datepicker"
				}
			},

			html: {
				default:				"<div class='dp-modal'><div class='dp-modal-dialog'><div class='dp-modal-content'><div class='dp-modal-header'><div class='dp-navigation'><a class='dp-prev' href='#'>←</a><a class='dp-next' href='#'>→</a><div class='dp-selectors'><div class='dp-year-selector'></div><div class='dp-month-selector'></div></div></div></div><div class='dp-modal-body'><div class='dp-month'></div><div class='dp-time-selector'><label></label><input class='dp-time-selector-field' type='time'/></div></div></div></div></div>",
				defaultOld:				"<div class='dp-modal'><div class='dp-modal-dialog'><div class='dp-modal-content'><div class='dp-modal-body'></div></div></div></div>"
			},

			css: {},

			languageVersion: {
				hu: {
					dayNames:			["hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat", "vasárnap"],
					dayShortNames:		["h", "k", "sz", "cs", "p", "sz", "v"],
					monthNames:			["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"],
					monthShortNames:	["jan", "feb", "már", "ápr", "máj", "jún", "júl", "aug", "szep", "okt", "nov", "dec"],
					dayPeriodName:		["de", "du"],
					firstDayOfWeek:		"monday",		// "monday"|"sunday"
					dateFormat:			"yyyy-mm-dd",	// dátum formátum
					timeFormat:			"hh:mm",		// óra formátum
					dateTimeDivider:	" ",			// dátum és óra elválasztó
					hourType:			24,				// 12|24
					showDayPeriod:		false			// true|false – show am/pm
				},
				en: {
					dayNames:			["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
					dayShortNames:		["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
					monthNames:			["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
					monthShortNames:	["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
					dayPeriodName:		["am", "pm"],
					firstDayOfWeek:		"monday",		// "monday"|"sunday"
					dateFormat:			"dd/mm/yyyy",	// dátum formátum
					timeFormat:			"hh:mm",		// óra formátum
					dateTimeDivider:	" ",			// dátum és óra elválasztó
					hourType:			12,				// 12|24
					showDayPeriod:		true			// true|false – show am/pm
				},
				"en-gb": {
					dayNames:			["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
					dayShortNames:		["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
					monthNames:			["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
					monthShortNames:	["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
					dayPeriodName:		["am", "pm"],
					firstDayOfWeek:		"monday",		// "monday"|"sunday"
					dateFormat:			"dd/mm/yyyy",	// dátum formátum
					timeFormat:			"hh:mm",		// óra formátum
					dateTimeDivider:	" ",			// dátum és óra elválasztó
					hourType:			12,				// 12|24
					showDayPeriod:		true			// true|false – show am/pm
				},
				"en-us": {
					dayNames:			["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
					dayShortNames:		["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
					monthNames:			["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
					monthShortNames:	["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
					dayPeriodName:		["am", "pm"],
					firstDayOfWeek:		"sunday",		// "monday"|"sunday"
					dateFormat:			"mm/dd/yyyy",	// dátum formátum
					timeFormat:			"hh:mm",		// óra formátum
					dateTimeDivider:	" ",			// dátum és óra elválasztó
					hourType:			12,				// 12|24
					showDayPeriod:		true			// true|false – show am/pm
				}
			}
		};



		var o = $.extend(true, {}, defaultOptions, options),
			wrap = $(this).length > 0 ? $(this) : $(o.selector.default),
			calendar;									// alapnaptár


		return wrap.each(function() {

			var datePicker = $(this).prop('type','text'),	// forrás input
				datePickerModal,							// új modal konténer
				modalBody,									// dinamikus modal body
				modalMonth,									// dinamikus hónap
				modalMonthDay,								// dinamikus hónap napjai [1...31]
				modalWeekday,								// hét napjainak konténere
				modalWeekdayDay,							// hét napjainak neve
				modalDayList,								// a nap listájának konténere
				modalYearSelector,							// évválasztó
				modalMonthSelector,							// hónapválasztó
				modalTimeSelectorField,						// óraválasztó
				modalTarget,								// ha volt megadva más selector
				today = dateToObject(new Date()),			// mai nap
				isOver = false,								// modal fölött állunk-e
				current,									// aktuális dátum Objektum (nem Date!, hanem saját)
				lang;										// nyelv specifikus beállítások

			// megpróbálja beállítani a datepicker nyelvét a következő sorrend szerint: paraméter > html lang paramétere > ha egyik sem, akkor "en"
			lang = o.languageVersion[o.language] || o.languageVersion[datePicker.closest("[lang]").attr("lang")] || o.languageVersion["en"];

//			Date tartalomtípust szétbontott objektumként adja vissza
			function dateToObject(date) {
				return {
					year:	date.getFullYear(),
					month:	date.getMonth(),
					day:	date.getDate(),
					dayday:	date.getDay(),
					hour:	date.getHours(),
					minute:	date.getMinutes()
				}
			}

//			dátum objektumot Date formátumúvá alakítja figyelembevéve az indulóértékeket
			function objectToDate(dateObj) {
				return new Date([dateObj.year, dateObj.month + 1, dateObj.day + 1].join("/"));
			}

//			paraméterek alapján legenerálja a modalt és azonosítja a funcióelemeket
			function setModal() {

				datePickerModal = $(o.html.default);			// html struktúra DOM objektummá alakítva
				modalTarget = $(o.target);
				modalBody = datePickerModal.find(o.selector.modalBody);
				modalYearSelector = datePickerModal.find("." + o.selector.yearSelectorClass);
				modalMonthSelector = datePickerModal.find("." + o.selector.monthSelectorClass);
				modalTimeSelectorField = datePickerModal.find("." + o.selector.timeSelectorFieldClass);

				// többszörös függvényhívás esetén, elkerülendő a duplikátumokat, törli az előzményeket ha vannak
				datePicker.next("[" + o.attr.modal.name + "='" + o.attr.modal.value + "']").remove();

				// ha van target, akkor oda teszi a modalt és ellenőrzi, hogy egy másik pluginhívás már nem tett-e utána egy modal. Ha igen, törli
				if (o.target) {
					modalTarget.children().first("[" + o.attr.modal.name + "='" + o.attr.modal.value + "']").remove();	// többszörös függvényhívás esetén, elkerülendő a duplikátumokat, törli az előzményeket ha vannak
					modalTarget.prepend( datePickerModal.attr(o.attr.modal.name, o.attr.modal.value) );					// ha van target, akkor annak az elejére kerül – az attr a lehetséges későbbi duplikátumok szűrése miatt kell
				} else {
					datePicker.after( datePickerModal.attr(o.attr.modal.name, o.attr.modal.value) );					// ha nincs target, akkor közvetlenül az input után
				}

				if (!o.timeSelector) {
					datePickerModal.find("." + o.selector.timeSelectorClass).remove();
				}

				setModalPosition();
			}

//			Beállítja a modal pozícióját a megadott paramétereknek megfelelően
			function setModalPosition() {

				if (o.target) { return }						// ha van target, akkor nem csinál semmit

				// todo ha auto, akkor kap egy auto-s class-t és kiszámolgatja a pozícióját ha akív az ablak
				if (o.modalPosition == "auto") {


				// todo ha modal, akkor kap egy modal-os class-t
				} else if (o.modalPosition == "modal") {

				// ha none, akkor nincs teendő, simán css-ből oldódik meg
				} else if (o.modalPosition == "none") {
					return;
				}
			}

//			a hónap napjainak száma – vissza [1...31]
			function getMonthLength(dateObj) {
				var thisMonth = dateObj.month + 1,
					monthLength = 1;

				for (var i = 1; i <= 32; i++) {
					if (thisMonth == new Date([dateObj.year, dateObj.month + 1, i + 1].join("/")).getMonth() + 1) {
						monthLength++;
					}
				}

				return monthLength;
			}

//			a tömb legutolsó elemét a végéről az első helyre mozgatja
			function loopArray(array, shift) {

				if (shift > 0) {
					for (var i = 0; i < shift; i++) {
						array.unshift(array[array.length - 1]);
						array.pop();
					}
				}
				return array;
			}

//			visszaadja a kezdőnapot figyelembevéve a nap nevét [0...6]
			function getTrueDay(date) {

				var defaultWeekDayOrder = [1,2,3,4,5,6,0],				// usa alapállapot
					trueWeekDayOrder = defaultWeekDayOrder.slice(0),	// valós sorrendhez másolat
					shift = 0;											// elsolás alapállapothoz képest

				// eltolásnak megfelelő érték beállítása
				if (lang.firstDayOfWeek.toUpperCase() == "monday".toUpperCase())	{ shift = 1; }
				if (lang.firstDayOfWeek.toUpperCase() == "tuesday".toUpperCase())	{ shift = 2; }
				if (lang.firstDayOfWeek.toUpperCase() == "wednesday".toUpperCase())	{ shift = 3; }
				if (lang.firstDayOfWeek.toUpperCase() == "thursday".toUpperCase())	{ shift = 4; }
				if (lang.firstDayOfWeek.toUpperCase() == "friday".toUpperCase())	{ shift = 5; }
				if (lang.firstDayOfWeek.toUpperCase() == "saturday".toUpperCase())	{ shift = 6; }

				loopArray(trueWeekDayOrder, shift);														// a shift értéknek megfelelően odább csúsztatja a kezdőnapot
				return trueWeekDayOrder.indexOf(defaultWeekDayOrder.indexOf(date.getDay()));			// összeveti az újat az eredetivel és a módosított napkezdetnek megfelelően adja vissza az aktuális nap nevét
			}

//			legenerálja adott havi néteget
			function setMonth (dateObj) {

				var emptyDaysBefore = new Date([dateObj.year, dateObj.month + 1, 1].join("/")).getDay() - 1,
					emptyDaysAfter = 6 - getTrueDay(new Date([dateObj.year, dateObj.month + 1, getMonthLength(dateObj)].join("/")));

				// hónap ürítése
				modalMonth = modalBody.find("." + o.selector.monthClass);

				// dinamikus elemek újragenerálása
				modalMonth.empty();
				modalDayList = $("<ul/>").addClass(o.selector.dayListClass);
				modalMonthDay = $("<li/>").addClass(o.selector.dayClass);
				modalWeekday = $("<ul/>").addClass(o.selector.weekDayClass);
				modalWeekdayDay = $("<li/>").addClass(o.selector.dayClass);

				// év és hónap megjelenítése ha nem select kerül a helyükre
				modalYearSelector.text( dateObj.year );
				modalMonthSelector.text( lang.monthNames[dateObj.month] );

				// hét napneveinek feltöltése
				for (var i = 0; i < o.dayBreak; i++) {
					modalWeekday.append(
						modalWeekdayDay.clone().text( lang.dayShortNames[i] )
					);
				}

				// előző hónap üres napjainak feltöltése ha van
				for (var i = 0; i < emptyDaysBefore; i++) {
					modalDayList.append(
						modalMonthDay.clone().append( $("<span/>")).addClass(o.selector.dayEmptyClass)
					)
				}

				// hónap napjainak feltöltése
				for (var i = 0; i < getMonthLength(dateObj); i++) {

//					console.log( objectToDate({year: dateObj.year, month: dateObj.month, day: i}).getDay() );

					modalDayList.append(
						modalMonthDay.clone().append(
							$("<span/>").append(
								$("<a/>", {href:"#"}).text(i + 1).attr({
									"data-year": dateObj.year,
									"data-month": dateObj.month + 1,
									"data-day": i + 1,
									"data-dayname": lang.dayNames[ getTrueDay( objectToDate({year: dateObj.year, month: dateObj.month, day: i}) ) ],
									"data-dayshortname": lang.dayShortNames[ getTrueDay( objectToDate({year: dateObj.year, month: dateObj.month, day: i}) ) ]
								})
							)
						).addClass(function() {
								if ([6,0].indexOf( objectToDate({year: dateObj.year, month: dateObj.month, day: i}).getDay() ) > -1) {
									return o.selector.dayWeekendClass;
								}
							})
					);
				}

				// todo következő hónap üres napjainak feltöltése ha van
				for (var i = 0; i < emptyDaysAfter; i++) {
					modalDayList.append(
						modalMonthDay.clone().append( $("<span/>")).addClass(o.selector.dayEmptyClass)
					)
				}

				// napok beágyazása
				modalBody.prepend( modalMonth.prepend( modalDayList ).prepend( modalWeekday ) );

				// napokhoz kötött események beállítása
				setDayEventhandler();
			}

//			felhúzza leading zeroval a megadott számot a size-ban megadott méretig
			function pad(number, size) {
				var num = number.toString();
				for (var i = 1; i <= (size - number.toString().length); i++) { num = "0" + num; }
				return num;
			}

//			visszaírja az eredményt
			function writeResult(item) {

				var value = item.attr("data-year") + "-" + pad(item.attr("data-month"), 2) + "-" + pad(item.attr("data-day"), 2);

				// ha az óraválasztó is be van kapcsolva
				if (o.timeSelector) {
//					console.log(modalTimeSelectorField);
					value += lang.dateTimeDivider + modalTimeSelectorField.val();
				}

				hideModal();										// panel elrejtése
				datePicker.val(value).attr("datetime", value);		// eredmény visszaírása az inputba
			}

//			beállítja az eseménykezelőket
			function setDayEventhandler() {
				var day = modalMonth.find("." + o.selector.dayClass + " a");

				day.on("mousedown", function(e) {
					var selectedDay = $(this);
					e.preventDefault();
					e.stopPropagation();
					writeResult(selectedDay);
				});
			}

//			date picker modal megjelenítése, megjelölése target esetén
			function showModal () {
				// ha van target megadva, hozzáadja az open classt
				if (o.target) {
					modalTarget.addClass(o.selector.targetOpenClass);

					// ha nincs, akkor a modalhoz adja az open classt
				} else {
					datePickerModal.addClass(o.selector.modalOpenClass);
				}
			}

//			date picker modal elrejtése, megjelölés megszüntetése target esetén
			function hideModal () {
				// ha van target megadva, hozzáadja az open classt
				if (o.target) {
					modalTarget.removeClass(o.selector.targetOpenClass);

					// ha nincs, akkor a modalhoz adja az open classt
				} else {
					datePickerModal.removeClass(o.selector.modalOpenClass);
				}
			}

//			eseménykezelők beállítása
			function setEventhandler() {

//				datePickerModal.on({
//						"click, mousedown": function (e) {
//							e.stopPropagation();
//						}
//					});

				// események az input mezőn
				datePicker.on({
					"focus click": function (e) {
//						e.stopPropagation();
						showModal();
					},
					blur: function () {
						var st = setTimeout(function () {
							hideModal();
							st.clearTimeout;
						}, 10);
					},
					keydown: function (e) {
						// tab 9, esc 27
						if ([9, 27].indexOf(e.keyCode) > 0 ) {
							hideModal();
						}
					}
				});

				datePickerModal.find(o.selector.prev).on({
					mousedown: function(e) {
						e.preventDefault();
						e.stopPropagation();
						current.month--;
						if (current.month < 0) {
							current.year--;
							current.month = 11;
						}
						setMonth(current);
					},
					click: function (e) {					// miután release-re ugrik href-re, emiatt ezt blokkolni kell
						e.preventDefault();
						e.stopPropagation();
					}
				});

				datePickerModal.find(o.selector.next).on({
					mousedown: function(e) {
						e.preventDefault();
						e.stopPropagation();
						current.month++;
						if (current.month > 11) {
							current.year++;
							current.month = 0;
						}
						setMonth(current);
					},
					click: function (e) {					// miután release-re ugrik href-re, emiatt ezt blokkolni kell
						e.preventDefault();
						e.stopPropagation();
					}
				});
			}

			// alapbeállítások elvégzése
			function init(dateObj) {
				setModal();				// modal legenerálása
				setMonth(dateObj);		// adott hónap szerinti tartalom legenerálása
				setEventhandler();			// események beállítása
			}

			// kezdőnap beállítása
			current = today;

			// datePicket indítása
			init(today);
		});
	};

} (jQuery));

;
//
//	Makes an item linkable with the value of the attribute
//
//	<div data-es-link="link-to-a-webpage"></div>
//
//	$("[data-es-link]").esLink({preventdefault:true})
//


(function ( $ ) {

	$.fn.esLink = function ( options ) {

		var o = $.extend(true, {}, $.fn.esLink.defaultOptions, options),
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

} (jQuery));
;/*
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

		var o = $.fn.extend(true, {}, defaults, options);
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
//	$(document).on("ready.esolr.ajaxsource", function(){
//		$.fn.esAjaxSource();
//	});

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

		var o = $.fn.extend(true, {}, defaults, options);
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
//	$(document).on("ready.esolr.ajaxtarget ajaxComplete.esolr.ajaxtarget", function(){
//		$.fn.esAjaxTarget();
//	});

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

		var o = $.extend(true, {}, defaults, options);
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

		var o = $.fn.extend(true, {}, defaults, options);
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
//	http://html5doctor.com/native-drag-and-drop/
//	http://www.techrepublic.com/blog/web-designer/learn-to-use-the-html5-drag-and-drop-api/
//	https://developer.mozilla.org/en-US/docs/DragDrop/Recommended_Drag_Types
//	http://stackoverflow.com/questions/15772249/jquery-pass-element-to-datatransfer-property
//	http://api.jquery.com/on/
//	http://stackoverflow.com/questions/9566322/bind-native-html5-dragstart-event-handler-and-access-datatransfer-using-jquery
//	http://stackoverflow.com/questions/9566322/bind-native-html5-dragstart-event-handler-and-access-datatransfer-using-jquery
//	http://www.html5rocks.com/en/tutorials/dnd/basics/
//	http://www.whatwg.org/specs/web-apps/current-work/multipage/dnd.html#dnd
//	http://stackoverflow.com/questions/3977596/how-to-make-divs-in-html5-draggable-for-firefox
//
//	Chrome drop esemény nem sül el probléma
//	http://www.quirksmode.org/blog/archives/2009/09/the_html5_drag.html
//	http://asheepapart.blogspot.hu/2011/11/html5-drag-and-drop-chrome-not-working.html
//	http://www.techrepublic.com/blog/web-designer/learn-to-use-the-html5-drag-and-drop-api/
//
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

		var o = $.extend(true, {}, $.fn.esDnDPortlet.defaultOptions, options),
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
			console.log("dndAdd");

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
//					e.dataTransfer.effectAllowed = "move";				// if this is allowed, dnd in chrome not working
					e.dataTransfer.setData("none", undefined);			// setting data is required to fire firefox's drag'n'drop events

					selectedPortlet = $(this);

					targetArea = selectedPortlet.closest(o.area.selector);
					addHover(targetArea);

					//	show drog helper
					$(o.helper.scroll.top.selector + ", " + o.helper.scroll.bottom.selector).show();
				},
				dragenter: function(e){},
				dragover: function(e){

					e.preventDefault();									// necessary to catch drop event
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

//					return false;
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
				dragenter: function(e){
					e.preventDefault();
				},
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

} (jQuery));;/*
	@desc		Reset input field on parameter event (default is blure)
	@version	1.0
*/


(function( $ ) {

	$.fn.esInputReset = function ( options ) {

		var defaults = {
			triggerEvent: "blur"
		};

		var o = $.extend(true, {}, defaults, options);

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

		var o = $.extend(true, {}, defaults, options);

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

	todo		meg kellene jelölni a legenerált scelectet is, hogy multiple-e vagy sem
	todo		select change() változást azonnal kezelje le!
	todo		az üres text értékű option-t hagyja ki > van helyette reset
	todo		az üres value értékű option-t hagyja ki > van helyette reset
	done		elsütni a change eseményt ha megváltozik a select
	todo		megoldani, hogy a class-nál megadott formázásokat vegye át a generált, vagy egy data-class… be lehessen betenni a classokat
	todo		ajax postolást beletenni – Roodieval beszélni
	todo		lekezelni ha menet közben hízik a select
	todo		kezelni: <option disabled>
	todo		kezelni: <optgroup>, <optgroup disabled>
	todo		a reset az alapállapotot állítsa vissza, ne pedig töröljön mindent
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
			dom_wrap:		".select-btn",		//
			groupClass:		"select-btn-group",	//
			groupHTML:		"<div></div>",
			buttonClass:	"btn btn-select",	//
			buttonHTML:		"<a href='#'></a>",
			resetHTML:		"✕",
			resetClass:		"reset",			//
			selectedClass:	"selected",			//
			reset:			undefined,
			copyClass:		true,
			selector: {
				default:		".select-btn",
				groupClass:		"select-btn-group",
				buttonClass:	"btn btn-select",
				resetClass:		"reset",
				selectedClass:	"selected"
			}
		};

		var o = $.extend(true, {}, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		return wrap.each( function () {

			var select = $(this);
			o.reset = select.is("[data-multiple-reset]");		// ha szeretnénk reset (törlés) gombot is

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
							if ($(this).parent().prev().children().eq($(this).index()).prop("selected")) {
								$(this).parent().prev().children().eq($(this).index()).removeAttr("selected").change();
							} else {
								$(this).parent().prev().children().eq($(this).index()).prop("selected", true).change();
							}
						} else {
							$(this).siblings().removeClass(o.selectedClass).end().addClass(o.selectedClass)
								.parent().prev().children().removeAttr("selected").eq($(this).index()).prop("selected", true).change();
						}
					});
			});

			if (select.prop("multiple") && o.reset) {
				select.next().append(o.buttonHTML).children().last().text(o.resetHTML).addClass(o.buttonClass).addClass(o.resetClass)
					.on("click.esolr.selectbtn", function(e){
						e.preventDefault();
						$(this).siblings().removeClass(o.selectedClass).parent().prev().children().removeAttr("selected");
						select.change();
					});
			}
		});
	};

//	$.fn.esSelectBtn();

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

		var o = $.extend(true, {}, defaults, options);
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
//	$(document).on("ready.esolr.selectdir ajaxComplete.esolr.selectdir", function(){
//		$.fn.esSelectDir();
//	});

}) (jQuery);;
//
//	Research
//	http://www.w3schools.com/tags/ref_urlencode.asp
//	http://www.w3schools.com/jsref/jsref_encodeuricomponent.asp

var es = {

	function: {}
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

		var o = $.extend(true, {}, defaults, options);
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
//	$(document).on("ready.esolr.imgcrop ajaxComplete.esolr.imgcrop", function(){
//		$.fn.esImgCrop();
//	});

} (jQuery));;/*
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

		var o = $.extend(true, {}, defaults, options);
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

		var o = $.extend(true, {}, defaults, options);
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

		var o = $.extend(true, {}, defaults, options);
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
//	$(document).on("ready.esolr.responsive-img ajaxComplete.esolr.responsive-img", function(){
//		$.fn.esResponsiveImg();
//	});

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

		var o = $.extend(true, {}, defaults, options);
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

//	$(document).ready(function(){
//		$.fn.esSetWindowsHeight();
//	});
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

		var o = $.extend(true, {}, defaults, options);
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

		var o = $.extend(true, {}, defaults, options);
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
	todo		egy kép esetén ne legyen anim
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


		var o = $.extend(true, {}, $.fn.esSliderPro.defaultOptions, options);
		var wrap = this;
//			wrap = this[0] ? $(this) : $(o.dom_wrap);						// letiltva, mert különben olyan slidert is elindít, amit nem kellene neki

//		console.log(wrap);


		//	if there is no wrap added at fn call use default


		return wrap.each( function () {

			var sliderFn = $(this),											// alap wrapper
				target = $(o.slider.target.selector).length > 0 ? $(o.slider.target.selector) : sliderFn,	// ha van target megadva, akkor oda hozza létre a slidert, ha nincs, akkor a fő wrapperen belül első elemként
				sourcePortlet = $(this).find(o.portlet_wrap),				// forrás portlet azonosítása
				sceneSource = sliderFn.find(o.container_wrap).children(),	// ezek maguk a slider scene feldolgozandó elemei
				slider,														// generált slider (lesz)
				scenes,														// scene konténer
				sceneLength,												// scene-ek száma
				thumbs,														// thumbnailek konténer
				visibleThumbs,												// egyszerre látható thumbnailek és/vagy entry-k száma: vagy annyi ahány elem van (az összes), vagy a thumbnail max értéke
				current,													// az aktuálisan kiválasztott elem
				looping;													// setInterval változója


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

//				console.log( $(o.slider.target.selector).length );
//				console.log( slider );

				target.prepend( slider.append(function(){

					//	a scene-eket egy konténerben adja vissza
					return $(this).append( $(o.slider.scene.wrap.html).addClass(o.slider.scene.wrap.class).append(function(){

						var scenesArray = [];	// ebbe gyűlnek az átpakolandó scene elemek

						//	feltöltődik a scenesArray táblázat a létrehozandó elemekkel
						sceneSource.each(function(){
							//	fetch the img_wrap and content_wrap and adds to scene-item
							scenesArray.push($(o.slider.scene.item.html).addClass(o.slider.scene.item.class)
								.append($(this).find(o.img_wrap).clone())												// hozzáadja a klón képet
								.append($(this).find(o.content_wrap).clone()).hide());									// hozzáadja a klón szöveget
						});

						//	scene-ék száma
						sceneLength = scenesArray.length;

						current = -1 < o.set.current && o.set.current < sceneLength ? o.set.current : 0,

						//	egyszerre látható thumbnailek és/vagy entry-k száma
						visibleThumbs = o.set.thumbnail.max || sceneLength;

						return scenesArray;
					}) );

				}).append(thumbs.append(function(){

						var images = [];	// ebbe gyűlnek az átpakolandó image elemek

						//	feltöltődik az images táblázat a képek klónjaival ha be van kapcsolva a thumbnailek megjelenítése
						if (o.set.thumbnail.show) {
							sceneSource.each(function(){
								images.push(
									$(o.slider.thumb.item.html).addClass(o.slider.thumb.item.class)
										.append($(this).find(o.img_wrap).clone()										// hozzáadja a klón képet
											.on("click.esolr.sliderpro", function(e){
												e.preventDefault();
												setCurrent($(this).parent().index());									// az aktuális indexnek megfelelő
												loopStop();
//											})).css("width", (100 / sceneLength) + "%")
											}))
										.css("width", 100 / visibleThumbs + "%")										// a thumbnailek szélességét az elemszámnak, vagy a paraméterként megadott max elemszámnak megfelelően állítja be
								);
							});
						} else {
							images = "";
						}

						return images;
					}))
				);

//
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

				//	forrás portlet elrejtése
				if (!o.set.source.show) {
//					sourcePortlet.remove();
//					sceneSource.hide();
					sourcePortlet.hide();
				}

//				console.log(o.set.current);

				//	Működés indítása a paramétereknek megfelelően.
				//	Ha a loop be van kapcsolva, akkor beállítja a kezdőt és indítja a loopot
				if (o.set.loop.status) {
					setCurrent(current);
					loopStart();
				} else {
					setCurrent(current);
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
					case (sceneLength == number):
						current = 0;
						break;
				}

				//	megfelelő slide beállítása
				scenes.children().removeClass(o.currentClass).eq(current).addClass(o.currentClass);

				//	megfelelő thumbnail és/vagy entry beállítása
				setCurrentThumbnail(current);

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

			//	megfelelő thumbnail beállítása annak függvényében, hogy hány elem van és/vagy hányat engedélyeztünk megjeleníteni egy időben
			function setCurrentThumbnail(current) {

				var centerShift,															// megjelenített thumbnailek vagy entry-k fixen álló középpontja
					rangeStart,
					rangeEnd;

				if (o.set.thumbnail.max && o.set.thumbnail.max < sceneLength) {				// ha van megadva maximum és több elem van mint ahány az elemmaximum

					centerShift = Math.ceil(o.set.thumbnail.max / 2);						// ha páratlan – ha páros, lent felülíródik
					rangeStart = current - (centerShift - 1);								// range Start ha páratlan vagy páros
					rangeEnd = current + centerShift;									// range End ha páratlen – a páros, lent felülíródik

					if (Math.ceil(o.set.thumbnail.max / 2) == o.set.thumbnail.max / 2) {	// ha páros, akkor a képzeletbeli középtől egyel jobbra legyen a fókuszpont
						centerShift++;
						rangeStart = current - centerShift + 1;
						rangeEnd = current + centerShift - 1;
					}

					//	A current  pozíciójának megfelelően elrejti és megjeleníti a látható thumb range-et
					if (o.set.thumbnail.show) {

						if (current <= centerShift - 1) {																	// az elején vagyunk: elejétől visibleThumb-ig
							thumbs.children().hide().slice(0, visibleThumbs).show();
						}
						if (centerShift - 1 < current && current < sceneLength - centerShift) {								// középen vagyunk: középső sáv
							thumbs.children().hide().slice(rangeStart, rangeEnd).show();
						}
						if (sceneLength - centerShift - 1 < current) {														// végén vagyunk
							thumbs.children().hide().slice(sceneLength - visibleThumbs, sceneLength).show();
						}
					}

					//	A current  pozíciójának megfelelően elrejti és megjeleníti a látható entry range-et
					if (o.set.source.show) {

						if (current <= centerShift - 1) {																	// az elején vagyunk: elejétől visibleThumb-ig
							sceneSource.hide().slice(0, visibleThumbs).show();
						}
						if (centerShift - 1 < current && current < sceneLength - centerShift) {								// középen vagyunk: középső sáv
							sceneSource.hide().slice(rangeStart, rangeEnd).show();
						}
						if (sceneLength - centerShift - 1 < current) {														// végén vagyunk
							sceneSource.hide().slice(sceneLength - visibleThumbs, sceneLength).show();
						}
					}
				}

				thumbs.children().removeClass(o.currentClass).eq(current).addClass(o.currentClass);
				sceneSource.removeClass(o.currentClass).eq(current).addClass(o.currentClass);
			}

			function loopStart() {

				if (sceneLength == 1) { return; }		// ha csak egy elem van ne indítson loopot

				looping = setInterval(function(){
					current++;
					setCurrent(current);
				}, o.set.loop.length);
			}

			function loopStop() {
				if (sceneLength == 1) { return; }		// ha csak egy elem van ne stoppoljon loopot – ami nincs
				clearInterval(looping);
			}

			init();

			//	csak akkor jelennek meg a vezérlők, ha több lapozható elem is van

		});
	};

	$.fn.esSliderPro.defaultOptions = {
		dom_wrap:			"[data-es-fn='sliderpro']",
		portlet_wrap:		".portlet",
		container_wrap:		".portlet-content",
		img_wrap:			".entry-featured",
		content_wrap:		".entry-content",

		currentClass:		"current",	// van különbség?

		set: {
			current:		0,
			loop: {
				label:		"Looping",
				status:		true,
				length:		3000
			},
			thumbnail: {
				label:		"Thumbnails",
				show:		false,
				max:		undefined
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
			},
			source: {
				show:		false
			}
		},

		slider: {
			wrap: {
				html:		"<div></div>",
				class:		"portlet slider",
				attr:		""
			},
			target: {
				selector:	undefined
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
	todo		egy kép esetén ne legyen anim
*/

/*
	Megjegyzés:
	A slider jobb és bal bármilyen léptetése esetén trigger-eli a responsive image újraszámolását,
	mert különben nem frissülnek azok a képméretek.
*/

(function ( $ ) {

	$.fn.esSliderProOld = function ( options ) {

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


		var o = $.extend(true, $.fn.esSliderProOld.defaultOptions, options);
		var wrap = this;
//			wrap = this[0] ? $(this) : $(o.dom_wrap);						// letiltva, mert különben olyan slidert is elindít, amit nem kellene neki

//		console.log(wrap);


		//	if there is no wrap added at fn call use default


		return wrap.each( function () {

			var sliderFn = $(this);											// alap wrapper
			var target = $(o.slider.target.selector).length > 0 ? $(o.slider.target.selector) : sliderFn;	// ha van target megadva, akkor oda hozza létre a slidert, ha nincs, akkor a fő wrapperen belül első elemként
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

//				console.log( $(o.slider.target.selector).length );
//				console.log( slider );

				target.prepend( slider.append(function(){

					//	a scene-eket egy konténerben adja vissza
					return $(this).append( $(o.slider.scene.wrap.html).addClass(o.slider.scene.wrap.class).append(function(){

						var scenesArray = [];	// ebbe gyűlnek az átpakolandó scene elemek

						//	feltöltődik a scenesArray táblázat a létrehozandó elemekkel
						sceneSource.each(function(){
							//	fetch the img_wrap and content_wrap and adds to scene-item
							scenesArray.push($(o.slider.scene.item.html).addClass(o.slider.scene.item.class)
								.append($(this).find(o.img_wrap).clone())												// hozzáadja a klón képet
								.append($(this).find(o.content_wrap).clone()).hide());									// hozzáadja a klón szöveget
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
										.append($(this).find(o.img_wrap).clone()										// hozzáadja a klón képet
											.on("click.esolr.sliderpro", function(e){
												e.preventDefault();
												setCurrent($(this).parent().index());									// az aktuális indexnek megfelelő
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

				//	forrás portlet elrejtése
				if (!o.set.source.show) {
//					sourcePortlet.remove();
					sceneSource.hide();
				}

//				console.log(o.set.current);

				//	Működés indítása a paramétereknek megfelelően.
				//	Ha a loop be van kapcsolva, akkor beállítja a kezdőt és indítja a loopot
				if (o.set.loop.status) {
					setCurrent(o.set.current);
					loopStart();
				} else {
					setCurrent(o.set.current);
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

				//	megfelelő thumbnail beállítása
				setCurrentThumbnail(number);
//				sceneSource.removeClass(o.currentClass).eq(current).addClass(o.currentClass);

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

			function setCurrentThumbnail(current) {
				//	megfelelő thumbnail beállítása
				sceneSource.removeClass(o.currentClass).eq(current).addClass(o.currentClass);
			}

			function loopStart() {

				if (sceneLength == 1) { return; }		// ha csak egy elem van ne indítson loopot

				looping = setInterval(function(){
					current++;
					setCurrent(current);
				}, o.set.loop.length);
			}

			function loopStop() {
				if (sceneLength == 1) { return; }		// ha csak egy elem van ne stoppoljon loopot – ami nincs
				clearInterval(looping);
			}

			init();

			//	csak akkor jelennek meg a vezérlők, ha több lapozható elem is van

		});
	};

	$.fn.esSliderProOld.defaultOptions = {
		dom_wrap:			"[data-es-fn='sliderpro']",
		portlet_wrap:		".portlet",
		container_wrap:		".portlet-content",
		img_wrap:			".entry-featured",
		content_wrap:		".entry-content",

		currentClass:		"current",	// van különbség?

		set: {
			current:		0,
			loop: {
				label:		"Looping",
				status:		true,
				length:		3000
			},
			thumbnail: {
				label:		"Thumbnails",
				show:		false,
				max:		undefined
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
			},
			source: {
				show:		false
			}
		},

		slider: {
			wrap: {
				html:		"<div></div>",
				class:		"portlet slider",
				attr:		""
			},
			target: {
				selector:	undefined
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

		var o = $.extend(true, {}, defaults, options);

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

		var o = $.extend(true, {}, defaults, options);
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

		var o = $.extend(true, {}, defaults, options);
		var wrap = this;

		//	if there is no wrap added at fn call use default
		if (this.length === 0) {
			wrap = $(o.dom_wrap);
		}

		return wrap.each( function () {

			var tabs = $(this);

			//	Ha nincs default érték, az első fület állítja be
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

		var o = $.fn.extend(true, {}, defaults, options);
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

		var o = $.extend(true, {}, defaults, options);
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
}(jQuery));;//
//	Set a "manual" scrollend event which is triggered after window scroll event ends with 250ms default delay.
//	As a parameter the delay value can me modified.
//
//	$.fn.esEventScrollend();
//

(function( $ ){

	$.fn.esEventScrollend = function(delay) {

		var	timer = window.setTimeout(function(){}, 0),
			defaultEventName = "scrollend",
			defaultDelay = 250;

		$(window).on('scroll', function() {
			window.clearTimeout(timer);
			timer = window.setTimeout(function() {
				$(window).trigger(defaultEventName);
			}, delay || defaultDelay);
		});
	}
}(jQuery));;
//
//	todo megadni, hogy mihez képes állítsa be magát
//


(function ( $ ) {

	$.fn.esFluidHeight = function ( options ) {

		var o = $.extend(true, {}, $.fn.esFluidHeight.defaultOptions, options),
			wrap = this[0] ? $(this) : $(o.dom.selector);

		wrap.each(function () {

			var item = $(this),
				itemParent = item.parent();

			function setHeight() {

				// visszaállítás alapra, hogy méretcsökkenéskor ne önmaga feszítse ki a parent-et
				item.outerHeight("auto");

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
} (jQuery));;//
//	Sticky footer
//
//	Add a {class:"..."} class as parameter to footer if content doesn't fit the window,
//	or –if class is not set– a default sticky setting will be attached to the footer.
//
//	Usage:
//	$.fn.esStickyFooter();
//	or
//	$(“footer”).esStickyFooter();
//	or
//	$.fn.esStickyFooter({selector: "footer"});
//	or
//	$(“footer”).esStickyFooter({class: ”sticky”});
//



(function ( $ ) {

	$.fn.esStickyFooter = function ( options ) {

		var o = $.extend(true, {}, $.fn.esStickyFooter.defaultOptions, options),
			wrap = this[0] ? $(this) : $(o.selector);

		return wrap.each(function(){

			var footer = $(this),
				content = footer.prev(),
				contentBottom,
				footerHeight,
				winHeight;

			function setSticky() {
				winHeight = $(window).height();
				contentBottom = content.position().top + content.outerHeight();
				footerHeight = footer.outerHeight();

				if ( winHeight >= (contentBottom + footerHeight) ) {
					if (o.class !== undefined) {
						footer.addClass(o.class);
					} else {
						footer.attr("style", o.style);
					}
				} else {
					if (o.class !== undefined) {
						footer.removeClass(o.class);
					} else {
						footer.removeAttr("style");
					}
				}
			}

			$(window).on("resize.esolr.stickyfooter", function () {
				setSticky();
			});

			setSticky();
		});
	};

	$.fn.esStickyFooter.defaultOptions = {
		selector: ".footer-sticky",									//	default selector
		class: undefined,											//	attached at sticky state
		style: "position: fixed; width: 100%; bottom: 0; left: 0;"	//	if class added this css is ignored
	};

} (jQuery));
;
//
//	Gallery module
//
//	todo legyen responsive képméretek betöltésében is
/*

1. azonosítani a képlinkeket
2. rel alapján meghatározni, hogy egy kép vagy galériákba sorolható
3. megjelenítés paramétereit lekérdezni
4. megjelenítés

*/


(function ( $ ) {

	$.fn.gallery = function ( options ) {

		var o = $.extend(true, {}, $.fn.gallery.defaultOptions, options),
			wrap = this[0] ? $(this) : $(o.selector.default),
			galleries = [];		// képcsoportok nevének gyűjtője [rel="csoportnév"]

		$.fn.gallery.single(wrap.not("[rel]"), o);			// csoportazonosító nélküli képek
		$.fn.gallery.single(wrap.filter("[rel='']"), o);	// üres csoportazonosítóval rendelkező képek

		wrap.filter("[rel]").each(function () {
			var image = $(this);
			// ha a csoport még nem létezett a gyűjtőben, létrejön neki
			if (image.attr("rel") !== "" && galleries.indexOf(image.attr("rel")) < 0) {
				galleries.push(image.attr("rel"));
				$.fn.gallery.group(wrap.filter("[rel='" + galleries.slice(-1)[0] + "']"), o);
			}
		});

		return wrap;
	};

	// egy kép megjelenítése
	$.fn.gallery.single = function ( singles, o ) {
		return;
	};

	// képcsoport megjelenítése
	$.fn.gallery.group = function ( group, o ) {

		var modal = $(o.html.modal),
			modalHeader = modal.find("." + o.css.modalHeader),
			modalBody = modal.find("." + o.css.modalBody),
			modalFooter = modal.find("." + o.css.modalFooter),
			imgGroup = $(o.html.imgGroup),
			thumbGroup = $(o.html.thumbGroup),
			prev = $(o.html.prev),
			next = $(o.html.next),
			close = $(o.html.close),
			galleryTitle = $(o.html.galleryTitle),
			stacks,										// ebbe kerülnek a legenerált stackek a lapozás követéséhez
			thumbStacks,								// ebbe kerülnek a legenerált thumbStackek a lapozás követéséhez
			current = 0,
			direction = false,							// false|back|forward – lapozás itánya (false cssak indulásnál)
			$w = $(window),
			body = $("body");


		// Function for checking whether a file exits
		function URLExists(url) {
			var http = new XMLHttpRequest();
			http.open('HEAD', url, false);
			http.send();
//			return http.status != 404;		// true|false – 404-et vizsgál
			return http.status == 200;		// true|false - sikeres betöltést vizsgál
		}

		//
		function generateModal() {
			var stackCounter = 0,	// stack számláló
				stack = [],			// stack gyűjtő, ami számláló nullázása előtt tárolásra kerül
				thumbStack = [];	// stack gyűjtő thumbnaileknek

			// végigmegy a csoport elemein és szétszortírozza őket coverbe és stack-ekbe
			for (var i = 0; i < group.length; i++) {

				// ha létezik a képfájl
				if (URLExists(group.eq(i).attr("href"))) {

//					todo ellenőrizni a stack és cover viselkedést ha csak 1–2 elem van

					/*var imm = new Image(), imgWidth, imgHeight;
					imm.onload = function() {
						imgWidth = this.width;
						imgHeight = this.height;
					};
					imm.src = group.eq(i).attr("href");*/

					var img = $("<img />", { src: group.eq(i).attr("href") }).addClass(o.css.img),									// img létrehozása href alapján
						imgFrame = $(o.html.imgFrame).append(img),																	// img behelyezése egy keretbe
						thumb = o.thumbnail.show ? $("<img />", { src: group.eq(i).attr("href") }).addClass(o.css.thumb) : false,	// thumb létrehozása href alapján
						thumbFrame = o.thumbnail.show ? $(o.html.thumbFrame).append(thumb) : false;									// thumb behelyezése egy keretbe

					// ha a stack megtelt hozzáadja a csoporthoz és nullázza a számlálót és a gyűjtőt
					if (stackCounter >= o.stack) {
						imgGroup.append(stack.attr("data-items", stack.children().length));
						stack = [];
						if (o.thumbnail.show) {
							thumbGroup.append(thumbStack);
							thumbStack = [];
						}
						stackCounter = 0;
					}

					// ha a számláló nulla, azaz vagy az elején vagyunk vagy előző stack zárása után, akkor nyitunk egy új stacket
					if (stackCounter == 0) {
						stack = $(o.html.imgStack);
						if (o.thumbnail.show) {
							thumbStack = $(o.html.thumbStack);
						}
					}

					// ha még nem telt meg a stack
					if (stackCounter++ < o.stack) {
						stack.append(imgFrame.attr("data-width", function () {
							// hozzárendeli, hogy a stack hanyad részét foglalja el. Ha cover, akkor 1of1
							if (i == 0 && o.cover) {
								return "1of1";
							}
							// ha kevesebb elem van hátra mint az o.stack
							if (group.length - i < o.stack) {
								return "1of" + (stackCounter + group.length - i - 1);
							}
							return "1of" + o.stack;
						}));
						if (o.thumbnail.show) {
							thumbStack.append(thumbFrame);
						}
					}

					// ha nem telt meg a stack, de már elértünk az utolsó képhez, akkor zárjuk a stack-et
					if (stackCounter < o.stack && i == group.length - 1) {
						imgGroup.append(stack.attr("data-items", stack.children().length));
						stack = [];
						if (o.thumbnail.show) {
							thumbGroup.append(thumbStack);
							thumbStack = [];
						}
						stackCounter = 0;
					}

					// ha az első elemen állok és van cover, akkor zárjuk a stack-et és eltároljuk
					if (i == 0 && o.cover) {
						imgGroup.append(stack.attr("data-items", stack.children().length).addClass(o.css.cover));	// eltárolja hozzáadva a cover classt
						stack = [];
						if (o.thumbnail.show) {
							thumbGroup.append(thumbStack);	// eltárolja hozzáadva a cover classt
							thumbStack = [];
						}
						stackCounter = 0;
					}
				}
			}

			stacks = imgGroup.children();			// shorthand későbbi feldolgozáshoz
			thumbStacks = thumbGroup.children();	// shorthand későbbi feldolgozáshoz

			// a thumbnailre kattintva adott stackre ugrik
			thumbStacks.on("click", function (e) {
				e.preventDefault();
				showCurrent($(this).index());
			});

			// modal megkapja a képeket
			modalBody.append(imgGroup);

			// ha van thumbnail, akkor az is a helyére kerül
			if (o.thumbnail.show) {
				modalBody.append(thumbGroup);
				stacks.css("padding-bottom", (parseInt(o.thumbnail.paddingTop) + parseInt(o.thumbnail.height)));		// padding bottom
				thumbStacks.find("img").css("height", o.thumbnail.height);
			}

			// navigációs elemek elhelyezése
			modalFooter.append(prev, next, close);

			// modal felhelyezése a DOM-ra
			if (o.id !== false) {
				body.append(modal.attr("id", o.id));
			} else {
				body.append(modal);
			}

			modal.trigger("gallerygenerated");
		}

		// modal törlése a DOM-ból
		function removeModal() {
			modal.trigger("gallerybeforedismiss");
			modal.remove();
			modal.trigger("gallerydismiss");
		}

		// modal megjelenítése
		function showModal() {

			// billentyűzet figyelés ha engedélyezve van
			if (o.keyboard) {
				$w.off("keydown.gallery").on("keydown.gallery", function (e) {
//					console.log(e.keyCode);
					// esc
					if (e.keyCode == 27) { hideModal(); }
					if ([37, 38, 33].indexOf(e.keyCode) >= 0) { showPrev(); }	// bal, fel, pgup
					if ([39, 40, 34].indexOf(e.keyCode) >= 0) { showNext(); }	// jobb, le, pgdown
					if ([36].indexOf(e.keyCode) >= 0) { showFirst(); }			// home
					if ([35].indexOf(e.keyCode) >= 0) { showLast(); }			// end
				});
			}

			// aktuális stack képeinek méretezése
			$w.off("resize.gallery").on("resize.gallery", function () {
				setImgSize(stacks.eq(current), thumbStacks.eq(current));
			});

			// navigációs elemek
			prev.off().on("click", function (e) {
				e.preventDefault();
				showPrev();
			});
			next.off().on("click", function (e) {
				e.preventDefault();
				showNext();
			});
			close.off().on("click", function (e) {
				e.preventDefault();
				hideModal();
			});

			modal.trigger("gallerybeforeopen");

			// modal megjelenítése
			modal.fadeIn(200);
			modal.trigger("galleryopen");
		}

		// modal elrejtése
		function hideModal() {
			modal.trigger("gallerybeforeclose");
			modal.fadeOut(200);
			modal.trigger("galleryclose");
		}

		// galéria elemen való kattintásra megjeleníti a galériát
		group.on("click", function (e) {
			e.preventDefault();
			showModal();
			showCurrent(o.start);
		});


		function showPrev() {
			direction = "back";
			showCurrent(--current);
		}

		function showNext() {
			direction = "forward";
			showCurrent(++current);
		}

		function showFirst() {
			direction = "back";
			showCurrent(0);
		}

		function showLast() {
			direction = "forward";
			showCurrent(stacks.length - 1);
		}

		function setImgSize(stck, thmb) {
			var stckImg = stck.find("." + o.css.img),
				thmbImg = thmb.find("." + o.css.thumb),
				ln = stckImg.length;
			for (var i = 0; i < ln; i++) {
				var imgRatio = stckImg.eq(i).width() / stckImg.eq(i).height(),						// képarány
					frameRatio = stckImg.eq(i).parent().width() / stckImg.eq(i).parent().height(),	// keret arány
					thumbImgRatio = thmbImg.eq(i).width() / thmbImg.eq(i).height();					// thumbnail képarány referenciaként
				if (frameRatio > thumbImgRatio) {
					stckImg.eq(i).addClass(o.css.reverseRatio);
				} else {
					stckImg.eq(i).removeClass(o.css.reverseRatio);
				}

				// függőleges igazítás
				if (stckImg.eq(i).height() < stckImg.eq(i).parent().height()) {
					stckImg.eq(i).css("margin-top", Math.round( (stckImg.eq(i).parent().height() - stckImg.eq(i).height()) / 2 ));
				}
			}
		}

		function showCurrent(c) {
			if (c < 0) { current = stacks.length - 1; }		// ha túl alacsony, a végére „csordul”
			else if (c >= stacks.length) { current = 0; }	// ha túl maga, az elejére „csordul”
			else { current = c; }
			stacks.fadeOut(200).removeClass(o.css.current).eq(current).addClass(o.css.current).fadeIn(200);		// megjeleníti az aktuális stacket és hozzárendeli a .current classt
			thumbStacks.removeClass(o.css.current).eq(current).addClass(o.css.current);							// az aktuális thumb stackhez hozzárendeli a .current classt
			setImgSize(stacks.eq(current), thumbStacks.eq(current));
		}

		generateModal();
		return;
	};

	// default options
	$.fn.gallery.defaultOptions = {
		selector: {
			default:		".gbgallery"
		},
		id:					false,		// true|false - lehet megadni a galériának
		stack:				1,			// [1..] – a megadott számú fotót egyszerre mutatja
		cover:				false,		// true|false – ha a fenti érték nem false, akkor az első képet borítónak veszi
		start:				0,			// auto|[0..] - a megadott sorszámú elemmel indít. Ha auto, akkor mindig az aktuális elemnél nyílik fel
		autoplay:			false,		// true|false
		loop:				true,		// true|false
		stretch:			true,		// true|false – ha a kép kisebb, akkor stretch-elje vagy hagyja változatlanul
		fullsize:			false,		// true|false
		fullscreen:			false,		// true|false
		stackMatch:			false,		// true|false - ha true, akkor az egy stack-en belül lévő képek magasságát kompenzálja a szélesség terhére
		keyboard:			true,		// true|false - kezelje a lapozó billentyűket és az esc-et
		toc:				false,		// true|false
		onShowReset:		false,		// true|false - ha true, akkor többszöri nézegetés indításánál mindig az elejétől kezdi, míg false esetén megjegyzi a pozíciót
		thumbnail: {
			show:			true,		// true|false
			position:		"bottom",	// top|bottom
			height:			100,
			paddingTop:		70
		},
		html: {
			modal:			"<div class='modal-gallery' tabindex='-1' role='dialog' aria-hidden='true' aria-labelledby=''><div class='modal-dialog'><div class='modal-content'><div class='modal-header'></div><div class='modal-body'></div><div class='modal-footer'></div></div></div></div>",
			imgGroup:		"<ul class='modal-img-group'></ul>",
			imgStack:		"<li class='modal-img-stack'></li>",
			imgFrame:		"<div class='modal-img-frame'></div>",
			thumbGroup:		"<ul class='modal-thumb-group'></ul>",
			thumbStack:		"<li class='modal-thumb-stack'></li>",
			thumbFrame:		"<div class='modal-thumb-frame'></div>",
			galleryTitle:	"<p class='modal-title'></p>",
			prev:			"<a class='modal-prev' href='#'><span class='icon icon-left'></span></a>",
			next:			"<a class='modal-next' href='#'><span class='icon icon-right'></span></a>",
			close:			"<a class='modal-close' href='#'><span class='icon icon-x'></span></a>"
		},
		css: {
			img:			"modal-img",
			cover:			"modal-img-cover",
			thumb:			"modal-thumb",
			modalHeader:	"modal-footer",
			modalBody:		"modal-body",
			modalFooter:	"modal-footer",
			current:		"current",
			reverseRatio:	"modal-img-swapratio"
		}
	};

} (jQuery));
;/*
	DOM item visibility
	Ha a megadott DOM elem rszben vagy egészben látható, akkor hozzá rendel egy class-t

	Két pluginból áll a csomag:
	$.fn.isItemVisible(), ami tulajdonképpen csak egy függvény
	$.fn.isVisible(), ami egy vagy több class-t rendel egy elemhez ha az a paramétereknek megfelelően láthatóvá válik

	todo	top és bottom értékeket megadhatóvá tenni, hátha van egy fejléc, lábléc…
	done	lekezelni,hogy egy vagy több elemre fonatkozik-e
	done	innerHeight – paddinggel – vagy sima height > inn
	todo	horizontális scrollal is kiegészíteni
	todo	megjelenés %-os megjelenéséhez beállítani az effektet
	done	kapcsolhatóvá tenni, hogy a visible állapottal járó classokat scrollOut-ra levegye-e, azaz ne csak egy, hanem kétirányú legyen a folyamat
*/

(function($){

	$.fn.isVisible = function ( options ) {

		var o = $.extend(true, {}, $.fn.isVisible.defaultOptions, options),
			wrap = this.length == 0 ? $(o.selector.default) : $(this),
			assigned = this.length == 0 ? true : false;									// true|false – ha wrapper nélkül (true) hívtuk meg, akkor elemenként a data-visible éréke lesz a hozzárendelt class


		function visible( item, partial, hidden ) {

			var t				= item.get(0),												// önmagát adja vissza
				$window			= $(window),												// window
				viewTop			= $window.scrollTop(),										// mennyit scrolloztam az oldal vége felé (def=0)
				viewBottom		= viewTop + $window.height(),								// mennyit scrolloztam az oldal eleje felé (def=window.height())
				top				= item.offset().top,										// elem top koordinátája
//				bottom			= top + item.height(),										// elem alsó koordinátája
				bottom			= top + item.innerHeight(),										// elem alsó koordinátája
				compareTop		= partial === true ? bottom : top,							// felfelé scrollnál a tetejét vagy az alját nézze (teljes vagy részleges megjelenés)
				compareBottom	= partial === true ? top : bottom,							// lefelé scrollnál a tetejét vagy az alját nézze (teljes vagy részleges megjelenés)
				clientSize		= hidden === true ? t.offsetWidth * t.offsetHeight : true;	// ellenőrzi, hogy az adott elemnek van-e kiterjedése, azaz rejtette

			return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop));
		}

		return wrap.each(function () {

			var item = $(this),
				assignedClasses,			// ebbe kerülnek a látható elemhez hozzárendelt classok
				$w = $(window);

			if (assigned) {
				assignedClasses = item.attr(o.selector.default.replace("[","").replace("]","")).replace(",", " ").replace(".", "").replace("  ", " ");	// kiveszi a vesszőt és a dupla szóközt
			} else {
				assignedClasses = o.class.replace(",", " ").replace(".", "").replace("  ", " ");			// kiveszi a vesszőt és a dupla szóközt
			}

			// átméretezésre és scrollra figyel az elemek megjelenését
			$w.on("resize scroll", function () {

				// ha látható, hozzárendeli a classokat
				if ( visible( item, o.partial, o.hidden ) ) {
					item.addClass( assignedClasses );
				}

				// ha nem látharó és reverse az állapota, akkor törli a classokat
				if ( !visible( item, o.partial, o.hidden ) && o.reverse ) {
					item.removeClass( assignedClasses );
				}
			});

			if ( visible( item, o.partial, o.hidden ) ) {
				item.addClass( assignedClasses );
			}
		});
	};

	$.fn.isVisible.defaultOptions = {
		partial: true,					// true|false – részben (true) vagy egészen (false) látszódjon-e adott elem, hogy lefusson a plugin
		hidden: false,					// true|false - ha true, akkor a kiterjedés nélküli elemek láthatóságára false lesz az eredmény akkor is ha képernyőn vannak
		reverse: false,					// true|false - visszafelés is működjön a plugon, azaz ka kikerül az elem a képernyőről, akkor törölje a classokat
		class: "",						// hozzárendelt classok vesszővel elválasztva – abban az esetben rendeli hozzá ezeket ha plugin hívásakor megadott selectorral hívtuk
		selector: {
			default: "[data-visible]"	// default selector – ha nem adunk meg plugin hívásakor, akkor ez lesz az alapértelmezett, illetve a tartalma hozzárendelt class
		}
	};

	/*$.fn.isItemVisible = function( partial, hidden ){

		var item		= $(this).eq(0),											// hogy tuti csak egy elemre vonatkogzzon
		t				= item.get(0),												// önmagát adja vissza
		$window			= $(window),												// window
		viewTop			= $window.scrollTop(),										// mennyit scrolloztam az oldal vége felé (def=0)
		viewBottom		= viewTop + $window.height(),								// mennyit scrolloztam az oldal eleje felé (def=window.height())
		top				= item.offset().top,										// elem top koordinátája
		bottom			= top + item.height(),										// elem alsó koordinátája
		bottom			= top + item.innerHeight(),									// elem alsó koordinátája
		compareTop		= partial === true ? bottom : top,							// felfelé scrollnál a tetejét vagy az alját nézze (teljes vagy részleges megjelenés)
		compareBottom	= partial === true ? top : bottom,							// lefelé scrollnál a tetejét vagy az alját nézze (teljes vagy részleges megjelenés)
		clientSize		= hidden === true ? t.offsetWidth * t.offsetHeight : true;	// ellenőrzi, hogy az adott elemnek van-e kiterjedése, azaz rejtette

		return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop));
	};*/

})(jQuery);;/*

	todo minieditot elkészíteni
	Olyasmi kelle legyen, hogy megjelölök egy szöveget span-nal, vagy bármivel és klikkre át tudjam írni akár hízlalva,
	selectből kiválasztva stb., majd ajaxon elpostolva akárhova a változást.

*/;
//
//	Makes a panel-group accordion
//
//	todo	modal nyitásakor minden más modalt csukjon be (legyen kivétel?)
//	todo	….modal("show|hide") opciót beépíteni


(function ( $ ) {

	$.fn.modal = function ( options ) {

		defaultOptions = {
			selector: {
				default: ".modal",
				modal_dialog: ".modal-dialog",

				// modal position
				modal_top:		".modal-top",
				modal_right:	".modal-right",
				modal_bottom:	".modal-bottom",
				modal_left:		".modal-left",
				modal_center:	".modal-center"
			},
			align: "center",											// top|right|bottom|left|center
			width: "500px",
			keyboard: false,											// true|false - esc-re becsukódik
			id: false,
			class: false
		};

		var o, fnToggle, wrap;

		// a sima kapcsolók szortírozása
		if (typeof options == "string") {
			fnToggle = options;
			o = $.extend(true, {}, defaultOptions);
		} else {
			o = $.extend(true, {}, defaultOptions, options);
		}

		wrap = this[0] ? $(this) : $(o.selector.default);


		// modal kapcsolók definiálása
		$.fn.modal.toggle();

		return wrap.each(function(){
			var modal = $(this),										// a modal maga (full ablakméret)
				modal_dialog = modal.find(o.selector.modal_dialog),		// a modal box része
				modal_width = modal_dialog.outerWidth(),				// kezdeti szélesség a responsove szélességállításhoz
				modal_align = o.align,									// modal igazítása
				dismiss = modal.find("[data-dismiss='modal']"),
				remove = modal.find("[data-remove='modal']"),
				$w = $(window),											// ablak wrap
				isFluid = modal.is(".modal-fluid");						// a modal szélessége fluid-e

			// ha a .modal class mellett van megadva pozíció klassz, annak megfelelően állítja be a pozíció változó értékét a függőleges korrekció kiszámításához
			function setModalAlign() {

				// pozíció beállítása paraméter alapján
				if (modal_align == "top")		{ modal.addClass("modal-top"); }
				if (modal_align == "right")		{ modal.addClass("modal-right"); }
				if (modal_align == "bottom")	{ modal.addClass("modal-bottom"); }
				if (modal_align == "left")		{ modal.addClass("modal-left"); }

				// pozíció lekérdezése és eltárolása class alapján
				if (modal.is(o.selector.modal_top))		{ modal_align = "top"; }
				if (modal.is(o.selector.modal_right))	{ modal_align = "right"; }
				if (modal.is(o.selector.modal_bottom))	{ modal_align = "bottom"; }
				if (modal.is(o.selector.modal_left))	{ modal_align = "left"; }
				if (modal.is(o.selector.modal_center))	{ modal_align = "center"; }
			}

			// függőleges korrekció az align függvényében (leginkább a középre igazítottnál fontos)
			function setModalPosition(position) {
				if (position == undefined || ["center", "right", "left"].indexOf(position) >= 0) { modal_dialog.css({ "margin-top": Math.ceil(modal_dialog.outerHeight() * -0.5) }); }
			}

			// responsive szélesség kezelése – ha a beállított minimum alá csökken az ablakméret
			function setModalWidth() {
				if ($w.innerWidth() < modal_width && !isFluid) {
					modal.addClass("modal-fluid");
				} else if (!isFluid) {
					modal.removeClass("modal-fluid");
				}
			}

			// modal megjelenítése
			function showModal() {
				$(".modal").hide();						// modalok elrejtése
				modal.trigger("modalbeforelaunch");		// modal megnyitás előtti esemény triggelése
				modal.fadeIn(100);						// modal megjelenítése
				modal.trigger("modallaunch");			// modal megnyitás esemény triggelése a méretezéshez és igazításhoz
			}

			// modal elrejtése
			function hideModal() {
				modal.trigger("modalbeforeclose");
				modal.fadeOut(100);
				modal.trigger("modalclose");
			}

			// átméretezésnél újraszámolja a függőleges igazítást és a szélességet
			$w.on("resize", function () {
				setModalPosition(modal_align);
				setModalWidth()
			});

			// a modalban lévő dismiss gombokat aktiválja ha vannak
			dismiss.off().on("click", function (e) {
				e.preventDefault();
				modal.fadeOut(100);
			});

			// a modalban lévő remove gombokat aktiválja ha vannak
			remove.off().on("click", function (e) {
				e.preventDefault();
				modal.fadeOut(100);
				modal.remove();
			});

			modal.on("modallaunch", function () {
				setModalAlign();
				setModalPosition(modal_align);
				setModalWidth();
				modal.trigger("modalopen");
			});

			if (fnToggle == "show") {
				showModal();
			}

			setModalAlign();
			setModalPosition(modal_align);
			setModalWidth();

			if (fnToggle == "hide") {
				console.log("hájd");
				hideModal();
			}

			// dismiss gomb definiálása
//			$.fn.modal.dismiss();

			// toggle gomb definiálása
//			$.fn.modal.toggle();
		});
	};

	// modal bezására gombok definiálása
	$.fn.modal.dismiss = function ( options ) {

		defaultOptions = {
			selector: {
				default: "[data-dismiss='modal']"
			},
			keyboard: false
		};

		var o = $.extend(true, {}, defaultOptions, options),
			wrap = this[0] ? $(this) : $(o.selector.default);

		return wrap.each(function() {
			var dismiss = $(this),
				modal = dismiss.parents(".modal");

			dismiss.on("click", function (e) {
				e.preventDefault();
				modal.trigger("modalbeforeclose");
				modal.fadeOut(100);
				modal.trigger("modalclose");
			});
		});
	};

	// modal törlés gombok definiálása
	$.fn.modal.remove = function ( options ) {

		defaultOptions = {
			selector: {
				default: "[data-remove='modal']"
			},
			keyboard: false
		};

		var o = $.extend(true, {}, defaultOptions, options),
			wrap = this[0] ? $(this) : $(o.selector.default);

		return wrap.each(function() {
			var dismiss = $(this),
				modal = dismiss.parents(".modal");

			dismiss.on("click", function (e) {
				e.preventDefault();
				modal.trigger("modalbeforeremove");
				modal.fadeOut(100);
				modal.remove();
				modal.trigger("modalremove");
			});
		});
	};

	// modal megnyitása gomdok definiálása
	$.fn.modal.toggle = function ( options ) {

		defaultOptions = {
			selector: {
				default: "[data-toggle='modal']"
			}
		};

		var o = $.extend(true, {}, defaultOptions, options),
			wrap = this[0] ? $(this) : $(o.selector.default);

		return wrap.each(function() {
			var modalToggle = $(this);
			if (modalToggle.attr("data-target") !== "") {
				modalToggle.off().on("click", function (e) {
					e.preventDefault();
					$(".modal").hide();													// modalok elrejtése
					$(modalToggle.attr("data-target")).trigger("modalbeforelaunch");	// modal megnyitás előtti esemény triggelése
					$(modalToggle.attr("data-target")).fadeIn(100);						// modal megjelenítése
					$(modalToggle.attr("data-target")).trigger("modallaunch");			// modal megnyitás esemény triggelése a méretezéshez és igazításhoz
				});
			}
		});
	};

} (jQuery));
;//
//	Névnap lekérdezés
//
//	A selector szövegét lecserélve a json adott sorának tartalmát kiírja.
//
//	json formátuma:
//
//	"namedays": [
//		["01", "01", "Fruzsina"],
//		["01", "02", "Ábel"],
//		["01", "03", "Benjámin, Genovéva"],
//		["01", "04", "Leóna, Titusz"],
//		["01", "05", "Simon"],
//		...
//	]}
//
//
//	done URL-t konfigolhatóvá tenni


(function ( $ ) {

	$.fn.setNameDay = function ( options ) {

		var defaults = {
				path: "../lib/greenbox/js/js-data/nameday.hu.json",
				date: new Date(),
				language: "hu",
				separator: ", "
			},
			o = $.extend(true, {}, defaults, options),
			wrap = $(this);

		return wrap.each( function () {
			var nameDay = $(this);

			$.getJSON(o.path, function(data) {
				nameDay.text( data[o.date.getMonth()][o.date.getDate() - 1].join(o.separator) );
			});
		});
	};

	$.fn.getNameDay = function ( options ) {

		var defaults = {
				path: "../lib/greenbox/js/js-data/nameday.hu.json",
				date: new Date(),
				language: "hu",
				separator: ", "
			},
			o = $.extend(true, {}, defaults, options);

		$.getJSON(o.path, function(data) {
			return data[o.date.getMonth()][o.date.getDate() - 1].join(o.separator);
		});
	};

} (jQuery));


/*
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
};*/
;
//
//	Makes a panel-group accordion
//
//	todo	kívülről hívható pluginekkel kapcsolgatni a panel elemeit


(function ( $ ) {

	$.fn.panelAccordion = function ( options ) {

		defaultOptions = {
			selector: ".panel-group.accordion",		//	default selector
			set: {
				status: "default",					//	default|expanded|collapsed – first or selected is expanded|all expanded|all collapsed
				hashAutoExpand: false,				//	opens for mydomain.com#hash if available in page-title
				expanded: [],						//	undefined|[]|[0,1,2,…] expands these items on launch – undefined, empty array or array listed with expandable items
				autoCollapse: false					//	when a panel opens, all others closes automatically
			},
			selectors: {
				panel:			".panel",
				expandedClass: 	"expanded",
				collapsedClass:	"collapsed",
				toggle:			"[data-panel-toggle]",
				expand:			"[data-panel-expand]",
				collapse:		"[data-panel-collapse]",
				expandAll:		"[data-panel-expandAll]",
				collapseAll:	"[data-panel-collapseAll]"
			}
		};

		var o = $.extend(true, {}, defaultOptions, options),
			wrap = this[0] ? $(this) : $(o.selector),
			linkSelector = this.selector,
			windowHash = window.location.hash;


		return wrap.each(function(){

			var panelGroup = $(this),
				panels = panelGroup.find(o.selectors.panel),
				hashPanel = panels.find(windowHash).closest(o.selectors.panel);

			init();

//			Beállítja a paramétereknek vagy URL hash-nek megfelelő megjelenést
			function init() {

				// Set status default, expand all or collapse all
				if (o.set.status == "expanded") {
					expandAllPanel();
				} else if (o.set.status == "collapsed") {
					collapseAllPanel();
				}

				// Set expanded panels by option. This has higher priority than expand/collapse all
				if (o.set.expanded.length > 0 && o.set.expanded !== undefined) {
					for (var i = 0; i < o.set.expanded.length; i++) {
						if (o.set.expanded[i] >= 0 && o.set.expanded[i] < panels.length) {						// ha panelen darabszámon belüli értéket adunk meg
							panels.eq(o.set.expanded[i]).addClass(o.selectors.expandedClass);	// rendelje hozzá a kinyitás classt
						}
					}
				}

				// Set URL Hashed panel expanded if exists. This overwrites everything else before
				if (o.set.hashAutoExpand && windowHash !== "" && hashPanel.length > 0) {
					expandPanel(panels.index(hashPanel));
					document.location.href = windowHash;
				}

				// Event handlers
				// Toggle
				panelGroup.find(o.selectors.toggle).on("click", function(e) {
					e.preventDefault();
					var parentPanel = $(this).closest(o.selectors.panel);

					// Ha autoCollapse be van kapcsolva
					if (o.set.autoCollapse) {
						if (parentPanel.is(".expanded")) {
							collapsePanel(panels.index(parentPanel));
						} else {
							expandPanel(panels.index(parentPanel));
							collapseAllPanel(panels.index(parentPanel));
						}

					// Ha autoCollapse nincs bekapcsolva
					} else {
						togglePanel(panels.index(parentPanel));
					}
				});

				// Expand
				panelGroup.find(o.selectors.expand).on("click", function(e) {
					e.preventDefault();
					var parentPanel = $(this).closest(o.selectors.panel);
					expandPanel(panels.index(parentPanel));

					if (o.set.autoCollapse) {
						collapseAllPanel(panels.index(parentPanel))
					}
				});

				// Collapse
				panelGroup.find(o.selectors.collapse).on("click", function(e) {
					e.preventDefault();
					collapsePanel($(this).closest(o.selectors.panel).index());
				});

				// Expand all
				panelGroup.find(o.selectors.expandAll).on("click", function(e) {
					e.preventDefault();
					expandAllPanel();
				});

				// Collapse all
				panelGroup.find(o.selectors.collapseAll).on("click", function(e) {
					e.preventDefault();
					collapseAllPanel();
				});
			}

//			Kinyit vagy bezár egy panelt állapotától függően
			function togglePanel(panelCounter) {
				panels.eq(panelCounter).toggleClass(o.selectors.expandedClass);
			}

//			Kinyit egy panelt
			function expandPanel(panelCounter) {
				panels.eq(panelCounter).addClass(o.selectors.expandedClass);
			}

//			Bezár egy panelt
			function collapsePanel(panelCounter) {
				panels.eq(panelCounter).removeClass(o.selectors.expandedClass);
			}

//			Kinyitja mindegyiket, kivéve a paraméterben megadottat ha van
			function expandAllPanel(except) {
				panels.not( panels.eq(except) ).addClass(o.selectors.expandedClass);
			}

//			Bezárja mindegyiket, kivéve a paraméterben megadottat ha van
			function collapseAllPanel(except) {
				panels.not( panels.eq(except) ).removeClass(o.selectors.expandedClass);
			}
		});
	};

} (jQuery));
;
//
//	Scroller
//

/*
	Általános működés

	Feltételek:
	• kellenek blokkok, amiket egymás mellé rendeznénk,
	• kell egy row, aminek a szélessége követi a három egymás mellé rendezett blokkét és egyenesen tartja őket,
	• kell egy wrapper, amin belül a row mozgatásra kerül
	• a slider szélességét a wrapper határozza meg!
*/

(function ( $ ) {

	$.fn.scroller = function ( options ) {

		var o = $.extend(true, {}, $.fn.scroller.defaultOptions, options),
			wrap = $(this);

		wrap.each(function () {
			var wrapper = $(this),
				row = wrapper.children(o.row).first(),
				blocks = row.children(o.block),
				blockLength = blocks.length,
				firstBlock,
				lastBlock,
				loop,
				timer;


			// elemek inicializálása, alapértékek beállítása
			function init() {

				// az első beállítása
				firstBlock = blocks.first();
				lastBlock = blocks.last();

				// alap stílusok beállítása
				wrapper.css(o.style.wrapper);
				row.css(o.style.row);
				blocks.css(o.style.blocks).css(o.style.anim);
				blocks.filter(":nth-child(n+2)").hide();			// a kezdeti border elcsúszásokat fixálja

				// szélességek beállítása
				row.css("width", (blockLength * 100) + "%");
				row.children().css("width", (100 / blockLength) + "%");

				if (blockLength > 1) {
					var timer = setTimeout(function () {
						startLoop();
						setEventhandlers();							// a hover eseményt is csak akkor kezeli le ha egynél több elem van
					}, o.delay);
				}
			}

			function setEventhandlers() {
				row.children().hover(
					function () {
						stopLoop();
					},
					function () {
						startLoop();
					});
			}

			// loop indítása
			function startLoop() {

				blocks.css({
					"transition-duration": o.animDuration,
					"-o-transition-duration": o.animDuration,
					"-moz-transition-duration": o.animDuration,
					"-webkit-transition-duration": o.animDuration
				});

				loop = setInterval(function() {
					blocks.show();
					setNext();
				}, o.duration);
			}

			// stop loop
			function stopLoop() {
				clearInterval(loop);

			}

			// következő slide
			function setNext() {
				firstBlock.css(o.style.firstMinus);
				var timer = setTimeout(function () {
					firstBlock.insertAfter( lastBlock );
					firstBlock = row.children().first();
					lastBlock = row.children().last();
					lastBlock.css(o.style.firstZero);
				}, o.duration / 2)
			}

			init();
		});
	};


//	--------------------------------------------------------------------------------------------------------------------
//	Default values

	$.fn.scroller.defaultOptions = {
		delay: 0,
		duration: 5000,
		animDuration: "2s",
		selector: {
			row: "",
			block: ""
		},
		style: {
			wrapper: {
//				"width": "500px",
				"position": "relative",
				"overflow": "hidden"
			},
			row: {},
			blocks: {
				"float": "left",
				"margin-left": "0%",
				"margin-right": 0
			},
			firstZero: {
				"margin-left": "0%"
			},
			firstMinus: {
				"margin-left": "-100%"
			},
			anim: {
				"transition-property": "all",
				"-o-transition-property": "all",
				"-moz-transition-property": "all",
				"-webkit-transition-property": "all",
				"transition-timing-function": "ease-in-out",
				"-o-transition-timing-function": "ease-in-out",
				"-moz-transition-timing-function": "ease-in-out",
				"-webkit-transition-timing-function": "ease-in-out"
			}
		}
	};
} (jQuery));;//
//	Select Go To based on its value if value attribute exists
//	todo target
//


(function ( $ ) {

	$.fn.selectGoTo = function ( options ) {

		var defaultOptions = {
			selector: ".select--goto"
		};

		var o = $.extend({}, defaultOptions, options),
			wrap = this[0] ? $(this) : $(o.selector);

		return wrap.each(function(){
			var selectItem = $(this);
			selectItem.change(function () {
				if (selectItem.children("[value='" + selectItem.val() + "']").length > 0 ) {
					location.href = selectItem.val();
				}
			});
		});
	};

} (jQuery));