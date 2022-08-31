import { AreasType, GridExtendedProps, GridSizeType } from 'grommet';
import { FC } from 'react';
import { ResponsiveGrid, Breakpoint } from '../../components/styles/LayoutComponents.styled';

export interface ICampaignGrid extends GridExtendedProps {}

export enum CampaignAreas {
  left = 'left',
  right = 'right',
}

export const CampaignGrid: FC<ICampaignGrid> = (props: ICampaignGrid) => {
  const columnsLarge: GridSizeType[] = ['5fr', '2fr'];
  const rowsLarge: GridSizeType[] = ['auto'];
  const areasLarge: AreasType = [
    { name: CampaignAreas.left, start: [0, 0], end: [0, 0] },
    { name: CampaignAreas.right, start: [1, 0], end: [1, 0] },
  ];

  const columnsSmall: GridSizeType[] = columnsLarge;
  const rowsSmall: GridSizeType[] = rowsLarge;
  const areasSmall: AreasType = areasLarge;

  const columns: Record<Breakpoint, GridSizeType[]> = {
    small: columnsSmall,
    medium: columnsLarge,
    large: columnsLarge,
    xlarge: columnsLarge,
  };

  const rows: Record<Breakpoint, GridSizeType[]> = {
    small: rowsSmall,
    medium: rowsLarge,
    large: rowsLarge,
    xlarge: rowsLarge,
  };

  const areas: Record<Breakpoint, AreasType> = {
    small: areasSmall,
    medium: areasLarge,
    large: areasLarge,
    xlarge: areasLarge,
  };

  return <ResponsiveGrid {...props} columnsAt={columns} rowsAt={rows} areasAt={areas}></ResponsiveGrid>;
};
