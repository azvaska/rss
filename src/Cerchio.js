
import React from "react" //cerchio con http://www.phpmind.com/blog/2015/11/cesiumjs-how-to-get-longitude-and-latitude-on-click/
import {Math,Ellipsoid,Camera,Scene} from "cesium"
function Cerchio(props){
    console.log(props.Scenes.type.render.prototype)
    let cam = props.Scenes.type.render.prototype.costuctor
    let elissoide=Ellipsoid
    let cart= Camera.prototype.pickEllipsoid(props.cane,elissoide)
   //let cart=Camera.pickEllipsoid(props.cane,elissoide)
    if(cart){
        let map= elissoide.cartesianToCartographic(cart)
        let lat= Math.toDegrees(map.latitudine)
        console.log(lat)
    }
    console.log(props)
    return(null)
}

export default Cerchio