function randomInt(a = 0, b = 0) {
  max = Math.max(a, b);
  min = Math.min(a, b);
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

function parse(data) {
  if (!data) return data;
  if (typeof data === "number") return data;
  if (typeof data === "string") {
    return data.replace(/@((\w+)\([^\)]+\))/g, function(match, group1, group2) {
      return handle[group2] ? eval(`handle.${group1}`) : match;
    });
  }
  if (Array.isArray(data)) {
    return data.map(d => parse(d));
  }
  let obj = { ...data };
}
