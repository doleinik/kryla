export default function fetchAboutFund() {
  return `
  query AboutFund {
    page(id: "2", idType: DATABASE_ID) {     
      page_about_fund {
        welcome {
          title
          subtitle
          description
          button
          gallery {
            srcSet
            sourceUrl
            altText
          }
        }
        values {
          title
          subtitle
          values {
            icon {
              sourceUrl
            }
            data {
              name
              description
            }
          }
        }
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
        teams {
          title
          button
          teams {
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
