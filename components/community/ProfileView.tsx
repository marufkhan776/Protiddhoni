import React, { useState, useEffect, useCallback } from 'react';
import { communityService } from '../../services/communityService';
import { Post, CommunityUser } from '../../types';
import { PostCard } from './PostCard';
import { LoadingSpinner } from '../LoadingSpinner';

interface ProfileViewProps {
    userId: string;
    currentUser: CommunityUser | null;
    onNavigate: (path: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userId, currentUser, onNavigate }) => {
    const [profileUser, setProfileUser] = useState<CommunityUser | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshData = useCallback(() => {
        const user = communityService.getUserById(userId);
        if (user) {
            setProfileUser(user);
            setPosts(communityService.getPostsByAuthor(userId));
        }
        setIsLoading(false);
    }, [userId]);

    useEffect(() => {
        setIsLoading(true);
        refreshData();
    }, [refreshData]);

    if (isLoading) {
        return <div className="py-10"><LoadingSpinner /></div>;
    }

    if (!profileUser) {
        return <div className="text-center p-10">ব্যবহারকারী পাওয়া যায়নি।</div>;
    }

    return (
        <main className="bg-gray-100 dark:bg-gray-900/95 flex-grow">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 flex flex-col items-center text-center">
                        <img 
                            src={profileUser.profilePicture} 
                            alt={profileUser.username} 
                            className="w-32 h-32 rounded-full object-cover border-4 border-red-500 shadow-lg mb-4"
                        />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{profileUser.username}</h1>
                    </div>

                    {/* User's Posts */}
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 px-2">{profileUser.username}-এর পোস্টসমূহ</h2>
                    <div className="space-y-6">
                        {posts.map(post => (
                            <PostCard 
                                key={post.id} 
                                post={post}
                                currentUser={currentUser}
                                onDataChange={refreshData}
                                onNavigate={onNavigate}
                            />
                        ))}
                         {posts.length === 0 && (
                            <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold">{profileUser.username} এখনও কোনো পোস্ট করেননি।</h2>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};
