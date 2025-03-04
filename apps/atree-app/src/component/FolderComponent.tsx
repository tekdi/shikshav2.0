import {
  List,
  ListItem,
  ListItemText,
  Box,
  colors,
  Typography,
} from '@mui/material';
import FolderBorderIcon from '@mui/icons-material/FolderOutlined';

const FolderComponent = ({
  categories,
  onClick,
  subLabel,
  _item,
  _title,
}: {
  categories: Array<any>;
  onClick?: any;
  subLabel?: string;
  _item?: any;
  _title?: any;
}) => {
  return (
    <List sx={{ p: 2 }}>
      {categories?.map((category) => (
        <ListItem
          key={category.id}
          sx={{
            p: 2,
            borderWidth: '1px',
            borderRadius: '8px',
            mb: '12px',
            cursor: 'pointer',
            ...(_item || {}),
          }}
          onClick={() => onClick?.(category)}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FolderBorderIcon />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ m: 0, ..._title }}>{category.name}</Typography>
              <Typography
                sx={{
                  m: 0,
                  fontWeight: 400,
                  fontStyle: 'italic',
                  fontSize: '12px',
                  lineHeight: '16px',
                  letterSpacing: '0.4px',
                }}
              >{`${category?.associations?.length || 0} ${
                subLabel || 'Folders'
              }`}</Typography>
            </Box>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default FolderComponent;
