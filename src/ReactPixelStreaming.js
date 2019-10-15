import React, { Component } from "react";
import PixelWindow from "./PixelWindow";
import PixelStreamingClient from "./lib/pixel-streaming-client";
import PixelStreamingContext from "./lib/pixel-streaming-context";

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
        updateSocket: this.updateSocket,
      }
    };
  }

  updateWebRTCStat = webrtcStat => {
    this.setState({
      webrtcState: webrtcStat
    });
  };

  updateSocket = socket => {
    this.setState({
      socket: socket,
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
              <PixelWindow
                load={context.load}
                actions={context.actions}
                connect={context.connect}
                host={this.props.webRtcHost}
              />
            )}
          </PixelStreamingContext.Consumer>
          {this.props.children}
        </div>
      </PixelStreamingContext.Provider>
    );
  }
}
