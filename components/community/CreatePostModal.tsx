
import React, { useState, useEffect } from 'react';
import { communityService } from '../../services/communityService';
import { Group, CommunityUser } from '../../types';

interface CreatePostModalProps {
    currentUser: CommunityUser;
    userGroups: Group[];
    onClose: () => void;
    onPostCreated: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ currentUser, userGroups, onClose, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState<string>(userGroups[0]?.id || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!content.trim()) {
            setError('পোস্ট খালি হতে পারে না।');
            return;
        }
        if (!selectedGroupId) {
            setError('পোস্ট করার জন্য একটি গ্রুপ নির্বাচন করুন।');
            return;
        }
        setIsLoading(true);
        communityService.createPost(selectedGroupId, currentUser.id, content);
        onPostCreated();
        setIsLoading(false);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg animate-fade-in-up">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">পোস্ট তৈরি করুন</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 transition text-3xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <img src={currentUser.profilePicture} alt={currentUser.username} className="w-10 h-10 rounded-full object-cover"/>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-gray-100">{currentUser.username}</p>
                                <select
                                    id="group-select"
                                    value={selectedGroupId}
                                    onChange={(e) => setSelectedGroupId(e.target.value)}
                                    className="text-sm p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                                >
                                    {userGroups.map(group => (
                                        <option key={group.id} value={group.id}>{group.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`আপনার মনে কী চলছে, ${currentUser.username}?`}
                            className="w-full p-2 text-lg border-none bg-transparent focus:outline-none focus:ring-0"
                            rows={5}
                            autoFocus
                            required
                        />
                         {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                        <button type="submit" disabled={isLoading} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition duration-300 disabled:bg-red-400">
                            {isLoading ? 'পোস্ট হচ্ছে...' : 'পোস্ট করুন'}
                        </button>
                    </div>
                </form>
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
