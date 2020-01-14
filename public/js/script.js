$(document).ready(() => console.log("ready"));

// clear articles click handler
$(document).on('click', '#delete', (req, res) => {
    // $('#article-container').empty();
    $.ajax({
        url: '/delete-articles',
        method: 'DELETE'
    }).then((response) => window.location.replace('/'))
    .catch(error => console.log(error));
})

// view saved articles
$(document).on('click', '#saved-articles', (req, res) => {
  // $('#article-container').empty();
  $.ajax({
      url: '/saved',
      method: 'GET'
  }).then((response) => window.location.replace('/saved'))
  .catch(error => console.log(error));
})

// world news scrape
$(document).on('click', '#scrape', (req, res) => {
  $('#article-container').empty();
  $.ajax({
      url: '/scrape',
      method: 'GET'
  }).then((response) => window.location.replace('/'))
  .catch(error => console.log(error));
})

// save article click handler
$(document).on("click", ".save-article", function() {
    var thisId = $(this).parent().attr("data-id");
    //console.log('this fucking shit: ' + thisId)
    $.ajax({
      method: "PUT",
      url: "/saved/" + thisId,
      data: {
        saved: {$get:true}
      }
    })
      .then(function(data) {
        console.log(data);
      });
    })

// add note click handler
$(document).on("click", "#note-open", function() {
  var thisId = $(this).parent().attr("data-id");
  //console.log('click')
  //console.log('note id: ' + thisId)

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function(data) {
      console.log(data);
      // $(".notes").append("<input id='titleinput' name='title' >");
      // $(".notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // $(".notes").append("<button data-id='" + thisId + "' id='savenote'>Save Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

// save note click handler
$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");
  console.log('clicked: ' + thisId)
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      //console.log(data);
      $("#notes").empty();
    });
  $("#titleinput").val("");
  $("#bodyinput").val("");
  alert("Note Saved");
});

// remove note click handler
$(document).on("click", "#deletenote", function() {
  var thisId = $(this).attr("data-id");
  console.log('clicked: ' + thisId)
  $.ajax({
    method: "DELETE",
    url: "/deletenote/" + thisId,
  })
    .then(function(data) {
      $("#notes").empty();
    });
  alert("Note Deleted");
});