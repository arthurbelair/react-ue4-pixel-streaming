import React, { Component } from "react";
import PixelWindow from "./PixelWindow";
import PixelStreamingClient from "./lib/pixel-streaming-client";
import PixelStreamingContext from "./lib/pixel-streaming-context";
import { Rnd } from "react-rnd";
import { Paper, Button, AppBar, List, Container } from "@material-ui/core";

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
      x2: 300,
      y2: 300,
    };
  }

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
                >
                  <Paper>
                    <AppBar style={{ padding: 10 }}>Streaming Window</AppBar>
                    <PixelWindow
                      load={context.load}
                      actions={context.actions}
                      connect={context.connect}
                      host={this.props.webRtcHost}
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
                    <AppBar style={{ position: "relative", padding: 10 }}>Menu</AppBar>
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
              </div>
            )}
          </PixelStreamingContext.Consumer>
          {this.props.children}
        </div>
      </PixelStreamingContext.Provider>
    );
  }
}
