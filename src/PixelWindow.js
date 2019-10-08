import React, { Component } from "react";
import PixelStreamingContext from "./lib/pixel-streaming-context";

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
    this.props.connect();
  }

  componentWillUnmount() {}

  render() {
    const webrtcState = this.props.webrtcState;
    return (
      <div style={style}>
        <div id="player" className="fixed-size">
          <div id="videoPlayOverlay">
            <PixelStreamingContext.Consumer>
              {context =>
                context.webrtcState
                  ? PlayerComponent(context.webrtcState)
                  : PlayerComponent(this.props.webrtcState)
              }
            </PixelStreamingContext.Consumer>
          </div>
        </div>
      </div>
    );
  }
}

const style = {};

export default PixelWindow;

const PlayerComponent = webrtcState => {
  if (webrtcState === "loading") return <div>{webrtcState}</div>;
  if (webrtcState === "disConnected") return <div>{webrtcState}</div>;
  if (webrtcState === "connecting") return <div>{webrtcState}</div>;
  if (webrtcState === "connected") return <div>{webrtcState}</div>;
  if (webrtcState === "playing") return <div>{webrtcState}</div>;
  if (webrtcState === "stop") return <div>{webrtcState}</div>;
};
