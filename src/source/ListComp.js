import React,{Fragment} from 'react'
import ComList from "./ComList"
function ListComp(props){
    let puntis = props.punti.map((x,index) =>  {return(<ComList punti={x} key={index} color={x.color} tweet={x.tweet}/>)})
        return(
            <Fragment>
                {puntis}
            </Fragment>

        )
}
export default ListComp