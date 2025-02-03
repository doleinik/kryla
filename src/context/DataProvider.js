import React, { createContext, useState, useEffect } from 'react';
import { getSiteData, getForms } from '../api/queries/index';
import { getRoutes } from '../utils/getRoutes';

const DataContext = createContext({});

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchData = async () => {
    const [site, forms] = await Promise.all([getSiteData(), getForms()]);
    setData({ site, routes: getRoutes(site.pages.edges), forms });
    setIsLoaded(true);

    console.log(forms);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <DataContext.Provider value={{ data, isLoaded, setIsLoaded }}>
    {children}
  </DataContext.Provider>;
}

export default DataContext;
