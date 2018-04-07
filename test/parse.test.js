const parse = require("../src/parse");
const expect = require("chai").expect;

const mockObj = {
  id: "@inc(10000)",
  "age|18-30": 0,
  name: "@cstr(2,4)",
  desc: "@cparagraph"
};

const mockArr = {
  "data|10": [
    {
      id: "@inc(10000)",
      "age|18-30": 0,
      name: "@cstr(2,4)",
      desc: "@cparagraph"
    }
  ]
};

suite("Mock Parse Tests", function() {
  test("mock number key", function() {
    expect(parse({ "num|5": 0 })).to.have.key("num");
    expect(parse({ "num|1-10": 0 })).to.have.key("num");
  });

  test("mock number value", function() {
    expect(parse({ "num|1-10": 0 }).num).to.be.a("number");
  });

  test("mock string key", function() {
    expect(parse({ "str|5": "a" })).to.have.key("str");
    expect(parse({ "str|1-10": "a" })).to.have.key("str");
  });

  test("mock string value", function() {
    expect(parse({ "str|5": "a" }).str).to.be.equal("aaaaa");
    expect(parse({ "str|1-10": "a" }).str).to.be.a("string");
  });

  test("mock bool key", function() {
    expect(parse({ "bool|1": true })).to.have.key("bool");
    expect(parse({ "bool|1-2": true })).to.have.key("bool");
  });

  test("mock bool value", function() {
    expect(parse({ "bool|1-10": true }).bool).to.be.a("boolean");
  });

  test("mock array key", function() {
    expect(parse({ "array|1": ["张三", "李四", "王五"] })).to.have.key("array");
    expect(parse({ "array|1-2": ["张三", "李四", "王五"] })).to.have.key(
      "array"
    );
  });

  test("mock array value", function() {
    expect(parse({ "array|10": ["张三", "李四", "王五"] }).array)
      .to.be.a("array")
      .with.lengthOf(10);
    expect(parse({ "array|1": ["张三", "李四", "王五"] }).array).to.be.a(
      "string"
    );
    expect(parse({ "array|1-2": ["张三", "李四", "王五"] }).array).to.be.a(
      "array"
    );
  });

  test("mock build-in function @str", function() {
    expect(parse({ str: "@str" }).str)
      .to.be.a("string")
      .with.not.equal("@str");
    expect(parse({ str: "@str(10)" }).str)
      .to.be.a("string")
      .with.lengthOf(10)
      .with.not.equal("@str(10)");
    expect(parse({ str: "@str(1,10)" }).str)
      .to.be.a("string")
      .with.not.equal("@str(1,10)");
  });

  test("mock build-in function @cstr", function() {
    expect(parse({ str: "@cstr" }).str)
      .to.be.a("string")
      .with.not.equal("@cstr");
    expect(parse({ str: "@cstr(10)" }).str)
      .to.be.a("string")
      .with.lengthOf(10)
      .with.not.equal("@cstr(10)");
    expect(parse({ str: "@cstr(1,10)" }).str)
      .to.be.a("string")
      .with.not.equal("@cstr(1,10)");
  });

  test("mock build-in function @num", function() {
    expect(parse({ num: "@num" }).num)
      .to.be.a("string")
      .with.not.equal("@num");
    expect(parse({ num: "@num(1,10)" }).num)
      .to.be.a("string")
      .with.not.equal("@num(1,10)");
    expect(parse({ num: "@num(1,10,3)" }).num)
      .to.be.a("string")
      .with.not.equal("@num(1,10,3)");
  });
});
