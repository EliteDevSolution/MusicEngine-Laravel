(function($) {
    "use strict";
    /** Context menu */
    var currentSongFavorite = false;
    var currentSongLibrary = false;

    $.contextMenu.types.label = function (item, opt, root) {
        $('<div class="context-song"><div class="context-song-cover"><img src="" width="60" height="60" /></div><div class="context-song-info"><div class="title">...</div><div class="subtitle">...</div></div></div>')
            .appendTo(this)
            .on('click', 'li', function () {
                // do some funky stuff
                __DEV__ && console.log('Clicked on ' + $(this).text());
                // hide the menu
                root.$menu.trigger('contextmenu:hide');
            });
        this.addClass('labels').on('contextmenu:focus', function (e) {
        }).on('contextmenu:blur', function (e) {
        }).on('keydown', function (e) {
        });
    };

    $.contextMenu.types.subscription = function (item, opt, root) {
        $('<div class="context-subscription"><div class="context-subscription-text">' + Language.text.ENJOY_PREMIUM_FEATURES + '</div><a href="' + route.route('frontend.settings.subscription') + '" class="context-subscription-button">' + Language.text.SUBSCRIBE + '</a></div>')
            .appendTo(this)
            .on('click', 'li', function () {
                // do some funky stuff
                __DEV__ && console.log('Clicked on ' + $(this).text());
                // hide the menu
                root.$menu.trigger('contextmenu:hide');
            });
        this.addClass('labels').on('contextmenu:focus', function (e) {
        }).on('contextmenu:blur', function (e) {
        }).on('keydown', function (e) {
        });
    };

    /** Context menu */
    function ContextMenuAction(key, options) {
        __DEV__ && console.log(key);
        if (key === "queue_small") {
            $("body").removeClass("embed_large_queue");
            !$("body").hasClass("embed_queue_open") && $("#embed_list_icon").trigger('click');
            Cookies.remove('queue_size')
            Cookies.set('queue_size', 'small', {expires: 365})
        } else if (key === "queue_large") {
            $("body").addClass("embed_large_queue");
            !$("body").hasClass("embed_queue_open") && $("#embed_list_icon").trigger('click');
            Cookies.remove('queue_size')
            Cookies.set('queue_size', 'large', {expires: 365})
        } else if (key === "sort_song" || key === "sort_artist" || key === "sort_album" || key === "sort_relevance" || key === "sort_popularity" || key === "sort_station" || key === "sort_user" || key === "sort_playlist") {
            var $divs = $("#songs-grid, #user-profile-grid, .items-sort-able");
            var listItems = $divs.children('div').get();
            var AZOrderedDivs = listItems.sort(function (a, b) {
                if (key === "sort_song") {
                    $('.sort-label').html(Language.text.SONG).attr('data-translate-text', 'SONG');
                    return $(a).find(".title a").text().localeCompare($(b).find(".title a").text());
                } else if (key === "sort_artist") {
                    $('.sort-label').html(Language.text.ARTIST).attr('data-translate-text', 'ARTIST');
                    return $(a).find(".artist a").text().localeCompare($(b).find(".artist a").text());
                } else if (key === "sort_album") {
                    $('.sort-label').html(Language.text.ALBUM).attr('data-translate-text', 'ALBUM');
                    return $(a).find(".album a").text().localeCompare($(b).find(".album a").text());
                } else if (key === "sort_relevance") {
                    $('.sort-label').html(Language.text.RELEVANCE).attr('data-translate-text', 'RELEVANCE');
                    return $(a).attr('data-index') - $(b).attr('data-index');
                } else if (key === "sort_popularity") {
                    $('.sort-label').html(Language.text.POPULARITY).attr('data-translate-text', 'POPULARITY');
                    return $(b).attr('data-plays') - $(a).attr('data-plays');
                } else if (key === "sort_station") {
                    $('.sort-label').html(Language.text.STATION).attr('data-translate-text', 'STATION');
                    return $(a).find(".station a").text().localeCompare($(b).find(".station a").text());
                } else if (key === "sort_user") {
                    $('.sort-label').html(Language.text.USER).attr('data-translate-text', 'USER');
                    return $(a).find(".user a").text().localeCompare($(b).find(".user a").text());
                } else if (key === "sort_playlist") {
                    $('.sort-label').html(Language.text.PLAYLIST).attr('data-translate-text', 'PLAYLIST');
                    return $(a).find(".playlist a").text().localeCompare($(b).find(".playlist a").text());
                } else if (key === "sort_event") {
                    $('.sort-label').html(Language.text.SOONEST_DATE).attr('data-translate-text', 'SOONEST_DATE');
                    return $(a).find(".event a").text().localeCompare($(b).find(".event a").text());
                }
            });
            $("#songs-grid, #user-profile-grid, .items-sort-able").html(AZOrderedDivs);
        } else if (key === "share_song") {
            var song = $.engineUtils.getSongData(options.$trigger);
            Share.init("song", song.id);
        } else if (key === "episode_share") {
            var episode = $.engineUtils.getEpisodeData(options.$trigger);
            Share.init("episode", episode.id);
        } else if (key === "share_show") {
            var id = options.$trigger.data('id');
            Share.init("podcast", id);
        } else if (key === "podcast_report") {
            var id = options.$trigger.data('id');
            GlobalReport.popup("podcast", id);
        } else if (key === "queue_item_share_song") {
            var song_hash = options.$trigger.attr("id").replace("embed_current_playlist_row_", "");
            var song = EMBED.PlaylistObj.obj[song_hash];
            Share.init("song", song.id);
        } else if (key === "go_to_show") {
            var id = options.$trigger.data('id');
            var podcast = window['podcast_data_' + id];
            $(window).trigger({
                type: 'engineNeedHistoryChange',
                href: podcast.permalink_url
            });
        } else if (key === "queue_item_incorrect" || key === "queue_item_metadata") {
            var song_hash = options.$trigger.attr("id").replace("embed_current_playlist_row_", "");
            var song = EMBED.PlaylistObj.obj[song_hash];
            if (!User.isLogged()) {
                User.SignIn.show();
                return false;
            }
            Report.init('App\\Models\\Song', song.id, key === "queue_item_incorrect" ? Language.text.CONTEXT_FLAG_BAD_SONG : Language.text.CONTEXT_FLAG_BAD_METADATA, Language.text.SUCCESS_FLAG_SONG)
        } else if (key === "share_queue") {
            Share.init("queue", 1);
        } else if (key === "play_now" || key === "play_next" || key === "play_last") {
            __DEV__ && console.log(options.$trigger);
            var song = $.engineUtils.getSongData(options.$trigger);
            if(parseInt(song.pending)) {
                bootbox.alert({
                    title: 'Alert',
                    message: Language.text.PROCESSING_AUDIO,
                    centerVertical: true,
                    callback: function () {
                    }
                })
                return false;
            }
            if (key === "play_now") Playlist.playSongsNowOrNext([song], true);
            else if (key === "play_next") Playlist.playSongsNowOrNext([song]);
            else if (key === "play_last") Playlist.playSongsLast([song]);
        } else if (key === "episode_play_now" || key === "episode_play_next" || key === "episode_play_last") {
            __DEV__ && console.log(options.$trigger);
            var episode = $.engineUtils.getEpisodeData(options.$trigger);
            if(parseInt(episode.pending)) {
                bootbox.alert({
                    title: 'Alert',
                    message: Language.text.PROCESSING_AUDIO,
                    centerVertical: true,
                    callback: function () {
                    }
                })
                return false;
            }
            if (key === "episode_play_now") Playlist.playSongsNowOrNext([episode], true);
            else if (key === "episode_play_next") Playlist.playSongsNowOrNext([episode]);
            else if (key === "episode_play_last") Playlist.playSongsLast([episode]);
        } else if (key === "play_all_now") {
            ContextAction.playNow(options.$trigger)
        } else if (key === "play_all_next") {
            ContextAction.playNext(options.$trigger)
        } else if (key === "play_all_last") {
            ContextAction.playLast(options.$trigger);
        } else if (key === "add_all_queue") {
            ContextAction.playLast(options.$trigger);
        } else if (key === "add_all_favorite") {
            ContextAction.addToFavorite(options.$trigger);
        } else if (key === "add_all_library") {
            ContextAction.addToLibrary(options.$trigger);
        } else if (key === "replace_queue") {
            ContextAction.replaceQueue(options.$trigger);
        } else if (key === "play_replace_queue") {
            EMBED.Player.clearQueue();
            var el = options.$trigger;
            setTimeout(function () {
                $.enginePlayMedia.getObjectSongs(false, el.data('type'), el.data('id'), true);
            }, 1000);
        } else if (key.indexOf("playlist_id_") !== -1 || key === "new_playlist") {
            var playlist_id = key.replace(/\D+/g, '');
            __DEV__ && console.log(options.$trigger);
            if (options.$trigger.hasClass('embed_current_playlist_row')) {
                var id = options.$trigger.attr("id");
                var song_hash = id.replace("embed_current_playlist_row_", "");
                var song = EMBED.PlaylistObj.obj[song_hash];
                if(song.type === 'song') {
                    if (key === "new_playlist") {
                        User.Playlist.create(song.id, "song");
                    } else {
                        User.Playlist.addItem(song.id, "song", playlist_id);
                    }
                } else {
                    bootbox.alert({
                        title: "Alert",
                        message: "You can't add podcast's episode to playlist.",
                        centerVertical: true,
                        callback: function (result) {
                        }
                    });
                }
            } else {
                if (options.$menu.hasClass("context-menu-queue") === true || options.$trigger.hasClass('add-menu')) {
                    if (options.$trigger.hasClass('add-menu')) {
                        var area = options.$trigger.data('target');
                        var songs = ContextAction.getSongs(area);
                        var songids = [];
                        var num = songs.length;
                        for (var i = 0; i < num; i++) {
                            var songId = songs[i].id;
                            songids.push(songId);
                        }
                    } else {
                        var songids = [];
                        var addAbleArray = EMBED.Playlist.filter(function(obj) {
                            return (obj.type === 'song');
                        });
                        var num = addAbleArray.length;
                        for (var i = 0; i < num; i++) {
                            var songId = addAbleArray[i].id;
                            songids.push(songId);
                        }
                    }
                    if (key === "new_playlist" || key === "queue_to_mymusic") {
                        User.Playlist.create(1, 'queue', songids);
                    } else {
                        User.Playlist.addItem(1, 'queue', playlist_id, songids);
                    }
                } else {
                    var type = options.$trigger.data('type');
                    var id = options.$trigger.data('id');
                    var object = window[type + '_data_' + id];
                    if (key === "new_playlist") {
                        User.Playlist.create(object.id, type);
                    } else {
                        User.Playlist.addItem(object.id, type, playlist_id);
                    }
                }
            }
        } else if (key === "language") {
            $.engineLightBox.show("lightbox-locale");
        } else if (key === "settings") {
            $(window).trigger({
                type: 'engineNeedHistoryChange',
                href: "settings"
            })
        } else if (key === "feedback") {
            $.engineLightBox.show("lightbox-feedback");
            if (!User.isLogged()) {
                $('.lightbox-feedback').find('[name="email"]').val(User.userInfo.email);
            }
            return false;
        } else if (key === "invite") {
            Share.init('user', User.userInfo.id);
            return false;
        } else if (key === "activity_privacy") {
            $(window).trigger({
                type: 'engineNeedHistoryChange',
                href: "settings/preferences"
            });
        } else if (key === "my_artist") {
            if (!User.isLogged()) return false;
            $(window).trigger({
                type: 'engineNeedHistoryChange',
                href: route.route('frontend.auth.user.artist.manager')
            })
        } else if (key === "my_distributor") {
            if (!User.isLogged()) return false;
            $(window).trigger({
                type: 'engineNeedHistoryChange',
                href: route.route('frontend.distributor')
            })
        } else if (key === "my_profile") {
            if (!User.isLogged()) return false;
            $(window).trigger({
                type: 'engineNeedHistoryChange',
                href: User.userInfo.username
            })
        } else if (key === "my_music") {
            if (!User.isLogged()) return false;
            $(window).trigger({
                type: 'engineNeedHistoryChange',
                href: route.route('frontend.user.collection', {'username': User.userInfo.username})
            })
        } else if (key === "my_playlists") {
            if (!User.isLogged()) return false;
            $(window).trigger({
                type: 'engineNeedHistoryChange',
                href: route.route('frontend.user.playlists', {'username': User.userInfo.username})
            })
        } else if (key === "my_purchased") {
            if (!User.isLogged()) return false;
            $(window).trigger({
                type: 'engineNeedHistoryChange',
                href: route.route('frontend.user.purchased', {'username': User.userInfo.username})
            })
        } else if (key === "signout") {
            User.SignOut();
        } else if (key === "playlist-edit") {
            User.Playlist.rename(options.$trigger.data("id"));
        } else if (key === "enable-collaboration") {
            User.Playlist.collaborate.set(options.$trigger.data("id"), 1);
        } else if (key === "disable-collaboration") {
            User.Playlist.collaborate.set(options.$trigger.data("id"), 0);
        } else if (key === "invite-collaborate") {
            User.Playlist.collaborate.invite(options.$trigger.data("id"));
        } else if (key === "playlist-delete") {
            User.Playlist.delete(options.$trigger.data("id"));
        } else if (key === "clear_queue") {
            EMBED.Player.clearQueue();
        } else if (key === "restore_queue") {
            EMBED.Player.restore_queue();
        } else if (key === "addto" || key === "queue_item_addto") {
            if (!User.isLogged()) {
                User.SignIn.show();
                return false;
            }
        } else if (key === "add_favorite" || key === "un_favorite") {
            var song = $.engineUtils.getSongData(options.$trigger);
            Favorite.contextSet(song.id, 'song', song.favorite)
        } else if (key === "add_library" || key === "un_library") {
            var song = $.engineUtils.getSongData(options.$trigger);
            Library.contextSet(song.id, 'song', song.library)
        } else if (key === "add_queue") {
            var song = $.engineUtils.getSongData(options.$trigger);
            Playlist.playSongsLast([song])
        } else if (key === "queue_to_favorite") {
            Favorite.songs(EMBED.Playlist.filter(function(obj) {
                return (obj.type === 'song');
            }));
            for (var key in EMBED.PlaylistObj.obj) {
                if (EMBED.PlaylistObj.obj.hasOwnProperty(key)) {
                    EMBED.PlaylistObj.obj[key].favorite = true
                }
            }
            sessionStorage.setItem('queueObject', JSON.stringify(EMBED.PlaylistObj.obj));
        } else if (key === "queue_to_library") {
            Library.songs(EMBED.Playlist.filter(function(obj) {
                return (obj.type === 'song');
            }));
            for (var key in EMBED.PlaylistObj.obj) {
                if (EMBED.PlaylistObj.obj.hasOwnProperty(key)) {
                    EMBED.PlaylistObj.obj[key].library = true
                }
            }
            sessionStorage.setItem('queueObject', JSON.stringify(EMBED.PlaylistObj.obj));
        } else if (key === "queue_item_add_favorite") {
            var id = options.$trigger.attr("id");
            var song_hash = id.replace("embed_current_playlist_row_", "");
            var song = EMBED.PlaylistObj.obj[song_hash];
            Favorite.songs([song]);
            EMBED.PlaylistObj.obj[song_hash].favorite = true
            sessionStorage.setItem('queueObject', JSON.stringify(EMBED.PlaylistObj.obj));
        } else if (key === "queue_item_un_favorite") {
            var id = options.$trigger.attr("id");
            var song_hash = id.replace("embed_current_playlist_row_", "");
            var song = EMBED.PlaylistObj.obj[song_hash];
            Favorite.contextSet(song.id, 'song', true);
            EMBED.PlaylistObj.obj[song_hash].favorite = false
            sessionStorage.setItem('queueObject', JSON.stringify(EMBED.PlaylistObj.obj));
        } else if (key === "queue_item_add_library") {
            var id = options.$trigger.attr("id");
            var song_hash = id.replace("embed_current_playlist_row_", "");
            var song = EMBED.PlaylistObj.obj[song_hash];
            Library.songs([song]);
            EMBED.PlaylistObj.obj[song_hash].favorite = true
            sessionStorage.setItem('queueObject', JSON.stringify(EMBED.PlaylistObj.obj));
        } else if (key === "queue_item_un_library") {
            var id = options.$trigger.attr("id");
            var song_hash = id.replace("embed_current_playlist_row_", "");
            var song = EMBED.PlaylistObj.obj[song_hash];
            Library.contextSet(song.id, 'song', true);
            EMBED.PlaylistObj.obj[song_hash].library = false
            sessionStorage.setItem('queueObject', JSON.stringify(EMBED.PlaylistObj.obj));
        } else if (key === "queue_item_to_song_page") {
            var id = options.$trigger.attr("id");
            var song_hash = id.replace("embed_current_playlist_row_", "");
            var song = EMBED.PlaylistObj.obj[song_hash];
            $(window).trigger({
                type: 'engineNeedHistoryChange',
                href: song.permalink_url
            });
        } else if (key === "song_info") {
            console.log(options.$trigger.data("song-id"));
        } else if (key === "radio_toggle") {
            if ($("body").hasClass("embed-radio-on")) {
                $.enginePlayMedia.radio = false
            } else {
                if (!EMBED.Playlist.length) {
                    $.enginePlayMedia.radio = true;
                    $.enginePlayMedia.radioStationData = {
                        type: 'queue',
                        id: null
                    };
                    setTimeout(function () {
                        EMBED.Player.playAt(0);
                    }, 2000);

                } else {
                    $.enginePlayMedia.radio = true;
                    var el = $('#embed_list_middle');
                    var position = el.find('li:last').attr('position');
                    var song = EMBED.Playlist[position];
                    $.enginePlayMedia.radioStationData = {
                        type: 'song',
                        id: song.id
                    };
                    $.enginePlayMedia.getSongDataForRadio()
                }
            }
            $("body").toggleClass("embed-radio-on");
        } else if (key === "hd_audio_toggle") {
            if ((!User.isLogged() && !GLOBAL.hd_stream) || (User.isLogged() && !User.userInfo.can_stream_high_quality)) {
                $.engineLightBox.show("lightbox-vipOnlyFeature");
                return false;
            } else {
                if ((!User.isLogged() && GLOBAL.hd_stream) ||  User.userInfo.can_stream_high_quality) {
                    if (!$('body').hasClass("embed_hd_on")) {
                        Toast.show('success', Language.text.TOOLTIP_HD_DESCRIPTION, Language.text.TOOLTIP_HD_TITLE);
                    }
                    $.enginePlayMedia.hd = !$.enginePlayMedia.hd;
                    $('body').toggleClass("embed_hd_on");
                } else {
                    $.enginePlayMedia.hd = false;
                    $("body").removeClass("embed_hd_on");
                    $(window).trigger({
                        type: 'engineNeedHistoryChange',
                        href: route.route('frontend.settings.subscription')
                    });
                }
            }
        } else if (key === "video_toggle") {
            $.enginePlayMedia.video = !$.enginePlayMedia.video;
            $('body').toggleClass("embed_video_on");
        } else if (key === "dark_mode") {
            var e = $("body");
            e.toggleClass("dark-theme");
            Cookies.remove('darkMode')
            Cookies.set('darkMode', e.hasClass("dark-theme"), {expires: 365})
        } else if (key === "attach-song" || key === "attach-album" || key === "attach-artist" || key === "attach-playlist") {
            Community.share.attachMusic(key.replace('attach-', ''));
        } else if (key === "claim_artist") {
            $(window).trigger({
                type: 'engineNeedHistoryChange',
                href: route.route('frontend.auth.upload')
            });
        } else if (key === "play_artist_top_songs" || key === "play_playlist_now") {
            $.enginePlayMedia.getObjectSongs(false, options.$trigger.data('type'), options.$trigger.data('id'), true);
        } else if (key === "play_artist_next" || key === "play_playlist_next") {
            $.enginePlayMedia.getObjectSongs(false, options.$trigger.data('type'), options.$trigger.data('id'), false);
        } else if (key === "play_artist_last" || key === "play_playlist_last") {
            $.enginePlayMedia.getObjectSongs(true, options.$trigger.data('type'), options.$trigger.data('id'), false);
        } else if (key === "play_user_recent") {
            $.enginePlayMedia.playUserRecentSongs(options.$trigger.data('id'));
        } else if (key === "play_user_collection") {
            $.enginePlayMedia.playUserCollectionSongs(options.$trigger.data('id'));
        } else if (key === "play_user_favorites") {
            $.enginePlayMedia.playUserFavoritesSongs(options.$trigger.data('id'));
        } else if (key === "share") {
            Share.init(options.$trigger.data('type'), options.$trigger.data('id'));
        } else if (key === "view_songs") {
            if (User.isLogged()) {
                $(window).trigger({
                    type: 'engineNeedHistoryChange',
                    href: route.route('frontend.user.now_playing', {'username': User.userInfo.username})
                });
            } else {
                $(window).trigger({
                    type: 'engineNeedHistoryChange',
                    href: route.route('frontend.queue')
                });
            }
        } else if (key === "add_all_playlist") {
            if (!User.isLogged()) {
                User.SignIn.show();
                return false;
            }
        } else if (key === "comment-edit") {
            var root = options.$trigger.parents().eq(1);
            if (root.hasClass('module-comment')) {
                $.engineComments.editComment(options.$trigger, root);
            } else if (root.hasClass('response-row')) {
                $.engineComments.editReply(options.$trigger, root);

            }
        } else if (key === "comment-delete") {
            $.engineComments.delete(options.$trigger);
        } else if (key === "comment-report") {
            $.engineComments.report(options.$trigger);
        } else if (key === "download") {
            var song = $.engineUtils.getSongData(options.$trigger);
            Download.init(song);
        } else if (key === "queue_item_download") {
            var id = options.$trigger.attr("id");
            var song_hash = id.replace("embed_current_playlist_row_", "");
            var song = EMBED.PlaylistObj.obj[song_hash];
            Download.init(song);
        } else if (key === "queue_item_episode_download") {
            var id = options.$trigger.attr("id");
            var episode_hash = id.replace("embed_current_playlist_row_", "");
            var episode = EMBED.PlaylistObj.obj[episode_hash];
            console.log(episode);
        } else if (key === "remove_from_playlist") {
            var song = $.engineUtils.getSongData(options.$trigger);
            var removable_id = options.$trigger.data('removable-id');
            User.Playlist.removeItem(song, removable_id);
        } else if (key === "play_live_station") {
            $.enginePlayMedia.playNowOrNext(false, options.$trigger, true);
        } else if (key === "signup") {
            User.SignUp.init();
        } else if (key === "play_all_station") {
            $.enginePlayMedia.Station(options.$trigger);
        } else if (key === "queue_report_concern") {
            var id = options.$trigger.attr("id");
            var episode_hash = id.replace("embed_current_playlist_row_", "");
            var episode = EMBED.PlaylistObj.obj[episode_hash];
            GlobalReport.popup('episode', episode.id);
        } else if (key === "report") {
            var song = $.engineUtils.getSongData(options.$trigger);
            GlobalReport.popup('song', song.id);
        } else if (key === "episode_report") {
            var episode = $.engineUtils.getEpisodeData(options.$trigger);
            GlobalReport.popup('episode', episode.id);
        } else if (key === "go_offline") {
            $('#sidebar-offline-msg').removeClass('hide');
        } else if (key === "visible_everyone") {
            $('#sidebar-offline-msg').addClass('hide');
        } else if (key === "visible_friends") {
            $('#sidebar-offline-msg').addClass('hide');
        } else if (key === "my_admin") {
            window.open(User.userInfo.admin_panel_url);
        }
    }

    function QueueContextMenu() {
        var contextMenu = {
            "radio_toggle": {
                name: $.enginePlayMedia.radio ? Language.text.TURN_RADIO_OFF : Language.text.TURN_RADIO_ON,
                className: 'context-menu-radio-switch',
                disabled: Playlist.liveRadio
            },
            "hd_audio_toggle": {
                name: $.enginePlayMedia.hd ? Language.text.TURN_HD_QUALITY_OFF : Language.text.TURN_HD_QUALITY_ON,
                className: 'context-menu-hd-switch',
                disabled: Playlist.liveRadio
            },
            "video_toggle": {
                name: $.enginePlayMedia.video ? Language.text.CONTEXT_VIDEO_HIDE : Language.text.CONTEXT_VIDEO_SHOW,
                className: 'context-menu-video-switch',
                disabled: Playlist.liveRadio || ! EMBED.isYoutube
            },
        };

        if (User.isLogged() && !Playlist.liveRadio) {
            if ($.engineUtils.isMobile()) {
                Object.assign(contextMenu, {
                    "sep1": "---------",
                    "addto": {
                        name: User.isLogged() ? Language.text.CONTEXT_ADD_TO_PLAYLIST : Language.text.CONTEXT_NEW_PLAYLIST,
                        className: 'context-menu-save-queue',
                        items: User.isLogged() ? User.Playlists : null,

                    },
                    "addtocolla": {
                        name: User.isLogged() ? Language.text.CONTEXT_COLLABORATIVE_PLAYLIST : Language.text.CONTEXT_NEW_PLAYLIST,
                        items: User.isLogged() ? User.CollaboratePlaylists : null,
                        className: 'context-menu-save-queue',
                        disabled: !Object.keys(User.CollaboratePlaylists).length
                    },
                    "save": {
                        name: Language.text.QUEUE_SAVE_QUEUE,
                        className: 'context-menu-save-queue',
                        items: {
                            "queue_to_library": {name: Language.text.CONTEXT_ADD_TO_LIBRARY},
                            "queue_to_favorite": {name: Language.text.CONTEXT_ADD_TO_FAVORITES},
                        },
                    },
                });
            } else {
                Object.assign(contextMenu, {
                    "sep1": "---------",
                    "save": {
                        name: Language.text.QUEUE_SAVE_QUEUE,
                        items: {
                            "queue_to_library": {name: Language.text.CONTEXT_ADD_TO_LIBRARY},
                            "queue_to_favorite": {name: Language.text.CONTEXT_ADD_TO_FAVORITES},
                            "addto": {
                                name: User.isLogged() ? Language.text.CONTEXT_ADD_TO_PLAYLIST : Language.text.CONTEXT_NEW_PLAYLIST,
                                className: 'context-menu-save-queue',
                                items: User.isLogged() ? User.Playlists : null,
                            },
                            "addtocolla": {
                                name: User.isLogged() ? Language.text.CONTEXT_COLLABORATIVE_PLAYLIST : Language.text.CONTEXT_NEW_PLAYLIST,
                                items: User.isLogged() ? User.CollaboratePlaylists : null,
                                disabled: !Object.keys(User.CollaboratePlaylists).length
                            },
                        },
                    },
                });
            }
        }
        !Playlist.liveRadio && Object.assign(contextMenu, {
            "sep2": "---------",
        });
        Object.assign(contextMenu, {
            "view_songs": {name: Language.text.VIEW_SONGS},
        });
        Object.assign(contextMenu, {
            "size": {
                name: Language.text.QUEUE_SIZES,
                items: {
                    "queue_small": {name: Language.text.QUEUE_SMALL},
                    "queue_large": {name: Language.text.QUEUE_LARGE},
                },
                disabled: Playlist.liveRadio || $.engineUtils.isMobile()
            },
            "share_queue": {name: Language.text.SHARE, disabled: !EMBED.Playlist.length},
            "clear_queue": {
                name: Language.text.QUEUE_CLEAR_QUEUE,
                disabled: !EMBED.Playlist.length || Playlist.liveRadio
            },
            "restore_queue": {
                name: Language.text.QUEUE_RESTORE_QUEUE,
                disabled: !!EMBED.Playlist.length || !sessionStorage.getItem('queue')
            }
        });
        return contextMenu;
    }

    function AddSongContextMenu() {
        return {
            "add_queue": {name: Language.text.CONTEXT_ADD_TO_QUEUE},
            "add_library": {name: Language.text.CONTEXT_ADD_TO_LIBRARY, disabled: currentSongLibrary},
            "un_library": {name: Language.text.CONTEXT_REMOVE_FROM_LIBRARY, disabled: !currentSongLibrary},
            "add_favorite": {name: Language.text.CONTEXT_ADD_TO_FAVORITES, disabled: currentSongFavorite},
            "un_favorite": {name: Language.text.CONTEXT_REMOVE_FROM_FAVORITES, disabled: !currentSongFavorite},
            "sep2": "---------",
            "addto": {
                name: User.isLogged() ? Language.text.CONTEXT_ADD_TO_PLAYLIST_TIP : Language.text.CONTEXT_NEW_PLAYLIST,
                items: User.isLogged() ? User.Playlists : null,
            },
            "addtocolla": {
                name: User.isLogged() ? Language.text.CONTEXT_COLLABORATIVE_PLAYLIST : Language.text.CONTEXT_NEW_PLAYLIST,
                items: User.isLogged() ? User.CollaboratePlaylists : null,
                disabled: Object.keys(User.CollaboratePlaylists).length ? false : true
            },
        }
    }

    function QueueSongContextMenu($trigger) {
        var id = $trigger.attr("id");
        var song_hash = id.replace("embed_current_playlist_row_", "");
        var song = EMBED.PlaylistObj.obj[song_hash];
        if(song.type === 'song') {
            return {
                "label": {type: "label", customName: "Label", disabled: true, className: 'contextmenu-item-info'},
                "queue_item_add_library": {name: Language.text.CONTEXT_ADD_TO_LIBRARY, disabled: currentSongLibrary},
                "queue_item_un_library": {name: Language.text.CONTEXT_REMOVE_FROM_LIBRARY, disabled: !currentSongLibrary},
                "queue_item_add_favorite": {name: Language.text.CONTEXT_ADD_TO_FAVORITES, disabled: currentSongFavorite},
                "queue_item_un_favorite": {
                    name: Language.text.CONTEXT_REMOVE_FROM_FAVORITES,
                    disabled: !currentSongFavorite
                },
                "sep1": "---------",
                "queue_item_addto": {
                    name: User.isLogged() ? Language.text.CONTEXT_ADD_TO_PLAYLIST_TIP : Language.text.CONTEXT_NEW_PLAYLIST,
                    items: User.isLogged() ? User.Playlists : null,
                },
                "queue_item_addtocolla": {
                    name: User.isLogged() ? Language.text.CONTEXT_COLLABORATIVE_PLAYLIST : Language.text.CONTEXT_NEW_PLAYLIST,
                    items: User.isLogged() ? User.CollaboratePlaylists : null,
                    disabled: !Object.keys(User.CollaboratePlaylists).length
                },
                "sep3": "---------",
                "queue_item_download": {
                    name: Language.text.DOWNLOAD,
                    disabled: (!song.allow_download || ! song.mp3)
                },
                "queue_item_share_song": {name: Language.text.SHARE},
                "sep2": "---------",
                "flags": {
                    name: Language.text.CONTEXT_FLAG_SONG,
                    items: {
                        "queue_item_incorrect": {name: Language.text.CONTEXT_FLAG_BAD_SONG},
                        "queue_item_metadata": {name: Language.text.CONTEXT_FLAG_BAD_METADATA},
                    }
                },
                "queue_item_to_song_page": {name: Language.text.CONTEXT_GO_TO_SONG_PAGE},
            }
        } else if(song.type === 'episode') {
            return {
                label: {type: "label", customName: "Label", disabled: true, className: 'contextmenu-item-info'},
                "add_to": {name: Language.text.CONTEXT_ADD_TO_COLLECTION},
                "queue_report_concern": {name: Language.text.CONTEXT_REPORT_A_CONCERN},
                "sep1": "---------",
                "queue_item_episode_download": {
                    name: Language.text.DOWNLOAD,
                    disabled: (!song.stream_url && (!song.allow_download || ! data.mp3))
                },
                "share_episode": {name: Language.text.SHARE},
                "sep2": "---------",
                "flags": {
                    name: Language.text.CONTEXT_FLAG_EPISODE,
                    items: {
                        "queue_item_incorrect": {name: Language.text.CONTEXT_FLAG_BAD_SONG},
                        "queue_item_metadata": {name: Language.text.CONTEXT_FLAG_BAD_METADATA},
                    }
                },
                "queue_item_to_song_page": {name: Language.text.CONTEXT_GO_TO_PODCAST},
            }
        }
    }

    window.ContextAction = {
        htmlEvent: function (e) {
            var area = e.data('target');
            var type = e.data('type');
            var songs = ContextAction.getSongs(area);
            Playlist.playSongsNowOrNext(songs, type === 'play');
        },
        getSongs: function (area) {
            __DEV__ && console.log('get all song within ' + area);
            var songs = [];
            var playerSongsArray = [];
            $(area + ' .song').each(function (index, el) {
                songs.push(window['song_data_' + $(el).data('id')]);
            });

            if (songs.length) {
                var num = songs.length;
                for (var i = 0; i < num; i++) {
                    var song = $.engineUtils.toPlayerJson(songs[i]);
                    playerSongsArray.push(song);
                }
            }
            return playerSongsArray;
        },
        addNow: function (e) {
            var area = e.data('target');
            var songs = ContextAction.getSongs(area);
            Playlist.playSongsNowOrNext(songs, false);
        },
        playNow: function (e) {
            var area = e.data('target');
            var songs = ContextAction.getSongs(area);
            Playlist.playSongsNowOrNext(songs, true);
        },
        playNext: function (e) {
            var area = e.data('target');
            var songs = ContextAction.getSongs(area);
            Playlist.playSongsNowOrNext(songs, false);
        },
        playLast: function (e) {
            var area = e.data('target');
            var songs = ContextAction.getSongs(area);
            Playlist.playSongsLast(songs);
        },
        replaceQueue: function (e) {
            EMBED.Player.clearQueue();
            setTimeout(function () {
                var area = e.data('target');
                var songs = ContextAction.getSongs(area);
                Playlist.playSongsNowOrNext(songs, true);
            }, 1000);
        },
        addToFavorite: function (e) {
            var area = e.data('target');
            var songs = ContextAction.getSongs(area);
            Favorite.songs(songs);
        },
        addToLibrary: function (e) {
            var area = e.data('target');
            var songs = ContextAction.getSongs(area);
            Library.songs(songs);
        },
        startRadio: function () {

        }
    };
    $('body').delegate(".context-action", 'click', function (e) {
        ContextAction.htmlEvent($(this));
        e.preventDefault();
    });
    $('body').delegate(".play-now", 'click', function (e) {
        ContextAction.playNow($(this));
        e.preventDefault();
    });
    $('body').delegate(".add-now", 'click', function (e) {
        ContextAction.addNow($(this));
        e.preventDefault();
    });

    window.contextMenu = {
        preShow: function ($trigger) {
            var type = $trigger.data("type");
            var id = $trigger.data("id");
            var data = window[type + '_data_' + id];
            if (type === 'song') {
                var song = $.engineUtils.getSongData($trigger);
                __DEV__ && console.log(song);
                if (User.isLogged() && song.favorite) {
                    currentSongFavorite = true;
                } else {
                    currentSongFavorite = false;
                }
                if (User.isLogged() && song.library) {
                    currentSongLibrary = true;
                } else {
                    currentSongLibrary = false;
                }
            }
        },
        show: function (options) {
            $.engineUtils.mobileContextMenu.show();
            var type = options.$trigger.data("type");
            var id = options.$trigger.data("id");
            var data = window[type + '_data_' + id];
            if (type === 'song') {
                $(".context-song-cover img").attr("src", data.artwork_url);
                $(".context-song-info .title").html(data.title);
                $(".context-song-info .subtitle").html(data.artists.map(function (a) {
                    return a.name;
                }).join(", "));
            } else if (type === 'episode') {
                $(".context-song-cover img").attr("src", data.podcast.artwork_url);
                $(".context-song-info .title").html(data.title);
                $(".context-song-info .subtitle").html(data.podcast.title);
            } else if (type === 'podcast') {
                $(".context-song-cover img").attr("src", data.artwork_url);
                $(".context-song-info .title").html(data.title);
                $(".context-song-info .subtitle").html(data.artist.name);
            } else if (type === "playlist") {
                $(".context-song-cover img").attr("src", data.artwork_url);
                $(".context-song-info .title").html(data.title);
                $(".context-song-info .subtitle").html(data.user.name);
            } else if (type === "album") {
                $(".context-song-cover img").attr("src", data.artwork_url);
                $(".context-song-info .title").html(data.title);
                $(".context-song-info .subtitle").html(data.artists.map(function (a) {
                    return a.name;
                }).join(", "));
            } else if (type === "artist") {
                $(".context-song-cover img").attr("src", data.artwork_url);
                $(".context-song-info .title").html(data.name);
                $(".context-song-info .subtitle").remove();
            } else if (type === "station") {
                $(".context-song-cover img").attr("src", data.artwork_url);
                $(".context-song-info .title").html(data.title);
                $(".context-song-info .subtitle").remove();
            } else if (type === "user") {
                $(".context-song-cover img").attr("src", data.artwork_url);
                $(".context-song-info .title").html(data.name);
                $(".context-song-info .subtitle").html(data.follower_count === 1 ? Language.text.CONTEXT_USER_FOLLOWER.replace(':count', data.follower_count) : Language.text.CONTEXT_USER_FOLLOWERS.replace(':count', data.follower_count));
            }
        },
        hide: function () {
            $.engineUtils.mobileContextMenu.hide();
        },
        build: function ($trigger) {
            var type = $trigger.data("type");
            var id = $trigger.data("id");
            var contextMenu = {};
            var data = window[type + '_data_' + id];
            if (type === 'song') {
                contextMenu = {
                    label: {type: "label", customName: "Label", disabled: true, className: 'contextmenu-item-info'},
                    "play_now": {name: Language.text.CONTEXT_PLAY_SONG_NOW},
                    "play_next": {name: Language.text.CONTEXT_PLAY_SONG_NEXT},
                    "play_last": {name: Language.text.CONTEXT_PLAY_SONG_LAST},
                    "sep1": "---------",
                    "add_library": {name: Language.text.CONTEXT_ADD_TO_LIBRARY, disabled: currentSongLibrary},
                    "un_library": {name: Language.text.CONTEXT_REMOVE_FROM_LIBRARY, disabled: !currentSongLibrary},
                    "add_favorite": {name: Language.text.CONTEXT_ADD_TO_FAVORITES, disabled: currentSongFavorite},
                    "un_favorite": {name: Language.text.CONTEXT_REMOVE_FROM_FAVORITES, disabled: !currentSongFavorite},
                    "remove_from_playlist": {
                        name: Language.text.CONTEXT_REMOVE_FROM_PLAYLIST,
                        disabled: !$trigger.data("removable")
                    },
                    "sep2": "---------",
                    "addto": {
                        name: User.isLogged() ? Language.text.CONTEXT_ADD_TO_PLAYLIST : Language.text.CONTEXT_NEW_PLAYLIST,
                        items: User.isLogged() ? User.Playlists : null,
                    },
                    "addtocolla": {
                        name: User.isLogged() ? Language.text.CONTEXT_COLLABORATIVE_PLAYLIST : Language.text.CONTEXT_NEW_PLAYLIST,
                        items: User.isLogged() ? User.CollaboratePlaylists : null,
                        disabled: !Object.keys(User.CollaboratePlaylists).length
                    },
                    "sep3": "---------",
                    "share_song": {name: Language.text.SHARE},
                    "download": {
                        name: Language.text.DOWNLOAD,
                        disabled: (!data.allow_download || !data.mp3)
                    },
                    "sep4": "---------",
                    "report": {
                        name: Language.text.REPORT_A_PROBLEM
                    },
                }
            } else if (type === 'podcast') {
                contextMenu = {
                    label: {type: "label", customName: "Label", disabled: true, className: 'contextmenu-item-info'},
                    "podcast_report": {name: Language.text.CONTEXT_REPORT_A_CONCERN},
                    "sep1": "---------",
                    "share_show": {name: Language.text.SHARE_SHOW},
                    "sep2": "---------",
                    "go_to_show": {name: Language.text.GO_TO_SHOW},
                }
            } else if (type === 'episode') {
                contextMenu = {
                    "episode_report": {name: Language.text.CONTEXT_REPORT_A_CONCERN},
                    "sep1": "---------",
                    "episode_play_now": {name: Language.text.CONTEXT_PLAY_EPISODE_NOW},
                    "episode_play_next": {name: Language.text.CONTEXT_PLAY_EPISODE_NEXT},
                    "episode_play_last": {name: Language.text.CONTEXT_PLAY_EPISODE_LAST},
                    "sep2": "---------",
                    "episode_share": {name: Language.text.SHARE},
                }
            } else if (type === "playlist") {
                Object.assign(contextMenu, {
                    label: {type: "label", customName: "Label", disabled: true, className: 'contextmenu-item-info'},
                    "play_playlist_now": {name: Language.text.CONTEXT_PLAY_PLAYLIST_NOW},
                    "play_playlist_next": {name: Language.text.CONTEXT_PLAY_PLAYLIST_NEXT},
                    "play_playlist_last": {name: Language.text.CONTEXT_PLAY_PLAYLIST_LAST},
                    "play_replace_queue": {name: Language.text.CONTEXT_REPLACE_ALL_SONGS},
                    "sep1": "---------",
                    "add_playlist_library": {name: Language.text.CONTEXT_ADD_TO_LIBRARY},
                    "add_playlist_favorite": {name: Language.text.CONTEXT_ADD_TO_FAVORITES},
                    "sep2": "---------",
                    "addto": {
                        name: User.isLogged() ? Language.text.CONTEXT_ADD_TO_PLAYLIST : Language.text.CONTEXT_NEW_PLAYLIST,
                        items: User.isLogged() ? User.Playlists : null,
                    },
                    "addtocolla": {
                        name: User.isLogged() ? Language.text.CONTEXT_COLLABORATIVE_PLAYLIST : Language.text.CONTEXT_NEW_PLAYLIST,
                        items: User.isLogged() ? User.CollaboratePlaylists : null,
                        disabled: !User.isLogged() || (Object.keys(User.CollaboratePlaylists).length ? false : true)
                    },
                    "sep10": "---------",
                    "share": {name: Language.text.SHARE_PLAYLIST},
                });
            } else if (type === "album") {
                Object.assign(contextMenu, {
                    label: {type: "label", customName: "Label", disabled: true, className: 'contextmenu-item-info'},
                    "play_album_now": {name: Language.text.CONTEXT_PLAY_ALBUM_NOW},
                    "play_album_next": {name: Language.text.CONTEXT_PLAY_ALBUM_NEXT},
                    "play_album_last": {name: Language.text.CONTEXT_PLAY_ALBUM_LAST},
                    "play_replace_queue": {name: Language.text.CONTEXT_REPLACE_ALL_SONGS},
                    "sep1": "---------",
                    "add_album_library": {name: Language.text.CONTEXT_ADD_TO_LIBRARY},
                    "add_album_favorite": {name: Language.text.CONTEXT_ADD_TO_FAVORITES},
                    "sep2": "---------",
                    "addto": {
                        name: User.isLogged() ? Language.text.CONTEXT_ADD_TO_PLAYLIST_TIP : Language.text.CONTEXT_ADD_TO_PLAYLIST,
                        items: User.isLogged() ? User.Playlists : null,
                    },
                    "addtocolla": {
                        name: User.isLogged() ? Language.text.CONTEXT_COLLABORATIVE_PLAYLIST : Language.text.CONTEXT_NEW_PLAYLIST,
                        items: User.isLogged() ? User.CollaboratePlaylists : null,
                        disabled: !User.isLogged() || (Object.keys(User.CollaboratePlaylists).length ? false : true)
                    },
                    "sep10": "---------",
                    "share": {name: Language.text.SHARE_ALBUM},
                });
            } else if (type === "artist") {
                Object.assign(contextMenu, {
                    label: {type: "label", customName: "Label", disabled: true, className: 'contextmenu-item-info'},
                    "play_artist_top_songs": {name: Language.text.CONTEXT_PLAY_TOP_SONGS},
                    "play_artist_next": {name: Language.text.CONTEXT_PLAY_ARTIST_NEXT},
                    "play_artist_last": {name: Language.text.CONTEXT_PLAY_ARTIST_LAST},
                    "play_station": {name: "Play station"},
                    "add_favorite": {name: "Follow"},
                    "sep10": "---------",
                    "share": {name: Language.text.SHARE_ARTIST},
                });
            } else if (type === "station") {
                Object.assign(contextMenu, {
                    label: {type: "label", customName: "Label", disabled: true, className: 'contextmenu-item-info'},
                    "play_live_station": {name: Language.text.CONTEXT_PLAY},
                    "sep10": "---------",
                    "share": {name: Language.text.SHARE},
                });
            } else if (type === "user") {
                Object.assign(contextMenu, {
                    label: {type: "label", customName: "Label", disabled: true, className: 'contextmenu-item-info'},
                    "play_user_recent": {name: 'Play recent songs'},
                    "play_user_collection": {name: 'Play collection'},
                    "play_user_favorites": {name: 'Play favorites'},
                    "view_favorite": {name: 'View playlists'},
                    "sep10": "---------",
                    "play_user_station": {name: 'Play station'},
                    "share": {name: Language.text.SHARE},
                });
            }
            return contextMenu;
        }
    }

    $(document).ready(function () {
        $(window).resize(function () {
            $(window).trigger({
                type: "engineWindowSizeChange",
            });
        });
        $.contextMenu({
            selector: ".add-song",
            trigger: "left",
            zIndex: 10000,
            hideOnSecondTrigger: true,
            events: {
                preShow: function ($trigger) {
                    var song = $.engineUtils.getSongData($trigger);
                    __DEV__ && console.log(song);
                    if (User.isLogged() && song.favorite) {
                        currentSongFavorite = true;
                    } else {
                        currentSongFavorite = false;
                    }
                    if (User.isLogged() && song.library) {
                        currentSongLibrary = true;
                    } else {
                        currentSongLibrary = false;
                    }
                },
                show: function (options) {
                    $.engineUtils.mobileContextMenu.show();
                },
                hide: function () {
                    $.engineUtils.mobileContextMenu.hide();
                }
            },
            position: function (opt, x, y) {
                if ($(window).height() - (opt.$trigger.offset().top - $(window).scrollTop()) < 300) {
                    return opt.$menu.css({
                        bottom: $(document).height() - opt.$trigger.offset().top - opt.$menu.height() - opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                } else {
                    return opt.$menu.css({
                        top: opt.$trigger.offset().top + opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                }
            },
            build: function () {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: AddSongContextMenu()
                };
            }
        });
        /**
         * Context menu for song, playlist, album, artist
         */

        $.contextMenu({
            selector: "[data-toggle='contextmenu'][data-trigger='right']",
            trigger: "right",
            zIndex: 10000,
            events: {
                preShow: function (trigger) {
                    contextMenu.preShow(trigger)
                },
                show: function (options) {
                    contextMenu.show(options)
                },
                hide: function () {
                    contextMenu.hide()
                }
            },
            build: function ($trigger) {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: contextMenu.build($trigger)
                };
            }
        });
        $.contextMenu({
            selector: "[data-toggle='contextmenu'][data-trigger='left']",
            trigger: "left",
            zIndex: 10000,
            events: {
                preShow: function (trigger) {
                    contextMenu.preShow(trigger)
                },
                show: function (options) {
                    contextMenu.show(options)
                },
                hide: function () {
                    contextMenu.hide()
                }
            },
            build: function ($trigger) {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: contextMenu.build($trigger)
                };
            }
        });

        //Context menu for settings
        $.contextMenu({
            selector: '.artist-page-settings-menu',
            trigger: "left",
            zIndex: 10000,
            position: function (opt, x, y) {
                if ($(window).height() - (opt.$trigger.offset().top - $(window).scrollTop()) < 300) {
                    return opt.$menu.css({
                        bottom: $(document).height() - opt.$trigger.offset().top - opt.$menu.height() - opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                } else {
                    return opt.$menu.css({
                        top: opt.$trigger.offset().top + opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                }
            },
            hideOnSecondTrigger: true,
            build: function () {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: {
                        "claim_artist": {name: Language.text.CLAIM_ARTIST}
                    }
                };
            }
        });
        $.contextMenu({
            selector: '#settings-button, #header-settings-menu',
            trigger: "left",
            zIndex: 10000,
            hideOnSecondTrigger: true,
            className: function () {
                return "context-menu-settings";
            },
            position: function (opt, x, y) {
                opt.$menu.css({
                    top: opt.$trigger.position().top + opt.$trigger.height() + 20,
                    left: opt.$trigger.offset().left - opt.$menu.width() + 40,
                    position: 'fixed',
                });
            },
            events: {
                show: function (options) {
                    $.engineUtils.mobileContextMenu.show();
                    $("#settings-button").addClass("active");
                },
                hide: function () {
                    $.engineUtils.mobileContextMenu.hide();
                    $("#settings-button").removeClass("active");
                },
            },
            build: function () {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: {
                        "settings": {name: Language.text.SETTINGS, disabled: !User.isLogged()},
                        "language": {name: Language.text.LANGUAGE},
                        "feedback": {name: Language.text.FEEDBACK},
                        "invite": {name: Language.text.INVITE_FRIENDS, disabled: !User.isLogged()},
                        "claim_artist": {
                            name: Language.text.CLAIM_ARTIST,
                            disabled: !GLOBAL.allow_artist_claim || !User.isLogged() || Boolean(Number(User.userInfo.artist_id))
                        },
                        "dark_mode": {name: "Dark Mode", className: "context-menu-dark-mode-switch"},
                        "sep1": "---------",
                        "signup": {name: Language.text.SIGN_UP, disabled: User.isLogged() || Boolean(GLOBAL.disabled_registration)},
                        "signout": {name: Language.text.SIGN_OUT, disabled: !User.isLogged()},
                    }
                };
            }
        });

        $.contextMenu({
            selector: "#queue-menu-btn",
            trigger: "left",
            zIndex: 10000,
            className: 'context-menu-queue',
            hideOnSecondTrigger: true,
            events: {
                show: function (options) {
                    $.engineUtils.mobileContextMenu.show();
                    $("#queue-menu-btn").addClass("active");
                },
                hide: function () {
                    $.engineUtils.mobileContextMenu.hide();
                    $("#queue-menu-btn").removeClass("active")
                },
            },
            position: function (opt, x, y) {
                opt.$menu.css({
                    top: 'auto',
                    bottom: opt.$trigger.position().top + opt.$trigger.outerHeight(true) + 10 + ($('body').hasClass('embed_queue_open') ? $('#embed_list_container').height() : 0),
                    left: opt.$trigger.offset().left - ($('.context-menu-list').width() / 2) + (opt.$trigger.width() / 2),
                    position: 'fixed',
                });
            },
            build: function () {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: QueueContextMenu()
                };
            }
        });
        $.contextMenu({
            selector: '#embed_list_middle li',
            //trigger: 'right',
            zIndex: 10000,
            events: {
                preShow: function (el) {
                    var id = el.attr("id");
                    var song_hash = id.replace("embed_current_playlist_row_", "");
                    var song = EMBED.PlaylistObj.obj[song_hash];
                    if (User.isLogged() && song.favorite) {
                        currentSongFavorite = true;
                    } else {
                        currentSongFavorite = false;
                    }
                    if (User.isLogged() && song.library) {
                        currentSongLibrary = true;
                    } else {
                        currentSongLibrary = false;
                    }
                },
                show: function (options) {
                    //get song_hash, the unique key for each song
                    var id = options.$trigger.attr("id");
                    var song_hash = id.replace("embed_current_playlist_row_", "");
                    //get song data from song hash, it will return song data in object
                    var song = EMBED.PlaylistObj.obj[song_hash];
                    $(".context-song-cover img").attr("src", song.artwork_url);
                    $(".context-song-info .title").html(song.title);
                    $(".context-song-info .subtitle").html(song.artists.map(function (artist) {
                        return artist.name
                    }).join(", "));
                    //Force queue list to show as it will auto hide with mouse out of queue list area
                    $("#embed_list_container").addClass("show");
                },
                hide: function (options) {
                    //Hide queue list within contextmenu
                    $("#embed_list_container").removeClass("show");
                },
            },
            build: function ($trigger) {
                return {
                    callback: function (key, options) {
                        var id = options.$trigger.attr("id");
                        var song_hash = id.replace("embed_current_playlist_row_", "");
                        var song = EMBED.PlaylistObj.obj[song_hash];
                        ContextMenuAction(key, options, song)
                    },
                    items: QueueSongContextMenu($trigger)
                };
            }
        });

        $.contextMenu({
            selector: ".play-menu",
            trigger: "left",
            zIndex: 10000,
            hideOnSecondTrigger: true,
            position: function (opt, x, y) {
                if ($(window).height() - (opt.$trigger.offset().top - $(window).scrollTop()) < 300) {
                    return opt.$menu.css({
                        bottom: $(document).height() - opt.$trigger.offset().top - opt.$menu.height() - opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                } else {
                    return opt.$menu.css({
                        top: opt.$trigger.offset().top + opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                }
            },
            events: {
                show: function (options) {
                    $.engineUtils.mobileContextMenu.show();
                },
                hide: function () {
                    $.engineUtils.mobileContextMenu.hide();
                },
            },
            build: function () {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: {
                        "play_all_now": {name: Language.text.PLAY_NOW},
                        "play_all_next": {name: Language.text.PLAY_NEXT},
                        "play_all_last": {name: Language.text.PLAY_LAST},
                        "sep1": "---------",
                        "replace_queue": {name: "Replace Queue"},
                        "play_all_station": {name: "Play Radio Station"},
                    }
                };
            }
        });

        $.contextMenu({
            selector: ".add-menu",
            trigger: "left",
            zIndex: 10000,
            hideOnSecondTrigger: true,
            position: function (opt, x, y) {
                if ($(window).height() - (opt.$trigger.offset().top - $(window).scrollTop()) < 300) {
                    return opt.$menu.css({
                        bottom: $(document).height() - opt.$trigger.offset().top - opt.$menu.height() - opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                } else {
                    return opt.$menu.css({
                        top: opt.$trigger.offset().top + opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                }
            },
            events: {
                show: function (options) {
                    $.engineUtils.mobileContextMenu.show();
                },
                hide: function () {
                    $.engineUtils.mobileContextMenu.hide();
                },
            },
            build: function () {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: {
                        "add_all_queue": {name: Language.text.CONTEXT_ADD_TO_QUEUE},
                        "add_all_library": {name: Language.text.CONTEXT_ADD_TO_LIBRARY},
                        "add_all_favorite": {name: Language.text.CONTEXT_ADD_TO_FAVORITES},
                        "add_all_playlist": {
                            name: User.isLogged() ? Language.text.CONTEXT_ADD_TO_PLAYLIST_TIP : Language.text.CONTEXT_ADD_TO_PLAYLIST,
                            items: User.isLogged() ? User.Playlists : null,
                        },
                        "add_all_to_colla": {
                            name: User.isLogged() ? Language.text.CONTEXT_COLLABORATIVE_PLAYLIST : Language.text.CONTEXT_NEW_PLAYLIST,
                            items: User.isLogged() ? User.CollaboratePlaylists : null,
                            disabled: !User.isLogged() || (Object.keys(User.CollaboratePlaylists).length ? false : true)
                        },
                    }
                };
            }
        });

        $.contextMenu({
            selector: ".sort-button",
            trigger: "left",
            zIndex: 10000,
            hideOnSecondTrigger: true,
            position: function (opt, x, y) {
                if ($(window).height() - (opt.$trigger.offset().top - $(window).scrollTop()) < 300) {
                    return opt.$menu.css({
                        bottom: $(document).height() - opt.$trigger.offset().top - opt.$menu.height() - opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                } else {
                    return opt.$menu.css({
                        top: opt.$trigger.offset().top + opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                }
            },
            events: {
                show: function (options) {
                    $.engineUtils.mobileContextMenu.show();
                },
                hide: function () {
                    $.engineUtils.mobileContextMenu.hide();
                }
            },
            build: function ($trigger) {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: {
                        "sort_relevance": {name: Language.text.RELEVANCE, disabled: !$trigger.data('sort-relevance')},
                        "sort_popularity": {
                            name: Language.text.POPULARITY,
                            disabled: !$trigger.data('sort-popularity')
                        },
                        "sort_song": {name: Language.text.SONG, disabled: !$trigger.data('sort-song')},
                        "sort_artist": {name: Language.text.ARTIST, disabled: !$trigger.data('sort-artist')},
                        "sort_album": {name: Language.text.ALBUM, disabled: !$trigger.data('sort-album')},
                        "sort_user": {name: Language.text.USER, disabled: !$trigger.data('sort-user')},
                        "sort_station": {name: Language.text.STATION, disabled: !$trigger.data('sort-station')},
                        "sort_playlist": {name: Language.text.PLAYLIST, disabled: !$trigger.data('sort-playlist')},
                        "sort_event": {name: Language.text.SOONEST_DATE, disabled: !$trigger.data('sort-event')},
                    }
                };
            }
        });

        $.contextMenu({
            selector: ".recent-options",
            trigger: "left",
            zIndex: 10000,
            hideOnSecondTrigger: true,
            position: function (opt, x, y) {
                if ($(window).height() - (opt.$trigger.offset().top - $(window).scrollTop()) < 300) {
                    return opt.$menu.css({
                        bottom: $(document).height() - opt.$trigger.offset().top - opt.$menu.height() - opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                } else {
                    return opt.$menu.css({
                        top: opt.$trigger.offset().top + opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                }
            },
            events: {
                show: function (options) {
                    $.engineUtils.mobileContextMenu.show();
                },
                hide: function () {
                    $.engineUtils.mobileContextMenu.hide();
                },
            },
            build: function () {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: {
                        "activity_privacy": {name: Language.text.SETTINGS_MUSIC_PRIVACY_TITLE},
                    }
                };
            }
        });
        $.contextMenu({
            selector: "#profile-button",
            trigger: "left",
            zIndex: 10000,
            hideOnSecondTrigger: true,
            className: function () {
                return "context-menu-profile";
            },
            position: function (opt, x, y) {
                return opt.$menu.css({
                    top: opt.$trigger.offset().top + opt.$trigger.height() + 8,
                    left: opt.$trigger.offset().left - opt.$menu.width() + 40
                })
            },
            events: {
                show: function (options) {
                    $.engineUtils.mobileContextMenu.show();
                },
                hide: function () {
                    $.engineUtils.mobileContextMenu.hide();
                },
            },
            build: function () {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: {
                        'subscription': {
                            type: "subscription",
                            customName: "Label",
                            disabled: !User.userInfo.should_subscribe,
                            className: 'contextmenu-subscription-block'
                        },
                        "my_profile": {name: Language.text.PROFILE},
                        "my_distributor": {
                            name: Language.text.CONTEXT_DISTRIBUTOR,
                            disabled: (User.userInfo.distributor === undefined || ! User.userInfo.distributor)
                        },
                        "my_artist": {
                            name: Language.text.CONTEXT_ARTIST_MANAGER,
                            disabled: !Boolean(Number(User.userInfo.artist_id))
                        },
                        "my_music": {name: Language.text.MY_MUSIC},
                        "my_playlists": {name: Language.text.PLAYLISTS},
                        "my_purchased": {name: Language.text.PURCHASED},
                        "sep1": "---------",
                        "my_admin": {name: 'Admin Panel', disabled: ! User.userInfo.admin_panel},
                        "signout": {name: Language.text.SIGN_OUT},
                    }
                };
            }
        });
        $.contextMenu({
            selector: ".edit-playlist-context-trigger",
            trigger: "left",
            zIndex: 10000,
            hideOnSecondTrigger: true,
            position: function (opt, x, y) {
                if ($(window).height() - (opt.$trigger.offset().top - $(window).scrollTop()) < 300) {
                    return opt.$menu.css({
                        bottom: $(document).height() - opt.$trigger.offset().top - opt.$menu.height() - opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                } else {
                    return opt.$menu.css({
                        top: opt.$trigger.offset().top + opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                }
            },
            events: {
                show: function (options) {
                    $.engineUtils.mobileContextMenu.show();
                },
                hide: function () {
                    $.engineUtils.mobileContextMenu.hide();
                },
            },
            build: function ($trigger) {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: {
                        "enable-collaboration": {
                            name: Language.text.MAKE_COLLABORATIVE,
                            disabled: Boolean(Number(window['playlist_data_' + $trigger.data('id')].collaboration))
                        },
                        "invite-collaborate": {
                            name: Language.text.INVITE_COLLABORATORS,
                            disabled: !Boolean(Number(window['playlist_data_' + $trigger.data('id')].collaboration))
                        },
                        "disable-collaboration": {
                            name: Language.text.DISABLE_COLLABORATIVE,
                            disabled: !Boolean(Number(window['playlist_data_' + $trigger.data('id')].collaboration))
                        },
                        "playlist-edit": {name: Language.text.EDIT},
                        "playlist-delete": {name: Language.text.DELETE},
                    }
                };
            }
        });
        $.contextMenu({
            selector: ".attach-music",
            trigger: "left",
            zIndex: 10000,
            hideOnSecondTrigger: true,
            position: function (opt, x, y) {
                if ($(window).height() - (opt.$trigger.offset().top - $(window).scrollTop()) < 300) {
                    return opt.$menu.css({
                        bottom: $(document).height() - opt.$trigger.offset().top - opt.$menu.height() - opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                } else {
                    return opt.$menu.css({
                        top: opt.$trigger.offset().top + opt.$trigger.height(),
                        left: opt.$trigger.offset().left
                    })
                }
            },
            events: {
                show: function (options) {
                    $.engineUtils.mobileContextMenu.show();
                },
                hide: function () {
                    $.engineUtils.mobileContextMenu.hide();
                },
            },
            build: function () {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: {
                        "attach-song": {name: Language.text.SONG},
                        "attach-album": {name: Language.text.ALBUM},
                        "attach-artist": {name: Language.text.ARTIST},
                        "attach-playlist": {name: Language.text.PLAYLIST},
                    }
                };
            }
        });
        $.contextMenu({
            selector: ".comment-option-left-trigger",
            trigger: "left",
            zIndex: 10000,
            hideOnSecondTrigger: true,
            events: {
                show: function (options) {
                    $.engineUtils.mobileContextMenu.show();
                },
                hide: function () {
                    $.engineUtils.mobileContextMenu.hide();
                },
            },
            build: function ($trigger) {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: {
                        "comment-edit": {
                            name: Language.text.EDIT,
                            disabled: !User.isLogged() || ($trigger.data('user-id') !== User.userInfo.id)

                        },
                        "comment-delete": {
                            name: Language.text.DELETE,
                            disabled: !User.isLogged() || ($trigger.data('user-id') !== User.userInfo.id)
                        },
                        "comment-report": {name: 'Report this comment'},
                    }
                };
            }
        });

        $.contextMenu({
            selector: "#sidebar-settings",
            trigger: "left",
            zIndex: 10000,
            className: function () {
                return "context-menu-user-visible";
            },
            hideOnSecondTrigger: true,
            events: {

            },
            position: function (opt, x, y) {
                return opt.$menu.css({
                    top: 'auto',
                    bottom: opt.$trigger.height(),
                    left: opt.$trigger.offset().left - (opt.$menu.width() / 2)
                })
            },
            build: function () {
                return {
                    callback: function (key, options) {
                        ContextMenuAction(key, options)
                    },
                    items: {
                        "go_offline": {name: Language.text.GO_OFFLINE},
                        "visible_everyone": {name: Language.text.SIDEBAR_EVERYONE},
                        "visible_friends": {name: Language.text.SIDEBAR_FRIENDS},
                    }
                };
            }
        });

        $('.context-menu-save-queue').on('click', function () {
            $(this).addClass('context-menu-queue-sub-menu-active');
        })
    });
})(jQuery);