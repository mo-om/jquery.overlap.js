/*
 * jQuery overlap Plugin
 * chengwei915@gmail.com
 */

;(function ( $, window, document, undefined ) {

	// definde global variables
    var pluginName = 'overlap',
    	mousedown = false,
    	overlapBox = null,
    	startPoint = { x:0, y:0 };


	// constants
    var	unit_px = 'px',
    	tag_html = 'html',
    	selector_selected = '.selected',
    	classname_selected = 'selected',
    	selector_overlapbox = '.overlap-box',
    	selector_overlaparea = '.overlap-area',
    	item_selector = '.overlap-item',
    	item_selected = '.overlap-item' + selector_selected;
    	

    // The actual plugin constructor
    function Overlap( element, options ) {

    	// Merge the defaults and options together an return a new options
        this.options = $.extend( {}, $.fn[pluginName].defaults, options );

        // dom element
        this.element = element;

        // jQuery obj
        this.$element = $(element);

        this.init();
    }


	Overlap.fn = Overlap.prototype = {
		constructor: Overlap,
		init: function () {
			this.action().start()
		},
		isCtrlKey: function (e) {
			return e.ctrlKey && this.options.ctrlKey
		},
		isShiftKey: function (e) {
			return e.shiftKey && this.options.shiftKey
		},
		hasSelectedItem: function(){
			return this.getSelectedItems().size() > 0;
		},
		getItems: function () {
			return this.$element.find(item_selector)
		},
		getSelectedItems: function () {
			return this.$element.find(item_selected)
		},
		selectAll: function() {
			this.getItems().addClass(classname_selected)
		},
		deselectAll: function(e) {
			if (!this.isCtrlKey(e) && !this.isShiftKey(e)) {
				this.getItems().removeClass(classname_selected)
			}
		},
		toggleSelect: function(e) {
			var cur = $(e.currentTarget),
				siblingsDeselect = function () {
					cur.siblings().removeClass(classname_selected);
				};
			if (!this.isCtrlKey(e)) {
				if (this.getSelectedItems().size() > 1) {
					siblingsDeselect()
					return;
				}
				siblingsDeselect()
			}
			if (!cur.hasClass(classname_selected)) {
				cur.addClass(classname_selected);
				return;
			}
			cur.removeClass(classname_selected);
			stopPropagation(e);
		},
		createOverlapBox: function(e) {
			disableSelectstart()
			if (!overlapBox) {
				var ex = e.pageX, ey = e.pageY;
				mousedown = true;
				startPoint.x = ex;
				startPoint.y = ey;
				overlapBox = $('<div class="overlap-box"></div>').appendTo(document.body).show();
			}
		},
		setOverlapBoxPos: function(e) {
			var $items = this.getItems(),
				len = $items.size(),
				i = len - 1,

				ex = e.pageX,
				ey = e.pageY,
				startPointX = startPoint.x,
				startPointY = startPoint.y,

				mouse_towords_es = ex > startPointX && ey > startPointY, // 东南方向
				mouse_towords_wn = ex < startPointX && ey < startPointY, // 西北方向
				mouse_towords_ws = ex < startPointX && ey > startPointY, // 西南方向
				mouse_towords_en = ex > startPointX && ey < startPointY; // 东北方向

			
			if( mousedown ) {
				if( mouse_towords_es ) {
					overlapBox.css({
						top    : startPointY         + unit_px,
						left   : startPointX         + unit_px,
						width  : +(ex - startPointX) + unit_px,
						height : +(ey - startPointY) + unit_px
					})
				}else if( mouse_towords_wn ) {
					overlapBox.css({
						top    : ey                  + unit_px,
						left   : ex                  + unit_px,
						width  : -(ex - startPointX) + unit_px,
						height : -(ey - startPointY) + unit_px
					})
				}else if( mouse_towords_ws ) {
					overlapBox.css({
						top    : startPointY         + unit_px,
						left   : ex                  + unit_px,
						width  : -(ex - startPointX) + unit_px,
						height : +(ey - startPointY) + unit_px
					})
				}else if( mouse_towords_en ) {
					overlapBox.css({
						top    : ey                  + unit_px,
						left   : startPointX         + unit_px,
						width  : +(ex - startPointX) + unit_px,
						height : -(ey - startPointY) + unit_px
					})
				}

				for (; i >= 0; i--) {
					
					var $item = $($items[i]),

						// To fixed IE7 offset bug we used $(selector).offset().top/left but not dom.offsetTop/Left
						// item 边界
						i_n = $item.offset().top,
						i_w = $item.offset().left,
						i_s = i_n + $item.outerHeight(),
						i_e = i_w + $item.outerWidth(),
						
						// overlapBox 边界
						o_n = overlapBox.offset().top,
						o_w = overlapBox.offset().left,
						o_s = o_n + overlapBox.outerHeight(),
						o_e = o_w + overlapBox.outerWidth(),

						// select | deselect | isSelected
						select = function() { $item.addClass(classname_selected) },
						deselect = function() { $item.removeClass(classname_selected) },
						isSelected = function () { return $item.hasClass(classname_selected) };

					if (
						// $item 任意一个角在选区 overlapBox 内
						// 满足以下条件之一则 overlapBox 和 $item 有交集
						(i_w > o_w && i_n > o_n && i_w < o_e && i_n < o_s ) || 
						(i_e > o_w && i_n > o_n && i_e < o_e && i_n < o_s ) || 
						(i_e > o_w && i_s > o_n && i_e < o_e && i_s < o_s ) || 
						(i_w > o_w && i_s > o_n && i_w < o_e && i_s < o_s ) || 
						// 选区 overlapBox 不完全覆盖 $item 分为水平方向或垂直方向
						(o_n > i_n && o_s > i_n && o_n < i_s && o_s < i_s && o_e > i_w && o_w < i_e ) || 
						(o_w > i_w && o_e > i_w && o_w < i_e && o_e < i_e && o_s > i_n && o_n < i_s )
					) {
						// if (this.isCtrlKey(e)) {

						// 	this.getSelectedItems().removeClass(item_selected);
						// 	return
						// };
						select();
						
					}else{
						deselect()
					}
				}
			}
		},
		clearOverlapBox: function () {
			mousedown = false;
			enableSelectstart();
			if (overlapBox) {
				overlapBox.remove();
				overlapBox = null;
			}
		},
		action: function() {
			var parent = scope = this,
				overlapbox = selector_overlapbox,
				overlaparea = selector_overlaparea,
				overlapitem = selector_overlaparea + ' ' + item_selector,
				optOverlapArea = parent.options.overlapArea;

			return {
				start: function () {
					$(document).on('click.overlap'      , overlapitem , $.proxy( parent.toggleSelect, scope ));
					$(document).on('mousedown.overlap'  , overlapitem , stopPropagation);
					$(document).on('mousedown.overlap'  , overlaparea , $.proxy( parent.createOverlapBox, scope ));
					$(document).on('mouseup.overlap'    , $.proxy( parent.clearOverlapBox, scope ));
					$(document).on('mousedown.overlap'  , $.proxy( parent.deselectAll, scope ));
					if ( optOverlapArea === 'defaultelement' ) {
						$(document).on('mousemove.overlap'  , overlaparea , $.proxy( parent.setOverlapBoxPos, scope ));
						$(document).on('mousemove.overlap'  , overlapbox  , $.proxy( parent.setOverlapBoxPos, scope ));
					}else if ( optOverlapArea === document ) {
						$(document).on('mousemove.overlap'  , $.proxy( parent.setOverlapBoxPos, scope ));
					};
				},
				stop: function () {
					$(document).off('click.overlap'     , overlapitem);
					$(document).off('mousedown.overlap' , overlapitem);
					$(document).off('mousedown.overlap' , overlaparea);
					$(document).off('mouseup.overlap');
					$(document).off('mousedown.overlap');
					if ( optOverlapArea === 'defaultelement' ) {
						$(document).off('mousemove.overlap'  , overlaparea);
						$(document).off('mousemove.overlap'  , overlapbox);
					}else if ( optOverlapArea === document ) {
						$(document).off('mousemove.overlap');
					};
				}
			}
		}
	};

    function preventDefault(e){
		e.preventDefault()
	}

	function stopPropagation(e) {
		e.stopPropagation()
	}

	function isCtrlKey(e) {
		return e.ctrlKey
	}

	function isShiftKey(e) {
		return e.shiftKey
	}

	function disableSelectstart(){
		$(tag_html).addClass('disableselectstart'); // to fixed firefox
		$(document).on('selectstart.overlap', preventDefault)
	}

	function enableSelectstart() {
		$(tag_html).removeClass('disableselectstart');
		$(document).off('selectstart.overlap')
	}

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName )) {
                $.data( this, "plugin_" + pluginName, 
                new Overlap( this, options ));
            }
        });
    }

    // create plugin defaults
    $.fn[pluginName].defaults = {
    	ctrlKey: true,
    	overlapArea: 'defaultelement'
	};

	// start or stop plugin
	$.fn[pluginName].start = function () {
    	this.action().start()
    }
	
    $.fn[pluginName].stop = function () {
    	this.action().stop()
    }

})( jQuery, window, document );