from flask import Flask,jsonify,request,escape,abort
from psycopg2 import sql,connect
from flask_cors import CORS
import requests
import json
import dotenv
import os
dotenv.load_dotenv()

POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB_CONNECT = f"host='127.0.0.1' dbname='geoall' user='ga' password={POSTGRES_PASSWORD}"
app = Flask(__name__)
cors = CORS(app)
def colore(i):
        switcher={
                1:"#00BFFF",
                2:"#00bfff",
                3:"#00008b",
                4:"#ffa500",
             }
        return switcher.get(i,"#ffa500")


def more(lng,lat,h,n,show,lens):
        con = connect(DB_CONNECT)
        cur = con.cursor()
        query="SELECT idtype,nome,url,rooturl FROM source WHERE ST_DWithin(geoms,ST_SetSRID(ST_MakePoint(%(lng)s,%(lat)s), 4326), %(grad)s) AND idtype NOT IN %(show)s ORDER BY idtype ASC  OFFSET %(offset)s ROWs  FETCH NEXT %(len)s ROWs ONLY ;"
        cur.execute( query, {"lng":lng,"lat":lat,"grad":str(float(h)/110574),"offset":str(n),"show":tuple(show),"len":lens})
        rows = cur.fetchall()
        data=[]
        for i in rows:
                namedisp=[str(i[1]),str(i[1])]
                if i[0]== 2 or i[0]== 3:
                        namedisp=str(i[1]).split("/")
                data.append({"idtype":i[0],"nome":namedisp[1],"url":str(i[2]),"rooturl":str(i[3]),"color":colore(i[0])})
        return json.dumps(data)
def source(lng,lat,h):
        con = connect(DB_CONNECT)
        cur = con.cursor()
        query="SELECT id,idtype,lat,lon,url FROM source WHERE ST_DWithin(geoms,ST_SetSRID(ST_MakePoint(%(lng)s,%(lat)s), 4326), %(grad)s) AND idtype !=3;"
        cur.execute(query, {"lng":lng,"lat":lat,"grad":str(float(h)/110574)})
        rows = cur.fetchall()
        data=[]
        n=0
        for i in rows:
                size="6"
                if(i[1]==1):
                        size="10"  
                data.append({"id": i[0],"idtype": i[1],"latitudine": i[2] ,"longitudine":i[3],"url":str(i[4]),"size":size})
        return json.dumps(data)
 
@app.route('/api/v1.0/more', methods=['GET'])
def getall():
        show=request.args.get("noshow").split(",")
        if(len(show)==4):
                return abort(500)
        if(len(show)== 0):
                return abort(500)
        lens=request.args.get("len")
        lat=request.args.get("lat")
        lng=request.args.get("lng")
        h=request.args.get("h")
        n=request.args.get("n")
        try:
                float(lat)
                float(lng)
                float(h)
                float(n)
                float(lens)
        except BaseException as e:
                return abort(500) 
        return more(str(lng),str(lat),h,n,show,lens)
@app.route('/api/v1.0/source', methods=['GET'])
def source1():
        lat=request.args.get("lat")
        lng=request.args.get("lng")
        h=request.args.get("h")
        try:
                float(lat)
                float(lng)
                float(h)
        except:
                return abort(500) 
        return source(str(lng),str(lat),h)
@app.route('/api/v1.0/geoloc',methods=['GET'])
def locatin():
        ip=request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
        url="http://ip-api.com/json/"+str(ip)+"?fields=192"
        dati=requests.get(url)
        punti=dati.json()
        return( '[{"la":'+str(punti['lat'])+',"lon":'+str(punti['lon'])+"}]")

if __name__ == '__main__':
    app.run()
