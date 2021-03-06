/**
 * A simple object pool class. Used to avoid GC.
 * 
 * @cat utils
 * @ignore
 */
/* @echo EXPORT */
class ObjectPool {
  /**
   * Creates new ObjectPool instance.
   * @param {Function} type 
   * @param {number} capacity 
   */
  constructor(type, capacity = 100) {
    /** @type {Array<*>} */
    this.mReleased = [];

    /** @type {number} */
    this.mCapacity = capacity;

    /** @type {Function} */
    this.mType = type;
  }

  /**
   * Gets/Sets capacity of the pool.
   * 
   * @returns {number}
   */
  get capacity() {
    return this.mCapacity;
  }

  /**
   * @ignore
   * @param {number} value
   */
  set capacity(value) {
    Debug.assert(value !== 0, 'Capacity cannot be equal to zero.');
    Debug.assert(value > -1, 'Capacity cannot be smaller then -1.');

    this.mCapacity = value;

    if (this.mCapacity > this.mReleased.length)
      this.mReleased.splice(0, this.mReleased.length - this.mCapacity);
  }

  /**
   * Releases all objects from the pool.
   */
  releaseAll() {
    this.mReleased.splice(0, this.mReleased.length);
  }

  /**
   * Returns new object instance or an object from the pool.
   */
  get() {
    return this.mReleased.length > 0 ? this.mReleased.pop() : new this.mType();
  }

  /**
   * Releases given object.
   * 
   * @param {*} object 
   */
  release(object) {
    if (this.mCapacity === -1 || this.mReleased.length < this.mCapacity)
      this.mReleased.push(object);
  }
}