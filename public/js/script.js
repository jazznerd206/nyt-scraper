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
    var thisId = $(this).attr("data-id");
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