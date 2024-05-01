import { createContext, useContext } from 'react'
import { PlaitElement } from '../interfaces'

/**
 * A React context for sharing the board object.
 */

export const ElementContext = createContext<PlaitElement | null>(null)

/**
 * Get the current board object from the React context.
 */

export const useElementStatic = (): PlaitElement => {
  const element = useContext(ElementContext)

  if (!element) {
    throw new Error(
      `The \`useBoardStatic\` hook must be used inside the <Board> component's context.`
    )
  }

  return element
}
