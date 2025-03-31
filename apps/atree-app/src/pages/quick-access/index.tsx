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

      const fdata =
        filteredFramework.categories.find((item: any) => item.code === 'topic')
          ?.terms || [];

      setCategories(fdata || []);
      setIsLoadingChildren(false);
    };
    init();
  }, []);

  const handleClick = (category: any) => {
    const hasValidAssociations =
      category.associations &&
      Array.isArray(category.associations) &&
      category.associations.some((assoc: any) => assoc.status === 'Live');

    if (!hasValidAssociations) {
      const query = true;
      router.push(`/quick-access/contents/${category.name}?isTopic=${query}`);
    } else {
      router.push(`/quick-access/${category.name}`);
    }
  };

  return (
    <Layout isLoadingChildren={isLoadingChildren} backTitle={'Quick Access'}>
      <FolderComponent
        categories={categories}
        onClick={handleClick}
        _item={{
          width: { xs: '450px', md: '100%' },
        }}
      />
    </Layout>
  );
};

export default MyComponent;
