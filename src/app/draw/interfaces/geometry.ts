
import { StrokeStyle } from './element';
import { PlaitElement, Point } from '@/app/interfaces';
import { Element } from 'slate';

export enum BasicShapes {
    rectangle = 'rectangle',
    ellipse = 'ellipse',
    diamond = 'diamond',
    roundRectangle = 'roundRectangle',
    parallelogram = 'parallelogram',
    text = 'text',
    triangle = 'triangle',
    leftArrow = 'leftArrow',
    trapezoid = 'trapezoid',
    rightArrow = 'rightArrow',
    cross = 'cross',
    star = 'star',
    pentagon = 'pentagon',
    hexagon = 'hexagon',
    octagon = 'octagon',
    pentagonArrow = 'pentagonArrow',
    processArrow = 'processArrow',
    twoWayArrow = 'twoWayArrow',
    comment = 'comment',
    roundComment = 'roundComment',
    cloud = 'cloud'
}

export enum FlowchartSymbols {
    process = 'process',
    decision = 'decision',
    data = 'data',
    connector = 'connector',
    terminal = 'terminal',
    manualInput = 'manualInput',
    preparation = 'preparation',
    manualLoop = 'manualLoop',
    merge = 'merge',
    delay = 'delay',
    storedData = 'storedData',
    or = 'or',
    summingJunction = 'summingJunction',
    predefinedProcess = 'predefinedProcess',
    offPage = 'offPage'
}

export type GeometryShapes = BasicShapes | FlowchartSymbols;

export interface PlaitGeometry extends PlaitElement {
    points: [Point, Point];
    type: 'geometry';
    shape: GeometryShapes;

    text: Element;

    textHeight: number;

    // node style attributes
    fill?: string;
    strokeColor?: string;
    strokeWidth?: number;
    strokeStyle?: StrokeStyle;

    angle: number;
    opacity: number;
}

export interface PlaitRectangle extends PlaitGeometry {
    shape: BasicShapes.rectangle;
}

export interface PlaitEllipse extends PlaitGeometry {
    shape: BasicShapes.ellipse;
}

export interface PlaitDiamond extends PlaitGeometry {
    shape: BasicShapes.diamond;
}

export const PlaitGeometry = {};
