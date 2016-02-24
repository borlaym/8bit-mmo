import { SPRITE_WIDTH } from '../SpriteSheet'

export const FILTER_NO_FILTER = 'FILTER_NO_FILTER'
export const FILTER_OUTLINE = 'FILTER_OUTLINE'
export const FILTER_SILHOUETTE = 'FILTER_SILHOUETTE'
export const FILTER_INVERSE = 'FILTER_INVERSE'

const _NEIGHBOUR_DIRECTIONS = [
  [-1, -1], [0, -1], [0, 1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1]
]

/**
 * Turn an image into a single color silhouette
 * @param  {Array} targetColor Array of RGB values
 * @param  {ImageData} imageData   The original image data
 * @return {ImageData}             The modified image data
 */
const _applySilhouette = (targetColor, imageData) => {
  let data = imageData.data
  for (let i = 0; i < data.length / 4; i++) {
    var colors = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]
    if (colors[0] || colors[1]|| colors[2]) {
      data[i * 4] = targetColor[0]
      data[i * 4 + 1] = targetColor[1]
      data[i * 4 + 2] = targetColor[2]
    }
  }
  return imageData
}

/**
 * Draw an outline of the image with the given color
 * @param  {Array} targetColor Array of RGB values
 * @param  {ImageData} imageData   The original image data
 * @return {ImageData}             The modified image data
 */
const _applyOutline = (targetColor, imageData) => {
  // We only need to check alphas for this one
  let originalAlphas = imageData.data.filter((value, index) => index % 4 === 3)
  let data = imageData.data
  for (var i = 0; i < originalAlphas.length; i++) {
    // Don't do anyting on empty pixels
    if (originalAlphas[i] === 0) continue
    const pixelPositionY = Math.floor(i / SPRITE_WIDTH)
    const pixelPositionX = i - pixelPositionY * SPRITE_WIDTH
    // Check ALL neighbouring pixels. If at least one is transparent, set this pixel as full, otherwise as empty
    let hasEmptyNeighbour = false
    for (var j = 0; j < _NEIGHBOUR_DIRECTIONS.length; j++) {
      const neighbourPositionX = pixelPositionX + _NEIGHBOUR_DIRECTIONS[j][0]
      const neighbourPositionY = pixelPositionY + _NEIGHBOUR_DIRECTIONS[j][1]
      const indexInDataArray = neighbourPositionY * SPRITE_WIDTH + neighbourPositionX
      if (originalAlphas[indexInDataArray] === 0 || !originalAlphas[indexInDataArray]) {
        // Treat out of bounds as empty space
        hasEmptyNeighbour = true
        break
      }
    }
    if (hasEmptyNeighbour) {
      data[i * 4] = targetColor[0]
      data[i * 4 + 1] = targetColor[1]
      data[i * 4 + 2] = targetColor[2]
    } else {
      data[i * 4 + 3] = 0
    }
  }
  return imageData
}

/**
 * Invert the non-transparent colors of the image
 * @param  {null} _         Not used
 * @param  {ImageData} imageData Original image data
 * @return {ImageData}           Modified image data
 */
const _applyInverse = (_, imageData) => {
  let data = imageData.data
  for (let i = 0; i < data.length / 4; i++) {
    if (data[i * 4 + 3] > 0) {
      data[i * 4] = 255 - data[i * 4]
      data[i * 4 + 1] = 255 - data[i * 4 + 1]
      data[i * 4 + 2] = 255 - data[i * 4 + 2]
    }
  }
  return imageData
}

export default {
  [FILTER_NO_FILTER]: (imageData) => imageData,
  [FILTER_OUTLINE]: _applyOutline,
  [FILTER_SILHOUETTE]: _applySilhouette,
  [FILTER_INVERSE]: _applyInverse
}
