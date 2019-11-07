"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _pixelStreamingClient = _interopRequireDefault(require("./lib/pixel-streaming-client"));

var _pixelStreamingContext = _interopRequireDefault(require("./lib/pixel-streaming-context"));

var _emitter = _interopRequireDefault(require("./lib/emitter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// FPS toka no Statics Chart wo tuika
var ReactPixelStreaming =
/*#__PURE__*/
function (_Component) {
  _inherits(ReactPixelStreaming, _Component);

  function ReactPixelStreaming(props) {
    var _this;

    _classCallCheck(this, ReactPixelStreaming);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReactPixelStreaming).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "setWebRTCPlayerObj", function (player) {
      _this.setState({
        webRtcPlayerObj: player
      });
    });

    _defineProperty(_assertThisInitialized(_this), "addLatestStats", function (stats, videoElement) {
      _this.setState({
        aggregatedStats: [].concat(_toConsumableArray(_this.state.aggregatedStats), [stats]),
        videoAspectRatio: videoElement.videoHeight / videoElement.videoWidth,
        videoRes: {
          width: videoElement.videoWidth,
          height: videoElement.videoHeight
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setPlayerAspectRatio", function (playerElement) {
      _this.setState({
        playerAspectRatio: playerElement.clientHeight / playerElement.clientWidth,
        playerRes: {
          width: playerElement.clientWidth,
          height: playerElement.clientHeight
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setVideoAspectRatio", function (videoElement) {
      _this.setState({
        videoAspectRatio: videoElement.videoHeight / videoElement.videoWidth,
        videoRes: {
          width: videoElement.videoWidth,
          height: videoElement.videoHeight
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setDisableDragging", function (disable) {
      _this.setState({
        disableDragging: disable
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setEnableResizing", function (enable) {
      if (enable) {
        _this.setState({
          enableResizing: {
            bottom: true,
            bottomLeft: true,
            bottomRight: true,
            left: true,
            right: true,
            top: true,
            topLeft: true,
            topRight: true
          }
        });

        return;
      }

      _this.setState({
        enableResizing: {}
      });
    });

    _defineProperty(_assertThisInitialized(_this), "updateWebRTCStat", function (webrtcStat) {
      _this.setState({
        webrtcState: webrtcStat
      });
    });

    _defineProperty(_assertThisInitialized(_this), "updateSocket", function (socket) {
      _this.setState({
        socket: socket
      });
    });

    _defineProperty(_assertThisInitialized(_this), "updateClientConfig", function (clientConfig) {
      console.log(clientConfig);

      _this.setState({
        clientConfig: clientConfig
      });
    });

    _this.state = {
      load: _pixelStreamingClient.default.load,
      responseEventListeners: _pixelStreamingClient.default.responseEventListeners,
      addResponseEventListener: _pixelStreamingClient.default.addResponseEventListener,
      removeResponseEventListener: _pixelStreamingClient.default.removeResponseEventListener,
      emitter: _emitter.default,
      controlScheme: _pixelStreamingClient.default.controlScheme,
      suppressBrowserKeys: _pixelStreamingClient.default.suppressBrowserKeys,
      fakeMouseWithTouches: _pixelStreamingClient.default.fakeMouseWithTouches,
      webrtcState: "",
      webRtcPlayerObj: {},
      //PixelStreamingClient.webRtcPlayerObj,
      webRtcPlayer: _pixelStreamingClient.default.webRtcPlayer,
      connect: _pixelStreamingClient.default.connect,
      clientConfig: "",
      socket: {},
      aggregatedStats: [],
      actions: {
        updateWebRTCStat: _this.updateWebRTCStat,
        updateClientConfig: _this.updateClientConfig,
        updateSocket: _this.updateSocket,
        setPlayerAspectRatio: _this.setPlayerAspectRatio,
        setVideoAspectRatio: _this.setVideoAspectRatio,
        addLatestStats: _this.addLatestStats,
        setWebRTCPlayerObj: _this.setWebRTCPlayerObj
      },
      // TODO: video/playerAspect
      //  var playerAspectRatio = playerElement.clientHeight / playerElement.clientWidth; // We want to keep the video ratio correct for the video stream
      //  var videoAspectRatio = videoElement.videoHeight / videoElement.videoWidth;
      playerAspectRatio: 1,
      videoAspectRatio: 1,
      playerRes: {},
      videoRes: {}
    }; // eventの登録

    props.pixelStreamingResponseEvents.forEach(function (event) {
      _pixelStreamingClient.default.addResponseEventListener(event.name, event.handler.bind(_assertThisInitialized(_this)));
    });
    return _this;
  }

  _createClass(ReactPixelStreaming, [{
    key: "render",
    value: function render() {
      return _react.default.createElement(_pixelStreamingContext.default.Provider, {
        value: this.state
      }, _react.default.createElement("div", {
        style: this.props.style
      }, this.props.children));
    }
  }]);

  return ReactPixelStreaming;
}(_react.Component);

exports.default = ReactPixelStreaming;