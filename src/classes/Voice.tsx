import helpers from '../helpers';
import { IVoiceOptions, ISynthSettings } from '../Interfaces';

class Voice {
  readonly context: AudioContext;
  readonly parent: AudioNode;
  readonly osc: OscillatorNode;
  readonly gain: GainNode;

  private _index: number;
  private _octave: number;
  private _enabled: boolean;
  private _waveform: OscillatorType;

  get index() : number { return this._index; }
  get octave() : number { return this._octave; }
  get enabled() : boolean { return this._enabled; }
  get waveform() : OscillatorType { return this._waveform; }

  get frequency() : number { return helpers.synth.indexToFrequency(this._index + this._octave * 12); }

  constructor (context: AudioContext, parent: AudioNode, settings: ISynthSettings, index: number) {
    /* set up properties */
    this._index = index;
    this._octave = settings.octave.value;
    this._enabled = settings.enabled.value;
    this._waveform = settings.waveform.value as OscillatorType;

    /* set up AudioContext system */
    this.context = context;
    this.parent = parent;
    
    this.osc = context.createOscillator();
    this.osc.type = this._waveform;
    this.osc.frequency.value = this.frequency;

    this.gain = context.createGain();
    this.gain.gain.value = 1;
    this.gain.connect(parent);
    
    this.osc.connect(this.gain);
    this.osc.start();
  }

  updateVoice (options: IVoiceOptions) {
    if (typeof options.index !== 'undefined') {
      this._index = options.index;
      this.osc.frequency.value = this.frequency;
    }

    if (typeof options.octave !== 'undefined') {
      this._octave = options.octave;
      this.osc.frequency.value = this.frequency;
    }

    if (typeof options.waveform !== 'undefined') {
      this.osc.type = options.waveform as OscillatorType;
    }

    if (typeof options.enabled !== 'undefined') {
      this._enabled = options.enabled;
      this.gain.gain.value = +options.enabled;
    }
  }
}

export default Voice;