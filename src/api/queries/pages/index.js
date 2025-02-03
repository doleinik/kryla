import { fetchGQL, fetchREST } from "../../fetchAPI";
import fetchAboutFund from "./fetchAboutFund";
import fetchBeneficiaries from "./fetchBeneficiaries";
import fetchHome from "./fetchHome";
import fetchShop from "./fetchShop";

async function getPageAboutFund() {
  const response = await fetchGQL(fetchAboutFund());
  return response?.data.page.page_about_fund;
}

async function getPageBeneficiaries() {
  const response = await fetchGQL(fetchBeneficiaries());
  return response?.data.page.page_beneficiaries;
}

async function getPageHome() {
  const response = await fetchGQL(fetchHome());
  return response?.data.page.page_home;
}
async function getPageShop(first, after, isPage) {
  const response = await fetchGQL(fetchShop(first, after, isPage));
  console.log(response);
  return response?.data;
}

export { getPageAboutFund, getPageBeneficiaries, getPageHome, getPageShop };
