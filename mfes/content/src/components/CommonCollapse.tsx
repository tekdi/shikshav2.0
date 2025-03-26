import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/router'; // Use Next.js router for navigation
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import LensOutlinedIcon from '@mui/icons-material/LensOutlined';
import LensIcon from '@mui/icons-material/Lens';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { CircularProgressWithLabel, getLeafNodes } from '@shared-lib';
// Types for nested data structure and actions
interface NestedItem {
  identifier: string;
  name: string;
  mimeType: string;
  children?: NestedItem[];
}

interface CommonAccordionProps {
  identifier: string;
  title: string;
  data: NestedItem[];
  actions?: { label: string; onClick: () => void }[];
  status?: 'Not started' | 'Completed' | 'In progress' | string;
  progress?: number;
  TrackData?: any[];
}

const getIconByMimeType = (mimeType?: string): React.ReactNode => {
  const icons = {
    'application/pdf': <PictureAsPdfOutlinedIcon />,
    'video/mp4': <PlayCircleOutlineOutlinedIcon />,
    'video/webm': <PlayCircleOutlineOutlinedIcon />,
    'video/x-youtube': <PlayCircleOutlineOutlinedIcon />,
    'application/vnd.sunbird.questionset': <TextSnippetOutlinedIcon />,
  };
  //@ts-ignore
  return icons[mimeType] || <TextSnippetOutlinedIcon />;
};

const RenderNestedData: React.FC<{
  data: NestedItem[];
  expandedItems: Set<string>;
  trackData?: any[];
  toggleExpanded: (identifier: string) => void;
}> = React.memo(function RenderNestedData({
  data,
  expandedItems,
  toggleExpanded,
  trackData,
}) {
  const router = useRouter();

  return data?.map((item) => {
    const isExpanded = expandedItems.has(item.identifier);
    const childrenCount = item.children?.length || 0;
    const newTrack = trackData?.find((e) => e?.courseId == item?.identifier);

    const handleItemClick = (identifier: string) => {
      localStorage.setItem('unitId', identifier);
      const path =
        childrenCount >= 1 &&
        item.mimeType === 'application/vnd.ekstep.content-collection'
          ? `/details/${identifier}`
          : `/player/${item.identifier}`;
      router.push(path);
    };

    return (
      <Stack
        key={item.identifier}
        sx={{
          borderBottom: '1px solid #ccc',
          borderRadius: '4px',
          padding: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          cursor: 'pointer',
          gap: '16px',
        }}
        onClick={() => handleItemClick(item.identifier)}
      >
        <Stack sx={{ width: '100%' }}>
          <RowContent
            title={item.name}
            data={item.children || []}
            mimeType={item.mimeType}
            expandedItems={expandedItems}
            trackCompleted={newTrack?.completed ? 100 : 0}
            showStatus
          />
        </Stack>

        {isExpanded && item.children?.length && (
          <Stack sx={{ marginTop: '8px', paddingLeft: '16px', width: '100%' }}>
            <RenderNestedData
              data={item.children}
              expandedItems={expandedItems}
              toggleExpanded={toggleExpanded}
            />
          </Stack>
        )}
      </Stack>
    );
  });
});

RenderNestedData.displayName = 'RenderNestedData';

export const CommonCollapse: React.FC<CommonAccordionProps> = ({
  identifier,
  title,
  data,
  actions = [],
  TrackData,
}) => {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [trackCompleted, setTrackCompleted] = React.useState(0);
  const [trackProgress, setTrackProgress] = React.useState(0);

  React.useEffect(() => {
    const init = () => {
      try {
        //@ts-ignore
        if (TrackData) {
          const result = TrackData.find((e: any) => e.courseId === identifier);
          setTrackCompleted(result?.completed ? 100 : 0);
          const leafNodes = getLeafNodes(data);
          const completedCount = result?.completed_list?.length || 0;
          const percentage =
            leafNodes.length > 0
              ? Math.round((completedCount / leafNodes.length) * 100)
              : 0;
          setTrackProgress(percentage);
        }
      } catch (e) {
        console.log('error', e);
      }
    };
    init();
  }, [TrackData, identifier, data]);

  const toggleExpanded = (identifier: string) => {
    setExpandedItems((prev) => {
      const newExpandedItems = new Set(prev);
      if (newExpandedItems.has(identifier)) {
        newExpandedItems.delete(identifier);
      } else {
        newExpandedItems.add(identifier);
      }
      return newExpandedItems;
    });
  };

  const handleItemClick = (identifier: string) => {
    const path = `/player/${identifier}`;
    router.push(path);
  };
  return (
    <Box>
      {data?.length > 0 ? (
        <AccordionWrapper
          title={title}
          data={data}
          expandedItems={expandedItems}
          toggleExpanded={toggleExpanded}
          trackProgress={trackProgress}
          trackCompleted={trackCompleted}
          trackData={TrackData ?? []}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onClick={() => handleItemClick(identifier)}
        >
          <Typography variant="body1" fontSize={'14px'} fontWeight={400}>
            {/* @ts-ignore */}
            {getIconByMimeType(data?.mimeType)} {title}
          </Typography>
          <Box>
            {trackCompleted === 100 ? (
              <>
                <CheckCircleIcon sx={{ color: '#21A400' }} />
              </>
            ) : (
              <>
                <ErrorIcon sx={{ color: '#FFB74D' }} />
              </>
            )}
          </Box>
          {/* {trackProgress >= 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                // marginLeft: 'auto',
                position: 'relative',
              }}
            >
              <Progress
                variant="determinate"
                value={100}
                size={30}
                thickness={6}
                sx={{
                  color: '#cccccc',
                  position: 'absolute',
                  left: '10px',
                }}
              />
              <Progress
                variant="determinate"
                value={trackCompleted}
                size={30}
                thickness={6}
                sx={{
                  color: trackCompleted === 100 ? '#21A400' : '#FFB74D',
                  position: 'absolute',
                  left: '10px',
                }}
              />
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginLeft: '6px',
                  color: trackCompleted === 100 ? '#21A400' : '#FFB74D',
                  position: 'absolute',
                  left: '40px',
                }}
              >
                {status &&
                //@ts-ignore
                data?.mimeType === 'application/vnd.ekstep.content-collection'
                  ? status
                  : `${trackCompleted}%`}
              </Typography>
            </Box>
          )} */}
        </Box>
      )}

      {actions.length > 0 && (
        <Box sx={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          {actions.map((action) => (
            <Button
              key={action.label}
              onClick={action.onClick}
              variant="contained"
            >
              {action.label}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CommonCollapse;

const AccordionWrapper = ({
  title,
  data,
  expandedItems,
  toggleExpanded,
  trackProgress,
  trackCompleted,
  trackData,
}: {
  title: string;
  data: NestedItem[];
  expandedItems: Set<string>;
  toggleExpanded: (identifier: string) => void;
  trackProgress: number;
  trackCompleted: number;
  trackData: any[];
}) => {
  const theme = useTheme();

  return (
    <Accordion
      expanded={expandedItems.has(data[0].identifier)}
      onChange={() => toggleExpanded(data[0].identifier)}
    >
      <AccordionSummary
        sx={{
          backgroundColor: theme.palette.custom?.secondaryBackground,
        }}
        expandIcon={
          expandedItems.has(data[0].identifier) ? (
            <ArrowDropDownIcon sx={{ fontSize: '2rem' }} />
          ) : (
            <ArrowDropUpIcon sx={{ fontSize: '2rem' }} />
          )
        }
      >
        <RowContent
          title={title}
          data={data}
          expandedItems={expandedItems}
          trackProgress={trackProgress}
          trackCompleted={trackCompleted}
          showProgress
        />
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <RenderNestedData
          data={data}
          expandedItems={expandedItems}
          toggleExpanded={toggleExpanded}
          trackData={trackData}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export const RowContent = ({
  title,
  data,
  mimeType,
  expandedItems,
  trackProgress,
  trackCompleted,
  showProgress = false,
  showStatus = false,
}: {
  title: string;
  data: NestedItem[];
  expandedItems: Set<string>;
  mimeType?: string;
  trackProgress?: number;
  trackCompleted?: number;
  showProgress?: boolean;
  showStatus?: boolean;
}) => {
  return (
    <Stack
      width={'100%'}
      direction="row"
      justifyContent="space-between"
      alignItems={'center'}
    >
      <Stack direction="row" spacing={1} alignItems={'center'}>
        <StatusIcon
          showLenseIcon={expandedItems.has(data?.[0]?.identifier)}
          showMimeTypeIcon={showStatus && data?.length === 0}
          mimeType={mimeType}
        />
        <Typography variant="body2" fontWeight={500}>
          {title}
        </Typography>
        {Boolean(showStatus && data?.length) && (
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{
              color: '#65558F',
              textDecoration: 'underline',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {data.length} Units <ArrowForwardOutlinedIcon />
          </Typography>
        )}
      </Stack>
      {showProgress && (
        <CircularProgressWithLabel
          value={trackProgress ?? 0}
          _text={{
            sx: {
              color: trackCompleted === 100 ? '#21A400' : '#FFB74D',
            },
          }}
          sx={{
            color: trackCompleted === 100 ? '#21A400' : '#FFB74D',
          }}
        />
      )}
      {showStatus &&
        (trackCompleted === 100 ? (
          <CheckCircleIcon sx={{ color: '#21A400' }} />
        ) : (
          <ErrorIcon sx={{ color: '#FFB74D' }} />
        ))}
    </Stack>
  );
};

const StatusIcon = React.memo(
  ({
    showMimeTypeIcon,
    showLenseIcon,
    mimeType,
  }: {
    showMimeTypeIcon: boolean;
    showLenseIcon: boolean;
    mimeType?: string;
  }) => {
    if (showMimeTypeIcon) {
      return getIconByMimeType(mimeType);
    } else if (showLenseIcon) {
      return <LensIcon sx={{ fontSize: '1.5rem' }} />;
    }
    return <LensOutlinedIcon sx={{ fontSize: '1.5rem' }} />;
  }
);
StatusIcon.displayName = 'StatusIcon';
