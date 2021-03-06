import React, { useState } from 'react';
import Note from './Note';

import './styles/SynthKeyboard.css';

const SynthKeyboard: React.FC<{ keyPressed: Function }> = (props) => {
  const [pressed, setPressed] = useState(Array(48).fill(false));
  const updatePressed = (index: number, value: boolean) => { setPressed(pressed.map((v, i) => i===index ? value : v)); }

  const setKey = (index: number, value: boolean) => {
    /* ignore calls that don't give us new info */
    if (pressed[index] === value) return;

    updatePressed(index, value);
    props.keyPressed(index, value);
  }

  const onMouseMove = (index: number, down: boolean, over: boolean) => {
    /* it is possible that, depending on how robust js event capturing is, this can be simplified to:
    if (down) setKey(index, over);
    This eliminates a call to setKey everytime unpressed mouse moves out of key, which is a lot.
    The reason this is needed for now is because when mouse released, if somehow onMouseUp did not -
    capture that then it will disable when mouse comes out of key. Might be overkill, consider removing. */
    if (over && down) {
      setKey(index, true);
    } else if (!over) {
      setKey(index, false);
    }
  }

  const onMouseClick = (index: number, down: boolean) => {
    setKey(index, down);
  }

  const createNote = (index: number) => React.createElement(Note, {
    key: index,
    index: index,
    pressed: pressed[index],
    onMouseMove: onMouseMove,
    onMouseClick: onMouseClick
  });

  return (
    <div id="piano-wrapper" draggable="false">
      { [...Array(48).keys()].map(createNote) }
    </div>
  )
}



export default SynthKeyboard
