$(document).ready(() => console.log("ready"));

$(document).on('click', '#delete', (req, res) => {
    $('#article-container').empty();
    $.ajax({
        url: '/delete-articles',
        method: 'DELETE'
    }).then((response) => window.location.reload('/'));
})
$(document).on('click', '#scrape', (req, res) => {
    $('#article-container').empty();
    $.ajax({
        url: '/scrape',
        method: 'GET'
    }).then((response) => window.location.replace('/'));
})


// When you click the savenote button
$(document).on("click", ".save-article", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log('this fucking shit: ' + thisId)
  
    // Run a POST request to change the note, using what's entered in the inputs
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
        // Empty the notes section
      });
    })