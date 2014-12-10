/**
 * Created by hermes on 14/10/14.
 */

$(document).on("pageinit", "#homepage", function () {
    var buscarurl = endereco + "buscar/";

    $('#btn-buscar').on('vclick', function () {
        var palavra = $('#inpt-buscar').val();
        if (palavra) {
            buscar(palavra);
        } else {
            alert("Em branco");
        }

    });

    var buscar = function (palavra) {
        $.getJSON(buscarurl + palavra, function (data) {
            //Retira a logomarca do site e coloca o endereço
            $('#logo_araripina').empty();
            $('#logo_araripina').append('<a href="#" class="ui-btn ui-state-disabled ui-mini">Araripina.com.br</a>');

            //Exibe na tela o que o cliente pesquisou na agenda
            $('#tituloresult').empty();
            $('#tituloresult').append('<h1>Pesquisou por ' + palavra + '</h1>');

            //Exibe os resultados da pesquisa
            $('#telefones').empty();
            $.each(data, function (i, row) {
                $('#telefones').append('<li><a href="#" data-id="' + row.ID + '"><h2>' + row.post_title + '</h2><p> Atualizado em: ' + row.modificado + '</p></a></li>');
                $('#telefones').listview('refresh');
            });
        });
    };
    //Link(btn) para visualizar mais informações da Empresa
    $(document).on('vclick', '#telefones li a', function () {
        telefoneid = $(this).attr('data-id');
        $.mobile.changePage("#resultados", {transition: "slide", changeHash: false});
    });

});
//Exibe detalhes de UMA empresa selecionada
$(document).on('pagebeforeshow', '#resultados', function () {
    var pegaurl = endereco + "empresa/";


    $.getJSON(pegaurl + telefoneid, function (data) {
        $('#detalhes').empty();
        $.each(data, function (i, valor) {
            if (valor.post_title && valor.address)
                $('#detalhes').append('<li><h1>' + valor.post_title + '</h1><p>' + valor.address + '</p></li>');
            if (valor.telephone)
                $('#detalhes').append('<li data-icon="false"><a class="ui-btn ui-btn-inline ui-icon-phone ui-btn-icon-left"  href="tel:' + valor.telephone + '">' + valor.telephone + '</a></li>');
            if (valor.web)
                $('#detalhes').append('<li data-icon="false"><a class="ui-btn ui-btn-inline ui-icon-navigation ui-btn-icon-left"  href="http://' + valor.web + '">' + valor.web + '</a></li>');
            if (valor.email)
                $('#detalhes').append('<li data-icon="false"><a class="ui-btn ui-btn-inline ui-icon-mail ui-btn-icon-left"  href="mailto:' + valor.email + '">' + valor.email + '</a></li>');

            $('#detalhes').append('<li>Atualizado em: ' + valor.modificado + '</li>');
            $('#detalhes').listview('refresh');

            $('#btn_incorreto').replaceWith('<div id="btn_incorreto"><center><button data-empresa="' + valor.post_title + '" data-id="' + valor.id + '" id="btn_incorreto_ntf">Dados incorretos?</button></center></div>');
        });
    });

    //Link(btn) para NOTIFICAR dados incorretos
    $(document).on('vclick', '#btn_incorreto_ntf', function () {
        empresaid = $(this).attr('data-id');
        empresatitle = $(this).attr('data-empresa');
        $.mobile.changePage("#dados_incorretos", {transition: "slide", changeHash: false});
    });


});


$(document).on('pagebeforeshow', '#dados_incorretos', function () {

    var incorretourl = endereco + "incorreto/";
    $.post(incorretourl + empresaid, {id: empresaid, title: empresatitle})
            .done(function () {
                $('#empresa_incorreta').replaceWith('<strong id="empresa_incorreta">' + empresatitle + '</strong>');
                console.log("Funcionou " + empresatitle);
            })
            .fail(function (xhr, textStatus, errorThrown) {
                console.log("Falhou no ID " + empresaid + "E na Empresa " + empresatitle + "Error" + xhr.responseText);
            });

});