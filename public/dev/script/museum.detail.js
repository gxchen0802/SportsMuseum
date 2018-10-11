// JavaScript Document
window.DetailClass = window.DetailClass || {}

// 首页方法
DetailClass.Init = function() {
	// 首页通知公告滚动
	$(".pic-scroll").jScroll({
		auto: 4000, //延迟时间（毫秒）
		speed: 1000, //单次滚动时长（毫秒）
		vertical: false, //是否向上滚动(默认向左)
		scroll: 5 //每次滚动的元素数量
	});
};

$(function() {
	DetailClass.Init();
});