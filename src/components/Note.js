import React from 'react';
import './styles/Note.css';

const Note = (props) => {
  const mouseDown = (e) => !!(e.buttons & 1);

  let noteValue = props.index % 12;
  let noteOctave = Math.floor(props.index / 12);
  let color = [1,3,6,8,10].includes(noteValue) ? "black" : "white";

  return (
    <note
      index={props.index}
      class={`note ${color} n${noteValue} o${noteOctave}`}
      onMouseOver={(e) => {props.onMouseMove(props.index, mouseDown(e), true)}}
      onMouseOut={(e) => {props.onMouseMove(props.index, mouseDown(e), false)}}
      onMouseDown={(e) => {props.onMouseClick(props.index, mouseDown(e))}}
      onMouseUp={(e) => {props.onMouseClick(props.index, mouseDown(e))}}
    />
  );
};


export default Note;
