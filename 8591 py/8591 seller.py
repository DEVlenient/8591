import requests
from bs4 import BeautifulSoup

url = "https://www.8591.com.tw/v3/dashboard?computer=1"
headers = {"User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', 
            "Cookie": 'webp=1; PHPSESSID=1fb282aa3a80696008f87ff8cd8c2f4622c365f7; _fbp=fb.2.1700293174229.323642964; is_support_webp=1; lvl1=default-t8591-www-online-443; deal-piao-toast=1; isExclusiveInfoNote1=1; first_buy=1; login_name=FW123YT; login_encrypt=d7d4f0998cbdaa577028b8e7cc9c135a; _gcl_au=1.1.907197154.1708077169; redirect_url=%2F; _ga_4Z6B2ZGVVG=GS1.1.1711030886.9.0.1711030886.60.0.0; _ga_KH53JFXPJE=GS1.3.1711030887.9.0.1711030887.0.0.0; imei=85a7852a-259d-4633-a6af-8b561be89fb1; __lt__cid=b23c9b2e-d526-480e-aa6a-2049b189d52b; userMenu=%7B%22userInfoMenu%22%3Atrue%2C%22buyerMenu%22%3Atrue%2C%22sellerMenu%22%3Atrue%2C%22hkMenu%22%3Atrue%2C%22managementMenu%22%3Atrue%2C%22membershipMenu%22%3Atrue%2C%22customerMenu%22%3Atrue%2C%22cardColumnMenu%22%3Afalse%7D; history=%5B%7B%22gn%22%3A%22Netflix%22%2C%22gid%22%3A%2237333%22%2C%22sn%22%3A-1%2C%22sid%22%3A-1%2C%22tn%22%3A-1%2C%22tid%22%3A-1%2C%22check%22%3A%2237333--%22%7D%5D; lvl2=https://10.2.133.196:443; __lt__sid=622143e2-e65d773c; _gid=GA1.3.674564235.1714955660; t=d7d4f0998cbdaa577028b8e7cc9c135a; _ga=GA1.1.1405437807.1700293174; abc=R1fl%2F%2BDXzmC0RNKGhMr%2B%2BQ47%2BGzEcvBen4E; v3login=1; _ga_6F806W7CEQ=GS1.1.1714955660.107.1.1714956241.60.0.0; _ga_5G0TRF3C4C=GS1.1.1714955215.115.1.1714956243.58.0.0; _ga_Y1GQYKZVWT=GS1.1.1714955215.114.1.1714956243.58.0.0; __gads=ID=cc22b312b8550d36:T=1700293174:RT=1714956244:S=ALNI_MYgAnI_8XMHlVDYcqAK_ttqQ_9nXg; __gpi=UID=00000c8d06c5f4c6:T=1700293174:RT=1714956244:S=ALNI_MYr-zw5_uKH3GU2XqYlU6kRlcAMQw; __eoi=ID=f163310b4ade5129:T=1707277845:RT=1714956244:S=AA-AfjZ0KPVITFYuKoVXJUGxTX-5'}
dashboard = requests.get(url, headers=headers)
dashboard_soup = BeautifulSoup(dashboard.text, "html.parser")

user_name = dashboard_soup.find("div", class_="user-name")
serial_number = dashboard_soup.find("div", class_="menu-item-range flex align-center space-between pd20")
accountBalance = dashboard_soup.find("div", class_="font-amount")
depositMoney = dashboard_soup.find("div", class_="mt7 a-content-color font500")
print(f"會員名稱：{user_name.text}\n會員編號：{serial_number.text}\n帳戶餘額：{accountBalance.text}\n我的圈存：{depositMoney.text}")

userPublish_url = "https://www.8591.com.tw/userPublish-index.html"
userPublish = requests.get(userPublish_url, headers=headers)
userPublish_soup = BeautifulSoup(userPublish.text, "html.parser")

tab_list = userPublish_soup.find("tr", class_="tab-line")
tab_items = tab_list.find_all("td", class_="tab-item")
items_list = []
for item in tab_items:
    item_text = ''.join([text for text in item.contents if isinstance(text, str)])
    items_list.append(item_text.strip())

products = userPublish_soup.find_all("div", class_="wm_tr clearfix")
products_list = []

for product in products:
    mail_title = product.find_all("div", class_="mall-title")
    for title in mail_title:
        products_list.append(title.text.strip())

print("所有商品的標題：")
for idx, title in enumerate(products_list):
    print(f"{idx + 1}. {title}")

num = int(input("請輸入要查詢的商品的索引：")) - 1
selected_product = products[num]
div_games = selected_product.find_all("div", class_="div_game")
shop_row_two = selected_product.find("div", class_="wm_two wm_pub tableTitle tableLeft shop-row-two")
shop_row_three = selected_product.find("div", class_="wm_three wm_pub tableTitle shop-row-three")
shop_row_four = selected_product.find("div", class_="wm_four wm_pub tableTitle shop-row-four")
shop_row_four = shop_row_four.find("span", class_="ware_number")
shop_row_five = selected_product.find("div", class_="wm_five wm_pub tableTitle shop-row-five")
shop_row_five = shop_row_five.find("p")
shop_row_six = selected_product.find("div", class_="wm_seven wm_pub tableTitle shop-row-six")
shop_row_six = shop_row_six.get_text(strip=True)
if not shop_row_six.strip():
    shop_row_six = "沒有競價"

# 打印對應的標題與內容
for item, content in zip(items_list, [products_list[num], shop_row_two.text, shop_row_three.text, shop_row_four.text.strip(), shop_row_five.text, shop_row_six]):
    print(f"{item}：{content}")

# 打印商品內容
print("商品內容：")
for div_game in div_games:
    print(div_game.get_text(strip=True))