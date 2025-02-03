export default function fetchReports(year = null) {
  let pageData = `
      query ReportsPage {
        page(idType: DATABASE_ID, id: "13") {
          page_reports {
            pageContent {
              title
              subtitle
            }
          }
        }
        years(where: {hideEmpty: true}) {
          nodes {
            name
          }
        }
      }
  `;

  let reportsData = `
      query Reports {
        reports(
          where: {taxQuery: {relation: AND, taxArray: [{taxonomy: YEAR, operator: IN, field: SLUG, terms: ["${year}"]}]}}
        ) {
          nodes {
            report_options {
              pageContent {
                title
                data
                money
                file {
                  sourceUrl
                }
              }
            }
          }
        }
      }
  `;

  return year ? reportsData : pageData;
}
