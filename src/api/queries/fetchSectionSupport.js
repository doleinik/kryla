export default function fetchSupport() {
  return `
  query SectionSupport {
    page(id: "2", idType: DATABASE_ID) {
      page_about_fund {
        support {
          title
          button
          steps {
            data {
              name
              description
            }
            icon {
              sourceUrl
            }
          }
        }
      }
    }
  }
  `;
}
