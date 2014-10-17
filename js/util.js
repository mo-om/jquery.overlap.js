/**
 * 通用工具函数util.js
 * @author mo-om
 * @requires jQuery
 * @namespace util
 * @return {Object} 返回通用的util组件接口
 */
;(function($,window,document,undefined) {
	var util = (function() {
		return {
			/**
			 * 模拟生成guid
			 * @return {String} 返回模拟生成的guid
			 */
			guid: function() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
					return v.toString(16);
				}).toUpperCase();      
			},

			/**
			 * 获取web应用的basepath
			 * @return {String} 返回web应用的basepath
			 */ 
			getBasePath: function () {
				var loc = window.location
				, path = loc.protocol + '//' + loc.host + loc.pathname;
				return loc.href.substring(0, path.lastIndexOf('/'));
			},

			/**
			 * 获取url中指定参数的值
			 * @param  {String} name 指定的参数名
			 * @return {String}      返回url中指定参数的值，如果没有则返回空字符串
			 */
			getQueryString: function (name) {
				var reg = new RegExp('(^|\\?|&)'+ name +'=([^&]*)(\\s|&|$)', 'i');  
				return reg.test(location.href) ? unescape(RegExp.$2.replace(/\+/g, ' ')) : '';
			}, 

			/**
			 * 检测某个url是否跨域
			 * @param  {String} url 需要检测的url
			 * @return {Boolean}    检测结果为跨域则返回true，否则返回false
			 */
			isCrossDomain: function (url) {
				var loc = window.location
				, patt = new RegExp('^' + loc.protocol + '//' + loc.host);
				return patt.test(url) ? false : true;
			},

			/**
			 * 匹配任意指定的字符串
			 * @param  {String} string 任意指定字符串
			 * @param  {string} word   需要进行对比匹配的字符串
			 * @return {Boolean}       有匹配结果则返回true，否则返回false
			 */
			match: function (string, word) {
				var len = string.length
				, sub = word.substr(0, len);
				return string.toUpperCase() === sub.toUpperCase();
			},

			/**
			 * 按需载入javascript文件
			 * @param    {Array/String} urls javascript文件的url地址
			 * @callback {Function}          回调函数
			 */
			loadScript: function (urls,callback) {
				// 传入单个文件url时数组不必
				if( !(urls instanceof Array) ){
					urls = [urls]
				}
				callback = callback || function() {};
				var i = 0, len = urls.length, last = len - 1,
				head = document.getElementsByTagName('head')[0] || document.documentElement;
				for (; i < len; i++) {
					(function (i) {
						var script = document.createElement('script');
						script.type = 'text/javascript';
						script.src = urls[i];
						script.onload = script.onreadystatechange = function() {
							// Attach handlers for all browsers
							if(!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
								this.onload = this.onreadystatechange = null;
								this.parentNode.removeChild(this);
								i === last && callback();
							}
						}
						head.appendChild(script);
					})(i)
				}
			},

			/**
			 * 按需载入javascript文件
			 * @param    {Array/String} urls javascript文件的url地址
			 * @callback {Function}          回调函数
			 */
			$loadScript: function (urls,callback) {
				if(!$.isArray(urls)){
					urls = [urls]
				}
				callback = callback || function() {}
				var i = 0, len = urls.length, last = len - 1;
				for (; i < len; i++) {
					(function (i) {
						$.getScript(urls[i],function (script, textStatus, jqXHR) {
							i === last && callback();
						})
					})(i)
				}
			}
		}
	})();
	// 暴露接口
	window.util = util;
})(jQuery,window,document);
