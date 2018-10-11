// JavaScript Document
window.ListClass = window.ListClass || {}

// 首页方法
ListClass.Init = function() {
	// 设置分页
	var _pagination = $("#pagination"),
		_this = this;
	GlobalClass.setPagination($("#pagination"), {
		form: "#paginationForm",
		maxsize: _pagination.data("maxsize") || 1,
		pagesize: _pagination.data("pagesize"),
		page: _pagination.data("page") || 1
	});


	// 视频播放绑定
	$(".video-con").on('click', '.items', function() {
		var opts = {
			src: $(this).data("src"),
			picsrc: $(this).children('img').attr("src"),
			title: $(this).attr("title"),
			id: new Date().getTime()
		};
		// 初始化对话框
		_this.setPlayDialog(opts);
	});
};

// 设置播放对话框
ListClass.setPlayDialog = function(opts) {
	var video = [],
		_dialog = $('<div id="' + opts.id + '" style="display: none; height:600px;"></div>').appendTo('body');
	video.push('<video id="example_video_' + opts.id + '" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="none" width="1006" height="600" poster="' + opts.picsrc + '" data-setup=\'{"example_option":true}\'>');
	video.push('<source src="' + opts.src + '" type="video/mp4">');
	video.push('<track kind="captions" src="../videojs/examples/shared/example-captions.vtt" srclang="en" label="English"></track>');
	video.push('<track kind="subtitles" src="../videojs/examples/shared/example-captions.vtt" srclang="en" label="English"></track>');
	video.push('</video>');
	_dialog.html(video.join(''));
	// 初始化播放器
	videojs("example_video_" + opts.id);
	// 初始化对话框
	_dialog.autoDialog({
		'title': opts.title || '系统提示',
		'show': true,
		'width': 1008,
		'content': '',
		'closeFun': function() {
			_dialog.parents(".auto-dialog").remove();
		}
	});
};

$(function() {
	ListClass.Init();
});