import { NODE_TO_PARENT } from '../utils';
import { PlaitBoard } from './board';
import { Point } from './point';

export interface PlaitElement {
    [key: string]: any;
    id: string;
    children?: PlaitElement[];
    points?: Point[];
    type?: string;
}

export const PlaitElement = {
    isRootElement(value: PlaitElement) {
        const parent = NODE_TO_PARENT.get(value);
        if (parent && PlaitBoard.isBoard(parent)) {
            return true;
        } else {
            return false;
        }
    }
};

export interface ComponentType<T> {
    new (...args: any[]): T;
}

export interface ImageEntry {
    url: string;
    file: File;
}
