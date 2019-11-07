"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _inputHelper2 = _interopRequireDefault(require("./inputHelper"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(webRtcPlayerObj, socket, responseEventListeners, addLatestStats) {
  // webrtc-offerで疎通開始
  webRtcPlayerObj.onWebRtcOffer = function (offer) {
    console.log("offer");
    socket.emit("webrtc-offer", offer);
  }; // webrtc-iceで認証


  webRtcPlayerObj.onWebRtcCandidate = function (candidate) {
    socket.emit("webrtc-ice", candidate);
  }; // Elementの初期化


  webRtcPlayerObj.onVideoInitialised = function () {
    // videoplayが必要
    console.log("Player Initializeds"); // TODO: videoWidthとvideoHeightを取る

    function play() {
      setTimeout(function () {
        webRtcPlayerObj.video.play().catch(function (e) {
          console.log("retry");
          play();
        });
      }, 500);
    }

    play();
  }; // DataChannel接続時イベント


  webRtcPlayerObj.onDataChannelConnected = function () {
    // showTextOverlay("WebRTC connected, waiting for video");
    console.log("WebRTC connected, waiting for video");
  };

  socket.on("webrtc-ice", function (iceCandidate) {
    if (iceCandidate) webRtcPlayerObj.handleCandidateFromServer(iceCandidate);
  }); // DataChannel受信時イベントとユーザ定義ハンドラーのバインド

  webRtcPlayerObj.onDataChannelMessage = function (data) {
    console.log("ondata channel message");
    var view = new Uint8Array(data);

    if (view[0] == ToClientMessageType.QualityControlOwnership) {
      var ownership = view[1] == 0 ? false : true; // If we own the quality control, we can't relenquish it. We only loose
      // quality control when another peer asks for it

      if (qualityControlOwnershipCheckBox != null) {
        qualityControlOwnershipCheckBox.disabled = ownership;
        qualityControlOwnershipCheckBox.checked = ownership;
      }
    } else if (view[0] == ToClientMessageType.Response) {
      var response = new TextDecoder("utf-16").decode(data.slice(1)); // TODO: stateからの参照通す
      // responseEventListeners

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = responseEventListeners.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var listener = _step.value;
          listener(response);
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
    }
  }; // Signaling Answer


  socket.on("webrtc-answer", function (webRTCData) {
    console.log("on webrtc-answer");
    webRtcPlayerObj.receiveAnswer(webRTCData); // TODO: statsの更新仕込む

    webRtcPlayerObj.onAggregatedStats = function (aggregatedStats) {
      // TODO: これはArrayに入れてchartで表示する
      // console.log(aggregatedStats);
      addLatestStats(aggregatedStats, webRtcPlayerObj.video);
      /*
      avgBitrate: 3710
      avgframerate: 58
      bitrate: 3716
      bytesReceived: 26270465
      bytesReceivedStart: 295346
      currentRoundTripTime: 0
      framerate: 60
      framesDecoded: 3346
      framesDecodedStart: 58
      highBitrate: 3747
      highFramerate: 61
      lowBitrate: 3623
      lowFramerate: 57
      packetsLost: 0
      timestamp: 1571536257934        // 現在のタイムスタンプ
      timestampStart: 1571536201934   // 収集開始のタイムスタンプ
      */
    };

    webRtcPlayerObj.aggregateStats(1 * 1000
    /*Check every 1 second*/
    );

    function print() {
      webRtcPlayerObj.getStats(function (s) {
        s.forEach(function (stat) {
          console.log(JSON.stringify(stat));
        });
      });
    } // setInterval(print, 5000);

  }); // TODO: settingsはpropsで受け取るようにする

  var settings = {
    print_inputs: true,
    inputOptions: {
      //      controlScheme:ControlSchemeType.LockedMouse
      fakeMouseWithTouches: true,
      controlScheme: _types.ControlSchemeType.HoveringMouse,
      suppressBrowserKeys: true // keyboardイベントのpreventDefalutを有効化

    }
  };

  var _inputHelper = (0, _inputHelper2.default)(webRtcPlayerObj, settings),
      registerInputs = _inputHelper.registerInputs;

  registerInputs(webRtcPlayerObj.video, settings);
} // TODO: なんとかする


var ToClientMessageType = {
  QualityControlOwnership: 0,
  Response: 1
}; // TODO: なんとかする

var qualityControlOwnershipCheckBox;