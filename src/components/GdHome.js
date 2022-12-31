import React from 'react'
import GdButton from './GdButton'
import '../css/gd-home.scss'

export default function GdHome() {
  return (
    <div className='gd-home'>
        <div className="title">Geometry Dash</div>
        <div className="btns-container">
            <GdButton impusleBg={true}>Start !</GdButton>
            <GdButton>Leaderboard</GdButton>
            <GdButton>Settings</GdButton>
        </div>
    </div>
  )
}
