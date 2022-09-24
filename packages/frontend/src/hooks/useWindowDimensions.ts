import { useState, useEffect } from 'react';

export interface WindowDimensions {
  w_height: number;
  w_width: number;
}

function getWindowDimensions(): WindowDimensions {
  const { innerWidth: w_width, innerHeight: w_height } = window;
  return {
    w_width,
    w_height,
  };
}

export const useWindowDimensions = (): WindowDimensions => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};
