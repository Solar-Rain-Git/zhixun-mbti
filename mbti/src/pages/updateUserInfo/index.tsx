import { Button, Input, View } from "@tarojs/components";
import { useSelector, useDispatch } from "react-redux";
import { AtAvatar } from "taro-ui";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/avatar.scss";
import "taro-ui/dist/style/components/input.scss";
import "taro-ui/dist/style/components/article.scss";
import "./index.scss";
import { userState } from "../../reduxStore/userStore/userType";
import { DefaultAvatar } from "../../utils/bizUtils";
import { login } from "../../reduxStore/userStore";

export default () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: userState) => state.user.isLoggedIn);
  const currentUserInfo = useSelector(
    (state: userState) => state.user.userInfo
  );

  const [avatar, setAvatar] = useState<string>(DefaultAvatar);
  const [name, setName] = useState<string>("");

  // 使用 useEffect 来同步当前用户信息到本地状态
  useEffect(() => {
    if (isLoggedIn && currentUserInfo) {
      setAvatar(currentUserInfo.avatar);
      setName(currentUserInfo.nickname);
    }
  }, [isLoggedIn, currentUserInfo]);

  // 处理选择头像的事件
  const handleChooseAvatar = (e) => {
    const { avatarUrl } = e.detail;
    setAvatar(avatarUrl);
  };

  // 处理昵称输入框失焦事件
  const handleNameBlur = (e) => {
    const { value } = e.detail;
    setName(value);
  };

  // 保存按钮点击事件处理
  const handleSave = () => {
    const isEmpty = (value: string | null) =>
      value === null || value.trim() === "";
    if (isEmpty(avatar) || isEmpty(name)) {
      Taro.showToast({
        title: "请录入完整的昵称和头像",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    // 更新用户信息到 Redux store
    dispatch(login({ avatar: avatar, nickname: name }));
    Taro.setStorageSync("userInfo", { avatar: avatar, nickname: name });
    Taro.showToast({
      title: "保存成功",
      icon: "success",
      duration: 2000,
    });
  };

  return (
    <View className="updatePersonalPage">
      <View className="avatar">
        <Button
          className="avatar-wrapper"
          openType="chooseAvatar"
          onChooseAvatar={handleChooseAvatar}
        >
          <AtAvatar size="large" image={avatar} />
        </Button>
        <View className="at-article__info avatarInfo">点击修改头像</View>
      </View>
      <View className="nickInput">
        <View className="nickInfo">昵称</View>
        <Input
          type="nickname"
          className="input"
          placeholder="请输入昵称"
          value={name}
          onBlur={handleNameBlur}
        />
      </View>
      <Button type="primary" className="save" onClick={handleSave}>
        保存
      </Button>
    </View>
  );
};
