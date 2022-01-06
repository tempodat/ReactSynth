import React from 'react';
import Synth from './components/Synth';

import './App.css';

function App() {
  const ac = new AudioContext();

  return (
    <div className="container">
      <Synth context={ac}/>
    </div>
  );
}

export default App;
