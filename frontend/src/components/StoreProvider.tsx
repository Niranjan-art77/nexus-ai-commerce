"use client";

import { Provider, useDispatch } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { loginSuccess, logout } from '@/store/slices/authSlice';
import { mockDb } from '@/utils/mockDb';
import { NavBar } from './ui/NavBar';

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:4000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          dispatch(loginSuccess({ user: data.user, token }));
        } else {
          if (token.startsWith('mock_jwt_')) {
            const user = mockDb.getMe(token);
            if (user) {
              dispatch(loginSuccess({ user, token }));
              return;
            }
          }
          dispatch(logout());
        }
      } catch (err) {
        console.warn("Failed to restore session via API, checking local fallback...", err);
        if (token.startsWith('mock_jwt_')) {
          const user = mockDb.getMe(token);
          if (user) {
            dispatch(loginSuccess({ user, token }));
            return;
          }
        }
        dispatch(logout());
      }
    };

    restoreSession();
  }, [dispatch]);

  return (
    <>
      <div className="flex-1 flex flex-col w-full">
        {children}
      </div>
    </>
  );
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppInitializer>
        {children}
      </AppInitializer>
    </Provider>
  );
}
