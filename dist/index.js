"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PixelStreamingContext", {
  enumerable: true,
  get: function get() {
    return _pixelStreamingContext.default;
  }
});
exports.default = void 0;

var _ReactPixelStreaming = _interopRequireDefault(require("./ReactPixelStreaming"));

var _pixelStreamingContext = _interopRequireDefault(require("./lib/pixel-streaming-context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _ReactPixelStreaming.default;
exports.default = _default;