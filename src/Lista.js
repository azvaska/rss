import React, {Component} from "react"
import "./rss.css"
import ListComp from "./source/ListComp"
import RssFeed from "./source/RssFeed"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import axios from "axios"

Element.prototype.isOverflowing = function () {
    return this.scrollHeight > this.clientHeight || this.scrollWidth > this.clientWidth;
}

class Lista extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showid: 0,
            rss: [],
            loading: true,
            punti: [],
            idgiornale: undefined,
            n: 0,
            agg: false,
            cosamostrare: {Tweet: true, Youtube: true, Rss: true},
            data: [],
            len: 0,
            noshow: "3",
        }
    }

    componentDidMount() {
        let ids = 0
        let idsgior = undefined
        if (this.props.showrss !== undefined) {
            ids = 1
            idsgior = this.props.showrss.id
        }
        let noshow = this.noshow(this.props.show)
        this.getdata(this.state.n, noshow)
        this.setState({
            noshow: noshow, cosamostrare: this.props.show, showid: ids, idgiornale: idsgior
        })
    }

    handleclick = (id, idgiornale) => {
        if (this.state.showid !== id) {
            this.setState({showid: id, idgiornale: idgiornale})
        }
    }
    handleback = () => {
        var myDiv = document.getElementById('all1');
        myDiv.scrollTop = 0;
        this.setState({
            showid: 0, idgiornale: undefined
        })
    }

    async getdata(n, noshow) {
        let len = document.getElementById("lista1").clientHeight
        len = Math.round(len / 21) + 2
        const response = await axios.get("https://backend.ilbug.com/api/v1.0/more?lat=" + this.props.pos.lat.toString() + "&lng=" + this.props.pos.lng.toString() + "&h=" + this.props.pos.h.toString() + "&n=" + n.toString() + "&noshow=" + noshow + "&len=" + len.toString());
        let data = await response.data
        let k = this.getpunti(data, this.state.cosamostrare)
        this.setState(prevState => ({
            rss: k.rss, loading: false, punti: k.punti, data: data, len: len
        }))
    }

    async getdatamore(n, noshow) {
        let len = document.getElementById("lista1").clientHeight
        len = Math.round(len / 21) + 2
        const response = await axios.get("https://backend.ilbug.com/api/v1.0/more?lat=" + this.props.pos.lat.toString() + "&lng=" + this.props.pos.lng.toString() + "&h=" + this.props.pos.h.toString() + "&n=" + n.toString() + "&noshow=" + noshow + "&len=" + len.toString());
        let data = await response.data
        let k = this.getpunti(data, this.state.cosamostrare)
        this.setState(prevState => ({
            rss: [...prevState.rss, ...k.rss],
            loading: false,
            punti: [...prevState.punti, ...k.punti],
            data: data,
            len: len
        }))
    }

    getpunti = (props, show) => {
        let len = props.length
        let rss = []
        let punti = []
        for (let i = 0; i < len; i++) {
            if (props[i].idtype === 1) {
                if (show.Rss) {
                    rss.push({nome: props[i].nome, url: props[i].url, rooturl: props[i].rooturl})
                }
            } else {
                punti.push({
                    nome: props[i].nome,
                    url: props[i].url,
                    rooturl: props[i].rooturl,
                    color: props[i].color,
                    tweet: props[i].nomedis
                })
            }
        }
        return {
            rss: rss, loading: false, punti: punti,
        }
    }

    async more(n, len) {
        let k = await this.getdatamore(n + len, this.state.noshow)
    }

    isOverflown = (element) => {
        if (element === undefined || element === null) {
            return true
        }
        return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    }
    noshow = (show) => {
        let noshow = "3"
        for (var key in show) {
            if (show.hasOwnProperty(key)) {
                if (key === "Twitter" && show[key] === false) {
                    noshow += ",2"
                }
                if (key === "Rss" && show[key] === false) {
                    noshow += ",1"
                }
                if (key === "Youtube" && show[key] === false) {
                    noshow += ",4"
                }
            }
        }
        return noshow
    }

    render() {
        let text = "Non ci sono più punti"
        let c = this.state.showid
        let rss = this.state.rss
        let idgiornale = this.state.idgiornale
        let punti = this.state.punti
        if (this.props.show.Twitter !== this.state.cosamostrare.Twitter || this.props.show.Rss !== this.state.cosamostrare.Rss || this.props.show.Youtube !== this.state.cosamostrare.Youtube) {
            let noshow = this.noshow(this.props.show)
            let reg = /[1-4],[1-4],[1-4],[1-4]/i
            if (reg.test(noshow)) {
                this.setState({
                    cosamostrare: this.props.show,
                    noshow: noshow,
                    nosurce: "seleziona una source in altro a sinitra",
                    rss: [],
                    punti: [],
                })
            } else {
                this.getdata(this.state.n, noshow)
                this.setState({
                    nosurce: undefined, cosamostrare: this.props.show, noshow: noshow
                })
            }
        }
        if (this.state.loading) {
            return (

                <div style={{
                    display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%"
                }}>
                    <Loader type="TailSpin" color="#00BFFF" height={80} width={80}/>
                </div>)
        }
        if (this.props.showrss !== undefined) {
            if (this.props.showrss.id !== this.state.idgiornale) {

                idgiornale = this.props.showrss.id
                c = 1
                this.setState({
                    idgiornale: idgiornale
                })
            }
        }
        switch (c) {
            case 0:
                return (<div className="rettangolo" id="all">
                    {this.state.nosurce === undefined ? null : <h1>{this.state.nosurce}</h1>}
                    <RssFeed punti={rss} mount={true} back={this.handleback} click={this.handleclick} show={false}
                             key={c}/>
                    <ListComp click={this.handleclick} show={false} back={this.handleback}
                              idgiornale={this.state.idgiornale} punti={punti}/>
                    {this.isOverflown(document.getElementById("all")) ? (<button onClick={() => {
                        this.more(this.state.n, this.state.len)
                    }}>More</button>) : null}
                </div>)
            case 1:
                if (rss.length === 1) {
                    idgiornale = 0
                }
                return (<div className="rettangolo" id="all1">
                    <RssFeed punti={rss} back={this.handleback} idgiornale={idgiornale} click={this.handleclick}
                             show={true} mount={true} key={c}/>
                    <button style={{paddingBottom: "0.5%"}} onClick={this.handleback}>Back</button>
                </div>)
            default:
                break;
        }
    }
}

export default Lista