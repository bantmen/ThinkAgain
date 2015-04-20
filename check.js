/*
	Checks whether the newly launched website is in our list 
	or not, and if so then prompts the dialog.
*/
function check_page(url) {
	chrome.storage.sync.get({pages: []}, function(result) {
		var webpages = result.pages;
		console.log(webpages);
		var current;
		for (var i=0; i<webpages.length; i++) {
			current = webpages[i];
			if (is_monitored(url, current)) {
			// if (url.indexOf(current) > -1) {
				console.log('is monitored');
				confirm_close(current, confirm_proceed);
			}
		}
		console.log('not monitored');
		// return 0;
	});
}

/*
	Gets the confirm_string ready and then passes url, callback and confirm_string to
	think_again.
*/
function confirm_close(url, callback) {
	chrome.storage.sync.get({time_dict: {}, date_time_dict: {}}, 
		function(result) {
			var timers = result.time_dict;
			var date_timers = result.date_time_dict;
			var now = get_now();
			var today = new Date();
			var today_spent = date_timers[now] ? pretty_time(ms_to_hours(date_timers[now][url])) : "ERROR";
			
			var week_spent = 0;
			var cur_ms;
			var cur_date;
			console.log(today);
			for (var i=0; i<7; i++) {
				cur_ms = today.setDate(today.getDate()-i);
				cur_date = get_now(cur_ms);
				if (date_timers[cur_date]) {
					if (date_timers[cur_date][url]) {
						week_spent += date_timers[cur_date][url];
					}
				}
			}
      week_spent = ms_to_hours(week_spent);

			week_spent = pretty_time(week_spent);
			var str_builder = [];
			str_builder.push('<div align="justify">',
											 'Time spent on ', url, ': ',
											 '<br>Today: ', today_spent, 
											 '<br>Past 7 days: ', week_spent,
											 '<br>Are you sure that you want to continue?',
											 '</div>');
			var confirm_string = str_builder.join("");
			console.log(confirm_string);

			think_again(url, confirm_string, callback); // Trigger the non-blocking confirmation box.

		}
	);
}

/* 
	Noty based non-blocking confirmation box. Returns callback 
	with true or false depending on the button click.
*/
function think_again(url, confirm_string, callback) {
  var n = noty({
        text: confirm_string,
        type: 'confirm',
        dismissQueue: false,
        layout: 'center',
        theme: 'relax',
 				buttons: [
			    // If Continue button
			    {addClass: 'large green button', text: 'Continue', onClick: function($noty) {
			    	callback(true, url);
			        $noty.close();
			      }
			    },
			    // Else If Exit button
			    {addClass: 'large red button', text: 'Exit', onClick: function($noty) {
			        callback(false, url);
			        $noty.close();
			      }
			    }
			  ]
    })
}

/*
	Takes the return value of the confirmation box and acts accordingly.
	Called as the callback function.
*/
function confirm_proceed(confirmed, url) {
	if (confirmed) {
		console.log('cont.');
		chrome.runtime.sendMessage({
			action: "resume_timer", url: url 
		}, function(response) {
	  		console.log('response:');
	  		console.log(response.reaction);
		});
	}
	else {
		console.log('not cont.');
		chrome.runtime.sendMessage({
			action: "close_current_tab", url: url
		}, function(response) {
	  		console.log('response:');
	  		console.log(response.reaction);
		});
	}
}

var current_page = window.location.href;
check_page(current_page);
