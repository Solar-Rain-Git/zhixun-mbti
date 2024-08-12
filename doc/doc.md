## MBTI 性格测试小程序

## 一、MBTI 性格测试应用介绍

参考项目：https://www.16personalities.com/ch

通过使用别人的项目，学习了解完整的业务流程。

（1）主页：

![img](https://pic.yupi.icu/1285/1714979457269-1ed676e4-f9d3-4e4c-865f-db9d44392bdc.png)

（2）答题页面：

![img](https://pic.yupi.icu/1285/1714979539447-ace5e170-894b-4cde-936e-ab8de4f5dc13.png)

![img](https://pic.yupi.icu/1285/1714979567357-81e73c00-cd0c-4374-81b8-6387f3140eaf.png)

（3）查看结果页面：

![img](https://pic.yupi.icu/1285/1714979592089-7ce19fdf-5865-4b2d-b7f5-c6dccac585b4.png)

![img](https://pic.yupi.icu/1285/1714979602845-e1ad7caf-b0a8-4b62-9fce-56828c454a93.png)

![img](https://pic.yupi.icu/1285/1714979634289-0585ccae-767b-4522-b9a9-345c9172d77b.png)

## 二、MBTI 实现方案介绍

核心组成部分：题目、用户答案、评分规则

### 1、题目结构

暂时用 JSON 表示结构，便于理解，result 代表题目对应的结果（后面会讲）：

```json
[
    {
        "title": "你通常更喜欢",
        "options": [
            {
                "result": "I",
                "value": "独自工作",
                "key": "A"
            },
            {
                "result": "E",
                "value": "与他人合作",
                "key": "B"
            }
        ]
    }
]
```

优点：更灵活、排序

相比于拿选项作为 key，结构更清晰，更易于理解和扩展，前后端都可以声明类型；缺点就是占用空间，可以进行预处理。

### 2、用户答案结构

用户提交答案的时候，仅需传递一个数组，数组内是选项：` ["A"]`，按数组顺序匹配对应的题目。

优点：不用再完整传递题目的结构，节省传输体积，提高性能。

```json
["A","A","A","B","A","A","A","B","B","A"]
```

### 3、评分规则

#### MBTI 评分原理讲解

根据维基百科介绍，MBTI 全称是迈尔斯-布里格斯类型指标（英语：Myers-Briggs Type Indicator，简称MBTI）

参考：[https://zh.wikipedia.org/wiki/邁爾斯-布里格斯性格分類法](https://zh.wikipedia.org/wiki/邁爾斯-布里格斯性格分類法)

4 个对立组合，共 16 种结果：

![img](https://pic.yupi.icu/1285/1715046546067-58fb9480-4d8d-473c-b5aa-6ba2e6f153c6.png)

![img](https://pic.yupi.icu/1285/1715046526505-53fbd985-3fa8-4248-9838-93d9690b6833.png)

每道题目都是为四个组合的其中之一设定，为了判断这个人属于组合里的哪个偏好。

比如这一题，为了判断是 I 人还是 E 人（result 字段）：

```json
[
    {
        "title": "你通常更喜欢",
        "options": [
            {
                "result": "I",
                "value": "独自工作",
                "key": "A"
            },
            {
                "result": "E",
                "value": "与他人合作",
                "key": "B"
            }
        ]
    }
]
```

按照这个思路，我们可以统计题目中所有的偏好，比如答题一共选了 10 个 I，2 个 E，很明显 10 大于 2，因此我们得出他是 I 人，同理可判断是 S / N、T / F 和 J/P

所以我们出题的时候，给每个选择的答案对应设置一个 **属性**。简单举例，比如

- 第一题 A 对应 I，B 对应 E
- 第二题 A 对应 E，B 对应 I
- 第三题 A 对应 S, B 对应 N
- 第四题 A 对应 T, B 对应 F
- 第五题 A 对应 P, B 对应 J

那么如果用户选择了 [A,B,A,A,A]，可以算出用户有两个 I，一个 S ，一个 T 一个 P，很明显他是 ISTP 人格。

评分思路应该清晰了，怎么实现呢？

#### 评分结果计算原理

1）首先要有一个题目评分结果集合，这里预先创建了很多结果，包括了 MBTI 的所有 16 种角色。

- resultName：ISTJ
- resultDesc：忠诚可靠，被公认为务实，注重细节。
- resultIcon：预留字段，如果想界面好看点，可以给 result 设定图片
- resultProp：[I,S,T,J]

![img](https://pic.yupi.icu/1285/1714989020474-15ea45c5-5edf-46db-b58a-ad0b4a12d1b9.png)

题目评分结果对应的 JSON 结构如下：

```json
[
  {
    "resultProp": ["I","S","T","J"],
    "resultDesc": "忠诚可靠，被公认为务实，注重细节。",
    "resultPicture": "icon_url_istj",
    "resultName": "ISTJ（物流师）"
  },
  {
    "resultProp": ["I","S","F","J"],
    "resultDesc": "善良贴心，以同情心和责任为特点。",
    "resultPicture": "icon_url_isfj",
    "resultName": "ISFJ（守护者）"
  }
]
```

2）怎么根据每道题目的选项计算出结果呢？

每个结果有一个 resultProp 字段，是一个元素不重复的数组（属性集合），里面的内容和题目选项的 result 字段匹配。

```json
[
    {
        "title": "你通常更喜欢",
        "options": [
            {
                "result": "I",
                "value": "独自工作",
                "key": "A"
            },
            {
                "result": "E",
                "value": "与他人合作",
                "key": "B"
            }
        ]
    }
]
```

此时用户第一题选了 A， 对应的属性如果是 I，那么我们遍历这 16 种结果，然后判断角色对应的 resultProp 里面是否包含 I , 如果包含则对应的角色就 +1 分，不包含则不得分。

最终遍历完所有题目后，我们就能知道这 16 种结果中，哪个角色得分最高，它就是最终的评分结果了。

## 三、MBTI 小程序 Demo 数据

### 1、题目列表

每个选项包含了对应的结果，questions.json：

```json
[
    {
        "options": [
            {
                "result": "I",
                "value": "独自工作",
                "key": "A"
            },
            {
                "result": "E",
                "value": "与他人合作",
                "key": "B"
            }
        ],
        "title": "你通常更喜欢"
    },
    {
        "options": [
            {
                "result": "J",
                "value": "喜欢有明确的计划",
                "key": "A"
            },
            {
                "result": "P",
                "value": "更愿意随机应变",
                "key": "B"
            }
        ],
        "title": "当安排活动时"
    },
    {
        "options": [
            {
                "result": "T",
                "value": "认为应该严格遵守",
                "key": "A"
            },
            {
                "result": "F",
                "value": "认为应灵活运用",
                "key": "B"
            }
        ],
        "title": "你如何看待规则"
    },
    {
        "options": [
            {
                "result": "E",
                "value": "经常是说话的人",
                "key": "A"
            },
            {
                "result": "I",
                "value": "更倾向于倾听",
                "key": "B"
            }
        ],
        "title": "在社交场合中"
    },
    {
        "options": [
            {
                "result": "J",
                "value": "先研究再行动",
                "key": "A"
            },
            {
                "result": "P",
                "value": "边做边学习",
                "key": "B"
            }
        ],
        "title": "面对新的挑战"
    },
    {
        "options": [
            {
                "result": "S",
                "value": "注重细节和事实",
                "key": "A"
            },
            {
                "result": "N",
                "value": "注重概念和想象",
                "key": "B"
            }
        ],
        "title": "在日常生活中"
    },
    {
        "options": [
            {
                "result": "T",
                "value": "更多基于逻辑分析",
                "key": "A"
            },
            {
                "result": "F",
                "value": "更多基于个人情感",
                "key": "B"
            }
        ],
        "title": "做决定时"
    },
    {
        "options": [
            {
                "result": "S",
                "value": "喜欢有结构和常规",
                "key": "A"
            },
            {
                "result": "N",
                "value": "喜欢自由和灵活性",
                "key": "B"
            }
        ],
        "title": "对于日常安排"
    },
    {
        "options": [
            {
                "result": "P",
                "value": "首先考虑可能性",
                "key": "A"
            },
            {
                "result": "J",
                "value": "首先考虑后果",
                "key": "B"
            }
        ],
        "title": "当遇到问题时"
    },
    {
        "options": [
            {
                "result": "T",
                "value": "时间是一种宝贵的资源",
                "key": "A"
            },
            {
                "result": "F",
                "value": "时间是相对灵活的概念",
                "key": "B"
            }
        ],
        "title": "你如何看待时间"
    }
]
```

### 2、题目结果表

question_results.json：

```json
[
  {
    "resultProp": ["I", "S", "T", "J"],
    "resultDesc": "忠诚可靠，被公认为务实，注重细节。",
    "resultPicture": "icon_url_istj",
    "resultName": "ISTJ（物流师）"
  },
  {
    "resultProp": ["I", "S", "F", "J"],
    "resultDesc": "善良贴心，以同情心和责任为特点。",
    "resultPicture": "icon_url_isfj",
    "resultName": "ISFJ（守护者）"
  },
  {
    "resultProp": ["I", "N", "F", "J"],
    "resultDesc": "理想主义者，有着深刻的洞察力，善于理解他人。",
    "resultPicture": "icon_url_infj",
    "resultName": "INFJ（占有者）"
  },
  {
    "resultProp": ["I", "N", "T", "J"],
    "resultDesc": "独立思考者，善于规划和实现目标，理性而果断。",
    "resultPicture": "icon_url_intj",
    "resultName": "INTJ（设计师）"
  },
  {
    "resultProp": ["I", "S", "T", "P"],
    "resultDesc": "冷静自持，善于解决问题，擅长实践技能。",
    "resultPicture": "icon_url_istp",
    "resultName": "ISTP（运动员）"
  },
  {
    "resultProp": ["I", "S", "F", "P"],
    "resultDesc": "具有艺术感和敏感性，珍视个人空间和自由。",
    "resultPicture": "icon_url_isfp",
    "resultName": "ISFP（艺术家）"
  },
  {
    "resultProp": ["I", "N", "F", "P"],
    "resultDesc": "理想主义者，富有创造力，以同情心和理解他人著称。",
    "resultPicture": "icon_url_infp",
    "resultName": "INFP（治愈者）"
  },
  {
    "resultProp": ["I", "N", "T", "P"],
    "resultDesc": "思维清晰，探索精神，独立思考且理性。",
    "resultPicture": "icon_url_intp",
    "resultName": "INTP（学者）"
  },
  {
    "resultProp": ["E", "S", "T", "P"],
    "resultDesc": "敢于冒险，乐于冒险，思维敏捷，行动果断。",
    "resultPicture": "icon_url_estp",
    "resultName": "ESTP（拓荒者）"
  },
  {
    "resultProp": ["E", "S", "F", "P"],
    "resultDesc": "热情开朗，善于社交，热爱生活，乐于助人。",
    "resultPicture": "icon_url_esfp",
    "resultName": "ESFP（表演者）"
  },
  {
    "resultProp": ["E", "N", "F", "P"],
    "resultDesc": "富有想象力，充满热情，善于激发他人的活力和潜力。",
    "resultPicture": "icon_url_enfp",
    "resultName": "ENFP（倡导者）"
  },
  {
    "resultProp": ["E", "N", "T", "P"],
    "resultDesc": "充满创造力，善于辩论，挑战传统，喜欢探索新领域。",
    "resultPicture": "icon_url_entp",
    "resultName": "ENTP（发明家）"
  },
  {
    "resultProp": ["E", "S", "T", "J"],
    "resultDesc": "务实果断，善于组织和管理，重视效率和目标。",
    "resultPicture": "icon_url_estj",
    "resultName": "ESTJ（主管）"
  },
  {
    "resultProp": ["E", "S", "F", "J"],
    "resultDesc": "友善热心，以协调、耐心和关怀为特点，善于团队合作。",
    "resultPicture": "icon_url_esfj",
    "resultName": "ESFJ（尽责者）"
  },
  {
    "resultProp": ["E", "N", "F", "J"],
    "resultDesc": "热情关爱，善于帮助他人，具有领导力和社交能力。",
    "resultPicture": "icon_url_enfj",
    "resultName": "ENFJ（教导者）"
  },
  {
    "resultProp": ["E", "N", "T", "J"],
    "resultDesc": "果断自信，具有领导才能，善于规划和执行目标。",
    "resultPicture": "icon_url_entj",
    "resultName": "ENTJ（统帅）"
  }
]
```

## 四、Taro 跨端小程序开发入门

### 为什么要开发小程序？

小程序开发的优点：

1）基于微信的生态，易于传播和分享的

2）不用让用户下载 APP，打开快速

小程序开发的体验和网页开发基本是一致的，都具有在线热更新、调试、版本兼容、打包上线。

小程序开发的真正痛点：可能有一些权限或功能必须要企业号。

### 技术选型

Taro 官方文档：https://taro-docs.jd.com/docs/ （跨端开发框架）

Taro UI 组件库

React

TypeScript

做项目一定要选用一个组件库，提高开发效率！

推荐和 Taro 官方框架兼容的组件库，否则会出现跨端后样式丢失的问题：

- taro-ui：https://taro-ui.jd.com/#/ （最推荐，兼容性最好）
- nut-ui

### 开发准备

微信开发者工具下载：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

微信开发者工具介绍

### 入门指南

#### 项目初始化

项目初始化（可以看 b 站的视频）：https://www.bilibili.com/video/BV1vM4m1R7K3

参考小程序开发指南：[小程序开发指南 2024-03-27](https://www.code-nav.cn/course/1788871761736998913/section/1798333637799387138?contentType=text&type=)

去看官方的快速入门文档，注意不要选择太新的版本：https://taro-docs.jd.com/docs/GETTING-STARTED

Taro 版本：此处选择 3.x 版本

node.js >= 16，我这里是 

npm >= 8，我这里是 6.14.8

```sh
npm install -g @tarojs/cli@3.6.28
```

新建项目根目录MBTI-miniProject，初始化 Git 项目：

按照官方文档，执行命令，初始化项目：

```shell
taro init mbti
```

![img](https://pic.yupi.icu/1285/1714987720049-2b490a14-84b6-484c-9264-c9cbd64fcb09.png)

模板选择：

- 没什么需求：就用默认
- 如果要用官方推荐的组件库 taro-ui：就用 taro-ui 模板（推荐）
- 如果是前端同学，不想自己搭后端，云开发：就用wxcloud 云开发模板

#### 测试项目运行

项目初始化完成后，先不要急着改代码，而是要先快速安装完依赖、运行、验证能否正常运行。

安装依赖，如果安装失败的话注意看错误信息，比如添加 `--force` 强制安装：

```shell
npm install --force
```

dev:weapp：开发测试时使用，可以即时编译，自动更新小程序的效果

build:weapp：打包上线前再使用，体积通常更小

运行之后，微信开发者工具查看项目，可以使用测试号

#### 配置开发规范

配置 prettier 和 eslint：

![img](https://pic.yupi.icu/1285/1714988519436-c07953c4-83c4-46d6-a2ba-fd24725cf1e3.png)

eslint 补充配置，关闭双引号校验：

```shell
{
  "extends": ["taro/react"],
  "rules": {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "jsx-quotes": "off"
  }
}
```

#### 测试组件引入

参考官方文档，在 app.ts 中全局引入 taro-ui：

```shell
import 'taro-ui/dist/style/index.scss' // 引入组件样式 - 方式一
```

然后尝试引入一个 taro-ui 组件。

#### 开发示例页面

1）找到应用全局配置文件 app.config.ts，新增页面路由

2）复制已有页面文件，创建新页面

3）根据自己的需要，复制组件，拼出完整页面

4）根据自己的需求，定制开发

5）演示页面之间的跳转：页面跳转

## 五、MBTI 算法实现

### 1、评分模块实现

#### 利用 CodeGeex 生成代码

对于算法类代码，完全可以利用 AI 生成，国内可以使用 CodeGeex 智能编程助手。

先安装 CodeGeex 插件，设置为中文，提问即可，描述清楚自己的问题很重要。

推荐使用 Pro 模式，效果更好。

##### AI Prompt

请根据我下面的题目评分算法原理，帮我用 js 获取到得分最高的题目评分结果，要求算法清晰易懂，性能要求高，多补充一些注释。

用户提交的答案 answerList: ["A"]

题目列表 questions:

```json
[
    {
        "title": "你通常更喜欢",
        "options": [
            {
                "result": "I",
                "value": "独自工作",
                "key": "A"
            },
            {
                "result": "E",
                "value": "与他人合作",
                "key": "B"
            }
        ]
    }
]
```

题目评分结果 question_results：

```json
[
  {
    "resultProp": [
      "I",
      "S",
      "T",
      "J"
    ],
    "resultDesc": "忠诚可靠，被公认为务实，注重细节。",
    "resultPicture": "icon_url_istj",
    "resultName": "ISTJ（物流师）"
  },
]
```

评分原理：答案数组的每个元素和题目数组中每个元素的某个选项的key对应，从而获取到对应的 result 属性；题目评分结果的 resultProp 集合中如果包含该属性，就+1分，最后计算哪个评分结果（question_result）分数最高。

##### AI 结果

这个函数首先遍历题目列表和答案列表，统计每个选项的计数。然后遍历评分结果列表，计算每个评分结果的分数，最后返回最高分数和最高分数对应的评分结果。

```javascript
function getMaxScore(answerList, questions, question_results) {
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
  let maxScoreResult = null;

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

const answerList = ["A"];
const questions = [
  {
    title: "你通常更喜欢",
    options: [
      {
        result: "I",
        value: "独自工作",
        key: "A",
      },
      {
        result: "E",
        value: "与他人合作",
        key: "B",
      },
    ],
  },
];
const question_results = [
  {
    resultProp: ["I", "S", "T", "J"],
    resultDesc: "忠诚可靠，被公认为务实，注重细节。",
    resultPicture: "icon_url_istj",
    resultName: "ISTJ（物流师）",
  },
];

console.log(getMaxScore(answerList, questions, question_results));
```

效果图如下：

![img](https://pic.yupi.icu/1285/1715050564270-378e86d9-81bf-4d39-9294-b2dcec6bdeb9.png)

注意，AI 生成的结果可能是不稳定的，可以持续优化 prompt。

#### 代码整合

复制 AI 生成的代码，然后新建工具类，可以用 node 命令进行测试：

![img](https://pic.yupi.icu/1285/1715050643426-78442bd9-c5b1-42e0-8ea0-af5485d8dd7f.png)

略微修改部分内容（比如 maxScoreResult 默认值、增加注释），然后搞几个题目进行测试：

```javascript
/**
 * 获取最佳题目评分结果
 * @param answerList
 * @param questions
 * @param question_results
 */
function getBestQuestionResult(answerList, questions, question_results) {
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

const answerList = ["B","B","B","A"];
const questions = [
  {
    title: "你通常更喜欢",
    options: [
      {
        result: "I",
        value: "独自工作",
        key: "A",
      },
      {
        result: "E",
        value: "与他人合作",
        key: "B",
      },
    ],
  },
  {
    options: [
      {
        result: "S",
        value: "喜欢有结构和常规",
        key: "A",
      },
      {
        result: "N",
        value: "喜欢自由和灵活性",
        key: "B",
      },
    ],
    title: "对于日常安排",
  },
  {
    options: [
      {
        result: "P",
        value: "首先考虑可能性",
        key: "A",
      },
      {
        result: "J",
        value: "首先考虑后果",
        key: "B",
      },
    ],
    title: "当遇到问题时",
  },
  {
    options: [
      {
        result: "T",
        value: "时间是一种宝贵的资源",
        key: "A",
      },
      {
        result: "F",
        value: "时间是相对灵活的概念",
        key: "B",
      },
    ],
    title: "你如何看待时间",
  },
];
const question_results = [
  {
    resultProp: ["I", "S", "T", "J"],
    resultDesc: "忠诚可靠，被公认为务实，注重细节。",
    resultPicture: "icon_url_istj",
    resultName: "ISTJ（物流师）",
  },
  {
    resultProp: ["I", "S", "F", "J"],
    resultDesc: "善良贴心，以同情心和责任为特点。",
    resultPicture: "icon_url_isfj",
    resultName: "ISFJ（守护者）",
  },
];

console.log(getBestQuestionResult(answerList, questions, question_results));
```

需要导出函数：

```javascript
export function getBestQuestionResult(answerList, questions, question_results) {
  ...
}
```

### 2、页面间数据传递

> 需求：题目结果页面需要得到做题页面用户选择的答案列表，才能进行评分。

方法 1：url params

https://taro-docs.jd.com/docs/apis/route/navigateTo

比如：result?answerList=[A,B,C]

方法 2：全局状态

https://taro-docs.jd.com/docs/context#contextprovider

方法 3：本地数据存储（推荐，较为简单）

https://taro-docs.jd.com/docs/apis/storage/setStorageSync

做题页面设置数据：

```jsx
<AtButton
  type="primary"
  size="normal"
  className="controlBtn"
  circle
  disabled={!currentAnswer}
  onClick={() => {
    Taro.setStorageSync('answerList', answerList);
    Taro.navigateTo({
      url: "/pages/result/index",
    });
  }}
>
  查看结果
</AtButton>
复制代码
```

查看结果页面使用数据：

```javascript
let role = question_results[0];
const answerList = Taro.getStorageSync("answerList");
if (!answerList || answerList.length < 1) {
  Taro.showToast({
    title: '答案为空',
    icon: 'error',
    duration: 3000
  })
}

role = getBestQuestionResult(answerList, questions, questionResults);
```

运行效果图：

![img](https://pic.yupi.icu/1285/1715052072977-887a9f39-491f-4130-a17c-676bbb78b804.png)

### 3、注意事项

遇事不决 3 件套：清理工具缓存、重启项目、重启开发者工具。

## 六、Redux状态管理

> 通过用户状态示例，学会如何使用 Redux Toolkit 创建一个简单的用户登录状态管理系统，包括定义状态、创建切片、配置 store 以及在组件中使用 Redux 状态。通过 `createSlice` 和 `configureStore`，Redux Toolkit 极大地简化了 Redux 的使用，更加高效地管理应用程序状态。

#### 1. 初始化项目

首先，确保你已经安装了 `redux` 和 `@reduxjs/toolkit`：

```bash
npm install @reduxjs/toolkit react-redux
```

#### 2. 创建用户状态切片

**定义用户状态 (`UserState`)：**

我们需要管理用户的登录状态和基本信息（昵称和头像）。首先，定义用户状态的结构：

```typescript
interface UserState {
  isLoggedIn: boolean;  // 表示用户是否已登录
  userInfo: {
    nickname: string;   // 用户的昵称
    avatar: string;     // 用户的头像
  } | null;  // 如果用户未登录，userInfo 为 null
}
```

**设置初始状态：**

我们需要一个初始状态，用来表示用户未登录时的状态：

```
typescript复制代码const initialState: UserState = {
  isLoggedIn: false,   // 默认未登录
  userInfo: null,      // 没有用户信息
};
```

**创建用户状态切片 (`userSlice`)：**

Redux Toolkit 提供了 `createSlice` 方法，可以简化 reducer 和 action 的创建。我们创建一个 `userSlice` 来管理用户状态，并定义两个 `reducer` 函数：`login` 和 `logout`。

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userStore', // 切片名称，用于生成 action type
  initialState,      // 初始状态
  reducers: {
    // 登录操作：更新 isLoggedIn 和 userInfo
    login: (state, action: PayloadAction<{ nickname: string; avatar: string }>) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload;
    },
    // 登出操作：重置 isLoggedIn 和 userInfo
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
    },
  },
});

// 导出生成的 action（登录和登出）
export const { login, logout } = userSlice.actions;

// 导出 reducer，用于配置 store
export default userSlice.reducer;
```

**完整代码**

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isLoggedIn: boolean;
  userInfo: {
    nickname: string;
    avatar: string;
  } | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  userInfo: null,
};

const userSlice = createSlice({
  name: 'userStore',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ nickname: string; avatar: string }>) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
```

#### 3. 配置 Redux Store

Redux 的核心是 store，它是所有状态的仓库。我们需要配置一个 Redux store，并将 `userSlice` 中的 reducer 添加进去。

```typescript
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,  // 将 userReducer 添加到 store 中，管理 user 状态
  },
});

// 定义 RootState 类型，用于获取整个状态树的类型
export type RootState = ReturnType<typeof store.getState>;
```

#### 4. 将 store 提供给 React 应用

最后，我们需要使用 `Provider` 将 Redux store 提供给 React 组件树中的所有组件。

```react
import { Component, PropsWithChildren } from "react";
import { Provider } from "react-redux";
import globalStore from "./reduxStore";
import "./app.scss";

class App extends Component<PropsWithChildren> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return <Provider store={globalStore}>{this.props.children}</Provider>;
  }
}

export default App;
);
```

#### 5. 使用 Redux 状态

接下来，我们将在组件中使用 `react-redux` 的 `useSelector` 和 `useDispatch` 钩子来访问和更新 Redux 状态。

```tsx
import { Button, Input, View } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/avatar.scss";
import "taro-ui/dist/style/components/input.scss";
import "taro-ui/dist/style/components/article.scss";
import { DefaultAvatar } from "../../utils/bizUtils";
import "./index.scss";
//使用自定义的redux状态
import { useSelector, useDispatch } from "react-redux";
import { userState } from "../../reduxStore/userStore/userType";
import { login } from "../../reduxStore/userStore";

export default () => {
  // 构造 action 
  const dispatch = useDispatch();
  // 获取  Redux store
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
```