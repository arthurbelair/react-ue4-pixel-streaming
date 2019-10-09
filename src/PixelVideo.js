import React, { Component } from "react";
import PixelStreamingContext from "./lib/pixel-streaming-context";

class PixelVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webRtcPlayerObj: {}
    };
  }

  componentDidMount() {
    const webRtcPlayerObj = new this.props.webRtcPlayer({
      peerConnectionOptions: this.props.clientConfig.peerConnectionOptions
    });
    this.setState({
      webRtcPlayerObj: webRtcPlayerObj
    });

    // Elementを挿入
    this.refs.video.appendChild(webRtcPlayerObj.video);

    // // WebRTC Offering
    // webRtcPlayerObj.createOffer();

    // webRtcPlayerにeventとか設定
    atacheEvents(
      webRtcPlayerObj,
      this.props.socket,
      this.props.responseEventListeners
    );

    // マウスとかの設定
    // registerInputs(webRtcPlayerObj.video);

    console.log(webRtcPlayerObj);
  }

  componentWillUnmount() {}

  render() {
    return <div ref="video"></div>;
  }
}

const style = {};

export default PixelVideo;

function atacheEvents(webRtcPlayerObj, socket, responseEventListeners) {
  // webrtc-offerで疎通開始
  webRtcPlayerObj.onWebRtcOffer = function(offer) {
    socket.emit("webrtc-offer", offer);
  };

  // webrtc-iceで認証
  webRtcPlayerObj.onWebRtcCandidate = function(candidate) {
    socket.emit("webrtc-ice", candidate);
  };

  // Elementの初期化
  // TODO: 多分なくてもok
  webRtcPlayerObj.onVideoInitialised = function() {
    // showPlayOverlay();
    // resizePlayerStyle();

    // videoplayが必要
    console.log("Player Initializeds");
    webRtcPlayerObj.video.play();
  };

  // DataChannel接続時イベント
  webRtcPlayerObj.onDataChannelConnected = function() {
    // showTextOverlay("WebRTC connected, waiting for video");
    console.log("WebRTC connected, waiting for video");
  };

  // ICE関連だけどよくわからん
  // TODO: エラー出るのでコメントアウト
  //    メモ: これは、オファーの一部ではなく、新しいアイス候補を個別に受け取るときに呼び出されます
  //          これは現在使用されていませんが、このクラスから外部から呼び出されます
	socket.on('webrtc-ice', function(iceCandidate) {
    //console.log(iceCandidate);
		if(iceCandidate)
		 	webRtcPlayerObj.handleCandidateFromServer(iceCandidate);
	});


  // DataChannel受信時イベントとユーザ定義ハンドラーのバインド
  webRtcPlayerObj.onDataChannelMessage = function(data) {
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

    // webRtcからのレスポンス受信時の統計
    // 多分いらん
    socket.on("webrtc-answer", function(webRTCData) {
      webRtcPlayerObj.receiveAnswer(webRTCData);
      let printInterval = 5 * 60 * 1000; /*Print every 5 minutes*/
      let nextPrintDuration = printInterval;

      webRtcPlayerObj.onAggregatedStats = aggregatedStats => {
        let numberFormat = new Intl.NumberFormat(window.navigator.language, {
          maximumFractionDigits: 0
        });
        let timeFormat = new Intl.NumberFormat(window.navigator.language, {
          maximumFractionDigits: 0,
          minimumIntegerDigits: 2
        });
        let statsText = "";

        // Calculate duration of run
        let runTime =
          (aggregatedStats.timestamp - aggregatedStats.timestampStart) / 1000;
        let timeValues = [];
        let timeDurations = [60, 60];
        for (let timeIndex = 0; timeIndex < timeDurations.length; timeIndex++) {
          timeValues.push(runTime % timeDurations[timeIndex]);
          runTime = runTime / timeDurations[timeIndex];
        }
        timeValues.push(runTime);

        let runTimeSeconds = timeValues[0];
        let runTimeMinutes = Math.floor(timeValues[1]);
        let runTimeHours = Math.floor([timeValues[2]]);

        let receivedBytesMeasurement = "B";
        let receivedBytes = aggregatedStats.hasOwnProperty("bytesReceived")
          ? aggregatedStats.bytesReceived
          : 0;
        let dataMeasurements = ["kB", "MB", "GB"];
        for (let index = 0; index < dataMeasurements.length; index++) {
          if (receivedBytes < 100 * 1000) break;
          receivedBytes = receivedBytes / 1000;
          receivedBytesMeasurement = dataMeasurements[index];
        }

        statsText += `Duration: ${timeFormat.format(
          runTimeHours
        )}:${timeFormat.format(runTimeMinutes)}:${timeFormat.format(
          runTimeSeconds
        )}</br>`;
        statsText += `Video Resolution: ${
          aggregatedStats.hasOwnProperty("frameWidth") &&
          aggregatedStats.frameWidth &&
          aggregatedStats.hasOwnProperty("frameHeight") &&
          aggregatedStats.frameHeight
            ? aggregatedStats.frameWidth + "x" + aggregatedStats.frameHeight
            : "N/A"
        }</br>`;
        statsText += `Received (${receivedBytesMeasurement}): ${numberFormat.format(
          receivedBytes
        )}</br>`;
        statsText += `Frames Decoded: ${
          aggregatedStats.hasOwnProperty("framesDecoded")
            ? numberFormat.format(aggregatedStats.framesDecoded)
            : "N/A"
        }</br>`;
        statsText += `Packets Lost: ${
          aggregatedStats.hasOwnProperty("packetsLost")
            ? numberFormat.format(aggregatedStats.packetsLost)
            : "N/A"
        }</br>`;
        statsText += `Bitrate (kbps): ${
          aggregatedStats.hasOwnProperty("bitrate")
            ? numberFormat.format(aggregatedStats.bitrate)
            : "N/A"
        }</br>`;
        statsText += `Framerate: ${
          aggregatedStats.hasOwnProperty("framerate")
            ? numberFormat.format(aggregatedStats.framerate)
            : "N/A"
        }</br>`;
        statsText += `Frames dropped: ${
          aggregatedStats.hasOwnProperty("framesDropped")
            ? numberFormat.format(aggregatedStats.framesDropped)
            : "N/A"
        }</br>`;
        statsText += `Latency (ms): ${
          aggregatedStats.hasOwnProperty("currentRoundTripTime")
            ? numberFormat.format(aggregatedStats.currentRoundTripTime * 1000)
            : "N/A"
        }</br>`;

        let statsDiv = document.getElementById("stats");
        if (statsDiv) {
          statsDiv.innerHTML = statsText;
        }

        if (print_stats) {
          if (aggregatedStats.timestampStart) {
            if (
              aggregatedStats.timestamp - aggregatedStats.timestampStart >
              nextPrintDuration
            ) {
              console.log(JSON.stringify(aggregatedStats));
              if (socket.connected)
                socket.emit("webrtc-stats", aggregatedStats);
              nextPrintDuration += printInterval;
            }
          }
        }
      };

      webRtcPlayerObj.aggregateStats(1 * 1000 /*Check every 1 second*/);

      let displayStats = () => { webRtcPlayerObj.getStats( (s) => { s.forEach(stat => { console.log(JSON.stringify(stat)); }); } ); }
      var displayStatsIntervalId = setInterval(displayStats, 30 * 1000);
    });
  };

  // createOffer
  webRtcPlayerObj.createOffer();
}

// TODO: なんとかする
const ToClientMessageType = {
  QualityControlOwnership: 0,
  Response: 1
};

// TODO: なんとかする
var qualityControlOwnershipCheckBox;

/**
 * Config data received from WebRTC sender via the Cirrus web server
 */
// TODO: clientConfigをstateに突っ込む
// function onClientConfig(clientConfig) {
// 	log(`clientConfig = ${JSON.stringify(clientConfig)}`);

// 	// let playerDiv = document.getElementById('player');

// 	// TODO: jsxに移植
// 	let playerElement = setupWebRtcPlayer(playerDiv, clientConfig)
// 	// resizePlayerStyle();

// 	// TODO: マウス設定
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







