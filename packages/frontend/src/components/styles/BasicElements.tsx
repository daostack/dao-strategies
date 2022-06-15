import { Button, Form, Text, TextInput, TextArea, Box, Select, ButtonExtendedProps } from 'grommet';
import { FormClose } from 'grommet-icons';
import React, { useState } from 'react';

export interface IElement {
  onClick?: () => void;
  style?: React.CSSProperties;
  children?: Array<React.ReactNode> | string;
}

export interface IValueElement extends IElement {
  value?: string;
}

const SelectCore = (props: IValueElement) => {
  const allSeasons = (props as any).options;
  const [selected, setSelected] = useState<any[]>([]);

  const onRemoveSeason = (season: any) => {
    const seasonIndex = allSeasons.indexOf(season);
    setSelected(selected.filter((selectedSeason) => selectedSeason !== seasonIndex));
  };

  const onSelected = (props: any) => {
    const selected = [...(props.selected as any[])] as any[];
    setSelected(selected.sort());
  };

  const renderSeason = (season: any) => (
    <Button
      key={`season_tag_${season}`}
      href="#"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onRemoveSeason(season);
      }}
      onFocus={(event) => event.stopPropagation()}>
      <Box
        align="center"
        direction="row"
        gap="xsmall"
        pad={{ vertical: 'xsmall', horizontal: 'small' }}
        margin="xsmall"
        background="brand"
        round="large">
        <Text size="small">{season}</Text>
        <Box round="full" margin={{ left: 'xsmall' }}>
          <FormClose size="small" style={{ width: '12px', height: '12px' }} />
        </Box>
      </Box>
    </Button>
  );

  const renderOption = (option: any, state: any) => (
    <Box pad="small" background={state.active ? 'active' : undefined}>
      {option}
    </Box>
  );

  return (
    // Uncomment <Grommet> lines when using outside of storybook
    // <Grommet theme={...}>
    <Box fill align="center" justify="center">
      <Select
        closeOnChange={false}
        multiple
        value={
          <Box wrap direction="row" width="small">
            {selected && selected.length ? (
              selected.map((index) => renderSeason(allSeasons[index]))
            ) : (
              <Box pad={{ vertical: 'xsmall', horizontal: 'small' }} margin="xsmall">
                Select Season
              </Box>
            )}
          </Box>
        }
        options={allSeasons}
        selected={selected}
        disabled={[2, 6]}
        onChange={onSelected}>
        {renderOption}
      </Select>
    </Box>
  );
};

export interface IButton extends ButtonExtendedProps {}

export const AppButton = (props: IButton) => {
  return (
    <>
      <Button primary={props.primary} style={props.style}>
        <Box pad={{ vertical: 'small', horizontal: 'medium' }}>
          <Text weight="bold">{props.children as React.ReactNode[]}</Text>
        </Box>
      </Button>
    </>
  );
};

export const AppForm = Form;

export const AppInput = TextInput;

export const AppTextArea = TextArea;

export const AppSelect = SelectCore;
