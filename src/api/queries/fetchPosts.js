export default function fetchPosts(
  first = 4,
  after = null,
  categoryId = false,
  categories = false
) {
  const afterArg = after ? `, after: "${after},"` : "";

  let category = "";
  if (categoryId) {
    category = `categoryId: ${categoryId}`;
  }

  let cat = categories
    ? ""
    : `
    categories (where: {hideEmpty: true}) {
      
      nodes {
        name
        databaseId
      }
    }
  `;

  return `
    query Posts {
      ${cat}
      posts(
        first: ${first},
        ${afterArg}
        where: {
          status: PUBLISH,
          orderby: { field: MENU_ORDER, order: ASC },
          ${category}
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
            date
            tags {
              nodes {
                name
              }
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
      }
    }
  `;
}
