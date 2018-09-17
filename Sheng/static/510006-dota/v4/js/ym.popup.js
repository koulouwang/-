(function(window, $) {

	function Popup(container, options) {
		var t = this;

		t.options 		= 	$.extend({}, Popup.defaultOptions, options || {});
		t.$element 		= 	$(container);
		t.$btnShow		=	(t.options.btnShow) ? $(t.options.btnShow) : null;
		t.$btnHide 		=   t.$element.find(t.options.btnHide);

		t.__initialize();
		t.__initEvents();
	};

	Popup.prototype.__initialize = function() {
		var t = this;

		t._isShow = false;
		t.$element.css({'position': 'fiexd', 'display': 'none'});
	};

	// 初始化元素事件
	Popup.prototype.__initEvents = function() {
		var t = this;

		t.__updateLayoutDelegate = function() {
			t.__updateLayout();
		};

		t.__hideDelegate = function() {
			t.hide();
			return false;
		};

		t.__showDelegate = function() {
			t.show();
			return false;
		};

		if(t.$btnShow) {
			$(t.options.btnShow).click(t.__showDelegate);
		}

		if(t.$btnHide) {
			t.$btnHide.click(t.__hideDelegate);
		}

		if(t.options.defaultState !== 'hide') {
			t.show();
		}
	};

	// 居中窗口
	Popup.prototype.__updateLayout = function() {
		var t = this,
			__$window = $(window),
			__$document = $(document),
			__xpos = (__$window.width() - t.$element.outerWidth()) * 0.5,
			__ypos = (__$window.height() - t.$element.outerHeight()) * 0.5,
			__docw = __$document.width(),
			__doch = __$document.height();

		if(__xpos < 0) __xpos = 0;
		if(__ypos < 0) __ypos = 0;

		t.$mask.css({
			'width'		: __docw + 'px',
			 'height'	: __doch + 'px',
			  'z-index'	: t.options.zIndex - 1
		});

		t.$element.css({
			'top'		: __ypos + 'px',
			 'left'		: __xpos + 'px',
			  'z-index'	: t.options.zIndex
		});
	};

	// 显示
	Popup.prototype.show = function() {
		var t = this;

		if(t._isShow) { return; }

		t._isShow = true;
		if(!t.$mask) {
			t.$mask = $('<div></div>');
			t.$mask.css({
				'position'					: 'absolute',
				 'left'						: '0',
				  'top'						: '0',
				   'display'				: 'none',
				    'background'			: '#000',
				     'opacity'				: t.options.maskOpacity,
				      'background-color'	: t.options.maskBackground
			});
        	t.$mask.appendTo('body');
       	}

		t.__updateLayout();
		if(t.options.maskClose) {
			t.$mask.bind('click', t.__hideDelegate);
		}
		$(window).bind('resize', t.__updateLayoutDelegate);
		t.$mask.fadeIn(t.options.speed);
		t.$element.fadeIn(t.options.speed);
		t.options.onShow && (typeof this.options.onShow === 'function') && t.options.onShow.call(t);
	};

	// 隐藏
	Popup.prototype.hide = function() {
		var t = this;

		if(!t._isShow) { return; }

		t._isShow = false;
		$(window).unbind('resize', t.__updateLayoutDelegate);
		t.$mask.unbind('click');
		t.$mask.fadeOut(t.options.speed, function() {
			t.$mask.remove();
			t.$mask = null;
		});
		t.$element.fadeOut(t.options.speed);
		t.options.onShow && (typeof this.options.onShow === 'function') && t.options.onShow.call(t);
	};


	// 默认配置参数
	Popup.defaultOptions = {

		btnShow: null,  // 打开按钮[全局]

		btnHide: '.btnclose',  // 关闭按钮

		maskOpacity: 0.3,  // 遮罩透明度

		maskClose: false,  // 点击遮罩是否关闭弹出层

		defaultState: 'hide', // 默认显示状态

		maskBackground: '#000',  // 遮罩背景颜色

		speed: 500, // 缓动时间

		zIndex: 9999,

		onShow: null,  // 显示时回调

		onHide: null  // 隐藏时回调
	};

	// jQuery 命名空间, new 方式调用
	$.ym = $.ym || {};
	$.ym.Popup = Popup;

	// jQuery 快捷方式调用
	$.fn["ymPopup"] = function(options) {
		return this.each(function() {
			new Popup(this, options);
		});
	};


})(window, jQuery);