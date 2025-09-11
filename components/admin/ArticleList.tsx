
import React, { useState, useEffect } from 'react';
import { contentService } from '../../services/contentService';
import { Article } from '../../types';

interface ArticleListProps {
    onEditArticle: (id: string) => void;
    onAddArticle: () => void;
    onContentUpdate: () => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({ onEditArticle, onAddArticle, onContentUpdate }) => {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        setArticles(contentService.getArticles());
    }, []);

    const handleDelete = (id: string) => {
        if (window.confirm('আপনি কি নিশ্চিত যে এই খবরটি ডিলিট করতে চান?')) {
            contentService.deleteArticle(id);
            const updatedArticles = contentService.getArticles();
            setArticles(updatedArticles);
            onContentUpdate(); // Notify main app
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">খবরের তালিকা</h2>
                <button
                    onClick={onAddArticle}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    নতুন খবর যোগ করুন
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">শিরোনাম</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">বিভাগ</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">প্রকাশের তারিখ</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {articles.map(article => (
                            <tr key={article.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4">{article.headline}</td>
                                <td className="py-3 px-4">{article.category}</td>
                                <td className="py-3 px-4">{article.publishedDate}</td>
                                <td className="py-3 px-4">
                                    <button
                                        onClick={() => onEditArticle(article.id)}
                                        className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2"
                                    >
                                        এডিট
                                    </button>
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        className="text-sm bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
                                    >
                                        ডিলিট
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {articles.length === 0 && (
                    <p className="text-center text-gray-500 py-8">কোনো খবর পাওয়া যায়নি। নতুন খবর যোগ করুন।</p>
                )}
            </div>
        </div>
    );
};
