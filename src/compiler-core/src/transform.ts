export const transform = (root, options?: any) => {
  const context = createTransformContext(root, options);
  traverseNode(root, context);

  createRootCodegen(root);
};

function createRootCodegen(root) {
  root.codegenNode = root.children[0];
}

function createTransformContext(root, options?) {
  return {
    root,
    nodeTransforms: options?.nodeTransforms || [],
  };
}

function traverseNode(root, context) {
  const nodeTransforms = context.nodeTransforms;
  for (let i = 0; i < nodeTransforms.length; i++) {
    nodeTransforms[i](root);
  }

  if (root.children) {
    for (let i = 0; i < root.children.length; i++) {
      traverseNode(root.children[i], context);
    }
  }
}
