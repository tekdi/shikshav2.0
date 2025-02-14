import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router'; // Use Next.js router for navigation
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import LensOutlinedIcon from '@mui/icons-material/LensOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { Progress } from '@shared-lib';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
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
  defaultExpanded?: boolean;
  status?: 'Not started' | 'Completed' | 'In progress' | string;
  progress?: number;
  TrackData?: never[];
  item: NestedItem[];
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
  status?: 'Not started' | 'Completed' | 'In progress' | string;
  progressNumber?: number;
  trackComplete?: number;

  toggleExpanded: (identifier: string) => void;
}> = ({ data, expandedItems, toggleExpanded, trackComplete }) => {
  const router = useRouter();

  return (
    <>
      {data?.map((item) => {
        const isExpanded = expandedItems.has(item.identifier);
        const childrenCount = item.children?.length || 0;

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
          <Box
            key={item.identifier}
            sx={{
              borderBottom: '1px solid #ccc',
              borderRadius: '4px',
              margin: '8px 0',
              padding: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box onClick={() => handleItemClick(item.identifier)}>
              <Typography variant="body1" fontSize={'14px'} fontWeight={400}>
                {childrenCount === 0 && getIconByMimeType(item.mimeType)}{' '}
                {item.name}
              </Typography>

              {childrenCount > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
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
                    {childrenCount} Units <ArrowForwardOutlinedIcon />
                  </Typography>
                </Box>
              )}
            </Box>
            <Box>
              {trackComplete === 100 ? (
                <>
                  <CheckCircleIcon sx={{ color: '#21A400' }} />
                </>
              ) : (
                <>
                  <ErrorIcon sx={{ color: '#FFB74D' }} />
                </>
              )}
            </Box>

            {isExpanded && item.children?.length && (
              <Box sx={{ marginTop: '8px', paddingLeft: '16px' }}>
                <RenderNestedData
                  data={item.children}
                  expandedItems={expandedItems}
                  toggleExpanded={toggleExpanded}
                />
              </Box>
            )}
          </Box>
        );
      })}
    </>
  );
};

export const CommonCollapse: React.FC<CommonAccordionProps> = ({
  identifier,
  title,
  data,
  actions = [],
  item,
  TrackData,
  defaultExpanded = false,
}) => {
  const router = useRouter();
  const theme = useTheme();

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [trackCompleted, setTrackCompleted] = React.useState(0);
  const [trackProgress, setTrackProgress] = React.useState(0);

  React.useEffect(() => {
    fetchDataTrack();
  }, []);
  const getLeafNodes = (node: any) => {
    let result = [];

    // If the node has leafNodes, add them to the result array
    if (node.leafNodes) {
      result.push(...node.leafNodes);
    }

    // If the node has children, iterate through them and recursively collect leaf nodes
    if (node.children) {
      node.children.forEach((child: any) => {
        result.push(...getLeafNodes(child));
      });
    }

    return result;
  };
  const fetchDataTrack = async () => {
    try {
      //@ts-ignore
      if (TrackData && item?.children) {
        for (let i = 0; i < TrackData.length; i++) {
          //@ts-ignore
          if (TrackData[i]?.courseId) {
            //merge offlien and online
            //@ts-ignore
            const mergedArray = [...TrackData[i]?.completed_list];
            const uniqueArray = [...new Set(mergedArray)];
            let completed_list = uniqueArray;

            //merge offlien and online
            //@ts-ignore
            const mergedArray_progress = [...TrackData[i]?.in_progress_list];
            const uniqueArray_progress = [...new Set(mergedArray_progress)];
            let in_progress_list = uniqueArray_progress;

            //fetch all content in unit
            let unit_content_list = getLeafNodes(item);
            let unit_content_completed_list = [];
            if (unit_content_list && completed_list) {
              if (unit_content_list.length > 0 && completed_list.length > 0) {
                for (let ii = 0; ii < unit_content_list.length; ii++) {
                  let temp_item = unit_content_list[ii];
                  if (completed_list.includes(temp_item)) {
                    unit_content_completed_list.push(temp_item);
                  }
                }
                let totalContent = unit_content_list.length;
                let completed = unit_content_completed_list.length;
                let percentageCompleted = (completed / totalContent) * 100;
                percentageCompleted = Math.round(percentageCompleted);

                setTrackCompleted(percentageCompleted);
              }
            }
            let unit_content_in_progress_list = [];
            if (unit_content_list && in_progress_list) {
              if (unit_content_list.length > 0 && in_progress_list.length > 0) {
                for (let ii = 0; ii < unit_content_list.length; ii++) {
                  let temp_item = unit_content_list[ii];
                  if (in_progress_list.includes(temp_item)) {
                    unit_content_in_progress_list.push(temp_item);
                  }
                }
                let totalContent = unit_content_list.length;
                let in_progress = unit_content_in_progress_list.length;
                let percentageInProgress = (in_progress / totalContent) * 100;
                percentageInProgress = Math.round(percentageInProgress);
                setTrackProgress(percentageInProgress);
              }
            }
          }
        }
      }
    } catch (e) {
      console.log('error', e);
    }
  };
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
    <Box sx={{ margin: '10px' }}>
      {data?.length > 0 ? (
        <Box
          sx={{
            backgroundColor: theme.palette.custom?.secondaryBackground,
            padding: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <LensOutlinedIcon sx={{ fontSize: '17px' }} />
          <Typography variant="h6" fontSize={'12px'} fontWeight={500}>
            {title}
          </Typography>
          {/* {trackProgress >= 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
               
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
          <Box
            sx={{ marginLeft: 'auto' }}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded(identifier);
              localStorage.setItem('unitId', identifier);
            }}
          >
            {expandedItems.has(identifier) ? (
              <ArrowDropDownIcon />
            ) : (
              <ArrowDropUpIcon />
            )}
          </Box>
        </Box>
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

      <Box sx={{ marginTop: '8px' }}>
        {expandedItems.has(identifier) && (
          <RenderNestedData
            data={data}
            expandedItems={expandedItems}
            toggleExpanded={toggleExpanded}
            progressNumber={trackProgress}
            trackComplete={trackCompleted}
          />
        )}
      </Box>

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
