
import React, { useEffect } from 'react';
import { Article } from '../types';

interface ArticleModalProps {
    article: Article;
    onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-up transition-colors duration-300">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{article.headline}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 transition text-3xl">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="w-full h-96 rounded-lg overflow-hidden mb-6">
                         <img src={article.imageUrl} alt={article.headline} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <span className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 px-3 py-1 rounded-full font-semibold">{article.category}</span>
                        <span>{article.publishedDate}</span>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {article.fullStory.split('\\n').map((paragraph, index) => (
                           <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
                 <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 text-right">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300">
                        বন্ধ করুন
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
