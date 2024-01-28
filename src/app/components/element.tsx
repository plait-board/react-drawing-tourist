import React, { useCallback } from "react";
import { JSX } from "react";
import { useBoardStatic } from "../hooks/use-board-static";
import useChildren from "../hooks/use-children";
import { PlaitElement, RenderElementProps } from "../interfaces";

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
    (ref: HTMLElement | null) => {
      // Update element-related weak maps with the DOM element ref.
    },
    [board, id, element]
  )

  const attributes: {
    ref: any
  } = {
    ref,
  }

  const renderElement = useCallback((props: RenderElementProps) => board.drawElement(props), [])

  return renderElement({ attributes, children, element });
};

const MemoizedElement = React.memo(Element, (prev, next) => {
  return prev.element === next.element;
});

export default MemoizedElement;
