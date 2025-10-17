import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useBlockBackNavigation = (shouldBlock: boolean = true) => {
  const location = useLocation();

  useEffect(() => {
    if (!shouldBlock) return;
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location, shouldBlock]);
};