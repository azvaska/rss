import requests
from bs4 import BeautifulSoup
def ParolaAccentata(parola):
	url="https://www.dizionario-italiano.it/dizionario-italiano.php?lemma="+parola
	print(url)
	response = requests.get(url,allow_redirects=False)
	zuppa = BeautifulSoup(response.content, 'html.parser')
	c=zuppa.find_all("small")
	print(c.index(" a|crò|ba|ta "))
	if(c!=None):
		d= c.text.replace("[","")

		return(d.replace("]",""))
	return ""
def accento(parolasill):
	cane=parolasill.find(" / ")
	print(cane)
accento("ca / ne / ")
print(ParolaAccentata("canne"))