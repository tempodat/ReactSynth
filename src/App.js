import React from 'react';
import Synth from './components/Synth';

import './App.css';

function App() {
  const ac = new AudioContext();

  return (
    <div class="container">
      <Synth audioContext={ac}/>
    </div>
  );
}

export default App;
