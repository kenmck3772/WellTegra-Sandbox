
import React from 'react';

const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">About Me & The Mission</h2>
      </div>
      <div className="mt-10 bg-white dark:bg-slate-800 p-8 rounded-lg space-y-8 shadow-lg">
        <div>
          <h3 className="text-2xl font-bold dark:text-white">From the Wellsite to the Web</h3>
          <p className="text-lg italic mt-2 text-slate-500 dark:text-slate-400">"I built Well-Tegra because I've lived the problems it's designed to solve." - Kenneth McKenzie</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold dark:text-white">My Perspective</h4>
          <p className="mt-2 text-slate-600 dark:text-slate-300">I'm not a software developer who decided to get into oil and gas. I'm a well services guy who learned to code. My career started at the sharp end and took me around the world. I've been on both sides of the fence—I know the service company's challenges and the operator's objectives. That's the insight Well-Tegra is built on.</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold dark:text-white">Why I Built This</h4>
          <p className="mt-2 text-slate-600 dark:text-slate-300">I've seen first-hand how much time, money, and energy we waste because our data is a mess. It's locked in different systems, buried in old reports, and stuck in spreadsheets. We repeat the same mistakes because the lessons learned from one job are never available for the next. The "Well From Hell" in this demo isn't an exaggeration; it's a sanitized version of the real-world train wrecks I've witnessed—and helped clean up.</p>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Well-Tegra is my answer to that chaos. It's a platform designed from an operator's perspective, focused on a single source of truth that connects planning, execution, and analysis.</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <h4 className="font-bold text-blue-800 dark:text-blue-300">The Path Forward</h4>
          <p className="mt-2 text-blue-700 dark:text-blue-200">This demo is the blueprint. It was built with a lot of determination, but to bring it to life, it needs the power of real, collective data. The next step is to partner with operators and service companies to build out the anonymized data pool that will drive the predictive AI. The platform is ready to scale, and I'm actively seeking the right partners to help build the future of well operations.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
