import React, { useEffect, useState } from 'react';
import Layout from '../../component/layout/layout';
import FolderComponent from '../../component/FolderComponent';
import { useRouter } from 'next/router';

const MyComponent: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Array<any>>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);

  useEffect(() => {
    const init = async () => {
      const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;

      const frameworkData = await fetch(url).then((res) => res.json());

      const filteredFramework = frameworkData?.result?.framework
        ? {
            ...frameworkData.result.framework,
            categories: frameworkData.result.framework.categories?.filter(
              (category: any) => category.status === 'Live'
            ),
          }
        : { categories: [] }; // Provide a default structure if frameworkData is undefined

      console.log(filteredFramework.categories);

      const fdata =
        filteredFramework.categories.find((item: any) => item.code === 'topic')
          ?.terms || [];

      console.log(fdata.associations);
      setCategories(fdata || []);
      setIsLoadingChildren(false);
    };
    init();
  }, []);

  const handleClick = (category: any) => {
    router.push(`/quick-access/${category.name}`);
  };

  return (
    <Layout isLoadingChildren={isLoadingChildren} backTitle={'Quick Access'}>
      <FolderComponent categories={categories} onClick={handleClick} />
    </Layout>
  );
};

export default MyComponent;
