import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

const FilterDialog = ({
  open,
  onClose,
  filter,
  language,
  selectedSubjects,
  selectedContentTypes,
  sort,
  onLanguageChange,
  onSubjectsChange,
  onContentTypeChange,
  onSortChange,
  onApply,
  frameworkFilter,
  filterValues,
}: {
  open: boolean;
  onClose: () => void;
  filter?: {
    sort?: boolean;
    language?: string[];
    subject?: string[];
    contentType?: string[];
  };
  language?: string;
  selectedSubjects?: string[];
  selectedContentTypes?: string[];
  sort?: any;
  onLanguageChange?: (language: string) => void;
  onSubjectsChange?: (subjects: string) => void;
  onContentTypeChange?: (contentType: string) => void;
  onSortChange?: (sort: any) => void;
  onApply?: (data: any) => void;
  frameworkFilter: any;
  filterValues: any;
}) => {
  // Manage the selected values for each category
  const [selectedValues, setSelectedValues] = useState(filterValues ?? {}); // Initialize as an empty object

  const handleChange = (event: any, filterCode: any) => {
    const { value } = event.target;

    setSelectedValues((prev: any) => ({
      ...prev,
      [filterCode]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      sx={{
        borderRadius: '16px',
        '& .MuiDialog-paper': { backgroundColor: '#FEF7FF' },
      }}
    >
      <DialogTitle>Filters</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* new filter frameworkFilter */}
          <FrameworkFilterComponent
            frameworkFilter={frameworkFilter}
            selectedValues={selectedValues}
            handleChange={handleChange}
          />
        </Box>
        <Divider sx={{ marginTop: 4 }} />
        {/* <FormControl fullWidth>
            <InputLabel id="multi-checkbox-label">Select Options</InputLabel>
            <Select
              labelId="multi-checkbox-label"
              multiple
              value={selectedOptions}
              onChange={handleChange}
              renderValue={(selected) => selected.join(', ')} // Display selected options
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox checked={selectedOptions.indexOf(option) > -1} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        {/* Sort By */}
        {filter?.sort && (
          <>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Sort By
            </Typography>
            <FormControl>
              <RadioGroup
                value={sort?.sortBy || 'asc'}
                onChange={(e) => {
                  const value = e.target.value;
                  onSortChange?.(value);
                }}
              >
                <FormControlLabel
                  value="asc"
                  control={<Radio />}
                  label="A to Z"
                />
                <FormControlLabel
                  value="desc"
                  control={<Radio />}
                  label="Z to A"
                />
              </RadioGroup>
            </FormControl>
          </>
        )}
        {/* Language */}
        {filter?.language && filter.language.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              onChange={(e) => onLanguageChange?.(e.target.value)}
              label="Language"
            >
              {filter.language.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {/* Subject */}
        {filter?.subject && filter.subject.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Subject</InputLabel>
            <Select
              multiple
              value={selectedSubjects || []}
              onChange={(e) => {
                const value = e.target.value as string[];
                onSubjectsChange?.(value);
              }}
              renderValue={(selected) => (selected as string[]).join(', ')} // Join array values for display
              label="Subject"
            >
              {filter.subject.map((subject) => (
                <MenuItem key={subject} value={subject}>
                  <Checkbox
                    checked={(selectedSubjects || []).indexOf(subject) > -1}
                  />
                  <ListItemText primary={subject} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {/* Content Type */}
        {filter?.contentType && filter.contentType.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Content Type</InputLabel>
            <Select
              multiple
              value={selectedContentTypes || []}
              onChange={(e) => {
                const value = e.target.value as string[];
                onContentTypeChange?.(value);
              }}
              renderValue={(selected) => (selected as string[]).join(', ')}
              label="Content Type"
            >
              {filter.contentType.map((type) => (
                <MenuItem key={type} value={type}>
                  <Checkbox
                    checked={(selectedContentTypes || []).indexOf(type) > -1}
                  />
                  <ListItemText primary={type} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {/* Buttons */}
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                onApply?.({});
                setSelectedValues({});
                onClose();
              }}
              sx={{
                borderRadius: '100px',
                color: '#6750A4',
                textTransform: 'none',
              }}
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                onApply?.(selectedValues);
                onClose();
              }}
              sx={{
                borderRadius: '100px',
                bgcolor: '#6750A4',
                color: '#FFFFFF',
                marginLeft: 2,
                textTransform: 'none',
              }}
            >
              Apply
            </Button>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(FilterDialog);

const RenderCategories = React.memo(
  ({ categories, selectedValues, handleChange }: any) => {
    const componentKey = `multi-checkbox-label_${categories?.identifier}`;
    const options = categories?.terms.map((term: any) => ({
      label: term.name,
      value: term.code,
    }));

    const currentSelectedValues =
      selectedValues[`se_${categories?.code}s`] || [];

    return (
      <FormControl
        fullWidth
        key={componentKey}
        sx={{
          '&.Mui-focused': {
            color: '#1D1B20',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#1D1B20',
          },
          '& .MuiInputLabel-root': { color: '#1D1B20' },
          '& .MuiOutlinedInput-root': {
            color: '#1D1B20',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1D1B20',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1D1B20',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1D1B20',
            },
          },
        }}
      >
        <InputLabel id={componentKey}>{categories?.name}</InputLabel>
        <Select
          labelId={componentKey}
          input={<OutlinedInput label={categories?.name} />}
          multiple
          value={currentSelectedValues}
          onChange={(event) => handleChange(event, `se_${categories?.code}s`)}
          renderValue={(selected) =>
            (selected as string[])
              .map((selectedValue: any) => {
                const selectedOption = options.find(
                  (option: any) => option.value === selectedValue
                );
                return selectedOption ? selectedOption.label : '';
              })
              .join(', ')
          }
        >
          {options.map((option: any) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                sx={{
                  color: '#6750A4',
                  '&.Mui-checked': {
                    color: '#6750A4',
                  },
                }}
                checked={currentSelectedValues.includes(option.value)}
              />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);

RenderCategories.displayName = 'RenderCategories';

const FrameworkFilterComponent = ({
  frameworkFilter,
  selectedValues,
  handleChange,
}: any) => {
  return frameworkFilter?.categories?.map((categories: any) => {
    return (
      <RenderCategories
        key={categories?.identifier}
        categories={categories}
        selectedValues={selectedValues}
        handleChange={handleChange}
      />
    );
  });
};
