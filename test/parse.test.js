const assert = require("assert");
const parse = require("../src/parse");

suite("Mock Parse Tests", function() {
  it("Something 1", function() {
    assert.equal(-1, [1, 2, 3].indexOf(5));
    assert.equal(-1, [1, 2, 3].indexOf(0));
  });
});
