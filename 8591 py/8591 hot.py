import urllib.request as req
import json

url = "https://ber.8591.com.tw/game/hot?t=1715423469"
headers = {
    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}
response = req.urlopen(req.Request(url, headers=headers))
json_data = response.read()
json_data = json.loads(json_data)

games = json_data["games"]  # 獲取遊戲列表
for game in games:
    print(f"編號：{game["id"]}, 遊戲：{game["name"]}, 類型：{game["type"]}")