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
  FormLabel,
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
const formControlStyles = {
  '&.Mui-focused': { color: '#1D1B20' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#1D1B20' },
  '& .MuiInputLabel-root': { color: '#1D1B20' },
  '& .MuiOutlinedInput-root': {
    color: '#1D1B20',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1D1B20' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1D1B20' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1D1B20',
    },
  },
};

// Reusable Checkbox Component
const CustomCheckbox = ({
  option,
  filterCode,
  handleCheckboxChange,
  currentSelectedValues,
}: any) => (
  <FormControlLabel
    key={option.label}
    control={
      <Checkbox
        checked={currentSelectedValues.includes(option.label)}
        onChange={(event) => handleCheckboxChange(event, filterCode)}
        value={option.label}
        sx={{ color: '#1D1B20', '&.Mui-checked': { color: '#FFBD0D' } }}
      />
    }
    label={option.label}
  />
);

// Reusable Radio Component
const CustomRadio = ({ option }: any) => (
  <FormControlLabel
    key={option.value}
    value={option.value}
    control={
      <Radio sx={{ color: '#1D1B20', '&.Mui-checked': { color: '#FFBD0D' } }} />
    }
    label={option.label}
  />
);
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
  const [selectedValues, setSelectedValues] = useState(
    filterValues ? filterValues : {}
  ); // Initialize as an empty object
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleChange = (event: any, filterCode: string) => {
    const { value } = event.target;
    const newValue = typeof value === 'string' ? value.split(',') : value;

    if (filterCode === 'topic') {
      setSelectedTopic(newValue); // Update the selected topic
      setSelectedValues((prev: any) => ({
        ...prev,
        subTopic: [], // Reset subtopics when topic changes
      }));
    }

    setSelectedValues((prev: any) => ({
      ...prev,
      [filterCode]: newValue,
    }));
  };
  const handleCheckboxChange = (event: any, filterCode: string) => {
    const { checked, value } = event.target;

    setSelectedValues((prev: any) => {
      const currentValues = prev[filterCode] || [];
      return {
        ...prev,
        [filterCode]: checked
          ? [...currentValues, value]
          : currentValues.filter((v: string) => v !== value),
      };
    });
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
      {/* <DialogTitle>Filters</DialogTitle> */}
      {/* <IconButton
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
      </IconButton> */}
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* new filter frameworkFilter */}
          {frameworkFilter?.categories?.map((category: any) => {
            const filterCode =
              category?.code === 'sub-topic' ? 'subTopic' : category?.code;

            // Transform terms into options
            const options =
              category?.terms?.map((term: any) => ({
                label: term.name,
                value: term.code,
              })) ?? [];

            // Get the selected values for the current category
            const currentSelectedValues = selectedValues?.[filterCode] ?? [];

            return (
              <FormControl fullWidth key={filterCode} sx={formControlStyles}>
                <FormLabel
                  component="legend"
                  sx={{ fontSize: '18px', fontWeight: 600, color: '#181D27' }}
                >
                  {category?.name === 'Sub-Topic'
                    ? 'Select Resource Type'
                    : `Select ${category?.name}`}
                </FormLabel>

                {filterCode === 'topic' && (
                  <RadioGroup
                    value={currentSelectedValues[0] ?? ''}
                    onChange={(event) => handleChange(event, filterCode)}
                  >
                    {options.map((option: any) => (
                      <CustomRadio key={option.value} option={option} />
                    ))}
                  </RadioGroup>
                )}

                {filterCode === 'subTopic' && selectedTopic && (
                  <Box>
                    {options
                      .filter((option: any) =>
                        option.value.includes(selectedTopic)
                      )
                      .map((option: any) => (
                        <CustomCheckbox
                          key={option.label}
                          option={option}
                          filterCode={filterCode}
                          handleCheckboxChange={handleCheckboxChange}
                          currentSelectedValues={currentSelectedValues}
                        />
                      ))}
                  </Box>
                )}
              </FormControl>
            );
          })}
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
                const value = e.target.value as string[]; // Ensure TypeScript recognizes it as an array
                //@ts-ignore
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
                //@ts-ignore
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
                color: '#414651',
                textTransform: 'none',
                border: '1px solid #D5D7DA',
                width: '132px',
              }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                onApply?.(selectedValues);
                onClose();
              }}
              sx={{
                borderRadius: '100px',
                bgcolor: '#FFBD0D',
                color: '#2B3133',
                marginLeft: 2,
                textTransform: 'none',
                width: '132px',
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
