import React, {useRef} from 'react';
import { keys } from 'ts-transformer-keys';
import SynthKeyboard from './SynthKeyboard';
import SynthSettings from './SynthSettings';
import helpers from '../helpers';

import './styles/Synth.css';

interface SynthOption<T> {
  value: T;
  change: (value: T) => void;
}

interface IDictionary {
  [key: string]: any;
}

interface ISynthSettings {
  waveform: SynthOption<string>;
  volume: SynthOption<number>;
  enabled: SynthOption<boolean>;
  octave: SynthOption<number>;
  [key: string]: any;
}

interface IVoiceOptions {
  index? : number;
  octave? : number;
  enabled? : boolean;
  waveform? : string;
}


class Voice {
  readonly context: AudioContext;
  readonly parent: AudioNode;
  readonly osc: OscillatorNode;
  readonly gain: GainNode;

  private _index: number;
  private _octave: number;
  private _enabled: boolean;
  private _waveform: OscillatorType;

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

  get index() : number { return this._index; }
  get octave() : number { return this._octave; }
  get enabled() : boolean { return this._enabled; }
  get waveform() : OscillatorType { return this._waveform; }

  get frequency() : number { return helpers.synth.indexToFrequency(this._index + this._octave * 12); }

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

const Synth: React.FC<{ context: AudioContext }> = (props) => {
  /* SynthSettings system */
  const settings: ISynthSettings = {
    waveform: {value: 'sine', change: value => {updateVoices({waveform: value})}},
    volume: {value: 0.5, change: value => {globalGain.gain.value = value}},
    enabled: {value: true, change: value => {globalMute.gain.value = +value}},
    octave: {value: 1, change: value => {updateVoices({octave: value})}},
  };

  const settingsHandle = (change: IDictionary) => {
    for (let name in settings) {
      /* skip all options that were not defined/changed */
      if (typeof change[name] === 'undefined' || change[name] === settings[name].value) continue;
      console.log(`${name}: ${settings[name].value} => ${change[name]}`);
      /* Update the settings object before callback, some of the callbacks might use it */
      settings[name].value = change[name];
      /* run appropriate callback */
      settings[name].change(change[name]);
    }
  }


  /* AudioContext Init */
  const globalMute = props.context.createGain();
  globalMute.gain.value = 1;

  const globalGain = props.context.createGain();
  globalGain.gain.value = settings.volume.value;
  
  globalGain.connect(globalMute).connect(props.context.destination);
  
  let voices: Voice[] = [];

  const updateVoices = (options: IVoiceOptions) => {
    /* Update all voices with updateVoice */
    voices.map(voice => { voice.updateVoice(options) });
  }

  const keyPressed = (index: number, down: boolean) => {
    if (down) { /* CREATING/UPDATING */
      /* if already exists voice for this index, do nothing */
      if (voices.some((voice) => voice.index === index && voice.enabled))
        return;
      
      /* find a disabled voice */
      let vi = voices.findIndex((voice) => voice.enabled === false);

      if (vi === -1) {
        /* no disabled voices, append new voice */
        voices.push(new Voice(props.context, globalGain, settings, index));
      } else {
        /* found disabled voice, update it with new voice */
        voices[vi].updateVoice({index: index, enabled: true});
      }
    } else { /* DISABLING */
      /* find our voice */
      let vi = voices.findIndex((voice) => voice.index === index);

      if (vi > -1) {
        /* found our voice, disable it */
        voices[vi].updateVoice({enabled: false});
      }
    }
  }


  return (
    <div id="instr-wrapper">
      <div id="titlebar">
        <h1>Synth Keyboard!</h1>
      </div>
      <SynthSettings handle={settingsHandle}/>
      <SynthKeyboard keyPressed={keyPressed}/>
    </div>
  )
}

export default Synth
