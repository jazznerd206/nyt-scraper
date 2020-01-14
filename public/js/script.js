$(document).ready(() => console.log("ready"));

// clear articles click handler
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


// save article click handler
$(document).on("click", ".save-article", function() {
    var thisId = $(this).parent().attr("data-id");
    console.log('this fucking shit: ' + thisId)
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
  console.log('click')
  console.log('note id: ' + thisId)

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function(data) {
      console.log(data);
      $(".notes").append("<input id='titleinput' name='title' >");
      $(".notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $(".notes").append("<button data-id='" + thisId + "' id='savenote'>Save Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

// save note click handler
$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");
  console.log(thisId)
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      $("#notes").empty();
    });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// remove note click handler