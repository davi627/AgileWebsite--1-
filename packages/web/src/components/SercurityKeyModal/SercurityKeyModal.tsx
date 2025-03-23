import React, { useState } from 'react';

interface SecurityKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: (key: string) => Promise<boolean>;
}

const SecurityKeyModal: React.FC<SecurityKeyModalProps> = ({ isOpen, onClose, onValidate }) => {
  const [securityKey, setSecurityKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await onValidate(securityKey);
    if (isValid) {
      onClose();
    } else {
      alert('Invalid security key. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Enter Security Key</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={securityKey}
            onChange={(e) => setSecurityKey(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter 4-digit security key"
            required
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecurityKeyModal;