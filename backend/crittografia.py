from base64 import b64encode
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from Crypto.Random import get_random_bytes
data='{"id": 1246197920187273223, "loc": [30.113288, -95.363382], "url": "https://t.co/VbIbATN1tF"}'.encode()
key = get_random_bytes(16)
cipher = AES.new(key, AES.MODE_CBC)
ct_bytes = cipher.encrypt(pad(data, AES.block_size))
print("chiave:",key,"iv:",cipher.iv,"ct:",ct_bytes)

iv = b64encode(cipher.iv).decode('utf-8')
ct = b64encode(ct_bytes).decode('utf-8')
key=b64encode(key).decode('utf-8')
print(key,iv,ct)