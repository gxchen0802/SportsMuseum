// JavaScript Document
window.IndexClass = window.IndexClass || {}

// 首页方法
IndexClass.Init = function() {

	//首页Banner图片切换JS
	$('#banner').nivoSlider();
	// 首页通知公告滚动
	$("#notice").jScroll({vertical: true});

};

$(function(){
	IndexClass.Init();
});