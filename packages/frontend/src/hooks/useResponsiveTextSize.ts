import { ResponsiveContext } from 'grommet';
import { stringify } from 'querystring';
import React, { useEffect } from 'react';
import { useState } from 'react';

export interface useResponsiveTextSizeProps {
  initialLargeTextSize: number;
  ownConfig?: Map<string, React.CSSProperties>;
}

export const useResponsiveTextSize = ({initialLargeTextSize, ownConfig}: useResponsiveTextSizeProps): string => {
  const size = React.useContext(ResponsiveContext);
  const responsiveTextSizeConfig = ownConfig ? ownConfig : new Map<string, React.CSSProperties>([
    ["xsmall", {fontSize: initialLargeTextSize * 0.4}],
    ["small", {fontSize: initialLargeTextSize * 0.6}],
    ["medium", {fontSize: initialLargeTextSize * 0.8}],
    ["large", {fontSize: initialLargeTextSize}],
    ["default", {fontSize: initialLargeTextSize * 1.2}]
  ])

  const [currentTextsize, setCurrentTextSize] = useState(responsiveTextSizeConfig.get('default'))

  useEffect(() => {
    setCurrentTextSize( responsiveTextSizeConfig.get(size) ??  responsiveTextSizeConfig.get('default') )
  }, [size])

  return `${currentTextsize?.fontSize}px`;
};
