import os
import math
from matplotlib import pyplot as plt
lat1= []
lat2 = []
for i in range(0,10000):
    ragg = ((int.from_bytes(os.urandom(8), byteorder="big") / ((1 << 64) -1))) * 1.7
    angle = ((int.from_bytes(os.urandom(8), byteorder="big") / ((1 << 64) -1))) * math.pi * 2
    lat = math.sin(angle) * ragg
    lng= math.cos(angle) * ragg 
    lat += 40.6943
    lng += -73.9249
    lat1.append(lat)
    lat2.append(lng)
    print(lat,lng)

print(lat1,lat2)
plt.scatter(lat1,lat2)
plt.xlabel("lat")
plt.ylabel("lng")
plt.title('Tan wave')
plt.show()
print(lat,lng)