import React from 'react'
import '../css/buttons/gd-icon-button.scss';

export default function GdIconButton(props) {
  const {onClick, onMouseEnter, onMouseLeave, onTouchStart, onTouchEnd, disabled, hidden, icon, width, height} = props;
  const style = { width: width || "40px", height: height || "40px" };
  if (hidden) style.visibility = "hidden";
  return (
    <div className='gd-icon-button-container'>
        <button 
          className={'gd-icon-button'} 
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          disabled={disabled}
          style={{...style}}
        >
          <img src={icon} className='icon-img' />
        </button>
    </div>
  )
}
