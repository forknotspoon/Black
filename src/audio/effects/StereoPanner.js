/**
 * Allows to distribute sound between left and right channel.
 * 
 * @cat audio.effects
 * @extends {SoundEffect}
 */
/* @echo EXPORT */
class StereoPanner extends SoundEffect {

  /**
   * Creates new instance of StereoPan.
   */
  constructor() {
    super();

    /** @private @type {GainNode} */
    this.mGainL = MasterAudio._newGainNode();

    /** @private @type {GainNode} */
    this.mGainR = MasterAudio._newGainNode();

    /** @private @type {ChannelSplitterNode} */
    this.mSplitter = MasterAudio.context.createChannelSplitter(2);
    
    /** @private @type {ChannelMergerNode} */
    this.mMerger = MasterAudio.context.createChannelMerger(2);

    this.mSplitter.connect(this.mGainL, 0);
    this.mSplitter.connect(this.mGainR, 1);
    this.mGainL.connect(this.mMerger, 0, 0);
    this.mGainR.connect(this.mMerger, 0, 1);

    /** @private @type {number} */
    this.mValue = 0;

    /** @inheritDoc */
    this.mInputNode = this.mSplitter;

    /** @inheritDoc */
    this.mOutputNode = this.mMerger;
  }

  /**
   * @ignore
   * @public
   * @param {number} value
   * @returns {void}
   */
  set pan(value) {
    this.mValue = MathEx.clamp(value, -1, 1);
    this.mGainL.gain.setValueAtTime(1 - MathEx.clamp(this.mValue, 0, 1), 0);
    this.mGainR.gain.setValueAtTime(1 + MathEx.clamp(this.mValue, -1, 0), 0);
  }

  /**
   * Sets/Gets stereo panning value
   * 
   * @public
   * @returns {number}
   */
  get pan() {
    return this.mValue;
  }
}