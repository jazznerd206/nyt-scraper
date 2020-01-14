$(document).ready(() => console.log("ready"));

$(document).on('click', '#delete', (req, res) => {
    $('#article-container').empty();
    $.ajax({
        url: '/delete-articles',
        method: 'DELETE'
    }).then((response) => window.location.reload('/'))
    .catch(error => console.log(error));
})
$(document).on('click', '#scrape', (req, res) => {
    $('#article-container').empty();
    $.ajax({
        url: '/scrape',
        method: 'GET'
    }).then((response) => window.location.replace('/'))
    .catch(error => console.log(error));

})


// When you click the save article button
$(document).on("click", ".save-article", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).parent().attr("data-id");
    console.log('this fucking shit: ' + thisId)
  
    // Run a POST request to change the article to saved
    $.ajax({
      method: "PUT",
      url: "/saved/" + thisId,
      data: {
        saved: {$get:true}
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
      });
    })

// Whenever someone clicks a p tag
$(document).on("click", "#note-open", function() {
  var thisId = $(this).parent().attr("data-id");
  console.log('click')
  console.log('note id: ' + thisId)

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // An input to enter a new title
      $(".notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $(".notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $(".notes").append("<button data-id='" + thisId + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});
// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId)

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});