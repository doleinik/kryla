export default function fetchPromotion(slug) {
  return `
  query Promotion {
    promotion(idType: SLUG, id: "${slug}") {
      databaseId
      title
      authorDatabaseId
      date
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
        description
        update {
          item {
            date
            title
            text
            gallery {
              mediaItemUrl
              sourceUrl(size: MEDIUM)
            }
          }
        },
        payments {
          item {
            name
            date
            count
            coment
          }
        }
      }
 
    }
  }
  `;
}

// promotion_options {
//   excerpt
//   contactPerson
//   contactPhone
//   sum
//   collected
//   description
// }
