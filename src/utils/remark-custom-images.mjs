import { visit } from 'unist-util-visit';

export function remarkCustomImages() {
  return (tree) => {
    visit(tree, 'image', (node, index, parent) => {
      // Convert markdown image to JSX component
      const jsxNode = {
        type: 'mdxJsxFlowElement',
        name: 'BlogImage',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'src',
            value: node.url
          },
          {
            type: 'mdxJsxAttribute',
            name: 'alt',
            value: node.alt || ''
          }
        ],
        children: []
      };

      // If the image has a title, use it as caption
      if (node.title) {
        jsxNode.attributes.push({
          type: 'mdxJsxAttribute',
          name: 'caption',
          value: node.title
        });
      }

      // Replace the image node with the JSX node
      parent.children[index] = jsxNode;
    });
  };
}