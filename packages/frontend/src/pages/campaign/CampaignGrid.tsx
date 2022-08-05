import { AreasType, GridExtendedProps, GridSizeType } from 'grommet';
import { FC } from 'react';
import { ResponsiveGrid, Breakpoint } from '../../components/styles/LayoutComponents.styled';

export interface ICampaignGrid extends GridExtendedProps {}

export enum CampaignAreas {
  state = 'state',
  details = 'details',
  description = 'description',
  table = 'table',
  fund = 'fund',
  rightPane = 'rightPane',
  funds = 'funds',
  info = 'info',
}

export const CampaignGrid: FC<ICampaignGrid> = (props: ICampaignGrid) => {
  const columnsLarge: GridSizeType[] = ['3fr', '2fr'];
  const rowsLarge: GridSizeType[] = ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'];
  const areasLarge: AreasType = [
    { name: CampaignAreas.state, start: [0, 0], end: [1, 0] },
    { name: CampaignAreas.details, start: [0, 1], end: [0, 1] },
    { name: CampaignAreas.funds, start: [0, 2], end: [0, 2] },
    { name: CampaignAreas.description, start: [0, 3], end: [0, 3] },
    { name: CampaignAreas.table, start: [0, 4], end: [0, 5] },
    { name: CampaignAreas.rightPane, start: [1, 1], end: [1, 5] },
  ];

  const columnsSmall: GridSizeType[] = [];
  const rowsSmall: GridSizeType[] = [];
  const areasSmall: AreasType = [];

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
