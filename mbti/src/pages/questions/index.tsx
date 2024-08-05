import { View } from "@tarojs/components";
import { AtRadio, AtButton } from "taro-ui";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import "taro-ui/dist/style/components/article.scss";
import "taro-ui/dist/style/components/radio.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/button.scss";
import "./index.scss";
import GlobalFooter from "../../components/GlobalFooter";
import questions from "../../data/questions.json";

export default () => {
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  let [current, setCurrent] = useState<number>(1);
  const [currentAnswer, setCurrentAnswer] = useState<string>();
  const [answerList] = useState<string[]>([]);
  const questionOptions = currentQuestion.options.map((option) => {
    return {
      label: `${option.key}、${option.value}`,
      value: `${option.key}`,
    };
  });

  useEffect(() => {
    setCurrentQuestion(questions[current - 1]);
    setCurrentAnswer(answerList[current - 1]);
  }, [answerList, current]);

  return (
    <View className="questionPage">
      <View className="at-article__h2 title">
        {current}、{currentQuestion.title}
      </View>
      <AtRadio
        options={questionOptions}
        value={currentAnswer}
        onClick={(value) => {
          setCurrentAnswer(value);
          answerList[current - 1] = value;
        }}
      />
      <View className="do_btn">
        {current > 1 && (
          <AtButton
            circle
            className="control_btn"
            onClick={() => {
              setCurrent(--current);
            }}
          >
            上一题
          </AtButton>
        )}
        {current < questions.length && (
          <AtButton
            type="primary"
            circle
            className="control_btn btn_primary"
            disabled={!currentAnswer}
            onClick={() => {
              setCurrent(++current);
            }}
          >
            下一题
          </AtButton>
        )}
        {current === questions.length && (
          <AtButton
            type="primary"
            circle
            className="control_btn btn_primary"
            disabled={!currentAnswer}
            onClick={() => {
              Taro.redirectTo({
                url: "/pages/result/index",
              });
            }}
          >
            查看结果
          </AtButton>
        )}
      </View>
      <GlobalFooter />
    </View>
  );
};
