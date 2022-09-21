import { Page } from '@dao-strategies/core';
import { BoxExtendedProps, Box } from 'grommet';
import { FormNext, FormPrevious } from 'grommet-icons';
import { FC } from 'react';
import { styleConstants } from './styles/themes';

export interface IPageNumber extends BoxExtendedProps {
  number: number;
  selected?: boolean;
}

export const PageNumber: FC<IPageNumber> = (props: IPageNumber) => {
  return (
    <Box
      {...props}
      style={{
        ...props.style,
        cursor: 'pointer',
        height: '32px',
        width: '32px',
        backgroundColor: '#D9D9D9',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: props.selected ? 'bold' : 'normal',
        userSelect: 'none',
      }}
      align="center"
      justify="center">
      {props.number}
    </Box>
  );
};

export interface TableColumn {
  title: string | React.ReactNode;
  width?: string;
  show?: boolean;
  align?: 'start' | 'end' | 'center';
}

export interface PagedTableI extends BoxExtendedProps {
  page: Page;
  columns: TableColumn[];
  rows: (row: number, column: number) => React.ReactElement;
  updatePage: (page: Page) => void;
  invert?: boolean;
}

export const PagedTable: FC<PagedTableI> = (props: PagedTableI) => {
  const page = props.page;

  const hasNext = page.totalPages !== undefined && page.number < page.totalPages - 1;
  const hasPrev = page.totalPages !== undefined && page.number > 0;

  const nextPage = () => {
    if (hasNext) {
      props.updatePage({ ...page, number: page.number + 1 });
    }
  };

  const prevPage = () => {
    if (hasPrev) {
      props.updatePage({ ...page, number: page.number - 1 });
    }
  };

  const setPage = (number: number) => {
    if (page.totalPages !== undefined && number <= page.totalPages) {
      props.updatePage({ ...page, number });
    }
  };

  if (props.columns === undefined) {
    return <></>;
  }

  const invert = props.invert !== undefined ? props.invert : false;
  const rowColor = invert ? styleConstants.colors.cardBackground : styleConstants.colors.highlightedLight;
  const backgroundColor = invert ? styleConstants.colors.highlightedLight : styleConstants.colors.cardBackground;

  return (
    <Box
      style={{
        width: '100%',
        userSelect: 'none',
        padding: '24px 16px',
        border: '1px solid',
        borderColor: styleConstants.colors.lightGrayBorder,
        borderRadius: '8px',
        backgroundColor: backgroundColor,
        ...props.style,
      }}>
      <Box
        direction="row"
        style={{
          width: '100%',
          textTransform: 'uppercase',
          fontSize: '12px',
          fontWeight: '700',
          marginBottom: '26px',
          padding: '0px 24px',
          color: styleConstants.colors.ligthGrayText,
        }}>
        {props.columns.map((column) => {
          const show = column.show === undefined ? true : column.show;
          return show ? (
            <Box
              direction="row"
              justify={column.align || 'center'}
              style={{ width: column.width, textAlign: column.align ? column.align : 'center' }}>
              {column.title}
            </Box>
          ) : (
            <></>
          );
        })}
      </Box>
      <Box direction="column" style={{ width: '100%' }}>
        {Array.from(Array(page.perPage).keys()).map((rowIx) => {
          return (
            <Box
              key={rowIx}
              fill
              direction="row"
              align="center"
              style={{
                border: '1px solid',
                borderColor: styleConstants.colors.lightGrayBorder,
                borderRadius: '20px',
                height: '40px',
                marginBottom: '16px',
                padding: '10px 16px',
                backgroundColor: rowColor,
              }}>
              {Array.from(Array(page.perPage).keys()).map((colIx) => {
                const column = props.columns[colIx];
                if (column === undefined) {
                  return <></>;
                }
                const show = column.show === undefined ? true : column.show; // Repeated code as above. Changes need to be done in both places
                return show ? (
                  <Box
                    key={colIx}
                    direction="row"
                    justify={column.align || 'center'}
                    style={{ width: props.columns[colIx].width, userSelect: 'text' }}>
                    {props.rows(rowIx, colIx)}
                  </Box>
                ) : (
                  <></>
                );
              })}
            </Box>
          );
        })}
      </Box>

      <Box direction="row" justify="center" align="center" style={{ height: '60px' }}>
        <Box style={{ marginRight: '12px', cursor: 'pointer' }} onClick={() => prevPage()}>
          <FormPrevious></FormPrevious>
        </Box>

        {Array.from(Array(page.totalPages).keys()).map((ix) => {
          return (
            <PageNumber
              onClick={() => setPage(ix)}
              style={{ marginRight: '8px' }}
              key={ix}
              number={ix + 1}
              selected={page.number === ix}></PageNumber>
          );
        })}
        <Box style={{ marginLeft: '12px', cursor: 'pointer' }} onClick={() => nextPage()}>
          <FormNext></FormNext>
        </Box>
      </Box>
    </Box>
  );
};
