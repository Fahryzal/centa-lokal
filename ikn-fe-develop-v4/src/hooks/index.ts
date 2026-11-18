import { useEffect, useRef, useState } from 'react';
export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
};

export const useScrollToTopWithOutUseEffect = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedFunction = (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
  return debouncedFunction;
}

export const useFetch = ({ getData, page }: { getData: () => Promise<any>; page: number }) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<any>('');

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response: any = await getData();
        setLoading(false);
        setData(response?.data?.data || []);
      } catch (e: unknown) {
        setLoading(false);
        setError(true);
        setErrorMsg(e);
      }
    };
    fetchData();
  }, [page]);

  return {
    data,
    loading,
    error,
    errorMsg,
  };
};

export const useFetchWithOutPage = ({ getData }: { getData: () => Promise<any> }) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<any>('');

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response: any = await getData();
        if (![200, 201].includes(response.status)) {
          throw 'Terjadi kesalahan';
        }
        setLoading(false);
        setData(response?.data?.data || []);
      } catch (e: any) {
        setLoading(false);
        setError(true);
        setErrorMsg(e);
      }
    };
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    errorMsg,
  };
};

type FetchFunction = (param: any) => Promise<any>;

export const useFetchOptions = (
  data: any,
  setData: React.Dispatch<React.SetStateAction<any>>,
  fetchData: FetchFunction,
  depedensi: any = []
) => {
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetch = async () => {
      try {
        setData((prev: any) => ({ ...prev, loading: true }));
        const { unitId, nama, loading, ...params } = data;
        const res = await fetchData(params);

        if (isMounted) {
          setData((prev: any) => {
            return {
              ...prev,
              // data: [...prev.data, ...res.data.data.data],
              data: res.data.data.data,

              loading: false,
            };
          });
        }
      } catch (e) {
        if (isMounted) {
          setData((prev: any) => ({ ...prev, loading: false }));
        }
      }
    };

    fetch();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, depedensi);
};

export const useFetchOptionsSearch = (
  data: any,
  setData: React.Dispatch<React.SetStateAction<any>>,
  fetchData: FetchFunction,
  depedensi: any = []
) => {
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetch = async () => {
      try {
        setData((prev: any) => ({ ...prev, loading: true }));
        const res = await fetchData(data);

        if (isMounted) {
          setData({ data: res.data.data.data, loading: false });
        }
      } catch (e) {
        if (isMounted) {
          setData((prev: any) => ({ ...prev, loading: false }));
        }
      }
    };

    fetch();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, depedensi);
};
