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

    window.NowPlaying = {
        currentSong: function (data) {
            __DEV__ && console.log(data);
            if (data === undefined || data.title === undefined) {
                return false;
            }
            var el = $('#now-playing-profile-card');
            var template = tmpl('tmpl-now-playing-card', data);
            el.html(template);
            window['song_data_' + data.id] = data;
        },
        queueSongs: function (data) {
            var num = data.length;
            for (var i = 0; i < num; i++) {
                var template = tmpl('tmpl-song-item', data[i]);
                if (data[i] !== undefined && data[i].title !== undefined) {
                    $("#now-playing-grid").append(template);
                    window['song_data_' + data[i].id] = data[i];
                }
            }
        },
        queueHasSongs: function () {
            $('#now-playing-header').removeClass("hide");
            $('#now-playing-profile-card').removeClass("hide");
            $('#grid-header-container').removeClass("hide");
            $('#now-playing-grid').removeClass("hide");
            $('#no-playing-songs-copy').addClass("hide");
            $('#no-song-grid-block').addClass("hide");
        },
        emptyQueue: function () {
            $('#now-playing-header').addClass("hide");
            $('#now-playing-profile-card').addClass("hide");
            $('#grid-header-container').addClass("hide");
            $('#now-playing-grid').addClass("hide");
            $('#no-playing-songs-copy').removeClass("hide");
            $('#no-song-grid-block').removeClass("hide");
        }
    };

    window.Firebase = {
        users: [],
        data: {},
        userStatus: [],
        dataStatus: {},
        checkNowPlaying: function () {
            var el = $('#queue-container');
            if (!el.length) {
                return false
            }
            if ((el.data('queue-by-username') && User.isLogged() && (User.userInfo.username !== el.data('queue-by-username')))) {
                var username = el.data('queue-by-username');
                Firebase.readUserQueue(username);
                __DEV__ && console.log('Firebase queue data', Firebase.data);
            } else {
                Firebase.checkNowPlayingLocal();
                __DEV__ && console.log('Local queue data', Firebase.data);
            }
        },
        checkNowPlayingLocal: function () {
            if (EMBED.Playlist.length) {
                NowPlaying.currentSong(EMBED.Playlist[EMBED.Player.queueNumber]);
                NowPlaying.queueSongs(EMBED.Playlist);
                __DEV__ && console.log('Queue data', EMBED.Playlist);
                NowPlaying.queueHasSongs();
            } else {
                NowPlaying.emptyQueue();
            }
        },
        handleChangeNowPlayingBlock: function (username) {
            __DEV__ && console.log('Render with firebase data ', username);
            if (Firebase.data[username] && Firebase.data[username].currentSong) {
                NowPlaying.currentSong(Firebase.data[username].currentSong);
                NowPlaying.queueSongs(Firebase.data[username].queueSongs);
                NowPlaying.queueHasSongs();
            } else {
                NowPlaying.emptyQueue();
            }
        },
        handleChange: function (username) {
            var userEl = $("[data-username-status=" + username + "]");
            if (Firebase.data[username] !== null && Firebase.data[username].currentSong.id) {
                var song = Firebase.data[username].currentSong;
                userEl.addClass('playing');
                userEl.attr('data-song-id', Firebase.data[username].currentSong.id);
                userEl.find(".subtitle").removeClass("hide").html(song.title).attr('href', song.permalink_url);
                userEl.find(".headline").removeClass("no-song");
                userEl.attr('data-id', song.id);
                userEl.attr('data-toggle', 'song-popover');
                userEl.attr('data-placement', 'left');
                userEl.attr('data-html', 'true');
                userEl.attr('data-target', 'tmpl-song-popover');
                MusicPopover.init();
            } else {
                userEl.removeClass('playing');
                userEl.removeAttr('data-song-id');
                userEl.removeAttr('data-toggle');
                userEl.find(".subtitle").addClass("hide");
                userEl.find(".headline").addClass("no-song");
            }
        },
        writeUserQueue: function () {
            if (Playlist.liveRadio) {
                return false;
            }
            if (User.isLogged()) {
                if (EMBED.Playlist.length) {
                    setTimeout(function () {
                        var songIds = [];
                        var num = EMBED.Playlist.length;
                        for (var i = 0; i < num; i++) {
                            var songId = EMBED.Playlist[i].id;
                            songIds.push(songId);
                        }
                        var currentPlaying = EMBED.Playlist[EMBED.Player.queueNumber];
                        try {
                            firebase.database().ref('users/' + User.userInfo.username + '/queue').set({
                                currentId: currentPlaying.id,
                                queueIds: songIds
                            });
                        } catch(e) {

                        }
                    }, 500)
                } else {
                    try {
                        firebase.database().ref('users/' + User.userInfo.username + '/queue').set(null);

                    } catch(e) {
                            
                    }
                    __DEV__ && console.log('Cleared firebase user queue.');
                }
                __DEV__ && console.log('writeUserQueue', EMBED.Playlist)
            }
            return false;
        },
        readUserQueue: function (username) {
            if (Firebase.users.includes(username)) {
                Firebase.handleChangeNowPlayingBlock(username);
                return false;
            }
            Firebase.users.push(username);
            var queue = firebase.database().ref('users/' + username + '/queue');
            queue.on('value', function (snap) {
                if (snap.val()) {
                    var data = snap.val();
                    __DEV__ && console.log('readUserQueue', username);
                    $.ajax({
                        url: route.route('frontend.user.now_playing.post', {'username': username}),
                        type: "post",
                        data: {
                            currentId: data.currentId,
                            queueIds: data.queueIds
                        },
                        dataType: 'json',
                        success: function (response) {
                            Firebase.data[username] = response;
                            Firebase.handleChange(username);
                            Firebase.handleChangeNowPlayingBlock(username);
                        }
                    });
                } else {
                    Firebase.data[username] = null;
                    Firebase.handleChange(username);
                    __DEV__ && console.log(username + " is not playing any song.");
                }
            });
        },
        pushUserStatus: function (username) {
            try {
                // since I can connect from multiple devices or browser tabs, we store each connection instance separately
                // any time that connectionsRef's value is null (i.e. has no children) I am offline
                var myConnectionsRef = firebase.database().ref('users/' + username + '/connections');
                // stores the timestamp of my last disconnect (the last time I was seen online)
                var lastOnlineRef = firebase.database().ref('users/' + username + '/lastOnline');

                var userQueueRef = firebase.database().ref('users/' + username + '/queue');

                var connectedRef = firebase.database().ref('.info/connected');
                connectedRef.on('value', function (snap) {
                    if (snap.val() === true) {
                        // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
                        var con = myConnectionsRef.push();
                        // When I disconnect, remove this device
                        con.onDisconnect().remove();
                        // Add this device to my connections list
                        // this value could contain info about the device or a timestamp too
                        con.set(true);
                        // When I disconnect, update the last time I was seen online
                        lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
                        userQueueRef.onDisconnect().set(null);
                    }
                });
            } catch (e) {
                console.log('Firebase real time database is not config correctly');
            }
        },
        handleOnlineStatus: function (username, status) {
            try {
                Firebase.dataStatus[username] = status;
                var lastOnlineRef = firebase.database().ref('users/' + username + '/lastOnline');
                var userStatusDiv = $("[data-username-status=" + username + "]");
                var inPageStatus = $('.user-online-status[data-username-status="' + username + '"]');
                if (status !== null) {
                    __DEV__ && console.log(username + " is online");
                    inPageStatus.removeClass("hide");
                    userStatusDiv.find(".online").removeClass("hide");
                    userStatusDiv.find(".offline").addClass("hide");
                    Firebase.readUserQueue(username);
                    userStatusDiv.find(".offline").html('');
                    clearInterval(window[username + 'interval']);
                    lastOnlineRef.off();
                } else {
                    inPageStatus.addClass("hide");
                    userStatusDiv.find(".offline").removeClass("hide");
                    userStatusDiv.find(".online").addClass("hide");
                    lastOnlineRef.on('value', function (snap) {
                        if (snap.val()) {
                            userStatusDiv.find(".offline").html(Firebase.timeSince(snap.val()));
                            window[username + 'interval'] = setInterval(function () {
                                userStatusDiv.find(".offline").html(Firebase.timeSince(snap.val()));
                            }, 60000);

                        }
                    });
                }
            } catch (e) {
                console.log('Firebase real time database is not config correctly');
            }
        },
        checkUserOnlineStatus: function (username) {
            try {
                if (!username) return false;
                if (Firebase.userStatus.includes(username)) return false;
                Firebase.userStatus.push(username);
                var connectedRef = firebase.database().ref('users/' + username + '/connections');
                connectedRef.on('value', function (snap) {
                    Firebase.handleOnlineStatus(username, snap.val());
                });
            } catch (e) {
                console.log('Firebase real time database is not config correctly');
            }
        },
        inPageUserOnlineStatus: function () {
            try {
                $('.user-online-status').each(function (index) {
                    var username = $(this).data('username-status');
                    Firebase.handleOnlineStatus(username, Firebase.dataStatus[username]);
                    Firebase.checkUserOnlineStatus(username);
                });
            } catch (e) {
                console.log('Firebase real time database is not config correctly');
            }
        },
        timeSince: function (timeStamp) {
            var now = new Date(),
                secondsPast = (now.getTime() - timeStamp) / 1000;
            if (secondsPast < 60) {
                //return parseInt(secondsPast) + 's';
                return '1m';
            }
            if (secondsPast < 3600) {
                return parseInt(secondsPast / 60) + 'm';
            }
            if (secondsPast <= 86400) {
                return parseInt(secondsPast / 3600) + 'h';
            }
            if (secondsPast > 86400) {
                timeStamp = new Date(timeStamp);
                var day = timeStamp.getDate();
                var month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
                var year = timeStamp.getFullYear() === now.getFullYear() ? "" : " " + timeStamp.getFullYear();
                return day + " " + month + year;
            }
        }
    };

    $(window).on("enginePageHasBeenLoaded", Firebase.checkNowPlaying);
    $(window).on("enginePageHasBeenLoaded", Firebase.inPageUserOnlineStatus);
    $(document).ready(function () {
        EMBED.Event.add(window, "embedQueueChanged", function () {
            Firebase.checkNowPlaying();
            Firebase.writeUserQueue();
        });
    });
    $(document).ready(Firebase.checkNowPlaying);
});