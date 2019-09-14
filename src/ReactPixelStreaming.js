import React, {Component} from 'react';
import PixelWindow from './PixelWindow';
import PixelLogWindow from './PixelLogWindow';
import PixelStreamingClient from './lib/app';

const PixelStreamingContext = React.createContext();

export default class ReactPixelStreaming extends Component{
    constructor(props){
        super(props);
        this.state={
            load: PixelStreamingClient.load,
            logs: [],
            addResponseEventListener: PixelStreamingClient.addResponseEventListener,
            removeResponseEventListener: PixelStreamingClient.removeResponseEventListener,
            emitCommand: PixelStreamingClient.emitCommand,
            emitDescriptor:PixelStreamingClient.emitDescriptor,
            emitUIInteraction:PixelStreamingClient.emitUIInteraction
        };
    }

    myHandleResponseFunction =(data)=>{
        console.log(data);
        this.setState({
            logs: this.state.logs.concat(data)
        });
    }

    componentDidMount(){
        // this.state.addResponseEventListener("handle_responses", this.myHandleResponseFunction);
        this.state.addResponseEventListener("handle_responses", this.myHandleResponseFunction);
        console.log("atached handler");
    }

    componentWillUnmount(){
        // this.state.removeResponseEventListener("handle_responses");
        this.state.removeResponseEventListener("handle_responses");
        console.log("removed handler");
    }

    render(){
        const {load, addResponseEventListener, removeResponseEventListener, logs, emmitCommand, emmitDescriptor, emmitUIInteraction} = this.state;
        return(
            <PixelStreamingContext.Provider  value={this.state}>
        <div style={this.props.style}>
            <PixelWindow load={load} />
            <PixelLogWindow
                addResponseEventListener={addResponseEventListener} 
                removeResponseEventListener={removeResponseEventListener}
                logs={logs}
            />
            {this.props.children}
        </div>
        </PixelStreamingContext.Provider>
        )
    }
}
