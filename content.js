function saveUrl(url)
{
  // no url:
  if (!url)
  {
    // console.log('No url specified.')
    return null
  }

  var queue = []
  // get urls queue:
  chrome.storage.local.get('urls', function(obj)
  {
    queue = obj.urls
    // if saved queue is none:
    if (!queue)
    {
      queue = []
    }
    // append if not contains:
    encoded_url = Base64.encodeURI(url.toString())
    if (!queue.includes(encoded_url))
    {
      queue.push(encoded_url)
      // save to storage.
      chrome.storage.local.set({'urls': queue}, function()
      {
        // console.log('Url saved.')
        // console.log(queue)
      })
    }
  })
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (document.activeElement.nodeName.toUpperCase() === "A")
  {
    var url = document.activeElement.href
    if (url.startsWith('http'))
    {
      saveUrl(url)
    }
  }
})