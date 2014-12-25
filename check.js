/*
* Checks whether the newly launched website is in our list 
* or not, and if so then prompts the dialog
*/
function check_page(url) {
	chrome.storage.sync.get({pages: []}, function(result) {
		var webpages = result.pages;
		console.log(webpages);
		var current;
		for (var i=0; i<webpages.length; i++) {
			current = webpages[i];
			console.log(current);
			if (url.indexOf(current) > -1) {
				console.log('is monitored');
				var confirm_string = get_confirmation_string(current);
				if (confirm(confirm_string)) {
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
				return 1;
			}
		}
		console.log('not monitored');
		return 0;
	});
}

function get_confirmation_string(url) {
	chrome.storage.sync.get({time_dict: {}, date_time_dict: {}}, 
		function(result) {
			var timers = result.time_dict;
			var date_timers = result.date_time_dict;
			var now = new Date().toJSON().slice(0,10);
			var today = new Date();
			var today_spent = ((date_timers[now] ? date_timers[now][url] : "0.00")/1000/60/60).toFixed(2); 
			var week_spent = 0;
			var cur_ms;
			var cur_date;
			console.log(today);
			for (var i=0; i<7; i++) {
				cur_ms = today.setDate(today.getDate()-i);
				cur_date = new Date(cur_ms).toJSON().slice(0,10);
				if (date_timers[cur_date]) {
					if (date_timers[cur_date][url]) {
						week_spent += (date_timers[cur_date][url])/1000/60/60;
					}
				}
			}
			week_spent = week_spent.toFixed(2);
			var str_builder = [];
			str_builder.push('You spent ', today_spent, ' hours today,', 
							'and ', week_spent, ' hours this week on ',
							url, '. Are you sure that you want to continue?');
			console.log(str_builder.join(""));
			return str_builder.join("");
		}
	);
}

var current_page = window.location.href;
check_page(current_page);

