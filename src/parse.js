const commonHz =
  "的一是了我不人在他有这个上们来到时大地为子中你说生国年着就那和要她出也得里后自以会家可下而过天去能对小多然于心学么之都好看起发当没成只如事把还用第样道想作种开美总从无情己面最女但现前些所同日手又行意动方期它头经长儿回位分爱老因很给名法间斯知世什两次使身者被高已亲其进此话常与活正感见明问力理尔点文几定本公特做外孩相西果走将月十实向声车全信重三机工物气每并别真打太新比才便夫再书部水像眼等体却加电主界门利海受听表德少克代员许稜先口由死安写性马光白或住难望教命花结乐色更拉东神记处让母父应直字场平报友关放至张认接告入笑内英军候民岁往何度山觉路带万男边风解叫任金快原吃妈变通师立象数四失满战远格士音轻目条呢病始达深完今提求清王化空业思切怎非找片罗钱紶吗语元喜曾离飞科言干流欢约各即指合反题必该论交终林请医晚制球决窢传画保读运及则房早院量苦火布品近坐产答星精视五连司巴奇管类未朋且婚台夜青北队久乎越观落尽形影红爸百令周吧识步希亚术留市半热送兴造谈容极随演收首根讲整式取照办强石古华諣拿计您装似足双妻尼转诉米称丽客南领节衣站黑刻统断福城故历惊脸选包紧争另建维绝树系伤示愿持千史谁准联妇纪基买志静阿诗独复痛消社算义竟确酒需单治卡幸兰念举仅钟怕共毛句息功官待究跟穿室易游程号居考突皮哪费倒价图具刚脑永歌响商礼细专黄块脚味灵改据般破引食仍存众注笔甚某沉血备习校默务土微娘须试怀料调广蜖苏显赛查密议底列富梦错座参八除跑亮假印设线温虽掉京初养香停际致阳纸李纳验助激够严证帝饭忘趣支春集丈木研班普导顿睡展跳获艺六波察群皇段急庭创区奥器谢弟店否害草排背止组州朝封睛板角况曲馆育忙质河续哥呼若推境遇雨标姐充围案伦护冷警贝著雪索剧啊船险烟依斗值帮汉慢佛肯闻唱沙局伯族低玩资屋击速顾泪洲团圣旁堂兵七露园牛哭旅街劳型烈姑陈莫鱼异抱宝权鲁简态级票怪寻杀律胜份汽右洋范床舞秘午登楼贵吸责例追较职属渐左录丝牙党继托赶章智冲叶胡吉卖坚喝肉遗救修松临藏担戏善卫药悲敢靠伊村戴词森耳差短祖云规窗散迷油旧适乡架恩投弹铁博雷府压超负勒杂醒洗采毫嘴毕九冰既状乱景席珍童顶派素脱农疑练野按犯拍征坏骨余承置臓彩灯巨琴免环姆暗换技翻束增忍餐洛塞缺忆判欧层付阵玛批岛项狗休懂武革良恶恋委拥娜妙探呀营退摇弄桌熟诺宣银势奖宫忽套康供优课鸟喊降夏困刘罪亡鞋健模败伴守挥鲜财孤枪禁恐伙杰迹妹藸遍盖副坦牌江顺秋萨菜划授归浪听凡预奶雄升碃编典袋莱含盛济蒙棋端腿招释介烧误";
function randomInt(a = 0, b = 0) {
  max = Math.max(a | 0, b | 0);
  min = Math.min(a | 0, b | 0);
  if (max === min) return min;
  return Math.floor(Math.random() * (max - min) + min);
}

function randomHz() {
  return commonHz[randomInt(0, commonHz.length)];
}

function randomZm() {
  return String.fromCharCode(
    Math.random() > 0.5 ? randomInt(65, 91) : randomInt(97, 123)
  );
}

function repeatStrFn(fn, times, joinStr = "") {
  let arr = [];
  while (times--) {
    arr.push(fn());
  }
  return arr.join(joinStr);
}

function genStr(fn, min, max) {
  if (!max) return repeatStrFn(fn, min);
  return repeatStrFn(fn, randomInt(min, max + 1));
}

function genParagraph(fn, joinStr, min, max) {
  if (!max) return repeatStrFn(fn, min, joinStr);
  return repeatStrFn(fn, randomInt(min, max + 1), joinStr);
}

function genFloat(count) {
  let num;
  while (!(num = randomInt(0, Math.pow(10, count)))) {}
  return ("0".repeat(count) + num).slice(-count);
}

let idCount;
// 字符串内函数
const fns = {
  str(min = 1, max = 10) {
    return genStr(randomZm, min, max);
  },
  cstr(min = 1, max = 10) {
    return genStr(randomHz, min, max);
  },
  num(min = 0, max = 999999999, digit) {
    if (!digit) return randomInt(min, max);
    return parseFloat(randomInt(min, max) + "." + genFloat(digit));
  },
  img(w = 100, h = 100, bg, fg, format, text) {
    let base = `http://dummyimage.com/${w}x${h}`;
    if (bg) base += "/" + bg.replace("#", "");
    if (fg) base += "/" + fg.replace("#", "");
    if (format) base += ".png";
    if (text) base += "&text=" + text;
    return base;
  },
  color() {
    return (
      "#" +
      ("00000" + ((0xffffff * Math.random() + 1) | 0).toString(16)).slice(-6)
    );
  },
  time(future) {
    return future
      ? randomInt(
          24 * 60 * 60 * 1000 + new Date(),
          365 * 24 * 60 * 60 * 1000 + new Date()
        )
      : randomInt(0, +new Date());
  },
  uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  inc(init) {
    if (!idCount) idCount = init | 0;
    return idCount++;
  },
  paragraph(min = 1, max = 5) {
    return genParagraph(() => this.str(10, 100), ",", min, max) + ".";
  },
  cparagraph(min = 1, max = 5) {
    return genParagraph(() => this.cstr(10, 30), "，", min, max) + "。";
  }
};

/**
 * 获取形如：arr|1-10.2-5的描述信息
 * @param {*} key
 * @returns {object} {name:'arr',min:1,max:10,dmin:2,dmax:5}
 */
function getKeyDes(key) {
  let mc = key.match(/\|(\d+)(?:-(\d+)(?:\.(\d+)(?:-(\d+))?)?)?/);
  if (!mc) return;
  [exp, min, max, dmin, dmax] = mc;
  if (min && !max) max = min;
  if (dmin && !dmax) dmax = dmin;
  return {
    name: key.replace(exp, ""),
    min: min | 0,
    max: max | 0,
    dmin: dmin | 0,
    dmax: dmax | 0
  };
}

function type(data) {
  return Object.prototype.toString
    .call(data)
    .match(/^\[object (\w+)\]$/)[1]
    .toLowerCase();
}

let typeParse = {
  number(data, des) {
    if (!des) return data;
    let num = randomInt(des.min, des.max);
    if (des.dmin) {
      return parseFloat(num + "." + genFloat(randomInt(des.dmin, des.dmax)));
    }
    return num;
  },
  string(data, des) {
    data = data.replace(/@((\w+)(\([^\)]*\))?)/g, function(
      match,
      group1, //group1 @fn(arg)
      group2, //group2 fn
      group3 //group3 (arg)
    ) {
      return fns[group2]
        ? group3 ? eval(`fns.${group1}`) : eval(`fns.${group1}()`)
        : match;
    });
    if (!des) return data;
    return data.repeat(randomInt(des.min, des.max));
  },
  boolean(data, des) {
    return Math.random() < des.min / (des.min + des.max) ? data : !data;
  }
};

function parse(data, des) {
  let tp = type(data);
  if (typeParse[tp]) return typeParse[tp](data, des); // 基础类型解析
  if (!des && tp === "array") des = { min: data.length, min: data.length };
  //无描述信息说明为最顶层的数据或无需parse的数据
  if (des) {
    if (tp === "array") {
      let len = randomInt(des.min, des.max);
      if (len <= 0) return [];
      let arr = [],
        dataLen = data.length;
      while (arr.length < len) {
        let item = data[randomInt(0, dataLen)],
          des;
        if (Array.isArray(item)) des = { min: item.length, max: item.length };
        arr.push(parse(item, des));
      }
      return des.min === des.max && des.min === 1 ? arr[0] : arr;
    }
    if (typeof data === "object") {
      let len = randomInt(des.min, des.max);
      if (len <= 0) return {};
      let obj = {},
        count = 0,
        parsedData = parse(data); // 先解析再pick
      keys = Object.keys(parsedData);
      len = Math.min(len, keys.length); // 长度超出key的数量没意义，会被覆盖
      keys.sort(() => (Math.random() > 0.5 ? 1 : -1));
      keys.slice(0, len).forEach(key => (obj[key] = parsedData[key]));
      return obj;
    }
  } else {
    let obj = {};
    Object.keys(data).forEach(key => {
      let des = getKeyDes(key);
      obj[(des && des.name) || key] = parse(data[key], des);
    });
    return obj;
  }
}

module.exports = parse;
