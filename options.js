function update_current() {
  chrome.storage.sync.get({pages: []}, function(result) {
    var current = document.getElementById('current_list');
    current.textContent = result.pages.toString();
  });
}

function save_page() {
  chrome.storage.sync.get({pages: []}, function(result) {
    var webpages = result.pages;
    var new_page = document.getElementById('new_page').value;
    webpages.push(new_page);
    console.log(webpages);
    chrome.storage.sync.set({
      pages: webpages
      }, function() {
          var status = document.getElementById('new_page_status');
          status.textContent = new_page+' was added to the list.';
          setTimeout(function() {
            status.textContent = '';
            update_current();
          }, 1000);
        });
    });
}

document.addEventListener('DOMContentLoaded', update_current());
document.getElementById('save_page').addEventListener('click', save_page);

