import { View } from "@tarojs/components";
import "taro-ui/dist/style/components/progress.scss";
import { AtProgress } from "taro-ui";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import "taro-ui/dist/style/components/flex.scss";
import "./index.scss";

export default () => {
  const [answerCount, setAnswerCount] = useState({ a: 0, b: 0 });
  const answerList = Taro.getStorageSync("answerList");

  useEffect(() => {
    if (answerList) {
      const countA = answerList.reduce(
        (acc: number, item: string) => (item === "A" ? acc + 1 : acc),
        0
      );
      const countB = answerList.reduce(
        (acc: number, item: string) => (item === "B" ? acc + 1 : acc),
        0
      );
      setAnswerCount({ a: countA * 10, b: countB * 10 });
    }
  }, [answerList]);
  return (
    <View className="chart-container">
      <View className="at-row progress">
        <View className="at-col at-col-2 option">选项A</View>
        <AtProgress
          color="#13CE66"
          percent={answerCount.a}
          strokeWidth={20}
          className="option-progress"
        />
      </View>
      <View className="at-row progress">
        <View className="at-col at-col-2 option">选项B</View>
        <AtProgress
          color="#FFC82C"
          percent={answerCount.b}
          strokeWidth={20}
          className="option-progress"
        />
      </View>
    </View>
  );
};
