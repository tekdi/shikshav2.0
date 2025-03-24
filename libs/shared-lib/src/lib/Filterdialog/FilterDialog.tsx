// sonar-exclusion
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
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
const CustomResourceCheckbox = ({
  option,
  filterCode,
  handleCheckboxChange,
  currentSelectedValues,
}: any) => (
  <FormControlLabel
    key={option.label}
    control={
      <Checkbox
        checked={
          Array.isArray(currentSelectedValues) &&
          currentSelectedValues.includes(
            filterCode === 'mimeType' ? option.value : option.label
          )
        }
        onChange={(event) => handleCheckboxChange(event, filterCode)}
        value={filterCode === 'mimeType' ? option.value : option.label}
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
export const FilterDialog = ({
  open,
  onClose,
  filter,
  selectedSubjects,
  selectedContentTypes,
  onSubjectsChange,
  onContentTypeChange,
  onApply,
  frameworkFilter,
  filterValues,
  isMobile = false,
  resources = [],
  mimeType = [],
}: {
  open?: boolean;
  onClose?: () => void;
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
  isMobile?: boolean;
  resources?: { label: string; value: string }[];
  mimeType?: { label: string; value: string }[];
}) => {
  // Manage the selected values for each category
  const [selectedValues, setSelectedValues] = useState(filterValues ?? {});
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    resource: [] as string[],
    mimeType: [] as string[],
  });
  localStorage.getItem('category');
  const updateSelectedValues = (filterCode: string, newValue: any) => {
    setSelectedValues((prev: any) => ({
      ...prev,
      [filterCode]: newValue,
      ...(filterCode === 'topic' && { subTopic: [] }), // Reset subTopic if topic changes
    }));
  };
  const handleChange = (event: any, filterCode: string) => {
    const { value } = event.target;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    localStorage.setItem('category', newValue[0]);
    if (filterCode === 'topic') {
      setSelectedTopic(newValue); // Update the selected topic state
    }
    updateSelectedValues(filterCode, newValue);
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

  const handleResourceCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    filterType: 'resource' | 'mimeType'
  ) => {
    const { checked, value } = event.target;
    setSelectedFilters((prev: any) => {
      const currentValues = prev[filterType] || [];
      return {
        ...prev,
        [filterType]: checked
          ? [...currentValues, value]
          : currentValues.filter((v: string) => v !== value),
      };
    });
    setSelectedValues((prev: any) => {
      const currentValues = prev[filterType] || [];
      const updatedValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v: string) => v !== value);

      return { ...prev, [filterType]: updatedValues };
    });
  };
  console.log('isMobile', selectedValues);

  return (
    <>
      {isMobile ? (
        <Dialog
          open={open ?? false}
          onClose={onClose}
          fullWidth
          sx={{
            borderRadius: '16px',
            '& .MuiDialog-paper': { backgroundColor: '#FEF7FF' },
          }}
        >
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* new filter frameworkFilter */}
              {frameworkFilter?.categories?.map((category: any) => {
                const filterCode =
                  category?.code === 'subTopic' ? 'subTopic' : category?.code;

                // Transform terms into options
                const options =
                  category?.terms?.map((term: any) => ({
                    label: term?.name,
                    value: term?.code,
                  })) ?? [];

                // Get the selected vaalues for the current category
                const currentSelectedValues =
                  selectedValues?.[filterCode] ?? [];
                return (
                  <FormControl
                    fullWidth
                    key={filterCode}
                    sx={formControlStyles}
                  >
                    <FormLabel
                      component="legend"
                      sx={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#181D27',
                      }}
                    >
                      {category?.name === 'Sub-Topic'
                        ? 'Select Resource Type'
                        : category?.name}
                    </FormLabel>

                    {/* Topic - RadioGroup */}
                    {filterCode === 'topic' && (
                      <RadioGroup
                        value={currentSelectedValues?.[0] ?? ''}
                        onChange={(event) => handleChange(event, filterCode)}
                      >
                        {options?.map((option: any) => (
                          <CustomRadio key={option?.value} option={option} />
                        ))}
                      </RadioGroup>
                    )}

                    {/* SubTopic - Checkboxes */}
                    {filterCode === 'subTopic' && (
                      <Box>
                        {options
                          ?.filter((option: any) => {
                            // Find the selected topic's associated terms (subtopics) in frameworkFilter
                            const topicCategory =
                              frameworkFilter.categories?.find(
                                (category: any) => category.code === 'topic'
                              );

                            // Get the currently selected topic's code
                            const selectedTopicCode =
                              selectedValues?.topic?.[0];

                            if (!selectedTopicCode || !topicCategory)
                              return false;

                            // Find the selected topic object
                            const selectedTopic = topicCategory.terms?.find(
                              (term: any) => term.code === selectedTopicCode
                            );

                            // Check if the subtopic is associated with the selected topic and is "Live"
                            return selectedTopic?.associations?.some(
                              (association: any) =>
                                association.code === option.value &&
                                association.status === 'Live'
                            );
                          })
                          ?.map((option: any) => (
                            <CustomCheckbox
                              key={option?.label}
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
                        checked={
                          (selectedContentTypes || []).indexOf(type) > -1
                        }
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
                    onClose?.();
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
                    onClose?.();
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
      ) : (
        <Box
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid #DDDDDD',
            boxShadow: '0px 8px 8px -4px #0A0D120A',
          }}
        >
          <Box sx={{ flexDirection: 'column', gap: 2 }}>
            {/* new filter frameworkFilter */}
            <FormControl fullWidth sx={formControlStyles}>
              {resources?.length > 0 && (
                <Box sx={{ display: 'grid' }}>
                  <FormLabel
                    component="legend"
                    sx={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#181D27',
                    }}
                  >
                    Select Resource Type
                  </FormLabel>
                  {resources?.map((option: any) => (
                    <CustomResourceCheckbox
                      key={option?.label}
                      option={option}
                      filterCode="resource"
                      handleCheckboxChange={handleResourceCheckboxChange}
                      currentSelectedValues={selectedFilters.resource}
                    />
                  ))}
                </Box>
              )}
              {/* SubTopic - Checkboxes */}

              <Box sx={{ display: 'grid' }}>
                <FormLabel
                  component="legend"
                  sx={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#181D27',
                  }}
                >
                  Select Content Type
                </FormLabel>
                {mimeType?.map((option: any) => (
                  <CustomResourceCheckbox
                    key={option?.label}
                    option={option}
                    filterCode="mimeType"
                    handleCheckboxChange={handleResourceCheckboxChange}
                    currentSelectedValues={selectedFilters.mimeType}
                  />
                ))}
              </Box>
            </FormControl>
          </Box>
          <Divider sx={{ marginTop: 4 }} />

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
          <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedValues({});
                onApply?.({});
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
              onClick={() => onApply?.(selectedValues)}
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
          </DialogActions>
        </Box>
      )}
    </>
  );
};

export default React.memo(FilterDialog);
