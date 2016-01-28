/*
 * crxTool
 */
;(function (factory){
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define(factory);
	} else {
		 
		// Browser globals
		crxTool = factory();
	}
})(function(){
	/*
	 * environment check
	 */
	if(!chrome){
		return;
	}

	var root = this;
	var previousCrxTool = root.crxTool;

	/*
	 *	base
	 */
	var base = {
		isArray: function (arr){
			return (Array && Array.isArray) ? Array.isArray(arr) : Object.prototype.toString.call(arr) === '[object Array]';
		},
		hasKey: function(obj, key){
			return obj !== null && hasOwnProperty.call(obj, key);
		},
		each: function (obj, fn){
			var len = obj.length,i = 0;

			if(base.isArray(obj)){
				//如果是数组
				for(; i<len; i++){
			       	if ( false === fn.call(obj[i], obj[i], i) ){break;}
			    }
			}else{
				//如果是对象
			    for( i in obj ){
			    	if(base.hasKey(obj, i)){
			    		if(false === fn.call(obj[i],i+1,obj[i])){break;}
			    	}
			    }
			}
		}
	};

	/*
		通信
	*/
	var communication = {
		send: function(tag, data, cb){
			chrome.tabs.query({active:true}, function(tab) {
				chrome.tabs.sendMessage(tab[0].id, {
					tag: tag,
					data: data
				}, function(res) {
			        //cb && cb(res);
			        if(cb){
			        	cb(res);
			        }
			    });
			});
		},
		sendListen: function(tag, cb){
			chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
				if(request.tag == tag && cb){
					cb(request.data, sender, sendResponse);
				}
			});
		}

	};

	/*
		读取页面的script内容
	*/
	var getPageScript = {
		getScripts: function(){
			return document.getElementsByTagName('script');
		},
		getPageScripts: function(){
			var pageScripts = [];
			base.each(getPageScript.getScripts(), function (i_script, v_script){
				if(v_script.src === ""){
					pageScripts.push(v_script.innerHTML
						.replace(/\/\/[\S]*/g, '')
						.replace(/[}][\s]/g, '};')
						.replace(/var\s/g, 'var#')
						.replace(/\s+/g,"")
						.replace(/var#/g, 'var '));
				}
			});

			return pageScripts;
		},
		getPageValue: function(valueName){
			var value = null;
			var allPageScriptStr = getPageScript.getPageScripts().join('');
			var valueStart = allPageScriptStr.indexOf(valueName+'=');
			if(valueStart == -1){
				return value;
			}

			var valueEnd = allPageScriptStr.indexOf(';', valueStart);
			if(valueStart + valueName.length + 1 >= valueEnd){
				return value;
			}
			var valueStr = allPageScriptStr.slice(valueStart + valueName.length + 1, valueEnd);
		
			try{
				value = (new Function('return '+valueStr+';'))();
			}catch(err){}
			return value;
		}
	};


	var crxTool = {
		send: communication.send,
		sendListen: communication.sendListen,
		getPageValue: getPageScript.getPageValue,
		noConflict: function(){
			root.crxTool = previousCrxTool;
			return this;
		}
	};

	return crxTool;

});