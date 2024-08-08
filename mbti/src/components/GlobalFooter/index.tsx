import { Image, View } from "@tarojs/components";
import { useEffect } from "react";
import Taro, { getCurrentPages, hideTabBar } from "@tarojs/taro";
import { AtTabBar } from "taro-ui";
import "taro-ui/dist/style/components/tab-bar.scss";
import "taro-ui/dist/style/components/badge.scss";
import "./index.scss";
import footer_picture from "../../assets/header-mountains-mobile.svg";

interface GlobalFooterProps {
  current?: number;
  hiddenTabBar?: boolean;
}

export default ({ current, hiddenTabBar }: GlobalFooterProps) => {
  // 如果current为undefined，则设置为默认值0
  current = current !== undefined ? current : 0;
  useEffect(() => {
    // 检查当前页面是否是 tabBar 页面
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const route = currentPage.route;
    const tabBarPages = ["/pages/index/index", "/pages/personal/index"]; // 根据你的配置文件更新这些路径
    if (tabBarPages.includes(`/${route}`)) {
      hideTabBar(); // 只有在 tabBar 页中调用
    }
  }, []);
  return (
    <View className="global_footer">
      <Image src={footer_picture} className="footer_picture" mode="widthFix" />
      <View className="at-article__info copyright">Author: Solar-Rain</View>
      <AtTabBar
        className={hiddenTabBar ? "hiddenTabBar" : ""}
        selectedColor="#4298B4"
        color="#282828"
        backgroundColor="#ECF4F7"
        tabList={[
          { title: "主页", iconType: "home" },
          { title: "我的", iconType: "user" },
        ]}
        current={current}
        onClick={(index) => {
          Taro.switchTab({
            url: index === 0 ? "/pages/index/index" : "/pages/personal/index",
          });
        }}
      />
    </View>
  );
};
