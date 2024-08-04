import { Image, View } from "@tarojs/components";
import "./index.scss";
import footer_picture from "../../assets/header-mountains-mobile.svg";

export default () => {
  return (
    <View className="global_footer">
      <Image src={footer_picture} className="footer_picture" mode="aspectFill" />
      <View className="at-article__info copyright">Author: Solar-Rain</View>
    </View>
  );
};
