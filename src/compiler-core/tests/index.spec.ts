import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";

describe("parse", () => {
  describe("interpolation", () => {
    it("happy path", () => {
      const ast = baseParse("{{value}}");

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: "value",
        },
      });
    });
  });
});
