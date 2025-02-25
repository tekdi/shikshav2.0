import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CommonCard } from '@shared-lib';
import React, { memo, useCallback } from 'react';
import { ContentSearchResponse } from '../services/Search';

const RenderTabContent = memo(
  ({
    contentData,
    _grid,
    trackData,
    type,
    handleCardClick,
    hasMoreData,
    handleLoadMore,
    tabs,
    value,
    onChange,
    ariaLabel,
  }: {
    contentData: ContentSearchResponse[];
    _grid: any;
    trackData?: [] | undefined;
    type: string;
    handleCardClick: (id: string, mimeType: string) => void;
    hasMoreData: boolean;
    handleLoadMore: (e: any) => void;
    tabs?: any[];
    value?: number;
    onChange?: (event: React.SyntheticEvent, newValue: number) => void;
    ariaLabel?: string;
  }) => {
    const handleLoadMoreCallback = useCallback(handleLoadMore, []);
    const handleCardClickCallback = useCallback(handleCardClick, []);

    return (
      <Box sx={{ width: '100%' }}>
        {tabs?.length !== undefined && tabs?.length > 1 && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={onChange}
              aria-label={ariaLabel}
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#6750A4',
                  height: '3px',
                  maxWidth: 49,
                  width: '100%',
                  marginLeft: '1.2rem',
                },
              }}
              sx={{
                '.MuiTab-root': {
                  color: '#49454F', // Default tab text color
                  fontWeight: 500,
                  textTransform: 'none', // Ensures text remains camel case
                },
                '.Mui-selected': {
                  color: '#6750A4 !important', // Selected tab text color
                },
              }}
            >
              {tabs.map((tab: any, index: number) => (
                <Tab
                  key={tab.label}
                  icon={tab.icon ?? undefined}
                  label={tab.label}
                  {...{
                    id: `simple-tab-${index}`,
                    'aria-controls': `simple-tabpanel-${index}`,
                  }}
                />
              ))}
            </Tabs>
          </Box>
        )}
        <Box sx={{ flexGrow: 1, mt: 2 }}>
          <Grid container spacing={2}>
            {contentData?.map((item: any) => (
              <Grid
                key={item?.identifier}
                size={{ xs: 6, sm: 6, md: 3, lg: 3 }}
                {..._grid}
                // {...(propData?._grid || {})}
              >
                <CommonCard
                  title={(item?.name || '').trim()}
                  image={
                    item?.posterImage && item?.posterImage !== 'undefined'
                      ? item?.posterImage
                      : '/assests/images/image_ver.png'
                  }
                  content={item?.description || '-'}
                  actions={item?.contentType}
                  // subheader={item?.contentType}
                  orientation="horizontal"
                  item={[item]}
                  TrackData={trackData}
                  type={type}
                  onClick={() =>
                    handleCardClick(
                      item?.identifier || '',
                      item?.mimeType || ''
                    )
                  }
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            {hasMoreData ? (
              <Button variant="contained" onClick={handleLoadMore}>
                {'Load More'}
              </Button>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No more data available
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    );
  }
);

RenderTabContent.displayName = 'RenderTabContent';
export default RenderTabContent;
