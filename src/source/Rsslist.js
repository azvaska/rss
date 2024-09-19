import React from "react"
import FadeIn from "react-fade-in";
import Rssrend from "./Rssrend";
import * as rssParser from 'react-native-rss-parser';
import axios from "axios"
import "./rss.css"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
class  Rsslist extends React.Component{
	constructor(props){
		super(props)
		this.state={
			url:"",
			dati:[],
			stop:false,
			loading:true
		}
	}
	componentDidMount() {
		if(this.props.idgiornale === undefined){
			return 0
		}
		this.c(this.props)
	  }
	async c (props) {
		try {
			const response = await axios.get("https://cors-anywhere.herokuapp.com/"+props.url);
			let text= await response.data
			let rss = await rssParser.parse(text)
			let rsscomp= rss.items.map((x,index) => 	<Rssrend punti={{nome:x.title,url:x.links[0].url}} key={index}/>)
			this.setState({
			  dati: rsscomp,
			  loading: false
			});
		  } catch (error) {
			this.setState({
			  error,
			  loading: false
			});
		  }
	}

	  static getDerivedStateFromProps(props,pervstate){
		
		if(props.idgiornale !== undefined && (pervstate !== props.idgiornale)){
			if(pervstate.dati.length === 0){
			return props
			}else{
				return null
			}
		}
		return null
	}
	shouldComponentUpdate(nextprops,pervstate){
		
		if(pervstate.dati.length === 0 && nextprops.idgiornale !== undefined){
			this.c(nextprops)
				return true	

		}
		if(pervstate.dati.length !== 0){
			return true
		}
		return false
	}
	render(){
		if(this.props.idgiornale !== undefined){
			if(this.state.loading ){
				return (
				<div className="spin">
					<Loader type="TailSpin" color="#00BFFF" height={80} width={80} />
				</div>
				)
				}
			return(
				<div className="RSS">
			<h1>{this.props.nome}</h1>
			<FadeIn duration={200}>
				<React.Fragment>
					{this.state.dati}
				</React.Fragment>

			</FadeIn>
				</div>
			)
		}
		return(
		<button className="bottonerss" style={{display:"block"}} onClick={() =>this.props.click(1,this.props.id)}><div className="rett"></div>{this.props.nome}</button>
			)
	}

}
//{this.props.punti.map(x => )}
//	<a href={props.dati.links[0].url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: "black" }}>{text}</a>
//<hr style={{marginRight:"10px"}}></hr>
export default Rsslist