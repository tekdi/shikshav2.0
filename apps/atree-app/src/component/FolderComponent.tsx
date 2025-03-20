import {
  List,
  ListItem,
  ListItemText,
  Box,
  colors,
  Typography,
  Grid,
} from '@mui/material';
// import Grid from '@mui/material/Grid2';

import FolderBorderIcon from '@mui/icons-material/FolderOutlined';

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
          <Grid key={category.id} item xs={12} sm={6} md={12}>
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
                    {length && length.length > 0
                      ? (() => {
                          const foundItem = length.find(
                            (len) => len.subTopic === category.name
                          );
                          const liveAssociationsCount = foundItem
                            ? foundItem.associations?.filter(
                                (assoc: any) => assoc.status === 'Live'
                              ).length || 0
                            : 0;

                          return liveAssociationsCount > 0
                            ? `${liveAssociationsCount} ${
                                subLabel || 'resources'
                              }`
                            : 'No uploads';
                        })()
                      : category?.associations?.filter(
                          (assoc: any) => assoc.status === 'Live'
                        ).length > 0
                      ? `${
                          category.associations.filter(
                            (assoc: any) => assoc.status === 'Live'
                          ).length
                        } ${subLabel || 'resources'}`
                      : 'No uploads'}
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
