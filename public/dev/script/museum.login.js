// JavaScript Document
window.LoginClass = window.LoginClass || {}

// 登录注册页
LoginClass.Init = function(state, msg) {
	// 登录表单验证
	GlobalClass.formValidationFun($("#loginForm"), function() {
		GlobalClass.tipsDialog('loadDialog', null, "登陆中,请稍后...", false);
	});
	// 注册表单验证
	GlobalClass.formValidationFun($("#regsiterForm"), function() {
		GlobalClass.tipsDialog('loadDialog', null, "数据保存中,请稍后...", false);
	});
	// 显示对话框
	if (state && msg) {
		GlobalClass.tipsDialog('loginDialog', state, msg);
	}
};
// 初始化
$(function() {
	LoginClass.Init();
});