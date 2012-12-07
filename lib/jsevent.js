/*
 *@author cherishpeace
 *@2012/11/27
 *@version 0.1
 */


;(function(){

var JsEvent = function(){
	this._callbacks = {};
	this._fired = {};
};



 JsEvent.prototype.bind = function(obj, type, fn) {
     if (obj.attachEvent) {
         obj['e' + type + fn] = fn;
         obj[type + fn] = function() {
             obj['e' + type + fn](window.event);
         }
         obj.attachEvent('on' + type, obj[type + fn]);
     } else obj.addEventListener(type, fn, false);
 }

 JsEvent.prototype.bindOnce = function(obj, type, fn) {
     var self = this;
     var fnProxy = function(){
        fn.apply(this,arguments);
        self.unbind(obj, type, fnProxy);
     }
     this.bind(obj, type, fnProxy);
     return this;
 }

 JsEvent.prototype.unbind = function(obj, type, fn) {
     if (obj.detachEvent) {
         obj.detachEvent('on' + type, obj[type + fn]);
         obj[type + fn] = null;
     } else obj.removeEventListener(type, fn, false);
 }


 JsEvent.prototype.addListener = function(eventname, callback) {
     this._callbacks[eventname] = this._callbacks[eventname] || [];
     this._callbacks[eventname].push(callback);
     return this;
 }


JsEvent.prototype.once = function(eventname,callback){
     var self = this;
     var callproxy = function(){
        callback.apply(self,arguments);
        self.removeListener(eventname, callproxy);
     } 
     self.addListener(eventname,callproxy);
     return this;
}


JsEvent.prototype.removeListener = function(eventname,callback){
	var cbs = this._callbacks,cbList,cblength;
	if(!eventname) return this;
	if(!callback){
        cbs[eventname] = [];
	}else{
        cbList = cbs[eventname];
        if (!cbList) return this;
        cblength = cbList.length;
        for (var i = 0; i < cblength; i++) {
        	if (callback === cbList[i]) {
        		cbList.splice(i, 1);
        		break;
        	}

        }

	}


}


JsEvent.prototype.fire = function(eventname,data){
    var cbs = this._callbacks,fd = this._fired,cbList,i,l;
    if(!cbs[eventname]) return this;
    cbList = cbs[eventname];
    if (cbList) {
    	for (i = 0, l = cbList.length; i < l; i++) {
    		cbList[i].apply(this,Array.prototype.slice.call(arguments, 1));

    	}
    
    }

   
}

JsEvent.prototype._when = function(){
	var events,callback,isOnce,i,l,self,argsLength,bindMethod;
    argsLength = arguments.length;
	events = Array.prototype.slice.apply(arguments, [0, argsLength - 2]);
    //console.log(events);
    callback = arguments[argsLength - 2];
    isOnce = arguments[argsLength - 1];
    if (typeof callback !== "function") {
      return this;
    }
    self = this;
    l = events.length;
    var isOk = function(){
    	var data = [];
    	var isok = true;
    	for (var i = 0; i < l; i++) {

            if(!self._fired.hasOwnProperty(events[i])||!self._fired[events[i]].hasOwnProperty("data")){
                isok = false;
                break;
            }
            var d = self._fired[events[i]].data;
    	    data.push(d);
    	}
    	if(isok) callback.apply(null, [data]);

    }

    bindMethod = isOnce ? "once" : "addListener";
    var _bind =function(key){
    	self[bindMethod](key, function(data){
            self._fired[key] = self._fired[key] || {};
            self._fired[key].data = data;
            isOk();
    	})
    }
    for(i=0;i<l;i++){
       _bind(events[i]);
    }


}


JsEvent.prototype.when = function(){
    var args = Array.prototype.concat.apply([], arguments);
    args.push(false);
    this._when.apply(this, args);
    return this;

}

JsEvent.prototype.whenOnce = function(){
    var args = Array.prototype.concat.apply([], arguments);
    args.push(true);
    this._when.apply(this, args);
    return this;

}

JsEvent.prototype.after = function(eventName, times, callback){
    if (times === 0) {
        callback.apply(null,[]);
        return this;
    }
    var self = this;
    var dataArray = [];
    var afterFun = function(data){
        dataArray.push(data);
        times--;
        if(times < 1){
            self.removeListener(eventName, afterFun);
            callback.apply(self,[dataArray]);
        }
        

    }

    self.addListener(eventName,afterFun);
    return this;

}





this['JsEvent'] = JsEvent;

})(window,undefined);


