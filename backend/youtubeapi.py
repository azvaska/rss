import googleapiclient
from apiclient.discovery import build
from googleapiclient.errors import HttpError
import json
import psycopg2
import time
import datetime
import csv
import os
from dotenv import load_dotenv
load_dotenv()
DEVELOPER_KEY = os.getenv("DEVELOPER_KEY").split(",")

n = len(DEVELOPER_KEY) - 1
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

youtube_object = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
					   developerKey=DEVELOPER_KEY[0])

log = open("/var/www/backend/log/youtube" + str(datetime.datetime.now()) + ".log", "a+")

def dms2dd( minutes, seconds, direction):
	dd = float(minutes) + float(seconds)/(60.0);
	if direction == 'S' or direction == 'W':
		dd *= -1
	return "%.5f" % dd

def pars(lat):
	deglat=lat[-5:-3]
	seclat=lat[-3:-1]
	dirlat=lat[-1]
	if(len(lat) == 6):
		deglat=lat[-6:-3]
	return deglat,seclat,dirlat

def parse_dms(dms):
	dms=dms.split(" ")
	lat = dms[0]
	lng= dms[1]
	deglat,seclat,dirlat = pars(lat)
	deglng,seclng,dirlng = pars(lng)
	lat = dms2dd(deglat,seclat,dirlat)  
	lng = dms2dd(deglng,seclng,dirlng)
	return (lat, lng)


def youtube_search_location(lat, lng, city):
	nerror = 0
	search_location = youtube_object.search().list(q='*', type='video', location=str(lat) + "," + str(lng),
												   locationRadius='100km', part="id", order="date",
												   maxResults=50).execute()
	results = search_location.get("items", [])
	videos = []
	video_response = 1
	for result in results:
		videos.append(result["id"]["videoId"])
		video_ids = ", ".join(videos)
		video_response = youtube_object.videos().list(id=video_ids, part='snippet,recordingDetails').execute()
	try:
		for video_result in video_response.get("items", []):
			try:
				con = psycopg2.connect("host='127.0.0.1' dbname='geoall' user='ga' password='####'")
				con.autocommit = True
				cur = con.cursor()
				log.write("inserisco il video : " + "https://www.youtube.com/watch?v=" + str(
					video_result["id"]) + " " + str(datetime.datetime.now()) +"della città "+ str(city) +"\n")
				log.flush()
				cur.execute("Insert into source (idtype,lat,lon,url,nome) VALUES (4,%(lat)s,%(lon)s,%(url)s,%(nome)s)",
							{"lat": str(video_result["recordingDetails"]["location"]["latitude"]),
							 "lon": video_result["recordingDetails"]["location"]["longitude"],
							 "url": "https://www.youtube.com/watch?v=" + str(video_result["id"]),
							 "nome": video_result["snippet"]["title"]})
			except psycopg2.IntegrityError as error:
				log.write("errore integrety {0} \n".format(str(error)))
				log.flush()
				if (nerror >= 25):
					log.write("Gia fatta sta città \n ")
					log.flush()
					return 0
				nerror += 1
			except psycopg2.InterfaceError as e:
				log.write("error cursore aspetto 30 s e provo a ricollegarmi error: " + str(e))
				log.flush()
				time.sleep(30)
				continue
			except BaseException as error:
				log.write("error" + str(error))
				log.flush()
				continue
			finally:
				cur.close()
				con.close()
	except googleapiclient.errors.HttpError as err:
		log.write("key finita passo alla prossima " + str(err))
		log.flush()
		raise googleapiclient.errors.HttpError
	except BaseException as e:
		log.write("errore" + str(e))
		log.flush()
		time.sleep(20)
		return 0
citt= open("/var/www/backend/worl.csv","r")
csv_reader = csv.DictReader(citt)
nchiave = 1
for row in csv_reader:
	try:
		city=str(row["city"]).replace(" ","-")
		lat,lng=parse_dms(row["cord"])
	except BaseException as e:
		log.write("error "+str(e) + "\n" )
		log.flush()
		continue
	try:
		log.write("inizio {} alle {} \n".format(city,str(datetime.datetime.now())))
		log.flush()
		youtube_search_location(lat,lng, city)
	except googleapiclient.errors.HttpError as e:
		log.write("dormo... http error {} \n ".format(e))
		log.flush()
		time.sleep(3600)
		if (nchiave > n):
			log.write("ho finito tutte le chiavi \n ")
			log.flush()
			nchiave = 1
			try:
				con = psycopg2.connect("host='127.0.0.1' dbname='geoall' user='ga' password='####'")
				cur = con.cursor()
				cur.execute("UPDATE source SET geoms = ST_SetSRID(ST_MakePoint(lon, lat), 4326);")
				log.write("aggirno colonna db \n")
				log.flush()
				cur.close()
				con.close()
			except BaseException as e:
				log.write("errore db" + str(e) + "\n")
				log.flush()
			time.sleep(86400)
		youtube_object = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
							   developerKey=DEVELOPER_KEY[nchiave])
		nchiave += 1
