/**
 *    yemu
 *    version 1.0.0
 *    updatetime 2015.06.19
 *
 *
 *
 * ---jQuery调用方式---
 * 		$(selector).ymSlider({});
 *
 * ---原生调用方式---
 * 		new ym.Slider(selector, {});
 *
 * ---对象公开方法---
 * 		@通过上面的调用方式, 会返回一个对象的引用,可以用一个变量保存对它的引用, 调用公开的方法
 *
 * 		var slider = $(selector).ymSlider({});
 * 		var slider = new ym.Slider(selector, {});
 *
 *   	@下面为公开的方法
 * 		 	slider.prev(); 			 // 跳到上一个
 * 		 	slider.next(); 			 // 跳到下一个
 * 		 	slider.setIndex(index);  // 跳到指定的索引位置
 */

(function(window, $) {

	function Slider (container, options) {
		var t = this;

		t.options 		= 	$.extend({}, Slider.defaultOptions, options || {});
		t.$element 		= 	$(container); // 容器元素
		t.$slidewrap  	=	t.$element.children(t.options.sliders);  // 内容容器
		t.$slidebtns	=	t.$element.find(t.options.indicator).children();  // 指示器节点项集合
		t.$slidecons	=	t.$slidewrap.children(); // 内容切换集合

		t.__initialize();  // 初始化
		t.__initEvents();  // 初始化事件监听
	};

	Slider.prototype.__initialize = function() {
		var t = this;

		t._index 			= 	t.options.defaultIndex;  // 记录当前索引
		t._slidebtnsCount 	= 	t.$slidebtns.size();  // 列表项总的个数
		t._slidewrapSize 	=	t.$slidewrap.outerWidth(true);  // 内容尺寸
		t._effectFn			=	(t.options.effect === 'fade') ? t.__changeByFade : t.__changeByScroll; // 效果回调引用
		t._isAnimate		=	false; // 用来记录当前是否正在执行动画
		t._autoTimer		=	null;  // 定时器
		// t._lastOverIndex 	= 	null;  // 当事件为mouseenter || mouseover 时, 则使用延迟解决多触发问题

		// 默认状态设置
		t.$slidebtns.eq(t._index).addClass(t.options.active);
		t.$slidewrap.css('position', 'relative');
		t.$slidecons.css({'position':'absolute', 'display':'none'});
		t.$slidecons.eq(t._index).css('display', 'block');
	};

	Slider.prototype.__initEvents = function() {
		var t = this;

		// 左右按钮
		if(t.$element.find(t.options.btnPrev).size()) {
			t.$btnPrev = t.$element.find(t.options.btnPrev);
			t.$btnNext = t.$element.find(t.options.btnNext);

			t.$btnPrev.click(function() {
				t.prev();
				return false;
			});

			t.$btnNext.click(function() {
				t.next();
				return false;
			});

			if(t.options.autoArrowVisible) {
				t.$element.bind('mouseenter', function() {
					t.$btnPrev.fadeIn(t.options.autoArrowSpeed);
					t.$btnNext.fadeIn(t.options.autoArrowSpeed);
				}).
				bind('mouseleave', function() {
					t.$btnPrev.stop(true).fadeOut(t.options.autoArrowSpeed);
					t.$btnNext.stop(true).fadeOut(t.options.autoArrowSpeed);
				});
			}

			t.$btnPrev.css('display', 'block');
			t.$btnNext.css('display', 'block');
		}

		// 指示器节点项
		t.$slidebtns.bind(t.options.bindType, function() {
			t.setIndex( $(this).index() );
			return false;
		});

		/*if(t.options.bindType == 'mouseenter' || t.options.bindType == 'mouseover') {

			t.$slidebtns.bind('mouseleave', function() {

			});
		}*/

		// 自动播放
		t.__checkAutoPlay();
	};

	Slider.prototype.__changeTo = function(index) {
		var t = this;

		if(t._index === index || t._isAnimate) { return; }

		t._effectFn.call(t, index);
		t._index = index;

		// 指示器节点项当前状态设置
		t.$slidebtns.
			removeClass(t.options.active).
				eq(index).
					addClass(t.options.active);

		// 回调 参数1:对象本身  参数2:索引值
		if(typeof t.options.onChange === 'function') {
			t.options.onChange(t, index);
		}
		// 自动播放
		t.__checkAutoPlay();
	};

	// 检测自动播放设置
	Slider.prototype.__checkAutoPlay = function() {
		var t = this;

		if(t.options.autoDelay && t.options.autoDelay !== 0) {
			if(t._autoTimer) {
				clearTimeout(t._autoTimer);
				t._autoTimer = null;
			}
			t._autoTimer = setTimeout(function() {
				t.next();
			}, t.options.autoDelay);
		}
	};

	// 渐隐效果
	Slider.prototype.__changeByFade = function(index) {
		var t = this;

		t.$slidecons.fadeOut(t.options.speed).
			css('z-index', 2).
				eq(index).
					css('z-index', 5).
						stop(true, true).
							fadeIn(t.options.speed);
	};

	// 滚动效果
	Slider.prototype.__changeByScroll = function(index) {
		var t = this;

		var __scrollpos = (index > t._index) ? t._slidewrapSize : -t._slidewrapSize;  // 滚动值
		var __itemNew = t.$slidecons.eq(index); // 移入元素引用
		var __itemOld = t.$slidecons.eq(t._index);  // 移除元素引用

		// 滚动效果, 等待动画结束之后才能进行下一次切换
		t._isAnimate = true;
		// 动画结束回调
		function __doFinash() {
			__itemOld.css('display', 'none');
			t._isAnimate = false;
		}
		// 移除旧的元素
		__itemOld.animate({'left': -__scrollpos}, t.options.speed);
		// 移入新的元素
		__itemNew.
			css({'display':'block', 'left':__scrollpos}).
				animate({'left': 0}, t.options.speed, __doFinash);
	};

	Slider.prototype.prev = function() {
		this.setIndex( this._index - 1 );
	};

	Slider.prototype.next = function() {
		this.setIndex( this._index + 1 );
	};

	Slider.prototype.setIndex = function(index) {
		var t = this;
		if(index < 0) { index = t._slidebtnsCount - 1; }
		if(index >= t._slidebtnsCount) { index =  0; }
		t.__changeTo(index);
	};

	// 默认配置参数
	Slider.defaultOptions = {
		sliders: '.slides', // 内容项容器选择器

		indicator: '.indicator',  // 指示器容器选择器

		btnPrev: '.prev',  // 左按钮

		btnNext: '.next',  // 右按钮

		active: 'active',  // 当前激活样式

		bindType: 'click', // 绑定事件类型

		effect: 'fade',  // 效果类型[fade  scroll]

		defaultIndex: 0,  // 默认选中索引

		autoArrowVisible: false,  // 是否自动隐藏左右按钮

		autoArrowSpeed: 0,  // 左右按钮显示隐藏缓动时间

		speed: 600,  // 动画缓动时间

		autoDelay: 0,  // 自动播放等待时间[0为不自动播放,一般设置6000等于六秒]

		onChange: null  // 切换时回调
	};

	// jQuery 命名空间, new 方式调用
	$.ym = $.ym || {};
	$.ym.Slider = Slider;

	// jQuery 快捷方式调用
	$.fn["ymSlider"] = function(options) {
		return this.each(function() {
			new Slider(this, options);
		});
	};

})(window, jQuery);