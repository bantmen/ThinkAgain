function update_current() {
  chrome.storage.sync.get({pages: []}, function(result) {
    var current = document.getElementById('status');
    current.textContent = result.pages.toString();
  });
}

document.addEventListener('DOMContentLoaded', update_current());
