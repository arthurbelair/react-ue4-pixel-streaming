

class ButtonReact extends React.Component{
    constructor(props){
        super(props);
        this.state={
            selection:"none",
        };
    }

    handleClick(){
        this.setState({selection:"selected"})
    }

    render(){
        return(
            <button onClick={()=>this.handleClick()}>{this.state.selection}</button>
        )
    }
}



let domContainer = document.querySelector('#like_button_container2');
ReactDOM.render(e(ButtonReact), domContainer);