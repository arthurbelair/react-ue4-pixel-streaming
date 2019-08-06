import React from 'react';

class Renderlist extends React.Component{
    render(){
        const items ={this.props.item};
        return(
            <ul className="shiritori">
                {item.map(item=><li>{item}</li>)}
            </ul>;
        )
    }
}

ReactDOM.render(<Renderlist items={["コアラ","ラッパ","パリ","リンゴ"]}/>)
document.querySelector('#app')

class SelectItem extends React.Component{
    constructor(props){
        super(props);
        this.state={
            selected:"",
        };
    }
    this.onChange.bind(this);

    onChange(e){
        this.setState({selected:e.target.value});
    }

    render(){
        const {selected}=this.state;
        return(
            <div>
                <p>現在{selected}が選択されています。</p>
                <label>
                    <input type="radio" value="コアラ" onChange={this.onChange}>コアラ</input>
                    <input type="radio" value="ラッパ" onChange={this.onChange}>ラッパ</input>
                    <input type="radio" value="パリ" onChange={this.onChange}>パリ</input>
                </label>
            </div>

        )
    }
}

ReactDOM.render(<SelectItem/>, document.querySelector('#app'));



