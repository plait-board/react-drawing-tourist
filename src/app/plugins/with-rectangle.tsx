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
import { PlaitGeometry } from "../draw/interfaces/geometry";
import { ShapeDefaultSpace } from "../draw/constants/geometry";
import { Text } from "../text/text";

const RectangleElement = () => {
  const board = useBoardStatic();
  const element = useElementStatic();
  const elementRef = useRef<SVGGElement>(null);
  const textRectangle = getTextRectangle(element as PlaitGeometry);
  const textValue = (element as PlaitGeometry).text;
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
    rectangleG.classList.add("element");
    return rectangleG;
  }, [element, board]);

  useEffect(() => {
    if (node) {
      elementRef.current?.prepend(node);
    }
  }, [node]);

  return (
    <g ref={elementRef}>
      <g className="text">
        <foreignObject
          x={textRectangle.x}
          y={textRectangle.y}
          width={textRectangle.width}
          height={textRectangle.height}
        >
          <Text className="plait-text" value={textValue}></Text>
        </foreignObject>
      </g>
    </g>
  );
};

export enum DrawPointerType {
  rectangle = "rectangle",
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

export const getTextRectangle = (element: PlaitGeometry) => {
  const elementRectangle = RectangleClient.getRectangleByPoints(
    element.points!
  );
  const strokeWidth = element.strokeWidth || 2;
  const height = element.textHeight;
  const width =
    elementRectangle.width -
    ShapeDefaultSpace.rectangleAndText * 2 -
    strokeWidth * 2;
  return {
    height,
    width: width > 0 ? width : 0,
    x: elementRectangle.x + ShapeDefaultSpace.rectangleAndText + strokeWidth,
    y: elementRectangle.y + (elementRectangle.height - height) / 2,
  };
};
