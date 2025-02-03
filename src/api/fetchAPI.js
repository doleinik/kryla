async function fetchREST(url, data) {

  const URL = window.BAMBOO.restapi + url;

  const authData = localStorage.getItem('auth');
  const auth = JSON.parse(authData) || null;

  const options = {
    method: "POST",
    credentials: 'include',
    crossSiteCookies: true,
    headers: {
      "X-WP-Nonce": window.BAMBOO.nonce,
      "Authorization": `Bearer ${auth?.token}`
    },
    body: data,
  };

  const response = await tryFetch(URL, options);

  // console.log(response);

  return response;
}

async function fetchGQL(query) {
  const url = window.BAMBOO.graphql;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-WP-Nonce": window.BAMBOO.nonce,
    },
    body: JSON.stringify({ query }),
  };

  return tryFetch(url, options);
}

async function tryFetch(url, options) {

  let errorObj;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      errorObj = {
        message: response.statusText,
        code: response.status
      };
      return error;
    }

    return await response.json();
  } catch (error) {
    // // throw new Error("Fetch error");
    errorObj = {
      error: error.message || "Fetch error"
    };
  }
  return errorObj;
}


export { fetchREST, fetchGQL };
