export default function fetchPromotions() {
  return `
    query Archives {
      pageBy(pageForPosts: true) {
        id
        uri
      }
    }
  `;
};
