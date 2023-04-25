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

    window.Share = {
        el: $('.lightbox-share'),
        currentQueueHtml: null,
        embedUrl: null,
        embedTheme: 'dark',
        embedHeight: 400,
        tab: function () {
            var tab_id = $(this).attr("id");
            $(".share-svc").removeClass("active");
            $(".svc-box").addClass("hide");
            $(".svc-box." + tab_id.replace("share-", "")).removeClass("hide");
            $("#" + tab_id).addClass("active");
            if (tab_id === 'share-facebook' || tab_id === 'share-twitter') {
                Share.el.find('.submit').removeClass('hide');
            } else {
                Share.el.find('.submit').addClass('hide');
            }
        },
        widgetTab: function () {
            /** widget tab */
            $('.nav-widget').removeClass("active");
            $(this).addClass("active");
            $('#svc-embed-iframe').removeClass();
            $('#svc-embed-iframe').addClass($(this).data('widget'));
            if ($(this).data('widget') === 'mini') {
                Share.embedHeight = 60;
            } else if ($(this).data('widget') === 'classic') {
                Share.embedHeight = 180;
            } else {
                Share.embedHeight = 400;
            }
            Share.buildIframeCode();
        },
        buildIframeCode: function () {
            $('#embed-code').val('<iframe width="100%" height="' + Share.embedHeight + '" frameborder="0" src="' + route.rootUrl() + Share.embedUrl + '"></iframe>');
        },
        init: function (type, id) {
            __DEV__ && console.log(type, id);
            $.engineLightBox.show("lightbox-share");
            $(".embed-widget-theme").unbind('click');
            $("#share-lightbox-copy").unbind('click');
            if (type === "song" || type === "station" || type === "artist" || type === "playlist" || type === "album" || type === "user" || type === "podcast" || type === "episode") {
                $("#svc-embed-iframe").attr('src', route.route('frontend.share.embed', {
                    'theme': 'dark',
                    'type': type,
                    'id': id
                }));
                Share.embedUrl = route.route('frontend.share.embed', {
                    'theme': Share.embedTheme,
                    'type': type,
                    'id': id
                });
                Share.buildIframeCode();
                $(".embed-widget-theme").bind('click', function () {
                    Share.embedUrl = route.route('frontend.share.embed', {
                        'theme': $(this).data('theme'),
                        'type': type,
                        'id': id
                    });
                    Share.embedTheme = $(this).data('theme');
                    $("#svc-embed-iframe").attr('src', Share.embedUrl);
                    Share.buildIframeCode();
                });
                Share.el.find('.lb-nav-outer').removeClass('hide');
            } else {
                $('.share-link').addClass('hide');
                Share.embedUrl = route.route('frontend.share.embed', {
                    'theme': Share.embedTheme,
                    'type': 'songs',
                    'id': EMBED.Playlist.map(function (song) {
                        return song.id
                    }).join(",")
                });
                $("#svc-embed-iframe").attr('src', Share.embedUrl);
                Share.buildIframeCode();
                $(".embed-widget-theme").bind('click', function () {
                    Share.embedUrl = route.route('frontend.share.embed', {
                        'theme': $(this).data('theme'),
                        'type': 'songs',
                        'id': EMBED.Playlist.map(function (song) {
                            return song.id
                        }).join(",")
                    });
                    Share.embedTheme = $(this).data('theme');
                    $("#svc-embed-iframe").attr('src', Share.embedUrl);
                    Share.buildIframeCode();
                });
                Share.el.find('.lb-nav-outer').addClass('hide');
            }
            var data;
            Share.el.find('.submit').addClass('hide');
            if (type === "song") {
                $('#share-embed').trigger('click');
                data = window['song_data_' + id];
                Share.el.find('h2').html(Language.text.LB_SHARE_TITLE_BY.replace(':item', data.title).replace(':author', data.artists.map(function (a) {
                    return a.name;
                }).join(", ")));
                Share.el.find('#share-message-tw').val(Language.text.SHARE_TWITTER_SONG.replace(':SongName', data.title).replace(':ArtistName', data.artists.map(function (a) {
                    return a.name;
                }).join(", ")).replace(':Url', data.permalink_url));
                Share.el.find('.share-url').val(data.permalink_url);
                Share.el.find('#share-link').removeClass('hide');
            } else if (type === "station") {
                $('#share-embed').trigger('click');
                data = window['station_data_' + id];
                Share.el.find('h2').html(Language.text.LB_SHARE_TITLE_BY.replace(':item', data.title));
                Share.el.find('#share-message-tw').val(Language.text.SHARE_TWITTER_STATION.replace(':StationName', data.title).replace(':Url', data.permalink_url));
                Share.el.find('.share-url').val(data.permalink_url);
                Share.el.find('#share-link').removeClass('hide');
            } else if (type === "playlist") {
                $('#share-embed').trigger('click');
                data = window['playlist_data_' + id];
                Share.el.find('h2').html(Language.text.LB_SHARE_TITLE_BY.replace(':item', data.title).replace(':author', data.user.name));
                Share.el.find('#share-message-tw').val(Language.text.SHARE_TWITTER_PLAYLIST.replace(':PlaylistName', data.title).replace(':UserName', data.user.name).replace(':Url', data.permalink_url));
                Share.el.find('.share-url').val(data.permalink_url);
                Share.el.find('#share-link').removeClass('hide');
            } else if (type === "album") {
                $('#share-embed').trigger('click');
                data = window['album_data_' + id];
                Share.el.find('h2').html(Language.text.LB_SHARE_TITLE_BY.replace(':item', data.title).replace(':author', data.artists.map(function (a) {
                    return a.name;
                }).join(", ")));
                Share.el.find('#share-message-tw').val(Language.text.SHARE_TWITTER_ALBUM.replace(':AlbumName', data.title).replace(':ArtistName', data.artists.map(function (a) {
                    return a.name;
                }).join(", ")).replace(':Url', data.permalink_url));
                Share.el.find('.share-url').val(data.permalink_url);
                Share.el.find('#share-link').removeClass('hide');
            } else if (type === "artist") {
                $('#share-embed').trigger('click');
                data = window['artist_data_' + id];
                Share.el.find('h2').html(Language.text.LB_SHARE_TITLE.replace(':item', data.name));
                Share.el.find('#share-message-tw').val(Language.text.SHARE_TWITTER_ARTIST.replace(':ArtistName', data.name).replace(':Url', data.permalink_url));
                Share.el.find('.share-url').val(data.permalink_url);
                Share.el.find('#share-link').removeClass('hide');
            } else if (type === "user") {
                $('#share-facebook').trigger('click');
                data = window['user_data_' + id];
                Share.el.find('h2').html(Language.text.LB_SHARE_TITLE.replace(':item', data.name));
                Share.el.find('#share-message-tw').val(Language.text.SHARE_TWITTER_USER.replace(':Url', data.permalink_url));
                Share.el.find('.share-url').val(data.permalink_url);
                Share.el.find('#share-link').removeClass('hide');
                Share.el.find('.submit').removeClass('hide');
            } else if (type === "queue") {
                $('#share-embed').trigger('click');
                Share.el.find('h2').html(Language.text.LB_SHARE_TITLE.replace(':item', Language.text.QUEUE));
                Share.el.find('#share-link').addClass('hide');
            } else if (type === "podcast") {
                $('#share-embed').trigger('click');
                data = window['podcast_data_' + id];
                Share.el.find('h2').html(Language.text.LB_SHARE_TITLE_BY.replace(':item', data.title).replace(':author', data.artist.name));
                Share.el.find('#share-message-tw').val(Language.text.SHARE_TWITTER_PODCAST.replace(':ObjectName', data.title).replace(':UserName', data.artist.name).replace(':Url', data.permalink_url));
                Share.el.find('.share-url').val(data.permalink_url);
                Share.el.find('#share-link').removeClass('hide');
            } else if (type === "episode") {
                $('#share-embed').trigger('click');
                data = window['episode_data_' + id];
                Share.el.find('h2').html(Language.text.LB_SHARE_TITLE_BY.replace(':item', data.title).replace(':author', data.podcast.title));
                Share.el.find('#share-message-tw').val(Language.text.SHARE_TWITTER_EPISODE.replace(':ObjectName', data.title).replace(':Show', data.podcast.title).replace(':Url', data.permalink_url));
                Share.el.find('.share-url').val(data.permalink_url);
                Share.el.find('#share-link').removeClass('hide');
            }
            $('#share-lightbox-copy').unbind('click');
            $("#share-lightbox-copy").bind('click', Share.copyUrl);
            $('#embed-code').unbind('click');
            $('#embed-code').bind('click', function () {
                var copyText = this;
                copyText.select();
                copyText.setSelectionRange(0, 99999);
                document.execCommand("copy");
                Toast.show("copy", "Copied to Clipboard", "Copied");
            });
            Share.el.find('.submit').unbind('click');
            Share.el.find('.submit').bind('click', function () {
                if ($('#share-facebook').hasClass('active')) {
                    window.open('https://www.facebook.com/share.php?u=' + encodeURIComponent(data.permalink_url) + '&ref=songShare');
                }
                if ($('#share-twitter').hasClass('active')) {
                    window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(data.permalink_url) + '&text=' + encodeURIComponent($('#share-message-tw').val()));
                }
            });

            if (type === "song" || type === "playlist" || type === "album") {
                var thirdPartyShareTitle = data.title;
            } else {
                var thirdPartyShareTitle = data.name;
            }
            $('.share-more-option.reddit').find('a').attr('href', 'https://www.reddit.com/submit?title=' + encodeURIComponent(thirdPartyShareTitle) + '&url=' + encodeURIComponent(data.permalink_url));
            $('.share-more-option.pinterest').find('a').attr('href', 'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(data.permalink_url) + '&media=' + encodeURIComponent(data.artwork_url) + '&description=' + encodeURIComponent(thirdPartyShareTitle));
            $('.share-more-option.linkedin').find('a').attr('href', 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(data.permalink_url) + '&summary=' + encodeURIComponent(thirdPartyShareTitle));
            $('.share-more-option.linkedin').find('a').attr('href', 'mailto:info@example.com?&subject=' + encodeURIComponent(thirdPartyShareTitle) + '&body=' + encodeURIComponent(data.permalink_url));
        },
        copyUrl: function () {
            var copyText = document.getElementById('share-lightbox-url');
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
            Toast.show("copy", "Copied to Clipboard", "Copied");
        }
    };

    $(document).ready(function () {
        $(".share-svc").on('click', Share.tab);
        $(".nav-widget").on('click', Share.widgetTab);
    });
    var typingTimer;
    window.Community = {
        share: {
            el: null,
            input: null,
            type: null,
            limit: 5,
            data: [],
            object: null,
            init: function () {
                var el = $('#post-to-feed');
                el.find('.post-feed-msg').bind('click', function () {
                    Community.share.el = $('#post-to-feed');
                    Community.share.input = $('.post-item-input');
                    if (Community.share.el.hasClass('stage-1')) return false;
                    Community.share.el.addClass('stage-1');
                    $(this).val('');
                    Community.share.input.on('keyup', function () {
                        var searchVal = Community.share.input.val();
                        if (!searchVal.length) {
                            $(".attach-music-tooltip").addClass("hide");
                            return false;
                        }
                        clearTimeout(typingTimer);
                        typingTimer = setTimeout(function () {
                            $("#search-attach-music-content").html('');
                            Community.share.suggest(searchVal);
                        }, 200);

                    });
                    Community.share.input.on('keydown', function () {
                        clearTimeout(typingTimer);
                    });
                    Community.share.input.on('focusout', function () {
                        setTimeout(function () {
                            $('.tooltip.attach-music-tooltip').addClass('hide');
                        }, 500);
                    });
                    Community.share.input.focusout(function () {
                        //$('.tooltip.attach-music-tooltip').addClass('hide');
                    });
                });
                el.find('.post-feed-msg').atwho({
                    at: "@",
                    spaceSelectsMatch: true,
                    searchKey: "name",
                    callbacks: {
                        remoteFilter: function (query, callback) {
                            if (!query) return false;
                            $.post(route.route('frontend.auth.user.get.mention'), {term: query}, function (data) {
                                callback(data)
                            });
                        }
                    },
                    insertTpl: '<tag data-id="${id}" data-username="${username}">${name}</tag>',
                    displayTpl: "<li><img src='${artwork_url}'><span>${name}</span></li>",
                    limit: 5
                }).atwho({
                    at: "#",
                    searchKey: "tag",
                    callbacks: {
                        remoteFilter: function (query, callback) {
                            if (!query) return false;
                            $.post(route.route('frontend.auth.user.get.hashtag'), {term: query}, function (data) {
                                callback(data)
                            });
                        }
                    },
                    insertTpl: '#${tag}',
                    displayTpl: "<li>#${tag}</li>",
                    limit: 5,
                    maxLen: 14,
                    startWithSpace: true,
                });

                el.find('.post-feed-msg').on("inserted.atwho", function (event, $li, browser_event) {
                    //el.find('hash').parent().contents().unwrap();
                    //el.find('hash').contents().unwrap();
                });
                el.on('paste', function (e) {
                    e.preventDefault();
                    const text = (e.originalEvent || e).clipboardData.getData('text/plain');
                    document.execCommand('insertText', false, text.replace(/^\s+|\s+$/g, ''));
                });
                /*$(document).on("keyup", ".post-feed-msg", function (event) {
                    if (event.keyCode === 32 || event.keyCode === 13) {
                        var val = $(this).html();
                        val = $('<div>').html(val).text();
                        if(val.match(/(#(\w+))|<span.*?<\/span>/g)) {
                            val = val.replace(/#(\w+)/g, "<span class=\"atwho-inserted\" data-atwho-at-query=\"#\" contenteditable=\"false\">$&</span>").replace("<br>", "").replace("#", "");
                            $(this).html(val);
                            Community.share.placeCaretAtEnd(this);
                        }
                    }
                });*/
                el.find('.remove-item').bind('click', Community.share.removeItem);
                el.find('.share-post').bind('click', function () {
                    if (!el.find('.post-feed-msg').html()) {
                        return false;
                    }
                    if (el.find('.post-feed-msg').html().replace(/(<([^>]+)>)/gi, '').length > 140) {
                        Toast.show('error', Language.text.POPUP_FEED_POST_TOO_LONG);
                        return false;
                    }
                    if (!Community.share.object) {
                        Toast.show('error', Language.text.POPUP_FEED_POST_NO_ITEM_FAILED);
                        return false;
                    }
                    var submitButton = $(this);
                    submitButton.attr('disabled', 'disabled');
                    $.ajax({
                        type: "POST",
                        url: route.route('frontend.auth.user.post.feed'),
                        data: {
                            object: Community.share.object,
                            content: el.find('.post-feed-msg').html()
                        },
                        success: function (response) {
                            $('#community').prepend(response);
                            MusicPopover.init();
                            el.find('.post-feed-msg').html('');
                            el.find('.post-item-input').val('');
                            el.find('.attach-music').find('.label').html(Language.text.ATTACH_MUSIC);
                            el.removeClass('stage-1').removeClass('stage-2').removeClass('stage-3');
                            submitButton.removeAttr('disabled');
                            Community.share.object = null;
                        }
                    });
                });
            },
            placeCaretAtEnd: function (el) {
                el.focus();
                if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    range.collapse(false);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (typeof document.body.createTextRange != "undefined") {
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(el);
                    textRange.collapse(false);
                    textRange.select();
                }
            },
            getCaretCharacterOffsetWithin: function (element) {
                var caretOffset = 0;
                var doc = element.ownerDocument || element.document;
                var win = doc.defaultView || doc.parentWindow;
                var sel;
                if (typeof win.getSelection != "undefined") {
                    sel = win.getSelection();
                    if (sel.rangeCount > 0) {
                        var range = win.getSelection().getRangeAt(0);
                        var preCaretRange = range.cloneRange();
                        preCaretRange.selectNodeContents(element);
                        preCaretRange.setEnd(range.endContainer, range.endOffset);
                        caretOffset = preCaretRange.toString().length;
                    }
                } else if ((sel = doc.selection) && sel.type != "Control") {
                    var textRange = sel.createRange();
                    var preCaretTextRange = doc.body.createTextRange();
                    preCaretTextRange.moveToElementText(element);
                    preCaretTextRange.setEndPoint("EndToEnd", textRange);
                    caretOffset = preCaretTextRange.text.length;
                }
                return caretOffset;
            },
            attachMusic: function (objectType) {
                if (!Community.share.el.hasClass('stage-2')) Community.share.el.addClass('stage-2');
                Community.share.el.find('.attach-music .label').html(Language.text[objectType.toUpperCase()]);
                Community.share.type = objectType;
            },
            selectItem: function () {
                if (!Community.share.el.hasClass('stage-3')) Community.share.el.addClass('stage-3');
                var objectType = $(this).data('type');
                var objectId = $(this).data('id');
                var object = Community.share.data.filter(function (x) {
                    return x.id === objectId
                })[0];
                Community.share.el.find('.item-image').attr('src', object.artwork_url)
                Community.share.el.find('.item-name').html(objectType === 'artist' ? object.name : object.title);
                if (objectType === 'song' || objectType === 'album') {
                    Community.share.el.find('.item-subtext').removeClass('hide').html(object.artists.map(function (a) {
                        return a.name
                    }).join(", "));
                } else if (objectType === 'playlist') {
                    Community.share.el.find('.item-subtext').removeClass('hide').html(object.user.name);
                } else {
                    Community.share.el.find('.item-subtext').addClass('hide');
                }
                Community.share.object = {id: objectId, type: objectType};
            },
            removeItem: function () {
                Community.share.el.removeClass('stage-3');
                Community.share.object = null;
            },
            suggest: function (searchVal) {
                $.ajax({
                    type: "GET",
                    url: route.route('frontend.homepage') + "api/search/" + Community.share.type + "?q=" + searchVal + "&limit=" + Community.share.limit,
                    cache: true,
                    success: function (response) {
                        Community.share.data = response.data;
                        var data = {
                            items: Community.share.data,
                            type: Community.share.type
                        }
                        var html = tmpl('tmpl-share-autocomplete-item', data);
                        var tooltip = $(".tooltip.attach-music-tooltip");
                        $("#search-attach-music-content").html(html);
                        html ? tooltip.removeClass("hide") : tooltip.addClass("hide");
                        $(".community-share-object").bind('click', Community.share.selectItem);
                    }
                });
            }
        }
    };
    $(window).on("enginePageHasBeenLoaded", function () {
        if (window.location.pathname === route.route('frontend.community')) {
            Community.share.init()
        }
    });
    $(document).on("click", '[data-action="share"]', function () {
        Share.init($(this).data('type'), $(this).data('id'))
    });
});