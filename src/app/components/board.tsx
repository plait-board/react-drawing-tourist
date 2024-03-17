"use client";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import rough from "roughjs";
import useBoardEvent from "../hooks/use-board-event";
import { BoardContext } from "../hooks/use-board-static";
import useChildren from "../hooks/use-children";
import { useIsomorphicLayoutEffect } from "../hooks/use-isomorphic-layout-effect";
import {
  PlaitBoard,
  PlaitBoardChangeEvent,
  PlaitBoardOptions,
  PlaitElement,
  PlaitPlugin,
  Viewport,
} from "../interfaces";
import { createBoard } from "../plugins/create-board";
import { withRectangle } from "../plugins/rectangle";
import { withBoard } from "../plugins/with-board";
import { withHandPointer } from "../plugins/with-hand";
import { withHistory } from "../plugins/with-history";
import { withHotkey } from "../plugins/with-hotkey";
import { withMoving } from "../plugins/with-moving";
import { withOptions } from "../plugins/with-options";
import { withSelection } from "../plugins/with-selection";
import { withViewport } from "../plugins/with-viewport";
import {
  initializeViewBox,
  initializeViewportContainer,
  initializeViewportOffset
} from "../utils";
import {
  BOARD_TO_ELEMENT_HOST,
  BOARD_TO_HOST,
  BOARD_TO_ON_CHANGE,
  BOARD_TO_ROUGH_SVG
} from "../utils/weak-maps";
import { Toolbar } from "./toolbar";

export type BoardProps = {
  initialValue: PlaitElement[];
  options: PlaitBoardOptions;
  plaitPlugins: PlaitPlugin[];
  plaitViewport: Viewport;
  onChange?: (event: PlaitBoardChangeEvent) => void;
  style?: React.CSSProperties;
  readOnly?: boolean;
  initializeCompleted?: (board: PlaitBoard) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const Children = (props: Parameters<typeof useChildren>[0]) => (
  <React.Fragment>{useChildren(props)}</React.Fragment>
);

export const Board = (props: BoardProps) => {
  const {
    initialValue = [],
    options,
    plaitPlugins,
    plaitViewport,
    onChange,
    initializeCompleted,
    readOnly = false,
    style: userStyle = {},
    ...attributes
  } = props;
  const hostRef = useRef<SVGSVGElement>(null);
  const elementHostRef = useRef<SVGGElement>(null);
  const elementUpperHostRef = useRef<SVGGElement>(null);
  const elementActiveHostRef = useRef<SVGGElement>(null);
  const viewContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [board, setBoard] = useState<PlaitBoard>({} as PlaitBoard);
  const isFocused = PlaitBoard.isFocus(board);

  useEffect(() => {
    const board = withRectangle(
      withHotkey(
        withHandPointer(
          withHistory(
            withSelection(
              withMoving(
                withBoard(
                  withViewport(withOptions(createBoard(initialValue, options)))
                )
              )
            )
          )
        )
      )
    );
    plaitPlugins.forEach((plugin) => {
      plugin(board);
    });
    if (plaitViewport) {
      board.viewport = plaitViewport;
    }
    const roughSVG = rough.svg(hostRef.current!, {
      options: { roughness: 0, strokeWidth: 1 },
    });
    BOARD_TO_ROUGH_SVG.set(board, roughSVG);
    BOARD_TO_ELEMENT_HOST.set(board, {
      host: elementHostRef.current!,
      upperHost: elementUpperHostRef.current!,
      activeHost: elementActiveHostRef.current!,
      container: containerRef.current!,
      viewportContainer: viewContainerRef.current!,
    });
    BOARD_TO_HOST.set(board, hostRef.current!);
    initializeViewportContainer(board);
    initializeViewBox(board);
    initializeViewportOffset(board);
    setBoard(board);
    if (initializeCompleted) {
      initializeCompleted(board);
    }
  }, []);

  const onContextChange = useCallback(() => {
    const changeEvent: PlaitBoardChangeEvent = {
      children: board.children,
      operations: board.operations,
      viewport: board.viewport,
      selection: board.selection,
    };
    if (onChange) {
      onChange(changeEvent);
    }
  }, [board]);

  useEffect(() => {
    BOARD_TO_ON_CHANGE.set(board, onContextChange);

    return () => {
      BOARD_TO_ON_CHANGE.set(board, () => {});
    };
  }, [board, onContextChange]);

  useBoardEvent({ board, hostRef, isFocused });

  useIsomorphicLayoutEffect(() => {
    // global listener
    // document.addEventListener("focusin", fn);
    // document.addEventListener("focusout", fn);
    // return () => {
    //   document.removeEventListener("focusin", fn);
    //   document.removeEventListener("focusout", fn);
    // };
  }, []);

  return (
    <BoardContext.Provider value={board}>
      <div className="plait-board plait-board-container min-h-screen" ref={containerRef}>
        <div
          className="viewport-container"
          ref={viewContainerRef}
          style={{ width: "100%", height: "100%", overflow: "auto" }}
        >
          <svg
            ref={hostRef}
            width="100%"
            height="100%"
            style={{ position: "relative" }}
            className="board-host-svg"
          >
            <g className="element-host" ref={elementHostRef}>
              {board && <Children node={board} />}
            </g>
            <g className="element-upper-host" ref={elementUpperHostRef}></g>
            <g className="element-active-host" ref={elementActiveHostRef}></g>
          </svg>
        </div>
        <Toolbar></Toolbar>
      </div>
    </BoardContext.Provider>
  );
};
