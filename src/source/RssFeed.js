
import React from "react"
import Rsslist from "./Rsslist"
class RssFeed extends React.Component{
	constructor(props){
		super(props)
		this.state={
			rss:[],
			rsscomp:[],
			fatto:true,
			showid:undefined,
			url:[],
		}
	}
	componentDidMount(){
		if(this.props.idgiornale !== undefined){
			this.setState({
				showid:this.props.idgiornale
			})
		}
	}
	static getDerivedStateFromProps(props, state){
		if(props.punti.length !== state.url ){

			let len=props.punti.length 
			let arry=[]
			let nom=[]
			for(let i =0;i<len;i++){
				arry.push(props.punti[i].url)
				nom.push(props.punti[i].nome)
			}
			if(props.idgiornale !== undefined){
			return {
				url:arry,
				nome:nom,
				showid:props.idgiornale
			}
		}
		return {
			url:arry,
			nome:nom,
		}

		}
		return null
	}


	render(){
		const rsscomp=this.state.url.map((x,index) => {
			return(
				<Rsslist url={x} nome={this.state.nome[index]} id = {index} click={this.props.click} idgiornale={this.props.idgiornale} key={this.state.nome[index]} />
			)	
		})
		let showid=undefined
		if(this.props.idgiornale !== undefined){
			 showid = this.props.idgiornale
			 return(		
				<React.Fragment>
					{rsscomp[showid]}			
				</React.Fragment>		
		)
		}	
        return(
			<div>			
		<React.Fragment>
				{rsscomp}
		</React.Fragment>
		</div>
        )
	}	
}

export default RssFeed
