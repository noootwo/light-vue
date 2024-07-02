import { NodeTypes } from "./ast";

enum Delimiter {
  interpolationOpen = "{{",
  interpolationClose = "}}",
  elementStartOpen = "<",
  elementEndOpen = "</",
  elementClose = ">",
}

enum TagTypes {
  Start,
  End,
}

export function baseParse(content: string) {
  const context = createParseContext(content);

  return createRoot(parseChildren(context, []));
}

function createRoot(children) {
  return {
    children,
  };
}

let i = 0;
function parseChildren(context, ancestors) {
  const nodes: any = [];

  while (!isEnd(context, ancestors) && i++ < 10) {
    let node;
    if (context.source.startsWith(Delimiter.interpolationOpen)) {
      node = parseInterpolation(context);
    } else if (/^<\/?[a-z]/i.test(context.source)) {
      node = parseElement(context, ancestors);
    }

    if (!node) {
      node = parseText(context);
    }

    nodes.push(node);
  }

  return nodes;
}

function isEnd(context, ancestors) {
  const s = context.source;
  if (!s) return true;

  if (s.startsWith(Delimiter.elementEndOpen)) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      if (isContextStartsWithEndTag(context, ancestors[i])) {
        return true;
      }
    }
  }

  return false;
}

function isContextStartsWithEndTag(context, tag) {
  return (
    context.source
      .slice(0, Delimiter.elementEndOpen.length + tag.length + 1)
      .toLowerCase() ===
    (Delimiter.elementEndOpen + tag + Delimiter.elementClose).toLowerCase()
  );
}

function parseTextData(context, length) {
  const data = context.source.slice(0, length);
  advanceBy(context, length);
  return data;
}

function parseInterpolation(context) {
  const openDelimiter = Delimiter.interpolationOpen;
  const closeDelimiter = Delimiter.interpolationClose;
  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  );

  advanceBy(context, openDelimiter.length);
  const rawContent = parseTextData(context, closeIndex - 2);
  const content = rawContent.trim();
  advanceBy(context, closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
    },
  };
}

function parseTag(context, type: TagTypes) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);

  const tag = match[1];
  advanceBy(context, match[0].length);
  advanceBy(context, 1);

  if (type === TagTypes.End) return;

  return {
    type: NodeTypes.ELEMENT,
    tag,
  };
}

function parseElement(context, ancestors) {
  const element: any = parseTag(context, TagTypes.Start);
  ancestors.push(element.tag);
  element.children = parseChildren(context, ancestors);
  const endTag = ancestors.pop();

  if (isContextStartsWithEndTag(context, endTag)) {
    parseTag(context, TagTypes.End);
  } else {
    throw new Error(`Unclosed tag: ${endTag}`);
  }

  return element;
}

function parseText(context) {
  const end = [Delimiter.interpolationOpen, Delimiter.elementStartOpen];
  let endIndex = context.source.length;

  for (let i = 0; i < end.length; i++) {
    const index = context.source.indexOf(end[i]);
    if (index !== -1 && endIndex > index) {
      endIndex = index;
    }
  }

  const content = parseTextData(context, endIndex);

  return {
    type: NodeTypes.TEXT,
    content,
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
