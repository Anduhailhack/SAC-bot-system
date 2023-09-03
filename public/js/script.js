"use strict";

// const $ = document;

const WebApp = function () {
	Telegram.WebApp.ready();
	// this.initData = Telegram.WebApp.initData || "";
	// this.initDataUnsafe = Telegram.WebApp.initDataUnsafe || {};
	Telegram.WebApp.MainButton.setParams({
		text: 'CLOSE',
		is_visible: true
	}).onClick(this.close);
};

WebApp.prototype.initData = Telegram.WebApp.initData || "";
WebApp.prototype.initDataUnsafe = Telegram.WebApp.initDataUnsafe || {};

WebApp.prototype.initTheme = function () {
	document.documentElement.className = Telegram.WebApp.colorScheme;
	Telegram.WebApp.onEvent("themeChanged", this.initTheme);
};

WebApp.prototype.sendData = function (data) {
	Telegram.WebApp.sendData(data);
	Telegram.WebApp.close();
};

WebApp.prototype.openLink = function (url, option=true) {
	Telegram.WebApp.openLink(url, option);
}

WebApp.prototype.getInitDataUnsafe = function () {
	return this.initDataUnsafe;
};

WebApp.prototype.getInitData = function () {
	return this.initData;
};

WebApp.prototype.isValidEmail = function (email) {
	return (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) && (/@aau\.edu\.et$/i.test(email));
};

WebApp.prototype.isName = function (name){
	let isValid = (name.length > 3);
	return isValid && /^[a-zA-Z]+$/.test(name)
}

WebApp.prototype.isTashID = function (id){
	let isValid = (id && id.length && id.length > 4);
	return isValid
}

WebApp.prototype.isPhoneNo = function(phoneNo){
	let isValid = /^\d[79]\d{8}$/.test(phoneNo);
	return isValid;
}
WebApp.prototype.isTASHStudId = function(studId){
	const AAUStudentsIDRegex = /^HSR/i;
	if(AAUStudentsIDRegex.test(studId))
		return true
	return false
}

WebApp.prototype.close = function(){
	Telegram.WebApp.close()
}

WebApp.prototype.showAlert = function(alert) {
	Telegram.WebApp.showAlert(alert)
}

WebApp.prototype.showConfirm = function(alert) {
	Telegram.WebApp.showConfirm(alert);
}

const webApp = new WebApp();
webApp.initTheme();
