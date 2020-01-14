$(document).ready(() => console.log("ready"));

// clear articles click handler
$(document).on('click', '#delete', (req, res) => {
    $.ajax({
        url: '/delete-articles',
        method: 'DELETE'
    }).then((response) => window.location.replace('/'))
    .catch(error => console.log(error));
})

// view saved articles
$(document).on('click', '#saved-articles', (req, res) => {
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
    $.ajax({
      method: "PUT",
      url: "/saved/" + thisId,
      data: {
        saved: {$get:true}
      }
    })
      .then((data) => {
        alert("Article Saved!!")
        window.location.reload();
      });
    })

// add note click handler
$(document).on("click", "#note-open", () => {
  var thisId = $(this).parent().attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $(".titleinput").val(),
      body: $(".bodyinput").val()
    }
  })
    .then((data) => {
      if (data.note) {
        $(".titleinput").val(data.note.title);
        $(".bodyinput").val(data.note.body);
      }
    });
});

// save note click handler
$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $(".titleinput").val(),
      body: $(".bodyinput").val()
    }
  })
    .then((data) => {
      $("#notes").empty();
    });
  $(".titleinput").val("");
  $(".bodyinput").val("");
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