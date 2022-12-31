import React from 'react'
import '../css/buttons/gd-button.scss';

export default function GdButton(props) {
  return (
    <div className='gd-button-container'>
        <button className={'gd-button ' + ((props.impusleBg) ? 'gd-button--impulse-bg' : '')}>{ props.children }</button>
    </div>
  )
}
