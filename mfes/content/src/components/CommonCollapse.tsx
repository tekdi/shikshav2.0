import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useRouter } from 'next/router'; // Use Next.js router for navigation
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import LensOutlinedIcon from '@mui/icons-material/LensOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
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
}

const getIconByMimeType = (mimeType?: string): React.ReactNode => {
  const icons = {
    'application/pdf': <PictureAsPdfOutlinedIcon />,
    'video/mp4': <PlayCircleOutlineOutlinedIcon />,
    'video/webm': <PlayCircleOutlineOutlinedIcon />,
    'application/vnd.sunbird.questionset': <TextSnippetOutlinedIcon />,
  };
  return icons[mimeType] || <TextSnippetOutlinedIcon />;
};

const RenderNestedData: React.FC<{
  data: NestedItem[];
  expandedItems: Set<string>;
  toggleExpanded: (identifier: string) => void;
}> = ({ data, expandedItems, toggleExpanded }) => {
  const router = useRouter();

  return (
    <>
      {data?.map((item) => {
        const isExpanded = expandedItems.has(item.identifier);
        const childrenCount = item.children?.length || 0;

        const handleItemClick = (identifier: string) => {
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
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
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
  defaultExpanded = false,
}) => {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    defaultExpanded ? new Set(data.map((item) => item.identifier)) : new Set()
  );
  useEffect(() => {
    if (router.query.identifier) {
      setExpandedItems(new Set([router.query.identifier as string]));
    }
  }, [router.query]);

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
  const handleCollapseAll = () => {
    setExpandedItems(
      expandedItems.size === data.length
        ? new Set()
        : new Set(data.map((item) => item.identifier))
    );
  };
  const handleTitleClick = () => {
    router.push(`/content-details/${identifier}`);
  };

  return (
    <Box sx={{ margin: '10px' }}>
      <Box
        sx={{
          backgroundColor: '#E9DDFF',
          padding: '8px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <LensOutlinedIcon />
        <Typography variant="h6" fontSize={'12px'} fontWeight={500}>
          {data?.length > 0 ? (
            title
          ) : (
            <span style={{ cursor: 'pointer' }}>
              {title}

              {/*  */}
            </span>
          )}
        </Typography>
        <Box
          sx={{ marginLeft: 'auto' }}
          onClick={() => toggleExpanded(identifier)}
        >
          {expandedItems.has(identifier) ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </Box>
      </Box>

      <Box sx={{ marginTop: '8px' }}>
        {expandedItems.has(identifier) && (
          <RenderNestedData
            data={data}
            expandedItems={expandedItems}
            toggleExpanded={toggleExpanded}
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
