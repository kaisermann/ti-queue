/*
 * Tiq - Timed Invocation Queue JS v1.1.1
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
 	function Tiq() { this.queue = []; this.current = -1; this.shouldLoop = 0; this.shouldPlay = false; }

 	Tiq.prototype.add = function(delay, callback, repetitions)
 	{
 		repetitions = repetitions || 1;
 		if(!callback || typeof callback !== "function")
 		{
 			console.error("Tiq: Invalid callback;");
 			return this;
 		}

 		for(var i = 0; i < repetitions; i++)
 			this.queue.push([delay,callback]);

 		return this;
 	};

 	Tiq.prototype.start = function()
 	{
 		var _self = this, _invocationCounter = 0, _loopCounter = 0, _sameMethodCounter = 0;
 		var _lastCallback;

 		_self.shouldPlay = true;

 		if(!!_self.beforeCallback)
 			_self.beforeCallback.call(_self);

 		if(!_self.queue.length)
 			return this;

 		_self.timer = setTimeout(function timerHelper()
 		{
 			if(!_self.shouldPlay)
 				return _self.stop();

 			var itemCallback = _self.queue[++_self.current][1];

 			if(_lastCallback === itemCallback)
 				_sameMethodCounter++;
 			else
 				_sameMethodCounter = 0;

 			if(!!itemCallback)
 				itemCallback.call(_self, _sameMethodCounter);

 			if((++_invocationCounter) && !!_self.eachCallback)
 				_self.eachCallback.call(_self, _self.current, _invocationCounter, _sameMethodCounter);

 			if(_self.current+1==_self.queue.length)
 			{
 				if(!_self.shouldLoop || (_loopCounter++)-_self.shouldLoop===0)
 				{
 					if(!!_self.afterCallback) 
 						_self.afterCallback.call(_self);
 					return _self.stop();
 				}
 				
 				if(!!_self.loopCallback)
 					_self.loopCallback.call(_self, _loopCounter);

 				_self.current = -1;
 			}
 			_lastCallback = itemCallback;
 			_self.timer = setTimeout(timerHelper, _self.queue[_self.current+1][0]);

 		}, _self.queue[0][0]);
 		return this;
 	};
 	Tiq.prototype.before = function(callback) { this.beforeCallback = callback; return this; };
 	Tiq.prototype.after = function(callback) { this.afterCallback = callback; return this; };
 	Tiq.prototype.loop = function(nLoops) { nLoops = nLoops || -1; this.shouldLoop = nLoops; return this.start(); };
 	Tiq.prototype.setQueue = function(queue)  { this.queue = queue; return this; };
 	Tiq.prototype.stop = function() { this.shouldPlay = false; this.shouldLoop = 0; clearTimeout(this.timer); return this; };
 	Tiq.prototype.iteration = function(callback) { this.loopCallback = callback; return this; };
 	Tiq.prototype.each = function(callback) { this.eachCallback = callback; return this; };
 	Tiq.prototype.repeat = function(delay, callback, repetitions) { return this.add(delay, callback, repetitions); };

 	return Tiq;
 }));
