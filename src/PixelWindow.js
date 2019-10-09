import React, { Component } from "react";
import PixelStreamingContext from "./lib/pixel-streaming-context";
import PixelVideo from "./PixelVideo";

class PixelWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // PixelStreamingのロード

    // loadでkeyInputのバインド
    this.props.load();

    // 黙ってconnect()
    // TODO: connectの状態をstateに反映できるように改修
    // TODO: 接続ホストを引数で渡せるように修正
    this.props.connect(this.props.host, this.props.actions);
  }

  componentWillUnmount() {}

  render() {
    return (
      <div style={style}>
        <div id="player" className="fixed-size">
          <div id="videoPlayOverlay">
            <PixelStreamingContext.Consumer>
                {context => 
                    context.webrtcState === "webrtcConnecting" ?
                      <PixelVideo
                        clientConfig={context.clientConfig}
                        webRtcPlayer={context.webRtcPlayer}
                        responseEventListeners={context.responseEventListeners}
                        socket={context.socket}
                      /> : PlayerComponent(context)
                }
                {/* {context =>
                  context.webrtcState
                    ? PlayerComponent(context.webrtcState, context.clientConfig)
                    : PlayerComponent(
                        this.props.webrtcState,
                        context.clientConfig
                      )
                }
              */}
            </PixelStreamingContext.Consumer>
          </div>
        </div>
      </div>
    );
  }
}

const style = {};

export default PixelWindow;

const PlayerComponent = (webrtcState, clientConfig) => {
  if (webrtcState === "loading") return <div>{webrtcState}</div>;
  if (webrtcState === "disConnected") return <div>{webrtcState}</div>;
  if (webrtcState === "connecting") return <div>{webrtcState}</div>;
  if (webrtcState === "connected") return <div>{webrtcState}</div>;
  if (webrtcState === "playing") return <div>{webrtcState}</div>;
  if (webrtcState === "stop") return <div>{webrtcState}</div>;
  return <div>test</div>;
};
