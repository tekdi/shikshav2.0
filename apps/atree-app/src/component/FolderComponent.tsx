// sonar-exclusion
import { List, ListItem, Box, Typography, Grid } from '@mui/material';

import FolderBorderIcon from '@mui/icons-material/FolderOutlined';
const getResourceLabel = (
  category: any,
  length?: Array<any>,
  subLabel?: string
) => {
  if (Array.isArray(length) && length.length > 0) {
    const foundItem = length.find((len) => len.subTopic === category?.name);
    const liveAssociationsCount = foundItem?.length || 0;

    return liveAssociationsCount > 0
      ? `${liveAssociationsCount} ${subLabel ?? 'resources'}`
      : 'No uploads';
  }

  if (Array.isArray(category?.associations)) {
    const liveCount = category.associations.filter(
      (assoc: any) => assoc.status === 'Live'
    ).length;

    return liveCount > 0
      ? `${liveCount} ${subLabel ?? 'resources'}`
      : 'No uploads';
  }

  return 'No uploads';
};
const FolderComponent = ({
  categories,
  onClick,
  subLabel,
  _item,
  _title,
  length,
}: {
  categories: Array<any>;
  onClick?: any;
  subLabel?: string;
  _item?: any;
  _title?: any;
  length?: Array<any>;
}) => {
  categories = categories.filter((item) => item.status !== 'Retired');
  return (
    <List sx={{ p: 2 }}>
      <Grid
        container
        spacing={2}
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr',
          },
        }}
      >
        {categories?.map((category) => (
          <Grid key={category.id} item xs={12} sm={12} md={12}>
            <ListItem
              key={category.id}
              sx={{
                width: subLabel ? '30vw' : '100%',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                p: 2,
                borderWidth: '1px',
                borderRadius: '8px',
                mb: '12px',
                cursor: 'pointer',
                ...(_item || {}),
              }}
              onClick={() => onClick?.(category)}
            >
              <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                <FolderBorderIcon />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                  <Typography sx={{ m: 0, ..._title }}>
                    {category.name}
                  </Typography>
                  <Typography
                    sx={{
                      m: 0,
                      fontWeight: 400,
                      fontStyle: 'italic',
                      fontSize: '12px',
                      lineHeight: '16px',
                      letterSpacing: '0.4px',
                    }}
                  >
                    {getResourceLabel(category, length, subLabel)}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          </Grid>
        ))}
      </Grid>
    </List>
  );
};

export default FolderComponent;
