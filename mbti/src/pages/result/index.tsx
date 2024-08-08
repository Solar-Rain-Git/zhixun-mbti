import { View, Image } from "@tarojs/components";
import { AtButton, AtModal, AtModalContent } from "taro-ui";
import Taro from "@tarojs/taro";
import { useState } from "react";
import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "taro-ui/dist/style/components/article.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/modal.scss";
import "./index.scss";
import GlobalFooter from "../../components/GlobalFooter";
import logo from "../../assets/logo.svg";
import question_results from "../../data/question_results.json";
import { getBestQuestionResult } from "../../utils/bizUtils";

export default () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  let role = question_results[0];
  const answerList = Taro.getStorageSync("answerList");
  if (!answerList || answerList.length < 1) {
    role = {
      roleCategory: "unknown",
      resultProp: [],
      resultDesc: "未检测答题数据,请回到主页进行性格测试",
      resultPicture: "icon_url_unknown",
      resultName: "神秘人",
    };
  } else {
    role = getBestQuestionResult(answerList);
  }
  // 使用 require.context 动态加载 SVG 图片
  const mbti_svgs = require.context("../../assets/mbti_svgs", false, /\.svg$/);
  // 获取图片路径
  const getImagePath = (imageName: string) => {
    try {
      return mbti_svgs(`./${imageName}.svg`);
    } catch (error) {
      console.error("Image not found:", imageName);
      return "";
    }
  };

  const roleCategories = [
    "analyst",
    "diplomat",
    "watchmen",
    "explorer",
    "unknown",
  ];
  const roleCategoryName = ["分析家", "外交家", "守护者", "探索家", "神秘人"];
  const roleNameColor = ["#88619a", "#33a474", "#4298b4", "#e4ae3a", "#EFF4FC"];
  const roleBgColor = ["#E7DFEA", "#D6ECE3", "#D9EAF0", "#F9EED7", "#27294045"];
  const getRoleParamArray = (paramArray: string[]): string => {
    const index = roleCategories.indexOf(role.roleCategory);
    return index !== -1 ? paramArray[index] : "";
  };

  return (
    <View
      className="resultPage"
      style={{ backgroundColor: getRoleParamArray(roleBgColor) }}
    >
      <View className="result_head">
        <View className="at-article__h2 title">我的性格类型</View>
        <View className="login_icon" onClick={toggleModal}>
          <View className="at-icon at-icon-sketch"></View>
        </View>
      </View>
      <View className="container">
        <View className="roleInfo">
          <View className="roleCategory">
            {getRoleParamArray(roleCategoryName)}
          </View>
          <Image
            src={getImagePath(role.resultPicture)}
            mode="aspectFit"
            className="roleImg"
          />
          <View
            className="at-article__h2 roleName"
            style={{ color: getRoleParamArray(roleNameColor) }}
          >
            {role.resultName}
          </View>
          <View className="at-article__h3 desc">{role.resultDesc}</View>
        </View>
      </View>
      <GlobalFooter hiddenTabBar />
      <AtModal isOpened={showModal} onClose={toggleModal}>
        <AtModalContent>
          <Image src={logo} className="login_logo" />
          <View className="at-article__info login_info">点击再次测试</View>
          <AtButton
            type="primary"
            circle
            className="btn_primary"
            onClick={() => {
              Taro.redirectTo({
                url: "/pages/questions/index",
              });
            }}
          >
            再测一次
          </AtButton>
        </AtModalContent>
      </AtModal>
    </View>
  );
};
