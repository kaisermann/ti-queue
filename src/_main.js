(function (global) {

  const isFunction = fn => (fn && typeof fn === 'function');
  // 'this' will be binded to a Tiq object.
  const addCallback = function (key, callback) {

    if (!isFunction(callback)) {
      throw ('Tiq: Invalid callback');
    }

    this[key] = callback;
    return this;
  };

  class Tiq {
    constructor(queue) {
      this.queue = queue || [];
      this.current = -1;
      this.numberOfLoops = 1; // 1 loop = default execution
      this.shouldPlay = false;
    }

    add(delay, callback, repetitions) {
      repetitions = repetitions || 1;
      if (!isFunction(callback)) {
        throw ('Tiq: Invalid callback');
      }

      for (let i = 0; i < repetitions; i++) {
        this.queue.push([delay, callback]);
      }

      return this;
    }

    run() {
      const _self = this;
      let _totalExecutions = 0,
        _loopCounter = 0,
        _sameMethodCounter = 0,
        _lastCallback;

      this.shouldPlay = true;

      if (this.beforeCallback) {
        this.beforeCallback.call(this);
      }

      if (!this.queue.length) {
        throw ('Tiq: Empty queue');
      }

      this.timer = setTimeout(function timerHelper() {

        if (!_self.shouldPlay) {
          return _self.stop();
        }

        const itemCallback = _self.queue[++_self.current][1];

        if (_lastCallback === itemCallback) {
          _sameMethodCounter++;
        } else {
          _sameMethodCounter = 0;
        }

        if (itemCallback) {
          itemCallback.call(_self, _self.current, _sameMethodCounter, _totalExecutions);
        }

        if (_self.eachCallback) {
          _self.eachCallback.call(_self, _self.current, _sameMethodCounter, _totalExecutions);
        }

        _totalExecutions++;

        if (_self.current + 1 === _self.queue.length) {

          if (_self.numberOfLoops !== 1 && _self.eachLoopCallback) {
            _self.eachLoopCallback.call(_self, _loopCounter);
          }

          if (++_loopCounter === _self.numberOfLoops) {
            if (_self.afterCallback) {
              _self.afterCallback.call(_self, _totalExecutions, _loopCounter);
            }
            return _self.stop();
          }

          _lastCallback = null;
          _self.current = -1;
        } else {
          _lastCallback = itemCallback;
        }
        _self.timer = setTimeout(timerHelper, _self.queue[_self.current + 1][0]);

      }, _self.queue[0][0]);
      return this;
    }

    loop(nLoops) {
      this.numberOfLoops = nLoops || -1;
      return this;
    }

    stop() {
      this.shouldPlay = false;
      this.numberOfLoops = 0;
      clearTimeout(this.timer);
      return this;
    }

    repeat(repetitions, delay, callback) {
      return this.add(delay, callback, repetitions);
    }
  }

  // Creates the methods to add a callback to a specific 'event'
  ['eachLoop', 'each', 'before', 'after'].forEach(methodName => {
    Tiq.prototype[methodName] = function (callback) {
      return addCallback.call(this, `${methodName}Callback`, callback);
    };
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tiq;
  } else {
    window.Tiq = Tiq;
  }
})();
