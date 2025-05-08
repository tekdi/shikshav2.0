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
    // selectedFilters.mimeType = [];
    // selectedFilters.resource = [];
    localStorage.removeItem('selectedFilters');
    onClose?.();
  };
  return (
    <>
      {isMobile ? (
        <Dialog
          open={open ?? false}
          onClose={onClose}
          maxWidth="sm"
          sx={{
            borderRadius: '16px',
            '& .MuiDialog-paper': {
              backgroundColor: '#FEF7FF',
              display: 'flex',
              flexDirection: 'column',
              height: '90vh',
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
              overflowY: 'auto',
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
              ) && (
                <FormControl fullWidth key="subTopic" sx={formControlStyles}>
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
                    Select Sub Category
                  </FormLabel>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {(() => {
                      const selectedTopicCode = Array.isArray(
                        selectedValues?.topic
                      )
                        ? selectedValues.topic[0]
                            ?.replace(/\s/g, '')
                            .toLowerCase()
                        : selectedValues?.topic
                            ?.replace(/\s/g, '')
                            .toLowerCase();

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

                      const uniqueAssociations = [
                        ...new Map(
                          associations.map((a: any) => [a.code, a])
                        ).values(),
                      ];

                      return uniqueAssociations.map((option: any) => (
                        <CustomCheckbox
                          key={option.code}
                          option={{ label: option.name, value: option.code }}
                          filterCode="subTopic"
                          handleCheckboxChange={handleCheckboxChange}
                          currentSelectedValues={selectedValues?.subTopic ?? []}
                        />
                      ));
                    })()}
                  </Box>
                </FormControl>
              )}

              {/* <Box sx={{ flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth sx={formControlStyles}>
                  {resources?.length > 0 && (
                    <Box sx={{ display: 'grid' }}>
                      <Typography
                        sx={{
                          fontSize: '18px',
                          fontWeight: 600,
                          color: '#181D27',
                        }}
                      >
                        Select Resource Type
                      </Typography>
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

                  <Box sx={{ display: 'grid' }}>
                    <Typography
                      sx={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#181D27',
                      }}
                    >
                      Select Content Type
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
              </Box> */}
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
              {/* <Button
                variant="outlined"
                onClick={() => {
                  onApply?.({});
                  setSelectedValues({});
                  // selectedFilters.mimeType = [];
                  // selectedFilters.resource = [];
                  localStorage.removeItem('selectedFilters');
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
              </Button> */}
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
            boxShadow: '0px 8px 8px -4px #0A0D120A',
          }}
        >
          <Box sx={{ flexDirection: 'column' }}>
            {/* new filter frameworkFilter */}
            <FormControl fullWidth sx={formControlStyles}>
              {resources?.length > 0 && (
                <Box sx={{ display: 'grid' }}>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#181D27',
                      margin: '6px 0px',
                    }}
                  >
                    Select Resource Type
                  </Typography>
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
                    margin: '6px',
                  }}
                >
                  Select Content Type
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
          <Divider />

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
          <DialogActions sx={{ justifyContent: 'center', mt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedValues({});
                selectedFilters.mimeType = [];
                selectedFilters.resource = [];
                localStorage.removeItem('selectedFilters');
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
              onClick={() => {
                localStorage.setItem(
                  'selectedFilters',
                  JSON.stringify(selectedValues)
                );
                onApply?.(selectedValues);
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
          </DialogActions>
        </Box>
      )}
    </>
  );
};

export default React.memo(FilterDialog);
