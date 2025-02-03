export default function fetchWeDo() {
  return `
  query SectionSupport {
    page(id: "2", idType: DATABASE_ID) {
      page_about_fund {
        weDo {
          title
          subtitle
          todo {
            icon {
              altText
              srcSet
              sourceUrl
            }
            data {
              name
              description
            }
          }
        }
      }
    }
  }
  `;
}
