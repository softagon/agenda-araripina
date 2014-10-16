/**
 * Created by hermes on 16/10/14.
 */
var contatourl = endereco + "contato/";

$(document).on('pagebeforeshow', '#contato', function() {

    $(document).on('submit', '#contatofrm', function(e) {
        e.preventDefault();
        postForm();
    });

    function postForm()
    {
        $.ajax({
            type: $('form').attr('method'),
            url: contatourl,
            data: $('form').serialize(),
            dataType: 'json',
            success: function(data) {
                alert("Mensagem enviada com sucesso. Iremos retornar para o seu e-mail, fique atento(a).");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error: " + xhr.status + "\n" +
                    "Message: " + xhr.statusText + "\n" +
                    "Response: " + xhr.responseText + "\n" + thrownError);
            }
        });
    }

});