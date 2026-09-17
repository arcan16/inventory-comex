import Cookies from "js-cookie";
export const helpHttp = () => {
  const customFetch = (endpoint, options) => {
    const defaultHeader = {
      accept: "application/json",
      Authorization: "Bearer "+ Cookies.get("Credentials")
    };

    const controller = new AbortController();
    options.signal = controller.signal;

    options.method = options.method || "GET";
    options.headers = options.headers
      ? { ...defaultHeader, ...options.headers }
      : defaultHeader;

    options.body = JSON.stringify(options.body) || false;
    if (!options.body) delete options.body;

    setTimeout(() => controller.abort(), 3000);

    return fetch(endpoint, options)
      .then((res) => {
        // console.log(options)
        // console.log(JSON.parse(res))
        // console.log(res.json());
        return res.ok
          ? res.json()
          : Promise.reject({
              err: true,
              status: res.status || "00",
              statusText: res.statusText || "Ocurrió un error",
            });
      })
      .catch((err) => err);
    // .catch((err) =>{
    //   console.log(err)
    //   throw err;
    // });
  };

  const customFetch2 = async (endpoint, options) => {
    const defaultHeader = {
      accept: "application/json",
      Authorization: "Bearer "+ Cookies.get("Credentials")
    };

    const controller = new AbortController();
    options.signal = controller.signal;

    options.method = options.method || "GET";
    options.headers = options.headers
      ? { ...defaultHeader, ...options.headers }
      : defaultHeader;

    options.body = JSON.stringify(options.body) || false;
    if (!options.body) delete options.body;

    let res = await fetch(endpoint, options);
    if (res.ok) {
      let r = await res.json();
      return r;
    } 
      else {
      let err = await res.json();
      if(err.err)return err.err;
      return Promise.reject(err);
    }
  };



  const get = (url, options = {}) => customFetch(url, options);
  const get2 = (url, options = {}) => customFetch2(url, options);

  const post = (url, options = {}) => {
    options.method = "POST";
    return customFetch(url, options);
  };
  const post2 = (url, options = {}) => {
    options.method = "POST";
    return customFetch2(url, options);
  };

  const put = (url, options = {}) => {
    options.method = "PUT";
    return customFetch(url, options);
  };
  const put2 = (url, options = {}) => {
    options.method = "PUT";
    return customFetch2(url, options);
  };

  const del = (url, options = {}) => {
    options.method = "DELETE";
    return customFetch(url, options);
  };
  const del2 = (url, options = {}) => {
    options.method = "DELETE";
    return customFetch2(url, options);
  };

  return {
    get,
    get2,
    post,
    post2,
    put,
    put2,
    del,
    del2,
  };
};
