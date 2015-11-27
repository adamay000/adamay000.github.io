(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _svg = require('./models/svg.js');

var _svg2 = _interopRequireDefault(_svg);

var _point = require('./models/point.js');

var _point2 = _interopRequireDefault(_point);

var _line = require('./models/line.js');

var _line2 = _interopRequireDefault(_line);

var _index = require('./modules/pen/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./modules/animate-on-path/index.js');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {

  _svg2.default.initialize('svg');

  var pen = new _index2.default(),
      aop,
      loop = true,
      duration = 2000,
      input = document.getElementById('input');

  pen.setPointInterval(10);
  pen.onDrawStart = function () {

    if (aop) {
      aop.destroy();
      aop = null;
    }
  };
  pen.onDrawEnd = function (line) {

    var path = document.createElementNS(_svg2.default.xmlns, 'path');
    path.setAttributeNS(null, 'stroke', '#cccccc');
    path.setAttributeNS(null, 'stroke-width', 1);
    path.setAttributeNS(null, 'fill', 'none');
    path.setAttributeNS(null, 'd', line.getPath());
    pen.__clear();
    aop = new _index4.default(path, input.value, {
      duration: duration,
      loop: loop,
      callback: function callback() {}
    });
    aop.start();
  };
  pen.enable();

  //var line = new Line();
  //
  //var size = 400;
  //for (let i = 0; i < 10; i++) {
  //
  //  let x = Math.random() * size * 2 - size
  //    , y = Math.random() * size - size / 2;
  //  line.append(new Point(x, y));
  //
  //}

  //line.append(new Point(-300, -150));
  //line.append(new Point(-100, 0));
  //line.append(new Point(-200, 50));
  //line.append(new Point(0, 10));
  //line.append(new Point(300, -100));
  //line.append(new Point(100, 0));
  //line.append(new Point(200, 100));

  //var path = document.createElementNS(svg.xmlns, 'path');
  //path.setAttributeNS(null, 'stroke', '#cccccc');
  //path.setAttributeNS(null, 'stroke-width', 1);
  //path.setAttributeNS(null, 'fill', 'none');
  //path.setAttributeNS(null, 'd', line.getPath());
  //path.setAttributeNS(null, 'd', line.getCurvedPath());
  //svg.world.appendChild(path);
  //
  //var aop = new AnimateOnPath(path, 'Animate text along the line', {
  //  duration: 2000
  //});
  //aop.start();
  //window.aop = aop;
  //
  //setTimeout(function() {
  //  console.log('destroy');
  //  aop.destroy();
  //  aop = null;
  //}, 3000);
  //
  //window.pen = new Pen();
  //

  Array.prototype.forEach.call(document.querySelectorAll('.button a, input'), function (el) {

    el.addEventListener('mousedown', function (event) {
      event.stopPropagation();
    });
  });

  document.getElementById('button-start-pause').addEventListener('click', function () {
    aop && aop.start() || aop.pause();
  });
  //document.getElementById('button-start').addEventListener('click', function() {
  //  aop && aop.start();
  //});
  //document.getElementById('button-pause').addEventListener('click', function() {
  //  aop && aop.pause();
  //});
  document.getElementById('button-restart').addEventListener('click', function () {
    aop && aop.restart();
  });
  document.getElementById('button-stop').addEventListener('click', function () {
    aop && aop.stop();
  });
  document.getElementById('button-loop').addEventListener('click', function () {
    this.className ? this.className = '' : this.className = 'off';

    loop = !this.className;
    aop && aop.setLoop(loop);
  });
  document.getElementById('button-normal').addEventListener('click', function () {
    duration = 2000;
    aop && aop.setDuration(duration);
  });
  document.getElementById('button-slower').addEventListener('click', function () {
    duration *= 1.2;
    aop && aop.setDuration(duration);
  });
  document.getElementById('button-faster').addEventListener('click', function () {
    duration /= 1.2;
    aop && aop.setDuration(duration);
  });
})();

},{"./models/line.js":2,"./models/point.js":3,"./models/svg.js":4,"./modules/animate-on-path/index.js":5,"./modules/pen/index.js":7}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _point = require('./point.js');

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Line = (function () {
  function Line() {
    _classCallCheck(this, Line);

    this.__points = [];
    this.defaultCurveLevel = 30;
  }

  _createClass(Line, [{
    key: 'clear',
    value: function clear() {

      this.__points.length = 0;
    }
  }, {
    key: 'append',
    value: function append(point) {

      this.__points.push(point);

      return this.__points.length;
    }
  }, {
    key: 'prepend',
    value: function prepend(point) {

      this.__points.unshift(point);

      return this.__points.length;
    }
  }, {
    key: 'getPoints',
    value: function getPoints() {

      return this.__points;
    }
  }, {
    key: 'getPath',
    value: function getPath() {

      return this.__points.map(function (point) {
        return 'L ' + point.xy;
      }).join(' ').replace(/L/, 'M');
    }
  }, {
    key: 'getCurvedPath',
    value: function getCurvedPath(_curveLevel) {

      var curveLevel = _curveLevel || this.defaultCurveLevel;

      if (this.__points.length < 3) {

        return this.getPath();
      }

      var points = this.__points,
          lastIdx = points.length - 1;

      var curve = this.__points.map(function (point, idx) {

        if (idx === lastIdx) {

          return '';
        }

        var prevPoint = idx === 0 ? point : points[idx - 1],
            nextPoint = points[idx + 1],
            nextNextPoint = idx === lastIdx - 1 ? nextPoint : points[idx + 2],
            prevVector = idx === 0 ? new _point2.default(0, 0) : prevPoint.getVector(nextPoint).normalize(),
            nextVector = idx === lastIdx - 1 ? new _point2.default(0, 0) : nextNextPoint.getVector(point).normalize();

        return 'C ' + (prevPoint.x + prevVector.x * curveLevel) + ',' + (prevPoint.y + prevVector.y * curveLevel) + ' ' + (point.x + nextVector.x * curveLevel) + ',' + (point.y + nextVector.y * curveLevel) + ' ' + point.xy;
      }).join(' ');

      return 'M ' + this.__points[0].xy + ' ' + curve + ' ';
    }
  }]);

  return Line;
})();

exports.default = Line;

},{"./point.js":3}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = (function () {
  function Point() {
    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
  }

  _createClass(Point, [{
    key: "clone",
    value: function clone() {

      return new Point(this.x, this.y);
    }
  }, {
    key: "getVector",
    value: function getVector(point) {

      var x = point.x - this.x,
          y = point.y - this.y;

      return new Point(x, y);
    }
  }, {
    key: "normalize",
    value: function normalize() {

      var len = _getDistance(0, 0, this.x, this.y),
          x = this.x / len,
          y = this.y / len;

      return new Point(x, y);
    }
  }, {
    key: "getDistance",
    value: function getDistance(point) {

      return _getDistance(point.x, point.y, this.x, this.y);
    }
  }, {
    key: "xy",
    get: function get() {

      return this.x + "," + this.y;
    }
  }]);

  return Point;
})();

function _getDistance(x1, y1, x2, y2) {

  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

exports.default = Point;

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Svg = (function () {
  function Svg() {
    _classCallCheck(this, Svg);

    this.xmlns = 'http://www.w3.org/2000/svg';
  }

  _createClass(Svg, [{
    key: 'initialize',
    value: function initialize(id) {

      this.__dom = document.getElementById(id);

      // Create wrapper group to make (0, 0) always be center of the screen
      this.world = document.createElementNS(this.xmlns, 'g');
      this.__dom.appendChild(this.world);

      this.setSvgSize();

      window.addEventListener('resize', this.onResize.bind(this));
    }
  }, {
    key: 'setSvgSize',
    value: function setSvgSize(width, height) {

      this.width = width || window.innerWidth;
      this.height = height || window.innerHeight;

      this.__dom.style.width = this.width + 'px';
      this.__dom.style.height = this.height + 'px';

      this.world.setAttributeNS(null, 'transform', 'translate(' + this.width / 2 + ', ' + this.height / 2 + ')');
    }
  }, {
    key: 'onResize',
    value: function onResize() {

      this.setSvgSize();
    }
  }]);

  return Svg;
})();

exports.default = new Svg();

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _svg = require('../../models/svg.js');

var _svg2 = _interopRequireDefault(_svg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnimateOnPath = (function () {
  function AnimateOnPath(pathElement, message) {
    var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, AnimateOnPath);

    this.__pathElement = pathElement;
    this.__totalLength = pathElement.getTotalLength();
    this.__message = message.split('');
    this.__texts = [];

    this.__isRunning = false;
    this.__progress = 0;
    this.__lastTimeStamp = 0;
    this.__duration = params.duration || 1000;

    this.__textSize = params.textSize || 13;
    this.__letterSpacing = params.letterSpacing || 4;
    this.__textLength = this.__textSize + this.__letterSpacing;

    this.__loop = params.loop || false;
    this.__loopedCount = 0;
    this.__callback = params.callback || function () {};

    this.createMessage();
  }

  _createClass(AnimateOnPath, [{
    key: 'destroy',
    value: function destroy() {

      this.__texts.forEach(function (text, idx) {

        _svg2.default.world.removeChild(text);
      });
    }
  }, {
    key: 'createMessage',
    value: function createMessage() {

      var self = this;
      this.__message.forEach(function (str) {

        var text = document.createElementNS(_svg2.default.xmlns, 'text');
        text.style.opacity = 1;
        text.style.fontSize = self.__textSize;
        text.innerHTML = str;
        _svg2.default.world.appendChild(text);

        self.__texts.push(text);
      });
    }
  }, {
    key: 'render',
    value: function render() {

      var self = this,
          currentLength = this.__totalLength * this.__progress;

      this.__texts.forEach(function (text, idx) {

        var textAtLength = currentLength - idx * self.__textLength;
        for (var i = 0; i < self.__loopedCount && textAtLength < 0; i++) {
          textAtLength = textAtLength + self.__totalLength;
        }

        if (textAtLength <= 0) {

          text.style.opacity = 0;
          return;
        }

        text.style.opacity = 1;

        var point = self.__pathElement.getPointAtLength(textAtLength);
        //, lastPoint = self.__pathElement.getPointAtLength(textAtLength - 1)
        //, angle = Math.atan2(point.y - lastPoint.y, point.x - lastPoint.x) * 180 / Math.PI;
        text.setAttributeNS(null, 'x', point.x);
        text.setAttributeNS(null, 'y', point.y);
        //text.setAttributeNS(null, 'transform', `translate(${point.x}, ${point.y}) rotate(${angle}, ${self.__textSize / 2}, ${self.__textSize / 2})`);
      });
    }
  }, {
    key: 'start',
    value: function start() {

      if (this.__isRunning || this.__progress >= 1) {

        return false;
      }

      this.__isRunning = true;
      this.__lastTimeStamp = timestamp();

      this.animate();

      return true;
    }
  }, {
    key: 'restart',
    value: function restart() {

      this.stop();
      this.start();

      return true;
    }
  }, {
    key: 'pause',
    value: function pause() {

      if (!this.__isRunning) {

        return false;
      }

      this.__isRunning = false;

      return true;
    }
  }, {
    key: 'stop',
    value: function stop() {

      this.__isRunning = false;
      this.__progress = 0;
      this.__loopedCount = 0;
      this.render();

      return true;
    }
  }, {
    key: 'animate',
    value: function animate() {

      if (!this.__isRunning) {

        return;
      }

      var changed = timestamp() - this.__lastTimeStamp;
      this.__lastTimeStamp = timestamp();

      this.__progress += changed / this.__duration;
      this.__progress > 1 && (this.__progress = 1);

      this.render();

      if (this.__progress === 1) {

        if (!this.__loop) {

          this.pause();
          this.__callback();
          return;
        }

        this.__loopedCount++;
        this.setProgress(0);
      }

      requestAnimationFrame(this.animate.bind(this));
    }
  }, {
    key: 'setProgress',
    value: function setProgress(progress) {

      this.__progress = progress;
    }
  }, {
    key: 'setLoop',
    value: function setLoop(loop) {

      this.__loop = loop;
    }
  }, {
    key: 'setDuration',
    value: function setDuration(duration) {

      this.__duration = duration;
    }
  }]);

  return AnimateOnPath;
})();

function timestamp() {

  return +new Date();
}

exports.default = AnimateOnPath;

},{"../../models/svg.js":4}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _svg = require('../../models/svg.js');

var _svg2 = _interopRequireDefault(_svg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Drawer = (function () {
  function Drawer() {
    _classCallCheck(this, Drawer);

    this.__size = 2;
    this.__stroke = '#a9a9a9';
    this.__fill = 'none';

    this.__line = '#cccccc';

    this.__group = document.createElementNS(_svg2.default.xmlns, 'g');

    this.clear();

    _svg2.default.world.appendChild(this.__group);
  }

  _createClass(Drawer, [{
    key: 'clear',
    value: function clear() {

      var child = null;
      while (child = this.__group.firstChild) {

        this.__group.removeChild(child);
      }

      this.__points = [];
      this.__path = document.createElementNS(_svg2.default.xmlns, 'path');
      this.__path.setAttributeNS(null, 'stroke', this.__line);
      this.__path.setAttributeNS(null, 'stroke-width', 1);
      this.__path.setAttributeNS(null, 'fill', 'none');
      this.__group.appendChild(this.__path);
    }
  }, {
    key: 'addPoint',
    value: function addPoint(point) {

      console.log('add', point);

      this.__points.push(point);

      var circle = document.createElementNS(_svg2.default.xmlns, 'circle');
      circle.setAttributeNS(null, 'cx', point.x);
      circle.setAttributeNS(null, 'cy', point.y);
      circle.setAttributeNS(null, 'r', this.__size);
      circle.setAttributeNS(null, 'stroke', this.__stroke);
      circle.setAttributeNS(null, 'fill', this.__fill);
      circle.setAttributeNS(null, 'stroke-width', 1);

      this.__group.appendChild(circle);
    }
  }, {
    key: 'setPath',
    value: function setPath(path) {

      this.__path.setAttributeNS(null, 'd', path);
    }
  }]);

  return Drawer;
})();

exports.default = Drawer;

},{"../../models/svg.js":4}],7:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _svg = require('../../models/svg.js');

var _svg2 = _interopRequireDefault(_svg);

var _point = require('../../models/point.js');

var _point2 = _interopRequireDefault(_point);

var _line = require('../../models/line.js');

var _line2 = _interopRequireDefault(_line);

var _drawer = require('./drawer.js');

var _drawer2 = _interopRequireDefault(_drawer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pen = (function () {
  function Pen() {
    _classCallCheck(this, Pen);

    this.__drawer = new _drawer2.default();

    this.__enabled = false;
    this.__dragging = false;

    this.__line = new _line2.default();
    this.__lastPoint = null;

    this.__minDistance = 100;

    window.addEventListener('mousedown', this.__onMousePress.bind(this));
    window.addEventListener('mousemove', this.__onMouseMove.bind(this));
    window.addEventListener('mouseup', this.__onMouseRelease.bind(this));
  }

  _createClass(Pen, [{
    key: '__clear',
    value: function __clear() {

      this.__lastPoint = new _point2.default(9999, 9999);
      this.__line.clear();

      this.__drawer.clear();
    }
  }, {
    key: '__addPoint',
    value: function __addPoint(point) {

      if (point.getDistance(this.__lastPoint) > this.__minDistance) {

        this.__line.append(this.__lastPoint = point);

        this.__drawer.addPoint(point);
        //this.__drawer.setPath(this.__line.getCurvedPath());
        this.__drawer.setPath(this.__line.getPath());
      }
    }
  }, {
    key: '__done',
    value: function __done() {

      this.onDrawEnd(this.__line);
    }
  }, {
    key: 'onDrawStart',
    value: function onDrawStart() {}
  }, {
    key: 'onDrawEnd',
    value: function onDrawEnd() {}
  }, {
    key: '__onMousePress',
    value: function __onMousePress(event) {

      if (!this.__enabled || this.__dragging) {

        return;
      }

      this.__dragging = true;

      this.onDrawStart();

      this.__clear();
      this.__addPoint(new _point2.default(event.clientX - _svg2.default.width / 2, event.clientY - _svg2.default.height / 2));
    }
  }, {
    key: '__onMouseRelease',
    value: function __onMouseRelease(event) {

      if (!this.__enabled || !this.__dragging) {

        return;
      }

      this.__dragging = false;

      this.__addPoint(new _point2.default(event.clientX - _svg2.default.width / 2, event.clientY - _svg2.default.height / 2));
      this.__done();
    }
  }, {
    key: '__onMouseMove',
    value: function __onMouseMove(event) {

      if (!this.__enabled || !this.__dragging) {

        return;
      }

      this.__addPoint(new _point2.default(event.clientX - _svg2.default.width / 2, event.clientY - _svg2.default.height / 2));
    }
  }, {
    key: 'enable',
    value: function enable() {

      this.__enabled = true;
    }
  }, {
    key: 'disable',
    value: function disable() {

      this.__enabled = false;
    }
  }, {
    key: 'setPointInterval',
    value: function setPointInterval(minDistance) {

      this.__minDistance = minDistance;
    }
  }]);

  return Pen;
})();

exports.default = Pen;

},{"../../models/line.js":2,"../../models/point.js":3,"../../models/svg.js":4,"./drawer.js":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvaW5kZXguanMiLCJzcmMvanMvbW9kZWxzL2xpbmUuanMiLCJzcmMvanMvbW9kZWxzL3BvaW50LmpzIiwic3JjL2pzL21vZGVscy9zdmcuanMiLCJzcmMvanMvbW9kdWxlcy9hbmltYXRlLW9uLXBhdGgvaW5kZXguanMiLCJzcmMvanMvbW9kdWxlcy9wZW4vZHJhd2VyLmpzIiwic3JjL2pzL21vZHVsZXMvcGVuL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDT0EsQ0FBQyxZQUFXOztBQUVWLGdCQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFdEIsTUFBSSxHQUFHLEdBQUcscUJBQVM7TUFDZixHQUFHO01BQ0gsSUFBSSxHQUFHLElBQUk7TUFDWCxRQUFRLEdBQUcsSUFBSTtNQUNmLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QyxLQUFHLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekIsS0FBRyxDQUFDLFdBQVcsR0FBRyxZQUFXOztBQUUzQixRQUFJLEdBQUcsRUFBRTtBQUNQLFNBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNkLFNBQUcsR0FBRyxJQUFJLENBQUM7S0FDWjtHQUVGLENBQUM7QUFDRixLQUFHLENBQUMsU0FBUyxHQUFHLFVBQVMsSUFBSSxFQUFFOztBQUU3QixRQUFJLElBQUksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQUksS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELFFBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMvQyxRQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0MsUUFB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QyxFQUFFLEtBQUssQ0FBQyxPQUFPLEdBQUcsY0FBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUUzRjs7O3FDQUVnQixLQUFLLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTs7QUFFdkMsZUFBTztPQUVSOztBQUVELFVBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDOztBQUV4QixVQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFVLEtBQUssQ0FBQyxPQUFPLEdBQUcsY0FBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLEdBQUcsY0FBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FFZjs7O2tDQUVhLEtBQUssRUFBRTs7QUFFbkIsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFOztBQUV2QyxlQUFPO09BRVI7O0FBRUQsVUFBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBVSxLQUFLLENBQUMsT0FBTyxHQUFHLGNBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxHQUFHLGNBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FFM0Y7Ozs2QkFFUTs7QUFFUCxVQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztLQUV2Qjs7OzhCQUVTOztBQUVSLFVBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0tBRXhCOzs7cUNBRWdCLFdBQVcsRUFBRTs7QUFFNUIsVUFBSSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUM7S0FFbEM7OztTQWpIRyxHQUFHOzs7a0JBcUhNLEdBQUciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHN2ZyBmcm9tICcuL21vZGVscy9zdmcuanMnO1xuaW1wb3J0IFBvaW50IGZyb20gJy4vbW9kZWxzL3BvaW50LmpzJztcbmltcG9ydCBMaW5lIGZyb20gJy4vbW9kZWxzL2xpbmUuanMnO1xuXG5pbXBvcnQgUGVuIGZyb20gJy4vbW9kdWxlcy9wZW4vaW5kZXguanMnO1xuaW1wb3J0IEFuaW1hdGVPblBhdGggZnJvbSAnLi9tb2R1bGVzL2FuaW1hdGUtb24tcGF0aC9pbmRleC5qcyc7XG5cbihmdW5jdGlvbigpIHtcblxuICBzdmcuaW5pdGlhbGl6ZSgnc3ZnJyk7XG5cbiAgdmFyIHBlbiA9IG5ldyBQZW4oKVxuICAgICwgYW9wXG4gICAgLCBsb29wID0gdHJ1ZVxuICAgICwgZHVyYXRpb24gPSAyMDAwXG4gICAgLCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dCcpO1xuXG4gIHBlbi5zZXRQb2ludEludGVydmFsKDEwKTtcbiAgcGVuLm9uRHJhd1N0YXJ0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICBpZiAoYW9wKSB7XG4gICAgICBhb3AuZGVzdHJveSgpO1xuICAgICAgYW9wID0gbnVsbDtcbiAgICB9XG5cbiAgfTtcbiAgcGVuLm9uRHJhd0VuZCA9IGZ1bmN0aW9uKGxpbmUpIHtcblxuICAgIHZhciBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Zy54bWxucywgJ3BhdGgnKTtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCAnI2NjY2NjYycpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZS13aWR0aCcsIDEpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBsaW5lLmdldFBhdGgoKSk7XG4gICAgcGVuLl9fY2xlYXIoKTtcbiAgICBhb3AgPSBuZXcgQW5pbWF0ZU9uUGF0aChwYXRoLCBpbnB1dC52YWx1ZSwge1xuICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgbG9vcDogbG9vcCxcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHt9XG4gICAgfSk7XG4gICAgYW9wLnN0YXJ0KCk7XG5cbiAgfTtcbiAgcGVuLmVuYWJsZSgpO1xuXG4gIC8vdmFyIGxpbmUgPSBuZXcgTGluZSgpO1xuICAvL1xuICAvL3ZhciBzaXplID0gNDAwO1xuICAvL2ZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAvL1xuICAvLyAgbGV0IHggPSBNYXRoLnJhbmRvbSgpICogc2l6ZSAqIDIgLSBzaXplXG4gIC8vICAgICwgeSA9IE1hdGgucmFuZG9tKCkgKiBzaXplIC0gc2l6ZSAvIDI7XG4gIC8vICBsaW5lLmFwcGVuZChuZXcgUG9pbnQoeCwgeSkpO1xuICAvL1xuICAvL31cblxuICAvL2xpbmUuYXBwZW5kKG5ldyBQb2ludCgtMzAwLCAtMTUwKSk7XG4gIC8vbGluZS5hcHBlbmQobmV3IFBvaW50KC0xMDAsIDApKTtcbiAgLy9saW5lLmFwcGVuZChuZXcgUG9pbnQoLTIwMCwgNTApKTtcbiAgLy9saW5lLmFwcGVuZChuZXcgUG9pbnQoMCwgMTApKTtcbiAgLy9saW5lLmFwcGVuZChuZXcgUG9pbnQoMzAwLCAtMTAwKSk7XG4gIC8vbGluZS5hcHBlbmQobmV3IFBvaW50KDEwMCwgMCkpO1xuICAvL2xpbmUuYXBwZW5kKG5ldyBQb2ludCgyMDAsIDEwMCkpO1xuXG4gIC8vdmFyIHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnLnhtbG5zLCAncGF0aCcpO1xuICAvL3BhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsICcjY2NjY2NjJyk7XG4gIC8vcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlLXdpZHRoJywgMSk7XG4gIC8vcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG4gIC8vcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIGxpbmUuZ2V0UGF0aCgpKTtcbiAgLy9wYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgbGluZS5nZXRDdXJ2ZWRQYXRoKCkpO1xuICAvL3N2Zy53b3JsZC5hcHBlbmRDaGlsZChwYXRoKTtcbiAgLy9cbiAgLy92YXIgYW9wID0gbmV3IEFuaW1hdGVPblBhdGgocGF0aCwgJ0FuaW1hdGUgdGV4dCBhbG9uZyB0aGUgbGluZScsIHtcbiAgLy8gIGR1cmF0aW9uOiAyMDAwXG4gIC8vfSk7XG4gIC8vYW9wLnN0YXJ0KCk7XG4gIC8vd2luZG93LmFvcCA9IGFvcDtcbiAgLy9cbiAgLy9zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAvLyAgY29uc29sZS5sb2coJ2Rlc3Ryb3knKTtcbiAgLy8gIGFvcC5kZXN0cm95KCk7XG4gIC8vICBhb3AgPSBudWxsO1xuICAvL30sIDMwMDApO1xuICAvL1xuICAvL3dpbmRvdy5wZW4gPSBuZXcgUGVuKCk7XG4gIC8vXG5cbiAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnV0dG9uIGEsIGlucHV0JyksIGZ1bmN0aW9uKGVsKSB7XG5cbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbi1zdGFydC1wYXVzZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgYW9wICYmIGFvcC5zdGFydCgpIHx8IGFvcC5wYXVzZSgpO1xuICB9KTtcbiAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uLXN0YXJ0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgLy8gIGFvcCAmJiBhb3Auc3RhcnQoKTtcbiAgLy99KTtcbiAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uLXBhdXNlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgLy8gIGFvcCAmJiBhb3AucGF1c2UoKTtcbiAgLy99KTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbi1yZXN0YXJ0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBhb3AgJiYgYW9wLnJlc3RhcnQoKTtcbiAgfSk7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b24tc3RvcCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgYW9wICYmIGFvcC5zdG9wKCk7XG4gIH0pO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uLWxvb3AnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2xhc3NOYW1lID9cbiAgICAgICh0aGlzLmNsYXNzTmFtZSA9ICcnKVxuICAgIDogKHRoaXMuY2xhc3NOYW1lID0gJ29mZicpO1xuXG4gICAgbG9vcCA9ICF0aGlzLmNsYXNzTmFtZTtcbiAgICBhb3AgJiYgYW9wLnNldExvb3AobG9vcCk7XG4gIH0pO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uLW5vcm1hbCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgZHVyYXRpb24gPSAyMDAwO1xuICAgIGFvcCAmJiBhb3Auc2V0RHVyYXRpb24oZHVyYXRpb24pO1xuICB9KTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbi1zbG93ZXInKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIGR1cmF0aW9uICo9IDEuMjtcbiAgICBhb3AgJiYgYW9wLnNldER1cmF0aW9uKGR1cmF0aW9uKTtcbiAgfSk7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b24tZmFzdGVyJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBkdXJhdGlvbiAvPSAxLjI7XG4gICAgYW9wICYmIGFvcC5zZXREdXJhdGlvbihkdXJhdGlvbik7XG4gIH0pO1xuXG59KSgpOyIsImltcG9ydCBQb2ludCBmcm9tICcuL3BvaW50LmpzJztcblxuY2xhc3MgTGluZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLl9fcG9pbnRzID0gW107XG4gICAgdGhpcy5kZWZhdWx0Q3VydmVMZXZlbCA9IDMwO1xuXG4gIH1cblxuICBjbGVhcigpIHtcblxuICAgIHRoaXMuX19wb2ludHMubGVuZ3RoID0gMDtcblxuICB9XG5cbiAgYXBwZW5kKHBvaW50KSB7XG5cbiAgICB0aGlzLl9fcG9pbnRzLnB1c2gocG9pbnQpO1xuXG4gICAgcmV0dXJuIHRoaXMuX19wb2ludHMubGVuZ3RoO1xuXG4gIH1cblxuICBwcmVwZW5kKHBvaW50KSB7XG5cbiAgICB0aGlzLl9fcG9pbnRzLnVuc2hpZnQocG9pbnQpO1xuXG4gICAgcmV0dXJuIHRoaXMuX19wb2ludHMubGVuZ3RoO1xuXG4gIH1cblxuICBnZXRQb2ludHMoKSB7XG5cbiAgICByZXR1cm4gdGhpcy5fX3BvaW50cztcblxuICB9XG5cbiAgZ2V0UGF0aCgpIHtcblxuICAgIHJldHVybiB0aGlzLl9fcG9pbnRzLm1hcChmdW5jdGlvbihwb2ludCkge1xuICAgICAgcmV0dXJuIGBMICR7cG9pbnQueHl9YDtcbiAgICB9KS5qb2luKCcgJykucmVwbGFjZSgvTC8sICdNJyk7XG5cbiAgfVxuXG4gIGdldEN1cnZlZFBhdGgoX2N1cnZlTGV2ZWwpIHtcblxuICAgIHZhciBjdXJ2ZUxldmVsID0gX2N1cnZlTGV2ZWwgfHwgdGhpcy5kZWZhdWx0Q3VydmVMZXZlbDtcblxuICAgIGlmICh0aGlzLl9fcG9pbnRzLmxlbmd0aCA8IDMpIHtcblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0UGF0aCgpO1xuXG4gICAgfVxuXG4gICAgdmFyIHBvaW50cyA9IHRoaXMuX19wb2ludHNcbiAgICAgICwgbGFzdElkeCA9IHBvaW50cy5sZW5ndGggLSAxO1xuXG4gICAgdmFyIGN1cnZlID0gdGhpcy5fX3BvaW50cy5tYXAoZnVuY3Rpb24ocG9pbnQsIGlkeCkge1xuXG4gICAgICBpZiAoaWR4ID09PSBsYXN0SWR4KSB7XG5cbiAgICAgICAgcmV0dXJuICcnO1xuXG4gICAgICB9XG5cbiAgICAgIHZhciBwcmV2UG9pbnQgPSBpZHggPT09IDAgPyBwb2ludCA6IHBvaW50c1tpZHggLSAxXVxuICAgICAgICAsIG5leHRQb2ludCA9IHBvaW50c1tpZHggKyAxXVxuICAgICAgICAsIG5leHROZXh0UG9pbnQgPSBpZHggPT09IGxhc3RJZHggLSAxID8gbmV4dFBvaW50IDogcG9pbnRzW2lkeCArIDJdXG4gICAgICAgICwgcHJldlZlY3RvciA9IGlkeCA9PT0gMCA/IG5ldyBQb2ludCgwLCAwKSA6IHByZXZQb2ludC5nZXRWZWN0b3IobmV4dFBvaW50KS5ub3JtYWxpemUoKVxuICAgICAgICAsIG5leHRWZWN0b3IgPSBpZHggPT09IGxhc3RJZHggLSAxID8gbmV3IFBvaW50KDAsIDApIDogbmV4dE5leHRQb2ludC5nZXRWZWN0b3IocG9pbnQpLm5vcm1hbGl6ZSgpO1xuXG4gICAgICByZXR1cm4gYEMgJHtwcmV2UG9pbnQueCArIHByZXZWZWN0b3IueCAqIGN1cnZlTGV2ZWx9LCR7cHJldlBvaW50LnkgKyBwcmV2VmVjdG9yLnkgKiBjdXJ2ZUxldmVsfSAke3BvaW50LnggKyBuZXh0VmVjdG9yLnggKiBjdXJ2ZUxldmVsfSwke3BvaW50LnkgKyBuZXh0VmVjdG9yLnkgKiBjdXJ2ZUxldmVsfSAke3BvaW50Lnh5fWA7XG5cbiAgICB9KS5qb2luKCcgJyk7XG5cbiAgICByZXR1cm4gYE0gJHt0aGlzLl9fcG9pbnRzWzBdLnh5fSAke2N1cnZlfSBgO1xuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBMaW5lOyIsImNsYXNzIFBvaW50IHtcblxuICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDApIHtcblxuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcblxuICB9XG5cbiAgZ2V0IHh5KCkge1xuXG4gICAgcmV0dXJuIGAke3RoaXMueH0sJHt0aGlzLnl9YDtcblxuICB9XG5cbiAgY2xvbmUoKSB7XG5cbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcblxuICB9XG5cbiAgZ2V0VmVjdG9yKHBvaW50KSB7XG5cbiAgICB2YXIgeCA9IHBvaW50LnggLSB0aGlzLnhcbiAgICAgICwgeSA9IHBvaW50LnkgLSB0aGlzLnk7XG5cbiAgICByZXR1cm4gbmV3IFBvaW50KHgsIHkpO1xuXG4gIH1cblxuICBub3JtYWxpemUoKSB7XG5cbiAgICB2YXIgbGVuID0gZ2V0RGlzdGFuY2UoMCwgMCwgdGhpcy54LCB0aGlzLnkpXG4gICAgICAsIHggPSB0aGlzLnggLyBsZW5cbiAgICAgICwgeSA9IHRoaXMueSAvIGxlbjtcblxuICAgIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XG5cbiAgfVxuXG4gIGdldERpc3RhbmNlKHBvaW50KSB7XG5cbiAgICByZXR1cm4gZ2V0RGlzdGFuY2UocG9pbnQueCwgcG9pbnQueSwgdGhpcy54LCB0aGlzLnkpXG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGdldERpc3RhbmNlKHgxLCB5MSwgeDIsIHkyKSB7XG5cbiAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh4MiAtIHgxLCAyKSArIE1hdGgucG93KHkyIC0geTEsIDIpKTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBQb2ludDsiLCJjbGFzcyBTdmcge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy54bWxucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG5cbiAgfVxuXG4gIGluaXRpYWxpemUoaWQpIHtcblxuICAgIHRoaXMuX19kb20gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cbiAgICAvLyBDcmVhdGUgd3JhcHBlciBncm91cCB0byBtYWtlICgwLCAwKSBhbHdheXMgYmUgY2VudGVyIG9mIHRoZSBzY3JlZW5cbiAgICB0aGlzLndvcmxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMueG1sbnMsICdnJyk7XG4gICAgdGhpcy5fX2RvbS5hcHBlbmRDaGlsZCh0aGlzLndvcmxkKTtcblxuICAgIHRoaXMuc2V0U3ZnU2l6ZSgpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUuYmluZCh0aGlzKSk7XG5cbiAgfVxuXG4gIHNldFN2Z1NpemUod2lkdGgsIGhlaWdodCkge1xuXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoIHx8IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0IHx8IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgIHRoaXMuX19kb20uc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4JztcbiAgICB0aGlzLl9fZG9tLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4JztcblxuICAgIHRoaXMud29ybGQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt0aGlzLndpZHRoIC8gMn0sICR7dGhpcy5oZWlnaHQgLyAyfSlgKTtcblxuICB9XG5cbiAgb25SZXNpemUoKSB7XG5cbiAgICB0aGlzLnNldFN2Z1NpemUoKTtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFN2ZygpOyIsImltcG9ydCBzdmcgZnJvbSAnLi4vLi4vbW9kZWxzL3N2Zy5qcyc7XG5cbmNsYXNzIEFuaW1hdGVPblBhdGgge1xuXG4gIGNvbnN0cnVjdG9yKHBhdGhFbGVtZW50LCBtZXNzYWdlLCBwYXJhbXMgPSB7fSkge1xuXG4gICAgdGhpcy5fX3BhdGhFbGVtZW50ID0gcGF0aEVsZW1lbnQ7XG4gICAgdGhpcy5fX3RvdGFsTGVuZ3RoID0gcGF0aEVsZW1lbnQuZ2V0VG90YWxMZW5ndGgoKTtcbiAgICB0aGlzLl9fbWVzc2FnZSA9IG1lc3NhZ2Uuc3BsaXQoJycpO1xuICAgIHRoaXMuX190ZXh0cyA9IFtdO1xuXG4gICAgdGhpcy5fX2lzUnVubmluZyA9IGZhbHNlO1xuICAgIHRoaXMuX19wcm9ncmVzcyA9IDA7XG4gICAgdGhpcy5fX2xhc3RUaW1lU3RhbXAgPSAwO1xuICAgIHRoaXMuX19kdXJhdGlvbiA9IHBhcmFtcy5kdXJhdGlvbiB8fCAxMDAwO1xuXG4gICAgdGhpcy5fX3RleHRTaXplID0gcGFyYW1zLnRleHRTaXplIHx8IDEzO1xuICAgIHRoaXMuX19sZXR0ZXJTcGFjaW5nID0gcGFyYW1zLmxldHRlclNwYWNpbmcgfHwgNDtcbiAgICB0aGlzLl9fdGV4dExlbmd0aCA9IHRoaXMuX190ZXh0U2l6ZSArIHRoaXMuX19sZXR0ZXJTcGFjaW5nO1xuXG4gICAgdGhpcy5fX2xvb3AgPSBwYXJhbXMubG9vcCB8fCBmYWxzZTtcbiAgICB0aGlzLl9fbG9vcGVkQ291bnQgPSAwO1xuICAgIHRoaXMuX19jYWxsYmFjayA9IHBhcmFtcy5jYWxsYmFjayB8fCBmdW5jdGlvbigpe307XG5cbiAgICB0aGlzLmNyZWF0ZU1lc3NhZ2UoKTtcblxuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIHRoaXMuX190ZXh0cy5mb3JFYWNoKGZ1bmN0aW9uKHRleHQsIGlkeCkge1xuXG4gICAgICBzdmcud29ybGQucmVtb3ZlQ2hpbGQodGV4dCk7XG5cbiAgICB9KTtcblxuICB9XG5cbiAgY3JlYXRlTWVzc2FnZSgpIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLl9fbWVzc2FnZS5mb3JFYWNoKGZ1bmN0aW9uKHN0cikge1xuXG4gICAgICB2YXIgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhzdmcueG1sbnMsICd0ZXh0Jyk7XG4gICAgICB0ZXh0LnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgdGV4dC5zdHlsZS5mb250U2l6ZSA9IHNlbGYuX190ZXh0U2l6ZTtcbiAgICAgIHRleHQuaW5uZXJIVE1MID0gc3RyO1xuICAgICAgc3ZnLndvcmxkLmFwcGVuZENoaWxkKHRleHQpO1xuXG4gICAgICBzZWxmLl9fdGV4dHMucHVzaCh0ZXh0KTtcblxuICAgIH0pO1xuXG4gIH1cblxuICByZW5kZXIoKSB7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICwgY3VycmVudExlbmd0aCA9IHRoaXMuX190b3RhbExlbmd0aCAqIHRoaXMuX19wcm9ncmVzcztcblxuICAgIHRoaXMuX190ZXh0cy5mb3JFYWNoKGZ1bmN0aW9uKHRleHQsIGlkeCkge1xuXG4gICAgICB2YXIgdGV4dEF0TGVuZ3RoID0gY3VycmVudExlbmd0aCAtIGlkeCAqIHNlbGYuX190ZXh0TGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxmLl9fbG9vcGVkQ291bnQgJiYgdGV4dEF0TGVuZ3RoIDwgMDsgaSsrKSB7XG4gICAgICAgIHRleHRBdExlbmd0aCA9IHRleHRBdExlbmd0aCArIHNlbGYuX190b3RhbExlbmd0aDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRleHRBdExlbmd0aCA8PSAwKSB7XG5cbiAgICAgICAgdGV4dC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICB9XG5cbiAgICAgIHRleHQuc3R5bGUub3BhY2l0eSA9IDE7XG5cbiAgICAgIHZhciBwb2ludCA9IHNlbGYuX19wYXRoRWxlbWVudC5nZXRQb2ludEF0TGVuZ3RoKHRleHRBdExlbmd0aCk7XG4gICAgICAgIC8vLCBsYXN0UG9pbnQgPSBzZWxmLl9fcGF0aEVsZW1lbnQuZ2V0UG9pbnRBdExlbmd0aCh0ZXh0QXRMZW5ndGggLSAxKVxuICAgICAgICAvLywgYW5nbGUgPSBNYXRoLmF0YW4yKHBvaW50LnkgLSBsYXN0UG9pbnQueSwgcG9pbnQueCAtIGxhc3RQb2ludC54KSAqIDE4MCAvIE1hdGguUEk7XG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgcG9pbnQueCk7XG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgcG9pbnQueSk7XG4gICAgICAvL3RleHQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtwb2ludC54fSwgJHtwb2ludC55fSkgcm90YXRlKCR7YW5nbGV9LCAke3NlbGYuX190ZXh0U2l6ZSAvIDJ9LCAke3NlbGYuX190ZXh0U2l6ZSAvIDJ9KWApO1xuXG4gICAgfSk7XG5cbiAgfVxuXG4gIHN0YXJ0KCkge1xuXG4gICAgaWYgKHRoaXMuX19pc1J1bm5pbmcgfHwgdGhpcy5fX3Byb2dyZXNzID49IDEpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgfVxuXG4gICAgdGhpcy5fX2lzUnVubmluZyA9IHRydWU7XG4gICAgdGhpcy5fX2xhc3RUaW1lU3RhbXAgPSB0aW1lc3RhbXAoKTtcblxuICAgIHRoaXMuYW5pbWF0ZSgpO1xuXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfVxuXG4gIHJlc3RhcnQoKSB7XG5cbiAgICB0aGlzLnN0b3AoKTtcbiAgICB0aGlzLnN0YXJ0KCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9XG5cbiAgcGF1c2UoKSB7XG5cbiAgICBpZiAoIXRoaXMuX19pc1J1bm5pbmcpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgfVxuXG4gICAgdGhpcy5fX2lzUnVubmluZyA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfVxuXG4gIHN0b3AoKSB7XG5cbiAgICB0aGlzLl9faXNSdW5uaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fX3Byb2dyZXNzID0gMDtcbiAgICB0aGlzLl9fbG9vcGVkQ291bnQgPSAwO1xuICAgIHRoaXMucmVuZGVyKCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9XG5cbiAgYW5pbWF0ZSgpIHtcblxuICAgIGlmICghdGhpcy5fX2lzUnVubmluZykge1xuXG4gICAgICByZXR1cm47XG5cbiAgICB9XG5cbiAgICB2YXIgY2hhbmdlZCA9IHRpbWVzdGFtcCgpIC0gdGhpcy5fX2xhc3RUaW1lU3RhbXA7XG4gICAgdGhpcy5fX2xhc3RUaW1lU3RhbXAgPSB0aW1lc3RhbXAoKTtcblxuICAgIHRoaXMuX19wcm9ncmVzcyArPSBjaGFuZ2VkIC8gdGhpcy5fX2R1cmF0aW9uO1xuICAgIHRoaXMuX19wcm9ncmVzcyA+IDEgJiYgKHRoaXMuX19wcm9ncmVzcyA9IDEpO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcblxuICAgIGlmICh0aGlzLl9fcHJvZ3Jlc3MgPT09IDEpIHtcblxuICAgICAgaWYgKCF0aGlzLl9fbG9vcCkge1xuXG5cbiAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICB0aGlzLl9fY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX19sb29wZWRDb3VudCsrO1xuICAgICAgdGhpcy5zZXRQcm9ncmVzcygwKTtcblxuICAgIH1cblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGUuYmluZCh0aGlzKSk7XG5cblxuICB9XG5cbiAgc2V0UHJvZ3Jlc3MocHJvZ3Jlc3MpIHtcblxuICAgIHRoaXMuX19wcm9ncmVzcyA9IHByb2dyZXNzO1xuXG4gIH1cblxuICBzZXRMb29wKGxvb3ApIHtcblxuICAgIHRoaXMuX19sb29wID0gbG9vcDtcblxuICB9XG5cbiAgc2V0RHVyYXRpb24oZHVyYXRpb24pIHtcblxuICAgIHRoaXMuX19kdXJhdGlvbiA9IGR1cmF0aW9uO1xuXG4gIH1cblxufVxuXG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG5cbiAgcmV0dXJuICtuZXcgRGF0ZSgpO1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEFuaW1hdGVPblBhdGg7IiwiaW1wb3J0IHN2ZyBmcm9tICcuLi8uLi9tb2RlbHMvc3ZnLmpzJztcblxuY2xhc3MgRHJhd2VyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuX19zaXplID0gMjtcbiAgICB0aGlzLl9fc3Ryb2tlID0gJyNhOWE5YTknO1xuICAgIHRoaXMuX19maWxsID0gJ25vbmUnO1xuXG4gICAgdGhpcy5fX2xpbmUgPSAnI2NjY2NjYyc7XG5cbiAgICB0aGlzLl9fZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnLnhtbG5zLCAnZycpO1xuXG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgc3ZnLndvcmxkLmFwcGVuZENoaWxkKHRoaXMuX19ncm91cCk7XG5cbiAgfVxuXG4gIGNsZWFyKCkge1xuXG4gICAgdmFyIGNoaWxkID0gbnVsbDtcbiAgICB3aGlsZSAoY2hpbGQgPSB0aGlzLl9fZ3JvdXAuZmlyc3RDaGlsZCkge1xuXG4gICAgICB0aGlzLl9fZ3JvdXAucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuXG4gICAgfVxuXG4gICAgdGhpcy5fX3BvaW50cyA9IFtdO1xuICAgIHRoaXMuX19wYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Zy54bWxucywgJ3BhdGgnKTtcbiAgICB0aGlzLl9fcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5fX2xpbmUpO1xuICAgIHRoaXMuX19wYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2Utd2lkdGgnLCAxKTtcbiAgICB0aGlzLl9fcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG4gICAgdGhpcy5fX2dyb3VwLmFwcGVuZENoaWxkKHRoaXMuX19wYXRoKTtcblxuICB9XG5cbiAgYWRkUG9pbnQocG9pbnQpIHtcblxuICAgIGNvbnNvbGUubG9nKCdhZGQnLCBwb2ludCk7XG5cbiAgICB0aGlzLl9fcG9pbnRzLnB1c2gocG9pbnQpO1xuXG4gICAgdmFyIGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhzdmcueG1sbnMsICdjaXJjbGUnKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2N4JywgcG9pbnQueCk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdjeScsIHBvaW50LnkpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHRoaXMuX19zaXplKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMuX19zdHJva2UpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsIHRoaXMuX19maWxsKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZS13aWR0aCcsIDEpO1xuXG4gICAgdGhpcy5fX2dyb3VwLmFwcGVuZENoaWxkKGNpcmNsZSk7XG5cbiAgfVxuXG4gIHNldFBhdGgocGF0aCkge1xuXG4gICAgdGhpcy5fX3BhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBwYXRoKTtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRHJhd2VyOyIsImltcG9ydCBzdmcgZnJvbSAnLi4vLi4vbW9kZWxzL3N2Zy5qcyc7XG5pbXBvcnQgUG9pbnQgZnJvbSAnLi4vLi4vbW9kZWxzL3BvaW50LmpzJztcbmltcG9ydCBMaW5lIGZyb20gJy4uLy4uL21vZGVscy9saW5lLmpzJztcblxuaW1wb3J0IERyYXdlciBmcm9tICcuL2RyYXdlci5qcyc7XG5cbmNsYXNzIFBlbiB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLl9fZHJhd2VyID0gbmV3IERyYXdlcigpO1xuXG4gICAgdGhpcy5fX2VuYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9fZHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgIHRoaXMuX19saW5lID0gbmV3IExpbmUoKTtcbiAgICB0aGlzLl9fbGFzdFBvaW50ID0gbnVsbDtcblxuICAgIHRoaXMuX19taW5EaXN0YW5jZSA9IDEwMDtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9fb25Nb3VzZVByZXNzLmJpbmQodGhpcykpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9fb25Nb3VzZU1vdmUuYmluZCh0aGlzKSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9fb25Nb3VzZVJlbGVhc2UuYmluZCh0aGlzKSk7XG5cbiAgfVxuXG4gIF9fY2xlYXIgKCkge1xuXG4gICAgdGhpcy5fX2xhc3RQb2ludCA9IG5ldyBQb2ludCg5OTk5LCA5OTk5KTtcbiAgICB0aGlzLl9fbGluZS5jbGVhcigpO1xuXG4gICAgdGhpcy5fX2RyYXdlci5jbGVhcigpO1xuXG4gIH1cblxuICBfX2FkZFBvaW50KHBvaW50KSB7XG5cbiAgICBpZiAocG9pbnQuZ2V0RGlzdGFuY2UodGhpcy5fX2xhc3RQb2ludCkgPiB0aGlzLl9fbWluRGlzdGFuY2UpIHtcblxuICAgICAgdGhpcy5fX2xpbmUuYXBwZW5kKHRoaXMuX19sYXN0UG9pbnQgPSBwb2ludCk7XG5cbiAgICAgIHRoaXMuX19kcmF3ZXIuYWRkUG9pbnQocG9pbnQpO1xuICAgICAgLy90aGlzLl9fZHJhd2VyLnNldFBhdGgodGhpcy5fX2xpbmUuZ2V0Q3VydmVkUGF0aCgpKTtcbiAgICAgIHRoaXMuX19kcmF3ZXIuc2V0UGF0aCh0aGlzLl9fbGluZS5nZXRQYXRoKCkpO1xuXG4gICAgfVxuXG4gIH1cblxuICBfX2RvbmUoKSB7XG5cbiAgICB0aGlzLm9uRHJhd0VuZCh0aGlzLl9fbGluZSk7XG5cbiAgfVxuXG4gIG9uRHJhd1N0YXJ0KCkge31cblxuICBvbkRyYXdFbmQoKSB7fVxuXG4gIF9fb25Nb3VzZVByZXNzKGV2ZW50KSB7XG5cbiAgICBpZiAoIXRoaXMuX19lbmFibGVkIHx8IHRoaXMuX19kcmFnZ2luZykge1xuXG4gICAgICByZXR1cm47XG5cbiAgICB9XG5cbiAgICB0aGlzLl9fZHJhZ2dpbmcgPSB0cnVlO1xuXG4gICAgdGhpcy5vbkRyYXdTdGFydCgpO1xuXG4gICAgdGhpcy5fX2NsZWFyKCk7XG4gICAgdGhpcy5fX2FkZFBvaW50KG5ldyBQb2ludChldmVudC5jbGllbnRYIC0gc3ZnLndpZHRoIC8gMiwgZXZlbnQuY2xpZW50WSAtIHN2Zy5oZWlnaHQgLyAyKSk7XG5cbiAgfVxuXG4gIF9fb25Nb3VzZVJlbGVhc2UoZXZlbnQpIHtcblxuICAgIGlmICghdGhpcy5fX2VuYWJsZWQgfHwgIXRoaXMuX19kcmFnZ2luZykge1xuXG4gICAgICByZXR1cm47XG5cbiAgICB9XG5cbiAgICB0aGlzLl9fZHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgIHRoaXMuX19hZGRQb2ludChuZXcgUG9pbnQoZXZlbnQuY2xpZW50WCAtIHN2Zy53aWR0aCAvIDIsIGV2ZW50LmNsaWVudFkgLSBzdmcuaGVpZ2h0IC8gMikpO1xuICAgIHRoaXMuX19kb25lKCk7XG5cbiAgfVxuXG4gIF9fb25Nb3VzZU1vdmUoZXZlbnQpIHtcblxuICAgIGlmICghdGhpcy5fX2VuYWJsZWQgfHwgIXRoaXMuX19kcmFnZ2luZykge1xuXG4gICAgICByZXR1cm47XG5cbiAgICB9XG5cbiAgICB0aGlzLl9fYWRkUG9pbnQobmV3IFBvaW50KGV2ZW50LmNsaWVudFggLSBzdmcud2lkdGggLyAyLCBldmVudC5jbGllbnRZIC0gc3ZnLmhlaWdodCAvIDIpKTtcblxuICB9XG5cbiAgZW5hYmxlKCkge1xuXG4gICAgdGhpcy5fX2VuYWJsZWQgPSB0cnVlO1xuXG4gIH1cblxuICBkaXNhYmxlKCkge1xuXG4gICAgdGhpcy5fX2VuYWJsZWQgPSBmYWxzZTtcblxuICB9XG5cbiAgc2V0UG9pbnRJbnRlcnZhbChtaW5EaXN0YW5jZSkge1xuXG4gICAgdGhpcy5fX21pbkRpc3RhbmNlID0gbWluRGlzdGFuY2U7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBlbjsiXX0=
