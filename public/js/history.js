/**
 * Music Engine History
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
    $.engineHistory = {};

    $.engineHistoryUseHistoryAPI = false;
    $.engineHistoryUseHashChange = false;
    $.engineHistoryHref = null;
    $.engineHistoryOriginalHref = null;
    $.engineHistoryLastHref = null;
    $.engineHistoryAnchor = {
        click: function (f) {
            var a = $(this);
            var href = a.attr('href');
            if (! a.attr('target')) {
                if (href) {
                    if (a.hasClass("show-song-tooltip") === true) {
                        $(".community-playing").addClass("hide").removeClass("no-arrow");
                        if ($.engineUtils.isMobilfe()) {
                            var el = $(".community-playing");
                            $("#lightbox-overlay").show();
                            el.addClass("no-arrow")
                            var song = window['song_data_' + a.data("id")];
                            if (song && song.id !== undefined) {
                                el.find(".song-link:not(.image)").html(song.title).attr("data-song-id", song.id).attr('href', song.songurl);
                                el.find(".artist-link").html(song.artistname).attr('href', song.artisturl);
                                el.find(".album-link").html(song.albumname).attr('href', song.albumurl);
                                el.find(".song-artwork").attr("src", song.artwork_url);
                                el.find(".play").attr("data-song-id", song.id);
                            } else {
                                $(".community-playing").addClass("hide").removeClass("no-arrow");
                            }
                            el.removeClass("hide");
                            el.addClass("animation");
                            $("#lightbox-overlay").one('click', function () {
                                el.addClass("hide");
                                $("#lightbox-overlay").hide();

                            });
                            return false;
                        }
                    }
                    $(window).trigger({
                        type: 'engineNeedHistoryChange',
                        href: href
                    });
                    $.engineHistoryLastHref = $.engineHistoryHref;
                    return false;
                } else {
                    if (a.hasClass("close") === true) {
                        $.engineLightBox.hide();
                        return false;
                    } else if (a.hasClass("login") === true) {
                        $.engineLightBox.hide();
                        User.SignIn.show();
                        return false;
                    } else if (a.hasClass("open-signup") === true) {
                        $.engineLightBox.hide();
                        $.engineLightBox.show("lightbox-signup");
                        User.SignUp.init();
                        return false;
                    } else if (a.hasClass("forgot") === true) {
                        $.engineLightBox.hide();
                        $.engineLightBox.show("lightbox-forget");
                        return false;
                    } else if (a.hasClass("create-account") === true) {
                        User.SignUp.init();
                        return false;
                    } else if (a.hasClass("share") === true) {
                        Share.init(a.data("type"), a.data("id"));
                        return false;
                    } else if (a.hasClass("make-payment") === true) {
                        Payment.init(a);
                        return false;
                    } else if (a.hasClass("play-object") === true) {
                        if(!EMBED.iOSInit && $.engineUtils.isMobile()) {
                            try {
                                youtubePlayer.playVideo();
                                youtubePlayer.pauseVideo();
                            } catch (e) {

                            }
                        }

                        if (a.attr('data-current')) {
                            EMBED.Player.playPause();
                        } else {
                            $.enginePlayMedia.playNowOrNext(false, a, true);
                        }
                    } else if (a.hasClass("column2-tab") === true) {
                        $(".column2-tab").removeClass("active");
                        a.addClass("active");
                        if (a.hasClass("show-comments")) {
                            $("#comments").removeClass("hide");
                            $("#activity").addClass("hide");
                        } else {
                            $("#comments").addClass("hide");
                            $("#activity").removeClass("hide");
                        }
                    } else if (a.hasClass("create-playlist") === true) {
                        User.Playlist.create();
                        if ($.engineUtils.isMobile()) {
                            $.engineSideBar.hide();
                        }
                    } else if (a.hasClass("favorite") === true) {
                        Favorite.set(a);
                    } else if (a.hasClass("collaborate") === true) {
                        User.Playlist.collaborate.approve(a);
                    } else if (a.hasClass("song-row-edit") === true) {
                        var song = $.engineUtils.getSongData(a);
                        Artist.editSong(song);
                    } else if (a.hasClass("episode-row-edit") === true) {
                        var episode = $.engineUtils.getEpisodeData(a);
                        Artist.editEpisode(episode);
                    } else if (a.hasClass("song-row-delete") === true) {
                        var song = $.engineUtils.getSongData(a);
                        Artist.deleteSong(song);
                    } else if (a.hasClass("create-album") === true) {
                        Artist.createAlbum();
                    } else if (a.hasClass("add-video") === true) {
                        Artist.addVideo();
                    } else if (a.hasClass("create-show") === true) {
                        Artist.createPodcastShow();
                    } else if (a.hasClass("import-podcast-rss") === true) {
                        Artist.importPodcastRss();
                    } else if (a.hasClass("edit") === true) {
                        if (a.data('type') === 'album') {
                            Artist.editAlbum(a);
                        } else if (a.data('type') === 'podcast') {
                            Artist.editPodcastShow(a);
                        } else if (a.data('type') === 'video') {
                            Artist.editVideo(a);
                        }
                    } else if (a.hasClass("delete-event-cta") === true) {
                        User.Actions.removeActivity(a);
                    } else if (a.hasClass("play-station") === true) {
                        $.enginePlayMedia.Station(a);
                    } else if (a.hasClass("view-selector") === true) {
                        $('.view-selector').removeClass('active');
                        a.addClass('active');
                        var target = a.data('target');
                        var view = a.data('view');
                        view === 'grid' ? $(target).addClass('grid-view') : $(target).removeClass('grid-view');
                    } else if (a.hasClass("cancel-subscription") === true) {
                        User.Subscription.cancel();
                    } else if (a.hasClass("delete") === true) {
                        if (a.data('type') === 'album') {
                            Artist.deleteAlbum(a)
                        } else if (a.data('type') === 'podcast') {
                            Artist.deletePodcast(a)
                        } else if (a.data('type') === 'video') {
                            Artist.deleteVideo(a)
                        }
                    } else if (a.hasClass("create-event") === true) {
                        Artist.event.create();
                    } else if (a.hasClass("event-row-edit") === true) {
                        Artist.event.edit(a);
                    } else if (a.hasClass("event-row-delete") === true) {
                        Artist.event.delete(a);
                    } else if (a.hasClass("claim-artist-access") === true) {
                        Artist.claim.init(a);
                    }
                    return false;
                }
            }
        }
    };

    $.engineHistoryHashChange = function () {
        $.engineHistoryHref = location.hash.substr(3);
        $(window).trigger({
            type: "engineHistoryChange",
            href: $.engineHistoryHref,
            lastHref: $.engineHistoryLastHref
        })
    };
    $.engineHistoryPopstate = function (a) {
        if (a.originalEvent.state !== null) {
            $.engineHistoryLastHref = $.engineHistoryHref;
            $.engineHistoryHref = a.originalEvent.state.href;
            $(window).trigger({
                type: "engineHistoryChange",
                href: $.engineHistoryHref,
                lastHref: $.engineHistoryLastHref
            })
        }
    };
    $.engineHistoryNeedChange = function (a) {
        var url = a.href;
        if (/^(?:[a-z]+:)?\/\//i.test(url)) {
            url = new URL(url);
            if (!url.search && window.location.pathname === url.pathname) {
                return false;
            }
            if (!url.search) {
                url = url.pathname.substr(1);
            } else {
                url = url.pathname.substr(1) + url.search;
            }

        } else {
            if (url.charAt(0) === '/') {
                if (window.location.pathname === url) {
                    return false;
                }
                url = url.substr(1)
            }
        }
        $.engineHistoryLastHref = $.engineHistoryHref;
        if ($.engineHistoryUseHistoryAPI === true) {
            $.engineHistoryHref = url;
            history.pushState({
                href: $.engineHistoryHref
            }, $.engineHistoryHref, '/' + $.engineHistoryHref);
            $(window).trigger({
                type: "engineHistoryChange",
                href: $.engineHistoryHref,
                lastHref: $.engineHistoryLastHref
            })
        } else {
            if ($.engineHistoryUseHashChange === true) {
                $.engineHistoryHref = url;
                location.hash = "!/" + $.engineHistoryHref;
                $(window).trigger({
                    type: "engineHistoryChange",
                    href: $.engineHistoryHref,
                    lastHref: $.engineHistoryLastHref
                })
            }
        }
    };
    $.engineHistoryPageLoad = function () {
        var a = $.engineHistoryOriginalHref;
        if ($.engineHistoryHref) {
            a = $.engineHistoryHref
        }
        $(window).trigger({
            type: "engineHistoryChange",
            href: a,
            lastHref: $.engineHistoryLastHref
        });
    };

    $.engineHistoryHref = location.pathname.substr(1);
    if (history.pushState) {
        $.engineHistoryUseHistoryAPI = true;
        if (location.hash !== "") {
            if (location.hash.indexOf("#!/") !== -1) {
                location.href = "/" + location.hash.substr(3)
            }
        }
        history.pushState({
            href: $.engineHistoryHref
        }, $.engineHistoryHref, "/" + $.engineHistoryHref);
        $(window).on("popstate", $.engineHistoryPopstate)
    }
    if ($.engineHistoryUseHistoryAPI === false) {
        try {
            window.addEventListener("hashchange", $.engineHistoryHashChange, false);
            $.engineHistoryUseHashChange = true;
            if (location.pathname !== "/") {
                location.href = "/#!/" + $.engineHistoryHref
            } else {
                $.engineHistoryHref = location.hash.substr(3)
            }
        } catch (a) {
        }
        try {
            window.attachEvent("onhashchange", $.engineHistoryHashChange);
            $.engineHistoryUseHashChange = true;
            if (location.pathname !== "/") {
                location.href = "/#!/" + $.engineHistoryHref
            } else {
                $.engineHistoryHref = location.hash.substr(3)
            }
        } catch (a) {
        }
    }
    $.engineHistoryOriginalHref = $.engineHistoryHref;
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
    $.engineBrowseHistory = {};

    $.engineBrowseHistory.engineHistoryChange = function (a) {
        var getCache = $.engineUtils.getStorage("/" + a.href);
        if (getCache === null || getCache === undefined) {
            $.ajax({
                url: "/" + a.href,
                type: "get",
                beforeSend: function () {

                },
                success: function (response) {
                    $("#page").html(response);
                    if(route.route('frontend.settings.preferences').replace(route.route('frontend.homepage'), '') !== a.href && route.route('frontend.auth.user.artist.manager.uploaded').replace(route.route('frontend.homepage'), '') !== a.href && route.route('frontend.cart').replace(route.route('frontend.homepage'), '') !== a.href) {
                        $.engineUtils.setStorage("/" + a.href, response);
                    }
                    $(window).trigger({
                        type: "enginePageHasBeenLoaded",
                    });
                }
            });
        } else {
            $("#page").html(getCache);
            $(window).trigger({
                type: "enginePageHasBeenLoaded",
            });
            $(window).scrollTop(0);
        }
    }
});

$(function () {
    $(window).on("engineHistoryChange", $.engineBrowseHistory.engineHistoryChange);
    $(window).on('engineNeedHistoryChange', $.engineHistoryNeedChange);
    $(document).on('click', 'a', $.engineHistoryAnchor.click);
});