(this.webpackJsonpsito=this.webpackJsonpsito||[]).push([[0],{0:function(t,e){t.exports=Cesium},20:function(t,e,n){t.exports=n(55)},31:function(t,e,n){},54:function(t,e,n){},55:function(t,e,n){"use strict";n.r(e);var a=n(1),o=n.n(a),i=n(8),r=n.n(i),s=n(16),c=n(3),l=n(4),u=n(5),d=n(6),p=n(9),m=n(7),h=n(0),f=function(t){Object(d.a)(n,t);var e=Object(u.a)(n);function n(t){var a;return Object(c.a)(this,n),(a=e.call(this,t)).state={colore:h.Color.ORANGE,props1:t,id:t.dati.id},a}return Object(l.a)(n,[{key:"componentDidMount",value:function(){if(this.props.idPrem===this.state.id&&this.state.colore===h.Color.ORANGE)return this.setState({colore:h.Color.RED}),!0}},{key:"shouldComponentUpdate",value:function(t){return t.idPrem===this.state.id&&this.state.colore===h.Color.ORANGE?(this.setState({colore:h.Color.RED}),!0):t.idPrem!==this.state.id&&this.state.colore===h.Color.RED&&(this.setState({colore:h.Color.ORANGE}),!0)}},{key:"render",value:function(){var t=this;return o.a.createElement(m.b,{color:this.state.colore,position:h.Cartesian3.fromDegrees(this.state.props1.dati.longitudine,this.state.props1.dati.latitudine,0),onClick:function(){t.state.props1.click(t.state.id)},onTouchStart:function(){return t.state.props1.click(t.state.id)}})}}]),n}(o.a.Component),b=Object(p.hot)(f),v=n(17),E=(n(31),n(18)),g=n.n(E);var k=function(t){var e=t.dati.title.replace("\ufffd","");return o.a.createElement(g.a,{duration:200},o.a.createElement("div",{className:"RSS"},o.a.createElement("a",{href:t.dati.links[0].url,target:"_blank",rel:"noopener noreferrer",style:{textDecoration:"none",color:"black"}},e)))},y=n(19),j=n.n(y),C=function(t){Object(d.a)(n,t);var e=Object(u.a)(n);function n(t){var a;return Object(c.a)(this,n),(a=e.call(this,t)).state={loading:!0,rss:[],rssfeed:[]},a}return Object(l.a)(n,[{key:"componentDidMount",value:function(){var t=this,e=1;void 0!==this.props.nome&&(e=this.props.nome.id),fetch("https://backend.ilbug.com/api/v1.0/rss/"+e).then((function(t){return t.json()})).then((function(e){var n=e.map((function(t){return t}));t.setState({rss:n});var a=[];t.state.rss.map((function(e){return fetch("https://cors-anywhere.herokuapp.com/"+e.url).then((function(t){return t.text()})).then((function(t){return v.parse(t)})).then((function(e){a.push(e.items.map((function(t){return t}))),t.setState({loading:!1,rssfeed:a})}))}))}))}},{key:"render",value:function(){var t=null,e=null;void 0!==this.props.nome&&(t=this.props.nome.nome,e=this.props.nome.url);var n=this.state.rssfeed.map((function(t){return t.map((function(t,e){return o.a.createElement(k,{key:e,dati:t})}))})),a=[];return n.map((function(t){return t.map((function(t,e){return a.push(t)}))})),o.a.createElement("div",{className:"rettangolo"},o.a.createElement("a",{href:e,target:"_blank",rel:"noopener noreferrer",id:"h1s"},t),this.state.loading?o.a.createElement("div",{style:{margin:"auto"}}," ",o.a.createElement(j.a,{type:"TailSpin",color:"#2BAD60",height:50,width:50})," "):a)}}]),n}(o.a.Component),N=Object(p.hot)(C);n(54);var O=function(t){return o.a.createElement("div",{className:"divFonti"},o.a.createElement("ul",null,o.a.createElement("li",{className:"dropdown"},o.a.createElement("label",{className:"dropbtn"},"Fonte dati"),o.a.createElement("div",{className:"dropdown-content"},o.a.createElement("label",{className:"container"},"Rss",o.a.createElement("input",{type:"checkbox",name:"Rss",checked:t.rss,onChange:t.eventi}),o.a.createElement("span",{className:"checkmark"})),o.a.createElement("label",{className:"container"},"Youtube",o.a.createElement("input",{type:"checkbox",name:"Youtube",checked:t.youtube,onChange:t.eventi}),o.a.createElement("span",{className:"checkmark"}))))))},S=function(t){Object(d.a)(n,t);var e=Object(u.a)(n);function n(){var t;return Object(c.a)(this,n),(t=e.call(this)).Timeout=function(){setTimeout((function(){if(!1!==t.state.loading&&t.Timeout(),null===document.getElementById("ipl-progress-indicator"))return 0;var e=document.getElementById("ipl-progress-indicator");e.classList.add("available"),e&&(e.outerHTML="")}),3e3)},t.handleClick=function(e){t.setState({premuto:!1}),t.setState({premuto:!0,id_premuto:e})},t.handleCheck=function(e){var n=e.target,a=n.value;("Youtube"===n.name||"Rss"===n.name)&&(a=n.checked);var o=n.name;t.setState(Object(s.a)({},o,a))},t.state={loading:!0,punti:[],premuto:!0,id_premuto:1,ip:[],Rss:!0,Youtube:!1},t}return Object(l.a)(n,[{key:"componentDidMount",value:function(){var t=this;fetch("https://backend.ilbug.com/api/v1.0/giornali").then((function(t){return t.json()})).then((function(e){t.setState({punti:e.map((function(t){return{id:t.id,nome:t.nome,longitudine:t.longitudine,latitudine:t.latitudine,url:t.url}}))})})),fetch("https://ip-api.com/json/?fields=192").then((function(t){return t.json()})).then((function(e){t.setState({ip:e}),fetch("https://backend.ilbug.com/api/v1.0/loc?loca="+String(e.lat)+","+String(e.lon)).then((function(t){return t.json()})).then((function(e){var n=t.state.punti.findIndex((function(t){return t.latitudine===e[0].la&&t.longitudine===e[0].lon}));n=t.state.punti[n].id,t.setState({loading:!1,id_premuto:n})}))})),this.Timeout()}},{key:"render",value:function(){var t=this,e=null;e=!0===this.state.Rss?this.state.punti.map((function(e){return o.a.createElement(b,{click:t.handleClick,key:e.id,dati:e,idPrem:t.state.id_premuto})})):null,h.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZDNjNWFkMS0yYWNhLTQyMTYtOTZiMS1jZmEyNWMwZDc1ZWYiLCJpZCI6MjM5MzEsInNjb3BlcyI6WyJhc3IiXSwiaWF0IjoxNTg1NjgyODY1fQ.WbaMpiMYZORVLwTVj9GpELCV-mepjwEjvopsuLdDjAg";var n=this.state.id_premuto;return n-=1,o.a.createElement("div",null,o.a.createElement(O,{eventi:this.handleCheck,rss:this.state.Rss,youtube:this.state.Youtube}),o.a.createElement("div",{className:"Rettcont"},this.state.premuto?o.a.createElement(N,{nome:this.state.punti[n]}):null),o.a.createElement(m.d,{style:{position:"absolute",top:"27px",left:"0px",right:"0px",bottom:"10px"},baseLayerPicker:!1,timeline:!1,geocoder:!1,homeButton:!1,selectionIndicator:!1,navigationHelpButton:!1,animation:!1,fullscreenButton:!1,sceneModePicker:!1},void 0===this.state.ip.lon?null:o.a.createElement(m.a,{duration:.1,destination:h.Cartesian3.fromDegrees(this.state.ip.lon,this.state.ip.lat,1e6),once:!0}),o.a.createElement(m.c,null,e)),o.a.createElement("ins",{className:"adsbygoogle",style:{display:"flex",bottom:"0px"},"data-ad-client":"ca-pub-2658199536475533","data-ad-slot":"7512404495","data-ad-format":"auto","data-full-width-responsive":"true"}),o.a.createElement("script",null,"(adsbygoogle = window.adsbygoogle || []).push(",");"))}}]),n}(o.a.Component);r.a.render(o.a.createElement(S,null),document.getElementById("root"))}},[[20,1,2]]]);
//# sourceMappingURL=main.066018e3.chunk.js.map