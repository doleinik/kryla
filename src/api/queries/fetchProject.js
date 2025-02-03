export default function fetchProject(postId) {
  return `
  query Project {
    project(idType: DATABASE_ID, id: ${postId}) {
      databaseId
      title
      featuredImage {
        node {
          sourceUrl
          srcSet
          altText
          sizes
        }
      }
      promotion_options {
        excerpt
        description
      }
    }
  }
  `;
}
