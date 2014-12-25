// Updates th current list of monitored websites
function update_current() {
  console.log('update');
  chrome.storage.sync.get({pages: []}, function(result) {
    var current = document.getElementById('current_list');
    var tracked = result.pages.toString();
    if (tracked) current.textContent = tracked;
    else current.textContent = 'No websites are currently being tracked.';
  });
}

// Adds a new page to our monitoring list
function save_page() {
  chrome.storage.sync.get({pages: []}, function(result) {
    var webpages = result.pages;
    var new_page = document.getElementById('new_page').value;
    if (!new_page) return ; // don't take empty input
    webpages.push(new_page);
    console.log(webpages);
    chrome.storage.sync.set({pages: webpages}, 
      function() {
          var status = document.getElementById('new_page_status');
          if (!status) return ;
          status.textContent = new_page + ' was added to the list.';
          setTimeout(function() {
            status.textContent = '';
            update_current();
          }, 750);
        });
    });
}

// Removes a page from our list
function remove_page() {
  var remove = document.getElementById('old_page').value;
  if (!remove) return ; // don't take empty input
  chrome.storage.sync.get({pages: []}, function(result) {
    var webpages = result.pages;
    for (var i=0; i<webpages.length; i++) {
      var current = webpages[i];
      if (current.indexOf(remove) > -1) {
        webpages.splice(i, 1);
        break;
      }  
    }
    chrome.storage.sync.set({pages: webpages}, 
      function() {
        var status = document.getElementById('old_page_status');
        status.textContent = remove + ' was removed from the list.';
        setTimeout(function() {
          status.textContent = '';
          update_current();
        }, 750);
    });
  });
  console.log(remove);
}

function change_frequency() {
  chrome.storage.sync.get({frequencies: {}}, function(result) {

  });
}

document.addEventListener('DOMContentLoaded', update_current());
document.getElementById('save_page').addEventListener('click', save_page);
document.getElementById('remove_page').addEventListener('click', remove_page);
