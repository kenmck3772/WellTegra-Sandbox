import React from 'react';
import { ViewName } from '../types';

interface HeaderProps {
    currentView: ViewName;
    theme: 'light' | 'dark';
    onSetView: (view: ViewName) => void;
    onSetTheme: (theme: 'light' | 'dark') => void;
    wellName?: string;
    planName?: string;
}

const NavLink: React.FC<{
    id: ViewName;
    title: string;
    // FIX: Changed JSX.Element to React.ReactElement to resolve missing JSX namespace error.
    icon: React.ReactElement;
    currentView: ViewName;
    onClick: (view: ViewName) => void;
    disabled?: boolean;
}> = ({ id, title, icon, currentView, onClick, disabled }) => {
    const isActive = currentView === id;
    const isDisabled = disabled && !isActive;

    const baseClasses = "nav-link flex items-center space-x-2 transition-colors border-b-2 py-2 px-1 md:px-3 text-sm font-medium";
    const themeClasses = `
        ${isActive
            ? 'text-teal-500 border-teal-500'
            : `border-transparent ${isDisabled ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-teal-400'}`
        }
    `;

    return (
        <button onClick={() => !isDisabled && onClick(id)} title={title} className={`${baseClasses} ${themeClasses}`} disabled={isDisabled}>
            {icon}
            <span className="hidden md:inline">{title}</span>
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ currentView, theme, onSetView, onSetTheme, wellName, planName }) => {
    const navLinks = [
        { id: 'home', title: 'Home', icon: <HomeIcon /> },
        { id: 'planner', title: 'Planner', icon: <PlannerIcon /> },
        { id: 'performer', title: 'Performer', icon: <PerformerIcon />, disabled: !planName },
        { id: 'analyzer', title: 'Analyzer', icon: <AnalyzerIcon />, disabled: !planName },
        { id: 'faq', title: 'FAQ', icon: <FAQIcon /> },
        { id: 'about', title: 'About', icon: <AboutIcon /> },
    ];

    const toggleTheme = () => {
        onSetTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="bg-slate-900 sticky top-0 z-40 border-b border-slate-800">
            <div className="max-w-full mx-auto py-2 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img src="https://welltegra.network/assets/logo.png" alt="Well-Tegra Logo" className="h-12 w-auto mr-3" />
                        <h1 className="text-xl font-bold hidden lg:block text-white">Well-Tegra</h1>
                    </div>
                    <nav className="flex-1 flex items-center justify-center">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.id}
                                id={link.id as ViewName}
                                title={link.title}
                                icon={link.icon}
                                currentView={currentView}
                                onClick={onSetView}
                                disabled={link.disabled}
                            />
                        ))}
                    </nav>
                    <div className="flex items-center space-x-4">
                        {currentView === 'performer' && wellName && planName && (
                            <div className="text-right hidden xl:block">
                                <p className="text-sm font-semibold text-teal-400">{wellName}</p>
                                <p className="text-xs text-slate-400">{planName}</p>
                            </div>
                        )}
                        <button onClick={toggleTheme} className="p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white">
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

// SVG Icons
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const PlannerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>;
const PerformerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
const AnalyzerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>;
const FAQIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>;
const AboutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;

export default Header;
