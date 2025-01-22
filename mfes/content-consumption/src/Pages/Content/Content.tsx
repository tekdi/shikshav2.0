'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  CommonCard,
  CommonTabs,
  Layout,
  ContentSearch,
  IMAGES,
  Circular,
} from '@shared-lib';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import MailIcon from '@mui/icons-material/Mail';
interface ContentItem {
  name: string;
  gradeLevel: string[];
  language: string[];
  artifactUrl: string;
  identifier: string;
  appIcon: string;
  contentType: string;
  mimeType: string;
}
export default function Content() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [tabValue, setTabValue] = React.useState(0);
  const [contentData, setContentData] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const result = await ContentSearch();
      setContentData(result || []);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchContent();
  }, []);

  const handleAccountClick = () => {
    console.log('Account clicked');
  };

  const handleSearchClick = () => {
    if (searchValue.trim()) {
      fetchContent();
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const handleCardClick = (identifier: string, contentType: string) => {
    // const path =
    //   contentType === 'application/vnd.ekstep.content-collection'
    //     ? '/details'
    //     : '/player';
    // navigate(path, { state: { identifier } });
    setIsLoading(true);
    try {
      const result = await ContentSearch();
      setContentData(result || []);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const renderTabContent = () => (
    <Box sx={{ flexGrow: 1 }}>
      {isLoading ? (
        <Circular />
      ) : (
        <Grid container spacing={2}>
          {contentData?.map((item) => (
            <Grid key={item?.name} size={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
              <CommonCard
                title={item?.name.trim()}
                content={`Grade: ${
                  item?.gradeLevel?.join(', ') || 'N/A'
                }, Language: ${item?.language?.join(', ') || 'N/A'}`}
                image={item?.appIcon || IMAGES.DEFAULT_PLACEHOLDER}
                subheader={item?.contentType}
                orientation="horizontal"
                onClick={() =>
                  handleCardClick(item?.identifier, item?.mimeType)
                }
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const tabs = [
    {
      label: 'Content',
      content: renderTabContent(),
    },
    {
      label: 'Tab',
      content: <Box>No content</Box>,
    },
    // { label: 'Tab' },
  ];
  const cardsData = [
    {
      title: 'Shrimp and Chorizo Paella',
      subheader: 'September 14, 2016',
      avatarLetter: 'R',
      avatarColor: '#EFEFE',
      image: '/static/images/cards/paella.jpg',
      content:
        'A delicious Spanish dish with shrimp, chorizo, and saffron rice.',
    },
    {
      title: 'Spaghetti Carbonara',
      subheader: 'August 21, 2020',
      avatarLetter: 'S',
      avatarColor: '#FFD700',
      image: '/static/images/cards/carbonara.jpg',
      content: 'A creamy pasta dish with pancetta, eggs, and Parmesan cheese.',
    },
    {
      title: 'Caesar Salad',
      subheader: 'June 10, 2019',
      avatarLetter: 'C',
      avatarColor: '#ADD8E6',
      image: '/static/images/cards/salad.jpg',
      content:
        'Fresh lettuce, croutons, and Parmesan cheese with Caesar dressing.',
    },
  ];
  const handleItemClick = (to: string) => {
    navigate(to);
  };
  const drawerItems = [
    { text: 'Home', icon: <MailIcon />, to: '/' },
    { text: 'Page2', icon: <MailIcon />, to: '/page-2' },
    { text: 'Content', icon: <MailIcon />, to: '/content' },
  ];
  const carouselItems = [
    <Typography variant="h6">Slide 1</Typography>,
    <Typography variant="h6">Slide 2</Typography>,
    <Typography variant="h6">Slide 3</Typography>,
  ];
  return (
    <Layout
      showTopAppBar={{
        title: 'Content Library',
        showMenuIcon: true,
        actionButtonLabel: 'Action',
        actionIcons: [
          {
            icon: <AccountCircleIcon />,
            ariaLabel: 'Account',
            onClick: handleAccountClick,
          },
        ],
      }}
      showSearch={{
        placeholder: 'Search content..',
        rightIcon: <SearchIcon />,
        inputValue: searchValue,
        onInputChange: handleSearchChange,
        onRightIconClick: handleSearchClick,
        sx: {
          backgroundColor: '#f0f0f0',
          padding: '4px',
          borderRadius: '50px',
          width: '100%',
        },
      }}
      drawerItems={drawerItems}
      onItemClick={handleItemClick}
      isFooter={false}
      showLogo={true}
      showBack={true}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#FEF7FF',
          flexDirection: 'column',
        }}
      >
        <CommonTabs
          tabs={tabs}
          value={tabValue}
          onChange={handleTabChange}
          ariaLabel="Custom icon label tabs"
        />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={2}>
          {cardsData.map((card) => (
            <Grid key={card.title} size={{ xs: 6, sm: 6, md: 3, lg: 6 }}>
              <CommonCard
                key={card.title}
                title={card.title}
                subheader={card.subheader}
                avatarLetter={card.avatarLetter}
                avatarColor={card.avatarColor}
                image={card.image}
                orientation="vertical"
                minheight="80px"
                onClick={() => handleCardClick('do_21421049808039936017')}
              />
            </Grid>
          ))}
          {/* {contentData.map((item) => (
            <Grid key={item?.name} size={{ xs: 6, sm: 6, md: 3, lg: 6 }}>
              <CommonCard
                key={item.name}
                title={item?.name.trim()}
                subheader={'subheader'}
                avatarLetter={item?.name?.trim() ? item.name.trim()[0].toUpperCase() : '?'}
                avatarColor={'#EFEFE'}
                image={item?.appIcon || IMAGES.DEFAULT_PLACEHOLDER}
                orientation="vertical"
                minheight="80px"
                onClick={() => handleCardClick('do_21421049808039936017')}
              />
            </Grid>
          ))} */}
        </Grid>
      </Box>
    </Layout>
  );
}
