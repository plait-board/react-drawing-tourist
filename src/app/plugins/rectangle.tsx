import { PlaitBoard, Point, RenderElementProps } from "../interfaces";

export const rectanglePlugin = (board: PlaitBoard) => {
    const { drawElement } = board;
    board.drawElement = (props: RenderElementProps) => {
        if (props.element.type === 'geometry' && props.element.shape === 'rectangle') {
            const element = props.element;
            const [start, realEnd] = element.points as Point[];
            const width = Math.abs(realEnd[0] - start[0]);
            let height = Math.abs(realEnd[1] - start[1]);
            return <g><rect width={width} height={height} /></g>
        }
        return drawElement(props)
    }
    return board;
}