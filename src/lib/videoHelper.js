import inputHelper from "./inputHelper";
import { ControlSchemeType } from "./types";

export default function(webRtcPlayerObj, socket, responseEventListeners) {
  // webrtc-offerで疎通開始
  webRtcPlayerObj.onWebRtcOffer = function(offer) {
    console.log("offer");
    socket.emit("webrtc-offer", offer);
  };

  // webrtc-iceで認証
  webRtcPlayerObj.onWebRtcCandidate = function(candidate) {
    socket.emit("webrtc-ice", candidate);
  };

  // Elementの初期化
  webRtcPlayerObj.onVideoInitialised = function() {
    // videoplayが必要
    console.log("Player Initializeds");

    // TODO: videoWidthとvideoHeightを取る
    function play() {
      setTimeout(() => {
        webRtcPlayerObj.video.play().catch(e => {
          console.log("retry");
          play();
        });
      }, 500);
    }
    play();
  };

  // DataChannel接続時イベント
  webRtcPlayerObj.onDataChannelConnected = function() {
    // showTextOverlay("WebRTC connected, waiting for video");
    console.log("WebRTC connected, waiting for video");
  };

  socket.on("webrtc-ice", function(iceCandidate) {
    if (iceCandidate) webRtcPlayerObj.handleCandidateFromServer(iceCandidate);
  });

  // DataChannel受信時イベントとユーザ定義ハンドラーのバインド
  webRtcPlayerObj.onDataChannelMessage = function(data) {
    console.log("ondata channel message");
    var view = new Uint8Array(data);
    if (view[0] == ToClientMessageType.QualityControlOwnership) {
      let ownership = view[1] == 0 ? false : true;
      // If we own the quality control, we can't relenquish it. We only loose
      // quality control when another peer asks for it
      if (qualityControlOwnershipCheckBox != null) {
        qualityControlOwnershipCheckBox.disabled = ownership;
        qualityControlOwnershipCheckBox.checked = ownership;
      }
    } else if (view[0] == ToClientMessageType.Response) {
      let response = new TextDecoder("utf-16").decode(data.slice(1));

      // TODO: stateからの参照通す
      // responseEventListeners
      for (let listener of responseEventListeners.values()) {
        listener(response);
      }
    }
  };

  // Signaling Answer
  socket.on("webrtc-answer", function(webRTCData) {
    console.log("on webrtc-answer");
    webRtcPlayerObj.receiveAnswer(webRTCData);
  });

  // TODO: settingsはpropsで受け取るようにする
  const settings = {
    print_inputs: true,
    inputOptions: {
      controlScheme:ControlSchemeType.HoveringMouse
    },
  };

  const { registerInputs } = inputHelper(webRtcPlayerObj, settings);
  registerInputs(webRtcPlayerObj.video, settings);
}

// TODO: なんとかする
const ToClientMessageType = {
  QualityControlOwnership: 0,
  Response: 1
};

// TODO: なんとかする
var qualityControlOwnershipCheckBox;
