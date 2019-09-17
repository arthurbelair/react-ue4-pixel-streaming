import React,{Component} from 'react';

class PixelWindow extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    }

    componentDidMount(){
        // PixelStreamingのロード
        // this.props.controlScheme = this.props.controlScheme
        this.props.load();
    }

    componentWillUnmount(){
    }

    render(){
        return(
        <div style={style}>
            <div id ="player" className="fixed-size" />
        </div>
        )
    }
}

const style = {
}        



export default PixelWindow;


