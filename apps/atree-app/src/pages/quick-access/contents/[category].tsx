import React, { useEffect, useState } from 'react';
import Layout from '../../../component/layout/layout';
import FolderComponent from '../../../component/FolderComponent';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});
const MyComponent: React.FC = () => {
  const [categories, setCategories] = useState<Array<any>>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const router = useRouter();
  const { category } = router.query; // Access the identifier from the URL

  useEffect(() => {
    const init = async () => {
      const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
      const frameworkData = await fetch(url).then((res) => res.json());
      const frameworks = frameworkData?.result?.framework?.categories;
      const fdata =
        frameworks
          .find((item: any) => item.code === 'topic')
          ?.terms?.find((e) => e.name === category)?.associations || [];
      console.log(fdata);
      setCategories(fdata || []);
      setIsLoadingChildren(false);
    };
    init();
  }, []);

  const handleClick = (category: any) => {
    router.push(`/contents/${category.name}`);
  };

  return (
    <Layout
      isLoadingChildren={isLoadingChildren}
      _backButton={{ alignItems: 'center' }}
      backTitle={
        <Typography
          style={{
            fontSize: '22px',
            lineHeight: '28px',
            letterSpacing: 0,
          }}
        >
          {category}
        </Typography>
      }
      showBack
      backIconClick={() => router.push('/quick-access')}
      showTopAppBar={{
        title: 'Jal-Jungle-Jameen',
        subtitle: 'In Classrooms ',
        showMenuIcon: true,
        actionButtonLabel: 'Action',
      }}
    >
      <FolderComponent
        categories={[{ name: category }]}
        subLabel="resources"
        onClick={handleClick}
        _title={{
          fontWeight: 700,
          fontSize: '14px',
        }}
        _item={{
          border: 0,
          justifyContent: 'space-between',
          py: 2,
          px: 3,
          borderRadius: '8px',
          background: '#ECF2F3',
          borderBottom: '1px solid  #2B3133',
          cursor: 'auto',
        }}
      />
      <Content />
    </Layout>
  );
};

export default MyComponent;
