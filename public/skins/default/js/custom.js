/**
 * Music Engine Custom Javascript For Default Theme
 **
 * Authors: NiNaCoder ninacoder2510@gmail.com
 * Web: http://ninacoder.info
 *
 * Copyright (c) 2018-2020
 *
 * Date: 2019-05-15
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(function ($) {
    $(document).ready(function () {
        $('#embed_bottom_player, .draggable').disableSelection();

    });

    window.PageSwiper = {
        init: function () {
            setTimeout(function () {
                var swipes = []
                $('.swiper-container-channel').each(function (i, obj) {
                    var pr = $(this).parents('.home-section').find('.swiper-arrow-left');
                    var nx = $(this).parents('.home-section').find('.swiper-arrow-right');
                    swipes[i] = new Swiper(obj, {
                        slidesPerView: "auto",
                        paginationClickable: !0,
                        spaceBetween: 0,
                        watchSlidesProgress: !0,
                        watchSlidesVisibility: !0,
                        loop: $.engineUtils.isMobile(),
                        simulateTouch: false,
                        slidesPerGroup: 2,
                        navigation: {
                            nextEl: nx,
                            prevEl: pr
                        },
                    });
                });

                var slider = new Swiper('.swiper-container-slide', {
                    slidesPerView: "auto",
                    paginationClickable: !0,
                    spaceBetween: 0,
                    watchSlidesProgress: !0,
                    watchSlidesVisibility: !0,
                    loop: $.engineUtils.isMobile(),
                    simulateTouch: false,
                    slidesPerGroup: 1,
                    navigation: {
                        nextEl: $('.swiper-container-slide').parents('.home-section').find('.swiper-arrow-right'),
                        prevEl: $('.swiper-container-slide').parents('.home-section').find('.swiper-arrow-left')
                    },
                });
            }, 500);
        }
    }
    $(window).on("enginePageHasBeenLoaded", PageSwiper.init);

    window.DragQueue = {
        loaded: false,
        item: null,
        init: function () {
            if (!$.engineUtils.isMobile()) {
                //if(! EMBED.Playlist.length) return false;
                $("#embed_list_middle").sortable({
                    scroll: false,
                    placeholder: "queue-sortable-placeholder",
                    helper: function (e, item) {
                        var helper = $("<div />");
                        helper.addClass('sortable-queue-helper')
                        return helper;
                    },
                    appendTo: "#embed_bottom_player",
                    revert: 200,
                    cursorAt: {
                        top: 0,
                        left: 0
                    },
                    start: function (e, ui) {
                        if ($('#embed_list_container li').length === 2) {
                            //$('.queue-sortable-placeholder').addClass('first-drop');
                        } else {
                            $('.queue-droppable-placeholder').addClass('hide');
                        }
                        $('body').addClass("lock-childs");
                        ui.item.show();
                        if (!$('.sortable-queue-helper').hasClass('ui-draggable-dragging')) {
                            var position = $(ui.item).attr('position');
                            var song = EMBED.Playlist[position];
                            __DEV__ && console.log('Sorting', song);
                            $(ui.helper).html(song.title);
                        }
                        var textHelper = $("<div />");
                        textHelper.attr('id', 'queueSortableTextHelper');
                        textHelper.html('drop here');
                        $('body').append(textHelper);
                    },
                    change: function (e, ui) {
                        $('#embed_list_middle .queue-sortable-placeholder *').remove();
                        $("#queueSortableTextHelper").css({
                            bottom: $('#embed_list_middle').height() + 24,
                            left: $('#embed_list_middle .queue-sortable-placeholder').offset().left - 32
                        });

                    },
                    update: function (e, ui) {
                        var oldIndex = ui.item.attr('position');
                        var newIndex = ui.item.index();
                        if (oldIndex) {
                            $(ui.helper).remove();
                            /** sort song inside queue */
                            $("[id=queueSortableTextHelper]").remove();
                            EMBED.List.move(oldIndex, newIndex);
                            if (parseInt(oldIndex) === parseInt(EMBED.Player.queueNumber)) {
                                EMBED.Player.queueNumber = newIndex;
                            }
                            //Update position
                            $('#embed_list_middle li').each(function (index) {
                                    $(this).attr('position', index);
                                    $(this).find('.embed_current_playlist_play_button').attr('id', 'embed_current_playlist_play_button_' + index);
                                    EMBED.PlaylistObj.obj[$(this).attr('id').replace('embed_current_playlist_row_', '')].position = index;
                                }
                            );
                        } else {
                            /** drag from other place to queue */
                            $(ui.item).remove();
                            setTimeout(function () {
                                DragQueue.objectDropped(DragQueue.item, (newIndex - 1));
                            }, 100);
                        }
                        console.log(oldIndex, newIndex, EMBED.Player.queueNumber);
                        EMBED.Event.fire(window, "embedQueueChanged");
                    },
                    receive: function (e, ui) {
                        DragQueue.item = ui.item;
                    },
                    stop: function (e, ui) {
                        $("[id=queueSortableTextHelper]").remove();
                        setTimeout(function () {
                            $('body').removeClass("lock-childs");
                        }, 200);
                        if (EMBED.Playlist.length === 1) {
                            EMBED.Player.playAt(0);
                        }
                    }
                });
                $(".draggable").draggable({
                    appendTo: "body",
                    zIndex: 2000,
                    scroll: false,
                    connectToSortable: "#embed_list_middle",
                    helper: function () {
                        $('#embed_bottom_player').addClass('embed_no_transition');
                        var helper = $("<li />");
                        helper.addClass('sortable-queue-helper');
                        helper.css({'width': 'auto', 'height': 'auto'});
                        return helper;
                    },
                    cursorAt: {
                        top: 0,
                        left: 0
                    },
                    revert: "invalid",
                    start: function (e, ui) {
                        EMBED.List.show();
                        if (!$('.queue-droppable-placeholder').length) {
                            var droppablePlaceholder = $("<div />");
                            droppablePlaceholder.addClass('queue-droppable-placeholder');
                            var childToQueue = $("<div />");
                            childToQueue.html(Language.text.ADD_TO_QUEUE)
                            droppablePlaceholder.append(childToQueue);
                            var childDropHere = $("<div />");
                            childDropHere.html(Language.text.DROP_HERE);
                            droppablePlaceholder.append(childDropHere);
                            $('#embed_list_container').append(droppablePlaceholder);
                        } else {
                            $('.queue-droppable-placeholder').removeClass('hide');
                        }
                        $('body').addClass("lock-childs");
                        var object_type = $(e.target).data('type');
                        var object_id = $(e.target).data('id');
                        var object = window[object_type + '_data_' + object_id];
                        __DEV__ && console.log('dragging', object_type, object);
                        $(ui.helper).css('width', 'auto');
                        if (object_type === "artist" || object_type === "user") {
                            $(ui.helper).html(object.name);
                        } else {
                            $(ui.helper).html(object.title);
                        }
                    },
                    update: function (e, ui) {
                        $('.queue-droppable-placeholder').addClass('hide');
                        $(ui.helper).remove();
                    },
                    stop: function (e, ui) {
                        setTimeout(function () {
                            $('body').removeClass("lock-childs");
                        }, 200);
                        $("[id=queueSortableTextHelper]").remove();
                        $('.queue-droppable-placeholder').addClass('hide');
                        if (!EMBED.Playlist.length) {
                            EMBED.List.hide();
                        }
                    },
                });
                $("#embed_list_middle").droppable({
                    drop: function (event, ui) {
                        DragQueue.objectDropped(ui.draggable, 0, true);
                    }
                });
                DragQueue.loaded = true;
            }
        },
        objectDropped: function (ui, position, forcePlay) {
            forcePlay = typeof forcePlay !== 'undefined' ? forcePlay : false;
            var object_type = ui.data('type');
            var object_id = ui.data('id');
            var object = window[object_type + '_data_' + object_id];
            var listMiddle = document.getElementById("embed_list_middle");
            if (object_type === 'song') {
                if (EMBED.Playlist.length) {
                    var currentHash = hex_md5(EMBED.Playlist[EMBED.Player.queueNumber].stream_url);
                    EMBED.PlaylistObj.addSongAtPosition([$.engineUtils.toPlayerJson(object)], position);
                    EMBED.Player.queueNumber = EMBED.PlaylistObj.obj[currentHash].position;
                } else {
                    EMBED.PlaylistObj.addSongAtPosition([$.engineUtils.toPlayerJson(object)], position);
                }
                setTimeout(function () {
                    EMBED.List.renderSongs(listMiddle);
                    Toast.show("queue", Language.text.POPUP_QUEUE_SONG_ADDED.replace(':numSongs', 1));
                    if (forcePlay) {
                        EMBED.Player.playAt(position);
                    }
                }, 200)
            } else if (object_type === 'station') {
                Playlist.playLiveRadioStation([$.engineUtils.stationToPlayerJson(object)], true);
            } else if (object_type === 'user') {
                Toast.show("success", Language.text.PLEASE_WAIT);
                $.ajax({
                    type: "get", url: route.route('api.user.recent', {id: object_id}),
                    success: function (response) {
                        if (response && response.songs && response.songs.data.length) {
                            if (EMBED.Playlist.length) {
                                var currentHash = hex_md5(EMBED.Playlist[EMBED.Player.queueNumber].stream_url);
                                EMBED.PlaylistObj.addSongAtPosition(response.songs.data, position);
                                EMBED.Player.queueNumber = EMBED.PlaylistObj.obj[currentHash].position;
                                EMBED.Player.queueNumber = EMBED.PlaylistObj.obj[currentHash].position;
                            } else {
                                EMBED.PlaylistObj.addSongAtPosition(response.songs.data, position);
                            }
                            EMBED.List.renderSongs(listMiddle);
                            Toast.show("queue", response.songs.data.length === 1 ? Language.text.POPUP_QUEUE_SONG_ADDED.replace(':numSongs', response.songs.data.length) : Language.text.POPUP_QUEUE_SONGS_ADDED.replace(':numSongs', response.songs.data.length));
                            if (forcePlay) {
                                EMBED.Player.playAt(position);
                            }
                        }
                    }
                });
            } else {
                Toast.show("success", Language.text.PLEASE_WAIT);
                $.ajax({
                    type: "get", url: route.route('api.' + object_type, {'id': object_id}),
                    success: function (response) {
                        if (response && response.songs && response.songs.length) {
                            if (EMBED.Playlist.length) {
                                var currentHash = hex_md5(EMBED.Playlist[EMBED.Player.queueNumber].stream_url);
                                EMBED.PlaylistObj.addSongAtPosition(response.songs, position);
                                EMBED.Player.queueNumber = EMBED.PlaylistObj.obj[currentHash].position;
                                EMBED.Player.queueNumber = EMBED.PlaylistObj.obj[currentHash].position;
                            } else {
                                EMBED.PlaylistObj.addSongAtPosition(response.songs, position);
                            }
                            EMBED.List.renderSongs(listMiddle);
                            Toast.show("queue", response.songs.length === 1 ? Language.text.POPUP_QUEUE_SONG_ADDED.replace(':numSongs', response.songs.length) : Language.text.POPUP_QUEUE_SONGS_ADDED.replace(':numSongs', response.songs.length));
                            if (forcePlay) {
                                EMBED.Player.playAt(position);
                            }
                        }
                    }
                });
            }
            $('#embed_list_middle').droppable("disable");
        }
    };
    $(window).on("embedPlayerLoaded", DragQueue.init);
    $(window).on("enginePageHasBeenLoaded", DragQueue.init);
    $(window).ready(function () {
        if (!$.engineUtils.isMobile()) {
            EMBED.Event.add(window, "embedQueueChanged", function () {
                setTimeout(function () {
                    if (EMBED.Playlist.length) {
                        $('#embed_list_middle').droppable("disable");
                        $("#embed_list_middle").sortable("enable");
                    } else {
                        $('#embed_list_middle').droppable("enable");
                        $("#embed_list_middle").sortable("disable");
                    }
                })
            });
        }
    });

    window.LoadingIndicator = {
        init: function (a) {
            $("body").scrollTop(0);
            var b = window.location.href.toString().split(window.location.host)[1];
            b = b.split('/')[1];
            if (!b) {
                LoadingIndicator.show('loading-radio');
            } else if (b === 'radio') {
                LoadingIndicator.show('loading-radio');
            } else if (b === 'artist' || b === 'playlist' || b === 'album' || b === 'song') {
                LoadingIndicator.show('loading-profile-card');
            } else if (b === 'trending') {
                LoadingIndicator.show('loading-trending');
            } else if (b === 'community') {
                LoadingIndicator.show('loading-community');
            } else if (b === 'discover') {
                LoadingIndicator.show('loading-discover');
            } else {
                LoadingIndicator.show('loading-other');
            }
        },
        show: function (template) {
            $(window).scrollTop(0);
            $('#page').html(tmpl(template));
        }
    };

    $(window).on("engineHistoryChange", LoadingIndicator.init);

    window.Navigator = {
        url: null,
        init: function (e) {
            Navigator.url = e;
            var text = $('#page h1:first').html();
            var b = window.location.href.toString().split(window.location.host)[1];
            b = b.split('/')[1];

            console.log(e.url);
            console.log(window.location.pathname)

            if (!b) {
                $('#header-nav-title').html('');
                $('#header-nav-logo').removeClass('hide');
            } else {
                if (text) $('#header-nav-title').html(text);
                $('#header-nav-logo').addClass('hide');
            }
        },
        click: function () {
            var b = window.location.href.toString().split(window.location.host)[1];
            b = b.split('/')[1];
            if (!b) {
                $.engineSideBar.show();
                return false;
            }
            window.history.back()
        },
        icon: function (e) {
            var el = $("#header-nav-btn");
            if (window.location.pathname === '/') {
                el.find('.menu').removeClass('hide');
                el.find('.back').addClass('hide');
            } else {
                el.find('.menu').addClass('hide');
                el.find('.back').removeClass('hide');
            }

        }
    };
    $(window).on("engineHistoryChange", Navigator.icon);
    $(document).ready(Navigator.icon);
    $("#header-nav-btn").bind("click", Navigator.click);
    $(window).on("enginePageHasBeenLoaded", Navigator.icon);

    window.Favicon = {
        done: false,
        state: null,
        percentage: 0,
        isRetina: function () {
            return window.devicePixelRatio > 1;
        },
        icon: {
            play: {
                normal: route.route('frontend.homepage') + 'common/images/play-favicon.png',
                retina: route.route('frontend.homepage') + 'common/images/play-favicon@2x.png'
            },
            pause: {
                normal: route.route('frontend.homepage') + 'common/images/pause-favicon.png',
                retina: route.route('frontend.homepage') + 'common/images/pause-favicon@2x.png'
            }
        },
        watch: function () {
            if ($.engineUtils.isMobile()) return false;
            if (Favicon.done) return false;
            EMBED.Player.Audio.addEventListener("play", Favicon.setPlay, false);
            EMBED.Player.Audio.addEventListener("pause", Favicon.setPause, false);
            EMBED.Player.Audio.addEventListener("timeupdate", Favicon.onTimeUpdate, false);
            Favicon.done = true;
        },
        setPlay: function () {
            Favicon.state = 'play';
            Favicon.update();
        },
        setPause: function () {
            Favicon.state = 'pause';
            Favicon.update();
        },
        onTimeUpdate: function () {
            var percentage = (this.currentTime / this.duration).toFixed(2);
            if (Favicon.percentage !== percentage) {
                Favicon.percentage = percentage;
                Favicon.update();
            }
        },
        update: function () {
            var favicon = document.getElementById('favicon');
            var faviconSize = Favicon.isRetina() ? 32 : 16;

            var canvas = document.createElement('canvas');
            canvas.width = faviconSize;
            canvas.height = faviconSize;

            var context = canvas.getContext('2d');
            var img = document.createElement('img');

            if (Favicon.state === 'play') {
                img.src = Favicon.isRetina() ? Favicon.icon.play.retina : Favicon.icon.play.normal;
            } else if (Favicon.state === 'pause') {
                img.src = Favicon.isRetina() ? Favicon.icon.pause.retina : Favicon.icon.pause.normal;
            }

            var d = Favicon.isRetina() ? 2 : 1;
            var s = Favicon.isRetina() ? 1 : 2;
            var t = Favicon.percentage;
            img.onload = function () {
                context.drawImage(img, 0, 0, 16 / s, 16 / s, 4 * d, 4 * d, 8 * d, 8 * d);
                context.beginPath();
                context.moveTo(16 * d - 1, 8 * d);
                context.arc(8 * d, 8 * d, 7 * d, 0, 2 * Math.PI, !1);
                context.lineWidth = 2 * d;
                context.strokeStyle = "rgba(120, 120, 120, 0.2)";
                context.stroke();
                context.beginPath();
                context.moveTo(8 * d, d);
                context.arc(8 * d, 8 * d, 7 * d, .5 * -Math.PI, Math.PI * (-.5 + 2 * t), !1);
                context.lineWidth = 2 * d;
                context.strokeStyle = "rgba(226, 47, 53, 1)";
                context.stroke();
                context.beginPath();
                context.moveTo(8 * d, 2.5 * d);
                context.arc(8 * d, 8 * d, 5.5 * d, .5 * -Math.PI, Math.PI * (-.5 + 2 * t), !1);
                context.lineWidth = d;
                context.strokeStyle = "rgb(226, 47, 53, 0.3)";
                context.stroke();
                favicon.href = canvas.toDataURL('image/png');
            };
        }
    };

    $(document).ready(function () {
        EMBED.Event.add(window, "embedPlayerLoaded", function () {
            Favicon.watch();
        });
        EMBED.Event.add(window, "embedQueueChanged", function () {
            setTimeout(function () {
                if(! EMBED.Playlist.length ) {
                    return false;
                }
                var current = EMBED.Playlist[EMBED.Player.queueNumber];
                document.title = current.title + ' - ' + current.artists.map(function (artist) {
                    return artist.name
                }).join(", ");
            }, 500)
        });
    });



    function barsWaveform(canvas, data, color) {
        var scaleFactor = (window.devicePixelRatio || screen.deviceXDPI / screen.logicalXDPI)
        canvas.style.width = canvas.style.width || canvas.width + 'px';
        canvas.style.height = canvas.style.height || canvas.height + 'px';

        var el = document.getElementById("wave-form-container");
        canvas.width = Math.ceil(el.offsetWidth * scaleFactor);
        canvas.height = Math.ceil(el.offsetHeight * scaleFactor);
        canvas.style.width = (canvas.width / scaleFactor) + 'px';;
        canvas.style.height = (canvas.height/ scaleFactor) + 'px';
        var ctx = canvas.getContext('2d');
        if (color) ctx.fillStyle = color;
        var width = canvas.width;
        var height = canvas.height;
        var $ = .4 / scaleFactor;
        var bar = 3 * scaleFactor;
        var gap = Math.max(scaleFactor, ~~(bar / 2));
        var step = bar + gap;
        var scale = data.length / width;
        var absmax = 1;
        var halfH = height / 2;
        var channelIndex = .5;
        var offsetY = height * channelIndex || 0;
        for (var i = 0; i < width; i += step) {
            var h = Math.round((data[Math.floor(i * scale)] / absmax * halfH) * 1.1);
            ctx.fillRect(i + $, halfH - h + offsetY, bar + $, h * 2);
        }
    }
    function halfWaveform(canvas, data, color) {
        scaleFactor = (window.devicePixelRatio || screen.deviceXDPI / screen.logicalXDPI)

        canvas.style.width = canvas.style.width || canvas.width + 'px';
        canvas.style.height = canvas.style.height || canvas.height + 'px';
        canvas.width = Math.ceil(canvas.width * scaleFactor);
        canvas.height = Math.ceil(canvas.height * scaleFactor);

        var ctx = canvas.getContext('2d');
        if (color) ctx.fillStyle = color;

        var width = canvas.width;
        var height = canvas.height;

        var scale = data.length / width;

        var absmax = 1;
        var halfH = height / 2;
        var channelIndex = .5;
        var offsetY = height * channelIndex || 0;

        var step = Math.ceil( data.length / width );

        for (var i = 0; i < width; i ++) {
            var min = 1.0;
            var max = -1.0;
            for (var j=0; j<step; j++) {
                var datum = data[(i*step)+j];
                if (datum < min)
                    min = datum;
                if (datum > max)
                    max = datum;
            }
            var h = Math.round(data[Math.floor(i * scale)] / absmax * halfH);
            ctx.fillRect(i, halfH - h + offsetY, 1, h * 2);
        }
    }


    function getPeaks(length, buffer) {
        //if (this.peaks) { return this.peaks; }

        var sampleSize = buffer.length / length;
        var sampleStep = ~~(sampleSize / 10) || 1;
        var channels = buffer.numberOfChannels;
        var splitPeaks = [];
        var mergedPeaks = [];

        for (var c = 0; c < channels; c++) {
            var peaks = splitPeaks[c] = [];
            var chan = buffer.getChannelData(c);

            for (var i = 0; i < length; i++) {
                var start = ~~(i * sampleSize);
                var end = ~~(start + sampleSize);
                var min = 0;
                var max = 0;

                for (var j = start; j < end; j += sampleStep) {
                    var value = chan[j];

                    if (value > max) {
                        max = value;
                    }

                    if (value < min) {
                        min = value;
                    }
                }

                peaks[2 * i] = max;
                peaks[2 * i + 1] = min;

                if (c === 0 || max > mergedPeaks[2 * i]) {
                    mergedPeaks[2 * i] = max;
                }

                if (c === 0 || min < mergedPeaks[2 * i + 1]) {
                    mergedPeaks[2 * i + 1] = min;
                }
            }
        }

        var splitChannels = false;

        return splitChannels ? splitPeaks : mergedPeaks;
    };


    function max(values) {
        var max = -Infinity;
        for (var i in values) {
            if (values[i] > max) {
                max = values[i];
            }
        }

        return max;
    }

    var engineWaveform = {
        audioContext: null,
        data: null,
        make: function() {
            if(engineWaveform.audioContext !== null) {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                engineWaveform.audioContext = new window.AudioContext();
            }
            var width = $('.track-waveform').width();
            $('canvas').attr('width', width);
            if($('.track-waveform').attr('data-uri')) {
                var audioContext;
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                audioContext = new AudioContext();
                var request = new XMLHttpRequest();
                request.open("GET", $('.track-waveform').attr('data-uri'), true);
                request.responseType = "arraybuffer";
                request.onload = function() {
                    audioContext.decodeAudioData(request.response, function(buffer) {
                        var data = getPeaks(1024, buffer);
                        engineWaveform.data = data;
                        if ($('.track-waveform').hasClass('wave')) {
                            halfWaveform(document.getElementById("waveform"), data, document.body.classList.contains('dark-theme') ? '#fff' : '#000');
                            halfWaveform(document.getElementById("waveform-active-" + $('#wave-form-container').attr('data-id')), data, '#e23036');
                        } else {
                            barsWaveform(document.getElementById("waveform"), data, document.body.classList.contains('dark-theme') ? '#fff' : '#000');
                            barsWaveform(document.getElementById("waveform-active-" + $('#wave-form-container').attr('data-id')), data, '#e23036');
                        }
                        $.ajax({
                            method: 'POST',
                            url: route.route('frontend.waveform.save', {'id': $('waveform').data('id')}),
                            data: {
                                perk: JSON.stringify(data)
                            },
                            success: function (data) {
                                __DEV__ && console.log('Created and saved waveform perk data.');
                            }
                        });
                    }, function(error) {
                        console.error("decodeAudioData error", error);
                    });
                };
                request.send();
            } else {
                $.ajax({
                    method: 'GET',
                    url: route.route('frontend.waveform.get', {'id': $('waveform').data('id')}),
                    success: function (data) {
                        data = JSON.parse(data);
                        engineWaveform.data = data;
                        if($('waveform').length) {
                            if ($('.track-waveform').hasClass('wave')) {
                                halfWaveform(document.getElementById("waveform"), data, document.body.classList.contains('dark-theme') ? '#fff' : '#000');
                                halfWaveform(document.getElementById("waveform-active-" + $('#wave-form-container').attr('data-id')), data, '#e23036');
                            } else {
                                barsWaveform(document.getElementById("waveform"), data, document.body.classList.contains('dark-theme') ? '#fff' : '#000');
                                barsWaveform(document.getElementById("waveform-active-" + $('#wave-form-container').attr('data-id')), data, '#e23036');
                            }
                        }
                    }
                });
            }

        },
        reRender : function(){
            try {
                if(engineWaveform.data === null) {
                    return false;
                }
                if ($('.track-waveform').hasClass('wave')) {
                    halfWaveform(document.getElementById("waveform"), engineWaveform.data, document.body.classList.contains('dark-theme') ? '#fff' : '#000');
                    halfWaveform(document.getElementById("waveform-active-" + $('#wave-form-container').attr('data-id')), engineWaveform.data, '#e23036');
                } else {
                    barsWaveform(document.getElementById("waveform"), engineWaveform.data, document.body.classList.contains('dark-theme') ? '#fff' : '#000');
                    barsWaveform(document.getElementById("waveform-active-" + $('#wave-form-container').attr('data-id')), engineWaveform.data, '#e23036');
                }
            } catch(e){

            }
        },
    };

    window.addEventListener('resize', function(event){
        engineWaveform.reRender();
    });

    $(window).bind("enginePageHasBeenLoaded", function () {
        if($('#wave-form-container').length) {
            engineWaveform.make($('#wave-form-container'));
        }
        if(EMBED.Playlist.length && !$.engineUtils.isMobile()) {
            var song = EMBED.Playlist[EMBED.Player.queueNumber];
            /*
            if($('.song-waveform-visualizer-' + song.id).length){
                $('#waveform, waveform').remove();
                $('.song-waveform-visualizer-' + song.id).removeClass('hide');
                EMBED.WaveForm.visualizer();
            } else {
                $('.song-waveform-visualizer').addClass('hide');
            }
            */
        }
    });

    $(document).ready(function () {
        EMBED.Event.add(window, "embedQueueChanged", function () {
            setTimeout(function () {
                if(EMBED.Playlist.length && !$.engineUtils.isMobile()) {
                    var song = EMBED.Playlist[EMBED.Player.queueNumber];
                    /*
                    if($('.song-waveform-visualizer-' + song.id).length){
                        $('#waveform, waveform').remove();
                        $('.song-waveform-visualizer-' + song.id).removeClass('hide');
                        EMBED.WaveForm.visualizer();
                    } else {
                        $('.song-waveform-visualizer').addClass('hide');
                    }
                     */
                }
            }, 1000);
        });
        EMBED.Event.add(window, "embedVisualizerStarted", function () {
            $('#waveform, waveform').remove();
        });

        EMBED.Event.add(window, "embedPlayerLoaded", function () {
            EMBED.Player.Audio.addEventListener("timeupdate", function () {
                var song = EMBED.Playlist[EMBED.Player.queueNumber];
                if(song.id && $('#waveform-active-' + song.id).length) {
                    try {
                        var currentTime = EMBED.Utils.mmss(Math.floor(this.currentTime));
                        $('.player-time:first').html(currentTime);
                        var duration = EMBED.Utils.mmss(Math.floor(this.duration));
                        $('.player-time.end-time span').html(duration);
                        var percentage = (this.currentTime / this.duration);
                        var waveformWidth = $('.track-waveform').width();
                        $('waveform').css('width', percentage * waveformWidth);
                    } catch(e){}
                }
            }, false);
        });
    });
});