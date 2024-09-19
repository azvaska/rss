import React,{Component} from 'react'
import YoutubeList from "./YoutubeList"

class Youtube extends Component{
    constructor(props){
        super(props)
        this.state={
            punti:[],
            puntislice:[],
            show:false
        }
    }
    componentDidMount(){
        this.punti(this.props.punti)
    }

    punti=(puntis)=>{
        let c=puntis.slice(0,50);
        this.setState({
            punti:puntis,
            puntislice: c.map((x,index) =>  <YoutubeList punti={x} key={index}/>)
        })};
    shouldComponentUpdate(nextProps, nextState){
        if(nextState.show !==this.state.show){
            return true
        }
        if(nextProps.punti.length !== this.state.punti.length){
            this.punti(nextProps.punti)
            return true
        }
        return false
        }
    Candlestick=()=>{
        this.setState({
            show:true
        })
    }
    render() {
        console.log(this.state)
        if(this.state.show){
            return(
                <div>
                {this.state.puntislice}
            </div>
            )
        }else{
            return(
                <div>
                    <button onClick={this.Candlestick}>Youtube</button>
                    {this.state.show ? this.state.puntislice:null}
                </div>
            )
        }
    }
}
export default Youtube