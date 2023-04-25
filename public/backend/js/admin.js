(function($) {
    "use strict"; // Start of use strict
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    if($('#update-alert').length) {
        setTimeout(function () {
            $.ajax({
                method: 'POST',
                url: updateCheckerUrl,
                success: function (response) {
                    var current_version = $('#update-alert').attr('data-version');
                    if(current_version !== response.new_version) {
                        $('#update-alert').removeClass('d-none');
                        $('#update-alert').find('.new-version').html(response.new_version);
                        if(response.new_version.includes("beta")) {
                            $('#update-alert').find('.beta-alert').removeClass('d-none');
                        }
                    }
                }
            });
        }, 5000)
    }

    // Toggle the side navigation
    $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
        $(window).toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
            document.cookie = 'sidebar=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = "sidebar=small";
            $('.sidebar .collapse').collapse('hide');
        } else {
            document.cookie = 'sidebar=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = "sidebar=large";
        }
    });

    // Close any open menu accordions when window is resized below 768px
    $(window).resize(function() {
        if ($(window).width() < 768) {
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
        if ($(window).width() > 768) {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
        }
    });

    // Scroll to top button appear
    $(document).on('scroll', function() {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
        } else {
            $('.scroll-to-top').fadeOut();
        }
    });

    // Smooth scrolling using jQuery easing
    $(document).on('click', 'a.scroll-to-top', function(e) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1000, 'easeInOutExpo');
        e.preventDefault();
    });
    $('#suggest-form').ajaxForm({
        success: function(response, textStatus, xhr, $form) {
            var data = response.data;
            var object_type = $('#suggest-form').data('objectType');
            var object_id = $('#suggest-form').data('objectId');

            var song_html = '';
            for (var i = 0; i < data.length; i++) {
                song_html += '<tr>\n' +
                    '<td class="td-image"><div class="play" data-id="' + data[i].id + '" data-type="song"><img src="' + data[i].artwork_url + '"></div></td>\n' +
                    '<td>' + data[i].title + '</td>\n' +
                    '<td>' + data[i].artists.map(function(artist) {
                        return artist.name
                    }).join(", ") + '</td>\n' +
                    '<td style="width: 45px; text-align: center;"><span class="add-to" data-id="' + object_id + '" data-song-id="' + data[i].id + '" data-type="' + object_type + '" style="cursor: pointer"><icon class="fa fa-plus"></icon></span></td>\n' +
                    '</tr>'
            }
            $(".auto-suggest").html('<table class="table table-striped"><thead><tr><th class="th-image"></th><th>Title</th><th>Artist(s)</th><th></th></tr></thead><tbody>' + song_html + '</tbody></table>');



            $(".add-to").click(function() {

                var song_id = $(this).data("song-id");
                var element = $(this).find("icon");
                $.post(admin_path + '/auth/addSong', {
                    object_type: object_type,
                    object_id: object_id,
                    song_id: song_id
                }, function(data) {
                    var song = data;
                    element.removeClass("fa-plus");
                    element.addClass("fa-check");
                    element.addClass("check-added");
                    element.addClass("text-success");

                    var html = '<tr id="row-' + song.id + '">\n' +
                    '                    <td class="td-image">\n' +
                    '                        <div class="play" data-id="' + song.id + '" data-type="song"><img src="' + song.artwork_url + '"></div>\n' +
                    '                    </td>\n' +
                    '                    <td id="track_' + song.id + '" class="editable" title="Click to edit">' + song.title + '</td>\n' +
                    '                    <td>' + song.artists.map(function(artist) {
                        return artist.name
                    }).join(", ") + '</td>\n' +
                    '<td>' + song.album === null ? song.album.title : '' + '</td>' +
                        '<td>' + song.loves + '</td>' +
                        '<td>' + song.plays + '</td>' +
                        '<td>' +
                        '<a class="row-button edit" href="' + admin_path + '/songs/edit/' + song.id + '" data-toggle="tooltip" data-placement="left" title="Edit this song"></a>' +
                        '<a data-id="' + object_id + '" data-song-id="' + song.id + '" class="row-button remove" data-type="' + object_type + '" data-toggle="tooltip" data-placement="left" title="" data-original-title="Remove from ' + object_type + '"></a></td>\n' +
                        '</tr>';
                    $("#song-row").append(html);

                })
            });
        }
    });
    $(document).on("click", ".remove", function() {
        var object_type = $(this).data("type");
        var object_id = $(this).data("id");
        var song_id = $(this).data("song-id");
        $.post(admin_path + '/auth/removeSong', {
            object_type: object_type,
            object_id: object_id,
            song_id: song_id
        }, function(data) {
            if (data.success == true) {
                $("#row-" + song_id).fadeOut();
            }
        });
    });
    $('.suggest-tracks-form').focus(function() {
        return false;
    });
    $('.suggest-tracks-form').keyup(function() {
        if ($(this).val()) {
            $('#suggest-form').submit();
            $(".auto-suggest").show();
        } else {
            $(".auto-suggest").hide();
        }
    })
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            $(".auto-suggest").hide();
        }
    });
    $(document).on("click", "table tbody tr td.editable", function(e) {
        e.stopPropagation();
        var currentEle = $(this);
        var editClass = $(this).attr("id");
        var value = $.trim($(this).html());
        updateVal(currentEle, value, editClass);
    });

    function updateVal(currentEle, value, editClass) {
        $(currentEle).html('<input class="form-control thVal_' + editClass + '" type="text" value="' + value + '" />');
        $(".thVal_" + editClass).focus();
        $(".thVal_" + editClass).click(function(e) {
            e.stopPropagation();
            return false;
        });
        $(".thVal_" + editClass).dblclick(function(e) {
            e.stopPropagation();
            return false;
        });
        $(".thVal_" + editClass).keyup(function(event) {
            if (event.keyCode == 13) {
                var song_id = editClass;
                var songName = $(".thVal_" + editClass).val();
                $.trim($(currentEle).html($(".thVal_" + editClass).val()));
                if (songName != value) {
                    $.post(admin_path + '/songs/edit-title', {
                        action: "edit",
                        id: song_id.replace('track_', ''),
                        title: songName
                    }, function(data) {

                    });
                }
            }
        });
        $(".thVal_" + editClass).blur(function (e) {
            var song_id = editClass;
            var songName = $(".thVal_" + editClass).val();
            $.trim($(currentEle).html($(".thVal_" + editClass).val()));
            if (songName != value) {
                $.post(admin_path +  '/songs/edit-title', {
                    action: "edit",
                    id: song_id.replace('track_', ''),
                    title: songName
                }, function(data) {

                });
            }
            $.trim($(currentEle).html($(".thVal_" + editClass).val()));
            e.stopPropagation();
        });
    }

    $(document).on("click", "table tbody tr td.lang-editable", function(e) {
        e.stopPropagation();
        var el = $(this);
        var value = $.trim(el.html());
        var input = $("<input/>", {
            class: "form-control",
            type: "text"
        });
        el.html(input);
        input.focus().val(value);
        input.click(function(e) {
            e.stopPropagation();
            return false;
        });
        input.dblclick(function(e) {
            e.stopPropagation();
            return false;
        });
        input.keyup(function(event) {
            if (event.keyCode === 13) {
                var locale = el.data('locale'),
                    group = el.data('group'),
                    key = el.data('key'),
                    uri = el.data('uri');
                if (input.val() !== value) {
                    $.post(uri, {
                        locale: locale,
                        group: group,
                        key: key,
                        uri: uri,
                        value: $.trim(input.val())
                    }, function(data) {

                    });
                }
                el.html($.trim(input.val()));
                e.stopPropagation();
            }
        });
        input.blur(function (e) {
            var locale = el.data('locale'),
                group = el.data('group'),
                key = el.data('key'),
                uri = el.data('uri');
            if (input.val() !== value) {
                $.post(uri, {
                    locale: locale,
                    group: group,
                    key: key,
                    uri: uri
                }, function(data) {

                });
            }
            el.html($.trim(input.val()));
            e.stopPropagation();
        });
    });

    function formatRepo(repo) {
        if (repo.loading) return repo.text;
        var text;
        repo.name ? text = repo.name : text = repo.title;
        var markup = "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__avatar'><img src='" + repo.artwork_url + "' /></div>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" + text + "</div></div></div>";
        return markup;
    }

    function formatRepoSelection(repo) {
        var artwork_url;
        if (repo.element && repo.element.dataset && repo.element.dataset.artwork) {
            artwork_url = repo.element.dataset.artwork;
        } else {
            artwork_url = repo.artwork_url;
        }
        var text;
        repo.name ? text = repo.name : text = repo.title;
        if (repo.element && repo.element.label) {
            text = repo.element.label;
        }

        var markup;

        if(artwork_url) {
            markup = "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository__avatar'><img src='" + artwork_url + "' /></div>" +
                "<div class='select2-result-repository__meta'>" +
                "<div class='select2-result-repository__title white'>" + text + "</div></div></div>";
        } else {
            markup = "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository__avatar'></div>" +
                "<div class='select2-result-repository__meta'>" +
                "<div class='select2-result-repository__title white'></div></div></div>";
        }

        return markup || repo.text;
    }

    $(".select-ajax").select2({
        width: '100%',
        theme: "artwork",
        ajax: {
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    q: params.term,
                    page: params.page
                };
            },
            processResults: function(response, params) {
                params.page = params.page || 1;
                return {
                    results: response.data,
                };
            },
            cache: true
        },
        escapeMarkup: function(markup) {
            return markup;
        },
        minimumInputLength: 1,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
    }).addClass("select2-with-artwork");

    $(".multi-selector-without-sortable").select2({
        width: '100%',
        placeholder: 'Select one or multi',
        containerCssClass: "with-ajax",
        ajax: {
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    q: params.term,
                };
            },
            processResults: function(response, params) {
                params.page = params.page || 1;
                return {
                    results: response.data,
                };
            },
            cache: true
        },
        escapeMarkup: function(markup) {
            return markup;
        },
        minimumInputLength: 1,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
    });

    $(".multi-selector").select2({
        width: '100%',
        placeholder: 'Select one or multi',
        containerCssClass: "with-ajax",
        ajax: {
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    q: params.term,
                };
            },
            processResults: function(response, params) {
                params.page = params.page || 1;
                return {
                    results: response.data,
                };
            },
            cache: true
        },
        escapeMarkup: function(markup) {
            return markup;
        },
        minimumInputLength: 1,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
    }).on("select2:select", function(evt) {
        var id = evt.params.data.id;

        var element = $(this).children("option[value=" + id + "]");

        moveElementToEndOfParent(element);

        $(this).trigger("change");
    });
    var ele = $(".multi-selector").parent().find("ul.select2-selection__rendered");
    ele.sortable({
        containment: 'parent',
        update: function() {
            orderSortedValues();
            console.log("" + $(".multi-selector").val())
        }
    });

    function orderSortedValues() {
        var value = ''
        $(".multi-selector").parent().find("ul.select2-selection__rendered").children("li[title]").each(function(i, obj) {

            var element = $(".multi-selector").children('option').filter(function() {
                return $(this).html() == obj.title
            });
            moveElementToEndOfParent(element)
        });
    };

    function moveElementToEndOfParent(element) {
        var parent = element.parent();

        element.detach();

        parent.append(element);
    };
    $(".slide-show-type").select2({
        width: '100%',
        placeholder: 'Select a object type'
    });
    $('.slide-show-type').on("select2:select", function(e) {
        var type = $(this).val();
        $(".slide-show-selector").addClass('d-none');
        //$(".slide-show-selector").find('select').attr('name', 'removed');
        $(".slide-show-selector").find('select').empty();
        $(".slide-show-selector[data-type='" + type + "']").removeClass('d-none');
        //$(".slide-show-selector[data-type='" + type + "']").find('select').attr('name', 'object_ids[]');
    });
    $(".select2-tags").select2({
        width: '100%',
        tags: true,
        placeholder: 'Select or type the tags',
    });
    $('.select_station_type').on("select2:select", function(e) {
        var type = $(this).val();
        if (type == "live") {
            $(".broadcast-link").show();
        } else {
            $(".broadcast-link").hide();
        }
    });
    $(function() {
        $('.use_album_cover').change(function() {
            var song_id = $(this).data('song-id');
            var album_id = $(this).data('album-id');
            var subaction;

            if ($(this).is(':checked') == true) {
                subaction = "add";
            } else {
                subaction = "remove";
            }

            $.post(admin_path +  '/ajax.php?do=songs', {
                action: "albumcover",
                song_id: song_id,
                album_id: album_id,
                subaction: subaction
            }, function(data) {
                //msg_box("success", "Saved!!!")
            });
        })
    });



    $(".html5-file").fileinput({
        maxAjaxThreads: 5,
        processDelay: 100,
        initialPreviewAsData: true,
        theme: 'fas',
        allowedFileExtensions: ["mp3"],
        uploadExtraData: function() {
            return {
                _token: $("input[name='_token']").val(),
            };
        },
    });
    $('.html5-file').on('fileuploaded', function(event, data, previewId, index) {
        if(data.response.success === true) {
            $(".upload-results").removeClass("hide");
            $("#upload-rows").append(data.response.html);
            $("#tr_track_" + data.response.song.id).animate({
                backgroundColor: '#ffe58f'
            }, 'slow');
            setTimeout(function() {
                $("#tr_track_" + data.response.song.id).css("background", "none");
            }, 1500)
        }

    });
    $(".datepicker").datepicker();

    $('.datetimepicker').datetimepicker({
        mask: 'Immediately',
        timepicker: true,
    });
    $('.datetimepicker-no-mask').datetimepicker({
        timepicker: true,
    });
    $('.datetimepicker-with-form').datetimepicker({
        timepicker: true,
    });
    $('.datepicker-no-mask').datetimepicker({
        timepicker: false,
    });
    $('.time-select-handle').click(function() {
        $('.datetimepicker').datetimepicker('show');
    });


    $(".table-sortable tbody").sortable({
        handle: '.handle',
        helper: function(e, tr) {
            var helper = $("<span />");
            helper.addClass('engine-ui-sortable-helper');
            helper.css({'width': 'auto', 'height': 'auto'});
            helper.html('Moving item');
            return helper;

        },
    });

    $(document).on('click', '.browse', function() {
        var file = $(this).parent().parent().parent().find('.file-selector');
        file.trigger('click');
    });
    $(document).on('change', '.file-selector', function() {
        $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
    });
    $('.money').mask("###0.00", {reverse: true});
    $('.number').mask("#,##0", {reverse: true});
    $('.post-set-featured-image').on('click', function () {

    });

    function select2WithALlFunction(){
        $('.select2-active').select2({
            placeholder: 'Please select',
            allowClear: false,
            closeOnSelect: true,
        }).on('select2:open', function() {
            var a = $(this).next();
            var b = $(this);
            setTimeout(function() {
                var c = $('.select2-container').find('.select2-results__group');
                c.unbind();
                c.bind( "click", function() {
                    selectAlllickHandler(a, b, c)
                });
            }, 100);
        });
    }
    select2WithALlFunction();
    var selectAlllickHandler = function(a, b, c) {
        console.log('Select2 just has done select all');
        c.unbind();
        b.select2('destroy').find('option').prop('selected', 'selected').end();
        select2WithALlFunction();
    };
    $("#check-all").click(function () {
        $("#mass-action-form [type='checkbox']").prop('checked', $(this).prop('checked'));
    });

    $('#start-mass-action').on('click', function(event) {
        event.preventDefault();
        if($("[name='ids\\[\\]']:checked").length === 0) {
            bootbox.alert({
                title: "Alert",
                message: "Please select an item.",
                centerVertical: true,
                callback: function (result) {
                }
            });
            return false;
        }
        var form = $('#mass-action-form');
        var action = form.find('[name="action"]').val();
        if(!action) {
            bootbox.alert({
                title: "Alert",
                message: "Please select action.",
                centerVertical: true,
                callback: function (result) {
                }
            });
            return false;
        }
        if(action === 'approve') {
            bootbox.confirm({
                title: "Select the songs publishing?",
                message: "Are you sure you want to publish selected ("  + $("[name='ids\\[\\]']:checked").length + ") item?",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        form.submit();
                    }
                }
            });
        } else if(action === 'not_approve') {
            bootbox.confirm({
                title: "Select the songs publishing?",
                message: "Are you sure you want to send for the moderation selected ("  + $("[name='ids\\[\\]']:checked").length + ") item?",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        form.submit();
                    }
                }
            });
        } else if(action === 'comment') {
            bootbox.confirm({
                title: "Configure the comments",
                message: "Are you sure you want to enable comments for the selected ("  + $("[name='ids\\[\\]']:checked").length + ") item?",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        form.submit();
                    }
                }
            });
        } else if(action === 'not_comments') {
            bootbox.confirm({
                title: "Configure the comments",
                message: "Are you sure you want to disable comments for the selected ("  + $("[name='ids\\[\\]']:checked").length + ") item?",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        form.submit();
                    }
                }
            });
        } else if(action === 'clear_count' || action === 'clear_view') {
            bootbox.confirm({
                title: "Clearing the views counter",
                message: "Are you sure you want to clear the counter of the selected ("  + $("[name='ids\\[\\]']:checked").length + ") item?",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        form.submit();
                    }
                }
            });
        } else if(action === 'delete') {
            bootbox.confirm({
                title: "Remove",
                message: "Are you sure you want to remove the selected ("  + $("[name='ids\\[\\]']:checked").length + ") item?",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        form.submit();
                    }
                }
            });
        } else if(action === 'remove_from_album') {
            bootbox.confirm({
                title: "Remove from album",
                message: "Are you sure you want to remove the selected ("  + $("[name='ids\\[\\]']:checked").length + ") from the album?",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        form.submit();
                    }
                }
            });
        }  else if(action === 'remove_from_playlist') {
            bootbox.confirm({
                title: "Remove from playlist",
                message: "Are you sure you want to remove the selected ("  + $("[name='ids\\[\\]']:checked").length + ") from the playlist?",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        form.submit();
                    }
                }
            });
        } else if(action === 'delete_comment') {
            bootbox.confirm({
                title: "Remove",
                message: "Are you sure you want to remove all the comments by selected ("  + $("[name='ids\\[\\]']:checked").length + ") users?",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        form.submit();
                    }
                }
            });
        } else if(action === 'fixed') {
            bootbox.confirm({
                title: "Remove",
                message: "Are you sure you want to fixed the selected ("  + $("[name='ids\\[\\]']:checked").length + ") articles?",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        form.submit();
                    }
                }
            });
        } else if(action === 'not_fixed') {
            bootbox.confirm({
                title: "Remove",
                message: "Are you sure you want to un fixed the selected ("  + $("[name='ids\\[\\]']:checked").length + ") articles?",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        form.submit();
                    }
                }
            });
        } else if(action === 'set_current') {
            bootbox.confirm({
                title: "Remove",
                message: "Are you sure you want to set current time for the selected ("  + $("[name='ids\\[\\]']:checked").length + ") articles?",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        form.submit();
                    }
                }
            });
        } else if(action === 'change_author') {
            bootbox.confirm({
                title: "Remove",
                message: "Are you sure you want to set new author for the selected ("  + $("[name='ids\\[\\]']:checked").length + ") item?",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        form.submit();
                    }
                }
            });
        } else {
            form.submit();
        }
    });
    $('[data-toggle="tooltip"]').tooltip();
    $(".search-form").submit(function(){
        $("input,select").each(function(index, obj){
            if($(obj).val() === "") {
                $(obj).attr('disabled', 'disabled');
            }
        });
    });
    $('.post-fullscreen').on('click', function(){
        $('.article-form').toggleClass('fullscreen');
    });

    $('.filter-country-select').on('change', function () {
        var country_code = $(this).val();
        if(country_code) {
            $.post(admin_path + '/stations/city-by-country-code', {
                countryCode: country_code,
            }, function(data) {
                $('.filter-city').removeClass('d-none').html(data);
                $('.filter-city-select').removeClass('d-none').html(data);
                select2WithALlFunction();
            });

            $.post(admin_path +  '/stations/language-by-country-code', {
                countryCode: country_code,
            }, function(data) {
                $('.filter-language').removeClass('d-none');
                $('.filter-language-select').html(data);
                select2WithALlFunction();
            });
        }
    });




    /* API TESTER */
    // create the editor

    try {
        var contentEditor = new JSONEditor(document.getElementById('jsonEditorContent'), {mode: 'view'});
        var responseHeadersEditor = new JSONEditor(document.getElementById('jsonEditorResponseHeaders'), {mode: 'view'});
        var jsonEditorRequestHeaders = new JSONEditor(document.getElementById('jsonEditorRequestHeaders'), {mode: 'view'});
        var timer;
        $('.filter-routes').on('keyup', function () {
            var _this = this;
            clearTimeout(timer);
            timer = setTimeout(function () {
                var search = $(_this).val();
                var regex = new RegExp(search);
                $('ul.routes li').each(function () {
                    if (!regex.test($(this).data('uri'))) {
                        $(this).addClass('d-none');
                    } else {
                        $(this).removeClass('d-none');
                    }
                });
            }, 300);
        });
        $('.route-item a, .route-item button').click(function () {
            var li = $(this).parent('li');
            $('a.method').html(li.data('method')).removeClass(function (index, className) {
                return (className.match(/bg-[^\s]+/) || []).join(' ');
            }).css('background', li.data('method-color'));
            $('.uri').val(li.data('uri'));
            $('input.method').val(li.data('method'));
            $('.param').remove();
            $('.response-tabs').addClass('hide');
            appendParameters(li.data('parameters'));
            $(window).scrollTop(0);
        });
        function getParamCount() {
            return $('.param').length;
        }
        function appendParameters(params) {
            for (var param in params) {
                var html = $('template.param-tpl').html();
                html = html.replace(new RegExp('__index__', 'g'), getParamCount());
                var append = $(html);
                append.find('.param-key').val(params[param].name);
                append.find('.param-val').val(params[param].defaultValue);
                append.find('.param-desc').removeClass('d-none').find('.text').html(params[param].description);
                if (params[param].required == 'true') {
                    append.find('.param-desc .param-required').removeClass('d-none');
                }
                if (params[param].type == 'file') {
                    append.find('.param-val').attr('type', 'file');
                    append.find('.change-val-type i').toggleClass("fa-upload fa-pen");
                }
                $('.param-add').before(append);
            }
        }
        $('.params').on('click', '.change-val-type', function () {
            var type = $(this).parent().prev().attr('type') == 'text' ? 'file' : 'text';
            $(this).parent().prev().attr('type', type);
            $("i", this).toggleClass("fa-upload fa-pen");
        }).on('click', '.param-remove', function () {
            $(this).closest('.param').remove();
        });
        $('.param-add').on('focus', 'input', function () {
            var html = $('template.param-tpl').html();
            html = html.replace(new RegExp('__index__', 'g'), $('.param').length);
            $(this).closest('.param-add').before(html);
            $('.params .param').last().find('input:first').focus()
        });
        $('.api-tester-form').on('submit', function (event) {
            event.preventDefault();
            var formData = new FormData(this);
            if (formData.get('uri').length === 0) {
                return false;
            }
            console.log(formData);

            $.ajax({
                method: 'POST',
                url: api_tester_handle,
                data: formData,
                success: function (data) {
                    if (typeof data === 'object') {
                        if (data.status) {
                            $('#response').removeClass('d-none');
                            $('#error').addClass('d-none');
                            if(data.data.original.contentType === 'application/json') {
                                contentEditor.set(JSON.parse(data.data.original.content));
                                responseHeadersEditor.set(data.data.original.response_headers);
                                jsonEditorRequestHeaders.set(Object.assign(data.request_headers, {'Post Data': data['post_data']}));
                            } else {
                                $('#response').addClass('d-none');
                                $('#error').removeClass('d-none');
                            }
                        } else {
                            alert('failed');
                        }
                    }
                },
                error: function(){
                    $('#response').addClass('d-none');
                    $('#error').removeClass('d-none');
                },
                cache: false,
                contentType: false,
                processData: false
            });
        });
    } catch(e) {

    }
})(jQuery);


/* Artisan */
$(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    var storageKey = function () {
        var connection = $('#connections').val();
        return 'la-'+connection+'-history'
    };
    function History () {
        this.index = this.count() - 1;
    }

    History.prototype.store = function () {
        var history = localStorage.getItem(storageKey());
        if (!history) {
            history = [];
        } else {
            history = JSON.parse(history);
        }
        return history;
    };

    History.prototype.push = function (record) {
        var history = this.store();
        history.push(record);
        localStorage.setItem(storageKey(), JSON.stringify(history));

        this.index = this.count() - 1;
    };

    History.prototype.count = function () {
        return this.store().length;
    };

    History.prototype.up = function () {
        if (this.index > 0) {
            this.index--;
        }

        return this.store()[this.index];
    };

    History.prototype.down = function () {
        if (this.index < this.count() - 1) {
            this.index++;
        }

        return this.store()[this.index];
    };
    History.prototype.clear = function () {
        localStorage.removeItem(storageKey());
    };
    var history = new History;
    var isRunning = false;
    var send = function () {
        if(isRunning) return false;
        isRunning = true;
        var $input = $('#terminal-query');
        $.ajax({
            url:location.pathname,
            method: 'post',
            data: {
                c: $input.val(),
            },
            success: function (response) {
                history.push($input.val());
                $('#terminal-box')
                    .append('<div class="item"><small class="label label-default"> > artisan '+$input.val()+'<\/small><\/div>')
                    .append('<div class="item">'+response+'<\/div>');
                $(".output-body").animate({ scrollTop: $('.output-body').prop("scrollHeight")}, 1000);
                $input.val('');
                isRunning = false;
            }
        });
    };

    $('#terminal-query').on('keyup', function (e) {

        e.preventDefault();

        if (e.keyCode === 13) {
            send();
        }

        if (e.keyCode === 38) {
            $(this).val(history.up());
        }

        if (e.keyCode === 40) {
            $(this).val(history.down());
        }
    });

    $('#terminal-clear').click(function () {
        $('#terminal-box').text('');
    });

    $('.loaded-command').click(function () {
        $('#terminal-query').val($(this).html() + ' ');
        $('#terminal-query').focus();
    });

    $('#terminal-send').click(function () {
        send();
    });


    /* scheduling */
    $('.run-task').click(function (e) {
        var id = $(this).data('id');
        $.ajax({
            method: 'POST',
            url: scheduling_run_url,
            data: {
                id: id,
            },
            success: function (data) {
                if (typeof data === 'object') {
                    $('.output-box').removeClass('d-none');
                    $('.output-body').html(data.data);
                }
            }
        });
    });

    /*nested category */
    $('.dd').nestable();
    $('.dd').on('change', function () {
        var $this = $(this);
        var serializedData = window.JSON.stringify($($this).nestable('serialize'));
        $('#cartSortList').val(serializedData);
    });

    /* backup */

    $(".backup-run").click(function() {
        var $btn = $(this);
        $btn.button('loading');
        $.ajax({
            url: $btn.attr('href'),
            method: 'POST',
            success: function (data){
                $('.output-box').removeClass('d-none');
                $('.loading-box').addClass('d-none');

                $('.output-body').html(data.message)
                $btn.removeAttr('disabled');
            }
        });
        $('.loading-box').removeClass('d-none');
        $btn.attr('disabled', 'disabled');
        return false;
    });
    $(".backup-delete").click(function() {
        var $btn = $(this);
        $.ajax({
            url: $btn.attr('href'),
            method: 'DELETE',
            success: function (data){
                location.reload();
                $btn.button('reset');
            }
        });
        return false;
    });

    /* post and tiny mce */

    $(document).on("click", "#featured-image .set", function() {
        $('#artwork_picker').trigger('click');
    });
    $("#artwork_picker").change(function(){
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#artwork_url').attr('src', e.target.result);
            }
            reader.readAsDataURL(this.files[0]);
            $('#featured-image').find('.set').addClass('d-none')
            $('#artwork_url').removeClass('d-none');
            $('.post-remove-featured-image').removeClass('d-none');
            $('#remove_artwork').val(0);
        }
    });
    $(document).on("click", ".post-remove-featured-image", function() {
        $('#featured-image').find('.set').removeClass('d-none')
        $('#artwork_url').addClass('d-none');
        $('.post-remove-featured-image').addClass('d-none');
        $('#artwork_picker').val('');
        $('#remove_artwork').val(1);
    });

    $(document).on("click", ".btn-upload-select", function() {
        $('.file-upload').trigger('click');
    });
    $(document).on("change", ".file-upload-form", function() {
        $('.file-upload-form').submit();
    });

    $(document).ready(function () {
        if($('textarea.post.editor').length) {
            var editor = $('textarea.post.editor').first();
            var filemanagerPluginPath = editor.attr('data-filemanager-plugin-path');
            var responsiveFilemanagerPluginPath= editor.attr('data-responsive-filemanager-plugin-path');
            var externalFilemanagerPath = editor.attr('data-external-filemanager-path');
            tinymce.init({
                selector: 'textarea.post.editor',
                skin: darkMode ? "oxide-dark" : "oxide",
                content_css: darkMode ? "dark" : "default",
                height: 500,
                convert_urls: false,
                relative_urls : false,
                remove_script_host : false,
                plugins: [
                    'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                    'searchreplace wordcount visualblocks visualchars code fullscreen',
                    'insertdatetime media nonbreaking save table contextmenu directionality',
                    'emoticons template textcolor colorpicker textpattern imagetools codesample toc filemanager responsivefilemanager'
                ],
                toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
                toolbar2: 'responsivefilemanager image media link | forecolor backcolor emoticons | codesample | hiddenBlockInsertButton | spintax',
                image_advtab: true,
                toolbar3: '',
                setup: function (editor) {
                    editor.ui.registry.addButton('hiddenBlockInsertButton', {
                        text: 'Hidden Block',
                        onAction: function (_) {
                            if (editor.selection.getContent().length) {
                                editor.selection.setContent('[hide]' + editor.selection.getContent() + '[/hide]');
                            }
                        }
                    });
                    editor.ui.registry.addButton('spintax', {
                        text: 'Spintax',
                        onAction: function (_) {
                            editor.focus();
                            if (editor.selection.getContent().length) {
                                editor.selection.setContent('<mark>' + editor.selection.getContent() + '</mark>');
                            }
                        }
                    });
                    editor.on('init change', function () {
                        editor.save();
                    });
                },
                external_filemanager_path: externalFilemanagerPath,
                filemanager_title: "File manager",
                external_plugins: {
                    "responsivefilemanager": responsiveFilemanagerPluginPath,
                    "filemanager": filemanagerPluginPath

                },
            });
        }

        if($('textarea.default.editor').length) {
            tinymce.init({
                selector: 'textarea.default.editor',
                skin: darkMode ? "oxide-dark" : "oxide",
                content_css: darkMode ? "dark" : "default",
                height: 500,
                convert_urls: false,
                relative_urls : false,
                remove_script_host : false,
                plugins: [
                    'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                    'searchreplace wordcount visualblocks visualchars code fullscreen',
                    'insertdatetime media nonbreaking save table contextmenu directionality',
                    'emoticons template textcolor colorpicker textpattern imagetools codesample toc'
                ],
                toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
                toolbar2: 'link | forecolor backcolor emoticons | codesample',
                image_advtab: true,
                toolbar3: '',
            });
        }
    });

    /* dashboard chart */

    if($('#revenueSources').length) {

        var ctx = document.getElementById("revenueSources");
        var revenueSources = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: revenueSourcesLabel,
                datasets: [{
                    data: revenueSourcesLabelData,
                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                    hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    caretPadding: 10,
                },
                legend: {
                    display: true,
                    position: 'bottom',
                },
                cutoutPercentage: 0
            },
        });
    }

    if($('#subscriptionOverviewChart').length) {
        var ctx = document.getElementById("subscriptionOverviewChart");
        var subscriptionOverviewChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: subscriptionOverviewChartLabel,
                datasets: [{
                    label: "Earnings",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: subscriptionOverviewChartData,
                }],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        time: {
                            unit: 'date'
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                return currencyLabel + number_format(value);
                            }
                        },
                        gridLines: {
                            color: "rgb(234, 236, 244)",
                            zeroLineColor: "rgb(234, 236, 244)",
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }],
                },
                legend: {
                    display: false
                },
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    intersect: false,
                    mode: 'index',
                    caretPadding: 10,
                    callbacks: {
                        label: function (tooltipItem, chart) {
                            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + currencyLabel + number_format(tooltipItem.yLabel);
                        }
                    }
                }
            }
        });
    }

    $(document).ready(function () {
        if($('#fileupload').length) {
            $('#fileupload').each(function () {
                var uri = $(this).attr('action');
                $(this).fileupload({
                    url: uri,
                    maxNumberOfFiles: 1,
                    limitMultiFileUploads: 1000,
                    limitConcurrentUploads: 1
                });
            })

        }
    });

    /* Media Manager */
    $(document).ready(function () {
        if ($('.media-manager').length) {
            var delete_uri = $('.media-manager').attr('data-delete-uri');
            var move_uri = $('.media-manager').attr('data-move-uri');
            var new_folder_uri = $('.media-manager').attr('data-new-folder-uri');
            var index_uri = $('.media-manager').attr('data-index-uri');

            /** diable pjax cache */
            $.pjax.defaults.maxCacheLength = 0;

            /** Create iCheck event */
            function reinventEvent() {
                $('.file-select input').iCheck({
                    checkboxClass: 'icheckbox_square-blue',
                    radioClass: 'iradio_square-blue'
                }).on('ifChanged', function () {
                    if (this.checked) {
                        $(this).closest('tr').css('background-color', '#ffffd5');
                    } else {
                        $(this).closest('tr').css('background-color', '');
                    }
                });
                $('.file-select-all input').iCheck({
                    checkboxClass: 'icheckbox_square-blue',
                    radioClass: 'iradio_square-blue'
                }).on('ifChanged', function () {
                    if (this.checked) {
                        $('.file-select input').iCheck('check');
                    } else {
                        $('.file-select input').iCheck('uncheck');
                    }
                });

                $('table>tbody>tr').mouseover(function () {
                    $(this).find('.btn-group').removeClass('hide');
                }).mouseout(function () {
                    $(this).find('.btn-group').addClass('hide');
                });
                $('#moveModal').on('show.bs.modal', function (event) {
                    var button = $(event.relatedTarget);
                    var name = button.data('name');
                    var modal = $(this);
                    modal.find('[name=path]').val(name)
                    modal.find('[name=new]').val(name)
                });
                $('#urlModal').on('show.bs.modal', function (event) {
                    var button = $(event.relatedTarget);
                    var url = button.data('url');
                    $(this).find('input').val(url)
                });
                $('.datatables').DataTable({
                    "order": [[4, "desc"]],
                    "columnDefs": [
                        {
                            "targets": 'no-sort',
                            "orderable": false,
                        },
                        {
                            'orderData': [5],
                            'targets': [4]
                        },
                        {
                            'targets': [5],
                            'visible': false,
                            'searchable': false
                        },
                        {
                            'orderData': [7],
                            'targets': [6]
                        },
                        {
                            'targets': [7],
                            'visible': false,
                            'searchable': false
                        }]
                });
            };
            $(function () {
                $(document).on("click", ".file-delete", function () {
                    var path = $(this).data('path');
                    var r = confirm("Are you sure to delete?");
                    if (r == true) {
                        $.ajax({
                            method: 'delete',
                            url: delete_uri,
                            data: {
                                'files[]': [path],
                            },
                            success: function (data) {
                                $.pjax.reload('#pjax-container');
                            }
                        });
                    }
                });
                $(document).on("submit", "#file-move", function () {
                    event.preventDefault();
                    var form = $(this);
                    var path = form.find('[name=path]').val();
                    var name = form.find('[name=new]').val();
                    $.ajax({
                        method: 'put',
                        url: move_uri,
                        data: {
                            path: path,
                            'new': name,
                        },
                        success: function (data) {
                            $.pjax.reload('#pjax-container');
                            if (typeof data === 'object') {
                                if (data.status) {
                                } else {
                                }
                            }
                        }
                    });
                    closeModal();
                });

                $(document).on("change", ".file-upload-form", function () {
                    $('.file-upload-form').submit();
                });


                $(document).on("submit", ".file-upload-form", function (e) {
                    e.preventDefault();
                    var formData = new FormData(this);
                    $.ajax({
                        type: 'POST',
                        url: $(this).attr('action'),
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function () {
                            $.pjax.reload('#pjax-container');
                        },
                        error: function (data) {
                            console.log("error");
                            console.log(data);
                        }
                    });
                });

                $(document).on("change", "#ImageBrowse", function () {
                    $("#imageUploadForm").submit();

                });
                $(document).on("submit", "#new-folder", function () {
                    event.preventDefault();
                    var formData = new FormData(this);
                    $.ajax({
                        method: 'POST',
                        url: new_folder_uri,
                        data: formData,
                        success: function (data) {
                            $.pjax.reload('#pjax-container');
                            if (typeof data === 'object') {
                                if (data.status) {
                                } else {
                                }
                            }
                        },
                        cache: false,
                        contentType: false,
                        processData: false
                    });
                    closeModal();
                });

                function closeModal() {
                    $("#moveModal").modal('toggle');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                }

                $(document).on("click", ".btn-upload-select", function () {
                    $('.file-upload').trigger('click');
                });

                $(document).on("click", ".media-reload", function () {
                    $.pjax.reload('#pjax-container');
                });
                $(document).on("click", ".goto-url button", function () {
                    var path = $('.goto-url input').val();
                    $.pjax({container: '#pjax-container', url: index_uri + '?path=' + path});
                });

                $('.goto-url button').click(function () {

                });
                $(document).on("ifChanged", ".files-select-all", function () {
                    if (this.checked) {
                        $('.grid-row-checkbox').iCheck('check');
                    } else {
                        $('.grid-row-checkbox').iCheck('uncheck');
                    }
                });

                $(document).on("click", ".file-delete-multiple", function () {
                    var files = $(".file-select input:checked").map(function () {
                        return $(this).val();
                    }).toArray();
                    if (!files.length) {
                        return;
                    }
                    var r = confirm("Are you sure to delete?");
                    if (r == true) {
                        $.ajax({
                            method: 'delete',
                            url: delete_uri,
                            data: {
                                'files[]': files,
                            },
                            success: function (data) {
                                $.pjax.reload('#pjax-container');
                            }
                        });
                    }
                });
                $(document).on('ready pjax:end', function () {
                    reinventEvent();
                });
                reinventEvent();
            });
        }
    });

    /* universal report */

    function animateValue(obj, start = 0, end = null, duration = 2000) {
        if (obj) {

            // save starting text for later (and as a fallback text if JS not running and/or google)
            var textStarting = obj.innerHTML;

            // remove non-numeric from starting text if not specified
            end = end || parseInt(textStarting.replace(/\D/g, ""));

            var range = end - start;

            // no timer shorter than 50ms (not really visible any way)
            var minTimer = 50;

            // calc step time to show all interediate values
            var stepTime = Math.abs(Math.floor(duration / range));

            // never go below minTimer
            stepTime = Math.max(stepTime, minTimer);

            // get current time and calculate desired end time
            var startTime = new Date().getTime();
            var endTime = startTime + duration;
            var timer;

            function run() {
                var now = new Date().getTime();
                var remaining = Math.max((endTime - now) / duration, 0);
                var value = Math.round(end - (remaining * range));
                // replace numeric digits only in the original string
                obj.innerHTML = textStarting.replace(/([0-9]+)/g, value);
                if (value == end) {
                    clearInterval(stepTime);
                }
            }

            timer = setInterval(run, stepTime);
            run();
        }
    }

    // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';
    var color = Chart.helpers.color;
    window.chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };

    function number_format(number, decimals, dec_point, thousands_sep) {
        number = (number + '').replace(',', '').replace(' ', '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    $(document).ready(function () {
        if ($('.universal-report').length) {
            animateValue(document.getElementById('increase-number-1'));
            animateValue(document.getElementById('increase-number-2'));
            animateValue(document.getElementById('increase-number-3'));
            animateValue(document.getElementById('increase-number-4'));
            animateValue(document.getElementById('increase-number-5'));
            animateValue(document.getElementById('increase-number-6'));

            //Pie chart

            var ctx = document.getElementById("RevenueSourcesChart");
            var RevenueSourcesChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: RevenueSourcesChartDataLabel,
                    datasets: [{
                        data: RevenueSourcesChartData,
                        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                        hoverBorderColor: "rgba(234, 236, 244, 1)",
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        backgroundColor: "rgb(255,255,255)",
                        bodyFontColor: "#858796",
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        caretPadding: 10,
                    },
                    legend: {
                        display: true
                    },
                    cutoutPercentage: 0
                },
            });
            var ctx = document.getElementById("PaymentMethodChart");
            var PaymentMethodChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Paypal', 'Stripe'],
                    datasets: [{
                        data: PaymentMethodChartData,
                        backgroundColor: ['#43b9cb', '#5a5c68'],
                        hoverBackgroundColor: ['#2e59d9', '#17a673'],
                        hoverBorderColor: "rgba(234, 236, 244, 1)",
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        backgroundColor: "rgb(255,255,255)",
                        bodyFontColor: "#858796",
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        caretPadding: 10,
                    },
                    legend: {
                        display: true
                    },
                    cutoutPercentage: 0
                },
            });
            var ctx = document.getElementById("EarningsReportsChart");
            var myLineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: EarningsReportsLabel,
                    datasets: [{
                        label: "Earnings",
                        lineTension: 0.3,
                        backgroundColor: "rgba(78, 115, 223, 0.05)",
                        borderColor: "rgba(78, 115, 223, 1)",
                        pointRadius: 3,
                        pointBackgroundColor: "rgba(78, 115, 223, 1)",
                        pointBorderColor: "rgba(78, 115, 223, 1)",
                        pointHoverRadius: 3,
                        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                        pointHitRadius: 10,
                        pointBorderWidth: 2,
                        data: EarningsReportsData,
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            left: 10,
                            right: 25,
                            top: 25,
                            bottom: 0
                        }
                    },
                    scales: {
                        xAxes: [{
                            time: {
                                unit: 'date'
                            },
                            gridLines: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                maxTicksLimit: 7
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                maxTicksLimit: 5,
                                padding: 10,
                                // Include a dollar sign in the ticks
                                callback: function (value, index, values) {
                                    return currencyLabel  + number_format(value);
                                }
                            },
                            gridLines: {
                                color: "rgb(234, 236, 244)",
                                zeroLineColor: "rgb(234, 236, 244)",
                                drawBorder: false,
                                borderDash: [2],
                                zeroLineBorderDash: [2]
                            }
                        }],
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        backgroundColor: "rgb(255,255,255)",
                        bodyFontColor: "#858796",
                        titleMarginBottom: 10,
                        titleFontColor: '#6e707e',
                        titleFontSize: 14,
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        intersect: false,
                        mode: 'index',
                        caretPadding: 10,
                        callbacks: {
                            label: function (tooltipItem, chart) {
                                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                                return datasetLabel + currencyLabel + number_format(tooltipItem.yLabel);
                            }
                        }
                    }
                }
            });
            var ctx = document.getElementById('MonthlyEarningsChart').getContext('2d');
            window.myBar = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: MonthlyEarningsChartLabel,
                    datasets: [{
                        label: 'Earnings',
                        backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                        borderColor: window.chartColors.red,
                        borderWidth: 1,
                        data: MonthlyEarningsChartEarningData,
                    },{
                        label: 'Orders',
                        backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
                        borderColor: window.chartColors.green,
                        borderWidth: 1,
                        data: MonthlyEarningsChartOrdersData,
                    }]

                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: false,
                    },
                    title: {
                        display: false,
                    }
                }
            });
        }
    });
    $(document).on('click', ('[data-action="mark-paid"]'), function () {
        var el = $(this);
        $.ajax({
            method: 'post',
            url: window.location,
            data: {
                action: el.attr('data-init') ? 'unPaid' : 'markPaid',
                id: el.attr('data-id')
            },
            success: function (data) {
                if(el.attr('data-init')) {
                    el.html('Mark as Paid').addClass('btn-secondary').removeClass('btn-success').removeAttr('data-init', true);
                } else {
                    el.html('Paid').removeClass('btn-secondary').addClass('btn-success').attr('data-init', true);
                }
            }
        });
    });
    $(document).on('click', '[data-action="decline-request"]', function () {
        var el = $(this);
        bootbox.confirm({
            title: "Decline Payment Request?",
            message: "This action will cancel the request and return the request's amount to user's balance. Do you want to process?",
            centerVertical: true,
            callback: function (result) {
                if(result) {
                    $.ajax({
                        method: 'post',
                        url: window.location,
                        data: {
                            action: 'decline',
                            id: el.attr('data-id')
                        },
                        success: function (data) {
                            el.parents('tr').remove();
                        }
                    });
                }
            }
        });
    });


    $(document).on('click', '[data-action="approve-comment"]', function () {
        var el = $(this);
        $.ajax({
            method: 'post',
            url: el.attr('data-approve-uri'),
            data: {
                id: el.attr('data-id')
            },
            success: function (data) {
                $('#comment_' + el.attr('data-id')).fadeOut(500);
            }
        });
    });
});