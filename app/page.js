// app/page.js

'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // This `useEffect` hook will run when the component mounts or the session status changes.
  // Its purpose is to redirect a user if they are already logged in.
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/home');
    }
  }, [status, router]);

  // While the session is loading, we can show a simple loading message.
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // If the user is NOT logged in, we show them the landing page.
  if (status === 'unauthenticated') {
    return (
      <main style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ maxWidth: '600px', margin: '100px auto' }}>
          <h1>Welcome to Your Next Big Idea 🚀</h1>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>
            This is the landing page for your application. Describe your features,
            benefits, and why users should sign up.
          </p>
          <button
            onClick={() => signIn('google')}
            style={{
              marginTop: '30px',
              padding: '15px 30px',
              fontSize: '18px',
              cursor: 'pointer',
              backgroundColor: '#4285F4',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Sign In with Google
          </button>
        </div>
      </main>
    );
  }

  // This is a fallback for the brief moment an authenticated user might see this page
  // before the redirect happens.
  return <div>Loading...</div>;
}