import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";

describe("transform", () => {
  it("happy path", () => {
    const ast = baseParse("<div>hi {{name}}</div>");

    const plugin = (node) => {
      if (node.type === NodeTypes.TEXT) {
        node.content = node.content + "mini-vue";
      }
    };

    transform(ast, {
      nodeTransforms: [plugin],
    });

    expect(ast.children[0].children[0].content).toBe("hi mini-vue");
  });
});
