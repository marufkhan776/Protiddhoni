

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { NewsCard } from './components/NewsCard';
import { ArticleModal } from './components/ArticleModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Article, Category, PolicyKey, SiteSettings } from './types';
import { NavigationBar } from './components/NavigationBar';
import { CATEGORIES_STRUCTURED } from './constants';
import { PolicyModal } from './components/PolicyModal';
import { POLICY_CONTENT } from './constants/policyContent';
import { Login } from './components/admin/Login';
import { AdminPanel } from './components/admin/AdminPanel';
import { authService } from './services/authService';
import { contentService } from './services/contentService';
import { generateNews } from './services/newsService';

const PublicSite: React.FC<{
    settings: SiteSettings;
    articles: Article[];
    setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
}> = ({ settings, articles, setArticles }) => {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<Category>('সব খবর');
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [selectedPolicy, setSelectedPolicy] = useState<PolicyKey | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            return 'dark';
        }
        return 'light';
    });

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);
    
    const handleGoHome = useCallback(() => {
        setSearchQuery('');
        setActiveCategory('সব খবর');
        window.scrollTo(0, 0);
    }, []);

    const handleCategorySelect = (category: Category) => {
        setSearchQuery(''); // Clear search when a category is selected
        setActiveCategory(category);
        window.scrollTo(0, 0);
    };
    
    const handleLoadMore = async () => {
        if (isLoadingMore) return;
        setIsLoadingMore(true);
        setError(null);
        try {
            // Generate 6 new articles based on the current category
            const newArticles = await generateNews(6, activeCategory);

            if (newArticles && newArticles.length > 0) {
                // Save new articles to persistent storage
                newArticles.forEach(article => contentService.saveArticle(article));
                // Update the state with all articles including new ones
                setArticles(contentService.getArticles());
            } else {
                // No more articles could be generated
                setHasMore(false);
            }
        } catch (e) {
            console.error("Failed to load more articles:", e);
            setError('আরও খবর লোড করতে ব্যর্থ হয়েছে।');
            setHasMore(false); // Stop trying if there's an error
        } finally {
            setIsLoadingMore(false);
        }
    };

    const handleSelectArticle = (article: Article) => {
        setSelectedArticle(article);
    };

    const handleCloseArticleModal = () => {
        setSelectedArticle(null);
    };

    const handleOpenPolicy = (policyKey: PolicyKey) => {
        setSelectedPolicy(policyKey);
    };

    const handleClosePolicy = () => {
        setSelectedPolicy(null);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setActiveCategory('সব খবর'); // Reset category during search
        window.scrollTo(0, 0);
    };

    const articlesToDisplay = searchQuery
        ? articles.filter(a =>
            a.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.fullStory.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : activeCategory === 'সব খবর'
            ? articles
            : articles.filter(a => a.category === activeCategory || CATEGORIES_STRUCTURED.find(c => c.name === activeCategory)?.subcategories?.includes(a.category));

    const topStory = articlesToDisplay.length > 0 ? articlesToDisplay[0] : null;
    const remainingStories = articlesToDisplay.slice(1);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40 transition-colors duration-300">
                 <Header 
                    siteName={settings.siteName}
                    theme={theme} 
                    toggleTheme={toggleTheme}
                    isMobileMenuOpen={isMobileMenuOpen}
                    onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    onSearch={handleSearch}
                    onGoHome={handleGoHome}
                />
                 <NavigationBar
                    categories={CATEGORIES_STRUCTURED}
                    activeCategory={activeCategory}
                    // Fix: Corrected typo from handleSelectCategory to handleCategorySelect
                    onSelectCategory={handleCategorySelect}
                    isMobileMenuOpen={isMobileMenuOpen}
                    onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                />
            </div>
            <main className="flex-grow container mx-auto px-4 py-8">
                {searchQuery && (
                    <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">'{searchQuery}' এর জন্য ফলাফল</h2>
                        <button onClick={() => handleSearch('')} className="mt-2 text-red-600 hover:underline font-semibold">
                            অনুসন্ধান মুছুন
                        </button>
                    </div>
                )}
                {error && <ErrorDisplay message={error} onRetry={handleLoadMore} />}
                {articlesToDisplay.length > 0 ? (
                    <>
                        {topStory && (
                            <HeroSection article={topStory} onReadMore={() => handleSelectArticle(topStory)} />
                        )}
                        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {remainingStories.map((article) => (
                                <NewsCard key={article.id} article={article} onSelectArticle={() => handleSelectArticle(article)} />
                            ))}
                        </div>
                        {hasMore && !searchQuery && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                    className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition duration-300 disabled:bg-red-400 disabled:cursor-not-allowed"
                                >
                                    {isLoadingMore ? 'লোড হচ্ছে...' : 'আরও খবর লোড করুন'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                        <h2 className="text-2xl font-semibold">কোনো খবর পাওয়া যায়নি।</h2>
                        <p className="mt-2">{searchQuery ? 'আপনার অনুসন্ধানের সাথে মেলে এমন কোনো ফলাফল নেই।' : 'অন্য একটি বিভাগ চেষ্টা করুন।'}</p>
                    </div>
                )}
            </main>
            {selectedArticle && (
                <ArticleModal 
                    article={selectedArticle} 
                    allArticles={articles}
                    onClose={handleCloseArticleModal} 
                    onSelectArticle={handleSelectArticle}
                />
            )}
            {selectedPolicy && (
                <PolicyModal 
                    policy={POLICY_CONTENT[selectedPolicy]} 
                    onClose={handleClosePolicy} 
                />
            )}
            <Footer 
                socialLinks={settings.socialLinks}
                onSelectCategory={handleCategorySelect} 
                onOpenPolicy={handleOpenPolicy} 
            />
        </div>
    );
}


const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn());
    const [route, setRoute] = useState(window.location.hash);
    const [settings, setSettings] = useState<SiteSettings>(contentService.getSettings());
    const [articles, setArticles] = useState<Article[]>([]);
    const [isInitializing, setIsInitializing] = useState(true);
    const [initError, setInitError] = useState<string | null>(null);

    const refreshContent = () => {
        setSettings(contentService.getSettings());
        setArticles(contentService.getArticles());
    };

    const initializeApp = useCallback(async () => {
        setIsInitializing(true);
        setInitError(null);
        try {
            let currentArticles = contentService.getArticles();
            if (currentArticles.length === 0) {
                console.log("No articles found in storage. Seeding initial content...");
                const initialArticles = await generateNews(25, 'সব খবর');
                if (!initialArticles || initialArticles.length === 0) {
                    throw new Error("AI মডেল কোনো খবর তৈরি করতে পারেনি। অনুগ্রহ করে আবার চেষ্টা করুন।");
                }
                initialArticles.forEach(article => contentService.saveArticle(article));
                currentArticles = contentService.getArticles();
            }
            setArticles(currentArticles);
        } catch (e: any) {
            console.error("Failed to seed initial articles:", e);
            setInitError(`প্রাথমিক খবর লোড করতে ব্যর্থ হয়েছে। এটি একটি অবৈধ API কী বা নেটওয়ার্ক সমস্যার কারণে হতে পারে। বিস্তারিত: ${String(e)}`);
        } finally {
            setIsInitializing(false);
        }
    }, []);

    useEffect(() => {
        initializeApp();
    }, [initializeApp]);

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
        window.location.hash = '#/admin';
    };

    const handleLogout = () => {
        authService.logout();
        setIsLoggedIn(false);
        window.location.hash = '#/';
    };
    
    if (isInitializing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <LoadingSpinner />
            </div>
        );
    }

    if (initError && articles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                 <ErrorDisplay message={initError} onRetry={initializeApp} />
            </div>
        );
    }

    if (route.startsWith('#/admin')) {
        if (!isLoggedIn) {
            return <Login onLogin={handleLogin} />;
        }
        return <AdminPanel onLogout={handleLogout} onContentUpdate={refreshContent} />;
    }

    return <PublicSite settings={settings} articles={articles} setArticles={setArticles} />;
};

export default App;
