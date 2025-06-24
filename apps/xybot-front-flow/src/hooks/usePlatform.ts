import { useReactive } from 'ahooks';
import { useEffect } from 'react';

export const queryPlatformInfo = () => {
  return {
    isMobile: window.innerWidth < 640,
    isToc: window.location.pathname.includes('/chat') && !window.location.pathname.includes('/console'),
  };
};

export default function usePlatform() {
  const platformInfo = useReactive(queryPlatformInfo());

  useEffect(() => {
    function resizeCB() {
      platformInfo.isMobile = window.innerWidth < 640;
    }
    window.addEventListener('resize', resizeCB);
    return () => {
      window.removeEventListener('resize', resizeCB);
    };
  }, []);

  return {
    isMobile: window.innerWidth < 640,
  };
}
