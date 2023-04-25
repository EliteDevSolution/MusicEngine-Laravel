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

    $.enginePlayMedia = {
        hd: false,
        video: true,
        radio: false,
        radioStationData: null,
        playNowOrNext: function (last, a, forcePlay) {
            forcePlay = typeof forcePlay !== 'undefined' ? forcePlay : false;
            var object_type = a.data("type");
            var object_id = a.data("id");
            if (object_type === "playlist" || object_type === "album" || object_type === "artist" || object_type === "profile") {
                $.enginePlayMedia.getObjectSongs(last, object_type, object_id, forcePlay);
            } else if (object_type === "song") {
                var song = window['song_data_' + object_id];
                Playlist.playSongsNowOrNext([$.engineUtils.toPlayerJson(song)], true);
            } else if (object_type === "station") {
                var station = window['station_data_' + object_id];
                Playlist.playLiveRadioStation([$.engineUtils.stationToPlayerJson(station)], true);
            } else if (object_type === "episode") {
                var episode = window['episode_data_' + object_id];
                Playlist.playSongsNowOrNext([$.engineUtils.episodeToPlayerJson(episode)], true);
            } else if (object_type === "user") {
                var user = window['user_data_' + object_id];
                $.enginePlayMedia.playUserCollectionSongs(user.id)
            } else if (object_type === "podcast") {
                var podcast = window['podcast_data_' + object_id];
                $.enginePlayMedia.playLatestEpisode(podcast.id)
            }
            __DEV__ && console.log(object_type, object_id);
        },
        addSongsToPlayer: function (last, songs, forcePlay) {
            if (songs.length) {
                var num = songs.length;
                var playerSongsArray = [];
                for (var i = 0; i < num; i++) {
                    var song = $.engineUtils.toPlayerJson(songs[i]);
                    playerSongsArray.push(song);
                }
                __DEV__ && console.log(playerSongsArray);
                last ? Playlist.playSongsLast(playerSongsArray) : Playlist.playSongsNowOrNext(playerSongsArray, forcePlay);
            }
        },
        getObjectSongs: function (last, object_type, object_id, forcePlay) {
            forcePlay = typeof forcePlay !== 'undefined' ? forcePlay : false;
            $.ajax({
                type: "get",
                url: route.route('frontend.' + object_type, {id: object_id, slug: 'music-engine'}),
                dataType: 'json',
                success: function (response) {
                    var songs = [];
                    if (object_type === "album") songs = response.songs;
                    if (object_type === "playlist") songs = response.songs;
                    if (object_type === "artist") songs = response.songs;
                    if (object_type === "profile") songs = response.songs;
                    $.enginePlayMedia.addSongsToPlayer(last, songs, forcePlay);
                }
            });
        },
        playUserRecentSongs: function (user_id) {
            $.ajax({
                type: "get", url: route.route('api.user.recent', {id: user_id}),
                success: function (response) {
                    if (response && response.songs) {
                        $.enginePlayMedia.addSongsToPlayer(false, response.songs.data, true);
                    }
                }
            });
        },
        playUserCollectionSongs: function (user_id) {
            $.ajax({
                type: "get", url: route.route('api.user.collection', {id: user_id}),
                success: function (response) {
                    if (response && response.songs) {
                        $.enginePlayMedia.addSongsToPlayer(false, response.songs.data, true);
                    }
                }
            });
        },
        playUserFavoritesSongs: function (user_id) {
            $.ajax({
                type: "get", url: route.route('api.user.favorites', {id: user_id}),
                success: function (response) {
                    if (response && response.songs) {
                        $.enginePlayMedia.addSongsToPlayer(false, response.songs.data, true);
                    }
                }
            });
        },
        playLatestEpisode: function (id) {
            $.ajax({
                type: "get", url: route.route('api.podcast', {id: id}),
                success: function (response) {
                    if (response && response.episodes) {
                        Playlist.playSongsNowOrNext([$.engineUtils.episodeToPlayerJson(response.episodes[0])], true);
                    }
                }
            });
        },
        Station: function (a) {
            if (EMBED.Playlist.length) {
                $.engineLightBox.show("lightbox-radioClearQueue");
                $(".radioClearQueue").find(".submit").one('click', function () {
                    $.engineLightBox.hide();
                    EMBED.Player.clearQueue();
                    $.enginePlayMedia.radio = true;
                    $.enginePlayMedia.radioStationData = {
                        type: a.data('type'),
                        id: a.data('id')
                    };
                    $('body').addClass("embed-radio-on");
                    $.enginePlayMedia.insertSongToRadioStation();
                });
            } else {
                $.enginePlayMedia.radio = true;
                $.enginePlayMedia.radioStationData = {
                    type: a.data('type'),
                    id: a.data('id')
                };
                $('body').addClass("embed-radio-on");
                $.enginePlayMedia.insertSongToRadioStation();
            }
        },
        insertSongToRadioStation: function () {
            //check if last song
            if ((EMBED.Playlist.length - 1) === EMBED.Player.queueNumber) {
                $.enginePlayMedia.getSongDataForRadio();
            } else {
                if (!EMBED.Playlist.length) {
                    __DEV__ && console.log("currently no song in queue, add then play right away");
                    $.enginePlayMedia.getSongDataForRadio();
                    setTimeout(function () {
                        EMBED.Player.playAt(0);
                    }, 2000);

                }
            }
        },
        getSongDataForRadio: function () {
            var type = $.enginePlayMedia.radioStationData.type;
            var id = $.enginePlayMedia.radioStationData.id;
            setTimeout(function () {
                $.ajax({
                    data: {
                        type: type,
                        id: id,
                        recent_songs: EMBED.Playlist.map(function (song) {
                            return song.id
                        }).join(",")
                    },
                    type: "post",
                    url: route.route('frontend.song.autoplay.get'),
                    success: function (response) {
                        if (response && response.id) {
                            Playlist.playSongsLast([$.engineUtils.toPlayerJson(response)])
                        } else {
                            Toast.show("error", Language.text.PLAYLIST_NO_SONGS);
                        }
                    }
                });
            }, 1000);

        }

    };
});

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

    window.Playlist = {
        liveRadio: false,
        renderPlayerForLiveRadio: function () {
            $('#embed_bottom_player').addClass('embed_live_radio');
        },
        renderPlayerSong: function () {
            $('#embed_bottom_player').removeClass('embed_live_radio');
        },
        playSongsNowOrNext: function (songs, forcePlay) {
            forcePlay = typeof forcePlay !== 'undefined' ? forcePlay : false;
            if(parseInt(songs[0].selling) && ! songs[0].streamable && ! parseInt(songs[0].preview)) {
                $.engineLightBox.show("lightbox-purchaseOnlyFeature");
                if(songs[0].subscription_url) {
                    $('[data-translate-text="SUBSCRIBE_NOW"]').attr('href', songs[0].subscription_url);
                }
                return false;
            }
            if(! songs[0].streamable && ! parseInt(songs[0].preview)) {
                if(User.isLogged()) {
                    $.engineLightBox.show("lightbox-vipOnlyFeature");
                    if(songs[0].subscription_url) {
                        $('[data-translate-text="SUBSCRIBE"]').attr('href', songs[0].subscription_url);
                    }
                } else {
                    User.SignIn.show();
                }
                return false;
            }

            var playableSongs = [];

            for(var i=0; i < songs.length; i++) {
                if(songs[i].streamable) {
                    playableSongs.push(songs[i]);
                }
            }

            if (Playlist.liveRadio) {
                EMBED.Player.clearQueue();
                setTimeout(function () {
                    Playlist.liveRadio = false;
                    EMBED.CanShowQueue = true;
                    Playlist.renderPlayerSong();
                    EMBED.Player.addSongsNextPlaying(playableSongs, forcePlay);
                    Toast.show("queue", playableSongs.length === 1 ? Language.text.POPUP_QUEUE_SONG_ADDED.replace(':numSongs', playableSongs.length) : Language.text.POPUP_QUEUE_SONGS_ADDED.replace(':numSongs', playableSongs.length));
                }, 1000);
            } else {
                Playlist.liveRadio = false;
                EMBED.CanShowQueue = true;
                Playlist.renderPlayerSong();
                EMBED.Player.addSongsNextPlaying(songs, forcePlay);
                Toast.show("queue", playableSongs.length === 1 ? Language.text.POPUP_QUEUE_SONG_ADDED.replace(':numSongs', playableSongs.length) : Language.text.POPUP_QUEUE_SONGS_ADDED.replace(':numSongs', playableSongs.length));
            }
        },
        playSongsLast: function (songs) {
            if (Playlist.liveRadio) {
                EMBED.Player.clearQueue();
                setTimeout(function () {
                    Playlist.liveRadio = false;
                    EMBED.CanShowQueue = true;
                    Playlist.renderPlayerSong();
                    EMBED.Player.addSongLastQueue(songs);
                    !$.enginePlayMedia.radio && Toast.show("queue", songs.length === 1 ? Language.text.POPUP_QUEUE_SONG_ADDED.replace(':numSongs', songs.length) : Language.text.POPUP_QUEUE_SONGS_ADDED.replace(':numSongs', songs.length));
                }, 1000);
            } else {
                Playlist.liveRadio = false;
                EMBED.CanShowQueue = true;
                Playlist.renderPlayerSong();
                EMBED.Player.addSongLastQueue(songs);
                !$.enginePlayMedia.radio && Toast.show("queue", songs.length === 1 ? Language.text.POPUP_QUEUE_SONG_ADDED.replace(':numSongs', songs.length) : Language.text.POPUP_QUEUE_SONGS_ADDED.replace(':numSongs', songs.length));
            }
        },
        playLiveRadioStation: function (songs, forcePlay) {
            forcePlay = typeof forcePlay !== 'undefined' ? forcePlay : false;
            if (EMBED.Playlist.length && !Playlist.liveRadio) {
                $.engineLightBox.show("lightbox-radioClearQueue");
                $(".radioClearQueue").find(".submit").one('click', function () {
                    Playlist.liveRadio = true;
                    EMBED.CanShowQueue = false;
                    $.engineLightBox.hide();
                    EMBED.Player.clearQueue();
                    setTimeout(function () {
                        Playlist.renderPlayerForLiveRadio();
                        EMBED.Player.addSongsNextPlaying(songs, forcePlay);
                        $('body').removeClass('embed_queue_open');
                        Toast.show("radio", "Starting radio station.", "Radio");
                    }, 1000);
                });
            } else {
                Playlist.liveRadio = true;
                EMBED.CanShowQueue = false;
                Playlist.renderPlayerForLiveRadio();
                EMBED.Player.addSongsNextPlaying(songs, forcePlay);
                $('body').removeClass('embed_queue_open');
                Toast.show("radio", "Starting radio station.", "Radio");
            }

        },
    };

    $.enginePlayerLimitation = {
        current: 0,
        init: function () {
            EMBED.Event.add(window, "embedPlayerEventSwitchSongTriggerClicked", function () {
                try {
                    $.enginePlayerLimitation.current++;
                    var limitation;
                    if(User.isLogged()) {
                        limitation = User.userInfo.track_skip_limit;
                    } else {
                        limitation = GLOBAL.track_skip_limit;
                    }
                    if(limitation !== 0 && $.enginePlayerLimitation.current > limitation) {
                        EMBED.AllowManuallySwitchSong = false;
                        $.engineLightBox.show("lightbox-vipOnlyFeature");
                        return false;
                    }
                } catch (e) {
                    __DEV__ && console.log('$.enginePlayerLimitation\'s issue');
                }
            });
        }
    };

    $.engineNextGenAd = {
        adPosition: 0,
        isPlaying: false,
        frequency: GLOBAL.ad_frequency,
        shouldLoop: true,
        currentLoop: 0,
        ready: false,
        audio: null,
        video: null,
        createElement: function(){
            if(! $.engineNextGenAd.ready) {
                var adEl = document.createElement('audio');
                adEl.id = 'ad-player';
                adEl.type = 'audio/mpeg';
                adEl.muted = true;
                $('body').append(adEl);
                $('<div/>', {
                    id: 'embed_audio_ad_title',
                }).appendTo('#embed_audio_ad');
                $('<div/>', {
                    id: 'embed_audio_progress',
                }).appendTo('#embed_audio_ad');
                $('<div/>', {
                    id: 'embed_audio_ad_skip',
                    class: 'd-none'
                }).html('Skip').appendTo('#embed_audio_ad');
                $.engineNextGenAd.ready = true;
                setTimeout(function () {
                    $.engineNextGenAd.audio = document.getElementById('ad-player');
                    $.engineNextGenAd.audio.addEventListener("ended", $.engineNextGenAd.Player.ended, false);
                    $.engineNextGenAd.audio.addEventListener("error", $.engineNextGenAd.Player.error, false);
                    $.engineNextGenAd.audio.addEventListener("playing", $.engineNextGenAd.Player.playing, false);
                    $.engineNextGenAd.audio.addEventListener("pause", $.engineNextGenAd.Player.pause, false);
                    $.engineNextGenAd.audio.addEventListener("waiting", $.engineNextGenAd.Player.waiting, false);
                    $.engineNextGenAd.audio.addEventListener("timeupdate", $.engineNextGenAd.Player.timeupdate, false);
                    $.engineNextGenAd.audio.addEventListener("canplay", $.engineNextGenAd.Player.canplay, false);
                }, 500);
                setTimeout(function () {
                    $.engineNextGenAd.video = document.getElementById('next-video-source');
                    $.engineNextGenAd.video.addEventListener("ended", $.engineNextGenAd.videoPlayer.ended, false);
                    $.engineNextGenAd.video.addEventListener("error", $.engineNextGenAd.videoPlayer.error, false);
                    $.engineNextGenAd.video.addEventListener("playing", $.engineNextGenAd.videoPlayer.playing, false);
                    $.engineNextGenAd.video.addEventListener("pause", $.engineNextGenAd.videoPlayer.pause, false);
                    $.engineNextGenAd.video.addEventListener("waiting", $.engineNextGenAd.videoPlayer.waiting, false);
                    $.engineNextGenAd.video.addEventListener("timeupdate", $.engineNextGenAd.videoPlayer.timeupdate, false);
                    $.engineNextGenAd.video.addEventListener("canplay", $.engineNextGenAd.videoPlayer.canplay, false);
                }, 500);
            }
        },
        Player: {
            ended: function () {
                $.engineNextGenAd.stopAd();
            },
            error: function () {

            },
            playing: function () {
                $('body').addClass('embed_audio_ad');
                $('body').removeClass('embed_queue_open');
                $('#embed_bottom_player').addClass('init');
            },
            pause: function () {

            },
            waiting: function () {

            },
            timeupdate: function () {
                try {
                    var percentage = Math.round((this.currentTime / this.duration) * 100);
                    $('#embed_audio_progress').css('width', percentage + '%');
                } catch(e){}
            },
            canplay: function () {

            }
        },
        videoPlayer: {
            ended: function () {
                $.engineNextGenAd.stopAd();
            },
            error: function () {

            },
            playing: function () {

            },
            pause: function () {

            },
            waiting: function () {

            },
            timeupdate: function () {

            },
            canplay: function () {

            }
        },
        stopAd: function () {
            $.engineNextGenAd.isPlaying = false;
            $.engineNextGenAd.audio.pause();
            $.engineNextGenAd.audio.muted = true;
            $.engineNextGenAd.video.pause();
            $.engineNextGenAd.video.muted = true;
            $('body').removeClass('embed_audio_ad');
            $.engineNextGenAd.audio.currentTime = 0;
            $('.next-generation')
                .removeClass('video_playing')
                .removeClass('d-flex')
                .addClass('d-none');
            setTimeout(function () {
                EMBED.Player.playPause();
            }, 500);
        },
        loadAd: function() {
            $.ajax({
                type: 'POST',
                url: route.route('frontend.ad.get'),
                cache: true,
                success: function (response) {
                    if(response.skippable) {
                        $('#embed_audio_ad_skip').removeClass('d-none');
                        $('.next-html-close').removeClass('hide');
                        $('.next-video-close').removeClass('hide');

                    } else {
                        $('#embed_audio_ad_skip').addClass('d-none')
                        $('.next-html-close').addClass('hide');
                        $('.next-video-close').addClass('hide');
                    }

                    if(response.type === 1) {
                        $.engineNextGenAd.isPlaying = true;
                        EMBED.Player.Audio.pause();
                        try {
                            youtubePlayer.pauseVideo();
                        } catch (e) {

                        }
                        $('#embed_audio_ad_title').html(response.description);
                        $('#ad-player').attr('src', response.stream_url);
                        $.engineNextGenAd.audio.play();
                        $.engineNextGenAd.audio.muted = false;
                        $('.next-generation')
                            .find('.next-video')
                            .removeClass('d-flex')
                            .addClass('d-none');
                        $('.next-generation').removeClass('video-playing');
                    } else if(response.type === 2) {
                        $.engineNextGenAd.isPlaying = true;
                        EMBED.Player.Audio.pause();
                        try {
                            youtubePlayer.pauseVideo();
                        } catch (e) {

                        }
                        $('.next-generation')
                            .removeClass('d-none')
                            .addClass('d-flex');
                        $('.next-generation')
                            .find('.next-video')
                            .removeClass('d-none')
                            .addClass('d-flex');
                        $('#next-video-source').attr('src', response.stream_url);
                        $.engineNextGenAd.video.play();
                        $.engineNextGenAd.video.muted = false;
                        $('.next-generation').addClass('video-playing');
                    }
                    if(response.code) {
                        $('.next-generation')
                            .removeClass('d-none')
                            .removeClass('d-flex');
                        $('.next-generation').find('.next-html').removeClass('d-none');
                        $('.next-generation')
                            .find('.next-html-content')
                            .attr('data-id', response.id)
                            .html(response.code);
                    } else {
                        $('.next-generation').find('.next-html').addClass('d-none');
                    }
                },
                error: function () {

                }
            });
        },
        init: function () {
            $.engineNextGenAd.createElement();
            $('#embed_audio_ad_skip').on('click', function () {
                $.engineNextGenAd.stopAd();
            });
            console.log('Ad starting');
            EMBED.Event.add(window, "embedQueueChanged", function () {
                console.log('CURRENT LOOP----' + $.engineNextGenAd.currentLoop);
                if($.engineNextGenAd.shouldLoop) {
                    $.engineNextGenAd.currentLoop++;
                    $.engineNextGenAd.shouldLoop = false;
                    setTimeout(function () {
                        $.engineNextGenAd.shouldLoop = true;
                    }, 2000)
                }
                if($.engineNextGenAd.currentLoop > $.engineNextGenAd.frequency) {
                    if(! GLOBAL.ad_support) {
                        return false;
                    }
                    $.engineNextGenAd.currentLoop = 0;
                    $.engineNextGenAd.loadAd();
                }
            });
        }
    };
    $(document).on('click', '.play-object[data-type=album]', function () {
        if(! User.isLogged() || User.userInfo.should_subscribe) {
            setTimeout(function () {
                $.engineNextGenAd.loadAd();
            }, 5000)
        }
    });
    $(document).on('click', '.next-html-content', function () {
        var adId = $(this).data('id')
        $.ajax({
            type: "post",
            data: {
                id: adId
            },
            url: route.route('frontend.ad.track'),
            dataType: 'json',
            success: function (response) {
            }
        });
    });
    $(document).on('click', '.next-video-close', function () {
        $.engineNextGenAd.stopAd();
    });
    $(document).on('click', '.next-html-close', function () {
        $('.next-generation').find('.next-html').addClass('d-none');
    });

    $(document).ready(function () {
        if($('body').hasClass('media-ad-enabled')) {
            $.engineNextGenAd.init();
        }
        try {
            if(!GLOBAL.hide_video_player) {
                $('body').addClass('embed_video_on');
            }
        } catch (e) {

        }

        EMBED.Event.add(window, "embedPlayerEventPlayingFired", function () {
            if($.engineNextGenAd.isPlaying) {
                __DEV__ && console.log('Pause main player cause ad is playing.');
                EMBED.Player.Audio.pause();
                try {
                    youtubePlayer.pauseVideo();
                } catch (e) {

                }
            }
        });

        $.enginePlayerLimitation.init();

        EMBED.Event.add(window, "embedPlayerEventErrorFired", function () {
            if ((EMBED.Playlist.length - 1) === EMBED.Player.queueNumber) {
                Toast.show("error", Language.text.ERROR_PLAYING_SONG);
            } else {
                Toast.show("error", Language.text.ERROR_HASNEXT_MESSAGE);
            }
            if (Playlist.liveRadio) {
                //Report to admin when player failed
                $.post(route.route('frontend.station.report'), {'id': EMBED.Playlist[EMBED.Player.queueNumber].id}, function (data) {
                });
            }
        });

        EMBED.Event.add(window, "embedQueueHasBeenClear", function () {
            $.enginePlayMedia.radio = false;
            $('body').removeClass("embed-radio-on")
        });
        var initialPlay = false;
        EMBED.Event.add(window, "embedQueueChanged", function () {
            if (initialPlay) return;
            initialPlay = true;
            setTimeout(function () {
                initialPlay = false;
            }, 2000);
            setTimeout(function () {
                if (EMBED.Playlist.length && !Playlist.liveRadio) {
                        EMBED.Playlist[EMBED.Player.queueNumber].id !== undefined && $.post(route.route('frontend.song.stream.track.played'), {'id': EMBED.Playlist[EMBED.Player.queueNumber].id, type: EMBED.Playlist[EMBED.Player.queueNumber].type}, function (data) {
                    });
                } else if (Playlist.liveRadio) {
                    $.post(route.route('frontend.station.played'), {'id': EMBED.Playlist[EMBED.Player.queueNumber].id}, function (data) {
                    });
                }
            }, 1000);

        });

        EMBED.Event.add(window, "embedQueueChanged", function () {
            setTimeout(function () {
                if (!EMBED.Playlist.length) {
                    return false;
                }
                if (!Playlist.liveRadio) {
                    var song = EMBED.Playlist[EMBED.Player.queueNumber];
                    $('.play-object[data-type="song"]')
                        .removeAttr('data-current')
                        .removeAttr('data-pause')
                        .removeAttr('data-playing')
                        .removeAttr('data-waiting');
                    $('.play-object[data-type="song"][data-id="' + song.id + '"]')
                        .attr('data-current', 'true')
                        .attr('data-waiting', 'true');
                } else {
                    var station = EMBED.Playlist[EMBED.Player.queueNumber];
                    $('.play-object[data-type="station"]')
                        .removeAttr('data-current')
                        .removeAttr('data-pause')
                        .removeAttr('data-playing')
                        .removeAttr('data-waiting');
                    $('.play-object[data-type="station"][data-id="' + station.id + '"]')
                        .attr('data-current', 'true')
                        .attr('data-waiting', 'true');
                }

                if (!Playlist.liveRadio && $.enginePlayMedia.radio) {
                    $.enginePlayMedia.insertSongToRadioStation($.enginePlayMedia.data);
                }
            }, 200);
            //Update queue song label

            $('#queue-menu-btn-label').html(Language.text.QUEUE_CURRENT_LABEL ? Language.text.QUEUE_CURRENT_LABEL.replace(':current', (EMBED.Player.queueNumber + 1) + '/' + EMBED.Playlist.length) : ('Queue :current songs').replace(':current', (EMBED.Player.queueNumber + 1) + '/' + EMBED.Playlist.length));
        });

        EMBED.Event.add(window, "embedPlayerEventPlayingFired", function () {
            if (!Playlist.liveRadio) {
                var song = EMBED.Playlist[EMBED.Player.queueNumber];
                var el = $('.play-object[data-type="song"][data-id="' + song.id + '"]');
                el.removeAttr('data-pause').removeAttr('data-waiting');
                el.attr('data-playing', 'true');
            } else {
                var station = EMBED.Playlist[EMBED.Player.queueNumber];
                var el = $('.play-object[data-type="station"][data-id="' + station.id + '"]');
                el.removeAttr('data-pause').removeAttr('data-waiting');
                el.attr('data-playing', 'true');
            }
        });

        EMBED.Event.add(window, "embedPlayerEventWaitingFired", function () {
            if (!Playlist.liveRadio) {
                var song = EMBED.Playlist[EMBED.Player.queueNumber];
                var el = $('.play-object[data-type="song"][data-id="' + song.id + '"]');
                el.removeAttr('data-pause').removeAttr('data-playing');
                el.attr('data-waiting', 'true');
            } else {
                var station = EMBED.Playlist[EMBED.Player.queueNumber];
                var el = $('.play-object[data-type="station"][data-id="' + station.id + '"]');
                el.removeAttr('data-pause').removeAttr('data-playing');
                el.attr('data-waiting', 'true');
            }
        });

        EMBED.Event.add(window, "embedPlayerEventPauseFired", function () {
            if (!EMBED.Playlist.length) {
                return false;
            }
            if (!Playlist.liveRadio) {
                var song = EMBED.Playlist[EMBED.Player.queueNumber];
                var el = $('.play-object[data-type="song"][data-id="' + song.id + '"]');
                el.removeAttr('data-waiting').removeAttr('data-playing');
                el.attr('data-pause', 'true');
            } else {
                var station = EMBED.Playlist[EMBED.Player.queueNumber];
                var el = $('.play-object[data-type="station"][data-id="' + station.id + '"]');
                el.removeAttr('data-waiting').removeAttr('data-playing');
                el.attr('data-pause', 'true');
            }
        });
        EMBED.Event.add(window, "embedPlayerEventEndedFired", function () {
            if (!EMBED.Playlist.length) {
                return false;
            }
            if (!Playlist.liveRadio) {
                var song = EMBED.Playlist[EMBED.Player.queueNumber];

                if(parseInt(song.selling) && ! song.streamable) {
                    $.engineLightBox.show("lightbox-purchaseOnlyFeature");
                    if(song.subscription_url) {
                        $('[data-translate-text="SUBSCRIBE_NOW"]').attr('href', song.subscription_url);
                    }
                    return false;
                }
                if(parseInt(song.preview) && ! song.streamable) {
                    $.engineLightBox.show("lightbox-vipOnlyFeature");
                    return false;
                }
            }
        });

        $(window).on("enginePageHasBeenLoaded", function () {
            if (!Playlist.liveRadio && EMBED.Playlist.length) {
                var song = EMBED.Playlist[EMBED.Player.queueNumber];
                var el = $('.play-object[data-type="song"][data-id="' + song.id + '"]');
                if (EMBED.Player.Audio.paused) {
                    el.attr('data-current', 'true').attr('data-pause', 'true');
                } else {
                    if (!EMBED.Player.Audio.currentTime) {
                        el.attr('data-current', 'true').attr('data-waiting', 'true');
                    } else {
                        el.attr('data-current', 'true').attr('data-playing', 'true');
                    }
                }
            } else if (EMBED.Playlist.length) {
                var station = EMBED.Playlist[EMBED.Player.queueNumber];
                var el = $('.play-object[data-type="station"][data-id="' + station.id + '"]');
                if (EMBED.Player.Audio.paused) {
                    el.attr('data-current', 'true').attr('data-pause', 'true');
                } else {
                    if (!EMBED.Player.Audio.currentTime) {
                        el.attr('data-current', 'true').attr('data-waiting', 'true');
                    } else {
                        el.attr('data-current', 'true').attr('data-playing', 'true');
                    }
                }
            }
        });

        if(GLOBAL.live_meta_data) {
            var liveFeedInterval = setInterval(function () {
                if(Playlist.liveRadio) {
                    var station = EMBED.Playlist[EMBED.Player.queueNumber];
                    $.ajax({
                        type: "post",
                        data: {
                            id: station.id
                        },
                        url: route.route('frontend.station.current.playing'),
                        dataType: 'json',
                        success: function (response) {
                            $.ajax({
                                url:'https://itunes.apple.com/search?term=' + encodeURIComponent(response.title) + '&entity=song&limit=5',
                                dataType: 'jsonp',
                                success:function(json){
                                    if(json.results.length) {
                                        $('#embed_coverart').css('background-image', 'url(' + json.results[0].artworkUrl100 + ')');
                                        $('#embed_display_song').html(json.results[0].trackName);
                                        $('#embed_display_artist').html(json.results[0].artistName).addClass('real_artist');
                                    }
                                },
                                error:function(){
                                    $('#embed_display_song').html(response.title);
                                    $('#embed_display_artist').removeClass('real_artist');
                                }
                            });

                        }
                    });
                }
            }, 5000);
        }

        if ('mediaSession' in navigator) {
            EMBED.Event.add(window, "embedPlayerEventPlayingFired", function () {
                var song = EMBED.Playlist[EMBED.Player.queueNumber];
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: song.title,
                    artist: song.artists.map(function (artist) {
                        return artist.name
                    }).join(", "),
                    album: null,
                    artwork: [
                        { src: song.artwork_url, sizes: '96x96',   type: 'image/png' },
                        { src: song.artwork_url, sizes: '128x128', type: 'image/png' },
                        { src: song.artwork_url, sizes: '192x192', type: 'image/png' },
                        { src: song.artwork_url, sizes: '256x256', type: 'image/png' },
                        { src: song.artwork_url, sizes: '384x384', type: 'image/png' },
                        { src: song.artwork_url, sizes: '512x512', type: 'image/png' },
                    ]
                });
            });

            try {
                navigator.mediaSession.setActionHandler('play', function() {
                    EMBED.Player.Audio.play();
                });
                navigator.mediaSession.setActionHandler('pause', function() {
                    EMBED.Player.Audio.pause();
                });
                navigator.mediaSession.setActionHandler('stop', function() {

                });
                navigator.mediaSession.setActionHandler('seekbackward', function() { /* Code excerpted. */ });
                navigator.mediaSession.setActionHandler('seekforward', function() { /* Code excerpted. */ });
                navigator.mediaSession.setActionHandler('seekto', function(e) {
                    EMBED.Player.Audio.currentTime = e.seekTime;
                });
                navigator.mediaSession.setActionHandler('previoustrack', function() {
                    EMBED.Player.previous();
                });
                navigator.mediaSession.setActionHandler('nexttrack', function() {
                    EMBED.Player.next();
                });
            } catch (e) {
                console.log('mediaSession is not supported')
            }
        }
    });
});
