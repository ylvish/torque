'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types';

interface UserProfile {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: UserRole;
    avatar_url?: string;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    isLoading: boolean;
    isStaff: boolean;
    isCEO: boolean;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                return null;
            }
            return data as UserProfile;
        } catch (err) {
            console.error('Profile fetch error:', err);
            return null;
        }
    };

    const refreshProfile = async () => {
        if (user) {
            const profile = await fetchProfile(user.id);
            setProfile(profile);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    const profile = await fetchProfile(session.user.id);
                    setProfile(profile);
                }
            } catch (error) {
                console.error('Auth init error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    const profile = await fetchProfile(session.user.id);
                    setProfile(profile);
                } else {
                    setProfile(null);
                }

                setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error: error as Error | null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setSession(null);
    };

    // Check if user is staff (CEO or Employee)
    const isStaff = profile?.role ? [
        UserRole.CEO,
        UserRole.EMPLOYEE,
    ].includes(profile.role) : false;

    // Check if user is CEO (has full access)
    const isCEO = profile?.role === UserRole.CEO;

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                session,
                isLoading,
                isStaff,
                isCEO,
                signIn,
                signOut,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
