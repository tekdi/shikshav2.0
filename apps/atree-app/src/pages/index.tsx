'use client';
import { Box, Typography } from '@mui/material';
// import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import ActivityBooks from '../../assets/images/ActivityBooks.jpeg';
import Climatechangebookcover from '../../assets/images/Climatechangebookcover.png';
import Forests from '../../assets/images/Forests.png';
import instagram_logo from '../../assets/images/instagram_logo.png';
import Land from '../../assets/images/Land.png';
import landingBanner from '../../assets/images/landingBanner.png';
import ReferenceBooks from '../../assets/images/LetsTalkAboutTreesCover.png';
import Water from '../../assets/images/WatercoverTekdi.png';
import Insta from '../component/Insta';
import Layout from '../component/layout/layout';

import { useRouter } from 'next/router';
import { ImageBanner } from '../component/layout/ImageBanner';
import { useEffect, useState } from 'react';
import { ContentSearch } from '@shared-lib';

const catImages = {
  Water,
  Forest: Forests,
  Land,
  'Climate Change': Climatechangebookcover,
  'Activity Books': ActivityBooks,
  Potpourri: ReferenceBooks,
};

const LandingPage = () => {
  // const { t } = useTranslation();
  const t = (data: string) => data;
  const [categories, setCategories] = useState<Array<any>>([]);
  const [languageCount, setLanguageCount] = useState(0);
  const [readerCount, setReaderCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const router = useRouter();
  const customOrder = [
    'Water',
    'Forest',
    'Land',
    'Climate Change',
    'Activity Books',
    'Potpourri',
  ];
  useEffect(() => {
    const init = async () => {
      const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
      const frameworkData = await fetch(url).then((res) => res.json());
      const frameworks = frameworkData?.result?.framework?.categories;
      const fdata =
        frameworks.find((item: any) => item.code === 'topic')?.terms || [];

      const data = await ContentSearch({
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
      });
      const content = data?.result?.content || [];
      const uniqueLanguages = [
        ...new Set(
          content
            .map((item) => (Array.isArray(item) ? item[0] : item)) // Extract value if inside an array
            .filter((lang) => typeof lang === 'string' && lang.trim() !== '') // Remove null, undefined, and empty strings
        ),
      ];
      setBookCount(content?.length);
      setLanguageCount(uniqueLanguages?.length);
      const uniqueReaders = [
        ...new Set(
          content
            .map((item) => item?.reader)
            .filter((reader) => reader !== null)
        ),
      ];
      setReaderCount(uniqueReaders?.length);
      setCategories(fdata || []);
    };
    init();
  }, []);

  return (
    <Layout
      footerComponent={
        <Grid sx={{ px: 4, py: 1, backgroundColor: 'secondary.main' }}>
          <Typography align="center" gutterBottom sx={{ fontSize: '10px' }}>
            {t(
              'Curated by ATREE: For, Of, and By Environment Educators of India'
            )}
          </Typography>
        </Grid>
      }
    >
      <Grid container spacing={4} sx={{ mb: 3 }} justifyContent={'center'}>
        <Grid width={'100%'}>
          <ImageBanner
            name={
              'A digital hub of Environment Education resources contextual to India'
            }
            image={landingBanner?.src}
            // _image={{ height: '181px' }}
          />
        </Grid>
        <Grid
          sx={{ px: 4, textAlign: 'center' }}
          container
          spacing={1}
          justifyContent={'center'}
        >
          <Grid
            size={{ xs: 12, sm: 10, md: 12, lg: 12 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography
              variant="body1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '24px',
                textAlign: 'center',
                color: '#000000',
              }}
            >
              {t(
                'Change stems from local action. Hope stems from children’s empowerment to act upon local environmental problems.'
              )}
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '24px',
                textAlign: 'center',
                color: '#000000',
              }}
            >
              {t(
                'Our mission is to empower environment educators with both hope and action in times of climate change.'
              )}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid
            size={{ xs: 12, sm: 12, md: 12, lg: 12 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent={'center'}
          >
            <Box
              sx={{
                backgroundColor: '#FCD905',

                // borderRadius: '8px',
                width: '100vw',
                maxWidth: '100%',
                height: '63px',
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: 8,
                alignItems: 'center',
                color: '#2B3133',
                textAlign: 'center',
              }}
            >
              {[
                { label: 'Books', value: bookCount },
                { label: 'Categories', value: '15' },
                { label: 'Language', value: languageCount },
                // { label: 'Reader', value: readerCount },
              ].map((item, index) => (
                <Box key={index}>
                  <Typography fontWeight="400" sx={{ fontSize: '24px' }}>
                    {item.value}
                  </Typography>
                  <Typography fontWeight="400" sx={{ fontSize: '10px' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Typography
              variant="body1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 400,
                fontSize: '14px',
                textAlign: 'center',
                padding: '20px',
              }}
            >
              {t('Choose what best fits your interests and needs')}
            </Typography>
          </Grid>
        </Grid>
        <Grid sx={{ px: 1 }}>
          <Grid container spacing={1}>
            {categories
              ?.filter((category) => category.name !== 'General') // Remove "General"
              ?.sort((a, b) => {
                const indexA = customOrder.indexOf(a.name);
                const indexB = customOrder.indexOf(b.name);

                // If a category is not found in customOrder, push it to the end
                return (
                  (indexA === -1 ? customOrder.length : indexA) -
                  (indexB === -1 ? customOrder.length : indexB)
                );
              })
              ?.map((category, index) => (
                <Grid key={index} size={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
                  <ImageBanner
                    key={index}
                    name={category?.name}
                    _showAvatar={true}
                    _text={{ textAline: 'center' }}
                    image={
                      (
                        catImages?.[category?.name as keyof typeof catImages] ||
                        landingBanner
                      )?.src
                    }
                  />
                </Grid>
              ))}
          </Grid>
        </Grid>
        <Grid
          sx={{
            px: 4,
            textAlign: 'center',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '24px',
              textAlign: 'center',
            }}
          >
            {t('Follow Us On')}
          </Typography>
          <Image src={instagram_logo} alt="instagram_logo" />
          <Insta />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default LandingPage;
