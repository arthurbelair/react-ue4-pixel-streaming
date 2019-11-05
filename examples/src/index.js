import React from "react";
import { render } from "react-dom";
import ReactPixelStreaming from "../../src/ReactPixelStreaming";
import PixelStreamingContext from "../../src/lib/pixel-streaming-context";
import PixelWindow from "../../src/PixelWindow";

import CssBaseline from "@material-ui/core/CssBaseline";
import {emitter} from "../../src/lib/emitter";

import {
  Paper,
  Button,
  AppBar,
  List,
  Radio,
  Container,
  FormControlLabel,
  Slider,
  Typography,
  Fab,
  Toolbar,
  IconButton
} from "@material-ui/core";
import { Fullscreen, FullscreenExit } from "@material-ui/icons";

import QRCode from "qrcode.react";
import { Line } from "react-chartjs-2";

import PixelLogWindow from "../../src/PixelLogWindow";

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <ReactPixelStreaming
        webRtcHost="60.150.232.170"
        pixelStreamingResponseEvents={[]}
      >
        <PixelStreamingContext.Consumer>
          {context => (
            <div>
              <Paper>
                {/* TODO: 最小化、最大化、オリジナルサイズボタンを追加 */}
                <PixelWindow
                  load={context.load}
                  actions={context.actions}
                  connect={context.connect}
                  host={context.webRtcHost}
                  // setDisableDragging={this.setDisableDragging}
                  // setEnableResizing={this.setEnableResizing}
                  setVideoAspectRatio={context.actions.setVideoAspectRatio}
                  setPlayerAspectRatio={context.actions.setPlayerAspectRatio}
                />
              </Paper>
              <Paper shadow={2} style={{ position: "relative" }}>
                <AppBar style={{ position: "relative", padding: 10 }}>
                  統計テーブル
                </AppBar>
                <Paper style={{ padding: 30 }}>
                  {/* <List>
                    ウィンドウレシオ: {context.playerAspectRatio.toFixed(3)}
                  </List>
                  <List>
                    ウインドウサイズ: {context.playerRes.width}/
                    {this.state.playerRes.height}
                  </List> */}
                  <List>
                    ビデオレシオ: {context.videoAspectRatio.toFixed(3)}
                  </List>

                  <List>
                    ビデオ解像度: {context.videoRes.width}/
                    {context.videoRes.height}
                  </List>
                  {  context.aggregatedStats[context.aggregatedStats.length - 1] ? (
                    <div>
                      <List>
                        平均ビットレート: {(c.avgBitrate / 1024).toFixed(3)}
                        Mbps
                      </List>
                      <List>
                        最大ビットレート: {(c.highBitrate / 1024).toFixed(3)}
                        Mbps
                      </List>
                      <List>
                        ビットレート: {(c.bitrate / 1024).toFixed(3)}Mbps
                      </List>
                      <List>
                        総受信量: {(c.bytesReceived / 1024 / 1024).toFixed(3)}MB
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

              {/* TODO: URL wo state nisuru */}
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
                          onChange={() => {
                            emitter(context.webRtcPlayerObj).emitUIInteraction({
                              ConsoleCommand: "r.SetRes 1280x720"
                            });
                          }}
                          checked={context.videoRes.width === 1280}
                        />
                      }
                      label="1280"
                      labelPlacement="top"
                    />

                    <FormControlLabel
                      value="1920"
                      control={
                        <Radio
                          color="primary"
                          onChange={() => {
                            emitter(context.webRtcPlayerObj).emitUIInteraction({
                              ConsoleCommand: "r.SetRes 1920x1080"
                            });
                          }}
                          checked={context.videoRes.width === 1920}
                        />
                      }
                      label="1920"
                      labelPlacement="top"
                    />

                    <FormControlLabel
                      value="2560"
                      control={
                        <Radio
                          color="primary"
                          onChange={() => {
                            emitter(context.webRtcPlayerObj).emitUIInteraction({
                              ConsoleCommand: "r.SetRes 2560x1440"
                            });
                          }}
                          checked={context.videoRes.width === 2560}
                        />
                      }
                      label="2560"
                      labelPlacement="top"
                    />

                    <FormControlLabel
                      value="3840"
                      control={
                        <Radio
                          color="primary"
                          onChange={() => {
                            emitter(context.webRtcPlayerObj).emitUIInteraction({
                              ConsoleCommand: "r.SetRes 3840x2160"
                            });
                          }}
                          checked={context.videoRes.width === 3840}
                        />
                      }
                      label="3840"
                      labelPlacement="top"
                    />
                  </Container>
                  <Container>
                    <Typography id="discrete-slider-custom" gutterBottom>
                      FPS制限
                    </Typography>
                    <Slider
                      style={{ width: "200" }}
                      defaultValue={60}
                      aria-labelledby="discrete-slider-custom"
                      step={15}
                      valueLabelDisplay="auto"
                      marks
                      min={30}
                      max={180}
                      onChangeCommitted={(e, val) => {
                        console.log(val);
                        emitter(context.webRtcPlayerObj).emitUIInteraction({
                          ConsoleCommand: `t.maxFPS ${val}`
                        });
                      }}
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
            </div>
          )}
        </PixelStreamingContext.Consumer>
      </ReactPixelStreaming>
      {/* <ReactPixelStreaming webRtcHost="localhost"/> */}
    </React.Fragment>
  );
}

render(<App />, document.getElementById("root"));
