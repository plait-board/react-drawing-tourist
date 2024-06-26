import { useEffect, useMemo, useRef } from "react";
import { useBoardStatic } from "../hooks/use-board-static";
import { useElementStatic } from "../hooks/use-element-static";
import {
  PlaitBoard,
  PlaitElement,
  Point,
  RectangleClient,
  RenderElementProps,
} from "../interfaces";

const RectangleElement = () => {
  const board = useBoardStatic();
  const element = useElementStatic();
  const elementRef = useRef<SVGGElement>(null);

  const node = useMemo(() => {
    const [start, realEnd] = element.points as Point[];
    const width = Math.abs(realEnd[0] - start[0]);
    let height = Math.abs(realEnd[1] - start[1]);

    const rectangleG = PlaitBoard.getRoughSVG(board)?.rectangle(
      start[0],
      start[1],
      width,
      height
    );
    return rectangleG;
  }, [element, board]);

  useEffect(() => {
    if (node) {
      elementRef.current?.appendChild(node);
    }
  }, [node]);

  return <g ref={elementRef} />;
};

export enum DrawPointerType {
  rectangle = 'rectangle'
}

export const withRectangle = (board: PlaitBoard) => {
  const { drawElement, getRectangle } = board;
  board.drawElement = (props: RenderElementProps) => {
    if (
      props.element.type === "geometry" &&
      props.element.shape === "rectangle"
    ) {
      return <RectangleElement />;
    }
    return drawElement(props);
  };

  board.getRectangle = (element: PlaitElement) => {
    if (element.type === "geometry") {
      return RectangleClient.getRectangleByPoints(element.points!);
    }
    return getRectangle(element);
  };
  return board;
};
