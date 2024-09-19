
import timeit
code_to_test = """
import psycopg2
import json
con = psycopg2.connect("host='127.0.0.1' dbname='geoall' user='ga' password='####'")
cur = con.cursor()
cur.execute("SELECT id,idtype,lat,lon FROM source where not idtype=3")
rows = cur.fetchall()
data = []
for i in range(len(rows)):
        data.append({"id":rows[i][0],"idtype":rows[i][1],"latitudine":rows[i][2],"longitudine":rows[i][3]})
data= json.dumps(data)
cur.close()
"""
elapsed_time = timeit.timeit(code_to_test, number=10)
code_to_test1 = """
import psycopg2
con = psycopg2.connect("host='127.0.0.1' dbname='geoall' user='ga' password='####'")
cur = con.cursor()
cur.execute("SELECT id,idtype,lat,lon FROM source where not idtype=3")
rows = cur.fetchall()
data="["
for i in rows:
        data +='{"id":'+str(i[0])+',"idtype":'+ str(i[1])+',"latitudine":'+str(i[2])+',"longitudine":'+str(i[3])+'}'
        if(i != (len(rows)-1)):
                data+=","
data +="]"
cur.close()
"""
elapsed_time1 = timeit.timeit(code_to_test1, number=10)
print(elapsed_time,elapsed_time1,-elapsed_time+elapsed_time1)