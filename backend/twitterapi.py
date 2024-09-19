import tweepy
import psycopg2
import datetime
import time
import urllib.request
import urllib.error
import csv
import os
import math
from multiprocessing import Process

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


consumer_key="##"
consumer_secret="###"
auth = tweepy.AppAuthHandler(consumer_key, consumer_secret)
def remove_emoji(text):
    import re
    EMOJI_PATTERN = re.compile(
        "["
        "\U0001F1E0-\U0001F1FF"  
        "\U0001F300-\U0001F5FF" 
        "\U0001F600-\U0001F64F" 
        "\U0001F680-\U0001F6FF" 
        "\U0001F700-\U0001F77F" 
        "\U0001F780-\U0001F7FF" 
        "\U0001F800-\U0001F8FF"  
        "\U0001F900-\U0001F9FF"  
        "\U0001FA00-\U0001FA6F"  
        "\U0001FA70-\U0001FAFF"  
        "\U00002702-\U000027B0"  
        "\U000024C2-\U0001F251" 
        "]+"
    )
    text = re.sub(EMOJI_PATTERN,"", text)
    return text

fileurl=open("urlbrutti","a")
loggen=open("tot.log","a+")
def resolve(url):
    req=urllib.request.Request(url)
    return urllib.request.urlopen(req,timeout=5).geturl()


def getTweet(lat,lng,city):
    api = tweepy.API(auth, wait_on_rate_limit=True,
				   wait_on_rate_limit_notify=True)  
    f= open("/var/www/backend/log/tweetapi"+city+".log","w")
    geocode1=str(lat)+","+str(lng)+",200km"
    max_id = -1 
    sinceId = None
    tweetCount=0
    while True:
        try:
            if (max_id <= 0):
                new_tweets = api.search(q="*",count=1000,geocode=geocode1)
            else:
                new_tweets = api.search(q="*",count=1000,max_id=str(max_id - 1),geocode=geocode1)
            if(len(new_tweets) == 0):
                f.write(" dormo per 60 secondi ")
                time.sleep(60)
            for tweet in new_tweets:
                try:
                    if tweet.geo:
                        if(resolve(tweet.entities["urls"][0]["url"]).find("https://twitter.com") !=-1 ):
                            try:
                                con = psycopg2.connect("host='127.0.0.1' dbname='geoall' user='ga' password='#####'")
                                con.autocommit = True
                                cur = con.cursor()
                                cur.execute("""
                            Insert into source (idtype,nome,lat,lon,url,idtweet) 
                            VALUES (2, %(nome)s , %(lat)s ,%(lon)s , %(url)s , %(id)s);
                            """,{"nome":remove_emoji(tweet.user.screen_name)+"/"+remove_emoji(tweet.user.name),"lat":tweet.geo['coordinates'][0],"lon":tweet.geo['coordinates'][1],"url":tweet.entities["urls"][0]["url"],"id":tweet.id_str})
                                cur.close()
                                con.close()
                            except BaseException as error:
                                f.write('An exception occurred: '+str(error))
                    else:
                        if(resolve(tweet.entities["urls"][0]["url"]).find("https://twitter.com") !=-1 ):
                            ragg = ((int.from_bytes(os.urandom(8), byteorder="big") / ((1 << 64) -1))) * 1.7
                            angle = ((int.from_bytes(os.urandom(8), byteorder="big") / ((1 << 64) -1))) * math.pi * 2
                            lat1= math.sin(angle) * ragg
                            lng1= math.cos(angle) * ragg 
                            lat1 = lat + lat1
                            lng1 = lng + lng1
                            try:
                                con = psycopg2.connect("host='127.0.0.1' dbname='geoall' user='ga' password='#####'")
                                con.autocommit = True
                                cur = con.cursor() 
                                cur.execute("""
                            Insert into source (idtype,nome,lat,lon,url,idtweet) 
                            VALUES (3, %(nome)s , %(lat)s ,%(lon)s , %(url)s , %(id)s);
                            """
                            ,{"nome":remove_emoji(tweet.user.screen_name)+"/"+remove_emoji(tweet.user.name),"lat":lat1,"lon":lng1,"url":tweet.entities["urls"][0]["url"],"id":tweet.id_str})
                                cur.close()
                                con.close()
                            except BaseException as error:
                                f.write('An exception occurred: '+str(error)+"\n")
                            
                except IndexError:
                    continue
                except ValueError as e:
                    f.write("Value Error "+str(e)+" "+ str(datetime.datetime.now())+ "\n")
                    f.flush()
                    continue
                except urllib.error.URLError as e:
                    fileurl.write(str(tweet.entities["urls"][0]["url"])+"\n")
                    fileurl.flush()
                    f.write("Url error "+str(e)+" "+ str(datetime.datetime.now())+ " "+ tweet.entities["urls"][0]["url"] +"\n")
                    f.flush()
                    continue
                except psycopg2.Error as e:
                    f.write('An exception occurred: {}'.format(e))
                    f.write ("\n Cannot connect to db \n")
                    f.flush()
                    continue
                except BaseException as e:
                    f.write("error generale "+str(e)+" "+ str(datetime.datetime.now())+ "\n")
                    f.flush()
                    continue
            l="Downloaded {0} tweets  ".format(tweetCount)+ str(datetime.datetime.now()) + " " + city +"\n"
            f.write(l)
            f.flush()
            tweetCount += len(new_tweets)
            max_id = new_tweets[-1].id
        except BaseException as e:
            loggen.write("errrore tweepy morte thread"+str(e))
            f.close()

citt= open("/var/www/backend/worl.csv","r")

csv_reader = csv.DictReader(citt)
for row in csv_reader:
    start_time = time.time()
    try:
        city=str(row["city"]).replace(" ","-")
        lat,lng=parse_dms(row["cord"])
    except BaseException as e:
        loggen.write("error "+str(e) + "\n" )
        continue
    loggen.write("inizio a cercare "+ city + " alle : "+ str(datetime.datetime.now())+"\n")
    loggen.flush()
    action_process = Process(target=getTweet,args=(float(lat),float(lng),city))
    action_process.start()
    time.sleep(21600)
    action_process.terminate()
    action_process.join()
    try:
        con = psycopg2.connect("host='127.0.0.1' dbname='geoall' user='ga' password='#####'")
        cur = con.cursor()
        cur.execute("UPDATE source SET geoms = ST_SetSRID(ST_MakePoint(lon, lat), 4326);")
        loggen.write("update colonne dbbb  "+str(datetime.datetime.now()))
        loggen.flush()
        cur.close()
        con.close()
    except BaseException as e:
        print("errore db",e)
    loggen.write("ho fatto "+ city +" adesso sono le "+ str(datetime.datetime.now())+" inizio la dormita di 30m \n")
    loggen.flush()
    time.sleep(1800)
citt.close()

#ri ran delle prime 4 fin o a mumbai
