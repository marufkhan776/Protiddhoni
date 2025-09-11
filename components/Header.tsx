
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
    siteName: string;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    isMobileMenuOpen: boolean;
    onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ siteName, theme, toggleTheme, isMobileMenuOpen, onMobileMenuToggle }) => {
    return (
        <header>
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <a href="#/" className="flex items-center space-x-3" aria-label="Homepage">
                     <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        স
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{siteName}</h1>
                </a>
                <div className="flex items-center space-x-2">
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    <button 
                        className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 focus:outline-none"
                        onClick={onMobileMenuToggle}
                        aria-label="Toggle categories menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <div className="w-6 h-6 flex flex-col justify-around items-center">
                            <span className={`block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-current transition duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></span>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};
