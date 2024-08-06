import questions from "../data/questions.json";
import question_results from "../data/question_results.json";

/**
 * 获取最佳题目评分结果
 * @param answerList
 */
export function getBestQuestionResult(answerList: string[]) {
  // 初始化一个对象，用于存储每个选项的计数
  const optionCount = {};

  // 遍历题目列表
  for (const question of questions) {
    // 遍历答案列表
    for (const answer of answerList) {
      // 遍历题目中的选项
      for (const option of question.options) {
        // 如果答案和选项的key匹配
        if (option.key === answer) {
          // 获取选项的result属性
          const result = option.result;

          // 如果result属性不在optionCount中，初始化为0
          if (!optionCount[result]) {
            optionCount[result] = 0;
          }

          // 在optionCount中增加计数
          optionCount[result]++;
        }
      }
    }
  }

  // 初始化最高分数和最高分数对应的评分结果
  let maxScore = 0;
  let maxScoreResult = question_results[0];

  // 遍历评分结果列表
  for (const result of question_results) {
    // 计算当前评分结果的分数
    const score = result.resultProp.reduce((count, prop) => {
      return count + (optionCount[prop] || 0);
    }, 0);

    // 如果分数高于当前最高分数，更新最高分数和最高分数对应的评分结果
    if (score > maxScore) {
      maxScore = score;
      maxScoreResult = result;
    }
  }

  // 返回最高分数和最高分数对应的评分结果
  return maxScoreResult;
}
