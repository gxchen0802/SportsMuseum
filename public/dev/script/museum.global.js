// JavaScript Document
window.GlobalClass = window.GlobalClass || {
	// 显示对话框
	tipsDialog: function(id, state, msg, isShowClose) {
		var icon = {
			"ok": '<i class="icon icon-ok"></i>',
			"error": '<i class="icon icon-error"></i>'
		};
		if ($('#' + id).length) {
			$('#' + id).autoDialog('open', '<div class="my-msg">' + (icon.hasOwnProperty(state) ? icon[state] : "") + msg + '</div>');
		} else {
			var _dialog = $('<div id="' + id + '" style="display: none;"></div>').appendTo('body');
			_dialog.autoDialog({
				'title': '系统提示',
				'show': true,
				'width': 450,
				'isShowClose': (typeof(isShowClose) == "boolean" ? isShowClose : true),
				'content': '<div class="my-msg">' + (icon.hasOwnProperty(state) ? icon[state] : "") + msg + '</div>' //插入中间的内容
			});
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

	//节约性能
	throttle: function(fn, delay, mustRunDelay) {
		var timer = null;
		var t_start;
		return function() {
			var context = this,
				args = arguments,
				t_curr = +new Date();
			clearTimeout(timer);
			if (!t_start) {
				t_start = t_curr;
			}
			if (t_curr - t_start >= mustRunDelay) {
				fn.apply(context, args);
				t_start = t_curr;
			} else {
				timer = setTimeout(function() {
					fn.apply(context, args);
				}, delay);
			}
		};
	},

	// 表单验证
	formValidationFun: function(form, beforeCallBack) {
		$(form).validationEngine({
			promptPosition: 'topLeft',
			scroll: false,
			autoHidePrompt: true,
			autoHideDelay: 5000
		});

		$(form).on('click', '.btn-ok', function() {
			console.log("1111");
			var isDisabled = $(this).prop('disabled');
			if (!isDisabled && $(form).validationEngine('validate')) {
				$(this).prop('disabled', true);
				if (beforeCallBack && $.isFunction(beforeCallBack)) {
					beforeCallBack();
				}
				setTimeout(function() {
					$(form).submit();
				}, 3000);

			} else {
				return false;
			}
		});
	},

	// 获取表单提交数据
	getFormJson: function(_form) {
		var json = {},
			key = "";
		$.each(_form.serializeArray(), function(i, m) {
			key = m.name;
			json[key] = m.value;
		});
		return JSON.stringify(json);
	},

	// myajax
	formSubmitFun: function(_form, callback, eCallback) {
		if (!_form.length) return;
		var root = this;
		// 验证绑定
		_form.validationEngine({
			promptPosition: 'topLeft',
			scroll: false,
			autoHideDelay: 3000
		});

		// 验证
		if (!_form.validationEngine('validate')) return false;
		//提交验证
		$.ajax({
			url: _form.attr('action'),
			type: _form.attr('method'),
			data: root.getFormJson(_form),
			dataType: "json",
			timeout: 30000,
			headers: {
				"Accept": "application/json; charset=utf-8",
				"Content-Type": "application/json; charset=utf-8"
			},
			success: function(data) {
				if (data.code.toString() === '200') {
					if ($.isFunction(callback)) {
						callback(data);
					}
				} else {
					root.tipsDialog('tips', 'error', data.message);
					if ($.isFunction(eCallback)) {
						eCallback();
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				root.tipsDialog('tips', 'error', '服务器链接失败，请重试！');
				if ($.isFunction(eCallback)) {
					eCallback();
				}
			}
		});
	},

	// tab 切换
	tabFun: function() {
		var tab = $(".tab");
		if (!tab.length) {
			return;
		}
		tab.on('click', '.tag', function() {
			var _tab = $(this).parents('.tab'),
				index = $(this).index();
			$(this).addClass('on').siblings('.tag').removeClass('on');
			_tab.children('.con').eq(index).addClass('show').siblings('.con').removeClass('show');
		});
	},

	//获取URL参数方法
	getUrlQueryString: function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
		var results = regex.exec(location.search);
		var encoded = null;
		if (results === null) {
			return null
		} else {
			encoded = results[1].replace(/\+/g, " ");
			return decodeURIComponent(encoded)
		}
	},

	// 设置分页
	setPagination: function(_pagination, opts) {
		var form = opts.form || "form",
			sum = parseInt(opts.maxsize), //总记录条数
			pagesize = parseInt(opts.pagesize), //每页显示几条
			page = this.getUrlQueryString("page") ? parseInt(this.getUrlQueryString("page")) : parseInt(opts.page), //当前页码，起始从1开始
			maxpage = Math.ceil(sum / pagesize), //最大页码 
			row = maxpage > 9 ? 9 : maxpage, //显示几个分页页码
			//起始页码
			satart = ((page - 5) <= 0 ? 1 : ((page + 4) >= maxpage ? maxpage + 1 - row : page - 4)),
			end = ((page + 4) >= maxpage ? maxpage : (page + 4 < row ? row : page + 4)),
			htmlpage = "";
		htmlpage = '<div class="total pull-left">\n<span class="text-primary arial">' + ((page - 1) * pagesize + 1) + '-' + page * pagesize + '条</span>\n<span> / 共</span>\n<span class="text-primary arial">' + sum + '</span>\n<span>条</span>\n</div>\n<ul class="page-list pull-right">\n';

		if (sum != 0) {
			// 上一页
			if (page == 1) {
				htmlpage += '<li class="disabled"><a href="javascript:void(0);" aria-label="Previous"><span aria-hidden="true" title="上一页">&laquo;</span></a></li>\n';
			} else {
				htmlpage += '<li data-page="' + (page - 1) + '" ><a href="javascript:void(0);"aria-label="Previous" title="上一页"><span>&laquo;</span></a></li>\n';
			}
			// 页码
			for (var i = satart; i < end + 1; i++) {
				if (i == page) {
					htmlpage += '<li class="active"><a href="javascript:void(0);" title="第' + i + '页">' + i + '</a></li>\n';
				} else {
					htmlpage += '<li data-page="' + i + '"><a href="javascript:void(0);"  title="第' + i + '页">' + i + '</a></li>\n';
				}
			}
			// 下一页
			if (page == maxpage) {
				htmlpage += '<li class="disabled"><a href="javascript:void(0);" aria-label="Next" title="下一页"><span aria-hidden="true">&raquo;</span></a></li>\n';
			} else {
				htmlpage += '<li data-page="' + (page + 1) + '" ><a href="javascript:void(0);" aria-label="Next" title="下一页"><span>&raquo;</span></a></li>\n';
			}
		}
		htmlpage += "</div>\n";
		_pagination.html(htmlpage);

		// 事件绑定
		_pagination.on('click', ".page-list li", function() {
			var classname = $(this).attr('class');
			if (classname === "disabled" || classname === "active") {
				return false;
			}
			var page = $(this).data("page");
			$(form).find("[name='page']").val(page);
			$(form).submit();
		});
	},

	//右侧悬浮
	rightFixedFun: function() {
		var box = $(".r-fixed"),
			goTop = box.children('.goTop'),
			wHeight = $(window).height();
		if (!box.length) {
			return;
		}
		// 初始化侧悬浮
		box.removeClass('hide').children('goTop').addClass('hide');
		$(window).scroll(GlobalClass.throttle(function(event) {
			if ($(window).scrollTop() < 100) {
				goTop.addClass('hide');
			} else {
				goTop.removeClass('hide');
			}
		}, 200, 400));
		// 返回顶部
		box.on('click', '.goTop', function() {
			$('html,body').animate({
				scrollTop: 0
			}, function() {
				goTop.addClass('hide');
			});
			return false;
		});
	}
};

// 初始加载
$(function() {
	//右侧悬浮
	GlobalClass.rightFixedFun();
	// TAB事件切换绑定
	GlobalClass.tabFun();
});