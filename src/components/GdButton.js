import React from 'react'
import '../css/buttons/gd-button.scss';

export default function GdButton(props) {
  const {impulseBg, onClick, disabled, hidden} = props;
  const style = {};
  if (hidden) style.visibility = "hidden";
  return (
    <div className='gd-button-container'>
        <button 
          className={'gd-button ' + ((impulseBg) ? 'gd-button--impulse-bg' : '')} 
          onClick={onClick}
          disabled={disabled}
          style={{...style}}
        >{ props.children }
        </button>
    </div>
  )
}
