import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Demo Firebase configuration (for development only)
// In production, you would use your own Firebase project credentials
const firebaseConfig = {
  apiKey: "demo-api-key-for-development",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:demo-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Mock authentication functions for demo
export const signInWithGoogle = async () => {
  // Mock Google sign-in for demo
  const mockUser = {
    uid: 'demo-user-id',
    email: 'demo@example.com',
    displayName: 'Demo User',
    photoURL: null
  };
  return { user: mockUser };
};

export const signUpWithEmail = async (email, password) => {
  // Mock email sign-up for demo
  const mockUser = {
    uid: 'demo-user-id',
    email: email,
    displayName: email.split('@')[0]
  };
  return { user: mockUser };
};

export const signInWithEmail = async (email, password) => {
  // Mock email sign-in for demo
  const mockUser = {
    uid: 'demo-user-id',
    email: email,
    displayName: email.split('@')[0]
  };
  return { user: mockUser };
};

export const logout = async () => {
  // Mock logout for demo
  console.log('Mock logout successful');
};

export const onAuthStateChange = (callback) => {
  // Mock auth state change for demo
  const mockUser = {
    uid: 'demo-user-id',
    email: 'demo@example.com',
    displayName: 'Demo User'
  };
  
  // Simulate auth state change
  setTimeout(() => {
    callback(mockUser);
  }, 100);
  
  // Return unsubscribe function
  return () => {};
};

// Mock Firestore functions for demo
export const createUserProfile = async (uid, userData) => {
  console.log('Mock: Creating user profile', { uid, userData });
  // Store in localStorage for demo
  localStorage.setItem('userProfile', JSON.stringify({
    ...userData,
    createdAt: new Date().toISOString(),
    role: 'user',
    points: 0,
    badges: [],
    progress: {
      assessmentsCompleted: 0,
      skillsAssessed: 0,
      videosCompleted: 0,
      hackathonsJoined: 0
    }
  }));
};

export const getUserProfile = async (uid) => {
  console.log('Mock: Getting user profile', uid);
  const profile = localStorage.getItem('userProfile');
  return profile ? JSON.parse(profile) : null;
};

export const updateUserProfile = async (uid, updates) => {
  console.log('Mock: Updating user profile', { uid, updates });
  const profile = localStorage.getItem('userProfile');
  const currentProfile = profile ? JSON.parse(profile) : {};
  const updatedProfile = { ...currentProfile, ...updates };
  localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
};

export const uploadResume = async (file, uid) => {
  console.log('Mock: Uploading resume', { file, uid });
  // Return mock URL for demo
  return 'https://example.com/mock-resume-url';
};

export const getAllUsers = async () => {
  console.log('Mock: Getting all users');
  // Return mock users for demo
  return [
    { id: 'user1', displayName: 'John Doe', email: 'john@example.com', role: 'user', points: 150 },
    { id: 'user2', displayName: 'Jane Smith', email: 'jane@example.com', role: 'user', points: 200 },
    { id: 'admin1', displayName: 'Admin User', email: 'admin@demo.com', role: 'admin', points: 500 }
  ];
};

export const createHackathon = async (hackathonData) => {
  console.log('Mock: Creating hackathon', hackathonData);
  // Store in localStorage for demo
  const hackathons = JSON.parse(localStorage.getItem('hackathons') || '[]');
  const newHackathon = {
    id: 'hackathon-' + Date.now(),
    ...hackathonData,
    createdAt: new Date().toISOString(),
    participants: [],
    submissions: []
  };
  hackathons.push(newHackathon);
  localStorage.setItem('hackathons', JSON.stringify(hackathons));
  return newHackathon;
};

export const getHackathons = async () => {
  console.log('Mock: Getting hackathons');
  // Return mock hackathons for demo
  const stored = localStorage.getItem('hackathons');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Return default mock hackathons
  return [
    {
      id: 'hackathon-1',
      title: 'AI Coding Challenge',
      description: 'Build an AI-powered coding assistant',
      startDate: '2024-01-15',
      endDate: '2024-01-30',
      participants: ['user1', 'user2'],
      submissions: []
    },
    {
      id: 'hackathon-2',
      title: 'Web Development Sprint',
      description: 'Create a modern web application',
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      participants: ['user1'],
      submissions: []
    }
  ];
};

export default app;
