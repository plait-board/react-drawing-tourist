import { useEventListener } from "ahooks";
import { RefObject } from "react";
import { PlaitBoard } from "../interfaces";
import {
  BOARD_TO_MOVING_POINT_IN_BOARD,
  BOARD_TO_MOVING_POINT,
  getSelectedElements,
  getRectangleByElements,
  toViewBoxPoint,
  toHostPoint,
  getClipboardData,
  hasInputOrTextareaTarget,
} from "../utils";

const useBoardEvent = (props: {
  board: PlaitBoard;
  hostRef: RefObject<SVGSVGElement>;
  isFocused: boolean;
}) => {
  const { board, hostRef, isFocused } = props;

  useEventListener(
    "mousedown",
    (event) => {
      board.mousedown(event);
    },
    { target: hostRef }
  );

  useEventListener(
    "pointerdown",
    (event) => {
      board.pointerDown(event);
    },
    { target: hostRef }
  );

  useEventListener(
    "mousemove",
    (event) => {
      BOARD_TO_MOVING_POINT_IN_BOARD.set(board, [event.x, event.y]);
      board.mousemove(event);
    },
    { target: hostRef }
  );

  useEventListener(
    "pointermove",
    (event) => {
      BOARD_TO_MOVING_POINT_IN_BOARD.set(board, [event.x, event.y]);
      board.pointerMove(event);
    },
    { target: hostRef }
  );

  useEventListener(
    "mouseleave",
    (event) => {
      BOARD_TO_MOVING_POINT_IN_BOARD.delete(board);
      board.mouseleave(event);
    },
    { target: hostRef }
  );

  useEventListener(
    "pointerleave",
    (event) => {
      BOARD_TO_MOVING_POINT_IN_BOARD.delete(board);
      board.pointerLeave(event);
    },
    { target: hostRef }
  );

  useEventListener(
    "mouseup",
    (event) => {
      board.mouseup(event);
    },
    { target: hostRef }
  );

  useEventListener(
    "pointerup",
    (event) => {
      board.pointerUp(event);
    },
    { target: hostRef }
  );

  useEventListener(
    "dblclick",
    (event) => {
      if (isFocused && !PlaitBoard.hasBeenTextEditing(board)) {
        board.dblClick(event);
      }
    },
    { target: hostRef }
  );

  useEventListener("mousemove", (event) => {
    BOARD_TO_MOVING_POINT.set(board, [event.x, event.y]);
    board.globalMousemove(event);
  });

  useEventListener("pointermove", (event) => {
    BOARD_TO_MOVING_POINT.set(board, [event.x, event.y]);
    board.globalPointerMove(event);
  });

  useEventListener("mouseup", (event) => {
    board.globalMouseup(event);
  });

  useEventListener("pointerup", (event) => {
    board.globalPointerUp(event);
  });

  useEventListener("keydown", (event) => {
    board.globalKeyDown(event);
    if (
      isFocused &&
      !PlaitBoard.hasBeenTextEditing(board) &&
      !hasInputOrTextareaTarget(event.target)
    ) {
      board.keyDown(event);
    }
  });

  useEventListener("keyup", (event) => {
    if (isFocused && !PlaitBoard.hasBeenTextEditing(board)) {
      board?.keyUp(event);
    }
  });

  useEventListener("copy", (event) => {
    if (isFocused && !PlaitBoard.hasBeenTextEditing(board)) {
      const selectedElements = getSelectedElements(board);
      event.preventDefault();
      const rectangle = getRectangleByElements(board, selectedElements, false);
      board.setFragment(event.clipboardData, null, rectangle, "copy");
    }
  });

  useEventListener("paste", async (clipboardEvent) => {
    if (
      isFocused &&
      !PlaitBoard.isReadonly(board) &&
      !PlaitBoard.hasBeenTextEditing(board)
    ) {
      const mousePoint = PlaitBoard.getMovingPointInBoard(board);
      if (mousePoint) {
        const targetPoint = toViewBoxPoint(
          board,
          toHostPoint(board, mousePoint[0], mousePoint[1])
        );
        const clipboardData = await getClipboardData(
          clipboardEvent.clipboardData
        );
        board.insertFragment(
          clipboardEvent.clipboardData,
          clipboardData,
          targetPoint
        );
      }
    }
  });

  useEventListener("cut", (event) => {
    if (
      isFocused &&
      !PlaitBoard.isReadonly(board) &&
      !PlaitBoard.hasBeenTextEditing(board)
    ) {
      const selectedElements = getSelectedElements(board);
      event.preventDefault();
      const rectangle = getRectangleByElements(board, selectedElements, false);
      board.setFragment(event.clipboardData, null, rectangle, "cut");
      board.deleteFragment(event.clipboardData);
    }
  });
};

export default useBoardEvent;
