(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(function ($) {
    "use strict";
    $(document).ready(function () {
        $(document).on('click', '[data-action="upload"]', function () {
            $(this).parent().next().find('.file-upload').trigger('click');
        });

        $(document).on("change", ".beat-upload-form .file-upload", function() {
            $(this).parent().submit();
        });

        $(document).on("submit", ".beat-upload-form", function(e) {
            e.preventDefault();
            var formData = new FormData(this);
            $.ajax({
                type:'POST',
                url: route.route('frontend.auth.upload.beat.post'),
                data:formData,
                cache:false,
                contentType: false,
                processData: false,
                beforeSend: function(){
                    $('.beat-upload.progress').removeClass('d-none');
                    $('.beat-upload.select-type').addClass('d-none');
                },
                success:function(response){
                    if(parseInt(response.type) === 0) {
                        $(window).trigger({
                            type: 'engineNeedHistoryChange',
                            href: route.route('frontend.beats.tracks.edit', {id: response.id})
                        });
                    } else if(parseInt(response.type) === 1) {
                        $(window).trigger({
                            type: 'engineNeedHistoryChange',
                            href: route.route('frontend.beats.sound-kits.edit', {id: response.id})
                        });
                    } else if(parseInt(response.type) === 2) {
                        $(window).trigger({
                            type: 'engineNeedHistoryChange',
                            href: route.route('frontend.beats.songs.edit', {id: response.id})
                        });
                    }
                },
                error: function(e, textStatus, xhr, $form) {
                    var errors = e.responseJSON.errors;
                    $.each( errors , function( key, value ) {
                        Toast.show("error", value[0], null);
                    });
                    $('.upload-beat-error')
                        .html(e.responseJSON.errors[Object.keys(e.responseJSON.errors)[0]][0])
                        .removeClass('d-none');
                    setTimeout(function () {
                        $('.beat-upload.progress').addClass('d-none');
                        $('.beat-upload.select-type').removeClass('d-none');
                        $('.upload-beat-error').addClass('d-none');
                    }, 3000);
                },
                xhr: function() {
                    var xhr = new XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(e) {
                        if (e.lengthComputable) {
                            var uploadpercent = e.loaded / e.total;
                            uploadpercent = Math.round(uploadpercent * 100);
                            $('.beat-upload .progress-bar').text(uploadpercent + '%');
                            $('.beat-upload .progress-bar').width(uploadpercent + '%');
                        }
                    }, false);
                    return xhr;
                }
            });
        });
        $(document).on('click', '.beat-artwork-upload', function () {
            $('.beat-edit-artwork-input').trigger('click');
            return false;
        });
        $(document).on('change', '.beat-edit-artwork-input', function () {
            var input = this;
            var url = $(this).val();
            var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
            if (input.files && input.files[0] && (ext === "gif" || ext === "png" || ext === "jpeg" || ext === "jpg")) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('.beat-artwork').attr('src', e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
        });
        $(document).on('click', '[data-action=upload-track-attachment]', function () {
            $('.beat-edit-track-attachment-input').trigger('click');
            return false;
        });
        $(document).on('change', '.beat-edit-track-attachment-input', function () {
            $('.upload-beat-for-download').find('.loading').removeClass('d-none');
            $('.upload-beat-for-download').find('.no-loading').addClass('d-none');
            $('#beat-edit-track-stems-form').submit();
        });
        $(document).on('click', '[data-action=buy-track-license]', function () {
            var song_id = $(this).attr('data-id');
            $.ajax({
                url: route.route('api.song', {id: song_id}),
                type: 'get',
                dataType: 'json',
                success: function (response) {
                    $('.lightbox-buy-song').find('.lightbox-content-block').empty();
                    if(response && response.license && response.license.length) {
                        for (var i = 0; i < response.license.length; i++) {
                            var item = tmpl('tmpl-track-license-item', {
                                item: response.license[i],
                            })
                            $('.lightbox-buy-song').find('.lightbox-content-block').append(item);
                        }
                        $.engineLightBox.show("lightbox-buy-song");
                    }
                }
            });
            return false;
        });
        EMBED.Event.add(window, "embedQueueChanged", function () {
            if(EMBED.Playlist.length) {
                var song = EMBED.Playlist[EMBED.Player.queueNumber];
                var buyButton = $('#embed_buy_button');
                if(parseInt(song.selling)) {
                    $.ajax({
                        url: route.route('api.song', {id: song.id}),
                        type: 'get',
                        dataType: 'json',
                        success: function (response) {
                            if(response.license.length) {
                                buyButton.removeAttr('data-action');
                                buyButton.removeClass('d-none');
                                buyButton.find('span').html('$' + response.license[0].price);
                                buyButton.attr('data-action', 'buy-track-license');
                                buyButton.attr('data-id', song.id);
                            } else {
                                buyButton.removeAttr('data-action');
                                buyButton.removeClass('d-none');
                                buyButton.find('span').html('$' + response.price);
                                buyButton.attr('data-action', 'buy');
                                buyButton.attr('data-orderable-type', 'App\\Models\\Song');
                                buyButton.attr('data-orderable-id', song.id);
                            }
                        }
                    });
                } else {
                    buyButton.addClass('d-none');
                }
            }

        });
    });
    $(document).on("change", '#not-for-sale-checkbox', function () {
        $('.beats-sale-form').toggleClass('d-none');
    });
});