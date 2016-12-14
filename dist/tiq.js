(function () {

  var isFunction = function (fn) { return typeof fn === 'function'; };

  var addCallback = function (key, callback) {

    if (!isFunction(callback)) {
      throw ('Tiq: Invalid callback');
    }

    this[key] = callback;
    return this;
  };

  var Tiq = function Tiq(queue) {
    this.queue = queue || [];
    this.reset();
  };

  Tiq.prototype.add = function add (delay, callback, repetitions) {
      var this$1 = this;


    repetitions = repetitions || 1;

    if (!isFunction(callback)) {
      throw ('Tiq: Invalid callback');
    }

    while (repetitions--) {
      this$1.queue.push([delay, callback]);
    }

    return this;
  };

  Tiq.prototype.run = function run () {
    var _self = this;
    this.playing = true;

    if (this.beforeCallback && !this.hasExecutedBeforeCallback) {
      this.hasExecutedBeforeCallback = true;
      this.beforeCallback.call(this);
    }

    this.timer = setTimeout(function timerHelper() {

      if (!_self.playing) {
        return _self.stop();
      }

      if (_self.currentIndex === 0 && _self.numberOfLoops !== 1 && _self.beforeLoopCallback) {
        _self.beforeLoopCallback.call(_self, _self);
      }

      var itemCallback = _self.queue[_self.currentIndex][1];

      if (_self.lastCallback === itemCallback) {
        _self.sameMethodCounter++;
      } else {
        _self.sameMethodCounter = 0;
      }

      _self.executionCounter++;

      if (itemCallback) {
        itemCallback.call(_self, _self);
      }

      if (_self.eachCallback) {
        _self.eachCallback.call(_self, _self);
      }

      if (_self.currentIndex + 1 === _self.queue.length) {

        if (_self.numberOfLoops !== 1 && _self.afterLoopCallback) {
          _self.afterLoopCallback.call(_self, _self);
        }

        if (++_self.currentLoopIndex >= _self.numberOfLoops) {
          if (_self.afterCallback) {
            _self.afterCallback.call(_self, _self);
          }
          return _self.stop();
        }

        _self.lastCallback = null;
        _self.currentIndex = -1;
      } else {
        _self.lastCallback = itemCallback;
      }
      _self.timer = setTimeout(timerHelper, _self.queue[++_self.currentIndex][0]);

    }, _self.queue[_self.currentIndex][0]);
    return this;
  };

  Tiq.prototype.stop = function stop () {
    this.playing = false;
    clearTimeout(this.timer);
    this.timer = null;
    return this;
  };

  Tiq.prototype.loop = function loop (nLoops) {
    this.numberOfLoops = nLoops || -1;
    return this;
  };

  Tiq.prototype.repeat = function repeat (repetitions, delay, callback) {
    return this.add(delay, callback, repetitions);
  };

  Tiq.prototype.reset = function reset () {
    this.stop();
    this.numberOfLoops = 1;
    this.currentIndex = 0;
    this.currentLoopIndex = 0;
    this.sameMethodCounter = 0;
    this.executionCounter = 0;
    this.lastCallback = null;
    this.hasExecutedBeforeCallback = false;
    return this;
  };

  ['beforeLoop', 'afterLoop', 'each', 'before', 'after'].forEach(function (methodName) {
    Tiq.prototype[methodName] = function (callback) {
      return addCallback.call(this, (methodName + "Callback"), callback);
    };
  });

  if (module && module.exports) {
    module.exports = Tiq;
  } else {
    window.Tiq = Tiq;
  }
})();
