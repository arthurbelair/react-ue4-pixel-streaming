import React, { Component } from "react";
import PixelWindow from "./PixelWindow";
import PixelStreamingClient from "./lib/pixel-streaming-client";
import PixelStreamingContext from "./lib/pixel-streaming-context";
import { Rnd } from "react-rnd";
import { Paper, Button, AppBar, List } from "@material-ui/core";
import QRCode from "qrcode.react";

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
      emitCommand: PixelStreamingClient.emitCommand,
      emitDescriptor: PixelStreamingClient.emitDescriptor,
      emitUIInteraction: PixelStreamingClient.emitUIInteraction,
      controlScheme: PixelStreamingClient.controlScheme,
      suppressBrowserKeys: PixelStreamingClient.suppressBrowserKeys,
      fakeMouseWithTouches: PixelStreamingClient.fakeMouseWithTouches,
      webrtcState: "",
      // webRtcPlayerObjをstate化
      webRtcPlayerObj: PixelStreamingClient.webRtcPlayerObj,
      webRtcPlayer: PixelStreamingClient.webRtcPlayer,
      connect: PixelStreamingClient.connect,
      clientConfig: "",
      socket: {},
      actions: {
        updateWebRTCStat: this.updateWebRTCStat,
        updateClientConfig: this.updateClientConfig,
        updateSocket: this.updateSocket
      },
      // for Rnd
      // x/yを初期化しとかないとdragが計算できない
      x: 30,
      y: 30,
      x2: 930,
      y2: 30,
      x3: 930,
      y3: 174,
      x4: 930,
      y4: 318,
      width: 900,
      // TODO: maxSize/ratio
      disableDragging: false,
      enableResizing: {
        bottom: true,
        bottomLeft: true,
        bottomRight: true,
        left: true,
        right: true,
        top: true,
        topLeft: true,
        topRight: true
      },
      // TODO: video/playerAspect
      //  var playerAspectRatio = playerElement.clientHeight / playerElement.clientWidth; // We want to keep the video ratio correct for the video stream
      //  var videoAspectRatio = videoElement.videoHeight / videoElement.videoWidth;
      playerAspectRatio: 1,
      videoAspectRatio: 1,
    };
  }
  
  setPlayerAspectRatio(playerElement){
    console.log(playerElement);
    this.setState({
      playerAspectRatio: playerElement.clientHeight / playerElement.clientWidth,
    });
  }

  setVideoAspectRatio(videoElement){
    console.log(videoElement);
    this.setState({
      videoAspectRatio: videoElement.videoHeight / videoElement.videoWidth,
    });
  }


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

  componentDidMount() {
    //        this.state.addResponseEventListener("handle_responses", this.props.handler);
    //        console.log("atached handler");
  }

  componentWillUnmount() {
    //        this.state.removeResponseEventListener("handle_responses");
    //        console.log("removed handler");
  }

  render() {
    return (
      <PixelStreamingContext.Provider value={this.state}>
        <div style={this.props.style}>
          <PixelStreamingContext.Consumer>
            {context => (
              <div>
                <Rnd
                  size={{ width: this.state.width, height: this.state.height }}
                  position={{ x: this.state.x, y: this.state.y }}
                  onDragStop={(e, d) => {
                    this.setState({ x: d.x, y: d.y });
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    this.setState({
                      width: ref.style.width,
                      height: ref.style.height,
                      ...position
                    });
                  }}
                  disableDragging={this.state.disableDragging}
                >
                  <Paper>
                    {/* TODO: 最小化、最大化、オリジナルサイズボタンを追加 */}
                    <AppBar style={{ position: "relative", padding: 10 }}>
                      Streaming Window
                    </AppBar>
                    <PixelWindow
                      load={context.load}
                      actions={context.actions}
                      connect={context.connect}
                      host={this.props.webRtcHost}
                      setDisableDragging={this.setDisableDragging}
                      setEnableResizing={this.setEnableResizing}
                      setVideoAspectRatio={this.setVideoAspectRatio}
                      setPlayerAspectRatio={this.setPlayerAspectRatio}
                    />
                  </Paper>
                </Rnd>
                <Rnd
                  size={{ width: "200", height: "300" }}
                  position={{ x: this.state.x2, y: this.state.y2 }}
                  onDragStop={(e, d) => {
                    this.setState({ x2: d.x, y2: d.y });
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    this.setState({
                      width: ref.style.width,
                      height: ref.style.height,
                      ...position
                    });
                  }}
                  enableResizing={{}}
                >
                  <Paper style={{ position: "relative" }}>
                    <AppBar style={{ position: "relative", padding: 10 }}>
                      Menu
                    </AppBar>
                    <Paper>
                      <List>
                        <Button color="primary">ぼたん</Button>
                      </List>
                      <List>
                        <Button color="secondary">ぼたん</Button>
                      </List>
                    </Paper>
                  </Paper>
                </Rnd>
                <Rnd
                  size={{ width: "200", height: "300" }}
                  position={{ x: this.state.x3, y: this.state.y3 }}
                  onDragStop={(e, d) => {
                    this.setState({ x3: d.x, y3: d.y });
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    this.setState({
                      width: ref.style.width,
                      height: ref.style.height,
                      ...position
                    });
                  }}
                  enableResizing={{}}
                >
                  <Paper style={{ position: "relative" }}>
                    <AppBar style={{ position: "relative", padding: 10 }}>
                      Menu2
                    </AppBar>
                    <Paper>
                      <List>
                        <Button color="primary">ぼたん</Button>
                      </List>
                      <List>
                        <Button color="secondary">ぼたん</Button>
                      </List>
                    </Paper>
                  </Paper>
                </Rnd>

                {/* TODO: URL wo state nisuru */}
                <Rnd
                  size={{ width: "200", height: "300" }}
                  position={{ x: this.state.x4, y: this.state.y4 }}
                  onDragStop={(e, d) => {
                    this.setState({ x4: d.x, y4: d.y });
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    this.setState({
                      width: ref.style.width,
                      height: ref.style.height,
                      ...position
                    });
                  }}
                  enableResizing={{}}
                >
                  <Paper style={{ position: "relative" }}>
                    <AppBar style={{ position: "relative", padding: 10 }}>
                      QR Code
                    </AppBar>
                    <Paper>
                      <QRCode
                        style={{ padding: "20px" }}
                        value={window.location.href}
                      />
                    </Paper>
                  </Paper>
                </Rnd>
              </div>
            )}
          </PixelStreamingContext.Consumer>
          {this.props.children}
        </div>
      </PixelStreamingContext.Provider>
    );
  }
}
