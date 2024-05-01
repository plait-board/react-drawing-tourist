import { PlaitBoard } from "../interfaces/board";
import { PlaitPluginKey } from "../interfaces/plugin-key";
import { Point } from "../interfaces/point";
import { RectangleClient } from "../interfaces/rectangle-client";
import { Transforms } from "../transforms";
import {
  drawRectangle,
  idCreator,
  preventTouchMove,
  toHostPoint,
  toViewBoxPoint,
} from "../utils";
import {
  addSelectedElement,
  clearSelectedElement,
  getHitElementByPoint,
  getHitSelectedElements,
} from "../utils/selected-element";
import { PlaitOptionsBoard, PlaitPluginOptions } from "./with-options";

export interface WithPluginOptions extends PlaitPluginOptions {
  isMultiple: boolean;
  isDisabledSelect: boolean;
}

export function withRectangleCreate(board: PlaitBoard) {
  const { pointerDown, pointerUp, pointerMove } = board;
  let start: Point | null = null;
  let selectionMovingG: SVGGElement | null = null;

  board.pointerDown = (event: PointerEvent) => {
    if (
      !PlaitBoard.isReadonly(board) &&
      PlaitBoard.isInPointer(board, ["rectangle"])
    ) {
      const point = toViewBoxPoint(board, toHostPoint(board, event.x, event.y));
      start = point;
      preventTouchMove(board, event, true);
    }

    pointerDown(event);
  };

  board.pointerMove = (event: PointerEvent) => {
    if (start && PlaitBoard.isInPointer(board, ["rectangle"])) {
      const movedTarget = toViewBoxPoint(
        board,
        toHostPoint(board, event.x, event.y)
      );
      const rectangle = RectangleClient.toRectangleClient([start, movedTarget]);
      selectionMovingG?.remove();
      selectionMovingG = drawRectangle(board, rectangle, {
        stroke: "#000",
        strokeWidth: 1,
        fillStyle: "solid",
      });
      PlaitBoard.getElementActiveHost(board).append(selectionMovingG);
    }
    pointerMove(event);
  };

  board.pointerUp = (event: PointerEvent) => {
    if (PlaitBoard.isInPointer(board, ["rectangle"]) && start) {
      const targetPoint = toViewBoxPoint(
        board,
        toHostPoint(board, event.x, event.y)
      );
      const points = RectangleClient.getPoints(
        RectangleClient.getRectangleByPoints([start!, targetPoint])
      );

      const element = {
        id: idCreator(),
        type: "geometry",
        shape: "rectangle",
        points,
      };
      Transforms.insertNode(board, element, [board.children.length]);
      clearSelectedElement(board);
      addSelectedElement(board, element);
      selectionMovingG?.remove();
      selectionMovingG = null;
      start = null;
      preventTouchMove(board, event, false);
      return;
    }
    pointerUp(event);
  };

  return board;
}
