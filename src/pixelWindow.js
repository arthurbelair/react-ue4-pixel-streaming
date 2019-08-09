import React from 'react';
import ReactDOM from 'react-dom';

class PixelWindow extends React.Component{
    constructor(props){
        super(props);
        this.state={
            buttonname:"test",
        };
        this.myHandleResponseFunction = this.myHandleResponseFunction.bind(this);
    }

    myHandleResponseFunction =(data)=>{
        console.log(data);
        console.log("Response received!");
        console.log("you clicked pixelstreaming window!!");
        console.log("you will be happy!!");
        this.setState({
            buttonname:data
        });
    }

    componentDidMount(){
        console.log(this);

        window.addResponseEventListener("handle_responses", this.myHandleResponseFunction);
        console.log("atached handler");
        
        window.addEventListener("click", ()=>{this.myHandleResponseFunction("clickeddddd!!!!")})

        /* invokeテスト */
        /* mountしたら5秒後にhandler呼ぶ */
        setTimeout(()=>{this.myHandleResponseFunction("timeouted!!!!!!!!!!!")},5000);

    }

    componentWillUnmount(){
        window.removeResponseEventListener("handle_responses");
        console.log("removed handler");
    }

    render(){
        return(
        <div>
            <div id ="player" className="fixed-size" >False</div>
             {/*<div id ="player" className="fixed-size" onClick={()=>{this.myHandleResponseFunction()}}>False</div>*/}
            <div>
                <button>{this.state.buttonname}</button>
            </div>
        </div>
        )
    }
}

export default PixelWindow;

// let domContainer = document.querySelector('#pixelWindow');
// ReactDOM.render(e(pixelWindow), domContainer);


