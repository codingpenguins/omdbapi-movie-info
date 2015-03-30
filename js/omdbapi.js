/*
	Created by: Paul Sesar
	Created Date: 20150329

	This is the main js file for the omdbapi-movie-info project
*/

var imdbNoValue = "N/A";

function searchMovies() {
	var search = $("#searchMovie").val();
	if(search.length > 1) {
		getMovies(search);
	} else {
		$('#searchResults').empty();
		$("#errorMessage").css('display', 'none');
	}
}

function getMovies(search) {
	//see documentation 
	$.ajax({
	  url: "http://www.omdbapi.com/?s="+search+"&r=json",
	  method: "get"
	})
	  .success(function( data ) {
	  	$("#errorMessage").css('display', 'none');
	  	$('#searchResults').empty();
	  	console.log(data);
	  	//var jsonMovieReturn = JSON.parse(data);
	  	if(data.hasOwnProperty('Error')) {
	  		//check error and display in error section
	  		$("#errorMessage").html(data.Error);
	  		$("#errorMessage").css('display', 'block');
	  	} else {
	  		var movieList = data.Search;
		  	if(movieList.length > 1) {
		  		updateMovieList(movieList);
		  	} else {
		  		updateMovieInfo(movieList[0].imdbID);
		  	}
	  	}
  	});
}

function updateMovieList(movieList) {
	console.log(movieList);
	for (var i in movieList) {
		var movie = movieList[i];
		$('#searchResults').css('display', 'block');
		$tmp = $('#searchMovieItem').clone();
		$tmp.attr('id', 'searchMovieItem-'+i);
		$tmp.find(".movieTitle").html(movie.Title+" <a class='viewDetails' onclick='displayMovieInfo(&quot;"+movie.imdbID+"&quot;, &quot;searchMovieItem-"+i+"&quot;);'>View Details</a>");
		$('#searchResults').append($tmp);
  		console.log(movie);
	}
}

function updateMovieInfo(imdbID, id) {
	console.log(imdbID);
	$.ajax({
	  url: "http://www.omdbapi.com/?i="+imdbID+"&r=json",
	  method: "get"
	})
	  .success(function(data) {
	  	if(id == null) {
	  		$("#errorMessage").css('display', 'none');
	  		$('#searchResults').empty();
	  	}
	  	console.log(data);
	  	//var jsonMovieReturn = JSON.parse(data);
	  	if(data.hasOwnProperty('Error')) {
	  		//check error and display in error section
	  		$("#errorMessage").html(data.Error);
	  		$("#errorMessage").css('display', 'block');
	  	} else {

	  		$('#searchResults').css('display', 'block');
	  		$tmp = $('#movieDetail').clone();

	  		//title is already displaying to open and close no need to display twice on multiple movies
	  		if(id == null) {
	  			$tmp.find(".movieTitle").html(data.Title);
	  		}

	  		//check if N/A is returned, if so do not show item
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

			if(id == null) {
				$('#searchResults').append($tmp);
			} else {
				$('#'+id).append($tmp);
				//change the view Details to hide
				$('#'+id).find(".movieTitle").find(".viewDetails").attr("onclick", "closeMovieInfo('"+imdbID+"', '"+id+"');" );
				$('#'+id).find(".movieTitle").find(".viewDetails").text("Close Details");

				//adjust the background to show as a difference
	  			$('#'+id).find(".movieDetail").css('background', '#e0e0e0');
			}
	  		console.log(data);
	  	}
  	});
}

function displayMovieInfo(imdbID, id) {
	//display movie info below
	console.log(imdbID+" "+id);
	updateMovieInfo(imdbID, id);
}

function closeMovieInfo(imdbID, id) {

	//remove the appended movie detail
	$('#'+id).find("#movieDetail").remove();
	//setup for button to open details again
	$('#'+id).find(".movieTitle").find(".viewDetails").attr("onclick", "displayMovieInfo('"+imdbID+"', '"+id+"');" );
	$('#'+id).find(".movieTitle").find(".viewDetails").text("View Details");
}



