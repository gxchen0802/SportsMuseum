// JavaScript Document
window.SearchClass = window.SearchClass || {}

// 搜索页方法
SearchClass.Init = function() {
	// 设置分页
	var _pagination = $("#pagination");
	GlobalClass.setPagination($("#pagination"), {
		form: "#searchForm",
		maxsize: _pagination.data("maxsize") || 1,
		pagesize: _pagination.data("pagesize"),
		page: _pagination.data("page") || 1
	});
	// 表单提交
	this.initSearchForm();
};

// 初始化搜索表单
SearchClass.initSearchForm = function() {
	var _form = $("#searchForm");
	// 提交表单
	_form.on("click", '.btn-submit', function() {
		_form.submit();
	});
	// 清空表单
	_form.on("click", '.btn-clear', function() {
		_form.find("input,select").val("");
		$("#page", _form).val("1");
		_form.submit();
	});
};

$(function() {
	SearchClass.Init();
});