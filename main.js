// var queue = []
// // push:
// queue.push(1)
// // pop:
// var value = queue.shift()


function update_icon()
{
  chrome.storage.sync.get('urls', function(obj)
  {
    var queue = obj.urls
    // if saved queue is none:
    if (!queue)
    {
      queue = []
    }
    if (queue.length > 0)
    {
      if (queue.length % 2)
      {
        chrome.browserAction.setIcon({path: "images/queue_16.png"})
      }
      else
      {
        chrome.browserAction.setIcon({path: "images/queue_16_light_green.png"})
      }
      chrome.browserAction.setBadgeText({text: queue.length.toString()})
    }
    else
    {
      chrome.browserAction.setIcon({path: "images/queue_16_gray.png"})
      chrome.browserAction.setBadgeText({text: ''})
    }
  })
}

function popFromQueue()
{
  // get saved urls queue:
  chrome.storage.sync.get('urls', function(obj)
  {
    var queue = obj.urls

    // if saved queue is none:
    if (!queue)
    {
      queue = []
    }
    // pop an url:
    url = queue.shift()

    if (url)
    {
      url = Base64.decode(url)
    }
    else
    {
      // optional arg. null for new tab.
      url = null
    }

    chrome.storage.sync.get(
    {
      'new_tab': false
    },
    function(items)
    {
      if (!url || items.new_tab)
      {
        // open url in new tab:
        url_func = chrome.tabs.create
      }
      else
      {
        // open url in current tab:
        url_func = chrome.tabs.update
      }
      url_func({'url': url}, function(tab)
      {
        // save new queue:
        chrome.storage.sync.set({'urls': queue}, function()
        {
          update_icon()
          // console.log('pop queue saved.')
          // console.log(queue)
        })
      })
    })
  })
}


// push to queue
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
  chrome.storage.sync.get('urls', function(obj)
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
      chrome.storage.sync.set({'urls': queue}, function()
      {
        update_icon()
        // console.log('Url saved.')
        // console.log(queue)
      })
    }
  })
}

function addToQueue(link)
{
  var _url = link.linkUrl
  saveUrl(_url)
}

function addToQueueSelection(info, tab)
{
  if (!info.selectionText)
  {
    return
  }
  var _url = info.selectionText.trim()
  parts = _url.match(/\S+/g) || []
  if (parts.length < 1)
  {
    return
  }
  if (!parts[0].includes('://'))
  {
    _url = 'http://' + _url
  }
  saveUrl(_url)
}

update_icon()

// pop from queue when icon clicked.
chrome.browserAction.onClicked.addListener(popFromQueue)


chrome.contextMenus.create
({
  title: chrome.i18n.getMessage("menu_add_url"),
  contexts:["link"],
  onclick: addToQueue
})

chrome.contextMenus.create
({
  title: chrome.i18n.getMessage("menu_add_selection"),
  contexts:["selection"],
  onclick: addToQueueSelection
})


chrome.commands.onCommand.addListener(function(command)
{
  if(command === "addurl")
  {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
      chrome.tabs.sendMessage(tabs[0].id, 'push url')
      setTimeout(function()
      {
        update_icon()
      }, 100)
    })
  }
  else if (command === "removeurl")
  {
    popFromQueue()
  }
})
