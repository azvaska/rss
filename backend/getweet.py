import tweepy
from tweepy import OAuthHandler
from tweepy import Stream
from tweepy.streaming import StreamListener
import json
import psycopg2
consumer_key="#"
consumer_secret="#"
access_token="#"
access_secret="#"
auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_secret)
api = tweepy.API(auth)



try:
    con = psycopg2.connect("host='####' dbname='geoall' user='ga' password='###'")
    con.autocommit = True 
except BaseException as error:
    print('An exception occurred: {}'.format(error))
    print ("Cannot connect to db")
    exit(1)
cur = con.cursor()
with open("python.json","r") as f:
    dati=json.load(f)
    n=15
    for id in dati:
        #print(str(id['id']))
        dato=api.get_status(id['id'])
        try:
            cur.execute("Insert into source (id,idtype,nome,lat,lon,url) VALUES ("+str(n)+",2,"+"'"+str(dato.text)+"'"+","+str(id['loc'][0])+","+str(id['loc'][1])+","+"'"+str(id['url'])+"'"+")")
            n+=1
        except:
            continue
        

tweets=api.search(q="*",geocode="42.545796,12.882475,1000km",count=1000)
print(len(tweets))
for tweet in tweets:
        if tweet.geo:  
            print (tweet.id)
            print (tweet.geo)
            print (tweet.text) 
        #