/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/expand-tilde";
exports.ids = ["vendor-chunks/expand-tilde"];
exports.modules = {

/***/ "(rsc)/./node_modules/expand-tilde/index.js":
/*!********************************************!*\
  !*** ./node_modules/expand-tilde/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/*!\n * expand-tilde <https://github.com/jonschlinkert/expand-tilde>\n *\n * Copyright (c) 2015 Jon Schlinkert.\n * Licensed under the MIT license.\n */\n\nvar homedir = __webpack_require__(/*! homedir-polyfill */ \"(rsc)/./node_modules/homedir-polyfill/index.js\");\nvar path = __webpack_require__(/*! path */ \"path\");\n\nmodule.exports = function expandTilde(filepath) {\n  var home = homedir();\n\n  if (filepath.charCodeAt(0) === 126 /* ~ */) {\n    if (filepath.charCodeAt(1) === 43 /* + */) {\n      return path.join(process.cwd(), filepath.slice(2));\n    }\n    return home ? path.join(home, filepath.slice(1)) : filepath;\n  }\n\n  return filepath;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvZXhwYW5kLXRpbGRlL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxjQUFjLG1CQUFPLENBQUMsd0VBQWtCO0FBQ3hDLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTs7QUFFekI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3RvcndpbHNvbi9EZXNrdG9wL3Byb2plY3RzL0VaVml6L25vZGVfbW9kdWxlcy9leHBhbmQtdGlsZGUvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBleHBhbmQtdGlsZGUgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2V4cGFuZC10aWxkZT5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgSm9uIFNjaGxpbmtlcnQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKi9cblxudmFyIGhvbWVkaXIgPSByZXF1aXJlKCdob21lZGlyLXBvbHlmaWxsJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBleHBhbmRUaWxkZShmaWxlcGF0aCkge1xuICB2YXIgaG9tZSA9IGhvbWVkaXIoKTtcblxuICBpZiAoZmlsZXBhdGguY2hhckNvZGVBdCgwKSA9PT0gMTI2IC8qIH4gKi8pIHtcbiAgICBpZiAoZmlsZXBhdGguY2hhckNvZGVBdCgxKSA9PT0gNDMgLyogKyAqLykge1xuICAgICAgcmV0dXJuIHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBmaWxlcGF0aC5zbGljZSgyKSk7XG4gICAgfVxuICAgIHJldHVybiBob21lID8gcGF0aC5qb2luKGhvbWUsIGZpbGVwYXRoLnNsaWNlKDEpKSA6IGZpbGVwYXRoO1xuICB9XG5cbiAgcmV0dXJuIGZpbGVwYXRoO1xufTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/expand-tilde/index.js\n");

/***/ })

};
;