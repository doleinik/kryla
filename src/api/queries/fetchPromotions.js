export default function fetchPromotions(first = 4, after = null, status = null) {

  const afterArg = after ? `, after: "${after}"` : '';

  let metaQuery = '';
  if (status) {
    metaQuery = `, metaQuery: {
      relation: AND,
      metaArray: [
        {
          key: "status",
          value: "${status}",
          compare: EQUAL_TO,
          type: CHAR
        }
      ]
    }`;
  }

  return `
    query Promotions {
      promotions(
        first: ${first},
        ${afterArg},
        where: {
          status: PUBLISH,
          orderby: { field: MENU_ORDER, order: ASC }
          ${metaQuery}
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
            promotion_options {
              status
              excerpt
              sum
              collected
            }
          }
        }
      }
    }
  `;
}
