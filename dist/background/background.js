/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/background/background.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/background/background.js":
/*!**************************************!*\
  !*** ./src/background/background.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step(\"next\", value); }, function (err) { step(\"throw\", err); }); } } return step(\"next\"); }); }; }\n\n_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {\n  var data;\n  return regeneratorRuntime.wrap(function _callee$(_context) {\n    while (1) {\n      switch (_context.prev = _context.next) {\n        case 0:\n          _context.next = 2;\n          return browser.storage.sync.get();\n\n        case 2:\n          data = _context.sent;\n\n          if (data.categories) {\n            _context.next = 6;\n            break;\n          }\n\n          _context.next = 6;\n          return browser.storage.sync.set({ categories: {} });\n\n        case 6:\n          if (data.css) {\n            _context.next = 9;\n            break;\n          }\n\n          _context.next = 9;\n          return browser.storage.sync.set({ css: \"body {\\n  background: #111;\\n  color: #999;\\n  font-family: Verdana;\\n  margin: 0;\\n  padding: 0;\\n  width: 100%;\\n  height: 100%;\\n}\\n\\n.category {\\n  background: #222;\\n  border: 1px solid #000;\\n  border-radius: 3px;\\n  padding: 6px;\\n  display: flex;\\n  flex-direction: column;\\n  flex-wrap: wrap;\\n}\\n\\n.category-header {\\n  font-weight: bold;\\n  font-size: 1.2em;\\n  margin: 5px;\\n}\\n\\n.link {\\n  text-decoration: none;\\n  color: #F62217;\\n  display: table-row;\\n}\\n\\n.shortcut {\\n  color: #EEEEEEC0;\\n  border: 1px solid #EEEEEE40;\\n  padding: 2px;\\n  font-size: 80%;\\n  border-radius: 3px;\\n}\"\n          });\n\n        case 9:\n        case \"end\":\n          return _context.stop();\n      }\n    }\n  }, _callee, this);\n}))();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLmpzP2VjZDEiXSwibmFtZXMiOlsiYnJvd3NlciIsInN0b3JhZ2UiLCJzeW5jIiwiZ2V0IiwiZGF0YSIsImNhdGVnb3JpZXMiLCJzZXQiLCJjc3MiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSx3REFBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUNrQkEsUUFBUUMsT0FBUixDQUFnQkMsSUFBaEIsQ0FBcUJDLEdBQXJCLEVBRGxCOztBQUFBO0FBQ0tDLGNBREw7O0FBQUEsY0FFTUEsS0FBS0MsVUFGWDtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLGlCQUdTTCxRQUFRQyxPQUFSLENBQWdCQyxJQUFoQixDQUFxQkksR0FBckIsQ0FBeUIsRUFBRUQsWUFBWSxFQUFkLEVBQXpCLENBSFQ7O0FBQUE7QUFBQSxjQUtNRCxLQUFLRyxHQUxYO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsaUJBTVNQLFFBQVFDLE9BQVIsQ0FBZ0JDLElBQWhCLENBQXFCSSxHQUFyQixDQUF5QixFQUFFQztBQUFGLFdBQXpCLENBTlQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBRCIsImZpbGUiOiIuL3NyYy9iYWNrZ3JvdW5kL2JhY2tncm91bmQuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCBkYXRhID0gYXdhaXQgYnJvd3Nlci5zdG9yYWdlLnN5bmMuZ2V0KClcclxuICBpZiAoIWRhdGEuY2F0ZWdvcmllcykge1xyXG4gICAgYXdhaXQgYnJvd3Nlci5zdG9yYWdlLnN5bmMuc2V0KHsgY2F0ZWdvcmllczoge30gfSlcclxuICB9XHJcbiAgaWYgKCFkYXRhLmNzcykge1xyXG4gICAgYXdhaXQgYnJvd3Nlci5zdG9yYWdlLnN5bmMuc2V0KHsgY3NzOiBgYm9keSB7XHJcbiAgYmFja2dyb3VuZDogIzExMTtcclxuICBjb2xvcjogIzk5OTtcclxuICBmb250LWZhbWlseTogVmVyZGFuYTtcclxuICBtYXJnaW46IDA7XHJcbiAgcGFkZGluZzogMDtcclxuICB3aWR0aDogMTAwJTtcclxuICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuXHJcbi5jYXRlZ29yeSB7XHJcbiAgYmFja2dyb3VuZDogIzIyMjtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjMDAwO1xyXG4gIGJvcmRlci1yYWRpdXM6IDNweDtcclxuICBwYWRkaW5nOiA2cHg7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGZsZXgtd3JhcDogd3JhcDtcclxufVxyXG5cclxuLmNhdGVnb3J5LWhlYWRlciB7XHJcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgZm9udC1zaXplOiAxLjJlbTtcclxuICBtYXJnaW46IDVweDtcclxufVxyXG5cclxuLmxpbmsge1xyXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICBjb2xvcjogI0Y2MjIxNztcclxuICBkaXNwbGF5OiB0YWJsZS1yb3c7XHJcbn1cclxuXHJcbi5zaG9ydGN1dCB7XHJcbiAgY29sb3I6ICNFRUVFRUVDMDtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjRUVFRUVFNDA7XHJcbiAgcGFkZGluZzogMnB4O1xyXG4gIGZvbnQtc2l6ZTogODAlO1xyXG4gIGJvcmRlci1yYWRpdXM6IDNweDtcclxufWBcclxuICAgIH0pXHJcbiAgfVxyXG59KSgpXHJcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/background/background.js\n");

/***/ })

/******/ });