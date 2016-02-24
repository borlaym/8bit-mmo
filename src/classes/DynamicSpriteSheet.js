/* @flow */

import SpriteSheet from './SpriteSheet'

/**
 * A class for assempling a custom spritesheet based on parameters
 */
class DynamicSpriteSheet extends SpriteSheet {

  layers: Array<Promise>;

  load (): Promise {
    return Promise.all(this.layers)
  }

}

export default DynamicSpriteSheet
