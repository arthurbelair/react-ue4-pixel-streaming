let webRtcPlayer = require("./webRtcPlayer");
let io = require("socket.io-client");

var responseEventListeners = new Map();

var t0 = Date.now();
function log(str) {
  console.log(`${Math.floor(Date.now() - t0)}: ` + str);
}

// TODO: ListenerはHOCにバインド
function addResponseEventListener(name, listener) {
  responseEventListeners.set(name, listener);
}

// TODO: ListenerはHOCにバインド
function removeResponseEventListener(name) {
  responseEventListeners.remove(name);
}

// TODO: orientation control

// Fix for bug in iOS where windowsize is not correct at instance or orientation change
// https://github.com/dimsemenov/PhotoSwipe/issues/1315
// var _orientationChangeTimeout;
// function onOrientationChange(event){
// 	clearTimeout(_orientationChangeTimeout);
// 	_orientationChangeTimeout = setTimeout(function() {
// 		resizePlayerStyle();
// 	}, 500);
// }

// TODO: UE4 Quality Control
function requestQualityControl() {
  sendInputData(new Uint8Array([MessageType.RequestQualityControl]).buffer);
}

function connect(host, actions) {
  const socket = io(host);

  actions.updateSocket(socket);
  actions.updateWebRTCStat("socketConnecting"); // clientConfig帰ってきたらwebRTCセッションを貼ってplayerをインスタンス化する

  socket.on("clientConfig", function(clientConfig) {
    console.log("update clientConfig: " + clientConfig);
    actions.updateClientConfig(clientConfig);
  });

  socket.on("message", function(data) {
    console.log(
      `unrecognised message ${data.byteLength}: ${data
        .slice(0, 50)
        .toString("hex")}`
    );
  });

  // TODO: キックは後で見る
  // socket.on('clientCount', function (data) {
  // 	var kickButton = document.getElementById('kick-other-players-button');
  // 	if (kickButton)
  // 		kickButton.value = `Kick (${data.count})`;
  // });

  // signaling serverに繫がったらuserconfigを送る
  // signaling serverからはclientConfig返ってくる
  socket.on("connect", () => {
    actions.updateWebRTCStat("socketConnected");

    log("connected");
    sendUserConfig(actions, socket);
  });

  socket.on("error", error => {
    actions.updateWebRTCStat(error);
    console.log(`WS error ${error}`);
  });

  // TODO: 状態変わるのでcallbackを追加
  socket.on("disconnect", reason => {
    actions.updateWebRTCStat("socketDisConnected");

    console.log(`Connection is closed: ${reason}`);
    socket.close();
    connect(
      host,
      actions
    );
  });
}

/**
 * Config data to sent to the Cirrus web server.
 */

function sendUserConfig(actions, socket) {
  let userConfig = {
    emitData: "ArrayBuffer"
  };
  let userConfigString = JSON.stringify(userConfig);
  log(`userConfig = ${userConfigString}`);
  actions.updateWebRTCStat("webrtcConnecting");
  socket.emit("userConfig", userConfigString);
}

// TODO: マウス設定
// switch (inputOptions.controlScheme) {
// 	case ControlSchemeType.HoveringMouse:
// 		registerHoveringMouseEvents(playerElement);
// 		break;
// 	case ControlSchemeType.LockedMouse:
// 		registerLockedMouseEvents(playerElement);
// 		break;
// 	default:
// 		console.log(`ERROR: Unknown control scheme ${inputOptions.controlScheme}`);
// 		registerLockedMouseEvents(playerElement);
// 		break;
// }

function load() {
  // TODO: これはいる
  // registerKeyboardEvents();
}

module.exports = {
  load,
  connect,
  addResponseEventListener,
  removeResponseEventListener,
  webRtcPlayer: webRtcPlayer,
  responseEventListeners: responseEventListeners
};
