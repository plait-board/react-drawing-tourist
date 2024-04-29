import { BasicShapes, FlowchartSymbols, PlaitGeometry } from './geometry';
import { PlaitImage } from './image';
import { PlaitText } from './text';

export * from './geometry';
export * from './text';
export * from './element';

export type PlaitDrawElement = PlaitGeometry | PlaitImage;

export type PlaitShapeElement = PlaitGeometry | PlaitImage;

export const PlaitDrawElement = {
    isGeometry: (value: any): value is PlaitGeometry => {
        return value.type === 'geometry';
    },
    isText: (value: any): value is PlaitText => {
        return value.type === 'geometry' && value.shape === BasicShapes.text;
    },
    isImage: (value: any): value is PlaitImage => {
        return value.type === 'image';
    },
    isDrawElement: (value: any): value is PlaitDrawElement => {
        if (PlaitDrawElement.isGeometry(value) || PlaitDrawElement.isImage(value)) {
            return true;
        } else {
            return false;
        }
    },
    isShapeElement: (value: any): value is PlaitShapeElement => {
        return PlaitDrawElement.isImage(value) || PlaitDrawElement.isGeometry(value);
    },
    isBasicShape: (value: any) => {
        return Object.keys(BasicShapes).includes(value.shape);
    },
    isFlowchart: (value: any) => {
        return Object.keys(FlowchartSymbols).includes(value.shape);
    }
};
