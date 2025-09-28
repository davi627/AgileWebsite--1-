import React from 'react';

const CareerHero: React.FC = () => {
  return (
    <section className="py-20 lg:py-24" style={{ backgroundColor: '#001833' }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-left" style={{ marginLeft: '-90px', marginTop: '10px' }}>
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            JOIN US
          </h1>
          <p className="text-lg lg:text-xl text-white leading-relaxed">
            Be part of shaping the future of business. At Agile Business Solutions Limited, you'll help organizations unlock efficiency, drive innovation, and adapt to a rapidly changing world. Whether you're starting out or advancing your career, this could be the place where your skills and ambition come to life.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CareerHero;
