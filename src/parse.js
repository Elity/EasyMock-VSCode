function randomInt(a = 0, b = 0) {
  max = Math.max(a >>> 0, b >>> 0);
  min = Math.min(a >>> 0, b >>> 0);
  if (max === min) return min;
  return Math.floor(Math.random() * (max - min) + min);
}

function randomHz() {
  return String.fromCharCode(randomInt(19968, 40870));
}

function randomZm() {
  return String.fromCharCode(
    Math.random() > 0.5 ? randomInt(65, 91) : randomInt(97, 123)
  );
}

function repeatStrFn(fn, times) {
  let s = "";
  while (times--) {
    s += fn();
  }
  return s;
}

function genStr(fn, min, max, origin) {
  if (origin) return String(origin).repeat(randomInt(min, max + 1));
  if (!origin && typeof max === "string") return max.repeat(min);
  if (!max) return repeatStrFn(fn, min);
  return repeatStrFn(fn, randomInt(min, max + 1));
}

function genFloat(count) {
  let num;
  while (!(num = randomInt(0, Math.pow(10, count)))) {}
  return ("0".repeat(count) + num).slice(-count);
}

const handle = {
  str(...args) {
    return genStr(randomZm, ...args);
  },
  str1(...args) {
    return genStr(randomHz, ...args);
  },
  num(min, max, digit) {
    if (!digit) return randomInt(min, max);
    return parseFloat(randomInt(min, max) + "." + genFloat(digit));
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
    min: min >>> 0,
    max: max >>> 0,
    dmin: dmin >>> 0,
    dmax: dmax >>> 0
  };
}

function parse(data, des) {
  //无描述信息说明为最顶层的数据或无需parse的数据
  if (des) {
    if (des.notParse) return data; // 手动指定无需解析的数据
    if (typeof data === "number") {
      let num = randomInt(des.min, des.max);
      if (des.dmin) {
        return parseFloat(num + "." + genFloat(randomInt(des.dmin, des.dmax)));
      }
      return num;
    }
    if (typeof data === "string") {
      //TODO   string 可以执行内置的部分函数
      return handle.str(des.min, des.max, data);
    }
    if (Array.isArray(data)) {
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
      return arr;
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
      keys.slice(0, len).forEach(key => (obj[key] = parsedData[key])); //可优化 上面的parse可以放到循环里面
      return obj;
    }
  } else if (typeof data === "string") {
    return data; // 可以继续解析data里面的函数
  } else if (typeof data === "number") {
    return data;
  } else if (Array.isArray(data)) {
    return parse(data, { min: data.length, min: data.length });
  } else {
    let tmp = {};
    Object.keys(data).forEach(key => {
      let des = getKeyDes(key);
      tmp[(des && des.name) || key] = parse(data[key], des);
    });
    return tmp;
  }
}
