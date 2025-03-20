import React from 'react';

interface CardProps {
  name: string;
  shortDescription: string;
  image: string;
  onLearnMore: () => void;
}

const SolutionCard: React.FC<CardProps> = ({ name, shortDescription, image, onLearnMore }) => {
  return (
    <div className="hover:border-primary w-full overflow-hidden rounded-md border-2 bg-white transition-shadow duration-300">
      <div className="text-md mb-2 p-3 font-semibold text-black">{name}</div>
      <img className="h-48 w-full object-cover" src={image} alt={name} />
      <div className="mb-6 p-3">
        <p className="text-sm text-gray-600">{shortDescription}</p>
        <button
          onClick={onLearnMore}
          className="text-primary float-right inline-block text-sm font-semibold transition-colors duration-300 hover:opacity-60"
        >
          Learn more →
        </button>
      </div>
    </div>
  );
}

export default SolutionCard;
