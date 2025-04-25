import requests
import hashlib
from passlib.hash import md5_crypt
import xml.etree.ElementTree as ET

email = input("Zadej svůj e-mail: ")
password_plain = input("Zadej své heslo: ")

# 1. Získání soli
salt_url = "https://webshare.cz/api/salt/"
salt_response = requests.post(
    salt_url,
    data={"username_or_email": email},
    headers={
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "text/xml; charset=UTF-8"
    }
)

salt_xml = ET.fromstring(salt_response.text)
salt_status = salt_xml.find("status").text

if salt_status != "OK":
    print("❌ Chyba při získávání soli:", salt_response.text)
    exit()

salt_value = salt_xml.find("salt").text

# 2. Generování SHA1(MD5_CRYPT)
md5_output = md5_crypt.using(salt=salt_value).hash(password_plain)
sha1_output = hashlib.sha1(md5_output.encode()).hexdigest()

# 3. Přihlášení
login_url = "https://webshare.cz/api/login/"
login_payload = {
    "username_or_email": email,
    "password": sha1_output,
    "keep_logged_in": 1
}

login_response = requests.post(
    login_url,
    data=login_payload,
    headers={
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "text/xml; charset=UTF-8"
    }
)

login_xml = ET.fromstring(login_response.text)
login_status = login_xml.find("status").text

if login_status != "OK":
    print("❌ Chyba při přihlašování:", login_response.text)
    exit()

token = login_xml.find("token").text
print(f"✅ Token: {token}")

# 4. Uložení do .env souboru
with open(".env", "w") as f:
    f.write(f"WST={token}\n")

print("💾 Token uložen do .env souboru.")