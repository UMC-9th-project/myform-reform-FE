import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSearchQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const qFromUrl = useMemo(() => {
    const q = searchParams.get('q');
    if (!q) return '';
    try {
      return decodeURIComponent(q);
    } catch {
      return q;
    }
  }, [searchParams]);
  
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  
  const hasQuery = useMemo(() => {
    return qFromUrl.trim().length > 0;
  }, [qFromUrl]);
  
  return {
    qFromUrl,
    pageFromUrl,
    hasQuery,
    searchParams,
    setSearchParams,
  };
}
