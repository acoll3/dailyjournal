
let API_URL = "/api";


/* Make an API request.
   - method is the HTTP method
   - path is the path to the resource (must start with a /)
   - body is the request body. Assume that it will only supplied if the method isn't GET.
   Returns a pair (array with two elements) [status, data]:
   - status is the HTTP status (number)
   - data is the data from the server (assumed to be JSON)
   If the request fails or is not in JSON format, alert() the Error's message and then rethrow it. No exception should
   be generated for a non-OK HTTP status, as the client may wish to handle this case themselves. */
const apiRequest = async (method, path, body = null) => {
  let fullPath = API_URL + path;
  if (body != null) {
    try {
      let response = await fetch(fullPath, {method: method.toUpperCase(), headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)});
      let json = await response.json();
      return [response.status, json];
    } catch (e) {
      alert(e.message);
      throw e;
    }
  } else {
    try {
      let response = await fetch(fullPath, {method: method.toUpperCase()});
      let json = await response.json();
      return [response.status, json];
    } catch (e) {
      alert(e.message);
      throw e;
    }
  }
};

/* This line exposes the apiRequest function in the console, so you can call it for testing */
window.apiRequest = apiRequest;

export default apiRequest;
