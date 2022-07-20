const url = "https://api.notion.com/v1/blocks/";

async function gatherResponse(response) {

  const { headers } = response;
  const contentType = headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const json = await response.json();
    let page = json.child_page
    return JSON.stringify(page);
  } else if (contentType.includes('application/text')) {
    return response.text();
  } else if (contentType.includes('text/html')) {
    return response.text();
  } else {
    return response.text();
  }
}

async function handleRequest(request) {
  let token = await YouAutoDev.get('NOTION_TOKEN')
  const { searchParams } = new URL(request.url)
  let id = searchParams.get('id')
  console.log(id)
  const init = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Notion-Version': '2022-06-28',
      'Authorization': "Bearer " + token,
    },
  };
  let response = await fetch(url + id, init)
  let results = await gatherResponse(response)
  return new Response(results, init);
}

addEventListener('fetch', event => {
    console.log(event.request)
  return event.respondWith(handleRequest(event.request));
});
