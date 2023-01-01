import React from 'react'
import GdCard from './GdCard'

export default function GdMapSelectionCard(props) {
  return (
    <GdCard className="gd-card-container--map-selection">{props.children}</GdCard>
  )
}
