import { View } from "@tarojs/components";
import { AtFloatLayout, AtIcon } from "taro-ui";
import "taro-ui/dist/style/components/float-layout.scss";
import "./index.scss";

interface GlobalFooterProps {
  show?: boolean;
  onClose?: () => void;
}

export default ({ show, onClose }: GlobalFooterProps) => {
  show = show === undefined ? false : show;
  return (
    <AtFloatLayout isOpened={show} title="开通Solar-MBTI 永久会员" onClose={onClose}>
      <View className="vipInfo" onClick={() => {}}>
        <View className="title">
          <View className="mainTitle">
            <AtIcon value="sketch" size="20" color="#fff" />
            &nbsp;Solar-MBTI 永久会员
          </View>
          <View className="subTitle">
            了解你的性格类型如何在你生活的各个领域中产生影响。
          </View>
        </View>
        <View className="price">￥0.01</View>
      </View>
    </AtFloatLayout>
  );
};
