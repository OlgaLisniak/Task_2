window.onload = function () {

	$.ajax({
		url : "getStat",
		type :'GET',
		success: function (data, status) {
			let stat = JSON.parse(data);
			for (i = 0; i < stat.length; i++) {
			  document.getElementById("results").value += '\n' + stat[i].name + "       " + stat[i].score;
			}}
		});

	document.getElementById("save").onclick = function () {

	var userName = document.getElementById("username").value;
	var playerScore = document.getElementById("scoreTxt").value;

	var playerStat = {"name" : userName, "score" : playerScore};

	if (userName != "") {
			$.ajax({
				url : "changeStat",
				type :'POST',
				contentType : 'application/json',
				data : JSON.stringify(playerStat),
				dataType : 'json',
				success : function (data, status) {
					/*let statCh = JSON.parse(data);
					for (i = 0; i < statCh.length; i++) {
			  		document.getElementById("results").value += '\n' + statCh[i].name + "       " + statCh[i].score;
					}*/
					window.location = data.redirect;
				}

			});
			
	var modal = document.getElementById("modalWindow");
	modal.style.display="none";
				  
	//Activate button "New Game" when modal window closes
	document.getElementById("newGame").disabled = false;

	} else {
		alert("Please enter your name");
}}};