/*
	Created by: Paul Sesar
	Created Date: 20150329

	This is the main js file for the omdbapi-movie-info project
*/

//imdbNoValue is the value returned by the imdbapi that means the data has no value
var imdbNoValue = "N/A";

//the main search function. This is the first call to check if the user entered more than one character
function searchMovies() {

	var search = $("#searchMovie").val();
	if(search.length > 1) {
		getMovies(search);
	} else {
		$('#searchResults').empty();
		$("#errorMessage").css('display', 'none');
	}
}

//This function takes in a 'search' word that will call the omdbapi with that variable and call different functions based on the movie count that the data list returns
function getMovies(search) {

	$.ajax({
	  url: "http://www.omdbapi.com/?s="+search+"&r=json",
	  method: "get"
	})
	.success(function( data ) {
		//hide and clear previous results when we get new data from the server
	  	$("#errorMessage").css('display', 'none');
	  	$('#searchResults').empty();
	  	//check if the javascript interpreter parsed it to an object, if not create object
	  	if(typeof data !== 'object') {
	  		data = JSON.parse(data);
	  	}

	  	if(data.hasOwnProperty('Error')) {
	  		//check error from omdbapi and display in error section
	  		$("#errorMessage").html(data.Error);
	  		$("#errorMessage").css('display', 'block');
	  	} else {
	  		//if no error check if a list of movies is displayed or only one movie
	  		var movieList = data.Search;
		  	if(movieList.length > 1) {
		  		updateMovieList(movieList);
		  	} else {
		  		updateMovieInfo(movieList[0].imdbID);
		  	}
	  	}
  	})
	.error(function( jqXHR, textStatus, errorThrown ) {
	  	alert(request.responseText);
	});
}

//This function takes in a list of movie items (movieList), and loops through them and updates the UI based on the list of movies.
function updateMovieList(movieList) {
	
	//loop through all the movieList data and setup a viewDetails link to display the movie information.
	for (var i in movieList) {
		var movie = movieList[i];
		$('#searchResults').css('display', 'block');
		$tmp = $('#searchMovieItem').clone();
		$tmp.attr('id', 'searchMovieItem-'+i);
		$tmp.find(".movieTitle").html(movie.Title+" <a class='viewDetails' onclick='displayMovieInfo(&quot;"+movie.imdbID+"&quot;, &quot;searchMovieItem-"+i+"&quot;);'>View Details</a>");
		$('#searchResults').append($tmp);
	}
}

//This function takes a imdbID (id is optional), and calls the omdbapi to get the movie information on the imdbID. If a id is passed it will append to that id. 
function updateMovieInfo(imdbID, id) {

	//Get the movie infomation for a specific movie by the imdb id. 
	$.ajax({
	  url: "http://www.omdbapi.com/?i="+imdbID+"&r=json",
	  method: "get"
	})
	.success(function(data) {
	  	if(id == null) {
	  		//clear search results only if the movie info is display for one movie
	  		$("#errorMessage").css('display', 'none');
	  		$('#searchResults').empty();
	  	}
	  	//check if the javascript interpreter parsed it to an object, if not create object
	  	if(typeof data !== 'object') {
	  		data = JSON.parse(data);
	  	}

	  	if(data.hasOwnProperty('Error')) {
	  		//check error and display in error section
	  		$("#errorMessage").html(data.Error);
	  		$("#errorMessage").css('display', 'block');
	  	} else {
	  		//display searchResults area and clone the detail object
	  		$('#searchResults').css('display', 'block');
	  		$tmp = $('#movieDetail').clone();

	  		//title is already displaying to open and close no need to display twice on multiple movies
	  		if(id == null) {
	  			$tmp.find(".movieTitle").html(data.Title);
	  		}

	  		//check if "no value" is returned from the api, if no value do not show the item 
	  		if(data.Plot != imdbNoValue) {
				$tmp.find(".moviePlot").html(data.Plot);
			}
			if(data.Poster != imdbNoValue) {
				$tmp.find(".moviePoster").html('<img width="200px" src="'+data.Poster+'"/>');
			}
			if(data.Language != imdbNoValue) {
				$tmp.find(".movieLanguage").html("Language: "+data.Language);
			}
			if(data.Actors != imdbNoValue) {
				$tmp.find(".movieActors").html("Actors: "+data.Actors);
			}
			if(data.Released != imdbNoValue) {
				$tmp.find(".movieReleased").html("Released: "+data.Released);
			}
			if(data.Director != imdbNoValue) {
				$tmp.find(".movieDirector").html("Director: "+data.Director);
			}
			if(data.imdbRating != imdbNoValue) {
				$tmp.find(".movieRating").html("IMDB Rating: "+data.imdbRating);
			}

			//check if the element id was passed, if null, then append to the searchResults, so only the movie is displaying. If id is passed, append to id of that element.
			if(id == null) {
				$('#searchResults').append($tmp);
			} else {
				//clear out before appending, just in case of slow api response times
				$('#'+id).find("#movieDetail").remove();
				$('#'+id).append($tmp);
				
				//change the view Details to hide the extra information 
				$('#'+id).find(".movieTitle").find(".viewDetails").attr("onclick", "closeMovieInfo('"+imdbID+"', '"+id+"');" );
				$('#'+id).find(".movieTitle").find(".viewDetails").text("Close Details");

				//adjust the background of the movie info to show a break between titles in the search results
	  			$('#'+id).find(".movieDetail").css('background', '#e0e0e0');
	  			$('#'+id).find(".movieDetail").css('padding-left', '12px');
			}
	  	}
  	})
	.error(function( jqXHR, textStatus, errorThrown ) {
	  	alert(request.responseText);
	});
}

//This function will display the movie information about that movie during the search. 
function displayMovieInfo(imdbID, id) {

	//Display movie info below the movie title when searching for multiple movies.
	updateMovieInfo(imdbID, id);
}

//This function will close the movie information for a specific movie. 
function closeMovieInfo(imdbID, id) {

	//remove the appended movie detail
	$('#'+id).find("#movieDetail").remove();
	//setup for button to open details again
	$('#'+id).find(".movieTitle").find(".viewDetails").attr("onclick", "displayMovieInfo('"+imdbID+"', '"+id+"');" );
	$('#'+id).find(".movieTitle").find(".viewDetails").text("View Details");
}



