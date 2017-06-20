// TODO:
// [_] Do not handle is loaded or not.
// Texture shall not be responsible for loading itself.
// We have TextureAsset for it.
// native size - always the size of physical texture
// source size - the original size of a texture to
//

/**
 * A number scatter for defining a range in 2D space.
 *
 * @cat video
 * @extends Scatter
 */
/* @echo EXPORT */
class Texture {
  /**
   * Creates new Texture instance.
   * @param  {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} nativeTexture A source of the texture.
   * @param  {Rectangle=} region = undefined                                     A region to be drawn.
   * @param  {Rectangle=} untrimmedRect = undefined                              Actual size of a texture when not trimmed.
   */
  constructor(nativeTexture, region, untrimmedRect) {
    /**
     * @private
     * @type {Image}
     */
    this.mTexture = nativeTexture;

    /**
     * @private
     * @type {Rectangle}
     */
    this.mRegion;

    /**
     * @private
     * @type {boolean}
     */
    this.mIsSubtexture = false;

    /**
     * @private
     * @type {number}
     */
    this.mId = ++Texture.__ID;

    if (region === undefined) {
      if(nativeTexture instanceof HTMLImageElement)
        this.mRegion = new Rectangle(0, 0, nativeTexture.naturalWidth, nativeTexture.naturalHeight);
      else
        this.mRegion = new Rectangle(0, 0, nativeTexture.width, nativeTexture.height);
    } else {
      this.mRegion = /** @type {Rectangle} */ (region);
      this.mIsSubtexture = true;
    }

    /**
     * @private
     * @type {boolean}
     */
    this.mTrimmed = untrimmedRect !== undefined;

    if (this.mTrimmed === false)
      untrimmedRect = new Rectangle(0, 0, this.mRegion.width, this.mRegion.height);

    /**
     * @private
     * @type {Rectangle}
     */
    this.mUntrimmedRect = /** @type {Rectangle} */ (untrimmedRect);

    /**
     * @private
     * @type {boolean}
     */
    this.mIsLoaded = true;

    let w = nativeTexture.naturalWidth || nativeTexture.width;
    let h = nativeTexture.naturalHeight || nativeTexture.height;

    this.mRelativeRegion = new Rectangle(
      this.mRegion.x / w,
      this.mRegion.y / h,
      this.mRegion.width / w,
      this.mRegion.height / h
    );

    this.mRelativeRegion.top = this.mRelativeRegion.top;
    this.mRelativeRegion.left = this.mRelativeRegion.left;
    this.mRelativeRegion.right = this.mRelativeRegion.right;
    this.mRelativeRegion.bottom = this.mRelativeRegion.bottom;
  }

  get relativeRegion() {
    return this.mRelativeRegion;
  }

  /**
   * Returns the unique id of this texture.
   *
   * @return {number}
   */
  get id() {
    return this.mId;
  }

  /**
   * Returns True if this texture has been trimmed.
   *
   * @return {boolean}
   */
  get isTrimmed() {
    return this.mTrimmed;
  }

  /**
   * Returns True if this texture is a part of other Texture object
   *
   * @return {boolean} Description
   */
  get isSubTexture() {
    return this.mIsSubtexture;
  }

  // TODO: if we update texture we have to nofity everything, send signal
  // update(nativeTexture = null, region = null, source = null, crop = null){
  // }

  // render width
  // render height
  // croppedWidth, croppedHeight
  // width, height
  //

  /**
   * Returns a Rect object representing the untrimmed size and position of this
   * texture withing other texture if so.
   *
   * @return {Rectangle}
   */
  get untrimmedRect() {
    return this.mUntrimmedRect;
  }

  /**
   * The width of this texture.
   *
   * @return {number}
   */
  get width() {
    if (this.mRegion)
      return this.mRegion.width;

    return this.mTexture.naturalWidth;
  }

  /**
   * The width of this texture.
   *
   * @return {number}
   */
  get height() {
    if (this.mRegion)
      return this.mRegion.height;

    return this.mTexture.naturalHeight;
  }

  /**
   * If isSubTexture, returns the physical region inside parent texture.
   *
   * @return {Rectangle}
   */
  get region() {
    return this.mRegion;
  }

  /**
   * Returns native object. Usually DOM Image element.
   *
   * @return {Image}
   */
  get native() {
    return this.mTexture;
  }

  /**
   * True if fully loaded and ready.
   *
   * @return {boolean}
   */
  get isLoaded() {
    return this.mIsLoaded;
  }

  /**
   * Dispose and releases all resources related to this texture.
   *
   * @return {void}
   */
  dispose() {
    this.mTexture = null;
  }

  /**
   * @ignore
   *
   * @param {string} string
   *
   * @return {Texture}
   */
  static fromBase64String(string) {
    let imgElement = new Image();
    imgElement.src = string;
    return new Texture(imgElement);
  }


  /**
   * @ignore
   *
   * @param {HTMLElement}   canvas
   * @param {string} [type=image/png]
   * @param {number} [quality=1]
   *
   * @return {Texture}
   */
  static fromCanvasAsImage(canvas, type = 'image/png', quality = 1) {
    let imgElement = new Image();
    imgElement.src = canvas.toDataURL(type, quality);

    return new Texture(imgElement);
  }

  /**
   * @ignore
   *
   * @param {HTMLElement} canvas
   *
   * @return {Texture}
   */
  static fromCanvas(canvas) {
    return Black.instance.video.getTextureFromCanvas(canvas);
  }
}

/**
 * @private
 * @type {number}
 * @nocollapse
 */
Texture.__ID = 0;

/**
 * @private
 * @type {Image|null}
 * @nocollapse
 */
Texture.MISSING_IMAGE_CACHE = null;
