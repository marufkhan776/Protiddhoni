import { CommunityUser, Group, Post, Comment } from '../types';

// Mock password hashing for demo. In a real app, use a library like bcrypt.
const simpleHash = (s: string) => `hashed_${s}`;

const USERS_KEY = 'communityUsers';
const GROUPS_KEY = 'communityGroups';
const POSTS_KEY = 'communityPosts';
const CURRENT_USER_KEY = 'currentCommunityUser';

const getFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const saveToStorage = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};


// Initialize with some default data if storage is empty
const initDefaultData = () => {
    const users = getFromStorage<CommunityUser[]>(USERS_KEY, []);
    if (users.length === 0) {
        // Create a default user
        const defaultUser: CommunityUser = {
            id: 'user_1',
            username: 'প্রথম ব্যবহারকারী',
            passwordHash: simpleHash('pass123'),
            profilePicture: 'https://i.pravatar.cc/150?u=user_1'
        };
         const anotherUser: CommunityUser = {
            id: 'user_2',
            username: 'দ্বিতীয় ব্যবহারকারী',
            passwordHash: simpleHash('pass456'),
            profilePicture: 'https://i.pravatar.cc/150?u=user_2'
        };
        const thirdUser: CommunityUser = {
            id: 'user_3',
            username: 'তৃতীয় ব্যবহারকারী',
            passwordHash: simpleHash('pass789'),
            profilePicture: 'https://i.pravatar.cc/150?u=user_3'
        };
        saveToStorage(USERS_KEY, [defaultUser, anotherUser, thirdUser]);

        const groups = getFromStorage<Group[]>(GROUPS_KEY, []);
        if (groups.length === 0) {
            // Create default groups
            const defaultGroups: Group[] = [
                { id: 'group_1', name: 'সাধারণ আলোচনা', description: 'সবকিছু নিয়ে আলোচনার জন্য একটি জায়গা।', creatorId: 'user_1', memberIds: ['user_1', 'user_2', 'user_3'] },
                { id: 'group_2', name: 'খেলাধুলা কর্নার', description: 'ক্রিকেট, ফুটবল এবং অন্যান্য খেলা নিয়ে আড্ডা।', creatorId: 'user_1', memberIds: ['user_1', 'user_3'] }
            ];
            saveToStorage(GROUPS_KEY, defaultGroups);

            const posts = getFromStorage<Post[]>(POSTS_KEY, []);
            if (posts.length === 0) {
                // Create default posts
                const defaultPosts: Post[] = [
                    { id: 'post_1', groupId: 'group_1', authorId: 'user_1', content: 'এই নতুন কমিউনিটি ফিচারে আপনাদের সবাইকে স্বাগতম! আশা করি আপনাদের ভালো লাগবে।', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), comments: [], likeUserIds: ['user_2', 'user_3'] },
                    { id: 'post_2', groupId: 'group_2', authorId: 'user_3', content: 'আজকের খেলা কে দেখেছে? অসাধারণ একটি ম্যাচ ছিল!', timestamp: new Date().toISOString(), comments: [], likeUserIds: [] }
                ];
                saveToStorage(POSTS_KEY, defaultPosts);
            }
        }
    }
};

initDefaultData();

export const communityService = {
    // --- User Management ---
    register(username: string, password: string): CommunityUser | null {
        const users = getFromStorage<CommunityUser[]>(USERS_KEY, []);
        if (users.find(u => u.username === username)) {
            return null; // Username already exists
        }
        const newUser: CommunityUser = {
            id: `user_${Date.now()}`,
            username,
            passwordHash: simpleHash(password),
            profilePicture: `https://i.pravatar.cc/150?u=${`user_${Date.now()}`}`
        };
        users.push(newUser);
        saveToStorage(USERS_KEY, users);
        return newUser;
    },

    login(username: string, password: string): CommunityUser | null {
        const users = getFromStorage<CommunityUser[]>(USERS_KEY, []);
        const user = users.find(u => u.username === username && u.passwordHash === simpleHash(password));
        if (user) {
            saveToStorage(CURRENT_USER_KEY, user);
            return user;
        }
        return null;
    },

    logout(): void {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    getCurrentUser(): CommunityUser | null {
        return getFromStorage<CommunityUser | null>(CURRENT_USER_KEY, null);
    },

    getUserById(userId: string): CommunityUser | undefined {
        const users = getFromStorage<CommunityUser[]>(USERS_KEY, []);
        return users.find(u => u.id === userId);
    },
    
    getAllUsers(): CommunityUser[] {
        return getFromStorage<CommunityUser[]>(USERS_KEY, []);
    },

    // --- Group Management ---
    createGroup(name: string, description: string, creator: CommunityUser): Group {
        const groups = getFromStorage<Group[]>(GROUPS_KEY, []);
        const newGroup: Group = {
            id: `group_${Date.now()}`,
            name,
            description,
            creatorId: creator.id,
            memberIds: [creator.id]
        };
        groups.push(newGroup);
        saveToStorage(GROUPS_KEY, groups);
        return newGroup;
    },

    getGroups(): Group[] {
        return getFromStorage<Group[]>(GROUPS_KEY, []);
    },

    getGroupById(groupId: string): Group | undefined {
        const groups = getFromStorage<Group[]>(GROUPS_KEY, []);
        return groups.find(g => g.id === groupId);
    },
    
    getGroupsForUser(userId: string): Group[] {
        const allGroups = this.getGroups();
        return allGroups.filter(g => g.memberIds.includes(userId));
    },

    joinGroup(groupId: string, userId: string): void {
        const groups = getFromStorage<Group[]>(GROUPS_KEY, []);
        const group = groups.find(g => g.id === groupId);
        if (group && !group.memberIds.includes(userId)) {
            group.memberIds.push(userId);
            saveToStorage(GROUPS_KEY, groups);
        }
    },
    
    // --- Post Management ---
    getPostsForGroup(groupId: string): Post[] {
        const allPosts = getFromStorage<Post[]>(POSTS_KEY, []);
        return allPosts.filter(p => p.groupId === groupId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
    
    getFeedForUser(userId: string): Post[] {
        const userGroups = this.getGroupsForUser(userId).map(g => g.id);
        if (userGroups.length === 0) return [];
        
        const allPosts = getFromStorage<Post[]>(POSTS_KEY, []);
        return allPosts
            .filter(p => userGroups.includes(p.groupId))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    createPost(groupId: string, authorId: string, content: string): Post {
        const posts = getFromStorage<Post[]>(POSTS_KEY, []);
        const newPost: Post = {
            id: `post_${Date.now()}`,
            groupId,
            authorId,
            content,
            timestamp: new Date().toISOString(),
            comments: [],
            likeUserIds: [] // Initialize likes
        };
        posts.unshift(newPost); // Add to beginning for chronological order
        saveToStorage(POSTS_KEY, posts);
        return newPost;
    },

    updatePost(postId: string, newContent: string): void {
        const posts = getFromStorage<Post[]>(POSTS_KEY, []);
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.content = newContent;
            saveToStorage(POSTS_KEY, posts);
        }
    },

    deletePost(postId: string): void {
        let posts = getFromStorage<Post[]>(POSTS_KEY, []);
        posts = posts.filter(p => p.id !== postId);
        saveToStorage(POSTS_KEY, posts);
    },

    addCommentToPost(postId: string, authorId: string, content: string): void {
        const posts = getFromStorage<Post[]>(POSTS_KEY, []);
        const post = posts.find(p => p.id === postId);
        if (post) {
            const newComment: Comment = {
                id: `comment_${Date.now()}`,
                postId,
                authorId,
                content,
                timestamp: new Date().toISOString()
            };
            post.comments.push(newComment);
            saveToStorage(POSTS_KEY, posts);
        }
    },
    
    getPostsByAuthor(authorId: string): Post[] {
        const allPosts = getFromStorage<Post[]>(POSTS_KEY, []);
        return allPosts
            .filter(p => p.authorId === authorId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    getUsersByIds(userIds: string[]): CommunityUser[] {
        const allUsers = this.getAllUsers();
        return userIds.map(id => allUsers.find(u => u.id === id)).filter((u): u is CommunityUser => !!u);
    },

    toggleLikePost(postId: string, userId: string): void {
        const posts = getFromStorage<Post[]>(POSTS_KEY, []);
        const post = posts.find(p => p.id === postId);
        if (post) {
            const likeIndex = post.likeUserIds.indexOf(userId);
            if (likeIndex > -1) {
                // User has liked, so unlike
                post.likeUserIds.splice(likeIndex, 1);
            } else {
                // User has not liked, so like
                post.likeUserIds.push(userId);
            }
            saveToStorage(POSTS_KEY, posts);
        }
    },
};