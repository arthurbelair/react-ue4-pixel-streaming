import React from 'react';
import { render } from 'react-dom'
import ReactPixelStreaming from '../../src/ReactPixelStreaming'
import PixelStreamingContext from "../../src/lib/pixel-streaming-context";

import PixelLogWindow from '../../src/PixelLogWindow';

const App = () => {
   return <ReactPixelStreaming webRtcHost="localhost"/>
}
render(<App />, document.getElementById('root'));