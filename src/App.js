import React from 'react';
import PixelWrapper from './ReactPixelStreaming';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state={};
    }

    render(){
        return(
        <div>
            <PixelWrapper>
                <div>aaa</div>
            </PixelWrapper>
        </div>
        )
    }
}

export default App;
