export default function fetchBeneficiaries() {
  return `
  query Beneficiaries {
    page(id: "14", idType: DATABASE_ID) {
      page_beneficiaries {
        welcome {
          title
          subtitle
          gallery {
            altText
            srcSet
            sourceUrl
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
        weHelp {
          title
          lists {
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
        faq {
          title
          faqs {
            q
            a
          }
        }
        direct {
          title
          subtitle
          lists {
            l
          }
        }
      }
    }
  }
  `;
}
