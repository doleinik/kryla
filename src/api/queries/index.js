import { fetchGQL, fetchREST } from "../fetchAPI";

import SiteData from "./siteData.gql";
import Pages from "./pages.gql";

/* promotions */
import fetchPromotions from "./fetchPromotions";
import fetchPromotion from "./fetchPromotion";

/* projects */
import fetchProjects from "./fetchProjects";

/* posts */
import fetchPosts from "./fetchPosts";

// reports
import fetchReports from "./fetchReports";

// section Support & What we do
import fetchSupport from "./fetchSectionSupport";
import fetchWeDo from "./fetchSectionWeDo";

/* Get all pages */
async function getPages() {
  const response = await fetchGQL(Pages);
  return response?.data?.pages?.edges ? response.data.pages.edges : [];
}

/* Get all site options */
async function getSiteData() {
  const response = await fetchGQL(SiteData);
  return response?.data ? response.data : [];
}

/* Get promotions */
async function getPromotions(first = 4, from = null, status = null) {
  const response = await fetchGQL(fetchPromotions(first, from, status));
  return response?.data?.promotions?.edges ? response.data.promotions : [];
}

async function getPromotion(slug) {
  const response = await fetchGQL(fetchPromotion(slug));
  return response?.data ? response.data : [];
}

/* Get projects */
async function getProjects(first = 4, from = null) {
  const response = await fetchGQL(fetchProjects(first, from));
  return response?.data?.projects?.edges ? response.data.projects : [];
}

//  Get Posts
async function getPosts(first, from, id, cats) {
  const response = await fetchGQL(fetchPosts(first, from, id, cats));
  return response?.data;
}

//  Get Posts
async function getReports(year) {
  const response = await fetchGQL(fetchReports(year));
  return response?.data;
}

//  Get Section Support
async function getSectionSupport() {
  const response = await fetchGQL(fetchSupport());
  return response?.data.page.page_about_fund.support;
}

//  Get Section We do
async function getSectionWeDo() {
  const response = await fetchGQL(fetchWeDo());
  return response?.data.page.page_about_fund.weDo;
}

// Get form
async function getForms(id = null) {
  const response = await fetchREST('get-forms', id);
  return response;
}

/* Test */
async function testQuery() {
  let options = await getPages();
  // console.log(options);
}

export {
  testQuery,
  getPages,
  getPromotions,
  getPromotion,
  getSiteData,
  getProjects,
  getPosts,
  getReports,
  getSectionSupport,
  getSectionWeDo,
  getForms
};
