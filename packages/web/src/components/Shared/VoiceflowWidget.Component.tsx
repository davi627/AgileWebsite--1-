import React, { useEffect } from 'react';

// TypeScript interface for Voiceflow
interface VoiceflowWidget {
  chat: {
    load: (config: {
      verify: { projectID: string };
      url: string;
      versionID: string;
      voice: {
        url: string;
      };
    }) => void;
  };
}

// Extend Window interface to include voiceflow
declare global {
  interface Window {
    voiceflow?: VoiceflowWidget;
  }
}

const VoiceflowChat: React.FC = () => {
  useEffect(() => {
    // Add custom CSS for Voiceflow widget styling
    const addCustomStyles = () => {
      const existingStyle = document.getElementById('voiceflow-custom-styles');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'voiceflow-custom-styles';
        style.textContent = `
          /* Voiceflow widget custom styles */
          .vfrc-launcher {
            background-color: #your-color !important;
          }
          .vfrc-header {
            background-color: #your-color !important;
          }
          .vfrc-chat--container {
            --vf-brand-color: #your-color;
          }
          /* Add more custom styles as needed */
        `;
        document.head.appendChild(style);
      }
    };

    // Check if the script is already loaded
    if (document.querySelector('script[src="https://cdn.voiceflow.com/widget-next/bundle.mjs"]')) {
      addCustomStyles();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';

    // Set up onload handler
    script.onload = () => {
      if (window.voiceflow && window.voiceflow.chat) {
        window.voiceflow.chat.load({
          verify: { projectID: '67177cd9c0ab47ef9cb1b302' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
          voice: {
            url: "https://runtime-api.voiceflow.com"
          }
        });
        // Apply custom styles after widget loads
        addCustomStyles();
      }
    };

    // Append script to document head
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      const existingScript = document.querySelector('script[src="https://cdn.voiceflow.com/widget-next/bundle.mjs"]');
      const existingStyle = document.getElementById('voiceflow-custom-styles');
      if (existingScript) {
        existingScript.remove();
      }
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default VoiceflowChat;
