import React from 'react';
import "./rss.css"
function Rssrend (props){
	const text=props.punti.nome.replace("�","")
	return(
		<div className="rss">
			<a href={props.punti.url} target="_blank" rel="noopener noreferrer">
                {text} 
				</a>
			
		</div>
		)
}

export default Rssrend