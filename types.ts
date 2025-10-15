
export type Category = string;

export interface Article {
    id: string; // Unique identifier for each article
    headline: string;
    summary: string;
    fullStory: string;
    category: Category;
    imageUrl: string;
    publishedDate: string;
    imageKeyword: string;
}

export interface CategoryStructure {
    name: Category;
    subcategories?: Category[];
}

export type PolicyKey = 'aboutUs' | 'editorialPolicy' | 'contact' | 'privacyPolicy' | 'terms';

export interface Policy {
    title: string;
    content: string;
}

export interface SiteSettings {
    siteName: string;
    socialLinks: {
        facebook: string;
        twitter: string;
        youtube: string;
        instagram: string;
    };
}

// Community Feature Types
export interface CommunityUser {
    id: string;
    username: string;
    passwordHash: string; // This would be a real hash in a real app
    profilePicture: string;
}

export interface Comment {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    timestamp: string;
}

export interface Post {
    id: string;
    groupId: string;
    authorId: string;
    content: string;
    timestamp: string;
    comments: Comment[];
    likeUserIds: string[];
}

export interface Group {
    id: string;
    name: string;
    description: string;
    creatorId: string;
    memberIds: string[];
}
