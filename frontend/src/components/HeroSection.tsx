import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <div className="py-8 pb-6">
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 mb-1.5">
        Dataset Explorer
      </h1>
      <p className="text-sm text-stone-600 max-w-lg leading-relaxed">
        Browse and search public datasets across demographics, healthcare, education, housing, and economics.
      </p>
    </div>
  );
};
export default HeroSection;
