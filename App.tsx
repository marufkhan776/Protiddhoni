
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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<Category>('সব খবর');
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [selectedPolicy, setSelectedPolicy] = useState<PolicyKey | null>(null);

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
    
    useEffect(() => {
        // Initial load check is now handled in the main App component
        setIsLoading(articles.length === 0);
    }, [articles]);

    const handleCategorySelect = (category: Category) => {
        setActiveCategory(category);
        window.scrollTo(0, 0);
    };
    
    // This is a placeholder now, as "load more" from AI is disabled in favor of admin management
    const handleLoadMore = () => {
       setHasMore(false); // No more AI-generated articles on the fly
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

    const filteredArticles = activeCategory === 'সব খবর'
        ? articles
        : articles.filter(a => a.category === activeCategory || CATEGORIES_STRUCTURED.find(c => c.name === activeCategory)?.subcategories?.includes(a.category));

    const topStory = filteredArticles.length > 0 ? filteredArticles[0] : null;
    const remainingStories = filteredArticles.slice(1);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40 transition-colors duration-300">
                 <Header 
                    siteName={settings.siteName}
                    theme={theme} 
                    toggleTheme={toggleTheme}
                    isMobileMenuOpen={isMobileMenuOpen}
                    onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
                 <NavigationBar
                    categories={CATEGORIES_STRUCTURED}
                    activeCategory={activeCategory}
                    onSelectCategory={handleCategorySelect}
                    isMobileMenuOpen={isMobileMenuOpen}
                    onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                />
            </div>
            <main className="flex-grow container mx-auto px-4 py-8">
                {isLoading && <LoadingSpinner />}
                {error && <ErrorDisplay message={error} onRetry={() => {}} />}
                {!isLoading && !error && (
                    <>
                        {filteredArticles.length > 0 ? (
                            <>
                                {topStory && (
                                    <HeroSection article={topStory} onReadMore={() => handleSelectArticle(topStory)} />
                                )}
                                <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                    {remainingStories.map((article) => (
                                        <NewsCard key={article.id} article={article} onSelectArticle={() => handleSelectArticle(article)} />
                                    ))}
                                </div>
                            </>
                        ) : (
                             <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                                <h2 className="text-2xl font-semibold">এই বিভাগে কোনো খবর পাওয়া যায়নি।</h2>
                                <p className="mt-2">অন্য একটি বিভাগ চেষ্টা করুন।</p>
                            </div>
                        )}
                        {/* Load more button is now disabled as content is managed in admin */}
                    </>
                )}
            </main>
            {selectedArticle && (
                <ArticleModal article={selectedArticle} onClose={handleCloseArticleModal} />
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

    const refreshContent = () => {
        setSettings(contentService.getSettings());
        setArticles(contentService.getArticles());
    };

    useEffect(() => {
        const initializeApp = async () => {
            let currentArticles = contentService.getArticles();
            if (currentArticles.length === 0) {
                try {
                    console.log("No articles found in storage. Seeding initial content...");
                    const initialArticles = await generateNews(10, 'সব খবর');
                    initialArticles.forEach(article => contentService.saveArticle(article));
                    currentArticles = contentService.getArticles();
                } catch (e) {
                    console.error("Failed to seed initial articles:", e);
                }
            }
            setArticles(currentArticles);
            setIsInitializing(false);
        };
        initializeApp();
    }, []);

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
        return <LoadingSpinner />;
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
