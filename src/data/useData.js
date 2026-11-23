import { useEffect, useState } from 'react';

// Load several api.js functions in parallel.
// const { data, error } = useData({ districts: getDistricts, forecast: getForecast });
// `data` is null until everything has loaded.
export function useData(loaders) {
  const [state, setState] = useState({ data: null, error: null });

  useEffect(() => {
    let alive = true;
    const keys = Object.keys(loaders);
    Promise.all(keys.map((k) => loaders[k]()))
      .then((values) => {
        if (alive) setState({ data: Object.fromEntries(keys.map((k, i) => [k, values[i]])), error: null });
      })
      .catch((error) => alive && setState({ data: null, error }));
    return () => {
      alive = false;
    };
    // loaders are module-level functions; load once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
