import {
  PlaitBoard,
  PlaitElement,
  Point,
  RectangleClient,
  RenderElementProps,
} from "../interfaces";

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
      const element = props.element;
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
