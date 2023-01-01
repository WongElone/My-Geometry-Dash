import React from 'react'
import '../css/buttons/gd-button.scss';

export default function GdButton(props) {
  const {impulseBg, onClick} = props;
  return (
    <div className='gd-button-container'>
        <button 
          className={'gd-button ' + ((impulseBg) ? 'gd-button--impulse-bg' : '')} 
          onClick={onClick}
        >{ props.children }
        </button>
    </div>
  )
}
