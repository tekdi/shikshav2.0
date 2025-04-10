import React, { useEffect, useState } from 'react';
import Layout from '../../component/layout/layout';
import FolderComponent from '../../component/FolderComponent';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { ContentSearch } from '@shared-lib';
interface Term {
  name: string;
  associations: any[];
}
const MyComponent: React.FC = () => {
  const [categories, setCategories] = useState<Array<any>>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const router = useRouter();
  const { category } = router.query; // Access the identifier from the URL
  const [searchResults, setSearchResults] = useState<
    { subTopic: string; length: number }[]
  >([]);

  useEffect(() => {
    const init = async () => {
      const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
      const frameworkData = await fetch(url).then((res) => res.json());
      const frameworks =
        frameworkData?.result?.framework?.categories?.filter(
          (category: any) => category.status === 'Live'
        ) ?? [];

      const fdata =
        frameworks
          .find((item: any) => item.code === 'topic')
          ?.terms?.find((e: Term) => e.name === category)?.associations || [];
      console.log(fdata);

      setCategories(fdata || []);

      const requests = fdata.map(async (subTopicItem: any) => {
        const data = await ContentSearch({
          channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
          filters: {
            topic: category,
            subTopic: subTopicItem.name, // Send each category one by one
          },
        });

        return {
          subTopic: subTopicItem.name,
          length: data?.result?.content?.length,
        };
      });

      // Execute all API requests in parallel
      const results = await Promise.all(requests);
      const data = results.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.subTopic === item.subTopic)
      );
      setSearchResults(data);
      setIsLoadingChildren(false);
    };
    init();
  }, []);

  const handleClick = (category: any) => {
    router.push(`/quick-access/contents/${category.name}`);
  };

  return (
    <Layout
      isLoadingChildren={isLoadingChildren}
      _backButton={{ alignItems: 'center' }}
      backTitle={
        <Typography
          style={{
            fontWeight: 400,
            fontSize: '22px',
            lineHeight: '28px',
            letterSpacing: 0,
          }}
        >
          {category}
        </Typography>
      }
      showBack
      backIconClick={() => router.back()}
    >
      <FolderComponent
        categories={categories}
        subLabel="resources"
        onClick={handleClick}
        length={searchResults}
        _item={{ width: { xs: '375px', md: '100%' } }}
      />
    </Layout>
  );
};

export default MyComponent;
