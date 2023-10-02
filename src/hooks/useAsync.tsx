import { useCallback, useState } from "react";

// Define a union type of all possible argument structures

type AsyncFunction<T> = (...args: unknown[]) => Promise<T>;


export function useAsyncFn<T>(
  func: AsyncFunction<T>,
  dependencies: React.DependencyList = []
) {
  return useAsyncInternal<T>(func, dependencies, false);
}

function useAsyncInternal<T>(
  func: AsyncFunction<T>,
  dependencies: React.DependencyList = [],
  initialLoading = false
) {
  
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<T | undefined>();

  const execute = useCallback((...params) => {
    setLoading(true);
    return func(...params)
      .then((data: T) => {
        setData(data);
        setLoading(false);
        return data
      })
      .catch((error: Error) => {
        setError(error);
        setData(undefined);
        setLoading(false);
        return Promise.reject();
      })
      .finally(() => {
        setLoading(false);
      });
  }, dependencies);
  return { execute, loading, error, data };
}