import React from 'react';
import { render } from 'react-dom'
import ReactPixelStreaming from '../../src/ReactPixelStreaming'
import PixelStreamingContext from "../../src/lib/pixel-streaming-context";

import CssBaseline from '@material-ui/core/CssBaseline';



import PixelLogWindow from '../../src/PixelLogWindow';

function App() {
   return (
     <React.Fragment>
       <CssBaseline />
       <ReactPixelStreaming webRtcHost="60.150.232.170"/>
       {/* <ReactPixelStreaming webRtcHost="localhost"/> */}
     </React.Fragment>
   );
 }

render(<App />, document.getElementById('root'));