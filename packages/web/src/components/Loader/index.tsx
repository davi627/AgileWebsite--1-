/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable @typescript-eslint/prefer-as-const */
import React from 'react'

const Spinner = () => {
  const spinnerStyle: React.CSSProperties = {
    position: 'relative',
    width: '33.6px',
    height: '33.6px',
    perspective: '67.2px'
  }

  const divStyle = {
    width: '100%',
    height: '100%',
    background: '#167aa0',
    position: 'absolute' as 'absolute',
    left: '50%',
    transformOrigin: 'left',
    animation: 'spinner-16s03x 2s infinite'
  }

  const keyframes = `
    @keyframes spinner-16s03x {
      0% {
        transform: rotateY(0deg);
      }
      50%, 80% {
        transform: rotateY(-180deg);
      }
      90%, 100% {
        opacity: 0;
        transform: rotateY(-180deg);
      }
    }
  `

  return (
    <div className="spinner" style={spinnerStyle}>
      <style>{keyframes}</style>
      <div style={{ ...divStyle, animationDelay: '0.15s' }}></div>
      <div style={{ ...divStyle, animationDelay: '0.3s' }}></div>
      <div style={{ ...divStyle, animationDelay: '0.45s' }}></div>
      <div style={{ ...divStyle, animationDelay: '0.6s' }}></div>
      <div style={{ ...divStyle, animationDelay: '0.75s' }}></div>
    </div>
  )
}

export default Spinner
