import React from 'react';
import "./Headers.css"

import logo from "./logopiccolo.png"

function Header(props) {
    const data = new Date().getFullYear()
    return (<div className="divFonti">
            <ul>
                <a href="https://ilbug.com/spaceinvaders.html"> <img src={logo} id="logo" alt='Logo'></img> </a>
                <li className="dropdown">
                    <label className="dropbtn"> ilbug.com </label>
                    <div className="dropdown-content">
                        <label className="container">
                            <div className="rsssquare"></div>
                            Rss
                            <input
                                type="checkbox"
                                name="Rss"
                                checked={props.rss}
                                onChange={props.eventi}
                            />
                            <span className="checkmark"></span>
                        </label>
                        <label className="container">
                            <div className="twittersquare"></div>
                            Twitter
                            <input
                                type="checkbox"
                                name="Twitter"
                                checked={props.Twitter}
                                onChange={props.eventi}
                            />
                            <span className="checkmark"></span>
                        </label>
                        <label className="container">
                            <div className="youtubesquare"></div>
                            Youtube
                            <input
                                type="checkbox"
                                name="Youtube"
                                checked={props.Youtube}
                                onChange={props.eventi}
                            />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                </li>
                <li className="copi">
                    <footer style={{paddingBottom: "10px"}}>
                        <small>&copy; 1999-{data} <a style={{fontSize: "small"}}
                                                     href="mailto: info@ilbug.com"> info@ilbug.com </a></small>
                    </footer>
                </li>
            </ul>
        </div>)
}

export default Header