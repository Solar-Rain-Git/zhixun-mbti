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

export default () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <View className="index_page">
      <View className="index_head">
        <Image src={logo} className="index_logo" mode="widthFix"></Image>
        <View className="index_icon" onClick={toggleModal}>
          <View className="at-icon at-icon-sketch"></View>
        </View>
      </View>
      <View className="container">
        <View className="at-article__h1 title">“终于被理解的感觉真好”</View>
        <View className="at-article__h2 subtitle">
          只需10分钟，就能“惊人般准确”地描述出你是谁，以及你为何以这样的方式行事。
        </View>
        <AtButton
          type="primary"
          circle
          className="btn_primary btn_join"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/questions/index",
            });
          }}
        >
          参加测试
        </AtButton>
      </View>
      <GlobalFooter />
      <AtModal isOpened={showModal} onClose={toggleModal}>
        <AtModalContent>
          <Image src={logo} className="login_logo" />
          <View className="at-article__info login_info">登陆后可继续当前操作</View>
          <AtButton type="primary" circle className="btn_primary">
            微信手机号 一键登录
          </AtButton>
        </AtModalContent>
      </AtModal>
    </View>
  );
};
