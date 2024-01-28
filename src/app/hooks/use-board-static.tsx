import { createContext, useContext } from 'react'
import { PlaitBoard } from '../interfaces/board'

/**
 * A React context for sharing the board object.
 */

export const BoardContext = createContext<PlaitBoard | null>(null)

/**
 * Get the current board object from the React context.
 */

export const useBoardStatic = (): PlaitBoard => {
  const board = useContext(BoardContext)

  if (!board) {
    throw new Error(
      `The \`useBoardStatic\` hook must be used inside the <Board> component's context.`
    )
  }

  return board
}
