import { useEffect } from 'react';

const useClientEffect = (callback: React.EffectCallback, deps: React.DependencyList) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useClientEffect;
