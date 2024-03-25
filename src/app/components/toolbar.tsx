import React, { ReactNode, Ref, PropsWithChildren } from "react";
import ReactDOM from "react-dom";
import { RectangleIcon, SelectionIcon, handIcon } from "./icon";
import { PlaitBoard, PlaitPointerType } from "../interfaces";
import { DrawPointerType } from "../plugins/with-rectangle";
import { BoardTransforms } from "../transforms/board";

type ToolActionProps = {
  icon?: React.ReactNode;
  active: boolean;
  [key: string]: unknown;
  onPointerDown: any;
};

export const ToolAction = (props: ToolActionProps) => {
  const className = `action-item ${props.active ? ` active` : ""}`;
  return (
    <a className={className} onPointerDown={props.onPointerDown}>
      {props.icon}
    </a>
  );
};

type PointerType = PlaitPointerType | DrawPointerType | string;

export const actionHandle = (board: PlaitBoard, pointer: PointerType) => {
  BoardTransforms.updatePointerType<PointerType>(board, pointer);
};

export const Toolbar = (props: {
  board: PlaitBoard;
  pointer: PointerType | string;
  updatePointer: (pointer: PointerType | string) => void
}) => {
  const { board, pointer } = props;
  return (
    <div className="plait-island-container app-main-toolbar">
      <ToolAction
        icon={handIcon}
        active={pointer === PlaitPointerType.hand}
        onPointerDown={(event: MouseEvent) => {
          event.preventDefault();
          actionHandle(board, PlaitPointerType.hand);
          props.updatePointer(PlaitPointerType.hand);
        }}
      ></ToolAction>
      <ToolAction
        icon={SelectionIcon}
        active={props.pointer === PlaitPointerType.selection}
        onPointerDown={(event: MouseEvent) => {
          event.preventDefault();
          actionHandle(props.board, PlaitPointerType.selection);
          props.updatePointer(PlaitPointerType.selection);
        }}
      ></ToolAction>
      <ToolAction
        icon={RectangleIcon}
        active={props.pointer === DrawPointerType.rectangle}
        onPointerDown={(event: MouseEvent) => {
          event.preventDefault();
          actionHandle(props.board, DrawPointerType.rectangle);
          props.updatePointer(DrawPointerType.rectangle);
        }}
      ></ToolAction>
    </div>
  );
};
