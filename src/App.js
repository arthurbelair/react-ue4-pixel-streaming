import React from 'react';
import ReactPixelStreaming from './index.jsx';
import PixelLogWindow from './PixelLogWindow';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state={};
    }

    render(){
        return(
        <div>
            <ReactPixelStreaming>
                <PixelLogWindow />
            </ReactPixelStreaming>
        </div>
        )
    }
}

export default App;
