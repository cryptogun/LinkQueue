
// i18n
function getMessage() {
  var message = chrome.i18n.getMessage("option_title");
  document.getElementById("option_title").innerHTML = message;
  var message = chrome.i18n.getMessage("open_in_text");
  document.getElementById("open_in_text").innerHTML = message;
  var message = chrome.i18n.getMessage("save");
  document.getElementById("save").innerHTML = message;
}
getMessage()


// Saves options to chrome.storage.local.
function save_options() {
  var new_tab = document.getElementById('open_in').checked;
  chrome.storage.local.set({
    'new_tab': new_tab
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = chrome.i18n.getMessage("option_saved");
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value new_tab = true.
  chrome.storage.local.get({
    'new_tab': false
  }, function(items) {
    document.getElementById('open_in').checked = items.new_tab;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);