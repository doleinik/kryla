export default function fetchShop(first = 4, after = null, isPage = false) {
  const afterArg = after ? `, after: "${after}"` : "";

  let page = isPage
    ? `page(id: "12", idType: DATABASE_ID) {
      page_shop {
        title
        subtitle
      }
    }`
    : "";

  return `
  query Shop {
    ${page}
    goods(
      first: ${first},
      ${afterArg},
      where: {
        status: PUBLISH,
        orderby: { field: MENU_ORDER, order: ASC }
      }
    ) {
      edges {
        node {
          title
          goods_options {
            status
            price
            excerpt
          }
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  `;
}
