import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { getFavourites, getHistory } from '@/lib/userData';
import { isAuthenticated } from '@/lib/authenticate';

const PUBLIC_PATHS = ['/login', '/register', '/', '/_error'];

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const updateAtoms = useCallback(async () => {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  }, [setFavouritesList, setSearchHistory]);

  const authCheck = useCallback((url) => {
    const path = url.split('?')[0];
    if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
      setAuthorized(false);
      router.push('/login');
    } else {
      setAuthorized(true);
      if (isAuthenticated()) {
        updateAtoms();
      }
    }
  }, [router, updateAtoms]);

  useEffect(() => {
    updateAtoms(); 
    authCheck(router.asPath);
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);
    router.events.on('routeChangeComplete', authCheck);
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, [authCheck, router.asPath, router.events, updateAtoms]);

  return authorized ? children : null;
}