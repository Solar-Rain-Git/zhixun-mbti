import { Image, View } from "@tarojs/components";
import {
  AtRadio,
  AtButton,
  AtProgress,
  AtTag,
  AtDivider,
  AtBadge,
} from "taro-ui";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import "taro-ui/dist/style/components/article.scss";
import "taro-ui/dist/style/components/radio.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/progress.scss";
import "taro-ui/dist/style/components/tag.scss";
import "taro-ui/dist/style/components/flex.scss";
import "taro-ui/dist/style/components/divider.scss";
import "taro-ui/dist/style/components/badge.scss";
import "./index.scss";
import questions from "../../data/questions.json";
import questionHeader from "../../assets/question-header.svg";

export default () => {
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [progress, setProgress] = useState(0);
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
      <View className="questionPageHead">
        <View className="tip">
          <Image
            className="tip_img"
            mode="heightFix"
            src={questionHeader}
          ></Image>
          <View className="at-article__h3 tip_text">
            做你自己，诚实回答，找出你的性格。
          </View>
        </View>
      </View>
      <AtDivider content="问题选项" fontColor="#88619A" lineColor="#88619A" />
      <AtProgress
        percent={progress}
        status={progress === 100 ? "success" : "progress"}
        strokeWidth={10}
        className="progress"
      />
      <View className="at-article__h2 title">
        {current}、{currentQuestion.title}
      </View>
      <AtRadio
        options={questionOptions}
        value={currentAnswer}
        onClick={(value) => {
          setCurrentAnswer(value);
          answerList[current - 1] = value;
          !currentAnswer && setProgress(progress + 100 / questions.length);
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
            disabled={progress !== 100}
            onClick={() => {
              Taro.setStorageSync("answerList", answerList);
              Taro.redirectTo({
                url: "/pages/result/index",
              });
            }}
          >
            查看结果
          </AtButton>
        )}
      </View>
      <View className="at-article__info answer">我的回答</View>
      <View className="allAsk">
        {questions.map((e, index) => (
          <AtBadge dot={!answerList[index]} key={index}>
            <AtTag
              key={index}
              name={e.title}
              className={index + 1 === current ? "ask currentAsk" : "ask"}
              circle
              onClick={() => {
                setCurrent(index + 1);
              }}
            >
              {`${index + 1} ${answerList[index]}`}
            </AtTag>
          </AtBadge>
        ))}
      </View>
    </View>
  );
};
