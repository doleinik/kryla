export default function fetchHome() {
  return `
  query Home {
    page(id: "1", idType: DATABASE_ID) {
      page_home {
        welcome {
          title
          description
          button
        }
        fund {
          title
          button {
            url
            title
            target
          }
        }
        help {
          title
          button           
        }
        news {
          title
          button {
            title
            url
            target
          }
        }
      }
    }
  }
  `;
}
