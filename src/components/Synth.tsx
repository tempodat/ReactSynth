import React, {useRef} from 'react';
import SynthKeyboard from './SynthKeyboard';
import SynthSettings from './SynthSettings';

import './styles/Synth.css';

const Synth = (props) => {
  /* SynthSettings system */
  const settings = {waveform: 'sine', volume: 0.5, enabled: true, octave: 1};

  const settingsChange = {
    waveform: (value) => {updateVoices({waveform: value})},
    volume: (value) => {globalGain.gain.value = value},
    enabled: (value) => {globalMute.gain.value = +value},
    octave: (value) => {updateVoices({octave: value})}
  };

  const settingsHandle = (change) => {
    for (let option in settings) {
      /* skip all options that were not changed */
      if (change[option] === settings[option]) continue;
      console.log(`${option}: ${settings[option]} => ${change[option]}`);
      /* Update the settings object before callback, some of the callbacks might use it */
      settings[option] = change[option];
      /* run appropriate callback */
      settingsChange[option](change[option]);
    }
  }


  /* AudioContext Init */
  const globalMute = props.audioContext.createGain();
  globalMute.gain.value = 1;

  const globalGain = props.audioContext.createGain();
  globalGain.gain.value = settings.volume;
  
  globalGain.connect(globalMute).connect(props.audioContext.destination);
  

  /* SynthKeyboard system */
  const BF = 16.35159;
  const indexToFrequency = (index, octave=settings.octave) => BF * 2**(octave + index/12);

  let voices = [];

  const createVoice = (index) => {
    const osc = props.audioContext.createOscillator();
    osc.type = settings.waveform;
    osc.frequency.value = indexToFrequency(index);

    const gainNode = props.audioContext.createGain();
    gainNode.gain.value = 1;
    gainNode.connect(globalGain);

    osc.connect(gainNode);
    osc.start();

    return {osc: osc, gain: gainNode, enabled: true, index: index};
  }

  const updateVoice = (vi, options) => {
    let voice = voices[vi];

    if (typeof options.index !== 'undefined') {
      voice.osc.frequency.value = indexToFrequency(options.index);
      voice.index = options.index;
    }

    if (typeof options.octave !== 'undefined') {
      voice.osc.frequency.value = indexToFrequency(voice.index, options.octave);
    }

    if (typeof options.waveform !== 'undefined') {
      voice.osc.type = options.waveform;
    }

    if (typeof options.enabled !== 'undefined') {
      voice.gain.gain.value = +options.enabled;
      voice.enabled = options.enabled;
    }
  }

  const updateVoices = (options) => {
    /* Update all voices with updateVoice */
    Object.keys(voices).forEach((vi) => {updateVoice(vi, options)})
  }

  const keyPressed = (index, down) => {
    if (down === true) { /* CREATING/UPDATING */
      /* if already exists voice for this index, do nothing */
      if (voices.some((voice) => voice.index === index && voice.enabled))
        return;
      
      /* find a disabled voice */
      let vi = voices.findIndex((voice) => voice.enabled === false);

      if (vi === -1) {
        /* no disabled voices, append new voice */
        voices.push(createVoice(index));
      } else {
        /* found disabled voice, update it with new voice */
        updateVoice(vi, {index: index, enabled: true});
      }
    } else { /* DISABLING */
      /* find our voice */
      let vi = voices.findIndex((voice) => voice.index===index);

      if (vi > -1) {
        /* found our voice, disable it */
        updateVoice(vi, {enabled: false});
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
