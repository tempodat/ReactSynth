import React, { useRef } from 'react';
import SynthKeyboard from './SynthKeyboard';
import SynthSettings from './SynthSettings';
import { IDictionary, ISynthSettings } from '../Interfaces';
import Voice from '../classes/Voice';

import './styles/Synth.css';

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

  const updateVoices = (options: object) => {
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
