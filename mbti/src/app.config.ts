export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/questions/index",
    "pages/result/index",
    "pages/personal/index",
    "pages/history/index",
    "pages/updateUserInfo/index",
  ],
  tabBar: {
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
      },
      {
        pagePath: "pages/personal/index",
        text: "我的",
      },
    ],
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "智讯MBTI 性格测试",
    navigationBarTextStyle: "black",
  },
});
