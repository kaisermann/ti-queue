/*
 * Tiq - Timed Invocation Queue JS v1.0.1
 * https://github.com/chriskaisermann/tiq
 * by Christian Kaisermann
 */
 (function (root, factory) 
 {
 	if (typeof define === "function" && define.amd)
 		define([], factory);
 	else if (typeof exports === "object")
 		module.exports = factory();
 	else
 		root.Tiq = factory();
 }(this, function (undefined) 
 {
 	'use strict';
 	function Tiq() { this.queue = []; this.current = -1; this.counter = 0; this.shouldLoop = false; this.shouldPlay = false; }

 	Tiq.prototype.add = function(delay, callback)
 	{
 		if(!callback || typeof callback !== "function")
 		{
 			console.error("Tiq: Invalid callback;");
 			return this;
 		}

 		this.queue.push([delay,callback]);
 		return this;
 	};

 	Tiq.prototype.start = function()
 	{
 		var _self = this;
 		_self.shouldPlay = true;

 		if(!!_self.beforeCallback)
 			_self.beforeCallback.call(_self);

 		if(!_self.queue.length)
 			return this;

 		_self.timer = setTimeout(function timerHelper()
 		{
 			if(!_self.shouldPlay)
 			{
 				clearTimeout(_self.timer);
 				return this;
 			}

 			var queue_item = _self.queue[++_self.current][1];

 			if(!!queue_item[1])
 				queue_item[1].call(_self);

 			if((++_self.counter) && !!_self.eachCallback)
 				_self.eachCallback.call(_self, _self.current, _self.counter);

 			if(_self.current+1==_self.queue.length)
 			{
 				if(!_self.shouldLoop)
 				{
 					if(!!_self.afterCallback) 
 						_self.afterCallback.call(_self);
 					return _self.stop();
 				}
 				
 				if(!!_self.loopCallback)
 					_self.loopCallback.call(_self, ++_self.loopCount);

 				_self.current = -1;
 			}
 			_self.timer = setTimeout(timerHelper, _self.queue[_self.current+1][0]);

 		}, _self.queue[0][0]);
 		return this;
 	};
 	Tiq.prototype.before = function(callback) { this.beforeCallback = callback; return this; };
 	Tiq.prototype.after = function(callback) { this.afterCallback = callback; return this; };
 	Tiq.prototype.loop = function() { this.shouldLoop = true; this.loopCount = 0; this.start(); return this; };
 	Tiq.prototype.setQueue = function(queue)  { this.queue = queue; return this; };
 	Tiq.prototype.stop = function() { this.shouldPlay = false; this.shouldLoop = false; clearTimeout(this.timer); this.counter = 0; return this; };
 	Tiq.prototype.iteration = function(callback) { this.loopCallback = callback; return this; };
 	Tiq.prototype.each = function(callback) { this.eachCallback = callback; return this; };

 	return Tiq;
 }));
