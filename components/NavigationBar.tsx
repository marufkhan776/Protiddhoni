
import React from 'react';
import { Category, CategoryStructure } from '../types';

interface NavigationBarProps {
    categories: CategoryStructure[];
    activeCategory: Category;
    onSelectCategory: (category: Category) => void;
    isMobileMenuOpen: boolean;
    onCloseMobileMenu: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ categories, activeCategory, onSelectCategory, isMobileMenuOpen, onCloseMobileMenu }) => {
    
    const handleCategoryClick = (category: Category) => {
        onSelectCategory(category);
        onCloseMobileMenu();
    };

    return (
        <>
            {/* Desktop Navigation */}
            <nav className="hidden md:block border-t border-gray-200 dark:border-gray-700">
                <div className="container mx-auto flex justify-center">
                    {categories.slice(0, 10).map((cat) => ( // Show first 10 top-level categories
                        <div key={cat.name} className="relative group">
                            <button
                                onClick={() => handleCategoryClick(cat.name)}
                                className={`px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300 outline-none text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400
                                ${activeCategory === cat.name ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600' : 'border-b-2 border-transparent'}`}
                            >
                                {cat.name}
                            </button>
                            {cat.subcategories && (
                                <div className="absolute left-0 mt-0 w-56 bg-white dark:bg-gray-800 rounded-b-md shadow-xl z-50 hidden group-hover:block animate-fade-in-down ring-1 ring-black ring-opacity-5">
                                    {cat.subcategories.map(subCat => (
                                        <a
                                            key={subCat}
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleCategoryClick(subCat);
                                            }}
                                            className={`block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-colors duration-200
                                            ${activeCategory === subCat ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 font-bold' : ''}`}
                                        >
                                            {subCat}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </nav>
            
            {/* Mobile Menu Panel */}
            <div 
                className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'bg-black bg-opacity-50' : 'pointer-events-none'}`}
                onClick={onCloseMobileMenu}
            >
                <div 
                    className={`absolute top-0 left-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">সব বিভাগ</h2>
                        <button onClick={onCloseMobileMenu} className="text-3xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">&times;</button>
                    </div>
                    <div className="overflow-y-auto h-[calc(100vh-65px)]">
                        {categories.map(cat => (
                            <div key={cat.name} className="border-b border-gray-200 dark:border-gray-700">
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleCategoryClick(cat.name); }}
                                    className={`block px-4 py-3 font-bold text-gray-700 dark:text-gray-200 ${activeCategory === cat.name ? 'text-red-600 dark:text-red-400' : ''}`}
                                >
                                    {cat.name}
                                </a>
                                {cat.subcategories && (
                                    <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-600 ml-4">
                                        {cat.subcategories.map(subCat => (
                                             <a
                                                key={subCat}
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); handleCategoryClick(subCat); }}
                                                className={`block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 ${activeCategory === subCat ? 'text-red-600 dark:text-red-400 font-semibold' : ''}`}
                                            >
                                                {subCat}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.2s ease-out forwards;
                }
            `}</style>
        </>
    );
};
