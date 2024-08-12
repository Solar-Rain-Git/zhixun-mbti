import { Button, View } from "@tarojs/components";
import {
  AtList,
  AtListItem,
  AtAvatar,
  AtIcon,
  AtMessage,
  AtActionSheet,
  AtActionSheetItem,
} from "taro-ui";
import { useEffect, useState } from "react";
import Taro, {
  useDidShow,
  useShareAppMessage,
  useShareTimeline,
} from "@tarojs/taro";
import { useDispatch, useSelector } from "react-redux";
import "taro-ui/dist/style/components/list.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/avatar.scss";
import "taro-ui/dist/style/components/flex.scss";
import "taro-ui/dist/style/components/message.scss";
import "taro-ui/dist/style/components/action-sheet.scss";
import "./index.scss";
import GlobalFooter from "../../components/GlobalFooter";
import GlobalVIP from "../../components/GlobalVIP";
import { DefaultAvatar } from "../../utils/bizUtils";
import { userState } from "../../reduxStore/userStore/userType";
import { logout } from "../../reduxStore/userStore";

export default () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: userState) => state.user.isLoggedIn);
  const currentUserInfo = useSelector(
    (state: userState) => state.user.userInfo
  );
  const [showVip, setShowVip] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  let answerList = Taro.getStorageSync("answerList");
  useDidShow(() => {
    answerList = Taro.getStorageSync("answerList");
  });
  const handleToHistory = () => {
    if (isLoggedIn) {
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
    } else {
      Taro.showToast({
        title: "请先填写用户信息",
        icon: "none",
        duration: 2000,
      });
    }
  };

  const handleQuit = (flag: boolean) => {
    if (isLoggedIn) {
      flag ? Taro.clearStorageSync() : Taro.removeStorageSync("userInfo");
      Taro.showToast({
        title: "已退出",
        icon: "none",
        duration: 2000,
      });
      dispatch(logout());
      return;
    }
    Taro.showToast({
      title: "未填写用户信息，退出无效",
      icon: "none",
      duration: 2000,
    });
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
        <AtAvatar
          image={currentUserInfo ? currentUserInfo.avatar : DefaultAvatar}
        />
        <AtListItem
          className="at-col at-col-10 person_info"
          title={currentUserInfo ? currentUserInfo.nickname : "填写用户信息"}
          hasBorder={false}
          note="普通用户"
          extraText="进入"
          arrow="right"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/updateUserInfo/index",
            });
          }}
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
            isLoggedIn
              ? Taro.navigateTo({
                  url: "/pages/result/index",
                })
              : Taro.showToast({
                  title: "请先填写用户信息",
                  icon: "none",
                  duration: 2000,
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
          iconInfo={{ size: 25, color: "#4298B4", value: "external-link" }}
        />
        <AtListItem
          title="设置"
          hasBorder={false}
          iconInfo={{ size: 25, color: "#4298B4", value: "settings" }}
          onClick={() => setShowSetting(!showSetting)}
        />
      </AtList>
      <Button type="primary" className="share" openType="share">
        <AtIcon value="share" size="20" color="#fff" />
        &nbsp; 分享给朋友
      </Button>
      <AtMessage />
      <AtActionSheet
        cancelText="取消"
        isOpened={showSetting}
        onClose={() => setShowSetting(!showSetting)}
      >
        <AtActionSheetItem onClick={() => handleQuit(true)} className="quit">
          退出并清除数据
        </AtActionSheetItem>
        <AtActionSheetItem onClick={() => handleQuit(false)}>
          仅退出
        </AtActionSheetItem>
      </AtActionSheet>
      <GlobalVIP show={showVip} onClose={() => setShowVip(!showVip)} />
      <GlobalFooter current={1} />
    </View>
  );
};
