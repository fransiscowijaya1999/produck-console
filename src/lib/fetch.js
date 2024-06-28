const makeFetchWithBaseUrl = (/** @type {{ (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response>; (arg0: any, arg1: any): any; }} */ fetchFunction, /** @type {string} */ baseUrl) => {
    return (/** @type {string} */ resource, /** @type {any} */ options) => {
        let fullPath = "";
        if (typeof resource === 'string') {
            fullPath = baseUrl + resource;
        }
        return fetchFunction(fullPath, options);
    }
}
const makeServerFetchWithBaseUrl = (/** @type {string} */ baseUrl) => {
    return (/** @type {{ (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response>; (arg0: any, arg1: any): any; }} */ fetchFunction, /** @type {string} */ resource, /** @type {any} */ options) => {
        let fullPath = "";
        if (typeof resource === 'string') {
            fullPath = baseUrl + resource;
        }
        return fetchFunction(fullPath, options);
    }
}

export const fetchServer = makeFetchWithBaseUrl(fetch, "http://192.168.1.2:5000/");
export const ssFetch = makeServerFetchWithBaseUrl("http://localhost:5000/");
