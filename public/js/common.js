
/**
 * Created by NiNaCoder.
 * Date: 2019-05-28
 * Time: 15:13
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

    console.log("%cStop!", "font: 5em sans-serif; color: red;");
    console.log("%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature or \"hack\" someone's account, it is a scam and will give them access to your account.", "font: 2em sans-serif;");

    $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
        __DEV__ && console.log(event, jqxhr, settings, thrownError);
    });
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    /* page cache start for testing */
    for (var key in sessionStorage) {
        if (key.indexOf('expiresIn') !== -1) {
            var str = key.split('_')
            sessionStorage.removeItem(str[0]);
            sessionStorage.removeItem(key);
        }
    }

    window.KeyboardShortcuts = {};

    KeyboardShortcuts.Keyup = function (a) {
        if (a.altKey === true) {
            if (a.keyCode === 32) {
                EMBED.Player.playPause();
            }
        }
    };
    $(document).on('keyup', KeyboardShortcuts.Keyup);


    window.Toast = {
        index: 0,
        icon: {
            'close': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
            'failed': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z"/></svg>',
            'check': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></svg>',
            'favorite': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><defs><path id="a" d="M0 0h24v24H0V0z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path clip-path="url(#b)" d="M14 10H2v2h12v-2zm0-4H2v2h12V6zM2 16h8v-2H2v2zm19.5-4.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z"/></svg>',
            'collection': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M20.9,6.8l-1.6-1.6c-0.2-0.2-0.5-0.3-0.9-0.3S18,5.1,17.6,5.2l-8,7.8L6.2,9.6C6,9.2,5.7,9.2,5.3,9.2s-0.5,0-0.9,0.3 l-1.6,1.6c-0.2,0.3-0.3,0.5-0.3,0.9c0,0.3,0.2,0.5,0.3,0.9l4.3,4.3l1.6,1.6c0.2,0.2,0.5,0.3,0.9,0.3s0.5-0.2,0.9-0.3l1.7-1.6 l8.8-8.8c0.2-0.2,0.3-0.5,0.3-0.9C21.3,7.3,21.1,7,20.9,6.8z"/></svg>',
            'queue': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 561 561" xml:space="preserve"><path d="M51,102H0v408c0,28.05,22.95,51,51,51h408v-51H51V102z M510,0H153c-28.05,0-51,22.95-51,51v357c0,28.05,22.95,51,51,51h357c28.05,0,51-22.95,51-51V51C561,22.95,538.05,0,510,0z M459,255H357v102h-51V255H204v-51h102V102h51v102h102V255z"/></svg>',
            'copy': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4l6 6v10c0 1.1-.9 2-2 2H7.99C6.89 23 6 22.1 6 21l.01-14c0-1.1.89-2 1.99-2h7zm-1 7h5.5L14 6.5V12z"/></svg>',
            'follow': '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>',
            'radio': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>',
            'error': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
            'playlist': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><defs><path id="a" d="M0 0h24v24H0V0z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path clip-path="url(#b)" d="M14 10H2v2h12v-2zm0-4H2v2h12V6zM2 16h8v-2H2v2zm19.5-4.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z"/></svg>',
            'success': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/></svg>',
            'library': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></svg>',
        },
        show: function (icon, msg, title) {
            title = typeof title !== 'undefined' ? title : null;
            msg = typeof msg !== 'undefined' ? msg : null;

            if (title === null) title = "";
            if (msg === null) msg = "";
            var el_id = Toast.index;
            var html = '<div id="notification_' + el_id + '" class="notification ' + icon + '">' +
                '<a class="btn btn-icon-only btn-rounded btn-dark close">' + Toast.icon.close + '</a>' +
                '<div class="context-container">' + Toast.icon[icon] + '</div>' +
                '<div class="info"><span class="title">' + title + '</span><span class="description">' + msg + '</span></div></div>';
            $("#notifications").append(html);
            $("#notification_" + el_id).hide().fadeIn(500);
            setTimeout(
                function () {
                    $("#notification_" + el_id).fadeOut(500, function () {
                        $(this).remove()
                    });
                },
                5000);
            Toast.index++;
            $(window).trigger({
                type: "engineToastShow",
                title: title,
                message: msg
            });
        },
        hide: function () {
            $(this).closest('.notification').fadeOut(500, function () {
                $(this).remove();
            });
        }
    };

    $(document).on('click', '.notification .close', Toast.hide);

    $.engineLightBox = {
        show: function (box) {
            __DEV__ && console.log('$.engineLightBox', box);
            $("#lightbox-outer").show();
            $("#lightbox-overlay").show();
            $("." + box).removeClass("hide");
            setTimeout(function () {
                $('body').addClass('no-scroll');
            }, 200);
            $(".select2-hidden-accessible").val(null).trigger("change");
            var el = $('.' + box);
            el.find('form').trigger('reset');
            el.find('form .control').removeClass('field-error');
            if (!el.find('.error').hasClass('hide')) {
                el.find('.error').addClass('hide')
            }
            el.find("[type='submit']").removeAttr("disabled");
        },
        hide: function () {
            $("#lightbox-outer").hide();
            $("#lightbox-overlay").hide();
            $(".lightbox").addClass("hide");
            $('body').removeClass('no-scroll');
        },
        confirm: function (heading, question, callback) {
            var confirm = $('.lightbox-confirm');
            confirm.find('h2').html(heading);
            confirm.find('.lightbox-content-block p').html(question);
            confirm.find('.submit').one('click', function (e) {
                callback();
                $.engineLightBox.hide();
            });
            $.engineLightBox.show('lightbox-confirm');
        },
        checkError: function (el, controlFor) {
            __DEV__ && console.log(el.val());
            if (!el.val()) {
                $('.control-label[for="' + controlFor + '"]').closest('.control').addClass('field-error');
            } else {
                $('.control-label[for="' + controlFor + '"]').closest('.control').removeClass('field-error');
            }
        },
    };
    $(window).on('engineNeedHistoryChange', $.engineLightBox.hide);

    $.engineSideBar = {
        playlistsHeight: 0,
        communityHeight: 0,
        communityTop: 0,
        playlists: $("#sidebar-playlists"),
        resizeHandle: $("#section-resize-handle"),
        community: $("#sidebar-community"),
        dragPositionTop: 0,
        dragPositionBottom: 0,
        init: function () {
            var el = $(this);
            var target = $(el.data('target'));

            if (target.hasClass("collapsed")) {
                el.find(".caret").removeClass("point-right");
                target.removeClass("collapsed");
            } else {
                el.find(".caret").addClass("point-right");
                target.addClass("collapsed");
            }
            $.engineSideBar.resize();
        },
        collapse: function (el, col) {
            if (col.hasClass("collapsed")) {
                el.find(".caret").removeClass("point-right");
                col.removeClass("collapsed");
            } else {
                el.find(".caret").addClass("point-right");
                col.addClass("collapsed");
            }
        },
        resize: function (e) {
            $.engineSideBar.resizeHandle.draggable({
                axis: "y",
                start: function (event, ui) {
                    $.engineSideBar.playlistsHeight = $.engineSideBar.playlists.height();
                    $.engineSideBar.dragPositionTop = event.clientY - $.engineSideBar.playlistsHeight;
                    $.engineSideBar.dragPositionBottom = $.engineSideBar.resizeHandle.height() - $.engineSideBar.dragPositionTop;
                },
                drag: function (event, ui) {
                    $.engineSideBar.playlists.height(event.clientY - $.engineSideBar.dragPositionTop);
                    $.engineSideBar.community.css("top", event.clientY + $.engineSideBar.dragPositionBottom - $.engineSideBar.resizeHandle.height())
                }
            });
        },
        show: function () {
            $("#sideMenu").addClass("active");
            $('body').addClass("no-scroll");
            $('#lightbox-overlay').show();
            $('#lightbox-overlay').one('click', $.engineSideBar.hide);

        },
        hide: function () {
            $("#sideMenu").removeClass("active");
            $('body').removeClass("no-scroll");
            $('#lightbox-overlay').hide();
        }
    };
    $(window).on("engineHistoryChange", $.engineSideBar.hide);
    $(document).on('click', '.collapser', $.engineSideBar.init);

    $.engineTheme = {
        el: $(".themeSwitch"),
        init: function () {
            this.el.on('click', this.switch);
        },
        switch: function () {
            if ($.engineTheme.el.is(":checked")) {
                $('body').addClass("dark-theme");
                Cookies.remove('darkMode')
                Cookies.set('darkMode', true, {
                    expires: 365
                })
            } else {
                $('body').removeClass("dark-theme");
                Cookies.remove('darkMode')
                Cookies.set('darkMode', false, {
                    expires: 365
                })
            }
        }
    };
    $(document).ready(function () {
        $.engineTheme.init();
    });

    window.Language = {
        el: $(".languages .language a"),
        text: {},
        init: function () {
            Language.current();
            Language.el.on('click', Language.set);
        },
        current: function () {
            var lang = sessionStorage.getItem('language');
            if (lang) {
                Language.text = JSON.parse(lang);
                Language.done();
            }
            $.ajax({
                url: route.route('frontend.language.current'),
                data: {},
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    Language.text = response;
                    sessionStorage.setItem('language', JSON.stringify(response));
                    Language.done(false);
                }
            });
        },
        set: function () {
            var locale = $(this).attr('rel');
            $(".languages .language a").removeClass('active');
            $(this).addClass('active');
            $.ajax({
                url: route.route('frontend.language.switch'),
                data: {
                    locale: locale
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    Language.text = response;
                    $.engineLightBox.hide();
                    Language.done(true);
                }
            });
            return false;
        },
        done: function (reload) {
            Object.keys(Language.text).forEach(function eachKey(key) {
                var el = $("[data-translate-text='" + key + "']");
                if (key !== 'WELCOME_BACK') {
                    el.html(Language.text[key]);
                } else {
                    el.html(Language.text[key].replace(':name', el.data('name')));
                }
            });
            if (reload) {
                $(window).trigger({
                    type: "engineReloadCurrentPage"
                });
            }
            //Build basic tooltip for player, etc...
            $("<span/>", {
                class: "hide",
                "data-translate-text": "QUEUE_ITEM_OPTIONS"
            }).html(Language.text.QUEUE_ITEM_OPTIONS).appendTo("#queue-menu-btn");
            $("#queue-menu-btn").addClass("basic-tooltip");

            $("<span/>", {
                class: "hide",
                "data-translate-text": "QUEUE_RESTORE_QUEUE"
            }).html(Language.text.QUEUE_RESTORE_QUEUE).appendTo("#embed_restore_icon");
            $("#embed_restore_icon").addClass("basic-tooltip");

            $("<span/>", {
                class: "hide",
                "data-translate-text": "QUEUE_SOUND_VOLUME_MUTE"
            }).html(Language.text.QUEUE_SOUND_VOLUME_MUTE).appendTo("#embed_volume_speaker");
            $("#embed_volume_speaker").addClass("basic-tooltip");

            $("<span/>", {
                class: "hide",
                "data-translate-text": "QUEUE_SHUFFLE_SONGS"
            }).html(Language.text.QUEUE_SHUFFLE_SONGS).appendTo("#embed_large_shuffle");
            $("#embed_large_shuffle").addClass("basic-tooltip");

            $("<span/>", {
                class: "hide",
                "data-translate-text": "QUEUE_LOOP_SONGS"
            }).html(Language.text.QUEUE_LOOP_SONGS).appendTo("#embed_large_repeat");
            $("#embed_large_repeat").addClass("basic-tooltip");

            $("<span/>", {
                class: "hide",
                "data-translate-text": "QUEUE_TOGGLE"
            }).html(Language.text.QUEUE_TOGGLE).appendTo("#embed_list_icon");
            $("#embed_list_icon").addClass("basic-tooltip");
        }
    };
    $(document).ready(Language.init);

    $.engineTooltip = {};
    $.engineTooltip.init = function () {
        /** only show on PC */
        if ($.engineUtils.isMobile()) return false;
        $("<div/>", {
            id: "basic_tooltip_display",
        }).appendTo("body");
    };
    $.engineTooltip.Timeout = null;
    $.engineTooltip.Mouseover = function (h) {
        if ($.engineUtils.isMobile()) return false;
        clearTimeout($.engineTooltip.Timeout);
        var k = $(this);
        var d = k.offset();
        var q = k.attr("tooltip") || k.find("span").html();
        var b = d.left;
        var n = d.top + 3;
        var a = k.outerWidth();
        var g = jQuery("#basic_tooltip_display");
        g.html(q);
        var f = g.outerWidth();
        var c = b + (a / 2) - f / 2;
        g.css({
            left: c,
            top: n - 30,
            right: "auto"
        });
        g.addClass("show");
        var o = g.offset().left;
        var p = o + f;
        var m = jQuery(document).width();
        if ((p + 30) > m) {
            g.css({
                right: 30,
                left: "auto"
            })
        }
        if (o < 0) {
            g.css({
                left: 10,
                right: "auto"
            })
        }
        var j = g.offset().top;
        if (j < 0) {
            g.css({
                top: 45
            })
        }
        $.engineTooltip.Timeout = setTimeout($.engineTooltip.Mouseout, 2000);
        k.on("mouseout", $.engineTooltip.Mouseout)
    };
    $.engineTooltip.Mouseout = function (a) {
        if ($.engineUtils.isMobile()) return false;
        $("#basic_tooltip_display").removeClass("show")
    };
    $("body").on('mouseover', '.basic-tooltip', $.engineTooltip.Mouseover);
    $(window).on("engineHistoryChange", $.engineTooltip.Mouseout);
    $(document).ready($.engineTooltip.init);

    var typingTimer;

    window.Search = {
        input: $("#header-search input"),
        stickyInput: $("#sticky_search"),
        currentRequest: null,
        suggest: {
            limit: 3,
            html: '',
            init: function () {
                Search.input.on('keyup', function (e) {
                    var searchVal = Search.input.val();
                    if (!searchVal.length) {
                        $(".tooltip.suggest").addClass("hide");
                        return false;
                    }
                    clearTimeout(typingTimer);
                    typingTimer = setTimeout(function () {
                        $("#search-suggest-content-container").html('');
                        Search.suggest.show(searchVal);
                    }, 10);
                    if (e.keyCode === 13 || !searchVal) {
                        $(".tooltip.suggest").addClass("hide");
                        return false;
                    }
                });
                Search.input.on('keydown', function () {
                    clearTimeout(typingTimer);
                });
                Search.input.focusout(function () {
                    setTimeout(function () {
                        Search.suggest.click();
                    }, 150);
                });
                Search.input.keypress(function (e) {
                    var searchVal = Search.input.val();
                    if (e.which === 13) {
                        if (searchVal) {
                            $(window).trigger({
                                type: 'engineNeedHistoryChange',
                                href: route.route('frontend.search.song', {
                                    'slug': searchVal
                                })
                            });
                            Search.input.blur();
                        }
                        return false;
                    }
                });
                Search.stickyInput.keypress(function (e) {
                    var searchVal = Search.stickyInput.val();
                    if (e.which === 13) {
                        if (searchVal) {
                            $(window).trigger({
                                type: 'engineNeedHistoryChange',
                                href: route.route('frontend.search.song', {
                                    'slug': searchVal
                                })
                            });
                        }
                        return false;
                    }
                });
            },
            click: function () {
                $(".tooltip.suggest").addClass("hide");
            },
            show: function (searchVal) {
                Search.currentRequest = $.ajax({
                    type: "GET",
                    url: route.route('api.search.suggest', {q: searchVal, limit: Search.suggest.limit}),
                    cache: true,
                    beforeSend : function()    {
                        if(Search.currentRequest != null) {
                            Search.currentRequest.abort();
                            console.log('abort');
                        }
                    },
                    success: function (response) {
                        var html = "";
                        if (response.artists.length) {
                            html += tmpl('tmpl-suggest-item', {
                                items: response.artists,
                                type: 'artist'
                            });
                        }

                        if (response.songs.length) {
                            html += tmpl('tmpl-suggest-item', {
                                items: response.songs,
                                type: 'song'
                            });
                        }

                        if (response.playlists.length) {
                            html += tmpl('tmpl-suggest-item', {
                                items: response.playlists,
                                type: 'playlist'
                            });
                        }

                        if (response.albums.length) {
                            html += tmpl('tmpl-suggest-item', {
                                items: response.songs,
                                type: 'album'
                            });
                        }

                        $("#search-suggest-content-container").html(html);
                        html ? $(".tooltip.suggest").removeClass("hide") : $(".tooltip.suggest").addClass("hide");
                    }
                });
            }
        },
        didYouMean: function () {
            var el = $('.did-you-mean');
            var term = el.data('term');
            var link = el.find('.did-you-mean-search-link');

            $.ajax({
                url: 'https://google.com/complete/search?output=json&q=' + encodeURIComponent(term) + '%20lyrics&client=serp',

                // The name of the callback parameter, as specified by the YQL service
                jsonp: "callback",

                // Tell jQuery we're expecting JSONP
                dataType: "jsonp",

                // Work with the response
                success: function (response) {
                    try {
                        if (response[1][0][0]) {
                            __DEV__ && console.log(response);
                            var match_key = term.toLowerCase();
                            if (response && match_key !== response[1][0][0].replace(/(<([^>]+)>)/ig, "").replace(" lyrics", "")) {
                                el.removeClass('hide');
                                var suggest = response[1][0][0].replace(/(<([^>]+)>)/ig, "").replace(" lyrics", "");
                                //results = 'Did you mean "<a href="' + mp3_root + 'search.html?q=' + encodeURIComponent(data[1][0][0].replace(/(<([^>]+)>)/ig, "").replace(" lyrics", "")) + '">' + data[1][0][0].replace(/(<([^>]+)>)/ig, "").replace(" lyrics", "") + '</a>"?';
                                //$('#results').html(results);
                                link.html(suggest).attr('href', route.route('frontend.search.song', {
                                    'slug': suggest
                                }));
                                el.find('.did-you-mean-remove').one('click', function () {
                                    el.addClass('hide');
                                })
                            }
                        }
                    } catch (err) {
                    }
                }
            });
        },
        global: function () {
            $('[data-action="search"]').keypress(function (e) {
                var searchVal = $(this).val();
                if (e.which === 13) {
                    if (searchVal) {
                        $(window).trigger({
                            type: 'engineNeedHistoryChange',
                            href: route.route('frontend.search.song', {
                                'slug': searchVal
                            })
                        });
                    }
                    return false;
                }
            });
        }
    }

    $(window).on("enginePageHasBeenLoaded", Search.global);
    $(window).on("engineHistoryChange", function () {
        $(".tooltip.suggest").addClass("hide");
    });
    $(window).on("enginePageHasBeenLoaded", function () {
        $(".tooltip.suggest").addClass("hide");
        if ($('.did-you-mean').length) {
            Search.didYouMean();
        }
    });

    function formatRepo(repo) {
        if (repo.loading) {
            return repo.text;
        }
        var markup = "<div class='select2-result-repository'>" +
            "<div class='select2-result-repository__artwork'><img src='" + repo.artwork + "' /></div>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" + repo.title + "</div>" +
            "</div>";

        return markup;
    }

    function formatRepoSelection(repo) {
        var markup = "<div class='select2-result-repository'>" +
            "<div class='select2-result-repository__artwork'><img src='" + repo.artwork + "' /></div>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title white'>" + repo.title + "</div></div>";
        return markup || repo.text;
    }

    window.ScrollBar = {};

    ScrollBar.init = function () {
        if ($('.header-notifications-scroll').length) {
            new SimpleBar($('.header-notifications-scroll')[0]);
        }
        if ($('.search-suggest-content-scroll').length) {
            new SimpleBar($('.search-suggest-content-scroll')[0]);
        }
        if ($('.scrollable').length) {
            new SimpleBar($('.scrollable')[0]);
        }
    };
    $(document).ready(function () {
        if (!$.engineUtils.isMobile()) {
            ScrollBar.init();
        }
    });

    window.SideMenu = {
        setActiveMenu: function () {
            var a = (location.protocol + '//' + location.host + location.pathname).toString().split(window.location.host)[1];
            a = a.split("/")[1];
            $("#sideMenu li").removeClass("active");
            if (!a) {
                $(".side-menu-home").addClass("active");
            } else {
                $(".side-menu-" + a).addClass("active");
            }
        }
    };
    $(window).on("enginePageHasBeenLoaded", SideMenu.setActiveMenu);

    window.Settings = {
        imgSelect: function () {
            var input = this;
            var url = $(this).val();
            var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
            if (input.files && input.files[0] && (ext === "gif" || ext === "png" || ext === "jpeg" || ext === "jpg")) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#settings-profile-form').find('.user-img-container img').attr('src', e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            } else {
                Toast.show('error', Language.text.SETTINGS_PICTURE_FAILED, null);
            }
        },
        profile: {
            update: function (response, $form) {
                $("img.profile-img, img.user-picture-preview").attr("src", response.artwork_url);
                $('#header-user-menu').find('img').attr("src", response.artwork_url);
                $('.user-auth.user-info').find('img').attr("src", response.artwork_url);
                $form.find("[type='submit']").removeAttr("disabled").addClass("btn-success");
            }
        },
        subscription: {},
        account: {
            update: function (response, $form) {
                $form.find("[name='settings-email']").closest(".control").removeClass("field-error");
                $form.find("[name='settings-password']").closest(".control").removeClass("field-error");
                $form.find("[type='submit']").removeAttr("disabled").addClass("btn-success");
                User.SignIn.me();
                $(window).trigger({
                    type: "engineSiteContentChange"
                });
                $(window).trigger({
                    type: "engineReloadCurrentPage"
                });
            }
        },
        password: {
            update: function (response, $form) {
                $form.find("[name='settings-email']").closest(".control").removeClass("field-error");
                $form.find("[name='settings-password']").closest(".control").removeClass("field-error");
                $form.find("[type='submit']").removeAttr("disabled").addClass("btn-success");
            }
        },
        preferences: {
            update: function (response, $form) {
                $form.find("[type='submit']").removeAttr("disabled").addClass("btn-success");
                User.SignIn.me();
            }
        },
        connect: {},
    };

    $('body').delegate("#upload-user-pic", 'change', Settings.imgSelect);

    window.Feedback = {};

    Feedback.send = function () {
        $.engineLightBox.hide();
        Toast.show("success", Language.text.POPUP_FEEDBACK_SUCCESS);
    };


    window.AjaxForm = {};

    AjaxForm.init = function () {
        $('.ajax-form').ajaxForm({
            beforeSubmit: function (data, $form, options) {
                if (!User.isLogged() && $form.attr("id") !== 'singup-form' && $form.attr("id") !== 'forgot-form' && $form.attr("id") !== 'reset-password-form') {
                    $.engineLightBox.hide();
                    User.SignIn.show();
                    return false;
                }
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
                $form.find("[type='submit']").addClass("btn-loading");
            },
            success: function (response, textStatus, xhr, $form) {
                $.engineUtils.cleanStorage();
                $(window).trigger({
                    type: "engineAjaxFormSuccess",
                    response: response,
                    form: $form
                });
                var form = ($form.attr("id"));
                if (form === "settings-profile-form") {
                    $(window).trigger({
                        type: "engineSiteContentChange"
                    });
                    Settings.profile.update(response, $form);
                } else if (form === "settings-account-form") {
                    Settings.account.update(response, $form)
                } else if (form === "settings-preferences-form") {
                    Settings.preferences.update(response, $form)
                } else if (form === "edit-playlist-form") {
                    User.Playlist.edited(response, $form);
                } else if (form === "upload-edit-song-form") {
                    Artist.upload.edit(response, $form);
                } else if (form === "edit-song-form") {
                    Artist.song.updated(response, $form);
                } else if (form === "edit-episode-form") {
                    $.engineLightBox.hide();
                    $(window).trigger({
                        type: "engineReloadCurrentPage"
                    });
                } else if (form === "edit-album-form") {
                    $.engineLightBox.hide();
                    $(window).trigger({
                        type: "engineReloadCurrentPage"
                    });
                } else if (form === "feedback-form") {
                    Feedback.send(response, $form);
                } else if (form === "artist-claim-search-form") {
                    Artist.claim.search(response);
                } else if (form === "reset-password-form") {
                    User.SignIn.me();
                    $(window).trigger({
                        type: 'engineNeedHistoryChange',
                        href: route.route('frontend.homepage')
                    });
                    Toast.show("success", Language.text.POPUP_CHANGED_PASSWORD_SUCCESS_DESCRIPTION, Language.text.POPUP_CHANGED_PASSWORD_SUCCESS_TITLE);
                } else if (form === "stripe-form") {
                    console.log($form.attr('action'), route.route('frontend.stripe.purchase'));
                    if($form.attr('action') === route.route('frontend.stripe.purchase')) {
                        Payment.purchaseSuccess();
                    } else {
                        Payment.subscriptionSuccess();
                    }
                } else if (form === "edit-event-form" || form === "create-event-form") {
                    $.engineLightBox.hide();
                    $(window).trigger({
                        type: "engineReloadCurrentPage"
                    });
                } else if (form === "artist-profile-form") {
                    Artist.profile.save(response, $form);
                } else if (form === "forgot-form") {
                    $.engineLightBox.hide();
                    Toast.show('success', response.message)
                } else if (form === "edit-podcast-show-form") {
                    $.engineLightBox.hide();
                    $(window).trigger({
                        type: "engineReloadCurrentPage"
                    });
                } else if (form === "form-coupon-apply") {
                    $(window).trigger({
                        type: "engineReloadCurrentPage"
                    });
                } else if (form === "dob-update-form") {
                    $.engineLightBox.hide();
                }

                $form.find("[type='submit']").removeAttr("disabled");
                $form.find("[type='submit']").removeClass("btn-loading");
                $form.find('.error').addClass('hide').html('');
                if (form !== 'settings-preferences-form' && form !== 'settings-profile-form' && form !== 'artist-profile-form' && form !== "settings-account-form") {
                    $form.trigger("reset");
                }

                if($form.attr('data-redirect')) {
                    $(window).trigger({
                        type: 'engineNeedHistoryChange',
                        href: $form.attr('data-redirect')
                    });
                }
            },
            error: function (e, textStatus, xhr, $form) {
                $(window).trigger({
                    type: "engineAjaxFormError",
                    response: e,
                    form: $form
                });
                __DEV__ && console.log('ajax.form.error', e);
                if (e.status === 429) {
                    /**
                     * Handle server error
                     * Too Many Requests error
                     */
                    Toast.show('error', Language.text.POPUP_COMMENT_DISABLED, null);
                } else {
                    $form.find(".control").removeClass("field-error");
                    /**
                     * Handle laravel validate error
                     */
                    var errors = e.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        Toast.show("error", value[0], null);
                    });
                    $form.find('.error').removeClass('hide').html(e.responseJSON.errors[Object.keys(e.responseJSON.errors)[0]][0]);
                    $form.find("[name='" + Object.keys(e.responseJSON.errors)[0] + "']").closest(".control").addClass("field-error");
                }
                $form.find("[type='submit']").removeAttr("disabled").removeClass('btn-success');
                $form.find("[type='submit']").removeClass("btn-loading");
            }
        });
    };

    $(window).on("enginePageHasBeenLoaded", AjaxForm.init);


    $(document).ready(function () {
        Search.suggest.init();
    });

    window.Filter = {
        init: function () {
            $('body').delegate("#filter-search", "keyup", function (e) {
                __DEV__ && console.log('Filter', $(this).val());
                Filter.show($(this).val())
                e.preventDefault();
            });
            $(document).on("click", ".clear-filter", function () {
                $('#filter-search').val('');
                Filter.show('');
            });
        },
        show: function (term) {
            var listItems = $("#songs-grid > div, #user-profile-grid > div, .items-sort-able > div, .items-filter-able > div");
            listItems.each(function () {
                if ($(this).find('.title').text().toLowerCase().includes(term.toLowerCase())) {
                    $(this).removeClass('hide');
                } else {
                    $(this).addClass('hide');
                }
            });
            if (term) {
                $('.clear-filter').addClass('show');
            } else {
                $('.clear-filter').removeClass('show');
            }
        }
    };

    $(document).ready(Filter.init);

    window.Report = {
        init: function (reportable_type, reportable_id, message, toast_message) {
            $.ajax({
                url: route.route('frontend.auth.user.report'),
                type: "post",
                data: {
                    reportable_type: reportable_type,
                    reportable_id: reportable_id,
                    message: message
                },
                success: function () {
                    Toast.show('success', toast_message);
                }
            });
        }
    };

    window.Pagination = {
        gettingNewPage: false,
        currentPageNumber: 2,
        maxPageNumber: 5,
        reset: function () {
            Pagination.gettingNewPage = false;
            Pagination.currentPageNumber = 2;
        },
        init: function () {
            $(window).on('scroll', function () {
                var el = $('.infinity-load-more');
                if (!el.length) {
                    Pagination.currentPageNumber = 2;
                    return false;
                }

                Pagination.maxPageNumber = el.data('total-page');
                if (Pagination.currentPageNumber > Pagination.maxPageNumber) {
                    return false;
                }
                if (Pagination.currentPageNumber === 2 && el.children().length < 19) {
                    return false;
                }
                //infinity scroll
                var elTop = el.offset().top;
                var el_height = el.height();
                elTop = elTop + (el_height);
                var currentScroll = $(window).scrollTop() + $(window).height();
                if (currentScroll >= elTop && Pagination.gettingNewPage === false) {
                    Pagination.gettingNewPage = true;
                    $('<div/>', {
                        id: "infinity-loading",
                    }).appendTo(el);
                    var url = window.location.href.toString().split(window.location.host)[1] + '?page=' + Pagination.currentPageNumber;
                    $.ajax({
                        type: "GET",
                        url: url,
                        cache: true,
                        success: function (response) {
                            if (!$.trim(response)) {
                                $("#infinity-loading").remove();
                                Pagination.currentPageNumber = Pagination.maxPageNumber;
                            } else {
                                el.append(response);
                                $("#infinity-loading").remove();
                                Pagination.gettingNewPage = false;
                                Pagination.currentPageNumber++;
                                $(window).trigger({
                                    type: "infinityLoadMoreHasBeenLoaded"
                                });
                            }
                        }
                    });
                }
            });
        }
    };

    window.Download = {
        init: function (song) {
            if (!User.isLogged()) {
                if(!Boolean(song.allow_download)) {
                    User.SignIn.show();
                    return false;
                }
            }
            $.engineLightBox.show("lightbox-download");
            var el = $('.lightbox-download');
            if(User.isLogged()) {
                el.find('.download-tip-learn').attr('href', route.route('frontend.settings.subscription'));
            } else {
                el.find('.download-tip-learn').bind('click', function () {
                    $.engineLightBox.hide();
                    User.SignIn.show();
                })
            }
            el.find('.standard-download').unbind('click');
            el.find('.hq-download').unbind('click');
            if (Boolean(song.allow_high_quality_download)) {
                el.find('.download-tip').addClass('hide');
            } else {
                el.find('.download-tip').removeClass('hide');
            }
            if (parseInt(song.mp3)) {
                el.find('.standard-download').removeAttr('disabled');
                if (Boolean(song.allow_download)) {
                    el.find('.standard-download').bind('click', function () {
                        window.open(route.route('frontend.song.download', {id: song.id}));
                    });
                } else {
                    el.find('.standard-download').bind('click', function () {
                        $(window).trigger({
                            type: 'engineNeedHistoryChange',
                            href: route.route('frontend.settings.subscription')
                        });
                    });
                }
            } else {
                el.find('.hq-download').attr('disabled', 'disabled');
            }
            if (parseInt(song.mp3) && parseInt(song.hd)) {
                el.find('.hq-download').removeAttr('disabled');
                if (Boolean(song.allow_high_quality_download)) {
                    el.find('.hq-download').bind('click', function () {
                        window.open(route.route('frontend.song.download.hd', {id: song.id}));
                    });
                    el.find('.download-badge').addClass('hide');
                } else {
                    el.find('.download-badge').removeClass('hide');
                    el.find('.hq-download').bind('click', function () {
                        $(window).trigger({
                            type: 'engineNeedHistoryChange',
                            href: route.route('frontend.settings.subscription')
                        });
                    });
                }
            } else {
                el.find('.hq-download').attr('disabled', 'disabled');
            }
        }
    };

    window.MusicPopover = {
        context: null,
        init: function () {
            $("[data-toggle=song-popover]").not('[data-init=true]').popover({
                html: true,
                trigger: "manual",
                sanitize: false,
                animation: false,
                content: function (context, src) {
                    $(this).attr('data-init', true);
                    var song_id = $(this).data('id');
                    var song = window['song_data_' + song_id];
                    __DEV__ && console.log(song);
                    return tmpl($(this).data('target'), song);
                },
                title: function () {
                    var title = $(this).attr("data-popover-content");
                    return $(title).children(".popover-heading").html();
                },
                placement: function (context, src) {
                    MusicPopover.context = $(context);
                    $(context).find('.popover-header').remove();
                    $(context).find('.popover-body').addClass('p-0');
                    if ($(src).data('placement')) {
                        return $(src).data('placement');
                    } else {
                        return 'top';
                    }
                }
            }).on("show.bs.popover", function (e) {
                $("[rel=popover]").not(e.target).popover("destroy");
                $(".popover").remove();
            }).on('shown.bs.popover', function (e) {
                var el_id = MusicPopover.context.attr('id');
                var song_id = $(this).data('id');
                setTimeout(function () {
                    if ($('#' + el_id).length) {
                        $.ajax({
                            url: route.route('api.song', {id: song_id}),
                            type: "get",
                            success: function (response) {
                                if (response.genres && response.genres.length) {
                                    response.genres.forEach(function (i) {
                                        var tag = $("<a />");
                                        tag.addClass('tag');
                                        tag.attr('href', route.route('frontend.genre', {slug: i.alt_name}))
                                        tag.html(i.name)
                                        $('#' + el_id).find('.tags-wrapper').append(tag);
                                    });
                                }
                            }
                        });
                    }
                    return false;
                }, 1100);
            }).on("mouseenter", function () {
                var _this = this;
                $(this).popover("show");
                $(".popover").on("mouseleave", function () {
                    $(_this).popover('hide');
                });
            }).on("mouseleave", function () {
                var _this = this;
                setTimeout(function () {
                    if (!$(".popover:hover").length) {
                        $(_this).popover("hide");
                    }
                }, 1000);
            }).data("bs.popover");
        }
    }


    $(window).on("infinityLoadMoreHasBeenLoaded", MusicPopover.init);
    $(window).on("enginePageHasBeenLoaded", MusicPopover.init);
    $(window).on('engineNeedHistoryChange', function () {
        $('.popover').remove();
    });

    $(window).on("engineHistoryChange", Pagination.reset);
    $(document).ready(Pagination.init);

    $(window).on("enginePageHasBeenLoaded", function () {
        $('.datepicker').datepicker();
        $('select.select2').select2({
            width: '100%',
            placeholder: "Please select",
            maximumSelectionLength: 4
        });
        $('select.select2-tags').select2({
            width: '100%',
            tags: true,
            placeholder: 'Select or type the tags',
            maximumSelectionLength: 4
        });
    });

    $(window).on("infinityLoadMoreHasBeenLoaded", function () {
        $('.datepicker').datepicker();
        $('select.select2').select2({
            width: '100%',
            placeholder: "Please select",
            maximumSelectionLength: 4
        });
    });

    window.BrowseStation = {
        init: function () {
            if ($('.toolbar-filter-city-select2').length) {
                $('.toolbar-filter-city-select2').next().remove();
                $('select.toolbar-filter-city-select2').select2({
                    dropdownCssClass: "toolbar-filter",
                    placeholder: Language.text.CITY,
                });
            }
            if ($('.toolbar-filter-language-select2').length) {
                $('.toolbar-filter-language-select2').next().remove();
                $('select.toolbar-filter-language-select2').select2({
                    dropdownCssClass: "toolbar-filter",
                    placeholder: Language.text.LANGUAGE,
                });
            }
            if ($('.toolbar-filter-city-select2').length) {
                BrowseStation.selectCity()
            }
            if ($('.toolbar-filter-language-select2').length) {
                BrowseStation.selectLanguage()
            }
            if (!$('.toolbar-country-filter-select2').next().length) {
                $('select.toolbar-country-filter-select2').select2({
                    dropdownCssClass: "toolbar-filter",
                    placeholder: Language.text.COUNTRY,
                });
            }
            $('.toolbar-country-filter-select2').bind('change', function () {
                var country_code = $(this).val();
                if (country_code) {
                    $.post(route.route('frontend.radio.get.city'), {
                        countryCode: country_code,
                    }, function (data) {
                        $('.toolbar-filter-city').removeClass('d-none').html(data);
                        $('.toolbar-filter-city-select2').select2({
                            dropdownCssClass: "toolbar-filter",
                            placeholder: Language.text.CITY,
                        });
                        BrowseStation.selectCity()
                    });
                    $.post(route.route('frontend.radio.get.language'), {
                        countryCode: country_code,
                    }, function (data) {
                        $('.toolbar-filter-language').removeClass('d-none').html(data);
                        $('.toolbar-filter-language-select2').select2({
                            dropdownCssClass: "toolbar-filter",
                            placeholder: Language.text.LANGUAGE,
                        });
                        BrowseStation.selectLanguage()
                    });

                    BrowseStation.params.country = country_code;
                    delete BrowseStation.params.city_id;
                    delete BrowseStation.params.language_id;
                    BrowseStation.build();
                    return false;
                }
            });
        },
        params: {},
        clear: function () {
            BrowseStation.params = {};
        },
        selectCity: function () {
            $('.toolbar-filter-city-select2').bind('change', function () {
                var city_id = $(this).val();
                if (city_id) {
                    BrowseStation.params.city_id = city_id;
                    BrowseStation.build();
                } else {
                    delete BrowseStation.params.city_id;
                    BrowseStation.build();
                }
            });
        },
        selectLanguage: function () {
            $('.toolbar-filter-language-select2').bind('change', function () {
                var language_id = $(this).val();
                if (language_id) {
                    BrowseStation.params.language_id = language_id;
                    BrowseStation.build();
                } else {
                    delete BrowseStation.params.language_id;
                    BrowseStation.build();
                }
            });
        },
        build: function () {
            var esc = encodeURIComponent;
            var query = Object.keys(BrowseStation.params)
                .map(function (k) {
                    return esc(k) + '=' + esc(BrowseStation.params[k]);
                })
                .join('&');
            __DEV__ && console.log(query);
            var url = window.location.href.split("?")[0] + '?' + query;
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

            window.history.pushState({
                href: url
            }, url, window.location.href.split("?")[0] + '?' + query + '&browsing=true');

            var gridEL = $('#stations-grid');
            $.ajax({
                url: window.location.href.split("?")[0] + '?' + query + '&browsing=true',
                type: "get",
                beforeSend: function () {
                    gridEL.empty();
                    $('<div/>', {
                        id: "infinity-loading",
                    }).appendTo(gridEL);
                },
                success: function (response) {
                    $("#infinity-loading").remove();
                    gridEL.html(response);
                }
            });
        }
    }
    $(window).ready(function () {
        BrowseStation.init();
        $(window).on("enginePageHasBeenLoaded", function () {
            $('.toolbar-country-filter-select2').unbind('change');
            $('.toolbar-filter-city-select2').unbind('change');
            $('.toolbar-filter-language-select2').unbind('change');
            setTimeout(function () {
                BrowseStation.init();
            }, 500)
        });
        $(window).on('engineNeedHistoryChange', BrowseStation.clear);

        $(window).on("engineReloadCurrentPage", function () {
            var url = window.location.href.toString().split(window.location.host)[1];
            $.ajax({
                url: url,
                type: "get",
                data: {
                    ajax: true
                },
                beforeSend: function () {
                    //$("#page").html(loading);
                },
                success: function (response) {
                    $("#page").html(response);
                    $.engineUtils.cleanStorage();
                    $(window).trigger({
                        type: "enginePageHasBeenLoaded",
                    });
                }
            });
        });
        $(window).on("engineSiteContentChange", $.engineUtils.cleanStorage);
        setTimeout(function () {
            $(window).trigger({
                type: "enginePageHasBeenLoaded"
            });
        }, 2000);
    });
    window.GlobalReport = {
        click: function() {
            var type = $(this).attr('data-type');
            var id = $(this).attr('data-id');
            GlobalReport.popup(type, id);
        },
        popup: function (type, id) {
            if (!User.isLogged()) {
                User.SignIn.show();
                return false;
            }
            var problems = [];
            if(type === "podcast") {
                problems = Language.text.PODCAST_REPORT ? Language.text.PODCAST_REPORT : [];
            } else if(type === "episode") {
                problems = Language.text.PODCAST_EPISODE_REPORT ? Language.text.PODCAST_EPISODE_REPORT : [];
            } else if(type === "song") {
                problems = Language.text.SONG_REPORT ? Language.text.SONG_REPORT : [];
            }
            bootbox.prompt({
                title: "Report",
                message: '<p>You can report after selecting a problem.</p>',
                centerVertical: true,
                inputType: 'radio',
                inputOptions: problems,
                callback: function (result) {
                    if(result) {
                        var reportable_type;
                        if(type === "podcast") {
                            reportable_type = 'App\\Models\\Podcast'
                        } else if(type === "episode") {
                            reportable_type = 'App\\Models\\Episode'
                        } else if(type === "song") {
                            reportable_type = 'App\\Models\\Song'
                        }
                        Report.init(reportable_type, id, problems[(parseInt(result) - 1)].text, Language.text.SUCCESS_REPORT_PROBLEMS)
                        __DEV__ && console.log('Reported', reportable_type, id);
                    }
                }
            });
        }
    }

    $(document).on('click', '[data-action="report"]', GlobalReport.click);
    $(document).on('click', '#logo', function () {
        $('#landing-hero').remove();
        $('#main').removeClass('d-none');
    })
    $(window).on('engineNeedHistoryChange', function () {
        $('#landing-hero').remove();
        $('#main').removeClass('d-none');
    });
    $(document).on('click', '[data-action="sidebar-dismiss"]', $.engineSideBar.hide);
    $(document).on('click', '[data-action="download"]', function () {
        var song = $.engineUtils.getSongData($(this));
        Download.init(song);
    });

    $(window).on("enginePageHasBeenLoaded", function () {
        var lazyLoadInstance = new LazyLoad({});
        $('[data-content="snapshot-search"]').each(function () {
            var model = $(this);
            $.ajax({
                url: route.route('frontend.search.' + model.attr('data-type'), {slug: model.attr('data-keyword')}),
                data: {
                    limit: 3
                },
                type: 'get',
                dataType: 'json',
                success: function (response) {
                    if(response && response.data.length) {
                        model.removeClass('hide');
                        var num = response.data.length;
                        for (var i = 0; i < num; i++) {
                            var item = tmpl('tmpl-snapshot-item', {
                                item: response.data[i],
                                type: model.attr('data-type')
                            })
                            model.find('ul.snapshot').append(item);
                            window[model.attr('data-type') + '_data_' +  response.data[i].id] =  response.data[i];
                        }
                    }
                }
            });
        });
    });

    $(document).on('click', '[data-action="remove-session"]', function () {
        var session_id = $(this).attr('data-id');
        $.ajax({
            url: route.route('frontend.auth.user.remove.session'),
            type: "post",
            data: {
                session_id: session_id
            },
            beforeSend:function(){
                return confirm("Are you sure want to remove this device?");
            },
            success: function (response) {
                $.engineUtils.cleanStorage();
                $(window).trigger({
                    type: "engineReloadCurrentPage"
                });
            }
        });
    });
    $(document).ready(function () {
        if(window.location.pathname === route.route('frontend.sign-in')) {
            $.engineLightBox.show("lightbox-login");
        }
        if(window.location.pathname === route.route('frontend.sign-up')) {
            $.engineLightBox.show("lightbox-signup");
        }
    });
    $(window).on("enginePageHasBeenLoaded", function () {
        var el = $('[data-action="get-lyric"]');
        if(el.length) {
            var id = el.data('id');
            $.ajax({
                url: route.route('frontend.lyrics.get', {id: id}),
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    el.find('.lyric-content').html(response);
                    el.removeClass('d-none');
                }
            });
        }
    });
    $(document).on('change', '.input-group [type=file]', function () {
        var fileName = $(this).val();
        $(this).next().val(fileName.replace(/C:\\fakepath\\/i, ''));
    });
    $(document).on('click', '#header-search-menu', function () {
        $('#sticky_header').addClass('fixed-nav');
    });
    $(window).on("enginePageHasBeenLoaded", function () {
        $('.datetimepicker').datetimepicker();
    });

    if(!$.engineUtils.isMobile()) {
        var playlistBar = $('#sidebar');
        var playlistBarHeight = parseInt($('#sideMenu').height()) - parseInt($('#aside_ul').height()) - 80;
        console.log(playlistBarHeight);
        playlistBar.css('height', playlistBarHeight + 'px');
    }
});
