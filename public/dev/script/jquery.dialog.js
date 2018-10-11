/*
 * ------------------------------------------------------------------------------------------------
 * 1. 插件名称：autoDialog
 * 2. 插件描述：系统默认对话框
 * 3. 版本：1.0
 * 4. 对其他插件的依赖：强制依赖于 jQuery
 * 5. 参数说明：
	options:{
		'title': '', //标题文字
		'show': false, //初始化时是否直接显示dialog,true：显示 | false：隐藏
		'width': 300, //dialog的宽度，单位px
		'className': null, //dialog自定义class样式名称
		'defaultCss': true, //是否载入默认CSS
		'bgClose': false, //是否支持点击背景关闭对话框
		'move': false, //是否支持移动对话框
		'isShowClose': true, //是否显示右上角×
		'content':"", //插入中间的内容
		'closeFun': null //dialog 关闭后的回调事件
	};
	'open' //打开对话框
	'close' //关闭对话框
 * 6. 未尽事宜：
 * 7. 作者：bangyao.chen@51auto.com
 *---------------------------------------------------------------------------------------------------
 */

/*----------------------------------------------------------------
 *  方法主体
 *-----------------------------------------------------------------*/
(function($) {
	$.fn.autoDialog = function(options) {
		'use strict';
		var options = arguments[0];
		var alertCon = arguments[1];
		if (typeof options == 'object') {
			var settings = $.extend(true, {}, {
				'title': '', //标题文字
				'show': false, //初始化时是否直接显示dialog,true：显示 | false：隐藏
				'width': 450, //dialog的宽度，单位px
				'className': null, //dialog自定义class样式名称
				'defaultCss': true, //是否载入默认CSS
				'bgClose': false, //是否支持点击背景关闭对话框
				'move': false, //是否支持移动对话框
				'isShowClose': true, //是否显示右上角×
				'content': "", //插入中间的内容
				'closeFun': null //dialog 关闭后的回调事件
			}, options);
		} else if (typeof options != 'string') {
			throw new Error('Dialog Parameter error : options error !');
			return false;
		}

		//方法集合
		function fun(element, opts) {
			this.opts = opts;
			this._this = $(element);
			this.isIE6 = /MSIE 6.0/.exec(navigator.userAgent);
			//初始化
			this.init();
		};

		//初始加载事件
		fun.prototype = {
			init: function() {
				var root = this;
				var html = '<div class="auto-dialog ' + (root.opts.className || '') + '"  style="display: none;">' 
						+ '		<div class="dialog-container" style="width:' + (root.opts.width || 450) + 'px;">' 
						+ '			<h4 class="dialog-head">' 
						+ '				<span class="dialog-title">' + (root.opts.title || '') + '</span>' 
						+ 				(root.opts.isShowClose ? '<a href="javascript:;" class="dialog-close">×</a>' : '')
						+ '			</h4>' 
						+ '			<div class="dialog-body"></div>' 
						+ '		</div>' 
						+ '		<div class="dialog-bg"></div>' 
						+ '</div>';
				root.myDialog = $(html.replace(/>\s+</g, '><')).appendTo(document.body);
				root.container = $('.dialog-container', root.myDialog).get(0);
				root.bg = $('.dialog-bg', root.myDialog).get(0);
				root.content = $('.dialog-body', root.myDialog).get(0);
				root.closebtn = $('.dialog-close', root.myDialog).get(0);
				root._this.show().appendTo(root.content);
				//插入插入CSS
				// root.insertCssFun();
				//绑定点击事件
				root.attachEventFun();

				root.isIE6 && root.bgResize();
				//是否初始显示Dialog
				root.opts.show && setTimeout(function() {
					root.open();
				}, 500);
			},

			//插入CSS
			insertCssFun: function() {
				//检测已经存在CSS && 判断是否需要插入CSS
				if ($("#autoDialogCss").length && this.opts.defaultCss) return false;
				var _head = $("head");
				var link = document.createElement("link");
				link.id = "autoDialogCss";
				link.rel = "stylesheet";
				link.type = "text/css";
				link.href = "http://cdn01.51autoimg.com/51auto/js/util/51autodialog/css/51autodialog.min.css";
				// link.href = "../css/51autodialog.min.css";
				if(_head.children('link').length){
					_head.children('link:eq(0)').before(link);
				}else{
					_head.append(link);
				}
			},

			//停止事件冒泡
			stopBubble: function(e) {
				//如果提供了事件对象，则这是一个非IE浏览器
				if (e && e.stopPropagation) {
					e.stopPropagation();
				} else {
					//用IE的方式来取消事件冒泡
					window.event.cancelBubble = true;
				}
			},

			//事件绑定
			attachEventFun: function() {
				var root = this;
				//右上角×的事件绑定
				$(root.closebtn).on('click.51autodialog', this, function(e) {
					root.close();
					root.stopBubble(e);
					return false;
				});
				//屏幕改变大小改变弹窗大小
				$(window).resize(function() {
					setTimeout(function() {
						root.boxResize();
					}, 200);
				});
				//点击背景关闭对话框
				root.opts.bgClose && $(root.bg).on('click.51autodialog', this, function(e) {
					root.close();
					root.stopBubble(e);
					return false;
				});

				//移动对话框
				root.opts.move && root.moveBox();
			},

			//IE6 fixed 属性不支持，将背景图片设置为全屏
			bgResize: function() {
				var root = this;
				$(root.bg).css({
					'width': $(document.body).outerWidth(),
					'height': $(document.body).outerHeight()
				});
			},

			// 当弹出框超出屏幕宽度和高度时，设定弹出框距离屏幕边距为20PX
			boxResize: function() {
				var root = this,
					_dialog = $(root.container);
				if (root.myDialog.is(':visible')) {
					root.opts.height = root.opts.height || _dialog.outerHeight();
					var winWidth = $(window).width(),
						winHeight = $(window).height(),
						boxWidth = root.opts.width,
						boxHeight = root.opts.height,
						width = root.setSize(boxWidth, winWidth - 40),
						height = root.setSize(boxHeight, winHeight - 40);
					if (root.opts.move) {
						_dialog.css({
							"left": (boxWidth <= winWidth ? (winWidth - boxWidth - 40) / 2 : 20),
							"top": (boxHeight <= winHeight ? (winHeight - boxHeight - 40) / 2 : 20),
							'margin': 0,
							'width': width,
							'height': height
						});
					} else {
						_dialog.css({
							'margin-left': width / 2 * -1,
							'margin-top': height / 2 * -1,
							'width': width,
							'height': height
						});
					}
				}
			},

			setSize: function(boxSize, winSize) {
				return boxSize > winSize ? winSize : boxSize;
			},

			// 拖拽方法
			moveBox: function(event) {
				var root = this,
					pageX = 0,
					pageY = 0,
					//需要拖动的目标DIV 
					_dialog = $(root.container),
					winWidth = $(window).width(),
					winHeight = $(window).height();
				// 绑定鼠标点下事件
				_dialog.on('mousedown.51autodialog', this, function(event) {

					var d = document;
					var e = event || window.event;
					//鼠标和DIV的相对坐标  
					pageX = (e.pageX || e.clientX) - parseInt(root.container.style.left);
					pageY = (e.pageY || e.clientY) - parseInt(root.container.style.top);
					root.container.style.cursor = 'move';
					// 设置捕获范围
					if (root.container.setCapture) {
						root.container.setCapture();
					} else if (window.captureEvents) {
						window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
					}

					//绑定移动事件
					d.onmousemove = function(event) {
						var e = event || window.event;
						//鼠标在页面的坐标 - 鼠标和DIV的相对坐标 = DIV在页面的坐标 
						var ePageX = e.pageX || e.clientX,
							ePageY = e.pageY || e.clientY;
						setTimeout(function() {
							var boxWidth = root.opts.width,
								boxHeight = root.opts.height,
								//左右偏移值
								x = ePageX - pageX,
								y = ePageY - pageY;
							if (x <= 0 || y <= 0 || x >= winWidth - boxWidth || y >= winHeight - boxHeight) {
								return;
							}
							_dialog.css({
								"left": x,
								"top": y,
								'margin': 0
							});
						}, 75);
					};
					
					//绑定鼠标弹起事件
					d.onmouseup = function(event) {
						// 取消捕获范围 
						if (root.container.releaseCapture)
							root.container.releaseCapture();
						else if (window.captureEvents)
							window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
						root.container.style.cursor = 'auto';
						// 解绑事件
						d.onmousemove = null;
						d.onmouseup = null;
						d.ondragstart = null;
						d.onselectstart = null;
						d.onselect = null;
					};

				});
			},

			// 设置对话框层级
			setZindexFun: function() {
				var root = this;
				var row = $(".auto-dialog:visible").length;
				$(root.container).css({
					'z-index': 10001 + 2 * row
				});
				$(root.bg).css({
					'z-index': 10000 + 2 * row
				});
			},

			//写入内容
			writeHtmlFun: function() {
				var root = this;
				root.opts.content != "" && root._this.html(root.opts.content);
			},

			//显示对话框
			open: function() {
				var root = this;
				root.writeHtmlFun();
				if (root.myDialog.is(':hidden')) {
					root.setZindexFun();
					root.myDialog.show();
					root.boxResize();
				}
			},

			// 关闭对话框
			close: function() {
				var root = this;
				if (root.myDialog.is(':visible')) {
					root.myDialog.hide();
					if ($.isFunction(root.opts.closeFun)) {
						root.opts.closeFun(root);
					}
				}
			}
		};

		return this.each(function() {
			var _this = $(this);
			var data = _this.data('dialog');
			if (!data) _this.data('dialog', (data = new fun(this, settings)));
			if (typeof options == 'string' && /^(open|close)$/.test(options)) {
				if(options == "open" &&  alertCon && alertCon != "") data.opts.content = alertCon;
				data[options]();
			}
		});
	};

})(jQuery);