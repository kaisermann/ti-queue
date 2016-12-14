(function () {

  const isFunction = fn => typeof fn === 'function';

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
      this.reset();
    }

    add(delay, callback, repetitions) {

      repetitions = repetitions || 1;

      if (!isFunction(callback)) {
        throw ('Tiq: Invalid callback');
      }

      while (repetitions--) {
        this.queue.push([delay, callback]);
      }

      return this;
    }

    run() {
      const _self = this;
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

        const itemCallback = _self.queue[_self.currentIndex][1];

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
    }

    stop() {
      this.playing = false;
      clearTimeout(this.timer);
      this.timer = null;
      return this;
    }

    loop(nLoops) {
      this.numberOfLoops = nLoops || -1;
      return this;
    }

    repeat(repetitions, delay, callback) {
      return this.add(delay, callback, repetitions);
    }

    reset() {
      this.stop();
      this.numberOfLoops = 1;
      this.currentIndex = 0;
      this.currentLoopIndex = 0;
      this.sameMethodCounter = 0;
      this.executionCounter = 0;
      this.lastCallback = null;
      this.hasExecutedBeforeCallback = false;
      return this;
    }
  }

  // Creates the methods to add a callback to a specific 'event'
  ['beforeLoop', 'afterLoop', 'each', 'before', 'after'].forEach(methodName => {
    Tiq.prototype[methodName] = function (callback) {
      return addCallback.call(this, `${methodName}Callback`, callback);
    };
  });

  if (module && module.exports) {
    module.exports = Tiq;
  } else {
    window.Tiq = Tiq;
  }
})();
