import React, { lazy } from 'react';

export function getRoutes(allPages) {

  const routes = allPages.reduce((acc, page) => {
    acc.push(getPageRoute(page));

    if (page.node.pageOptions?.isArchive) {
      acc.push(getSinglePostRoute(page));
    }
    return acc;
  }, []);

  return routes;
}

function getPageRoute({ node: { pageOptions, slug, isFrontPage } }) {
  const { template } = pageOptions;

  const component = lazy(() =>
    import(`../pages/${template.toLowerCase()}/${template}`)
  );

  return {
    path: isFrontPage ? "/" : slug,
    component
  };
}

function getSinglePostRoute({ node: { pageOptions, slug } }) {
  const { template } = pageOptions;

  const component = lazy(() =>
    import(`../posts/${template.toLowerCase()}/${template}`)
  );

  return {
    path: `${slug}/:slug`,
    component,
  };
}