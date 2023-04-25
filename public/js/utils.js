/**
 * Music Engine Utils
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
    "use strict";

    /**
     * Enable DEV MODE to show console log.
     * @type {boolean}
     * @private
     */
    window.__DEV__ = true;

    $.engineUtils = {
        objectKeys: function (obj) {
            var count = 0;
            for (var prop in obj) {
                count++;
            }
            return count;
        },
        toPlayerJson: function (json) {
            __DEV__ && console.log(json);
            json.type = 'song';
            if (!json.title && json.id) {
                Toast.show("failed", "You are missing something", "Can't add song to Queue!");
                return false;
            }
            if (!json.streamable && json.preview) {
                json.hls = 0;
                json.mp3 = 1;
            }
            return json;
        },
        stationToPlayerJson: function (json) {
            json.type = 'song';
            if (!json.title && json.id) {
                Toast.show("failed", "You are missing something", "Can't start playing station!");
                return false;
            }
            var station = json;
            station.mp3 = 1;
            station.artists = [{id: 1, name: 'Live'}]
            return station;
        },
        episodeToPlayerJson: function (json) {
            json.type = 'episode';
            if (!json.title && json.id) {
                Toast.show("failed", "You are missing something", "Can't start playing station!");
                return false;
            }
            var episode = json;
            if(episode.stream_url) {
                episode.mp3 = 1;
            }
            episode.artwork_url = json.podcast.artwork_url;
            episode.artists = [{id: json.podcast.id, name: json.podcast.title}]
            return episode;
        },
        addRule: function (sheet, selector, styles) {
            if (sheet.insertRule) return sheet.insertRule(selector + " {" + styles + "}", sheet.cssRules.length);
            if (sheet.addRule) return sheet.addRule(selector, styles);
        },
        getSongData: function (el) {
            var id = el.data("id");
            var songData = window['song_data_' + id];
            return $.engineUtils.toPlayerJson(songData);
        },
        getEpisodeData: function (el) {
            var id = el.data("id");
            var episodeData = window['episode_data_' + id];
            episodeData.episode_type = episodeData.type;
            return $.engineUtils.episodeToPlayerJson(episodeData);
        },
        removeStorage: function (a) {
            try {
                sessionStorage.removeItem(a);
                sessionStorage.removeItem(a + "_expiresIn");
            } catch (a) {
                return console.log("removeStorage: Error removing key [" + key + "] from localStorage: " + JSON.stringify(a));
            }
            return !0
        },
        getStorage: function (a) {
            var b = Date.now(),
                c = sessionStorage.getItem(a + "_expiresIn");
            if (void 0 !== c && null !== c || (c = 0), c < b) return $.engineUtils.removeStorage(a), null;
            try {
                var d = sessionStorage.getItem(a);
                return d
            } catch (b) {
                return console.log("$.engineUtils.getStorage: Error reading key [" + a + "] from localStorage: " + JSON.stringify(b)), null
            }
        },
        setStorage: function (a, b, c) {
            c = void 0 === c || null === c ? 3600 : Math.abs(c);
            var d = Date.now(),
                e = d + 1e3 * c;
            try {
                sessionStorage.setItem(a, b), sessionStorage.setItem(a + "_expiresIn", e)
            } catch (b) {
                return console.log("$.engineUtils.setStorage: Error setting key [" + a + "] in localStorage: " + JSON.stringify(b)), !1
            }
            return !0
        },
        cleanStorage: function () {
            for (var key in sessionStorage) {
                if (key.indexOf('expiresIn') !== -1) {
                    var str = key.split('_')
                    sessionStorage.removeItem(str[0]);
                    sessionStorage.removeItem(key);
                }
            }
            __DEV__ && console.log("Cleaned sessionStorage");
        },
        buttonProgress: function (percent) {
            var currentPlaying = EMBED.Playlist[EMBED.Player.queueNumber];
            $(".song").removeClass("playing");
            $(".song[data-id=" + currentPlaying.id + "]").addClass("playing");
            var progressBorder = $(".button-process-container[data-song-id=" + currentPlaying.id + "] .buttonProgressBorder");
            var i;
            i = Math.floor(360 * percent);
            if (i <= 180) {
                progressBorder.css('background-image', 'linear-gradient(' + (90 + i) + 'deg, transparent 50%, #fff 50%),linear-gradient(90deg, #fff 50%, transparent 50%)');
            } else {
                progressBorder.css('background-image', 'linear-gradient(' + (i - 90) + 'deg, transparent 50%, #e23137 50%),linear-gradient(90deg, #fff 50%, transparent 50%)');
            }
        },
        isMobile: function () {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true;
            } else return false;
        },
        mobileContextMenu: {
            show: function () {
                //
                setTimeout(function () {
                    $(".context-menu-list").addClass("context-menu-mobile");
                    if ($.engineUtils.isMobile()) {
                        if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
                            $(".context-menu-submenu").hover(function () {
                                $(".context-menu-list:first").addClass("context-menu-submenu-active");
                            });
                        } else {
                            $(".context-menu-submenu").one('click', function () {
                                $(".context-menu-list:first").addClass("context-menu-submenu-active");
                            });
                        }
                    }
                }, 100);
                //$('body').addClass("no-scroll");

            },
            hide: function () {
                $('body').removeClass("no-scroll");
            }
        },
        makeSelectOption: function (el, data) {
            el.empty();
            data.forEach(function (item) {
                el.append('<option value="' + item.id + '">' + item.name + '</option>');
            });
        },
        humanTime: function (duration) {
            var hrs = ~~(duration / 3600);
            var mins = ~~((duration % 3600) / 60);
            var secs = ~~duration % 60;
            var ret = "";
            if (hrs > 0) {
                ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
            }
            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
            ret += "" + secs;
            return ret;
        },
        htmlDecode: function (input) {
            var doc = new DOMParser().parseFromString(input, "text/html");
            return doc.documentElement.textContent;
        }
    };
});