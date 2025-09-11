
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
