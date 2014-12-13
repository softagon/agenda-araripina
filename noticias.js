/**
 * Created by hermes on 15/10/14.
 */
var notijson = "https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20link%2C%20pubDate%20from%20rss%20where%20url%3D'http%3A%2F%2Fwww.araripina.com.br%2Ffeed'%20LIMIT%2010&format=json&callback=";

$(document).on('pageshow', '#noticias', function () {
    $.ajaxSetup({cache: true});
    $("#loading").show();
    $.ajax({
        type: "GET",
        url: notijson,
        dataType: 'json',
        async: false,
        success: function (data) {
            $('#lista_noticia').empty();

            $.each(data.query.results.item, function (i, valor) {
                var dateObject = new Date(valor.pubDate);
                var dia = dateObject.getDate();
                var mes = dateObject.getMonth() + 1;
                var ano = dateObject.getFullYear();
                var dataPost = dia + '/' + mes + '/' + ano;

                $('#lista_noticia').append('<li><a href="' + valor.link + '"><h2> ' + valor.title + '</h2><p class="ui-li-aside"><strong>' + dataPost + '</strong></p></a></li>');
                $('#lista_noticia').listview('refresh');

            });
            $("#loading").hide();
        }
    });

});