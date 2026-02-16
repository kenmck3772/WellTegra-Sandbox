
import React, { useState } from 'react';
import { FAQ_DATA } from '../constants';

const FaqItem: React.FC<{ item: { question: string; answer: string; }; isOpen: boolean; onClick: () => void; }> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <h2>
        <button 
          type="button" 
          className="flex justify-between items-center w-full p-5 font-medium text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          onClick={onClick}
        >
          <span>{item.question}</span>
          <svg className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </button>
      </h2>
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-5 border-t-0 text-slate-500 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: item.answer }}>
        </div>
      </div>
    </div>
  );
}

const FAQView: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Frequently Asked Questions</h2>
      </div>
      <div id="faq-accordion" className="mt-10 bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        {FAQ_DATA.map((item, index) => (
          <FaqItem 
            key={index} 
            item={item}
            isOpen={openId === index}
            onClick={() => setOpenId(openId === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQView;
