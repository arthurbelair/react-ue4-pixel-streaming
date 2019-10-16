import React, { Component } from "react";
import PixelStreamingContext from "./lib/pixel-streaming-context";
import "./lib/videoHelper";

class PixelVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webRtcPlayerObj: {}
    };
  }

  componentDidMount() {
    console.log(this.props.clientConfig.peerConnectionOptions);
    let webRtcPlayerObj = new this.props.webRtcPlayer({
      peerConnectionOptions: this.props.clientConfig.peerConnectionOptions
    });

    this.setState({
      webRtcPlayerObj: webRtcPlayerObj
    });

    // Elementを挿入
    this.refs.video.appendChild(webRtcPlayerObj.video);

        // videoのサイズ設定
    webRtcPlayerObj.video.style.setProperty("width","100%");
    webRtcPlayerObj.video.style.setProperty("padding","10px");

    // webRtcPlayerにeventとか設定
    videoHelper(
      webRtcPlayerObj,
      this.props.socket,
      this.props.responseEventListeners
    );

      // createOffer
      webRtcPlayerObj.createOffer();


    // マウスとかの設定
    // registerInputs(webRtcPlayerObj.video);

  }

  componentWillUnmount() {}

  render() {
    return <div ref="video" style={{width: "100%"}}></div>;
  }
}
import videoHelper from "./lib/videoHelper";

const style = {};

export default PixelVideo;

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
