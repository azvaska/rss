import React from "react"
import {ArcGisMapServerImageryProvider, Cartesian3, Color, Ion, Math, Viewer} from "cesium";
import Header from "./Header"
import Lista from "./Lista"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

class Globo extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            punti: [],
            premuto: true,
            id_premuto: undefined,
            ip: [],
            Rss: true,
            Twitter: true,
            Youtube: true,
            cordinate: [],
            fatta: true,
            h: 10000.0,
            grafico: false
        }

    }

    componentDidMount() {
        Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZDNjNWFkMS0yYWNhLTQyMTYtOTZiMS1jZmEyNWMwZDc1ZWYiLCJpZCI6MjM5MzEsInNjb3BlcyI6WyJhc3IiXSwiaWF0IjoxNTg1NjgyODY1fQ.WbaMpiMYZORVLwTVj9GpELCV-mepjwEjvopsuLdDjAg'
        this.viewer = new Viewer(this.refs.map, {
            baseLayerPicker: false,
            timeline: false,
            geocoder: false,
            homeButton: false,
            selectionIndicator: false,
            navigationHelpButton: false,
            animation: false,
            fullscreenButton: false,
            sceneModePicker: false,
            infoBox: false
        })
        var layers = this.viewer.scene.imageryLayers;
        layers.addImageryProvider(new ArcGisMapServerImageryProvider({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        }));
        this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 9324255.028156543;

        fetch('https://backend.ilbug.com/api/v1.0/geoloc')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    ip: data[0]
                })
                this.getdata(this.state.ip.la, this.state.ip.lon, 10000.0)
                this.viewer.camera.flyTo({
                    destination: Cartesian3.fromDegrees(this.state.ip.lon, this.state.ip.la, 100000) //destination : Cartesian3.fromDegrees(this.state.ip.lon,this.state.ip.la, 100000)
                });
            })
            .catch(error => console.log(error));
        this.viewer.camera.moveEnd.addEventListener(this.CentroCamera);
        this.viewer.selectedEntityChanged.addEventListener((entity) => {
            if (entity !== undefined) {
                if (this.state.punti[entity._id] !== undefined) {
                    if (this.state.punti[entity._id].idtype === 1) {
                        this.setState({
                            showrss: this.state.punti[entity._id]
                        })
                    } else {
                        window.open(this.state.punti[entity._id].url, '_blank');
                    }

                }
            }
        })
        this.Timeoutload()
    }
}

CentroCamera = () => {
    let cartographic = this.viewer.camera.positionCartographic
    this.setState({
        cerchio: {lng: Math.toDegrees(cartographic.longitude), lat: Math.toDegrees(cartographic.latitude)},
        showrss: undefined,
        h: cartographic.height,
    })
    this.getdata(this.state.cerchio.lat, this.state.cerchio.lng, cartographic.height)
}
getdata = (lat, lng, h) => {
    if (this.state.fatta) {
        this.setState({fatta: false})
        fetch("https://backend.ilbug.com/api/v1.0/source?lat=" + lat.toString() + "&lng=" + lng.toString() + "&h=" + h.toString())
            .then(response => response.json())
            .then(data => {
                this.setState({
                    punti: data.map(x => ({
                        id: x.id,
                        idtype: x.idtype,
                        longitudine: x.longitudine,
                        latitudine: x.latitudine,
                        url: x.url,
                        size: x.size,
                    }))
                })
                this.viewer.entities.removeAll();
                this.mettere(this.state.Rss, this.state.Twitter, this.state.Youtube, data)
            })
        this.setState({fatta: true})
    }
}

addenty = (data, i) => {
    let color = undefined
    let size = 6
    let h = 0
    switch (data.idtype) {
        case 1:
            color = Color.ORANGE
            size = 10
            h = 10
            break;
        case 2:
            color = Color.DEEPSKYBLUE//new Color(29.0,161.0,242.0,1)
            break;
        case 3:
            color = Color.DARKBLUE
            break
        case 4:
            color = Color.RED
            break
        default:
            break;
    }
    this.viewer.entities.add({
        id: i, position: Cartesian3.fromDegrees(data.longitudine, data.latitudine, h), point: {
            pixelSize: size, color: color, outlineColor: color, outlineWidth: 0
        }, Billboard: {
            show: false
        }, BoxGraphics: {
            show: false
        }
    });
}
mettere = (rss, tweet, Youtube, data) => {
    this.viewer.entities.removeAll();
    let len = data.length
    for (let i = 0; i < len; i++) {
        switch (data[i].idtype) {
            case 1:
                if (rss) {
                    this.addenty(data[i], i)
                }
                break;
            case 2:
                if (tweet) {
                    this.addenty(data[i], i)
                }
                break;
            case 3:
                if (tweet) {
                    this.addenty(data[i], i)
                }
                break;
            case 4:
                if (Youtube) {
                    this.addenty(data[i], i)
                }
                break
            default:
                break;
        }
    }
}
Timeoutload = () => {
    setTimeout(() => {
        if (this.state.loading !== false || this.state.ip === undefined || this.state.punti === undefined) {
            this.Timeoutload();
        }
        if (document.getElementById('ipl-progress-indicator') === null) {
            return 0
        }
        const ele = document.getElementById('ipl-progress-indicator')
        ele.classList.add('available')
        if (ele) {
            ele.outerHTML = ''
        }
    }, 4000)
}
handleClick = (id) => {
    this.setState({premuto: false})
    this.setState({premuto: true, id_premuto: id})
}
handleCheck = (event) => {
    const target = event.target;
    let check = target.checked;
    const name = target.name;
    let rss = this.state.Rss
    let tweet = this.state.Twitter
    let Youtube = this.state.Youtube
    switch (name) {
        case "Rss":
            rss = check
            break;
        case "Twitter":
            tweet = check
            break;
        case "Youtube":
            Youtube = check
            break
        default:
            break;
    }
    this.mettere(rss, tweet, Youtube, this.state.punti)
    this.setState({
        [name]: check
    });

};

render()
{
    let m = undefined
    if (this.state.punti !== undefined && this.state.cerchio !== undefined) {
        if (this.state.showrss !== undefined) {
            m = <Lista showrss={this.state.showrss} key={this.state.cerchio.lat.toString(),this.state.showrss.id}
                       pos={{lat: this.state.cerchio.lat, lng: this.state.cerchio.lng, h: this.state.h}}
                       show={{Youtube: this.state.Youtube, Twitter: this.state.Twitter, Rss: this.state.Rss}}/>
        } else {
            m = <Lista key={this.state.cerchio.lat.toString()}
                       pos={{lat: this.state.cerchio.lat, lng: this.state.cerchio.lng, h: this.state.h}}
                       show={{Youtube: this.state.Youtube, Twitter: this.state.Twitter, Rss: this.state.Rss}}/>
        }
    }
    return (<div>
            <Header eventi={this.handleCheck} rss={this.state.Rss} Twitter={this.state.Twitter}
                    Youtube={this.state.Youtube}/>
            <div className="Rettcont" id="lista1">
                {m}
            </div>
            <div style={{position: "absolute", top: "30px", left: "0px", right: "0px", bottom: "0px"}}
                 ref="map">
            </div>

        </div>)
}
}
export default Globo
