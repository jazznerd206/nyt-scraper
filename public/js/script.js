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
    }).then((response) => window.location.reload('/'));
})