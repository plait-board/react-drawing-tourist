/**
 * Children.
 */

import ElementComponent from "../components/element";
import { Ancestor } from "../interfaces/node";
import { NODE_TO_INDEX, NODE_TO_PARENT } from "../utils/weak-maps";

const useChildren = (props: { node: Ancestor }) => {
  const { node } = props;

  return node.children?.map((n, i) => {
    NODE_TO_INDEX.set(n, i);
    NODE_TO_PARENT.set(n, node);
    return <ElementComponent key={n.id} element={n} />;
  });
};

export default useChildren;
