'use client';
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { CommonCard, CommonTabs, Layout } from '@shared-lib';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid2';

export default function Content() {
  const [searchValue, setSearchValue] = useState('');
  const [tabValue, setTabValue] = React.useState(0);
  const handleAccountClick = () => {
    console.log('Account clicked');
  };
  const handleMenuClick = () => {
    console.log('Menu icon clicked');
  };

  const handleSearchClick = () => {
    console.log('Search button clicked');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const renderTabContent = (cards: { title: string; content: string }[]) => (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid key={card.title} size={{ xs: 6, sm: 4, md: 4, lg: 4 }}>
            <CommonCard
              key={card.title}
              title={card.title}
              content={card.content}
              image="/static/images/example.jpg"
              subheader="Subtitle Example"
              orientation="horizontal"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const tabs = [
    {
      label: 'Tab',
      content: renderTabContent([
        { title: 'Card 1', content: 'This is the content of card 1.' },
        { title: 'Card 2', content: 'This is the content of card 2.' },
        { title: 'Card 3', content: 'This is the content of card 3.' },
        { title: 'Card 4', content: 'This is the content of card 4.' },
      ]),
    },
    {
      label: 'Tab',
      content: renderTabContent([
        { title: 'Card 5', content: 'This is the content of card 3.' },
        { title: 'Card 6', content: 'This is the content of card 4.' },
      ]),
    },
    { label: 'Tab' },
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
  return (
    <Layout
      showTopAppBar={{
        title: 'Content Library',
        showMenuIcon: true,
        menuIconClick: handleMenuClick,
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
          // flexDirection: {
          //   xs: 'column',
          //   sm: 'row',
          // },
        }}
      >
        <CommonTabs
          tabs={tabs}
          value={tabValue}
          onChange={handleTabChange}
          ariaLabel="Custom icon label tabs"
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {cardsData.map((card) => (
          <CommonCard
            key={card.title}
            title={card.title}
            subheader={card.subheader}
            avatarLetter={card.avatarLetter}
            avatarColor={card.avatarColor}
            image={card.image}
            orientation="vertical"
          />
        ))}
      </Box>
    </Layout>
  );
}
