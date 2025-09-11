
import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
    siteName: string;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    isMobileMenuOpen: boolean;
    onMobileMenuToggle: () => void;
    onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ siteName, theme, toggleTheme, isMobileMenuOpen, onMobileMenuToggle, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery.trim());
    };

    return (
        <header>
            <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
                <a href="#/" className="flex items-center space-x-3 flex-shrink-0" aria-label="Homepage">
                     <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        স
                    </div>
                    <h1 className="hidden sm:block text-3xl font-bold text-gray-800 dark:text-gray-100">{siteName}</h1>
                </a>
                <div className="flex-grow max-w-lg">
                    <form onSubmit={handleSearchSubmit} className="relative w-full">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="খবর খুঁজুন..."
                            className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        />
                        <button
                            type="submit"
                            aria-label="Search"
                            className="absolute right-0 top-0 h-full px-3 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>
                </div>
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
