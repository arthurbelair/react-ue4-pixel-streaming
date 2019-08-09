import React from 'react';
import PixelWrapper from './PixelWrapper';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state={};
    }

    render(){
        return(
        <div>
            <PixelWrapper />
        </div>
        )
    }
}

export default App;
