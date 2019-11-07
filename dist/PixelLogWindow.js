"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Badge = _interopRequireDefault(require("@material-ui/core/Badge"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _styles = require("@material-ui/core/styles");

var _Tabs = _interopRequireDefault(require("@material-ui/core/Tabs"));

var _Tab = _interopRequireDefault(require("@material-ui/core/Tab"));

var _Card = _interopRequireDefault(require("@material-ui/core/Card"));

var _AppBar = _interopRequireDefault(require("@material-ui/core/AppBar"));

var _Toolbar = _interopRequireDefault(require("@material-ui/core/Toolbar"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _pixelStreamingContext = _interopRequireDefault(require("./lib/pixel-streaming-context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var style = {
  flexGrow: 1,
  maxWidth: 500
};

var PixelLogWindow = function PixelLogWindow() {
  return _react.default.createElement(_pixelStreamingContext.default.Consumer, null, function (state) {
    return _react.default.createElement(_Paper.default, {
      square: true,
      style: style
    }, _react.default.createElement(_AppBar.default, {
      position: "static",
      color: "default"
    }, _react.default.createElement(_Toolbar.default, null, _react.default.createElement(_Typography.default, {
      variant: "h6",
      color: "inherit"
    }, "Logs", _react.default.createElement(_Badge.default, {
      badgeContent: state.logs.length,
      color: "secondary"
    })))), state.logs.slice().reverse().map(function (log) {
      return _react.default.createElement(_Card.default, null, _react.default.createElement(_Button.default, {
        id: "{log}",
        variant: "contained",
        target: "_blank",
        href: "https://www.google.com/search?q=".concat(log)
      }, log));
    }));
  });
};

var _default = PixelLogWindow;
exports.default = _default;