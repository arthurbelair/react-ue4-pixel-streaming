"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _pixelStreamingContext = _interopRequireDefault(require("./lib/pixel-streaming-context"));

var _PixelVideo = _interopRequireDefault(require("./PixelVideo"));

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

var PixelWindow =
/*#__PURE__*/
function (_React$Component) {
  _inherits(PixelWindow, _React$Component);

  function PixelWindow(props) {
    var _this;

    _classCallCheck(this, PixelWindow);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PixelWindow).call(this, props));
    _this.state = {};
    return _this;
  }

  _createClass(PixelWindow, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // PixelStreamingのロード
      // loadでkeyInputのバインド
      this.props.load(); // 黙ってconnect()
      // TODO: connectの状態をstateに反映できるように改修
      // TODO: 接続ホストを引数で渡せるように修正

      this.props.connect(this.props.host, this.props.actions);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "render",
    value: function render() {
      console.log(this.props.windowStyle);
      return (// TODO: video上でのdrag and dropとhoverを無効化できるようにする
        _react.default.createElement("div", {
          style: this.props.windowStyle,
          onMouseEnter: function onMouseEnter(e) {// console.log("enter");
            // this.props.setDisableDragging(true);
          },
          onMouseLeave: function onMouseLeave(e) {// console.log("leave");
            // this.props.setDisableDragging(false);
          } //   e.persist(); 
          //   e.nativeEvent.stopImmediatePropagation();
          //   e.stopPropagation(); 
          //  }}
          //  onClick={e=>{
          //   e.persist(); 
          //   e.nativeEvent.stopImmediatePropagation();
          //   e.stopPropagation(); 
          //  }}

        }, _react.default.createElement("div", {
          id: "player",
          className: "fixed-size",
          style: this.props.videoStyle
        }, _react.default.createElement("div", {
          id: "videoPlayOverlay"
        }, _react.default.createElement(_pixelStreamingContext.default.Consumer, null, function (context) {
          return context.clientConfig ? _react.default.createElement(_PixelVideo.default, {
            clientConfig: context.clientConfig,
            webRtcPlayer: context.webRtcPlayer,
            responseEventListeners: context.responseEventListeners,
            socket: context.socket,
            setVideoAspectRatio: context.actions.setVideoAspectRatio,
            setPlayerAspectRatio: context.actions.setPlayerAspectRatio,
            addLatestStats: context.actions.addLatestStats,
            setWebRTCPlayerObj: context.actions.setWebRTCPlayerObj
          }) : PlayerComponent(context);
        }))))
      );
    }
  }]);

  return PixelWindow;
}(_react.default.Component);

var _default = PixelWindow;
exports.default = _default;

var PlayerComponent = function PlayerComponent(webrtcState, clientConfig) {
  if (webrtcState === "loading") return _react.default.createElement("div", null, webrtcState);
  if (webrtcState === "disConnected") return _react.default.createElement("div", null, webrtcState);
  if (webrtcState === "connecting") return _react.default.createElement("div", null, webrtcState);
  if (webrtcState === "connected") return _react.default.createElement("div", null, webrtcState);
  if (webrtcState === "playing") return _react.default.createElement("div", null, webrtcState);
  if (webrtcState === "stop") return _react.default.createElement("div", null, webrtcState);
  return null;
};