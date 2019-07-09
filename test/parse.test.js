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
    expect(parse({ "str|5": "@str(10)" }).str)
      .to.be.a("string")
      .with.lengthOf(50)
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
    expect(parse({ "str|10": "@cstr(10)" }).str)
      .to.be.a("string")
      .with.lengthOf(100)
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

  test("mock build-in function @img", function() {
    expect(parse({ img: "@img" }).img).to.be.equal(
      "http://dummyimage.com/100x100"
    );
    expect(
      parse({ img: "@img(200,200,'#fff','#f00','png','Hello')" }).img
    ).to.be.equal("http://dummyimage.com/200x200/fff/f00.png&text=Hello");
  });

  test("mock build-in function @color", function() {
    expect(parse({ color: "@color" }).color)
      .to.be.a("string")
      .with.not.equal("@color");
  });

  test("mock build-in function @time", function() {
    expect(parse({ time: "@time" }).time)
      .to.be.a("string")
      .with.not.equal("@time");
  });

  test("mock build-in function @uuid", function() {
    expect(parse({ uuid: "@uuid" }).uuid)
      .to.be.a("string")
      .with.not.equal("@uuid");
  });

  test("mock build-in function @inc", function() {
    expect(parse({ inc: "@inc" }).inc)
      .to.be.a("string")
      .with.not.equal("@inc");

    expect(parse({ inc: "@inc(1000)" }).inc)
      .to.be.a("string")
      .with.not.equal("@inc(1000)");
  });

  test("mock build-in function @paragraph", function() {
    expect(parse({ paragraph: "@paragraph" }).paragraph)
      .to.be.a("string")
      .with.not.equal("@paragraph");

    expect(parse({ paragraph: "@paragraph(3)" }).paragraph)
      .to.be.a("string")
      .with.not.equal("@paragraph(3)");

    expect(parse({ paragraph: "@paragraph(3,5)" }).paragraph)
      .to.be.a("string")
      .with.not.equal("@paragraph(3,5)");
  });

  test("mock build-in function @cparagraph", function() {
    expect(parse({ cparagraph: "@cparagraph" }).cparagraph)
      .to.be.a("string")
      .with.not.equal("@cparagraph");

    expect(parse({ cparagraph: "@cparagraph(3)" }).cparagraph)
      .to.be.a("string")
      .with.not.equal("@cparagraph(3)");

    expect(parse({ cparagraph: "@cparagraph(3,5)" }).cparagraph)
      .to.be.a("string")
      .with.not.equal("@cparagraph(3,5)");
  });
  test("mock build-in function @pick", function() {
    expect(parse({ pick: "@pick(1,2,3,4)" }).pick)
      .to.be.a("string")
      .with.not.equal("@pick(1,2,3,4)");

    expect(parse({ pick: "@pick([1,2,3,4])" }).pick)
      .to.be.a("string")
      .with.not.equal("@pick([1,2,3,4])");

    expect(
      ["1", "2", "3", "4"].indexOf(parse({ pick: "@pick(1,2,3,4)" }).pick)
    ).not.equal(-1);
  });

  test("mock build-in function @host", function() {
    expect(parse({ host: "@host()" }).host)
      .to.be.a("string")
      .with.not.equal("@host()");

    expect(parse({ host: "@host" }).host)
      .to.be.a("string")
      .with.not.equal("@host");
    var host = parse({ host: "@host()" }).host;
    expect(/^\w+\.\w+$/.test(host)).to.be.ok;
  });

  test("mock build-in function @ip", function() {
    expect(parse({ ip: "@ip()" }).ip)
      .to.be.a("string")
      .with.not.equal("@ip()");

    expect(parse({ ip: "@ip" }).ip)
      .to.be.a("string")
      .with.not.equal("@ip");
    var ip = parse({ ip: "@ip()" }).ip;
    expect(/^\d+\.\d+\.\d+\.\d+$/.test(ip)).to.be.ok;
  });

  test("mock build-in function @email", function() {
    expect(parse({ email: "@email()" }).email)
      .to.be.a("string")
      .with.not.equal("@email()");

    expect(parse({ email: "@email" }).email)
      .to.be.a("string")
      .with.not.equal("@email");
    var email = parse({ email: "@email()" }).email;
    expect(/^\w+@\w+\.\w+$/.test(email)).to.be.ok;
  });

  test("mock build-in function @url", function() {
    expect(parse({ url: "@url()" }).url)
      .to.be.a("string")
      .with.not.equal("@url()");

    expect(parse({ url: "@url" }).url)
      .to.be.a("string")
      .with.not.equal("@url");
    var url = parse({ url: "@url()" }).url;
    expect(/^https?:\/\/\w+\.\w+\.\w+\/\w+$/.test(url)).to.be.ok;
  });
});
