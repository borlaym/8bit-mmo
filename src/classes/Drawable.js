/* @flow */

import SpriteSheet, { SPRITE_WIDTH, SPRITE_HEIGHT, CHARACTER_ACTION_WALK } from './SpriteSheet'
import { SOUTH } from './Direction'
import Filters, { FILTER_NO_FILTER } from '../utils/Filters'

/**
 * This class is only responsible for rendering an object with given parameters.
 * Matches the parameters to their SpriteSheet and renders the result in a canvas element
 * Also handles different effects the object can have
 * Its canvas property can be used to render the object's current representation at any given time
 */
class Drawable {

  spritesheet: SpriteSheet;
  canvas: HTMLCanvasElement;
  ctx: any;
  state: {
    direction: string,
    action: string,
    frame: number,
    filter: string,
    filterColor: Array<number>
  };

  constructor (props: {spritesheet: SpriteSheet}) {
    this.spritesheet = props.spritesheet
    this.canvas = document.createElement('canvas')
    this.canvas.width = SPRITE_WIDTH
    this.canvas.height = SPRITE_HEIGHT
    this.ctx = this.canvas.getContext('2d')
    this.state = {
      direction: SOUTH,
      action: CHARACTER_ACTION_WALK,
      frame: 0,
      filter: FILTER_NO_FILTER,
      filterColor: [255, 255, 255]
    }
    this.render()
  }

  /**
  * Render the object to an in-memory canvas based on the current state
  * @return {[type]} [description]
  */
  render () {
    const sourceCoordinates =
      this.spritesheet.getSpritePosition(this.state.direction, this.state.action, this.state.frame)
    this.spritesheet.load().then(() => {
      // If there is no filter, copy directly from the image
      if (this.state.filter === FILTER_NO_FILTER) {
        this.ctx.drawImage(
          this.spritesheet.image,
          sourceCoordinates[0],
          sourceCoordinates[1],
          SPRITE_WIDTH,
          SPRITE_HEIGHT,
          0,
          0,
          SPRITE_WIDTH,
          SPRITE_HEIGHT
        )
      } else {
        // If there is a filter that needs to be applied, copy the image data from the spritesheet
        // then apply the filter before drawing onto the main canvas
        const canvas: any = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        ctx.drawImage(
          this.spritesheet.image,
          sourceCoordinates[0],
          sourceCoordinates[1],
          SPRITE_WIDTH,
          SPRITE_HEIGHT,
          0,
          0,
          SPRITE_WIDTH,
          SPRITE_HEIGHT
        )
        const originalImageData = ctx.getImageData(
          sourceCoordinates[0],
          sourceCoordinates[1],
          SPRITE_WIDTH,
          SPRITE_HEIGHT
        )
        const filteredImageData = Filters[this.state.filter](this.state.filterColor, originalImageData)
        this.ctx.putImageData(filteredImageData, 0, 0)
      }
    })
  }

  /**
  * Set the direction, action, frame and other states of the object
  * @param {Object} state A hash containing values for direction, action, frame, filter, filterColor
  */
  setState (state: Object): void {
    this.state = {
      ...this.state,
      ...state
    }
    this.render()
  }

}

export default Drawable
