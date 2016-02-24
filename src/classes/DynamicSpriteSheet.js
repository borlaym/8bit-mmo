import SpriteSheet from './SpriteSheet'

/**
 * A class for assempling a custom spritesheet based on parameters
 */
class DynamicSpriteSheet extends SpriteSheet {

  load () {
    return Promise.all(this.layers)
  }

}

export default DynamicSpriteSheet
