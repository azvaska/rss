import React from 'react';
import "../rss.css"
import FadeIn from "react-fade-in";
function ComList(props){
	let color = undefined
	if(props.color !== undefined){
		color=props.color
	}
	const text=props.punti.nome.replace("�","")
	return(
		<FadeIn duration={200}>
		<div className="RSS">
			<a href={props.punti.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none'}}>
			<div style={{display: "inline-block",
						marginRight: "3px",
						height: "10px",
						width: "10px",
						borderRadius: "50%",
						backgroundColor: color
						}}></div> {text} 
				</a>
		</div>
		</FadeIn>
		)
}

export default ComList