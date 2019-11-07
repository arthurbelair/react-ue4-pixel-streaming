import React, { Component } from "react";
import PixelStreamingClient from "./lib/pixel-streaming-client";
import PixelStreamingContext from "./lib/pixel-streaming-context";
import "./lib/emitter";


import emitter from "./lib/emitter";

// FPS toka no Statics Chart wo tuika
export default class ReactPixelStreaming extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: PixelStreamingClient.load,
      responseEventListeners: PixelStreamingClient.responseEventListeners,
      addResponseEventListener: PixelStreamingClient.addResponseEventListener,
      removeResponseEventListener:
        PixelStreamingClient.removeResponseEventListener,
      emitter: emitter,
      controlScheme: PixelStreamingClient.controlScheme,
      suppressBrowserKeys: PixelStreamingClient.suppressBrowserKeys,
      fakeMouseWithTouches: PixelStreamingClient.fakeMouseWithTouches,
      webrtcState: "",
      webRtcPlayerObj: {}, //PixelStreamingClient.webRtcPlayerObj,
      webRtcPlayer: PixelStreamingClient.webRtcPlayer,
      connect: PixelStreamingClient.connect,
      clientConfig: "",
      socket: {},
      aggregatedStats: [],
      actions: {
        updateWebRTCStat: this.updateWebRTCStat,
        updateClientConfig: this.updateClientConfig,
        updateSocket: this.updateSocket,
        setPlayerAspectRatio: this.setPlayerAspectRatio,
        setVideoAspectRatio: this.setVideoAspectRatio,
        addLatestStats: this.addLatestStats,
        setWebRTCPlayerObj: this.setWebRTCPlayerObj
      },
      // TODO: video/playerAspect
      //  var playerAspectRatio = playerElement.clientHeight / playerElement.clientWidth; // We want to keep the video ratio correct for the video stream
      //  var videoAspectRatio = videoElement.videoHeight / videoElement.videoWidth;
      playerAspectRatio: 1,
      videoAspectRatio: 1,
      playerRes: {},
      videoRes: {},
    };

    // eventの登録
    props.pixelStreamingResponseEvents.forEach((event)=>{
      PixelStreamingClient.addResponseEventListener(event.name, event.handler.bind(this));
    })
  }

  setWebRTCPlayerObj = player => {
    this.setState({
      webRtcPlayerObj: player
    });
  };

  addLatestStats = (stats, videoElement) => {
    this.setState({
      aggregatedStats: [...this.state.aggregatedStats, stats],
      videoAspectRatio: videoElement.videoHeight / videoElement.videoWidth,
      videoRes: {
        width: videoElement.videoWidth,
        height: videoElement.videoHeight
      }
    });
  };

  setPlayerAspectRatio = playerElement => {
    this.setState({
      playerAspectRatio: playerElement.clientHeight / playerElement.clientWidth,
      playerRes: {
        width: playerElement.clientWidth,
        height: playerElement.clientHeight
      }
    });
  };

  setVideoAspectRatio = videoElement => {
    this.setState({
      videoAspectRatio: videoElement.videoHeight / videoElement.videoWidth,
      videoRes: {
        width: videoElement.videoWidth,
        height: videoElement.videoHeight
      }
    });
  };

  setDisableDragging = disable => {
    this.setState({
      disableDragging: disable
    });
  };

  setEnableResizing = enable => {
    if (enable) {
      this.setState({
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
    this.setState({
      enableResizing: {}
    });
  };

  updateWebRTCStat = webrtcStat => {
    this.setState({
      webrtcState: webrtcStat
    });
  };

  updateSocket = socket => {
    this.setState({
      socket: socket
    });
  };

  updateClientConfig = clientConfig => {
    console.log(clientConfig);
    this.setState({
      clientConfig: clientConfig
    });
  };

  render() {
    return (
      <PixelStreamingContext.Provider value={this.state}>
        <div style={this.props.style}>

          {this.props.children}
        </div>
      </PixelStreamingContext.Provider>
    );
  }
}

