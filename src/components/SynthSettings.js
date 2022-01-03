import React, {useState, useEffect} from 'react';
import './styles/SynthSettings.css';

const SynthSettings = (props) => {
  
  const [waveform, setWaveform] = useState('sine');
  const [volume, setVolume] = useState(0.5);
  const [enabled, setEnabled] = useState(true);
  const [octave, setOctave] = useState(1);

  useEffect(() => {
    props.handle({waveform: waveform, volume: volume, enabled: enabled, octave: octave});
  });

  return (
    <div id="settings-wrapper">
      <div id="waveform">
        <select onChange={(e) => setWaveform(e.target.value)}>
          <option value="sine">Sine</option>
          <option value="triangle">Triangle</option>
          <option value="square">Square</option>
        </select>
      </div>
      <div id="volume">
        <p>Volume: </p>
        <input type="range" min="0" max="1" step="0.01" onInput={(e) => setVolume(e.target.valueAsNumber)}/>
      </div>
      <div id="enable">
        <p>Active: </p>
        <input type="checkbox" defaultChecked={enabled} onChange={(_) => {setEnabled(!enabled)}}/>
      </div>
      <div id="octave">
        <p>Octave Select: </p>
        <input type="number" min="0" max="5" defaultValue="1" onChange={(e) => setOctave(parseInt(e.target.value))} />
      </div>
    </div>
  )
}

export default SynthSettings
