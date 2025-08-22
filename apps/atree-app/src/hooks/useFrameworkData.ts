import { useState, useEffect } from 'react';

export const useFrameworkData = () => {
  const [filterData, setFilterData] = useState();
  const [subFrameworkFilter, setSubFrameworkFilter] = useState<any[]>([]);
  const [frameworkFilter, setFrameworkFilter] = useState();
  const [subFramework, setSubFramework] = useState('');
  const [framework, setFramework] = useState('');

  const fetchFrameworkData = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
      const response = await fetch(url);
      const frameworkData = await response.json();
      let selectedCategory = '';
      if (typeof window !== 'undefined') {
        selectedCategory = localStorage.getItem('category') ?? '';
      }

      const filteredFramework = frameworkData?.result?.framework
        ? {
            ...frameworkData?.result?.framework,
            categories: Array.isArray(
              frameworkData?.result?.framework?.categories
            )
              ? frameworkData.result.framework.categories.filter(
                  (category: any) => category.status === 'Live'
                )
              : [],
          }
        : { categories: [] };

      setFilterData({
        ...frameworkData?.result?.framework,
        categories: frameworkData?.result?.framework.categories.filter(
          (category: any) => category.status === 'Live'
        ),
      });

      const fdata =
        filteredFramework?.categories?.find(
          (item: any) => item.code === 'topic'
        )?.terms ?? [];
      const selectedFramework = fdata.find(
        (item: any) =>
          item.name?.toLowerCase() === selectedCategory?.toLowerCase()
      );
      const defaultFramework = fdata[0]?.identifier ?? '';
      const frameworkToSet = selectedFramework?.identifier ?? defaultFramework;
      setFramework(frameworkToSet);

      setFrameworkFilter(fdata);
      if (frameworkToSet && fdata) {
        const subFrameworkData = fdata.find(
          (item: any) => item.identifier === frameworkToSet
        );

        if (subFrameworkData?.associations) {
          const uniqueAssociations = Array.from(
            new Map(
              subFrameworkData.associations.map((item: any) => [
                item?.name,
                item,
              ])
            ).values()
          );
          setSubFrameworkFilter(uniqueAssociations);
        }
      }
    } catch (error) {
      console.error('Error fetching framework data:', error);
    }
  };

  useEffect(() => {
    fetchFrameworkData();
  }, []);

  return {
    filterData,
    subFrameworkFilter,
    frameworkFilter,
    subFramework,
    framework,
    setSubFramework,
    setFramework,
  };
};
