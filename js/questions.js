/* =====================================================
   题库 · 判分加权表
   ⚠️ 改题目只需要改这个文件（报告文案在 results.js）
   ===================================================== */

/* 类型 ID：
   sunrise 晨光初绽·向阳型 | noon 正午晴空·坦荡型 | golden 黄昏鎏金·温沉型
   clear 雨后初霁·通透型 | firefly 夏夜萤火·微光型 | breeze 温柔海风·松弛型
   mist 林间晨雾·疏离型 | storm 积云蓄雷·张力型 | aurora 深空极光·浪漫型
   snow 远山落雪·冷清型 */

const QUESTIONS = [
  {
    q: "清晨醒来，你睁开眼的第一感觉更接近哪一种？",
    options: [
      { text: "又是新的一天，今天也会闪闪发光", weights: { sunrise: 2, golden: 1 } },
      { text: "伸个懒腰，先赖五分钟再说", weights: { breeze: 2, firefly: 1 } },
      { text: "脑子里已经列好了今天要做的几件事", weights: { noon: 2, storm: 1 } },
      { text: "想安静地发一会儿呆，再慢慢起身", weights: { mist: 2, snow: 1 } }
    ]
  },
  {
    q: "朋友形容你，出现频率最高的词是什么？",
    options: [
      { text: "有活力，像个小太阳", weights: { sunrise: 2, aurora: 1 } },
      { text: "温柔，跟他说话很舒服", weights: { breeze: 2, golden: 1 } },
      { text: "靠谱，有事找他就对了", weights: { clear: 2, noon: 1 } },
      { text: "神秘，总觉得他藏着很多故事", weights: { mist: 2, storm: 1 } }
    ]
  },
  {
    q: "一群人聚会，你通常是哪一种存在？",
    options: [
      { text: "带动气氛的那个人，笑声由我发起", weights: { sunrise: 2, noon: 1 } },
      { text: "角落里安静观察，偶尔冒出一句金句", weights: { firefly: 2, mist: 1 } },
      { text: "照顾大家情绪的人，谁冷场我都接得住", weights: { golden: 2, clear: 1 } },
      { text: "待一会儿就想溜走，人太多会消耗我", weights: { snow: 2, breeze: 1 } }
    ]
  },
  {
    q: "压力很大的时候，你身体的第一个反应是？",
    options: [
      { text: "立刻行动，先把能做的做完再说", weights: { storm: 2, noon: 1 } },
      { text: "找个安静角落，自己消化一会儿", weights: { mist: 2, snow: 1 } },
      { text: "找朋友聊聊，说出来就舒服一半", weights: { sunrise: 2, breeze: 1 } },
      { text: "去吃点好的，或者睡一觉，明天再说", weights: { breeze: 2, firefly: 1 } }
    ]
  },
  {
    q: "翻开你的手机相册，最多的是什么？",
    options: [
      { text: "天空、云、光影，随手拍的美", weights: { aurora: 2, mist: 1 } },
      { text: "朋友合照，和重要的人在一起", weights: { golden: 2, sunrise: 1 } },
      { text: "猫猫狗狗、美食、生活碎片", weights: { firefly: 2, breeze: 1 } },
      { text: "几乎都是截图和资料，相册很干净", weights: { clear: 2, noon: 1 } }
    ]
  },
  {
    q: "如果有一个完全自由的周末，你会怎么过？",
    options: [
      { text: "约朋友出门，去哪都行，热闹就好", weights: { noon: 2, sunrise: 1 } },
      { text: "一个人宅家，看书、听歌、发一整天的呆", weights: { mist: 2, aurora: 1 } },
      { text: "去户外走一走，吹吹风就很满足", weights: { breeze: 2, clear: 1 } },
      { text: "把没做完的事整理好，心里踏实", weights: { storm: 2, clear: 1 } }
    ]
  },
  {
    q: "旅行出发前，你更接近哪种状态？",
    options: [
      { text: "做满攻略，路线图、备选方案都备齐", weights: { clear: 2, noon: 1 } },
      { text: "定好机票酒店，其他到了再说", weights: { breeze: 2, firefly: 1 } },
      { text: "随心情走，转角遇到惊喜最棒", weights: { aurora: 2, sunrise: 1 } },
      { text: "其实更想待在熟悉的地方，出行对我很耗电", weights: { snow: 2, mist: 1 } }
    ]
  },
  {
    q: "你会被哪一类人深深吸引？",
    options: [
      { text: "明亮坦荡、眼里有光的人", weights: { sunrise: 2, noon: 1 } },
      { text: "温柔沉稳、有故事感的人", weights: { golden: 2, mist: 1 } },
      { text: "自由松弛、不被定义的人", weights: { breeze: 2, aurora: 1 } },
      { text: "有边界感、内心强大的人", weights: { storm: 2, snow: 1 } }
    ]
  },
  {
    q: "被人误解时，你的第一反应通常是？",
    options: [
      { text: "懒得解释，懂的人自然懂", weights: { snow: 2, mist: 1 } },
      { text: "会认真说清楚，不能背这个锅", weights: { clear: 2, storm: 1 } },
      { text: "会有点难过，但表面还是笑着说没事", weights: { firefly: 2, golden: 1 } },
      { text: "直接做出来给他看，事实胜于雄辩", weights: { noon: 2, sunrise: 1 } }
    ]
  },
  {
    q: "独处的时候，你通常在做的事是？",
    options: [
      { text: "补能量，放空或睡一觉", weights: { breeze: 2, firefly: 1 } },
      { text: "想事情，复盘今天、规划明天", weights: { storm: 2, clear: 1 } },
      { text: "看剧听歌，享受属于自己的小世界", weights: { mist: 2, aurora: 1 } },
      { text: "其实不太喜欢一个人待太久", weights: { sunrise: 2, noon: 1 } }
    ]
  },
  {
    q: "面对一件完全没做过的新事物，你会？",
    options: [
      { text: "兴奋，迫不及待想试试", weights: { sunrise: 2, aurora: 1 } },
      { text: "先观察研究，心里有底再上", weights: { clear: 2, mist: 1 } },
      { text: "有一点紧张，但会硬着头皮上", weights: { firefly: 2, storm: 1 } },
      { text: "评估值不值得做，不值得就礼貌拒绝", weights: { snow: 2, breeze: 1 } }
    ]
  },
  {
    q: "你更喜欢待在哪种环境里？",
    options: [
      { text: "热闹明亮的，人越多越有能量", weights: { noon: 2, sunrise: 1 } },
      { text: "安静舒适、光线柔和的", weights: { mist: 2, golden: 1 } },
      { text: "开阔自然的，有风有草有天空", weights: { breeze: 2, clear: 1 } },
      { text: "有氛围感、能激发灵感的地方", weights: { aurora: 2, firefly: 1 } }
    ]
  },
  {
    q: "朋友陷入情绪低谷来找你，你通常会？",
    options: [
      { text: "认真听完，给出很实在的建议", weights: { clear: 2, noon: 1 } },
      { text: "陪着他，安静地听他说完", weights: { golden: 2, firefly: 1 } },
      { text: "想办法逗他开心，带他出去散散心", weights: { sunrise: 2, breeze: 1 } },
      { text: "告诉他：低谷很正常，你扛得过去", weights: { storm: 2, snow: 1 } }
    ]
  },
  {
    q: "你的手机桌面/壁纸通常是哪种风格？",
    options: [
      { text: "极简纯色，或一张很有质感的照片", weights: { mist: 2, snow: 1 } },
      { text: "喜欢的明星/风景/偶像，常换常新", weights: { aurora: 2, firefly: 1 } },
      { text: "默认壁纸，或者一张重要的合照", weights: { golden: 2, clear: 1 } },
      { text: "日历/待办，实用优先", weights: { noon: 2, storm: 1 } }
    ]
  },
  {
    q: "情绪低落的时候，最能治愈你的是？",
    options: [
      { text: "一顿好吃的，或一场酣畅淋漓的运动", weights: { breeze: 2, sunrise: 1 } },
      { text: "写下来，把心情变成文字", weights: { aurora: 2, mist: 1 } },
      { text: "睡觉，睡醒又是新的一天", weights: { firefly: 2, golden: 1 } },
      { text: "把房间整理干净，秩序感能让我安心", weights: { clear: 2, storm: 1 } }
    ]
  },
  {
    q: "如果给自己设一个标签，你会选？",
    options: [
      { text: "光", weights: { sunrise: 2, noon: 1 } },
      { text: "风", weights: { breeze: 2, firefly: 1 } },
      { text: "雾", weights: { mist: 2, aurora: 1 } },
      { text: "山", weights: { storm: 2, snow: 1 } }
    ]
  },
  {
    q: "在团队合作里，你更常扮演的角色是？",
    options: [
      { text: "打头阵、冲在前面带动大家", weights: { sunrise: 2, noon: 1 } },
      { text: "调和气氛、让大家协作更顺", weights: { golden: 2, clear: 1 } },
      { text: "默默把事做扎实，不太爱出头", weights: { firefly: 2, mist: 1 } },
      { text: "提出关键问题，负责把关底线", weights: { storm: 2, snow: 1 } }
    ]
  },
  {
    q: "你更认同哪种生活态度？",
    options: [
      { text: "热烈地活着，把每一天都过成值得纪念的样子", weights: { aurora: 2, sunrise: 1 } },
      { text: "松弛一点，人生不必事事用力", weights: { breeze: 2, golden: 1 } },
      { text: "清醒克制，把掌控感握在自己手里", weights: { clear: 2, storm: 1 } },
      { text: "做自己就好，不必向世界解释", weights: { snow: 2, mist: 1 } }
    ]
  },
  {
    q: "收到夸奖时，你通常会？",
    options: [
      { text: "开心地收下，然后回夸回去", weights: { sunrise: 2, breeze: 1 } },
      { text: "有点不好意思，说哪里哪里", weights: { firefly: 2, golden: 1 } },
      { text: "淡淡地说声谢谢，心里其实记住了", weights: { mist: 2, snow: 1 } },
      { text: "觉得还行吧，顺手想想还能更好", weights: { storm: 2, clear: 1 } }
    ]
  },
  {
    q: "你最喜欢哪个季节的气场？",
    options: [
      { text: "春天，万物复苏、生机勃勃", weights: { sunrise: 2, clear: 1 } },
      { text: "夏天，热烈灿烂、自由奔放", weights: { noon: 2, aurora: 1 } },
      { text: "秋天，温柔沉静、带着故事感", weights: { golden: 2, firefly: 1 } },
      { text: "冬天，干净清冽、安静有力量", weights: { snow: 2, storm: 1 } }
    ]
  },
  {
    q: "晚上睡前，你脑子里常常在想什么？",
    options: [
      { text: "今天的事，明天的事，计划清单", weights: { clear: 2, noon: 1 } },
      { text: "一些有的没的，天马行空的想法", weights: { aurora: 2, firefly: 1 } },
      { text: "回忆和一些人相处的瞬间", weights: { golden: 2, mist: 1 } },
      { text: "什么都不想，倒头就睡", weights: { breeze: 2, snow: 1 } }
    ]
  },
  {
    q: "你觉得自己的能量状态更像？",
    options: [
      { text: "白天越晒越亮，人群里越有电", weights: { noon: 2, sunrise: 1 } },
      { text: "夜晚才真正清醒，安静里有光", weights: { firefly: 2, aurora: 1 } },
      { text: "阴天也不影响，我自己就是光源", weights: { golden: 2, clear: 1 } },
      { text: "状态时高时低，但底线很硬", weights: { storm: 2, snow: 1 } }
    ]
  },
  {
    q: "如果有人想走近你，最需要知道的是？",
    options: [
      { text: "别催我，我需要自己的节奏", weights: { breeze: 2, firefly: 1 } },
      { text: "真诚就行，我讨厌弯弯绕绕", weights: { noon: 2, sunrise: 1 } },
      { text: "给我一点空间，别靠太近", weights: { mist: 2, snow: 1 } },
      { text: "别骗我，信任建立很难、崩塌很容易", weights: { storm: 2, clear: 1 } }
    ]
  },
  {
    q: "如果送你一句话，你希望是哪一句？",
    options: [
      { text: "世界很吵，但你可以做安静的风", weights: { breeze: 2, firefly: 1 } },
      { text: "你的光，本来就该耀眼", weights: { sunrise: 2, noon: 1 } },
      { text: "温柔的人，运气不会太差", weights: { golden: 2, clear: 1 } },
      { text: "不必迎合任何人，做自己就够了", weights: { snow: 2, mist: 1 } }
    ]
  }
];

/* 类型渲染顺序：用于并列时兜底优先级（排前面的优先） */
const TYPE_ORDER = ["sunrise", "noon", "golden", "clear", "firefly", "breeze", "mist", "storm", "aurora", "snow"];