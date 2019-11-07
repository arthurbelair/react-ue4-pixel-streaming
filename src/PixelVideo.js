import React, { Component, Slider, Typography } from "react";
import PixelStreamingContext from "./lib/pixel-streaming-context";
import "./lib/videoHelper";
import ResizeObserver from '@juggle/resize-observer';

// TODO: keyboard/mouse event
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

    console.log(webRtcPlayerObj);

    this.setState({
      webRtcPlayerObj: webRtcPlayerObj
    });

    this.props.setWebRTCPlayerObj(webRtcPlayerObj);

    // Elementを挿入
    this.refs.video.appendChild(webRtcPlayerObj.video);

    // videoのサイズ設定
    webRtcPlayerObj.video.style.setProperty("width", "100%");
    // TODO: paddingもpropsで受け取れるようにする
    webRtcPlayerObj.video.style.setProperty("padding", "10px");

    // videoのsizeをモニター
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const rect = entry.contentRect;
        // console.log(rect.top, rect.left);
        // console.log(rect.width, rect.height);

        this.props.setVideoAspectRatio(webRtcPlayerObj.video);
        this.props.setPlayerAspectRatio(webRtcPlayerObj.video);
        // TODO: video解像度とプレイヤーサイズ仕込む
      }
    });

    resizeObserver.observe(webRtcPlayerObj.video);

    // video上での右クリメニュー殺しとく
    webRtcPlayerObj.video.addEventListener(
      "contextmenu",
      function(e) {
        e.preventDefault();
      },
      false
    );

    // webRtcPlayerにeventとか設定
    videoHelper(
      webRtcPlayerObj,
      this.props.socket,
      this.props.responseEventListeners,
      this.props.addLatestStats
    );

    // createOffer
    webRtcPlayerObj.createOffer();

    // マウスとかの設定
    // registerInputs(webRtcPlayerObj.video);
  }

  componentWillUnmount() {}

  render() {
    return (
        <div ref="video" style={{ width: "100%" }}></div>
    );
  }
}
import videoHelper from "./lib/videoHelper";

const style = {};

export default PixelVideo;

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
