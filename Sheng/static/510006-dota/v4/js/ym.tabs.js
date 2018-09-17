(function(window, jQuery) {

	function Tabs(container, options) {
		var t = this;

		t.options 		= 	$.extend({}, Tabs.defaultOptions, options || {});
		t.$element 		= 	$(container);
		t.$tabwrap 		= 	t.$element.children(t.options.tabs);
		t.$tabbtns 		= 	t.$element.children(t.options.indicator).children();
		t.$tabcons 		=	t.$tabwrap.children();

		t.__initialize();  // 初始化
		t.__initEvents();  // 初始化元素事件
	};

	Tabs.prototype.__initialize = function() {
		var t = this;

		t._index 			= 	t.options.defaultIndex;  // 记录当前索引
		t._tabbtnsCount 	= 	t.$tabbtns.size();  // 列表项总的个数
		t._tabwrapSize 		=	t.$tabwrap.outerWidth(true);  // 内容尺寸
		t._effectFn			=	(t.options.effect === 'fade') ? t.__changeByFade : t.__changeByScroll; // 效果回调引用
		t._isAnimate		=	false; // 用来记录当前是否正在执行动画
		t._autoTimer 		=	null;  // 自动播放

		// 默认状态设置
		t.$tabbtns.eq(t._index).addClass(t.options.active);
		t.$tabwrap.css('position', 'relative');
		t.$tabcons.css({'position':'absolute', 'display':'none'});
		t.$tabcons.eq(t._index).css('display', 'block');

		if(t.options.autoSize) {
			t.$tabwrap.css('height', t.$tabcons.eq(t._index).outerHeight(true) + 'px');
		}
	};

	Tabs.prototype.__initEvents = function() {
		var t = this;

		// 左右按钮, 这里是从整个dom中查找
		if(t.options.prev && t.optons.next) {
			t.$btnPrev = $(t.options.btnPrev);
			t.$btnNext = $(t.options.btnNext);

			t.$btnPrev.click(function() {
				t.prev();
				return false;
			});

			t.$btnNext.click(function() {
				t.next();
				return false;
			});
		}

		// 指示器线条
		t.$line = t.$element.children(t.options.indicatorLine);
		t.$line = (t.$line.size()) ? t.$line : null;

		// 指示器节点项
		t.$tabbtns.bind(t.options.bindType, function() {
			t.setIndex( $(this).index() );
			return false;
		});

		// 指示器线条移动
		if(t.$line) {
			t.$tabbtns.bind('mouseenter', function() {
				var __pos = $(this).position();
				t.$line.stop().animate({'left':__pos.left}, t.options.lineSpeed);
			})
			.bind('mouseleave', function() {
				var __pos = t.$tabbtns.eq(t._index).position();
				t.$line.stop().animate({'left':__pos.left}, t.options.lineSpeed);
			});
			// 设置默认位置
			t.$line.css('left', t.$tabbtns.eq(t._index).position().left + 'px');
		}

		// 自动播放
		t.__checkAutoPlay();
	};

	// 检测自动播放设置
	Tabs.prototype.__checkAutoPlay = function() {
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

	Tabs.prototype.__changeTo = function(index) {
		var t = this;

		if(t._index === index || t._isAnimate) { return; }

		t._effectFn.call(t, index);
		t._index = index;

		// 指示器节点项当前状态设置
		t.$tabbtns.
			removeClass(t.options.active).
				eq(index).
					addClass(t.options.active);

		// 指示器线条
		if(t.$line) {
			t.$line.stop(true).css('left', t.$tabbtns.eq(index).position().left + 'px');
		}

		// 自动适应内容的高度
		if(t.options.autoSize){
			var __wrapsize = t.$tabcons.eq(index).outerHeight(true);
			t.$tabwrap.stop().animate({'height': __wrapsize}, t.options.speed);
		}

		// 回调 参数1:对象本身  参数2:索引值
		if(typeof t.options.onChange === 'function') {
			t.options.onChange(t, index);
		}

		// 自动播放
		t.__checkAutoPlay();
	};

	// 渐隐效果
	Tabs.prototype.__changeByFade = function(index) {
		var t = this;

		t.$tabcons.fadeOut(t.options.speed).
			css('z-index', 2).
				eq(index).
					css('z-index', 5).
						stop(true, true).
							fadeIn(t.options.speed);
	};

	// 滚动效果
	Tabs.prototype.__changeByScroll = function(index) {
		var t = this;

		var __scrollpos = (index > t._index) ? t._tabwrapSize : -t._tabwrapSize;  // 滚动值
		var __itemNew = t.$tabcons.eq(index); // 移入元素引用
		var __itemOld = t.$tabcons.eq(t._index);  // 移除元素引用

		// 滚动效果, 等待动画结束之后才能进行下一次切换
		t._isAnimate = true;
		// 动画结束回调
		function __doFinash() {
			t._isAnimate = false;
			__itemOld.css('display', 'none');
		}
		// 移除旧的元素
		__itemOld.animate({'left': -__scrollpos}, t.options.speed);
		// 移入新的元素
		__itemNew.
			css({'display':'block', 'left':__scrollpos}).
				animate({'left': 0}, t.options.speed, __doFinash);
	};

	Tabs.prototype.prev = function() {
		this.setIndex( this._index - 1 );
	};

	Tabs.prototype.next = function() {
		this.setIndex( this._index + 1 );
	};

	Tabs.prototype.setIndex = function(index) {
		var t = this;
		if(index < 0) { index = t._tabbtnsCount - 1; }
		if(index >= t._tabbtnsCount) { index =  0; }
		t.__changeTo(index);
	};

	// 默认配置参数
	Tabs.defaultOptions =  {
		tabs: '.tabs', // 内容项容器选择器

		indicator: '.tab-indicator',  // 指示器容器选择器

		indicatorLine: '.tab-indicator-line', // 指示器线条

		btnPrev: null,  // 左按钮

		btnNext: null,  // 右按钮

		active: 'active',  // 当前激活样式

		bindType: 'click', // 绑定事件类型

		effect: 'fade',  // 效果类型[fade  scroll]

		defaultIndex: 0,  // 默认选中索引

		speed: 600,  // 动画缓动时间

		lineSpeed: 200,  // 指示器线条缓动时间

		autoSize: true,  // 是否自动计算内容的高度

		autoDelay: 0,  // 自动播放等待时间[0为不自动播放,一般设置6000等于六秒]

		onChange: null  // 切换时回调
	};


	// jQuery 命名空间, new 方式调用
	$.ym = $.ym || {};
	$.ym.Tabs = Tabs;

	// jQuery 快捷方式调用
	$.fn["ymTabs"] = function(options) {
		return this.each(function() {
			new Tabs(this, options);
		});
	};

})(window, jQuery);