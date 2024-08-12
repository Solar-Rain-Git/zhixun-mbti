import { Image, View } from "@tarojs/components";
import { AtRadio, AtDivider } from "taro-ui";
import Taro, {useDidShow} from "@tarojs/taro";
import "taro-ui/dist/style/components/article.scss";
import "taro-ui/dist/style/components/radio.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/divider.scss";
import "./index.scss";
import questions from "../../data/questions.json";
import questionHeader from "../../assets/question-history.svg";
import GlobalChart from "../../components/GlobalChart";

export default () => {
  let answerList = Taro.getStorageSync("answerList");
  useDidShow(() => {
    answerList = Taro.getStorageSync("answerList");
  });
  let current = 1;
  return (
    <View className="questionPage">
      <View className="questionPageHead">
        <View className="tip">
          <Image
            className="tip_img"
            mode="heightFix"
            src={questionHeader}
          ></Image>
          <View className="at-article__h3 tip_text">
            别沉寂过去，塑造你想要的自我。
          </View>
        </View>
      </View>
      <AtDivider
        content="上次答题记录"
        fontColor="#88619A"
        lineColor="#88619A"
      />
      <GlobalChart />
      {questions.map((e, i) => (
        <View className="option" key={i}>
          <View className="at-article__h2 title" key={i}>
            {current++}、{e.title}
          </View>
          <AtRadio
            key={i}
            options={e.options.map((option) => {
              return {
                label: `${option.key}、${option.value}`,
                value: `${option.key}`,
              };
            })}
            value={answerList[i]}
            onClick={() => {}}
          />
        </View>
      ))}
    </View>
  );
};
