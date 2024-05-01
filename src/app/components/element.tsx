import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useBoardStatic } from "../hooks/use-board-static";
import useChildren from "../hooks/use-children";
import { PlaitElement } from "../interfaces";
import { ElementContext } from "../hooks/use-element-static";

/**
 * Element.
 */

const Element = (props: { element: PlaitElement }) => {
  const { element } = props;
  const board = useBoardStatic();
  const id = element.id;
  let children: React.ReactNode = useChildren({
    node: element,
  });

  const ref = useCallback(
    (ref: SVGGElement) => {
      // Update element-related weak maps with the DOM element ref.
    },
    [board, id, element]
  );

  const attributes: {
    ref: any;
  } = {
    ref,
  };

  return (
    <ElementContext.Provider value={element}>
      {board.drawElement({
        attributes,
        children,
        element,
      })}
    </ElementContext.Provider>
  );
};

const MemoizedElement = React.memo(Element, (prev, next) => {
  return prev.element === next.element;
});

export default MemoizedElement;
