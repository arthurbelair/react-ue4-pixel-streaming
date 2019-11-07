"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _pixelStreamingContext = _interopRequireDefault(require("./lib/pixel-streaming-context"));

var _videoHelper = _interopRequireDefault(require("./lib/videoHelper"));

var _resizeObserver = _interopRequireDefault(require("@juggle/resize-observer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// TODO: keyboard/mouse event
var PixelVideo =
/*#__PURE__*/
function (_React$Component) {
  _inherits(PixelVideo, _React$Component);

  function PixelVideo(props) {
    var _this;

    _classCallCheck(this, PixelVideo);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PixelVideo).call(this, props));
    _this.state = {
      webRtcPlayerObj: {}
    };
    return _this;
  }

  _createClass(PixelVideo, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      console.log(this.props.clientConfig.peerConnectionOptions);
      var webRtcPlayerObj = new this.props.webRtcPlayer({
        peerConnectionOptions: this.props.clientConfig.peerConnectionOptions
      });
      console.log(webRtcPlayerObj);
      this.setState({
        webRtcPlayerObj: webRtcPlayerObj
      });
      this.props.setWebRTCPlayerObj(webRtcPlayerObj); // Elementを挿入

      this.refs.video.appendChild(webRtcPlayerObj.video); // videoのサイズ設定

      webRtcPlayerObj.video.style.setProperty("width", "100%");
      webRtcPlayerObj.video.style.setProperty("padding", "10px"); // videoのsizeをモニター

      var resizeObserver = new _resizeObserver.default(function (entries) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var entry = _step.value;
            var rect = entry.contentRect; // console.log(rect.top, rect.left);
            // console.log(rect.width, rect.height);

            _this2.props.setVideoAspectRatio(webRtcPlayerObj.video);

            _this2.props.setPlayerAspectRatio(webRtcPlayerObj.video); // TODO: video解像度とプレイヤーサイズ仕込む

          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });
      resizeObserver.observe(webRtcPlayerObj.video); // video上での右クリメニュー殺しとく

      webRtcPlayerObj.video.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      }, false); // webRtcPlayerにeventとか設定

      (0, _videoHelper.default)(webRtcPlayerObj, this.props.socket, this.props.responseEventListeners, this.props.addLatestStats); // createOffer

      webRtcPlayerObj.createOffer(); // マウスとかの設定
      // registerInputs(webRtcPlayerObj.video);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        ref: "video",
        style: {
          width: "100%"
        }
      });
    }
  }]);

  return PixelVideo;
}(_react.default.Component);

var style = {};
var _default = PixelVideo; // 	// TODO: マウス設定
// 	switch (inputOptions.controlScheme) {
// 		case ControlSchemeType.HoveringMouse:
// 			registerHoveringMouseEvents(playerElement);
// 			break;
// 		case ControlSchemeType.LockedMouse:
// 			registerLockedMouseEvents(playerElement);
// 			break;
// 		default:
// 			console.log(`ERROR: Unknown control scheme ${inputOptions.controlScheme}`);
// 			registerLockedMouseEvents(playerElement);
// 			break;
// 	}
// }

exports.default = _default;
var marks = [{
  value: 0,
  label: "0°C"
}, {
  value: 20,
  label: "20°C"
}, {
  value: 37,
  label: "37°C"
}, {
  value: 100,
  label: "100°C"
}];

function valuetext(value) {
  return "".concat(value, "\xB0C");
}