import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";

describe("parse", () => {
  describe("interpolation", () => {
    it("happy path", () => {
      const ast = baseParse("{{ value }}");

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: "value",
        },
      });
    });
  });

  describe("element", () => {
    it("happy path", () => {
      const ast = baseParse("<div></div>");

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [],
      });
    });
  });

  describe("text", () => {
    it("happy path", () => {
      const ast = baseParse("some text");

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: "some text",
      });
    });
  });

  describe("full parse", () => {
    it("happy path", () => {
      const ast = baseParse("<div>hi {{ name }}</div>");

      expect(ast.children).toStrictEqual([
        {
          type: NodeTypes.ELEMENT,
          tag: "div",
          children: [
            {
              type: NodeTypes.TEXT,
              content: "hi ",
            },
            {
              type: NodeTypes.INTERPOLATION,
              content: {
                type: NodeTypes.SIMPLE_EXPRESSION,
                content: "name",
              },
            },
          ],
        },
      ]);
    });

    it("nested element", () => {
      const ast = baseParse("<div><p>hi</p>{{ name }}</div>");

      expect(ast.children).toStrictEqual([
        {
          type: NodeTypes.ELEMENT,
          tag: "div",
          children: [
            {
              type: NodeTypes.ELEMENT,
              tag: "p",
              children: [
                {
                  type: NodeTypes.TEXT,
                  content: "hi",
                },
              ],
            },
            {
              type: NodeTypes.INTERPOLATION,
              content: {
                type: NodeTypes.SIMPLE_EXPRESSION,
                content: "name",
              },
            },
          ],
        },
      ]);
    });
  });

  test.only("want throw error", () => {
    expect(() => baseParse("<div><p></div>")).toThrow("Unclosed tag: p");
  });
});
