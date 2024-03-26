import React, { ReactNode, Ref, PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';
import { RectangleIcon, SelectionIcon, handIcon } from './icon';

type ToolActionProps = {
  icon?: React.ReactNode;
}

export const ToolAction = (props: ToolActionProps) => {
  return (<a className='action-item'>
    { props.icon }
  </a>)
}

export const Toolbar = () => {
  return (<div className='plait-island-container app-main-toolbar'>
    <ToolAction icon={handIcon}></ToolAction>
    <ToolAction icon={SelectionIcon}></ToolAction>
    <ToolAction icon={RectangleIcon}></ToolAction>
  </div>);
}