/**
 * Children.
 */

import { Ancestor } from "../interfaces/node";
import { NODE_TO_INDEX, NODE_TO_PARENT } from "../utils/weak-maps";
import { useBoardStatic } from "./use-board-static";
import { PlaitElement } from "../interfaces";
import ElementComponent from '../components/element'

const useChildren = (props: {
  node: Ancestor;
}) => {
  const { node } = props;
  const board = useBoardStatic();
  const childrenComponents: any[] = [];
  const children = node.children || [];

  for (let i = 0; i < children.length; i++) {
    const n = children[i];
    childrenComponents.push(
        <ElementComponent
          element={n}
        />
    );

    NODE_TO_INDEX.set(n, i);
    NODE_TO_PARENT.set(n, node);
  }

  return childrenComponents;
};

export default useChildren;
