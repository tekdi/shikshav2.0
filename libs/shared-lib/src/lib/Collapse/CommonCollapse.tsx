import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
interface CommonAccordionProps {
  id: string;
  title: string;
  content: React.ReactNode;
  actions?: { label: string; onClick: () => void }[];
  defaultExpanded?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
  status?: string;
}

export const CommonCollapse: React.FC<CommonAccordionProps> = ({
  id,
  title,
  content,
  actions = [],
  defaultExpanded = false,
  showIcon = false,
  icon = <CheckCircleIcon />,
  status,
}) => {
  const isCompleted = status === 'Completed';
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', margin: '10px' }}>
      <Accordion defaultExpanded={defaultExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${id}-content`}
          id={`${id}-header`}
          sx={{
            backgroundColor: '#E9DDFF',
          }}
        >
          <Typography component="span">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {content}
            {showIcon && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ fontSize: 30 }}>{icon}</Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: isCompleted ? 'green' : 'red',
                  }}
                >
                  {status}
                </Typography>
              </Box>
            )}
          </Box>
        </AccordionDetails>
        {actions.length > 0 && (
          <AccordionActions>
            {actions.map((action) => (
              <Button key={action.label} onClick={action.onClick}>
                {action.label}
              </Button>
            ))}
          </AccordionActions>
        )}
      </Accordion>
    </Box>
  );
};

export default CommonCollapse;
