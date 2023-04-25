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

    window.Artist = {
        chartReady: false,
        select2Ready: false,
        form: $("#upload-song-form"),
        editSongForm: $("#edit-song-form"),
        editEpisodeForm: $("#edit-episode-form"),
        file: $("#uploadFile"),
        lightbox: $(".lightbox-uploadSong"),
        editSongSaveBtn: $("#edit-song-save-btn"),
        genreSelection: $("#genre-selection"),
        moodSelection: $("#mood-selection"),
        albumSongsSelection: $("#album-songs-selection"),
        albumGenreSelection: $("#album-genre-selection"),
        albumMoodSelection: $("#album-mood-selection"),
        createAlbumForm: $("#create-album-form"),
        editAlbumForm: $("#edit-album-form"),
        podcastCategories: [],
        countries: [],
        init: function () {

        },
        withdraw: function(){
            var max = parseInt($(this).data('max'));
            var min = parseInt($(this).data('min'));
            
            if(max < min) {
                Toast.show('failed', null, Language.text.TOOLTIP_WITHDRAW_FAILED);
                return false;
            }

            bootbox.prompt({
                title: 'Submit a payment request',
                message: '<h2 class="text-center mb-3">Amount</h2>',
                inputType: 'number',
                centerVertical: true,
                min: min,
                max: max,
                step: 1,
                value: max,
                callback: function (amount) {
                    if(amount) {
                        $.ajax({
                            url: route.route('frontend.auth.user.artist.withdraw'),
                            data: {
                                amount: amount,
                            },
                            type: "post",
                            success: function (response) {
                                Toast.show('success', 'Your request has been submitted! You will receive an email once it has been approved.');
                                $(window).trigger({
                                    type: "engineReloadCurrentPage"
                                });
                            },
                            error: function (jqXHR) {
                                var serverMsg = JSON.parse(jqXHR.responseText);
                                Toast.show('failed', serverMsg.errors[Object.keys(serverMsg.errors)[0]][0]);
                            }
                        });
                    }
                }
            });
        },
        upload: {
            chart: {
                config: {
                    // The type of chart we want to create
                    type: 'line',

                    // The data for our dataset
                    data: {
                        labels: ['time'],
                        datasets: [{
                            label: 'Speed (Kbps)',
                            backgroundColor: '#92bf59',
                            borderColor: '#729943',
                            data: [0]
                        }]
                    },

                    // Configuration options go here
                    options: {
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [{
                                stacked: false,
                                ticks: {
                                    beginAtZero: true,
                                    mirror: false,
                                    suggestedMin: 0,
                                    suggestedMax: 100
                                }
                            }],
                            yAxes: [{
                                stacked: true
                            }]
                        },
                    }
                },
                update: function (time, speed) {
                    //if(Artist.upload.chart.config.data.datasets.length > 30) Artist.upload.chart.config.data.datasets.splice(0, 2)
                    if (Artist.upload.chart.config.data.datasets.length > 0) {
                        if (Artist.upload.chart.config.data.labels.length > 10) Artist.upload.chart.config.data.labels.splice(0, 1);
                        Artist.upload.chart.config.data.labels.push(time);
                        Artist.upload.chart.config.data.datasets.forEach(function (dataset) {
                            if (dataset.data.length > 10) dataset.data.splice(0, 1);
                            dataset.data.push(speed);
                        });
                        if ($('#uploadSpeedChart').length) {
                            window.chart.update();
                        }
                    }
                }
            },
            reinventForm: function () {
                $('#fileupload').fileupload({
                    maxNumberOfFiles: 1,
                    limitMultiFileUploads: 10,
                    limitConcurrentUploads: 1
                    //maxFileSize: 40000
                });

            },
            edit: function (response, $form) {
                __DEV__ && console.log(response);
                $form.parent().fadeOut(500);
                if (response.approved) {
                    Toast.show('success', 'Your song "' + response.title + '" has been published!');
                } else {
                    Toast.show('success', 'Your song has been submitted! You will receive an email once it has been approved.');
                }
            }
        },
        claim: {
            el: $('#claimArtistLightbox'),
            continueButton: $(".lightbox-claimArtist .continue"),
            requestButton: $(".lightbox-claimArtist .submit"),
            finishedButton: $(".lightbox-claimArtist .finished"),
            error: $(".lightbox-claimArtist .error"),
            emailInput: $("#artist-claiming-email"),
            fullNameInput: $("#artist-claiming-fname"),
            phoneInput: $("#artist-claiming-phone"),
            phoneExtInput: $("#artist-claiming-phone-ext"),
            affiliationInput: $("#artist-claiming-affiliation"),
            messageInput: $("#artist-claiming-message"),
            termCheck: $("#accept-terms"),
            init: function (el) {
                $.engineLightBox.hide();
                if (!User.isLogged()) {
                    User.SignIn.show();
                    return false;
                }
                $.engineLightBox.show("lightbox-claimArtist");
                Artist.claim.emailInput.val(User.userInfo.email);
                Artist.claim.fullNameInput.val(User.userInfo.name);

                if (el.data('id')) {
                    var container = $('#window-claim-artist-selector');
                    container.removeClass('hide');
                    var selected = container.find('.window-selector-selected');
                    var artist = window['artist_data_' + el.data('id')];
                    selected.find('.img-container img').attr('src', artist.artwork_url);
                    selected.find('.metadata .title').html(artist.name);
                    container.find('[name="artist_id"]').val(artist.id)
                    container.find('[name="artist_name"]').val(artist.name);
                }
            },
            show: {
                account: function () {
                    $('.lightbox-stage').removeClass('active');
                    $('.lightbox-stage[rel="account"]').addClass('active');
                    $('.claiming-stage').addClass('hide');
                    $('#artist-claiming-stage-account').removeClass('hide');
                    Artist.claim.requestButton.addClass('hide');
                    Artist.claim.el.find('.back').addClass('hide').unbind('click');
                    Artist.claim.continueButton.removeClass('hide');
                },
                information: function () {
                    $('.lightbox-stage').removeClass('active');
                    $('.lightbox-stage[rel="info"]').addClass('active');
                    $('.claiming-stage').addClass('hide');
                    $('#artist-claiming-stage-info').removeClass('hide');
                    Artist.claim.continueButton.addClass('hide');
                    Artist.claim.requestButton.removeClass('hide');
                    Artist.claim.error.addClass('hide');
                    Artist.claim.el.find('.back').removeClass('hide').one('click', Artist.claim.show.account);
                },
                finished: function () {
                    $('.lightbox-stage').removeClass('active');
                    $('.lightbox-stage[rel="done"]').addClass('active');
                    $('.claiming-stage').addClass('hide');
                    $('#artist-claiming-stage-message').removeClass('hide');
                    Artist.claim.continueButton.addClass('hide');
                    Artist.claim.requestButton.addClass('hide');
                    Artist.claim.finishedButton.removeClass('hide');
                    Artist.claim.error.addClass('hide');
                    Artist.claim.el.find('.back').addClass('hide');
                }
            },
            account: function () {
                $.ajax({
                    url: "/auth/user/artistClaim",
                    data: {
                        stage: 'account',
                        email: Artist.claim.emailInput.val(),
                        fullName: Artist.claim.fullNameInput.val()
                    },
                    type: "post",
                    success: function (response) {
                        Artist.claim.show.information();
                        if (response.length) {
                            $.each(response, function (i, item) {
                                if (item.service === 'facebook') {
                                    Artist.claim.el.find('.facebook-icon-container > img').attr('src', item.provider_artwork).removeClass('hide');
                                    Artist.claim.el.find('.facebook-icon-container > .icon').addClass('hide');
                                    Artist.claim.el.find('.facebook .icon-message').html('Connected as ' + item.provider_name);
                                    Artist.claim.el.find('.facebook .btn').addClass('hide');
                                }
                            });
                        }
                    },
                    error: function (jqXHR) {
                        var serverMsg = JSON.parse(jqXHR.responseText);
                        Artist.claim.error.removeClass('hide').html(serverMsg.errors[Object.keys(serverMsg.errors)[0]][0]);
                    }
                });
            },
            search: function (response) {
                var container = $('#window-claim-artist-selector');
                container.removeClass('hide');
                var el = $('.window-selector-selected');
                if (response.data.length) {
                    container.removeClass('hide');
                    var artists = response.data;
                    el.find('.img-container img').attr('src', artists[0].artwork_url);
                    el.find('.metadata .title').html(artists[0].name);
                    container.find('[name="artist_id"]').val(artists[0].id)
                    container.find('[name="artist_name"]').val(artists[0].name);

                    if (artists.length === 1) {
                        container.find('.others').addClass('hide');
                    } else {
                        container.find('.others').removeClass('hide');
                    }

                    for (var i = 0; i < artists.length; i++) {
                        if (i !== 0) {
                            var row = el.find('.module').clone();
                            row.find('.img-container img').attr('src', artists[i].artwork_url);
                            row.find('.metadata .title').html(artists[i].name);
                            row.attr('data-id', artists[i].id)
                            $('.window-selector-others').prepend(row);
                            row.bind('click', function () {
                                el.find('.img-container img').attr('src', $(this).find('.img-container img').attr('src'));
                                el.find('.metadata .title').html($(this).find('.metadata .title').html());
                                container.find('[name="artist_id"]').val($(this).data('id'));
                                container.find('[name="artist_name"]').val($(this).find('.metadata .title').html());
                                container.find('.others').addClass('hide');
                            });
                        }
                    }
                } else {
                    el.find('.img-container img').attr('src', route.route('frontend.homepage') + 'common/default/artist.png');
                    el.find('.metadata .title').html($('#artist-claim-search-form').find('input').val());
                    container.find('.others').addClass('hide');
                    container.find('[name="artist_id"]').val(0)
                    container.find('[name="artist_name"]').val($('#artist-claim-search-form').find('input').val());
                }
            },
            information: function () {
                $.engineLightBox.checkError(Artist.claim.phoneInput, 'artist-claiming-phone');
                $.engineLightBox.checkError(Artist.claim.affiliationInput, 'artist-claiming-affiliation');
                var container = $('#window-claim-artist-selector');

                if (!Artist.claim.termCheck.is(":checked")) {
                    Artist.claim.error.removeClass('hide').html(Language.text.AGREE_ARTIST_TERMS_FAILED);
                    return false;
                }

                var fd = new FormData($("#passport-form")[0]);
                fd.append('stage', 'info');
                fd.append('email', Artist.claim.emailInput.val());
                fd.append('fullName', Artist.claim.fullNameInput.val());
                fd.append('phone',  Artist.claim.phoneInput.val());
                fd.append('ext', Artist.claim.phoneExtInput.val());
                fd.append('affiliation', Artist.claim.affiliationInput.val());
                fd.append('message', Artist.claim.messageInput.val());
                fd.append('artist_id', container.find('[name="artist_id"]').val());
                fd.append('artist_name', container.find('[name="artist_name"]').val());

                $.ajax({
                    url: route.route('frontend.auth.user.artistClaim'),
                    data: fd,
                    type: "post",
                    cache: false,
                    contentType: false,
                    processData: false,
                    beforeSend: function () {
                        Artist.claim.requestButton.attr('disabled', 'disabled').unbind('click');
                    },
                    success: function (response) {
                        if (response.success === true) {
                            Artist.claim.show.finished();
                        }
                    },
                    error: function (jqXHR) {
                        var serverMsg = JSON.parse(jqXHR.responseText);
                        Artist.claim.error.removeClass('hide').html(serverMsg.errors[Object.keys(serverMsg.errors)[0]][0]);
                        Artist.claim.requestButton.removeAttr('disabled').one('click', Artist.claim.information);
                    }
                });
            }
        },
        chart: {
            loadData: function () {
                var a = window.location.href.toString().split(window.location.host)[1];
                var b = a.split("/")[2];
                a = a.split("/")[1];
                if (a !== "artist-management" && a !== "song") return false;
                if (!$(".artist-management-chart").length) return false;
                __DEV__ && console.log("Loading stats chart");
                var url;
                if (a === "song") url = "/artist-management/chart/song/" + b;
                else url = route.route('frontend.auth.user.artist.manager.chart.overview');
                $.ajax({
                    url: url,
                    type: "post",
                    success: function (response) {
                        Artist.chart.buildChart(response.data);
                    }
                });
            },
            buildChart: function (data) {
                window.chartColors = {
                    red: 'rgb(255, 99, 132)',
                    orange: 'rgb(255, 159, 64)',
                    yellow: 'rgb(255, 205, 86)',
                    green: 'rgb(75, 192, 192)',
                    blue: 'rgb(54, 162, 235)',
                    purple: 'rgb(153, 102, 255)',
                    grey: 'rgb(201, 203, 207)'
                };


                $("#artist-management-chart").empty();
                Chart.defaults.global.pointHitDetectionRadius = 1;

                var customTooltips = function (tooltip) {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table></table>';
                        this._chart.canvas.parentNode.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltip.opacity === 0) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltip.yAlign) {
                        tooltipEl.classList.add(tooltip.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltip.body) {
                        var titleLines = tooltip.title || [];
                        var bodyLines = tooltip.body.map(getBody);

                        var innerHtml = '<thead>';

                        titleLines.forEach(function (title) {
                            innerHtml += '<tr><th>' + title + '</th></tr>';
                        });
                        innerHtml += '</thead><tbody>';

                        bodyLines.forEach(function (body, i) {
                            var colors = tooltip.labelColors[i];
                            var style = 'background:' + colors.backgroundColor;
                            style += '; border-color:' + colors.borderColor;
                            style += '; border-width: 2px';
                            var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                            innerHtml += '<tr><td>' + span + body + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    var positionY = this._chart.canvas.offsetTop;
                    var positionX = this._chart.canvas.offsetLeft;

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
                    tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
                };
                var color = Chart.helpers.color;
                var lineChartData = {
                    labels: data.period,
                    datasets: [{
                        label: 'Play',
                        fill: false,
                        data: data.playSong,
                        pointBackgroundColor: window.chartColors.green,
                        borderColor: window.chartColors.green,
                    }, {
                        label: 'Favorite',
                        borderColor: window.chartColors.red,
                        pointBackgroundColor: window.chartColors.red,
                        fill: false,
                        data: data.favoriteSong
                    }, {
                        label: 'Collection',
                        borderColor: window.chartColors.orange,
                        pointBackgroundColor: window.chartColors.orange,
                        fill: true,
                        data: data.collectSong,
                        backgroundColor: window.chartColors.orange.replace(/rgb/i, "rgba").replace(/\)/i, ',0.4)'),
                    }]
                };
                var chartEl = document.getElementById('artistManagerChart');
                window.myLine = new Chart(chartEl, {
                    type: 'line',
                    data: lineChartData,
                    options: {
                        title: {
                            display: false,
                        },
                        tooltips: {
                            enabled: false,
                            mode: 'index',
                            position: 'nearest',
                            custom: customTooltips
                        },
                        responsive: true,
                        legend: {
                            position: 'bottom',
                            fill: true
                        },
                        hover: {
                            mode: 'index'
                        },
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
                                gridLines: {
                                    display: false,
                                    drawBorder: false,
                                    borderDash: [0],
                                },
                            }],
                            yAxes: [{
                                gridLines: {
                                    color: "rgb(234, 236, 244)",
                                    zeroLineColor: "rgb(234, 236, 244)",
                                    drawBorder: false,
                                    borderDash: [0],
                                    zeroLineBorderDash: [2]
                                }
                            }],
                        },
                    }
                });
            }
        },
        loadGenres: function (el, object_type, id) {
            el.find("option").remove();
            $.ajax({
                url: route.route('frontend.homepage') + "artist-management/genres",
                type: "post",
                data: {
                    object_type: object_type,
                    id: id
                },
                success: function (response) {
                    if (response.length) {
                        $.each(response, function (i, item) {
                            el.append($('<option>', {
                                value: item.id,
                                text: item.name,
                                selected: item.selected ? "selected" : ""
                            }));
                        });
                    }
                }
            });
        },
        loadMoods: function (el, object_type, id) {
            el.find("option").remove();
            $.ajax({
                url: route.route('frontend.homepage') + "artist-management/moods",
                type: "post",
                data: {
                    object_type: object_type,
                    id: id
                },
                success: function (response) {
                    if (response.length) {
                        $.each(response, function (i, item) {
                            el.append($('<option>', {
                                value: item.id,
                                text: item.name,
                                selected: item.selected ? "selected" : ""
                            }));
                        });
                    }
                }
            });
        },
        loadCategories: function (el, selected_array, id) {
            el.find("option").remove();
            if(! Artist.podcastCategories.length ) {
                $.ajax({
                    url: route.route('frontend.homepage') + "artist-management/categories",
                    type: "post",
                    data: {
                        id: id
                    },
                    success: function (response) {
                        Artist.podcastCategories = response;
                        if (response.length) {
                            $.each(response, function (i, item) {
                                el.append($('<option>', {
                                    value: item.id,
                                    text: item.name,
                                    selected: selected_array.includes(item.id.toString()) ? "selected" : ""
                                }));
                            });
                        }
                    }
                });
            } else {
                $.each(Artist.podcastCategories, function (i, item) {
                    el.append($('<option>', {
                        value: item.id,
                        text: item.name,
                        selected: selected_array.includes(item.id.toString()) ? "selected" : ""
                    }));
                });
            }
            el.removeClass('s-accessible')
                .removeAttr('data-select2-id')
                .removeAttr('placeholder');
            el.select2({
                width: '100%',
                placeholder: "Please select",
            });
        },
        loadCountries: function (el, code, id) {
            el.find("option").remove();
            if(! Artist.countries.length ) {
                $.ajax({
                    url: route.route('frontend.homepage') + "artist-management/countries",
                    type: "post",
                    data: {
                        id: id
                    },
                    success: function (response) {
                        if (response.length) {
                            Artist.countries = response;
                            el.append('<option disabled selected value></option>');
                            $.each(response, function (i, item) {
                                el.append($('<option>', {
                                    value: item.code,
                                    text: item.name,
                                    selected: item.code === code ? "selected" : ""
                                }));
                            });
                            el.removeClass('select2-hidden-accessible')
                                .removeAttr('data-select2-id')
                                .removeAttr('placeholder');
                            el.select2({
                                width: '100%',
                                placeholder: "Please select",
                            });
                        }
                    }
                });
            } else {
                el.append('<option disabled selected value></option>');
                $.each(Artist.countries, function (i, item) {
                    el.append($('<option>', {
                        value: item.code,
                        text: item.name,
                        selected: item.code === code ? "selected" : ""
                    }));
                });
                el.removeClass('select2-hidden-accessible')
                    .removeAttr('data-select2-id')
                    .removeAttr('placeholder');
                el.select2({
                    width: '100%',
                    placeholder: "Please select",
                });
            }
        },
        loadLanguages: function (el, select_id, code) {
            el.find("option").remove();
            $.ajax({
                url: route.route('frontend.homepage') + "artist-management/languages",
                type: "post",
                data: {
                    country_code: code,
                },
                success: function (response) {
                    if (response.length) {
                        el.append('<option disabled selected value></option>');
                        $.each(response, function (i, item) {
                            el.append($('<option>', {
                                value: item.id,
                                text: item.name,
                                selected: item.id === select_id ? "selected" : ""
                            }));
                        });
                        el.removeClass('select2-hidden-accessible')
                            .removeAttr('data-select2-id')
                            .removeAttr('placeholder');
                        el.select2({
                            width: '100%',
                            placeholder: "Please select",
                        });
                    }
                }
            });
        },
        editSong: function (song) {
            __DEV__ && console.log('Edit song', song);

            $.engineLightBox.show("lightbox-edit-song");
            Artist.editSongForm.find(".title").html(song.title);
            Artist.editSongForm.find("input[name='title']").val(song.title);
            Artist.editSongForm.find("input[name='id']").val(song.id);
            Artist.editSongForm.find(".edit-artwork").attr("data-type", "song").attr("data-id", song.id);
            Artist.editSongForm.find(".img-container img").attr("src", song.artwork_url);
            Artist.editSongForm.find(".img-container img").attr("rel", "artwork-song-" + song.id);
            $.engineUtils.makeSelectOption(Artist.editSongForm.find('select[name=genre\\[\\]]'), User.userInfo.allow_genres);
            $.engineUtils.makeSelectOption(Artist.editSongForm.find('select[name=mood\\[\\]]'), User.userInfo.allow_moods);

            Artist.editSongForm.find('.select2-container').remove();
            Artist.editSongForm.find('.select2')
                .removeClass('select2-hidden-accessible')
                .removeAttr('data-select2-id')
                .removeAttr('placeholder');
            Artist.editSongForm.find('.select2-tags').empty();

            if (song.genre) {
                song.genre.split(',').forEach(function (i) {
                    Artist.editSongForm.find('select[name=genre\\[\\]] option[value="' + i + '"]').attr('selected', 'selected')
                })
            }
            if (song.mood) {
                song.mood.split(',').forEach(function (i) {
                    Artist.editSongForm.find('select[name=mood\\[\\]] option[value="' + i + '"]').attr('selected', 'selected')
                })
            }

            if(song.bpm !== undefined) {
                Artist.editSongForm.find(".bpm-control").removeClass('d-none');
                Artist.editSongForm.find(".attachment-control").removeClass('d-none');
                Artist.editSongForm.find("input[name='bpm']").val(song.bpm);
            }

            if (song.tags && song.tags.length) {
                song.tags.forEach(function (item) {
                    var option = $('<option selected/>');
                    option.attr({value: item.tag}).text(item.tag);
                    Artist.editSongForm.find('select[name=tag\\[\\]]').append(option);
                });
            } else {
                Artist.editSongForm.find('select[name=tag\\[\\]]').empty();
            }

            setTimeout(function () {
                Artist.editSongForm.find('.select2').select2({
                    width: '100%',
                    placeholder: "Please select",
                    maximumSelectionLength: 4
                });
                Artist.editSongForm.find('.select2-tags').select2({
                    width: '100%',
                    tags: true,
                    placeholder: 'Select or type the tags',
                    maximumSelectionLength: 4
                });
            }, 100);

            if (song.copyright) {
                Artist.editSongForm.find('input[name="copyright"]').val(song.copyright);
            }

            if (song.description) {
                Artist.editSongForm.find('textarea[name="description"]').val(song.description);
            }

            if (song.released_at) {
                Artist.editSongForm.find('input[name="released_at"]').val(song.released_at);
            }

            if (song.visibility) {
                Artist.editSongForm.find('input[name="visibility"]').attr('checked', 'checked');
            } else {
                Artist.editSongForm.find('input[name="visibility"]').removeAttr('checked');
            }
            if (song.allow_download) {
                Artist.editSongForm.find('input[name="downloadable"]').attr('checked', 'checked');
            } else {
                Artist.editSongForm.find('input[name="downloadable"]').removeAttr('checked');
            }
            if (song.allow_comments) {
                Artist.editSongForm.find('input[name="comments"]').attr('checked', 'checked');
            } else {
                Artist.editSongForm.find('input[name="comments"]').removeAttr('checked');
            }
            if (song.explicit) {
                Artist.editSongForm.find('input[name="explicit"]').attr('checked', 'checked');
            } else {
                Artist.editSongForm.find('input[name="explicit"]').removeAttr('checked');
            }
            if (song.selling) {
                Artist.editSongForm.find('input[name="selling"]').attr('checked', 'checked');
                Artist.editSongForm.find('input[name="price"]').val(song.price);
                Artist.editSongForm.find('.collapse').collapse('show');
            } else {
                Artist.editSongForm.find('input[name="selling"]').removeAttr('checked');
                Artist.editSongForm.find('.collapse').collapse('hide');
            }

            Artist.editSongSaveBtn.one('click', function () {
                Artist.editSongForm.submit();
            });
            Artist.editSongForm.find('.datepicker').datepicker();
            Artist.editSongForm.find('.edit-artwork-input').change(function () {
                var input = this;
                var url = $(this).val();
                var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
                if (input.files && input.files[0] && (ext === "gif" || ext === "png" || ext === "jpeg" || ext === "jpg")) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        Artist.editSongForm.find('img').attr('src', e.target.result);
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            });
        },
        createAlbum: function () {
            $.engineLightBox.show("lightbox-create-album");
            $('#create-album-form').find('.collapse').collapse('hide');
            Artist.loadGenres($('.lightbox-create-album select[name="genre[]"]'), "album", null);
            Artist.loadMoods($('.lightbox-create-album select[name="mood[]"]'), "album", null);
            $('#create-album-form').find('.datepicker').datepicker();
            $('#create-album-form').ajaxForm({
                beforeSubmit: function (data, $form, options) {
                    var error = 0;
                    Object.keys(data).forEach(function eachKey(key) {
                        if (data[key].required && !data[key].value) {
                            $form.find("[name='" + data[key].name + "']").closest(".control").addClass("field-error");
                            error++;
                        } else if (data[key].required && data[key].value) {
                            $form.find("[name='" + data[key].name + "']").closest(".control").removeClass("field-error");
                        }
                    });
                    if (error) return false;
                    $form.find("[type='submit']").attr("disabled", "disabled");
                },
                success: function (response, textStatus, xhr, $form) {
                    $form.find("[type='submit']").removeAttr("disabled");
                    $form.trigger("reset");
                    $.engineLightBox.hide();
                    if (response.approved) {
                        Toast.show("success", null, Language.text.POPUP_CREATED_ALBUM.replace(':albumLink', Favorite.objectLink(response.title, response.permalink_url)));
                    } else {
                        Toast.show("success", Language.text.POPUP_CREATED_ALBUM_NOT_APPROVED);
                    }
                    $(window).trigger({
                        type: "engineReloadCurrentPage"
                    });
                },
                error: function (e, textStatus, xhr, $form) {
                    var errors = e.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        Toast.show("error", value[0], null);
                    });
                    $form.find('.error').removeClass('hide').html(e.responseJSON.errors[Object.keys(e.responseJSON.errors)[0]][0]);
                    $form.find("[type='submit']").removeAttr("disabled");
                }
            });
        },
        onAlbumArtworkChange: function () {
            Artist.createAlbumForm.find('.input-album-artwork').change(function () {
                var input = this;
                var url = $(this).val();
                var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
                if (input.files && input.files[0] && (ext === "gif" || ext === "png" || ext === "jpeg" || ext === "jpg")) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        Artist.createAlbumForm.find('img').attr('src', e.target.result);
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            });
        },
        editAlbum: function (el) {
            var album = window['album_data_' + el.data('id')];
            Artist.albumSongsSelection.find("option").remove();
            $.engineLightBox.show("lightbox-edit-album");
            Artist.editAlbumForm.find(".title").html(album.title);
            Artist.editAlbumForm.find("[name='id']").val(album.id);
            Artist.editAlbumForm.find("[name='title']").val(album.title);
            Artist.editAlbumForm.find("[name='description']").val(album.description);
            Artist.editAlbumForm.find("input[name='copyright']").val(album.copyright);
            Artist.editAlbumForm.find(".edit-artwork").attr("data-type", "album").attr("data-id", album.id);
            Artist.editAlbumForm.find(".img-container img").attr("src", album.artwork_url);
            Artist.editAlbumForm.find(".img-container img").attr("rel", "artwork-album-" + album.id)
            $.engineUtils.makeSelectOption(Artist.editAlbumForm.find('select[name=genre\\[\\]]'), User.userInfo.allow_genres);
            $.engineUtils.makeSelectOption(Artist.editAlbumForm.find('select[name=mood\\[\\]]'), User.userInfo.allow_moods);
            if (album.genre) {
                album.genre.split(',').forEach(function (i) {
                    Artist.editAlbumForm.find('select[name=genre\\[\\]] option[value="' + i + '"]').attr('selected', 'selected')
                })
            }
            if (album.mood) {
                album.mood.split(',').forEach(function (i) {
                    Artist.editAlbumForm.find('select[name=mood\\[\\]] option[value="' + i + '"]').attr('selected', 'selected')
                })
            }
            if (album.type) {
                Artist.editAlbumForm.find('select[name=type] option[value="' + album.type + '"]').attr('selected', 'selected')
            }
            setTimeout(function () {
                Artist.editAlbumForm.find('.select2').select2({
                    width: '100%',
                    placeholder: "Please select",
                    maximumSelectionLength: 4
                });
            }, 100);

            if (album.visibility) {
                Artist.editAlbumForm.find('input[name="visibility"]').attr('checked', 'checked');
            } else {
                Artist.editAlbumForm.find('input[name="visibility"]').removeAttr('checked');
            }
            if (album.allow_comments) {
                Artist.editAlbumForm.find('input[name="comments"]').attr('checked', 'checked');
            } else {
                Artist.editAlbumForm.find('input[name="comments"]').removeAttr('checked');
            }
            if (album.selling) {
                Artist.editAlbumForm.find('input[name="selling"]').attr('checked', 'checked');
                Artist.editAlbumForm.find('input[name="price"]').val(album.price);
                Artist.editAlbumForm.find('.collapse').collapse('show');
            } else {
                Artist.editAlbumForm.find('input[name="selling"]').removeAttr('checked');
                Artist.editAlbumForm.find('.collapse').collapse('hide');
            }

            Artist.editAlbumForm.find('.datepicker').datepicker();
            Artist.editAlbumForm.find('.edit-artwork-input').change(function () {
                var input = this;
                var url = $(this).val();
                var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
                if (input.files && input.files[0] && (ext === "gif" || ext === "png" || ext === "jpeg" || ext === "jpg")) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        Artist.editAlbumForm.find('img').attr('src', e.target.result);
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            });

        },
        addVideo: function () {
            $.engineLightBox.show("lightbox-add-video");
            $('#create-album-form').find('.collapse').collapse('hide');
            Artist.loadGenres($('.lightbox-add-video select[name="genre[]"]'), "video", null);
            Artist.loadMoods($('.lightbox-add-video select[name="mood[]"]'), "video", null);
            $('#create-album-form').find('.datepicker').datepicker();
            $('#create-album-form').ajaxForm({
                beforeSubmit: function (data, $form, options) {
                    var error = 0;
                    Object.keys(data).forEach(function eachKey(key) {
                        if (data[key].required && !data[key].value) {
                            $form.find("[name='" + data[key].name + "']").closest(".control").addClass("field-error");
                            error++;
                        } else if (data[key].required && data[key].value) {
                            $form.find("[name='" + data[key].name + "']").closest(".control").removeClass("field-error");
                        }
                    });
                    if (error) return false;
                    $form.find("[type='submit']").attr("disabled", "disabled");
                },
                success: function (response, textStatus, xhr, $form) {
                    $form.find("[type='submit']").removeAttr("disabled");
                    $form.trigger("reset");
                    $.engineLightBox.hide();
                    if (response.approved) {
                        Toast.show("success", null, Language.text.POPUP_CREATED_ALBUM.replace(':albumLink', Favorite.objectLink(response.title, response.permalink_url)));
                    } else {
                        Toast.show("success", Language.text.POPUP_CREATED_ALBUM_NOT_APPROVED);
                    }
                    $(window).trigger({
                        type: "engineReloadCurrentPage"
                    });
                },
                error: function (e, textStatus, xhr, $form) {
                    var errors = e.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        Toast.show("error", value[0], null);
                    });
                    $form.find('.error').removeClass('hide').html(e.responseJSON.errors[Object.keys(e.responseJSON.errors)[0]][0]);
                    $form.find("[type='submit']").removeAttr("disabled");
                }
            });
        },
        editVideo: function (el) {
            var video = window['video_data_' + el.data('id')];
            Artist.albumSongsSelection.find("option").remove();
            $.engineLightBox.show("lightbox-edit-video");
            Artist.editVideoForm.find(".title").html(video.title);
            Artist.editVideoForm.find("[name='id']").val(video.id);
            Artist.editVideoForm.find("[name='title']").val(video.title);
            Artist.editVideoForm.find("[name='description']").val(video.description);
            Artist.editVideoForm.find("[name='youtube_id']").val(video.youtube_id);
            Artist.editVideoForm.find("[name='released_at']").val(video.released_at);
            Artist.editVideoForm.find("[name='created_at']").val(video.created_at);
            Artist.editVideoForm.find("input[name='copyright']").val(video.copyright);
            Artist.editVideoForm.find(".edit-artwork").attr("data-type", "video").attr("data-id", video.id);
            Artist.editVideoForm.find(".img-container img").attr("src", video.artwork_url);
            Artist.editVideoForm.find(".img-container img").attr("rel", "artwork-video-" + video.id)
            $.engineUtils.makeSelectOption(Artist.editVideoForm.find('select[name=genre\\[\\]]'), User.userInfo.allow_genres);
            $.engineUtils.makeSelectOption(Artist.editVideoForm.find('select[name=mood\\[\\]]'), User.userInfo.allow_moods);
            if (video.genre) {
                video.genre.split(',').forEach(function (i) {
                    Artist.editVideoForm.find('select[name=genre\\[\\]] option[value="' + i + '"]').attr('selected', 'selected')
                })
            }
            if (video.mood) {
                video.mood.split(',').forEach(function (i) {
                    Artist.editVideoForm.find('select[name=mood\\[\\]] option[value="' + i + '"]').attr('selected', 'selected')
                })
            }

            if (video.visibility) {
                Artist.editVideoForm.find('input[name="visibility"]').attr('checked', 'checked');
            } else {
                Artist.editVideoForm.find('input[name="visibility"]').removeAttr('checked');
            }
            if (video.allow_comments) {
                Artist.editVideoForm.find('input[name="comments"]').attr('checked', 'checked');
            } else {
                Artist.editVideoForm.find('input[name="comments"]').removeAttr('checked');
            }
            if (video.selling) {
                Artist.editVideoForm.find('input[name="selling"]').attr('checked', 'checked');
                Artist.editVideoForm.find('input[name="price"]').val(video.price);
                Artist.editVideoForm.find('.collapse').collapse('show');
            } else {
                Artist.editVideoForm.find('input[name="selling"]').removeAttr('checked');
                Artist.editVideoForm.find('.collapse').collapse('hide');
            }

            Artist.editVideoForm.find('.datepicker').datepicker();
            Artist.editVideoForm.find('.edit-artwork-input').change(function () {
                var input = this;
                var url = $(this).val();
                var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
                if (input.files && input.files[0] && (ext === "gif" || ext === "png" || ext === "jpeg" || ext === "jpg")) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        Artist.editVideoForm.find('img').attr('src', e.target.result);
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            });
        },
        deleteVideo: function (el) {
            var album_id = el.data('id');
            bootbox.confirm({
                title: Language.text.DELETED_VIDEO_MSG,
                message: Language.text.WARNING_DELETE_VIDEO,
                centerVertical: true,
                confirm: {
                    label: Language.text.CONFIRM_DELETE,
                },
                buttons: {
                    cancel: {
                        label: Language.text.CANCEL,
                    },
                    confirm: {
                        label: Language.text.CONFIRM_DELETE,
                    }
                },
                callback: function (result) {
                    if (result) {
                        $.ajax({
                            url: route.route('frontend.artist.video.delete'),
                            data: {
                                'id': album_id
                            },
                            type: 'post',
                            dataType: 'json',
                            success: function () {
                                $.engineUtils.cleanStorage();
                                $(window).trigger({
                                    type: 'engineNeedHistoryChange',
                                    href: route.route('frontend.auth.user.artist.manager.videos')
                                });
                                Toast.show("success", Language.text.POPUP_DELETED_VIDEO);
                            },
                            error: function () {
                                Toast.show("error", Language.text.POPUP_DELETE_VIDEO_DENIED);
                            }
                        });
                    }
                }
            });
        },
        createPodcastShow: function () {
            $.engineLightBox.show("lightbox-create-show");
            Artist.loadCategories($('.lightbox-create-show select[name="category[]"]'), [], null);
            Artist.loadCountries($('.lightbox-create-show select[name="country"]'), null, null);
            Artist.createPodcastForm = $('#create-podcast-show');
            Artist.createPodcastForm.find('.edit-artwork-input').change(function () {
                var input = this;
                var url = $(this).val();
                var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
                if (input.files && input.files[0] && (ext === "gif" || ext === "png" || ext === "jpeg" || ext === "jpg")) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        Artist.createPodcastForm.find('img').attr('src', e.target.result);
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            });
            $('#create-podcast-show').find('.datepicker').datepicker();
            $('#create-podcast-show').ajaxForm({
                beforeSubmit: function (data, $form, options) {
                    var error = 0;
                    Object.keys(data).forEach(function eachKey(key) {
                        if (data[key].required && !data[key].value) {
                            $form.find("[name='" + data[key].name + "']").closest(".control").addClass("field-error");
                            error++;
                        } else if (data[key].required && data[key].value) {
                            $form.find("[name='" + data[key].name + "']").closest(".control").removeClass("field-error");
                        }
                    });
                    if (error) return false;
                    $form.find("[type='submit']").attr("disabled", "disabled");
                },
                success: function (response, textStatus, xhr, $form) {
                    $form.find("[type='submit']").removeAttr("disabled");
                    $form.trigger("reset");
                    $.engineLightBox.hide();
                    if (response.approved) {
                        Toast.show("success", null, Language.text.POPUP_CREATED_ALBUM.replace(':albumLink', Favorite.objectLink(response.title, response.permalink_url)));
                    } else {
                        Toast.show("success", Language.text.POPUP_CREATED_ALBUM_NOT_APPROVED);
                    }
                    $(window).trigger({
                        type: "engineReloadCurrentPage"
                    });
                },
                error: function (e, textStatus, xhr, $form) {
                    var errors = e.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        Toast.show("error", value[0], null);
                    });
                    $form.find('.error').removeClass('hide').html(e.responseJSON.errors[Object.keys(e.responseJSON.errors)[0]][0]);
                    $form.find("[type='submit']").removeAttr("disabled");
                }
            });
        },
        editPodcastShow: function (el) {
            var podcast = window['podcast_data_' + el.data('id')];
            Artist.editPodcastForm = $('#edit-podcast-show-form');
            Artist.albumSongsSelection.find("option").remove();
            $.engineLightBox.show("lightbox-edit-show");
            Artist.editPodcastForm.find(".title").html(podcast.title);
            Artist.editPodcastForm.find("textarea[name=description]").html(podcast.description);
            Artist.editPodcastForm.find("input[name='title']").val(podcast.title);
            Artist.editPodcastForm.find("input[name='id']").val(podcast.id);
            Artist.editPodcastForm.find(".edit-artwork").attr("data-type", "album").attr("data-id", podcast.id);
            Artist.editPodcastForm.find(".img-container img").attr("src", podcast.artwork_url);
            Artist.editPodcastForm.find(".img-container img").attr("rel", "artwork-album-" + podcast.id);
            Artist.editPodcastForm.find('.select2-container').remove();
            Artist.editPodcastForm.find('.select2')
                .removeClass('select2-hidden-accessible')
                .removeAttr('data-select2-id')
                .removeAttr('placeholder');
            if (podcast.category) {
                Artist.loadCategories($('.lightbox-edit-show select[name="category[]"]'), podcast.category.split(','), null);
            }

            Artist.loadCountries($('.lightbox-edit-show select[name="country"]'), podcast.country_code, null);
            if (podcast.country_code) {
                $('.podcast-edit-language-container').removeClass('d-none')
                Artist.loadLanguages($('.lightbox-edit-show select[name="language"]'), podcast.language_id, podcast.country_code);
            }

            if (podcast.visibility) {
                Artist.editPodcastForm.find('input[name="visibility"]').attr('checked', 'checked');
            } else {
                Artist.editPodcastForm.find('input[name="visibility"]').removeAttr('checked');
            }

            if (podcast.allow_comments) {
                Artist.editPodcastForm.find('input[name="allow_comments"]').attr('checked', 'checked');
            } else {
                Artist.editPodcastForm.find('input[name="allow_comments"]').removeAttr('checked');
            }

            if (podcast.allow_download) {
                Artist.editPodcastForm.find('input[name="allow_download"]').attr('checked', 'checked');
            } else {
                Artist.editPodcastForm.find('input[name="allow_download"]').removeAttr('checked');
            }

            if (podcast.explicit) {
                Artist.editPodcastForm.find('input[name="explicit"]').attr('checked', 'checked');
            } else {
                Artist.editPodcastForm.find('input[name="explicit"]').removeAttr('checked');
            }

            Artist.editPodcastForm.find('.datepicker').datepicker();
            Artist.editPodcastForm.find('.edit-artwork-input').change(function () {
                var input = this;
                var url = $(this).val();
                var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
                if (input.files && input.files[0] && (ext === "gif" || ext === "png" || ext === "jpeg" || ext === "jpg")) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        Artist.editPodcastForm.find('img').attr('src', e.target.result);
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            });
        },
        importPodcastRss: function () {
            $.engineLightBox.show("lightbox-import-postcast-rss");
            $('#import-podcast-rss-form').find('.datepicker').datepicker();
            $('#import-podcast-rss-form').ajaxForm({
                beforeSubmit: function (data, $form, options) {
                    var error = 0;
                    Object.keys(data).forEach(function eachKey(key) {
                        if (data[key].required && !data[key].value) {
                            $form.find("[name='" + data[key].name + "']").closest(".control").addClass("field-error");
                            error++;
                        } else if (data[key].required && data[key].value) {
                            $form.find("[name='" + data[key].name + "']").closest(".control").removeClass("field-error");
                        }
                    });
                    if (error) return false;
                    $form.find('.alert-info').removeClass('hide');
                    $form.find("[type='submit']").addClass('btn-loading').attr("disabled", "disabled");
                },
                success: function (response, textStatus, xhr, $form) {
                    $form.find('.alert-info').addClass('hide');
                    $form.find("[type='submit']").removeAttr('btn-loading').removeAttr("disabled");
                    $form.trigger("reset");
                    $.engineLightBox.hide();
                    if (response.approved) {
                        Toast.show("success", null, Language.text.POPUP_CREATED_ALBUM.replace(':albumLink', Favorite.objectLink(response.title, response.permalink_url)));
                    } else {
                        Toast.show("success", Language.text.POPUP_CREATED_ALBUM_NOT_APPROVED);
                    }
                    $(window).trigger({
                        type: "engineReloadCurrentPage"
                    });
                },
                error: function (e, textStatus, xhr, $form) {
                    var errors = e.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        Toast.show("error", value[0], null);
                    });
                    $form.find('.alert-info').addClass('hide');
                    $form.find('.error').removeClass('hide').html(e.responseJSON.errors[Object.keys(e.responseJSON.errors)[0]][0]);
                    $form.find("[type='submit']").removeAttr('btn-loading').removeAttr("disabled");
                }
            });
        },
        deletePodcast: function (el) {
            var podcast_id = el.data('id');
            bootbox.confirm({
                title: Language.text.DELETED_ALBUM_MSG,
                message: Language.text.WARNING_DELETE_ALBUM,
                centerVertical: true,
                confirm: {
                    label: Language.text.CONFIRM_DELETE,
                },
                buttons: {
                    cancel: {
                        label: Language.text.CANCEL,
                    },
                    confirm: {
                        label: Language.text.CONFIRM_DELETE,
                    }
                },
                callback: function (result) {
                    if (result) {
                        $.ajax({
                            url: route.route('frontend.auth.user.artist.manager.podcasts.delete'),
                            data: {
                                'id': podcast_id
                            },
                            type: 'post',
                            dataType: 'json',
                            success: function () {
                                $.engineUtils.cleanStorage();
                                $(window).trigger({
                                    type: 'engineNeedHistoryChange',
                                    href: route.route('frontend.auth.user.artist.manager.podcasts')
                                });
                                Toast.show("success", Language.text.POPUP_DELETED_PODCAST);
                            },
                            error: function () {
                                Toast.show("error", Language.text.POPUP_DELETE_PODCAST_DENIED);
                            }
                        });
                    }
                }
            });
        },
        deleteSong: function (song) {
            bootbox.confirm({
                title: Language.text.DELETED_SONG_MSG,
                message: Language.text.WARNING_DELETE_SONG,
                centerVertical: true,
                buttons: {
                    cancel: {
                        label: Language.text.CANCEL,
                    },
                    confirm: {
                        label: Language.text.CONFIRM_DELETE,
                    }
                },
                callback: function (result) {
                    if (result) {
                        $.ajax({
                            url: route.route('frontend.auth.user.artist.manager.song.delete'),
                            data: {
                                'id': song.id
                            },
                            type: 'post',
                            dataType: 'json',
                            success: function () {
                                $.engineUtils.cleanStorage();
                                $('.module[data-type="song"][data-id="' + song.id + '"]').fadeOut();
                                Toast.show("success", Language.text.POPUP_DELETED_SONG);
                            },
                            error: function () {
                                Toast.show("error", Language.text.POPUP_DELETE_SONG_DENIED);
                            }
                        });
                    }
                }
            });
        },
        deleteAlbum: function (el) {
            var album_id = el.data('id');
            bootbox.confirm({
                title: Language.text.DELETED_ALBUM_MSG,
                message: Language.text.WARNING_DELETE_ALBUM,
                centerVertical: true,
                confirm: {
                    label: Language.text.CONFIRM_DELETE,
                },
                buttons: {
                    cancel: {
                        label: Language.text.CANCEL,
                    },
                    confirm: {
                        label: Language.text.CONFIRM_DELETE,
                    }
                },
                callback: function (result) {
                    if (result) {
                        $.ajax({
                            url: route.route('frontend.auth.user.artist.manager.albums.delete'),
                            data: {
                                'id': album_id
                            },
                            type: 'post',
                            dataType: 'json',
                            success: function () {
                                $.engineUtils.cleanStorage();
                                $(window).trigger({
                                    type: 'engineNeedHistoryChange',
                                    href: route.route('frontend.auth.user.artist.manager.albums')
                                });
                                Toast.show("success", Language.text.POPUP_DELETED_ALBUM);
                            },
                            error: function () {
                                Toast.show("error", Language.text.POPUP_DELETE_ALBUM_DENIED);
                            }
                        });
                    }
                }
            });
        },
        sortAlbumSongs: function () {
            if (!$(".album-song-sortable").length) return false;
            __DEV__ && console.log("start sort able");
            $(".album-song-sortable").sortable({
                handle: ".drag-handle",
                scroll: false,
                cancel: "span",
                placeholder: "sortable-playlist-song-placeholder",
                cursorAt: {
                    top: 0,
                    left: 0
                },
                helper: function (e, item) {
                    var song = $.engineUtils.getSongData(item);
                    var helper = $("<div />");
                    helper.addClass('sortable-playlist-song-helper')
                    helper.append(song.title);
                    return helper;
                },
                start: function (e, ui) {
                    $('body').addClass("lock-childs");
                    ui.item.show();
                },
                update: function (e, ui) {
                    var data = {};
                    data.album_id = $(this).data("id");
                    data.nextOrder = $(this).sortable('toArray', {
                        attribute: 'data-id',
                    });
                    data.nextOrder = data.nextOrder.filter(Boolean);
                    data.nextOrder = JSON.stringify(data.nextOrder)
                    $.ajax({
                        type: 'post',
                        url: route.route('frontend.auth.user.artist.manager.albums.sort'),
                        data: data,
                        success: function () {
                            Toast.show('success', Language.text.POPUP_PLAYLIST_SAVE_DESCRIPTION)
                            $(window).trigger({
                                type: "engineSiteContentChange"
                            });
                        }
                    });
                },
                stop: function (e, ui) {
                    setTimeout(function () {
                        $('body').removeClass("lock-childs");
                    }, 500)
                }
            });
        },
        editEpisode: function (episode) {
            __DEV__ && console.log('Edit episode', episode);

            $.engineLightBox.show("lightbox-edit-episode");
            Artist.editEpisodeForm.find(".title").html(episode.title);
            Artist.editEpisodeForm.find("input[name='title']").val(episode.title);
            Artist.editEpisodeForm.find("input[name='id']").val(episode.id);
            Artist.editEpisodeForm.find("input[name='season']").val(episode.season);
            Artist.editEpisodeForm.find("input[name='number']").val(episode.number);

            if (episode.description) {
                Artist.editEpisodeForm.find('textarea[name="description"]').val(episode.description);
            }

            if (episode.visibility) {
                Artist.editEpisodeForm.find('input[name="visibility"]').attr('checked', 'checked');
            } else {
                Artist.editEpisodeForm.find('input[name="visibility"]').removeAttr('checked');
            }
            if (episode.allow_download) {
                Artist.editEpisodeForm.find('input[name="downloadable"]').attr('checked', 'checked');
            } else {
                Artist.editEpisodeForm.find('input[name="downloadable"]').removeAttr('checked');
            }
            if (episode.allow_comments) {
                Artist.editEpisodeForm.find('input[name="allow_comments"]').attr('checked', 'checked');
            } else {
                Artist.editEpisodeForm.find('input[name="allow_comments"]').removeAttr('checked');
            }
            if (episode.explicit) {
                Artist.editEpisodeForm.find('input[name="explicit"]').attr('checked', 'checked');
            } else {
                Artist.editEpisodeForm.find('input[name="explicit"]').removeAttr('checked');
            }

            if (episode.episode_type) {
                Artist.editEpisodeForm.find('select[name=type] option[value="' + episode.episode_type + '"]').attr('selected', 'selected')
            }

            setTimeout(function () {
                Artist.editEpisodeForm.find('.select2').select2({
                    width: '100%',
                    placeholder: "Please select",
                    maximumSelectionLength: 4
                });
            }, 100);

            Artist.editSongSaveBtn.one('click', function () {
                Artist.editSongForm.submit();
            });
            Artist.editEpisodeForm.find('.datepicker').datepicker();
        },
        song: {
            updated: function (response, $form) {
                $(window).trigger({
                    type: "engineReloadCurrentPage"
                });
                $.engineLightBox.hide();
            }
        },
        album: {
            updated: function (response, $form) {
                $(window).trigger({
                    type: "engineReloadCurrentPage"
                });
                $.engineLightBox.hide();
            }
        },
        event: {
            create: function () {
                $.engineLightBox.show("lightbox-create-event");
            },
            edit: function (e) {
                var id = e.data('id');
                var event = window['event_data_' + id];
                var form = $('#edit-event-form');
                form.find('[name="title"]').attr('value', event.title);
                form.find('[name="location"]').attr('value', event.location);
                form.find('[name="link"]').attr('value', event.link);
                form.find('[name="started_at"]').attr('value', event.started_at);
                form.find('[name="id"]').val(event.id);
                $.engineLightBox.show("lightbox-edit-event");
            },
            delete: function (e) {
                var id = e.data('id');
                bootbox.confirm({
                    title: Language.text.POPUP_DELETE_EVENT_TITLE,
                    message: Language.text.POPUP_DELETE_EVENT_MESSAGE,
                    centerVertical: true,
                    callback: function (result) {
                        if (result) {
                            $.ajax({
                                url: route.route('frontend.auth.user.artist.manager.event.delete'),
                                type: "post",
                                data: {
                                    id: id
                                },
                                success: function (response) {
                                    $(window).trigger({
                                        type: "engineReloadCurrentPage"
                                    });
                                }
                            });
                        }
                    }
                });
            }
        },
        profile: {
            imgSelect: function () {
                var input = this;
                var url = $(this).val();
                var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
                if (input.files && input.files[0] && (ext === "gif" || ext === "png" || ext === "jpeg" || ext === "jpg")) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $('#artist-profile-form').find('img.artist-picture-preview').attr('src', e.target.result);
                    };
                    reader.readAsDataURL(input.files[0]);
                } else {
                    Toast.show('error', Language.text.SETTINGS_PICTURE_FAILED, null);
                }
            },
            save: function (response, $form) {
                $("img.profile-img, img.artist-picture-preview").attr("src", response.artwork_url);
                $form.find("[type='submit']").removeAttr("disabled").addClass("btn-success");
            }
        }
    };
    $(document).on("change", "#upload-artist-pic", Artist.profile.imgSelect);
    $(document).ready(Artist.onAlbumArtworkChange);
    $(document).ready(function () {
        Artist.claim.continueButton.bind('click', Artist.claim.account);
        Artist.claim.finishedButton.bind('click', function () {
            $.engineLightBox.hide();
        });
        Artist.claim.requestButton.on('click', Artist.claim.information);
        $('.podcast-import-country-select2').bind('change', function () {
            var country_code = $(this).val();
            if (country_code) {
                $('.podcast-import-language-container').removeClass('d-none')
                Artist.loadLanguages($('.podcast-import-language-container').find('select[name="language"]'), null, country_code);
                return false;
            }
        });
        $('.podcast-country-select2').bind('change', function () {
            var country_code = $(this).val();
            if (country_code) {
                $('.podcast-language-container').removeClass('d-none')
                Artist.loadLanguages($('.lightbox-create-show select[name="language"]'), null, country_code);
                return false;
            }
        });
        $('.podcast-edit-country-select2').bind('change', function () {
            var country_code = $(this).val();
            if (country_code) {
                $('.podcast-edit-language-container').removeClass('d-none')
                Artist.loadLanguages($('.lightbox-edit-show select[name="language"]'), null, country_code);
                return false;
            }
        });
    });
    $(window).on("enginePageHasBeenLoaded", function () {
        if ($('#fileupload').length) {
            Artist.upload.reinventForm();
        }
        Artist.sortAlbumSongs();
    });
    $(window).on("enginePageHasBeenLoaded", function () {
        var a = window.location.href.toString().split(window.location.host)[1];
        if (a === '/artist-management') Artist.chart.loadData()
    });
    $(document).on('change', '.custom-file-input', function (event) {
        $(this).next('.custom-file-label').html(event.target.files[0].name);
    });
    $(document).on('click', '[data-action="withdraw"]', Artist.withdraw);
});