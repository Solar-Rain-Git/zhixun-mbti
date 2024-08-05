import os
import requests
from bs4 import BeautifulSoup
import urllib3
from urllib.parse import urljoin

# 忽略SSL警告
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# 设置目标URL
url = "https://www.16personalities.com/ch/%E7%B1%BB%E5%9E%8B%E6%8F%8F%E8%BF%B0"

# 设置代理
proxies = {
    "http": "http://127.0.0.1:7890",
    "https": "http://127.0.0.1:7890"
}

# 定义文件名列表
file_names = [
    "icon_url_intj", "icon_url_intp", "icon_url_entj", "icon_url_entp",
    "icon_url_infj", "icon_url_infp", "icon_url_enfj", "icon_url_enfp",
    "icon_url_istj", "icon_url_isfj", "icon_url_estj", "icon_url_esfj",
    "icon_url_istp", "icon_url_isfp", "icon_url_estp", "icon_url_esfp"
]

try:
    # 获取网页内容，使用代理并禁用SSL验证
    response = requests.get(url, proxies=proxies, verify=False)
    response.raise_for_status()  # 检查请求是否成功

    # 使用BeautifulSoup解析HTML
    soup = BeautifulSoup(response.content, "html.parser")

    # 查找所有<img>标签
    imgs = soup.find_all("img")

    # 打印找到的img数量
    print(f"Found {len(imgs)} img tags")

    # 创建保存SVG文件的目录
    os.makedirs("mbti_svgs", exist_ok=True)

    svg_count = 0

    # 遍历所有的<img>标签并保存其中指向的SVG文件，跳过前两个
    for i, img in enumerate(imgs):
        if i < 2:
            continue  # 跳过前两个img标签
        img_src = img.get("src")
        if img_src and img_src.endswith(".svg") and svg_count < len(file_names):
            # 构造完整的URL
            img_url = urljoin(url, img_src)
            # 获取SVG内容
            svg_response = requests.get(img_url, proxies=proxies, verify=False)
            svg_response.raise_for_status()  # 检查请求是否成功

            svg_filename = os.path.join("mbti_svgs", f"{file_names[svg_count]}.svg")
            with open(svg_filename, "wb") as f:
                f.write(svg_response.content)
            print(f"Saved {svg_filename}")
            svg_count += 1

    print("All SVGs have been saved.")

except requests.exceptions.ProxyError as e:
    print("Proxy error:", e)
except requests.exceptions.SSLError as e:
    print("SSL error:", e)
except requests.exceptions.RequestException as e:
    print("Request error:", e)
except Exception as e:
    print("Error:", e)
