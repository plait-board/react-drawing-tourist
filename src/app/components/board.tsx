import React, {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import useChildren from "../hooks/use-children";
import { BoardContext } from "../hooks/use-board-static";
import {
  PlaitBoard,
  PlaitBoardChangeEvent,
  PlaitBoardOptions,
  PlaitElement,
  PlaitPlugin,
  Viewport,
} from "../interfaces";
import { withHistory } from "../plugins/with-history";
import { createBoard } from "../plugins/create-board";
import { withOptions } from "../plugins/with-options";
import { withViewport } from "../plugins/with-viewport";
import { withBoard } from "../plugins/with-board";
import { withMoving } from "../plugins/with-moving";
import { withSelection } from "../plugins/with-selection";
import { withHandPointer } from "../plugins/with-hand";
import { withHotkey } from "../plugins/with-hotkey";
import { useIsomorphicLayoutEffect } from "../hooks/use-isomorphic-layout-effect";
import { BOARD_TO_ON_CHANGE, BOARD_TO_ROUGH_SVG } from "../utils/weak-maps";
import { rectanglePlugin } from "../plugins/rectangle";
import rough from "roughjs";

export type BoardProps = {
  initialValue: PlaitElement[];
  options: PlaitBoardOptions;
  plaitPlugins: PlaitPlugin[];
  plaitViewport: Viewport;
  onChange?: (event: PlaitBoardChangeEvent) => void;
  style?: React.CSSProperties;
  readOnly?: boolean;
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
    readOnly = false,
    style: userStyle = {},
    ...attributes
  } = props;

  const hostRef = useRef<SVGSVGElement>();

  const board = useMemo(() => {
    const board = rectanglePlugin(withHotkey(
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
    ));
    plaitPlugins.forEach((plugin) => {
      plugin(board);
    });
    if (plaitViewport) {
      board.viewport = plaitViewport;
    }
    return board;
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
    const roughSVG = rough.svg(hostRef.current as SVGSVGElement, {
      options: { roughness: 0, strokeWidth: 1 }
    });
    BOARD_TO_ROUGH_SVG.set(board, roughSVG);

    return () => {
      BOARD_TO_ON_CHANGE.set(board, () => {});
      BOARD_TO_ROUGH_SVG.delete(board);
    };
  }, [board, onContextChange]);

  useLayoutEffect(() => {
    // 在当前组件渲染完成后获取当前组件的DOM
    console.log(hostRef.current);
  }, []);

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
      <div>
        <div className="viewport-container">
          <svg
            ref={hostRef as RefObject<SVGSVGElement>}
            width="100%"
            height="100%"
            style={{ position: "relative" }}
            className="board-host-svg"
          >
            <g className="element-host">
              <Children node={board} />
            </g>
            <g className="element-upper-host"></g>
            <g className="element-active-host"></g>
          </svg>
        </div>
      </div>
    </BoardContext.Provider>
  );
};
