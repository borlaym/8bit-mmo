export const NORTH = 'NORTH'
export const EAST = 'EAST'
export const SOUTH = 'SOUTH'
export const WEST = 'WEST'

/**
 * Aliases
 */
export const UP = NORTH
export const RIGHT = EAST
export const DOWN = SOUTH
export const LEFT = WEST

/**
 * Class for keeping static utility functions
 */
class Direction {}

Direction.toSpriteSheetColumn = (direction) => {
  switch (direction) {
    case NORTH:
      return 2
    case EAST:
      return 3
    case SOUTH:
      return 0
    case WEST:
      return 1
    default:
      console.warn('Invalid property passed to Direction.toSpriteSheetColumn: ', direction)
      return 0
  }
}

export default Direction
