import React, { Component } from "react";
import PixelWindow from "./PixelWindow";
import PixelStreamingClient from "./lib/pixel-streaming-client";
import PixelStreamingContext from "./lib/pixel-streaming-context";
import { Rnd } from "react-rnd";
import {
  Paper,
  Button,
  AppBar,
  List,
  Radio,
  Container,
  FormControlLabel
} from "@material-ui/core";
import QRCode from "qrcode.react";
import { Line } from "react-chartjs-2";

import Slider from "@material-ui/core/Slider";

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
      aggregatedStats: [],
      actions: {
        updateWebRTCStat: this.updateWebRTCStat,
        updateClientConfig: this.updateClientConfig,
        updateSocket: this.updateSocket,
        setPlayerAspectRatio: this.setPlayerAspectRatio,
        setVideoAspectRatio: this.setVideoAspectRatio,
        addLatestStats: this.addLatestStats
      },
      // for Rnd
      // x/yを初期化しとかないとdragが計算できない
      x: 30,
      y: 30,
      x2: 950,
      y2: 30,
      x3: 30,
      y3: 600,
      x4: 650,
      y4: 645,
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
      playerRes: {},
      videoRes: {}
    };
  }

  addLatestStats = stats => {
    this.setState({
      aggregatedStats: [...this.state.aggregatedStats, stats]
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

  componentDidMount() {
    //        this.state.addResponseEventListener("handle_responses", this.props.handler);
    //        console.log("atached handler");
  }

  componentWillUnmount() {
    //        this.state.removeResponseEventListener("handle_responses");
    //        console.log("removed handler");
  }

  render() {
    const c = this.state.aggregatedStats[this.state.aggregatedStats.length - 1];
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
                  size={{ width: "300", height: "600" }}
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
                  <Paper shadow={2} style={{ position: "relative" }}>
                    <AppBar style={{ position: "relative", padding: 10 }}>
                      統計テーブル
                    </AppBar>
                    <Paper style={{ padding: 30 }}>
                      <List>
                        ウィンドウレシオ:{" "}
                        {this.state.playerAspectRatio.toFixed(3)}
                      </List>
                      <List>
                        ウインドウサイズ: {this.state.playerRes.width}/
                        {this.state.playerRes.height}
                      </List>
                      <List>
                        ビデオレシオ: {this.state.videoAspectRatio.toFixed(3)}
                      </List>

                      <List>
                        ビデオ解像度: {this.state.videoRes.width}/
                        {this.state.videoRes.height}
                      </List>
                      {c ? (
                        <div>
                          <List>
                            平均ビットレート: {(c.avgBitrate / 1024).toFixed(3)}
                            Mbps
                          </List>
                          <List>
                            最大ビットレート:{" "}
                            {(c.highBitrate / 1024).toFixed(3)}Mbps
                          </List>
                          <List>
                            ビットレート: {(c.bitrate / 1024).toFixed(3)}Mbps
                          </List>
                          <List>
                            総受信量:{" "}
                            {(c.bytesReceived / 1024 / 1024).toFixed(3)}MB
                          </List>
                          <List>
                            FPS: {c.framerate}fps (MAX: {c.highFramerate} / MIN:{" "}
                            {c.lowFramerate})
                          </List>
                          <List>
                            パケットロスト: {c.packetLost ? c.packetLost : 0}件
                          </List>
                          <List>RTT: {c.currentRoundTripTime}秒</List>
                        </div>
                      ) : null}
                    </Paper>
                  </Paper>
                </Rnd>
                <Rnd
                  size={{ width: "600", height: "900" }}
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
                      パフォーマンス統計
                    </AppBar>
                    <Paper>
                      <Line data={genData(this.state.aggregatedStats)} />
                    </Paper>
                  </Paper>
                </Rnd>

                {/* TODO: URL wo state nisuru */}
                <Rnd
                  size={{ width: "", height: "" }}
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
                      コンパネ
                    </AppBar>
                    <Paper>
                      <Container>
                        <FormControlLabel
                          value="1280"
                          control={
                            <Radio
                              color="primary"
                              onChange={console.log}
                              checked={true}
                            />
                          }
                          label="1280"
                          labelPlacement="top"
                        />

                        <FormControlLabel
                          value="1920"
                          control={
                            <Radio color="primary" onChange={console.log} checked={false}/>
                          }
                          label="1920"
                          labelPlacement="top"
                        />

                        <FormControlLabel
                          value="2048"
                          control={
                            <Radio color="primary" onChange={console.log} checked={false}/>
                          }
                          label="2048"
                          labelPlacement="top"
                        />

                        <FormControlLabel
                          value="3840"
                          control={
                            <Radio color="primary" onChange={console.log} checked={false}/>
                          }
                          label="3840"
                          labelPlacement="top"
                        />
                      </Container>
                      <Container>
                        <QRCode
                          style={{ padding: "20px" }}
                          value={window.location.href}
                        />
                      </Container>
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

function genData(arry) {
  // return arry.map(data=>{
  //   return {
  //     time: data.timestamp - data.timestampStart/1000,
  //     fps: data.framerate,
  //     bitrate: data.bitrate,
  //   }
  // });
  const labels = arry.map(elm =>
    Math.round((elm.timestamp - elm.timestampStart) / 1000)
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: "FPS",
        type: "line",
        data: arry.map(elm => elm.framerate),
        borderColor: "rgba(54, 162, 235, 0.2)",
        backgroundColor: "rgba(254,97,132,0.5)"
      },
      {
        label: "Bitrate",
        type: "line",
        fill: false,
        data: arry.map(elm => elm.bitrate),
        borderColor: "rgba(254,97,132,0.8)",
        backgroundColor: "rgba(254,97,132,0.5)"
      },
      {
        label: "パケットロスト",
        type: "line",
        fill: false,
        data: arry.map(elm => elm.packetsLost),
        borderColor: "rgba(75, 192, 192, 0.2)",
        backgroundColor: "rgba(254,97,132,0.5)"
      }
    ]
  };
  return data;
}
