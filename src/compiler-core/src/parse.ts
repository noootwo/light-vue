import { NodeTypes } from "./ast";

const Delimiter = {
  interpolationOpen: "{{",
  interpolationClose: "}}",
};

export function baseParse(content: string) {
  const context = createParseContext(content);

  return createRoot(parseChildren(context));
}

function createRoot(children) {
  return {
    children,
  };
}

function parseChildren(context) {
  const nodes: any = [];

  if (context.source.startsWith(Delimiter.interpolationOpen)) {
    const node = parseInterpolation(context);

    nodes.push(node);
  }

  return nodes;
}

function parseInterpolation(context) {
  const openDelimiter = Delimiter.interpolationOpen;
  const closeDelimiter = Delimiter.interpolationClose;
  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  );
  const content = context.source.slice(openDelimiter.length, closeIndex);

  advanceBy(context, closeIndex + closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
    },
  };
}

function advanceBy(context, length: number) {
  context.source = context.source.slice(length);
}

function createParseContext(content: string) {
  return {
    source: content,
  };
}
