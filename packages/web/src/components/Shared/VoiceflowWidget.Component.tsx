// @ts-nocheck

import { useEffect } from 'react'

const VoiceflowWidget = () => {
  useEffect(() => {
    // Create a new script tag
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://cdn.voiceflow.com/widget/bundle.mjs'
    script.onload = () => {
      // Initialize the Voiceflow widget
      if (window.voiceflow && window.voiceflow.chat) {
        window.voiceflow.chat.load({
          verify: { projectID: '67177cd9c0ab47ef9cb1b302' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production'
        })
      }
    }

    // Append the script to the document body
    document.body.appendChild(script)

    // Cleanup: Remove the script tag when the component unmounts
    return () => {
      document.body.removeChild(script)
    }
  }, []) // Empty dependency array ensures this runs only once

  return null // This component doesn't render any visible elements
}

export default VoiceflowWidget
