// sonar-exclusion
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
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
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
    sx={{
      p: '0px',
      margin: '-5px', // Remove default margin
      '& .MuiFormControlLabel-label': {
        // Target the label specifically
        fontSize: '14px', // Corrected spelling
      },
    }}
    control={
      <Checkbox
        size="small"
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
    sx={{
      p: '0px',
      margin: '-5px', // Remove default margin
      '& .MuiFormControlLabel-label': {
        // Target the label specifically
        fontFamily: 'Manrope, sans-serif', // Corrected spelling
      },
    }}
    key={option.label}
    control={
      <Checkbox
        size="small"
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
    value={option.value}
    sx={{
      p: '0px',
      margin: '-5px', // Remove default margin
      '& .MuiFormControlLabel-label': {
        // Target the label specifically
        fontSize: '14px', // Corrected spelling
      },
    }}
    control={
      <Radio
        size="small"
        sx={{ color: '#1D1B20', '&.Mui-checked': { color: '#FFBD0D' } }}
      />
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

  useEffect(() => {
    const mimeType = filterValues?.request?.filters?.mimeType;
    const resource = filterValues?.request?.filters?.resource;

    const isMimeTypeEmpty = !mimeType || mimeType.length === 0;
    const isResourceEmpty = !resource || resource.length === 0;

    if (isMimeTypeEmpty && isResourceEmpty) {
      setSelectedValues({});
      setSelectedFilters({
        mimeType: [],
        resource: [],
      });
    } else {
      setSelectedValues({
        mimeType: mimeType || [],
        resource: resource || [],
      });

      setSelectedFilters({
        mimeType: mimeType || [],
        resource: resource || [],
      });
    }
    if (filterValues?.request?.filters?.topic) {
      setSelectedTopic(filterValues?.request?.filters?.topic);
      setSelectedValues({
        topic: filterValues?.request?.filters?.topic,
        subTopic: filterValues?.request?.filters?.subTopic,
      });
    }
    if (filterValues?.filters?.topic) {
      localStorage.setItem('category', filterValues?.filters?.topic);

      setSelectedTopic(filterValues?.filters?.topic);
      setSelectedValues({
        topic: filterValues?.filters?.topic,
        subTopic: filterValues?.filters?.subTopic,
      });
    }
  }, [filterValues]);

  useEffect(() => {
    const savedFilters = localStorage.getItem('selectedFilters');
    if (savedFilters) {
      setSelectedFilters(JSON.parse(savedFilters));
      setSelectedValues(JSON.parse(savedFilters));
    }
  }, []);
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
      const subCategory = checked
        ? [...currentValues, value]
        : currentValues.filter((v: string) => v !== value);
      localStorage.setItem('subcategory', subCategory);
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
    const currentValues = selectedFilters[filterType] || [];

    const updatedValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v: string) => v !== value);

    const updatedFilters = {
      ...selectedFilters,
      [filterType]: updatedValues,
    };

    setSelectedFilters(updatedFilters);
    setSelectedValues((prev: any) => ({
      ...prev,
      [filterType]: updatedValues,
    }));

    localStorage.setItem('selectedFilters', JSON.stringify(updatedFilters));
    onApply?.(updatedFilters);
  };

  useEffect(() => {
    console.log(
      'Updated Filters (inside useEffect)==',
      selectedValues,
      selectedFilters
    );
  }, [selectedValues, selectedFilters]);
  const handleCloseDialog = () => {
    onApply?.({});
    setSelectedValues({});

    localStorage.removeItem('selectedFilters');
    onClose?.();
  };
  return (
    <>
      {isMobile ? (
        <Dialog
          open={open ?? false}
          onClose={onClose}
          // maxWidth="sm"
          sx={{
            borderRadius: '16px',
            '& .MuiDialog-paper': {
              backgroundColor: '#FEF7FF',
              display: 'flex',
              flexDirection: 'column',
              height: '90vh',
              // maxHeight: '600px',
              width: { xs: '100%', sm: '100%', md: '30%' },
              // maxWidth: '340px',
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              padding: '0px 16px',
            }}
          >
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            dividers
            sx={{
              flex: 1,
              overflow: 'hidden',
              padding: '0px 16px',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* new filter frameworkFilter */}
              {frameworkFilter?.categories
                ?.filter((category: any) => category.code !== 'subTopic') // ✅ Skip subTopic
                ?.map((category: any) => {
                  const filterCode = category?.code;

                  // Transform terms into options
                  const options =
                    category?.terms?.map((term: any) => ({
                      label: term?.name,
                      value: term?.name,
                    })) ?? [];

                  // Get selected values for the current category

                  const normalizedSelectedTopic = Array.isArray(
                    selectedValues?.topic
                  )
                    ? selectedValues.topic.map((val: any) =>
                        val.replace(/\s/g, '').toLowerCase()
                      )
                    : typeof selectedValues?.topic === 'string'
                    ? selectedValues.topic.replace(/\s/g, '').toLowerCase()
                    : '';

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
                          color: '#000000',
                          '&.Mui-focused': {
                            color: '#000000', // Prevent color change on focus
                          },
                        }}
                      >
                        Select {category?.name}{' '}
                      </FormLabel>

                      {/* Topic - RadioGroup */}
                      {filterCode === 'topic' && (
                        <RadioGroup
                          value={normalizedSelectedTopic}
                          onChange={(event) => handleChange(event, filterCode)}
                        >
                          {options?.map((option: any) => {
                            const normalizedOptionValue = option.value
                              .replace(/\s/g, '')
                              .toLowerCase();
                            return (
                              <CustomRadio
                                key={option?.value}
                                option={{
                                  ...option,
                                  value: normalizedOptionValue,
                                }}
                              />
                            );
                          })}
                        </RadioGroup>
                      )}
                    </FormControl>
                  );
                })}

              {frameworkFilter.categories?.some(
                (cat: any) => cat.code === 'subTopic'
              ) &&
                (() => {
                  const selectedTopicCode = Array.isArray(selectedValues?.topic)
                    ? selectedValues.topic[0]?.replace(/\s/g, '').toLowerCase()
                    : selectedValues?.topic?.replace(/\s/g, '').toLowerCase();

                  const topicTerm = frameworkFilter.categories
                    ?.find((cat: any) => cat.code === 'topic')
                    ?.terms?.find(
                      (term: any) =>
                        term.code.replace(/\s/g, '').toLowerCase() ===
                        selectedTopicCode
                    );

                  const associations =
                    topicTerm?.associations?.filter(
                      (a: any) => a.status === 'Live'
                    ) ?? [];

                  if (associations.length > 0) {
                    return (
                      <FormControl
                        fullWidth
                        key="subTopic"
                        sx={formControlStyles}
                      >
                        <FormLabel
                          component="legend"
                          sx={{
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#000000',
                            '&.Mui-focused': {
                              color: '#000000',
                            },
                          }}
                        >
                          Select Sub Category
                        </FormLabel>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          {associations.map((option: any) => (
                            <CustomCheckbox
                              key={option.code}
                              option={{
                                label: option.name,
                                value: option.code,
                              }}
                              filterCode="subTopic"
                              handleCheckboxChange={handleCheckboxChange}
                              currentSelectedValues={
                                selectedValues?.subTopic ?? []
                              }
                            />
                          ))}
                        </Box>
                      </FormControl>
                    );
                  }
                  return null;
                })()}
            </Box>

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
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', mt: 1 }}>
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
        </Dialog>
      ) : (
        <Box
          sx={{
            padding: '8px 18px',
            borderRadius: '16px',
            border: '1px solid #DDDDDD',
            boxShadow: '0px 20px 24px -1px #0A0D121A',
          }}
        >
          <Box sx={{ flexDirection: 'column' }}>
            {/* new filter frameworkFilter */}
            <FormControl fullWidth sx={formControlStyles}>
              {resources?.length > 0 && (
                <Box sx={{ display: 'grid' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      margin: '3px 0px',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#181D27',
                        margin: '3px 0px',
                      }}
                    >
                      Resource Type
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedValues({});
                        selectedFilters.mimeType = [];
                        selectedFilters.resource = [];
                        localStorage.removeItem('selectedFilters');
                        onApply?.({});
                      }}
                      sx={{
                        color: '#1D1B20',
                        '&:hover': {
                          color: '#FFBD0D',
                        },
                      }}
                    >
                      <RestartAltIcon fontSize="small" />
                    </IconButton>
                  </Box>
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
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#181D27',
                    margin: '3px',
                  }}
                >
                  Content Type
                </Typography>
                {mimeType?.map((option: any) => (
                  <CustomResourceCheckbox
                    key={option?.label}
                    option={option}
                    filterCode="mimeType"
                    handleCheckboxChange={handleResourceCheckboxChange}
                    currentSelectedValues={selectedFilters.mimeType ?? []}
                  />
                ))}
              </Box>
            </FormControl>
          </Box>

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
        </Box>
      )}
    </>
  );
};

export default React.memo(FilterDialog);
