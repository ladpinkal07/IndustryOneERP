import { useState, useCallback, useEffect } from 'react';
import { extractErrorMessage } from '../utils/errorHandler';

export function useApi(apiFunc, { immediate = true, initialData = null, params = null } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFunc(...args);
        // If response is standard APIResponse envelope
        const resultData = response && response.data !== undefined ? response.data : response;
        setData(resultData);
        return { data: resultData, response, error: null };
      } catch (err) {
        const errMsg = extractErrorMessage(err);
        setError(errMsg);
        return { data: null, response: null, error: errMsg };
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  useEffect(() => {
    if (immediate) {
      if (params !== null) {
        execute(params);
      } else {
        execute();
      }
    }
  }, [immediate, execute, params]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
    setData,
  };
}
