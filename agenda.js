/**
 * Created by hermes on 14/10/14.
 */
$(document).on("pageinit", "#homepage", function () {
    $.ajaxSetup({cache: true});
    var buscarurl = endereco + "buscar/";

    $('#btn-buscar').on('vclick', function () {
        var palavra = $('#inpt-buscar').val();
        if (palavra) {
            buscar(palavra);
        } else {
            alert("Por favor, digite uma palavra antes de clicar em buscar");
        }

    });

    $("#inpt-buscar").keypress(function (event) {
        if (event.which == 13) {
            var palavra = $('#inpt-buscar').val();
            if (palavra) {
                buscar(palavra);
            } else {
                alert("Por favor, digite uma palavra antes de clicar em buscar");
            }
        }
    });

    var buscar = function (palavra) {
        $.ajax({
            type: "GET",
            url: buscarurl + palavra,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {
                $("#loadingres").show();
            },
            success: function (data) {
                if (data) {
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
                } else {
                    $('#telefones').empty();
                    $('#tituloresult').empty();
                    $('#tituloresult').append('<h1>Pesquisou por ' + palavra + '</h1>');
                    $('#telefones').append('<br/>&nbsp;&nbsp;&nbsp;Não foi encontrada nada com a palavra <strong>' + palavra + '</strong>, tente uma palavra similar.<br/><br/>');
                }
                $("#loadingres").hide();
            }
        });
    }
    //Link(btn) para visualizar mais informações da Empresa
    $(document).on('vclick', '#telefones li a', function () {
        telefoneid = $(this).attr('data-id');
        $.mobile.changePage("#resultados", {transition: "slide", changeHash: false});
    });

});
//Exibe detalhes de UMA empresa selecionada
$(document).on('pageshow', '#resultados', function () {
    $.ajaxSetup({cache: true});
    var pegaurl = endereco + "empresa/";
    var cnt = {};

    $("#loadingemp").show();
    $.ajax({
        type: "GET",
        url: pegaurl + telefoneid,
        dataType: 'json',
        async: false,
        success: function (data) {
            $('#detalhes').empty();
            $.each(data, function (i, valor) {
                if (valor.post_title && valor.address) {
                    $('#detalhes').append('<li><h1>' + valor.post_title + '</h1><p>' + valor.address + '</p></li>');
                    cnt.nome = valor.post_title;
                    cnt.endereco = valor.address;
                }
                if (valor.telephone) {
                    $('#detalhes').append('<li data-icon="false"><a class="ui-btn ui-btn-inline ui-icon-phone ui-btn-icon-left"  href="tel:' + valor.telephone + '">' + valor.telephone + '</a></li>');
                    cnt.telefone = valor.telephone;
                }
                if (valor.web) {
                    $('#detalhes').append('<li data-icon="false"><a class="ui-btn ui-btn-inline ui-icon-navigation ui-btn-icon-left"  href="http://' + valor.web + '">' + valor.web + '</a></li>');
                    cnt.site = valor.web;
                }
                if (valor.email) {
                    $('#detalhes').append('<li data-icon="false"><a class="ui-btn ui-btn-inline ui-icon-mail ui-btn-icon-left"  href="mailto:' + valor.email + '">' + valor.email + '</a></li>');
                    cnt.email = valor.email;
                }
                $('#detalhes').append('<li>Atualizado em: ' + valor.modificado + '</li>');
                $('#detalhes').listview('refresh');

                $('#btn_incorreto').replaceWith('<div id="btn_incorreto"><center><button data-empresa="' + valor.post_title + '" data-id="' + valor.id + '" id="btn_incorreto_ntf">Dados incorretos?</button></center></div>');
            });

            $('#btn-salvar').bind('click', function () {
                saveContact(cnt);
            });
            $("#loadingemp").hide();
        }
    });

    function saveContact(cnt) {
        console.log('Getting Contact Info...');
        //Create variables from form input
        var fullName = cnt.nome;
        var note = "Salvo via Araripina Agenda aplicativo do Araripina.com.br";
        var emailAddress = cnt.email;
        //Create contact object
        var theContact = navigator.contacts.create({"displayName": fullName});
        theContact.note = note;
        theContact.urls = cnt.site;
        var emails = [];
        emails[0] = new ContactField('email', emailAddress, false);
        theContact.emails = emails;
        var addresses = [];
        addresses[0] = new ContactField('addresses', cnt.endereco, false);
        theContact.addresses = addresses;
        var phoneNumbers = [];
        phoneNumbers[0] = new ContactField('phoneNumbers', cnt.telefone, false);
        theContact.phoneNumbers = phoneNumbers;
        //Save contact info   
        theContact.save(onSaveSuccess, onSaveError);
    }
    function onSaveSuccess(contact) {
        alert('Salvamos o contato no direto no seu telefone');
    }
    function onSaveError(error) {
        alert('Error: ' + error.code);
    }

    //Link(btn) para NOTIFICAR dados incorretos
    $(document).on('vclick', '#btn_incorreto_ntf', function () {
        empresaid = $(this).attr('data-id');
        empresatitle = $(this).attr('data-empresa');
        $.mobile.changePage("#dados_incorretos", {transition: "slide", changeHash: false});
    });


});


$(document).on('pageshow', '#dados_incorretos', function () {

    var incorretourl = endereco + "incorreto/";
    $.post(incorretourl + empresaid, {id: empresaid, title: empresatitle})
            .done(function () {
                $('#empresa_incorreta').replaceWith('<strong id="empresa_incorreta">' + empresatitle + '</strong>');
//                console.log("Funcionou " + empresatitle);
            })
            .fail(function (xhr, textStatus, errorThrown) {
//                console.log("Falhou no ID " + empresaid + "E na Empresa " + empresatitle + "Error" + xhr.responseText);
            });

});