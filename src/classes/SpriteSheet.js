/* @flow */

import Direction from './Direction'

export const SPRITE_WIDTH = 16
export const SPRITE_HEIGHT = 16

export const CHARACTER_ACTION_WALK = 'CHARACTER_ACTION_WALK'
export const CHARACTER_ACTION_ATTACK = 'CHARACTER_ACTION_ATTACK'
export const CHARACTER_ACTION_CUSTOM_1 = 'CHARACTER_ACTION_CUSTOM_1'
export const CHARACTER_ACTION_CUSTOM_2 = 'CHARACTER_ACTION_CUSTOM_2'

var _imageCache = window._imageCache = {}

const imageSrc = 'client/img/'
const imageExt = '.png'

/**
 * Translate a given action name to the row of the spritesheet that action is found in
 * @param  {String} actionName
 * @return {Number}
 */
const _actionToRow = (actionName) => {
  switch (actionName) {
    case CHARACTER_ACTION_WALK:
      return 0
    case CHARACTER_ACTION_ATTACK:
      return 2
    case CHARACTER_ACTION_CUSTOM_1:
      return 3
    case CHARACTER_ACTION_CUSTOM_2:
      return 4
    default:
      console.warn('Invalid property passed in as action: ', actionName)
      return 0
  }
}

/**
 * Simple class for managing a single stylesheet
 * Sprites are arranged in a given order on a spritesheet.
 * Each column corresponds to the direction the object is facing
 * Each row has a different action or different frames of an action
 */
class SpriteSheet {

  fileName: string = '';
  image: ?Image = null;

  constructor (props: {fileName: string}): void {
    this.fileName = props.fileName
    this.load()
  }

  /**
  * Loads the source image into an image cache
  * @return {Promise}
  */
  load (): Promise {
    _imageCache[this.fileName] = new Image()
    this.image = _imageCache[this.fileName]
    return new Promise((resolve, reject) => {
      _imageCache[this.fileName].onload = resolve
      _imageCache[this.fileName].src = imageSrc + this.fileName + imageExt
    })
  }

  /**
  * Get the x and y coordinates of a sprite with the given parameters
  * @param  {String} direction Direction constant values
  * @param  {String} action    Action constant values
  * @param  {Number} frame     Which frame of the given action to display (0 or 1)
  * @return {Array}           x and y coordinates of the sprite on this spritesheet
  */
  getSpritePosition (direction: string, action: string, frame: number): Array<number> {
    const column = Direction.toSpriteSheetColumn(direction)
    const row = _actionToRow(action) + frame
    return [column * SPRITE_WIDTH, row * SPRITE_HEIGHT]
  }

}

export default SpriteSheet
