import { FC } from 'react';
import styled from 'styled-components';

export interface IFormProgress {
  position: number;
  stations: Array<{
    description: string;
  }>;
  onSelected?: (position: number) => void;
  className?: string;
}

const FormProgressCore: FC<IFormProgress> = (props: IFormProgress) => {
  const n = props.stations.length;
  const height = 50;
  const width = 90;
  const padding = width / 2;
  const radius = 7;
  const fullWidth = (n - 1) * width + 2 * padding;

  const textVert = height / 3;
  const circleVert = (height * 2) / 3;

  const clicked = (ix: number) => {
    if (props.onSelected) {
      props.onSelected(ix);
    }
  };

  const lines = props.stations.map((station, ix) => {
    const center = padding + ix * width;
    return ix >= 1 ? (
      <g key={ix}>
        <line
          x1={center}
          y1={circleVert}
          x2={center - width}
          y2={circleVert}
          style={{ stroke: 'green', strokeWidth: 2 }}
        />
      </g>
    ) : (
      <></>
    );
  });

  const circles = props.stations.map((station, ix) => {
    const center = padding + ix * width;

    return (
      <g key={ix}>
        <circle cx={center} cy={circleVert} r={radius} stroke="green" strokeWidth="2" fill="transparent" />
        <circle cx={center} cy={circleVert} r={radius - 3} fill="green" />
        <text x={center} y={textVert} fill="green" textAnchor="middle" style={{ fontSize: '12px' }}>
          {station.description}
        </text>
      </g>
    );
  });

  const clickAreas = props.stations.map((station, ix) => {
    return (
      <rect
        key={ix}
        className="click-area"
        x={ix * width}
        y={0}
        width={width}
        height={height}
        onClick={() => clicked(ix)}
        fill="transparent"
      />
    );
  });

  return (
    <svg width={fullWidth} height={height} className={props.className}>
      {lines}
      {circles}
      {clickAreas}
    </svg>
  );
};

export const FormProgress = styled(FormProgressCore)`
  .click-area {
    cursor: pointer;
  }
`;
