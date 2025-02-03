export default function fetchProjects(first = 4, after = null) {
  const afterArg = after ? `, after: "${after}"` : "";

  return `
    query Projects {
      projects(
        first: ${first},
        ${afterArg},
        where: {
          status: PUBLISH,
          orderby: { field: MENU_ORDER, order: ASC }
        }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            databaseId
            title
            uri
            featuredImage {
              node {
                sourceUrl
                srcSet
                altText
                sizes
              }
            }
          }
        }
      }
    }
  `;
}
