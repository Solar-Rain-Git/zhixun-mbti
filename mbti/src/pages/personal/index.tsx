import { Button, View } from "@tarojs/components";
import { AtList, AtListItem, AtAvatar, AtIcon, AtMessage } from "taro-ui";
import { useEffect, useState } from "react";
import Taro, {
  useDidShow,
  useShareAppMessage,
  useShareTimeline,
} from "@tarojs/taro";
import "taro-ui/dist/style/components/list.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/avatar.scss";
import "taro-ui/dist/style/components/flex.scss";
import "taro-ui/dist/style/components/message.scss";
import "./index.scss";
import GlobalFooter from "../../components/GlobalFooter";
import GlobalVIP from "../../components/GlobalVIP";

export default () => {
  const [showVip, setShowVip] = useState(false);
  let answerList = Taro.getStorageSync("answerList");
  useDidShow(() => {
    answerList = Taro.getStorageSync("answerList");
  });
  const handleToHistory = () => {
    if (!answerList || answerList.length < 1) {
      Taro.atMessage({
        message: "未检测上次答题数据，请重新作答",
        type: "info",
      });
    } else {
      Taro.navigateTo({
        url: "/pages/history/index",
      });
    }
  };

  useEffect(() => {
    Taro.showShareMenu({
      withShareTicket: true,
    });
  }, []);
  useShareAppMessage(() => {
    return {
      title: "快来Solar-MBTI检测你的性格类型",
      path: "/pages/index/index",
    };
  });
  useShareTimeline(() => {
    return {
      title: "快来Solar-MBTI检测你的格类型",
      query: "/pages/index/index",
    };
  });

  return (
    <View className="personalPage">
      <AtList hasBorder={false} className="at-row person_head">
        <AtAvatar image="https://solar.sunrainzc.cn/images/man.jpg"></AtAvatar>
        <AtListItem
          className="at-col at-col-10 person_info"
          title="标题文字"
          hasBorder={false}
          note="普通用户"
          arrow="right"
        />
      </AtList>
      <AtList hasBorder={false}>
        <AtListItem
          title="会员"
          extraText="解锁更多功能"
          arrow="right"
          iconInfo={{ size: 25, color: "#4298B4", value: "sketch" }}
          onClick={() => setShowVip(true)}
        />
        <AtListItem
          title="我的MBTI"
          arrow="right"
          iconInfo={{ size: 25, color: "#4298B4", value: "tag" }}
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/result/index",
            });
          }}
        />
        <AtListItem
          title="上次答题"
          arrow="right"
          iconInfo={{ size: 25, color: "#4298B4", value: "reload" }}
          onClick={handleToHistory}
        />
        <AtListItem
          title="QQ联系"
          extraText="936648031"
          arrow="right"
          hasBorder={false}
          iconInfo={{ size: 25, color: "#4298B4", value: "external-link" }}
        />
      </AtList>
      <Button type="primary" className="share" openType="share">
        <AtIcon value="share" size="20" color="#fff" />
        &nbsp; 分享给朋友
      </Button>
      <AtMessage />
      <GlobalVIP show={showVip} onClose={() => setShowVip(!showVip)} />
      <GlobalFooter current={1} />
    </View>
  );
};
