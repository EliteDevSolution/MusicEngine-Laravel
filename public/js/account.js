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

    window.User = {};
    var typingTimer;
    User.userInfo = {};
    User.oneTimeCommand = false;
    User.Playlists = {};
    User.CollaboratePlaylists = {};
    User.isLogged = function () {
        return User.userInfo.id !== undefined;
    };
    User.Actions = {
        removeActivity: function(el){
            var eventId = el.data("id");
            bootbox.confirm({
                title: "Confirm",
                message: "Do you want to remove this activity?",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        $.ajax({
                            url: route.route('frontend.auth.user.removeActivity'),
                            data: {
                                'id': eventId
                            },
                            type: 'post',
                            dataType: 'json',
                            success: function(response) {
                                $(el).closest(".module-feed-event").fadeOut();
                            }
                        });
                    }
                }
            });
        }
    };

    User.SignUp = {
        loaded: false,
        finishedButton: $(".lightbox-signup .finished"),
        submitButton: $(".lightbox-signup .submit"),
        error_box:  $(".lightbox-signup .lightbox-error"),
        signuprForm:  $("#singup-form"),
        showError: function(msg){
            this.error_box.removeClass("hide").html(msg);
        },
        hideError: function(el){
            this.error_box.addClass("hide");
        },
        reset: function(){
            User.SignUp.signuprForm.trigger("reset");
            this.error_box.addClass("hide");
            $(".lightbox-signup").find(".control-group").removeClass("field-error");
            $(".lightbox-signup").find(".control-group").removeClass("success");
            $("#signup-stage-singup").removeClass("hide");
            $("#signup-stage-profile").addClass("hide");
            $("#signup-stage-complete").addClass("hide");
            User.SignUp.signuprForm.find("[type='submit']").removeClass("hide");
            User.SignUp.signuprForm.find("[type='submit']").html(Language.text.SIGN_UP);
            User.SignUp.signuprForm.attr('action', route.route('frontend.auth.info.validate'));
        },
        captcha: function() {
            grecaptcha.ready(function() {
                grecaptcha.execute($('meta[name="recaptcha-key"]').attr('content'), {action: 'subscribe_newsletter'}).then(function(token) {
                    $('#singup-form').prepend('<input type="hidden" name="token" value="' + token + '">');
                });
            });
        },
        init: function() {
            if($('meta[name="recaptcha-key"]').attr('content')) {
                User.SignUp.captcha();
            }
            $.engineLightBox.show("lightbox-signup");
            User.SignUp.reset();
            $('#singup-form').ajaxForm({
                beforeSerialize: function($form, options) {

                },
                beforeSubmit: function(data, $form, options) {
                    var error = 0;
                    Object.keys(data).forEach(function eachKey(key) {
                        if(data[key].required && ! data[key].value){
                            $form.find("[name='" + data[key].name + "']").closest(".control").addClass("field-error");
                            error++;
                        } else if (data[key].required && data[key].value) {
                            $form.find("[name='" + data[key].name + "']").closest(".control").removeClass("field-error");
                        }
                    });
                    if(error) return false;
                    $form.find("[type='submit']").attr("disabled", "disabled");
                },
                success: function(response, textStatus, xhr, $form) {
                    User.SignUp.hideError();
                    if($form.attr('action') === route.route('frontend.auth.info.validate')) {
                        User.SignUp.stepTwo();
                        $form.attr('action', route.route('frontend.auth.signup'));
                        $form.find("[type='submit']").html(Language.text.IM_FINISHED);
                    } else if($form.attr('action') === route.route('frontend.auth.signup')) {
                        User.SignUp.signuprForm.find("[type='submit']").addClass("hide");
                        if(response.activation !== undefined) {
                            $(".lightbox-signup .lb-nav-outer").addClass("hide");
                            $(".lightbox-signup .continue.finished").addClass("hide");
                            $(".lightbox-signup .submit").addClass("hide");
                            $(".lightbox-signup .close").removeClass("hide");
                            $("#signup-stage-singup").addClass("hide");
                            $("#signup-stage-profile").addClass("hide");
                            $("#signup-stage-verify").removeClass("hide");
                        } else {
                            User.SignIn.me();
                            $(".lightbox-signup .lb-nav-outer").addClass("hide");
                            $(".lightbox-signup .continue.finished").addClass("hide");
                            $(".lightbox-signup .submit").addClass("hide");
                            $(".lightbox-signup .continue.close").removeClass("hide");
                            $("#signup-stage-singup").addClass("hide");
                            $("#signup-stage-profile").addClass("hide");
                            $('.edit-profile').attr('href', route.route('frontend.user', {'username': response.username }));
                            if($('#im-artist').is(':checked')){
                                /** direct to artist claiming landing page */
                                $.engineLightBox.hide();
                                setTimeout(function () {
                                    $(window).trigger({
                                        type: 'engineNeedHistoryChange',
                                        href: route.route('frontend.auth.upload')
                                    });
                                }, 3000);
                            } else {
                                /** if not artist show signup stage complete */
                                $("#signup-stage-complete").removeClass("hide");
                                $(".profile-url").html(route.rootUrl() + route.route('frontend.user', {'username': response.username }));
                                $('.create-artist').bind('click', function () {
                                    $(window).trigger({
                                        type: 'engineNeedHistoryChange',
                                        href: route.route('frontend.auth.upload')
                                    });
                                });
                            }
                        }
                    }
                },
                error: function(e, textStatus, xhr, $form) {
                    var errors = e.responseJSON.errors;
                    $.each( errors , function( key, value ) {
                        Toast.show("error", value[0], null);
                    });
                    User.SignUp.showError(e.responseJSON.errors[Object.keys(e.responseJSON.errors)[0]][0])
                    $form.find("[type='submit']").removeAttr("disabled");
                }
            });
        },
        stepTwo: function () {
            $("#signup-stage-singup").addClass("hide");
            $("#signup-stage-profile").removeClass("hide");
            User.SignUp.submitButton.addClass("hide");
            $(".lightbox-signup .continue.finished").removeClass("hide");
            $(".lightbox-signup .lb-nav-outer").addClass("hide");
            var usernameInput = $("#signup-username");
            usernameInput.focus();
            usernameInput.on('keyup', function (e) {
                if (e.keyCode === 13) {
                    return false;
                }
                var username = $(this).val();
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () {
                    $.ajax({
                        url: route.route('frontend.auth.info.validate.username'),
                        type: "post",
                        data: {
                            username: username
                        },
                        success: function () {
                            User.SignUp.hideError();
                            User.SignUp.signuprForm.find("[type='submit']").removeAttr("disabled");
                            usernameInput.addClass('text-success');
                            usernameInput.removeClass('text-danger');
                        },
                        error: function (jqXHR) {
                            var serverMsg =  JSON.parse(jqXHR.responseText);
                            User.SignUp.showError(serverMsg.errors[Object.keys(serverMsg.errors)[0]][0]);
                            User.SignUp.signuprForm.find("[type='submit']").attr("disabled", "disabled");
                            usernameInput.addClass('text-danger');
                            usernameInput.removeClass('text-success');
                        }
                    })
                }, 300);
            });
        }
    };
    User.SignIn = {
        submitButton: $(".lightbox-login .submit"),
        error_box:  $(".lightbox-login .lightbox-error"),
        signinForm: $("#lightbox-login-form"),
        friends: [],
        updateStatus: false,
        show: function() {
            $.engineLightBox.show("lightbox-login");
        },
        showError: function(el, msg){
            this.error_box.removeClass("hide").html(msg);
            $(el).closest(".control-group").addClass("field-error");
            return false;
        },
        hideError: function(el){
            this.error_box.addClass("hide");
            $(el).closest(".control-group").removeClass("field-error");
        },
        init: function() {
            User.SignIn.submitButton.bind('click', this.submit);
            User.SignIn.signinForm.keypress(function(e) {
                if (e.which === 13) {
                    User.SignIn.submitButton.trigger('click');
                }
            });
        },
        submit: function() {
            User.SignIn.request();
        },
        request: function () {
            var url = route.route('frontend.auth.login');
            var formData = User.SignIn.signinForm.serialize();
            $.ajax({
                url: url,
                type: "post",
                data: formData,
                dataType: 'json',
                success: function () {
                    User.SignIn.me();
                    $.engineLightBox.hide();
                    if(window.location.pathname === route.route('frontend.homepage')) {
                        $(window).trigger({
                            type: "engineReloadCurrentPage"
                        });
                    }
                },
                error: function (jqXHR) {
                    __DEV__ && console.log(jqXHR);
                    /**
                     * server will return 403 error if user is banned, 401 if unauthorized
                     */
                    if(jqXHR.status === 403){
                        User.SignIn.showError($(".lightbox-login #login-username, .lightbox-login #login-email, .lightbox-login #login-password"), jqXHR.responseJSON.message)
                    } else {
                        var serverMsg =  JSON.parse(jqXHR.responseText);
                        User.SignIn.showError($(".lightbox-login #login-username, .lightbox-login #login-email, .lightbox-login #login-password"), serverMsg.errors[Object.keys(serverMsg.errors)[0]][0])
                    }
                }
            })
        },
        me: function () {
            $.ajax({
                url: route.route('frontend.auth.user'),
                type: "post",
                success: function (response) {
                    User.userInfo = response;
                    //push user status to FireBase server
                     Firebase.pushUserStatus(User.userInfo.username);
                    //Build right bar playlist
                    User.SignIn.buildPlaylists(User.userInfo);
                    User.SignIn.buildCollaboratePlaylists(User.userInfo);
                    User.SignIn.buildSubscribedPlaylists(User.userInfo);
                    $('body').addClass('signed-in');
                    if(User.userInfo.notif_count > 0 ) {
                        $("#header-notification-pill").removeClass("hide");
                        $("#header-notification-count").html(User.userInfo.notif_count);
                    } else {
                        $("#header-notification-pill").addClass("hide");
                    }
                    $("#header-signup-btn, #header-login-btn").addClass("hide");
                    $("#header-account-group, #notification-button").removeClass("hide")
                    $("#header-account-group, #cart-button").removeClass("hide");
                    $("#header-account-group img.profile-img").attr("src", User.userInfo.artwork_url);
                    $("#header-account-group .title").html(User.userInfo.name);
                    $("#header-user-menu img").attr("src", User.userInfo.artwork_url);
                    $(".user-info .info-artwork img").attr("src", User.userInfo.artwork_url);
                    $(".user-info .info-profile .info-name").html(User.userInfo.name);
                    $(".user-info .info-profile .info-link").attr('href', '/' + User.userInfo.username);
                    $(".user-auth").removeClass('hide');
                    $(".un-auth").addClass('hide');
                    /**
                     * Mobile User Menu
                     */
                    $('.auth-my-playlists-link').attr('href', route.route('frontend.user.playlists', {'username': User.userInfo.username}));
                    $('.auth-notifications-link').attr('href', route.route('frontend.user.notifications', {'username': User.userInfo.username}));
                    $('.auth-my-music-link').attr('href', route.route('frontend.user.collection', {'username': User.userInfo.username}));

                    if(User.userInfo.should_subscribe) {
                        $('.user-subscription-helper').removeClass('hide');
                    }


                    //$("#header-account-group a").attr('href', "/" + User.userInfo.username);
                    $('body').addClass("sidebar-open");
                    User.SignIn.getFriends();
                    if(!User.oneTimeCommand){
                        User.oneTimeCommand = true;
                        if(parseInt(User.userInfo.restore_queue)){
                            if (typeof EMBED !== 'undefined') {
                                setTimeout(function () {
                                    EMBED.Player.restore_queue();
                                }, 5000)
                            }
                        }
                    }
                    User.userInfo.artist_id ? Artist.init() : null;
                    window['user_data_' + User.userInfo.id] = User.userInfo;
                    $("#sidebar-no-friends, #sidebar-invite-cta").find('.share').attr('data-id', User.userInfo.id);

                    //Set player properties
                    EMBED.AudioVolumeFade = User.userInfo.play_pause_fade;
                    if(User.userInfo.can_stream_high_quality) {
                        $.enginePlayMedia.hd = ! $.enginePlayMedia.hd;
                        $('body').toggleClass("embed_hd_on");
                    }

                    if(User.userInfo.can_upload) {
                        $('#upload-button').removeClass('hide');
                    } else {
                        $('#upload-button').addClass('hide');
                    }
                    if(User.userInfo.artist_id) {
                        $('#artist-management-link').removeClass('hide');
                    } else {
                        $('#artist-management-link').addClass('hide');
                    }
                    Notifications.getCount();
                    $('#see-more-notifications').attr('href', route.route('frontend.user.notifications', {'username' : User.userInfo.username}))
                    $('.after-login').removeClass('hide');
                    $('.before-login').addClass('hide');
                    $(window).trigger({
                        type: "engineUserLoggedIn"
                    });
                    if(! GLOBAL.logged_landing) {
                        $('#landing-hero').remove();
                    }
                    $('#main').removeClass('d-none');
                    if(GLOBAL.dob_signup && ! User.userInfo.birth) {
                        $.engineLightBox.show("lightbox-dob-update");
                    }

                }
            });
        },
        renderSidebarPlaylist: function(el, playlists){
            $(el).empty();
            __DEV__ && console.log(el, playlists);
            if(playlists && playlists.length) {
                var num = playlists.length;
                for (var i = 0; i < num; i++) {
                    var playlist = tmpl('tmpl-sidebar-playlist', playlists[i])
                    $(el).append(playlist);
                    window['playlist_data_' +  playlists[i].id] =  playlists[i];
                }
            }
        },
        buildPlaylists: function(user) {
            if(!$.engineUtils.objectKeys(user.playlists_menu)){
                //config object for contextmenu
                User.Playlists = {
                    "new_playlist": {
                        name: Language.text.CONTEXT_NEW_PLAYLIST
                    },
                }
            } else {
                var menu = {
                    "new_playlist": {
                        name: Language.text.CONTEXT_NEW_PLAYLIST
                    },
                    "sep1": "---------"
                };
                $.extend(menu, user.playlists_menu);
                User.Playlists = menu;
            }
            this.renderSidebarPlaylist('#sidebar-playlists-grid', user.playlists);
            if((user.playlists && user.playlists.length) || user.subscribed && user.subscribed.length) {
                $("#sidebar-no-playlists").addClass('hide');
                $("#sidebar-have-playlists").removeClass('hide');
            } else {
                $("#sidebar-no-playlists").removeClass('hide');
                $("#sidebar-have-playlists").addClass('hide');
            }
        },
        buildCollaboratePlaylists: function(user) {
            User.CollaboratePlaylists = user.collaborate_playlists_menu;
            this.renderSidebarPlaylist('#sidebar-collab-playlists-grid', user.collaborations)
        },
        buildSubscribedPlaylists: function(user) {
            this.renderSidebarPlaylist('#sidebar-subbed-playlists-grid', user.subscribed);
        },
        getFriends: function () {
            var url = route.route('api.user.following', {id: User.userInfo.id});
            $.ajax({
                url: url,
                type: "get",
                success: function (response) {
                    response.users = response.profile.following.data;
                    response.users && response.users.length ? $("#sidebar-no-friends").addClass("hide") && $("#sidebar-friends").removeClass('hide') && $("#sidebar-invite-cta").removeClass('hide') : $("#sidebar-no-friends").removeClass("hide") && $("#sidebar-friends").addClass('hide');
                    if(response.users && response.users.length) {
                        User.SignIn.friends = response.users;
                        var num = response.users.length;
                        for (var i = 0; i < num; i++) {
                            //check user online status
                            Firebase.checkUserOnlineStatus(response.users[i].username);
                            var friend_el = $("#friend-id-" + response.users[i].id);
                            if (! friend_el.length) {
                                var user = tmpl('tmpl-sidebar-friend', response.users[i]);
                                $("#sidebar-friends").append(user);
                                window['user_data_' + response.users[i].id] = response.users[i];
                            }
                        }
                        setTimeout(function () {
                            $("#sidebar-friends .module-cell").removeClass("loading");
                        }, 2000)
                    }
                }
            })
        }
    };

    window.Connect = {
        thirdParty: {
            redirect: function (service) {
                window.open(route.route('frontend.auth.login.socialite.redirect', {'service': service}),'_blank','height=450,width=750');
            },
            callback: function (data, service){
                if(! User.isLogged()) {
                    User.SignIn.me();
                    $.engineLightBox.hide();
                    Toast.show("success", ('Successfully logged in with :service').replace(':service', service));

                }
                Connect.thirdParty.connected(data, service);
            },
            error: function(service){
                Toast.show("error", ('Your :service has been associated with another account.').replace(':service', service));
            },
            connected: function (data, service) {
                if(window.location.pathname === route.route('frontend.settings.services')) {
                    $(window).trigger({
                        type: "engineReloadCurrentPage"
                    });
                }
                if(service === 'facebook') {
                    Artist.claim.el.find('.facebook-icon-container > img').attr('src', data.avatar).removeClass('hide');
                    Artist.claim.el.find('.facebook-icon-container > .icon').addClass('hide');
                    Artist.claim.el.find('.facebook .icon-message').html('Connected as ' + data.name);
                    Artist.claim.el.find('.facebook .btn').addClass('hide');
                }
            }

        }
    };


    $(document).on('click', '[data-action="social-login"]', function () {
        var service = $(this).data('service');
        Connect.thirdParty.redirect(service)
    });

    User.SignOut = function () {
        $.ajax({
            url: route.route('frontend.auth.logout'),
            type: "get",
            success: function (response) {
                if(response.success === true) {
                    $("#header-signup-btn, #header-login-btn").removeClass("hide");
                    $("#header-account-group, #notification-button").addClass("hide");
                    $("#header-account-group, #cart-button").addClass("hide");
                    $(".user-auth").addClass('hide');
                    $('.un-auth').removeClass('hide');
                    $('body').removeClass("sidebar-open");
                    $('body').removeClass('signed-in');
                    User.userInfo = {};
                    User.SignIn.updateStatus = false;
                    if(window.location.pathname === route.route('frontend.homepage')) {
                        $(window).trigger({
                            type: "engineReloadCurrentPage"
                        });
                    } else {
                        $(window).trigger({
                            type: 'engineNeedHistoryChange',
                            href: route.route('frontend.homepage')
                        });
                    }
                    $('.after-login').addClass('hide');
                    $('.before-login').removeClass('hide');
                    $('body').removeClass('embed_hd_on');
                    $.enginePlayMedia.hd = false;
                }
            }
        });
    };

    User.Playlist = {
        submit: $("#create-playlist .submit"),
        form: $('#create-playlist-form'),
        editForm: $('#edit-playlist-form'),
        create: function(mediaId, mediaType, mediaItems){
            if(!User.isLogged()){
                User.SignIn.show();
                return false;
            }
            User.Playlist.form.trigger("reset");
            $.engineLightBox.show("lightbox-createPlaylist");
            User.Playlist.form.find('img').attr('src', route.route('frontend.homepage') + 'common/default/playlist.png');
            $.engineUtils.makeSelectOption(User.Playlist.form.find('select[name=genre\\[\\]]'), User.userInfo.allow_genres);
            $.engineUtils.makeSelectOption(User.Playlist.form.find('select[name=mood\\[\\]]'), User.userInfo.allow_moods);
            $('#create-playlist-form').ajaxForm({
                beforeSubmit: function(data, $form, options) {
                    var error = 0;
                    Object.keys(data).forEach(function eachKey(key) {
                        if(data[key].required && ! data[key].value){
                            $form.find("[name='" + data[key].name + "']").closest(".control").addClass("field-error");
                            error++;
                        } else if (data[key].required && data[key].value) {
                            $form.find("[name='" + data[key].name + "']").closest(".control").removeClass("field-error");
                        }
                    });
                    if(error) return false;
                    $form.find("[type='submit']").attr("disabled", "disabled");
                },
                success: function(response, textStatus, xhr, $form) {
                    $form.find("[type='submit']").removeAttr("disabled");
                    $form.trigger("reset");
                    User.Playlist.created(response, $form);
                    if(mediaId || (mediaItems && mediaItems.length)) User.Playlist.addItem(mediaId, mediaType, response.id, mediaItems);
                },
                error: function(e, textStatus, xhr, $form) {
                    var errors = e.responseJSON.errors;
                    $.each( errors , function( key, value ) {
                        Toast.show("error", value[0], null);
                    });
                    $form.find('.error').removeClass('hide').html(e.responseJSON.errors[Object.keys(e.responseJSON.errors)[0]][0]);
                    $form.find("[type='submit']").removeAttr("disabled");
                }
            });
        },
        created: function(response, $form) {
            $.engineLightBox.hide();
            Toast.show("playlist", null, Language.text.POPUP_CREATED_PLAYLIST.replace(':playlistLink', Favorite.objectLink(response.title, response.permalink_url)));
            User.SignIn.me();
        },
        edited: function(response, $form) {
            $(window).trigger({
                type: "engineSiteContentChange"
            });
            $(window).trigger({
                type: "engineReloadCurrentPage"
            });
            $.engineLightBox.hide();
            Toast.show("playlist", null, Language.text.POPUP_EDITED_PLAYLIST.replace(':playlistLink', Favorite.objectLink(response.title, response.permalink_url)));
            User.SignIn.me();
        },
        onPlaylistArtworkChange: function() {
            User.Playlist.form.find('.input-playlist-artwork').change(function(){
                var input = this;
                var url = $(this).val();
                var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
                if (input.files && input.files[0]&& (ext === "gif" || ext === "png" || ext === "jpeg" || ext === "jpg"))
                {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        User.Playlist.form.find('img').attr('src', e.target.result);
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            });
            User.Playlist.editForm.find('.input-playlist-artwork').change(function(){
                var input = this;
                var url = $(this).val();
                var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
                if (input.files && input.files[0]&& (ext === "gif" || ext === "png" || ext === "jpeg" || ext === "jpg"))
                {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        User.Playlist.editForm.find('img').attr('src', e.target.result);
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            });
        },
        rename: function(a){
            if(!User.isLogged()){
                User.SignIn.show();
                return false;
            }
            var playlist = window['playlist_data_' + a];
            __DEV__ && console.log(playlist);
            User.Playlist.editForm.find("input[name='title']").attr('value', playlist.title);
            User.Playlist.editForm.find("input[name='id']").val(playlist.id);
            User.Playlist.editForm.find("img").attr('src', playlist.artwork_url);
            $.engineUtils.makeSelectOption(User.Playlist.editForm.find('select[name=genre\\[\\]]'), User.userInfo.allow_genres);
            $.engineUtils.makeSelectOption(User.Playlist.editForm.find('select[name=mood\\[\\]]'), User.userInfo.allow_moods);
            if(playlist.genre) {
                playlist.genre.split(',').forEach(function (i) {
                    User.Playlist.editForm.find('select[name=genre\\[\\]] option[value="' + i + '"]').attr('selected', 'selected')
                })
            }
            if(playlist.mood) {
                playlist.mood.split(',').forEach(function (i) {
                    User.Playlist.editForm.find('select[name=mood\\[\\]] option[value="' + i + '"]').attr('selected', 'selected')
                })
            }

            if(playlist.visibility) {
                User.Playlist.editForm.find('input[name="visibility"]').attr('checked','checked');
            } else {
                User.Playlist.editForm.find('input[name="visibility"]').removeAttr('checked');
            }

            setTimeout(function () {
                User.Playlist.editForm.find('.select2').select2({
                    width: '100%',
                    placeholder: "Please select",
                    maximumSelectionLength: 4
                });
            }, 100);
            $.engineLightBox.show("lightbox-rename");
        },
        sort: function(){
            if( ! $(".sortable").length) return false;
            __DEV__ &&  console.log("start sort able");
            $(".sortable").sortable({
                handle: ".drag-handle",
                scroll: false,
                cancel: "span",
                placeholder: "sortable-playlist-song-placeholder",
                cursorAt: {
                    top: 0,
                    left: 0
                },
                helper: function(e, item) {
                    var song = $.engineUtils.getSongData(item);
                    var helper = $("<div />");
                    helper.addClass('sortable-playlist-song-helper')
                    helper.append(song.title);
                    return helper;
                },
                start: function(e, ui) {
                    $('body').addClass("lock-childs");
                    ui.item.show();
                },
                update: function(e, ui) {
                    var data = {};
                    data.playlist_id = $(this).data("id");
                    data.nextOrder = $(this).sortable('toArray', {
                        attribute: 'data-id',
                    });
                    data.nextOrder =  data.nextOrder.filter(Boolean);
                    data.nextOrder =JSON.stringify(data.nextOrder)
                    $.ajax({
                        type: 'post',
                        url: route.route('frontend.auth.user.playlist.manage'),
                        data: data,
                        success: function(response){
                            __DEV__ &&  console.log('Successfully re-ordered items.');
                            Toast.show('playlist', Language.text.POPUP_PLAYLIST_SAVE_DESCRIPTION)
                            $(window).trigger({
                                type: "engineSiteContentChange"
                            });
                        }
                    });
                },
                stop: function(e, ui) {
                    setTimeout(function () {
                        $('body').removeClass("lock-childs");
                    }, 500)
                }
            });
        },
        collaborate: {
            el: null,
            set: function(playlist_id, action) {
                if (!User.isLogged()) {
                    User.SignIn.show();
                    return false;
                }
                if(! action ) {
                    bootbox.confirm({
                        title: Language.text.PLAYLIST_COLLABORATION_TURN_OFF_TITLE,
                        message: Language.text.PLAYLIST_COLLABORATION_TURN_OFF_DESCRIPTION,
                        centerVertical: true,
                        callback: function (result) {
                            if(result) {
                                $.ajax({
                                    url: route.route('frontend.auth.user.playlist.collaboration.set'),
                                    type: "post",
                                    data:{
                                        playlist_id: playlist_id,
                                        action:  action
                                    },
                                    success: function () {
                                        window['playlist_data_' + playlist_id].collaboration = action;
                                        Toast.show("success", "Playlist collaboration has been disabled.");
                                    }
                                });
                            }
                        }
                    });
                } else {
                    $.ajax({
                        url: route.route('frontend.auth.user.playlist.collaboration.set'),
                        type: "post",
                        data:{
                            playlist_id: playlist_id,
                            action:  action
                        },
                        success: function () {
                            window['playlist_data_' + playlist_id].collaboration = action;
                            Toast.show("success", "Playlist is now set to collaborate", "Congratulation!");
                        }
                    });
                }

            },
            invite: function(playlist_id) {
                if (!User.isLogged()) {
                    User.SignIn.show();
                    return false;
                }
                $("#friends-can-collaborate .invite-to-collaborate").not(':first').remove();
                $.engineLightBox.show("lightbox-invite-collaborate");
                $.ajax({
                    url: route.route('api.user.following', {id: User.userInfo.id}),
                    type: "get",
                    beforeSend: function(){
                        $('.invite-collaborate-loading').removeClass('hide');
                    },
                    success: function (response) {
                        $('.invite-collaborate-loading').addClass('hide');
                        var num = response.profile.following.data.length;
                        var users = response.profile.following.data;
                        for (var i = 0; i < num; i++) {
                            var friend_el = $("#friend-id-" + users[i].id);
                            if (friend_el.length) {
                                var friend_id = users[i].id;
                                var user = $("#friends-can-collaborate .invite-to-collaborate:first").clone();
                                $(user).removeClass("hide");
                                if (users[i].status === "online") $(user).find(".online").removeClass("hide");
                                if (users[i].status === "offline") $(user).find(".offline").removeClass("hide");
                                $(user).find(".title").html(users[i].name);
                                $(user).find(".img-container .img").attr("src", users[i].artwork_url);
                                $(user).find(".invite-friend").attr("data-friend-id", users[i].id);
                                $(user).find(".invite-friend").attr("data-playlist-id", playlist_id);
                                $("#friends-can-collaborate").append(user);
                            }
                        }
                        $(".invite-friend").bind('click', function() {
                            var playlist_id = ($(this).data("playlist-id")),
                                friend_id = ($(this).data("friend-id"));
                            User.Playlist.collaborate.sendInvite(playlist_id, friend_id);
                            $(this).unbind('click').attr("disabled", "disabled");

                        });
                    }
                });
            },
            sendInvite: function(playlist_id, friend_id) {
                $.ajax({
                    url: route.route('frontend.auth.user.playlist.collaboration.invite'),
                    type: "post",
                    data: {
                        id: playlist_id,
                        friend_id: friend_id,
                        action: 'invite'
                    },
                    success: function (response) {
                        Toast.show("success", "Invite sent", "Congratulation!");
                    }
                });
            }
        },
        delete: function(playlist_id){
            if(!User.isLogged()){
                User.SignIn.show();
                return false;
            }
            var playlistData = window['playlist_data_' + playlist_id];
            bootbox.confirm({
                title: Language.text.POPUP_DELETE_PLAYLIST_TITLE,
                message: Language.text.POPUP_DELETE_PLAYLIST_MESSAGE.replace(':playlist', playlistData.title),
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        $.ajax({
                            url: route.route('frontend.auth.user.playlist.delete'),
                            type: "post",
                            data: {
                                playlist_id: playlistData.id
                            },
                            success: function (response) {
                                Toast.show("success", null, Language.text.POPUP_PLAYLIST_DELETE_TITLE.replace(':playlist', playlistData.title));
                                $(window).trigger({
                                    type: "engineSiteContentChange"
                                });
                                $(window).trigger({
                                    type: 'engineNeedHistoryChange',
                                    href: route.route('frontend.user.playlists', {'username': User.userInfo.username})
                                });
                                User.SignIn.me();
                            }
                        });
                    }
                }
            });
        },
        request: function (mediaId, mediaType, mediaItems) {
            User.Playlist.submit.unbind('click');
            User.Playlist.submit.addClass("disabled");
            var playlistName = $("#create-playlist #name").val();
            var playlistDesc = $("#create-playlist #description").val();
            if(!playlistName) return false;
            $.ajax({
                url: route.route('auth.user.create.playlist'),
                type: "post",
                data: {
                    playlistName: playlistName,
                    playlistDesc: playlistDesc
                },
                success: function (response) {
                    Toast.show("success", "You now can share it with your friend", "Your Playlist has been created created.");
                    $.engineLightBox.hide();
                    User.SignIn.me();
                    if(mediaId || mediaItems.length) User.Playlist.addItem(mediaId, mediaType, response.id, mediaItems);
                }
            });
        },
        addItem: function (mediaId, mediaType, playlist_id, mediaItems) {
            $.ajax({
                url: route.route('frontend.auth.user.playlist.add.item'),
                type: "post",
                data: {
                    mediaId: mediaId,
                    mediaType: mediaType,
                    mediaItems: mediaItems,
                    playlist_id: playlist_id,
                },
                success: function (response) {
                    if(mediaType === 'song') {
                        Toast.show("success", Language.text.POPUP_SONG_ADDED);
                    } else if(mediaType === 'queue') {
                        Toast.show("success", Language.text.POPUP_SONGS_ADDED.replace(':songCount', mediaItems.length));
                    } else {
                        Toast.show("success", Language.text.POPUP_SONGS_ADDED.replace(':songCount', response.length));
                    }
                    $(window).trigger({
                        type: "engineSiteContentChange"
                    });

                },
                error: function (e, textStatus, xhr, $form) {
                    var errors = e.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        Toast.show("error", value[0], null);
                    });
                }
            });
        },
        removeItem: function (song, playlist_id) {
            $.ajax({
                url: route.route('frontend.auth.user.playlist.remove.item'),
                type: "post",
                data: {
                    song_id: song.id,
                    playlist_id: playlist_id,
                },
                success: function () {
                    $('.module[data-type="song"][data-id="' + song.id + '"]').fadeOut();
                    Toast.show("playlist",null, Language.text.POPUP_SONG_REMOVED)
                }
            });
        }
    };

    $(document).ready(User.Playlist.onPlaylistArtworkChange);
    $(window).on("enginePageHasBeenLoaded", function () {
        User.Playlist.sort();
    });

    User.Subscription = {
        cancel: function () {
            bootbox.confirm({
                title: "Are you sure you want to cancel the subscription?",
                message: "<p>Your future subscription will be canceled. Your past subscriptions will not be refunded.</p><p><strong>Note</strong>: When you cancel a subscription you’ll still be able to use your subscription for the time you’ve already paid.</p>",
                centerVertical: true,
                callback: function (result) {
                    if(result) {
                        $.ajax({
                            url: route.route('frontend.auth.user.cancel.subscription'),
                            type: 'post',
                            dataType: 'json',
                            success: function(response) {
                                $(window).trigger({
                                    type: "engineReloadCurrentPage"
                                });
                                User.SignIn.me();
                            }
                        });
                    }
                }
            });
        }
    }

    window.UserSettingMenu = {
        init: function(){
            $('.sticky-menu-btn').on('click', $.engineSideBar.show);
            $('#header-user-menu, #static-header-user-menu').on('click', function () {
                $("#user-settings-menu").show();
                $('body').addClass('no-scroll');
            });
            $('#user-settings-menu .back-arrow').on('click', function () {
                $("#user-settings-menu").hide();
                $('body').removeClass('no-scroll');
            });
            $('#mobile-reg-btn').on('click', function () {
                $("#user-settings-menu").hide();
                User.SignIn.show();
                User.SignIn.init();
                return false;
            });
            $('#user-settings-menu a').on('click', function () {
                $("#user-settings-menu").hide();
                if($(this).hasClass('show-lightbox')) {
                    $.engineLightBox.show($(this).data('lightbox'))
                }
            });
            $('#mobile-user-sign-out').on('click', function () {
                __DEV__ && console.log('Signing out');
                User.SignOut();
            });
            this.stickyMenu();

        },
        stickyMenu: function () {
            $(window).scroll(function(){
                if ($(this).scrollTop() > 50) {
                    $('#sticky_header').addClass("fixed-nav");
                } else {
                    $('#sticky_header').removeClass("fixed-nav");
                }
            });
        }
    };
    $(window).on('engineNeedHistoryChange', function(){
        $('body').removeClass('no-scroll');
    });

    $( document ).ready(function() {
        User.SignIn.init();
        User.SignIn.me();
        $.engineSideBar.init();
        User.Playlist.sort();
        UserSettingMenu.init();
    });

    window.Favorite = {
        objectLink: function(title, url){
            return '<a href="' + url + '">' + title + '</a>';
        },
        set: function(el) {
            if(!User.isLogged ()) {
                User.SignIn.show();
                return false;
            }
            var object_type = el.data("type");
            var id  = el.data("id");
            var url = route.route('frontend.auth.user.favorite');
            var action = el.hasClass("on");
            $.ajax({
                url: url,
                type: "post",
                data:{
                    id: id,
                    object_type: object_type,
                    action:  action ? 0 : 1
                },
                success: function (response) {
                    if(response.success === true) {
                        if(object_type === 'song') {
                            Toast.show("favorite", null, action ?  Language.text.POPUP_SONG_REMOVED : Language.text.POPUP_SONG_ADDED)
                        } else if(object_type === 'collection') {
                            Toast.show("favorite", null, action ?  Language.text.POPUP_SONG_REMOVED : Language.text.POPUP_SONG_ADDED)
                        } else if(object_type === 'user') {
                            if(action){
                                $("#friend-id-" + id).fadeOut().remove();
                            }else {
                                Toast.show("follow", null, Language.text.POPUP_FOLLOWED_USER.replace(':userLink', Favorite.objectLink(el.data("title"), el.data("url"))));
                                User.SignIn.getFriends();
                            }
                        } else if(object_type === 'artist') {
                            ! action && Toast.show("follow", null, Language.text.POPUP_FOLLOWED_ARTIST.replace(':artistLink', Favorite.objectLink(el.data("title"), el.data("url"))));

                        } else if(object_type === 'playlist') {
                            ! action && Toast.show("follow", null, Language.text.POPUP_SUBSCRIBED_PLAYLIST.replace(':playlistLink', Favorite.objectLink(el.data("title"), el.data("url"))));
                            User.SignIn.me();
                        }
                        if(el.data('text-on') !== undefined && el.data('text-off') !== undefined) {
                            action ? el.find(".label").html(el.data('text-off')) :  el.find(".label").html(el.data('text-on'));
                        }
                        action ? el.removeClass("on") : el.addClass("on");
                        if(object_type === 'song') {
                            window['song_data_' + id].favorite = ! action;
                        }
                    }
                    $(window).trigger({
                        type: "engineSiteContentChange"
                    });
                }
            });
        },
        contextSet: function(object_id, object_type, action){
            if(!User.isLogged ()) {
                User.SignIn.show();
                return false;
            }
            $.ajax({
                url: route.route('frontend.auth.user.favorite'),
                type: "post",
                data:{
                    id: object_id,
                    object_type: object_type,
                    action:  action ? 0 : 1
                },
                success: function (response) {
                    Toast.show("favorite", null, action ?  Language.text.POPUP_SONG_REMOVED : Language.text.POPUP_SONG_ADDED);
                    window['song_data_' + object_id].favorite = ! action;
                    var el = $('.favorite[data-id="' + object_id + '"][data-type="'+object_type+'"]');
                    action ? el.removeClass("on") : el.addClass("on");
                }
            });
        },
        songs: function (data) {
            if(!User.isLogged ()) {
                User.SignIn.show();
                return false;
            }
            $.ajax({
                url: route.route('frontend.auth.user.song.favorite'),
                type: "post",
                data:{
                    ids: data.map(function(song){
                        return song.id;
                    }).join(","),
                },
                success: function (response) {
                    var num = data.length;
                    Toast.show("favorite", Language.text.POPUP_SONGS_ADDED.replace(':songCount', num));
                    for(var i=0; i < num; i++) {
                        window['song_data_' + data[i].id].favorite = true;
                        var el = $('.favorite[data-id="' + data[i].id + '"][data-type="song"]');
                        el.addClass("on");
                    }
                }
            });
        }
    }

    window.Library = {
        set: function() {
            var el = $(this);
            if(!User.isLogged ()) {
                User.SignIn.show();
                return false;
            }
            var object_type = el.data("type");
            var id  = el.data("id");
            $.ajax({
                url: route.route('frontend.auth.user.library'),
                type: "post",
                data:{
                    id: id,
                    object_type: object_type,
                    action:  el.data("init") ? 0 : 1
                },
                success: function () {
                    Toast.show("library", null, el.data("init") ?  Language.text.POPUP_SONG_REMOVED : Language.text.POPUP_SONG_ADDED)
                    el.data("init")  ? el.removeAttr('data-init') : el.attr('data-init', true);
                    window['song_data_' + id].library = ! el.data("init");
                    $(window).trigger({
                        type: "engineSiteContentChange"
                    });
                }
            });
        },
        contextSet: function(object_id, object_type, action){
            if(!User.isLogged ()) {
                User.SignIn.show();
                return false;
            }
            $.ajax({
                url: route.route('frontend.auth.user.library'),
                type: "post",
                data:{
                    id: object_id,
                    object_type: object_type,
                    action:  action ? 0 : 1
                },
                success: function (response) {
                    Toast.show("library", null, action ?  Language.text.POPUP_SONG_REMOVED : Language.text.POPUP_SONG_ADDED);
                    window['song_data_' + object_id].library = ! action;
                    var el = $('.library[data-id="' + object_id + '"][data-type="'+object_type+'"]');
                    action ? el.removeClass("on") : el.addClass("on");
                }
            });
        },
        songs: function (data) {
            if(!User.isLogged ()) {
                User.SignIn.show();
                return false;
            }
            $.ajax({
                url: route.route('frontend.auth.user.song.library'),
                type: "post",
                data:{
                    ids: data.map(function(song){
                        return song.id;
                    }).join(","),
                },
                success: function (response) {
                    var num = data.length;
                    Toast.show("library", Language.text.POPUP_SONGS_ADDED.replace(':songCount', num));
                    for(var i=0; i < num; i++) {
                        window['song_data_' + data[i].id].library = true;
                        var el = $('.library[data-id="' + data[i].id + '"][data-type="song"]');
                        el.addClass("on");
                    }
                }
            });
        }
    }
    $(document).on("click", "[data-toggle='collection']", Library.set);

    window.Notifications = {
        count: 0,
        loaded: false,
        init: function(){
            var btn = $("#notification-button");
            btn.on('click', Notifications.toggleShowHide);
            $('body').on('click', function (e) {
                var target = $(e.target);
                if(!target.is('#notification-button') && !target.is('#notification-button *') && !target.is('.header-notifications *')) {
                    Notifications.hide();
                }
                if(target.is('.header-notifications a')) {
                    Notifications.hide();
                }
            });
        },
        getCount: function(){
            if(User.isLogged()) {
                $.ajax({
                    url: route.route('frontend.auth.user.notification.count'),
                    type: "post",
                    success: function (response) {
                        Notifications.count = response.notification_count;
                        $('#header-notification-count, .header-notification-count').html(Notifications.count)
                        if(Notifications.count) {
                            $('#header-notification-pill').removeClass('hide');
                        } else {
                            $('#header-notification-pill').addClass('hide');
                        }
                    }
                });
            }
        },
        get: function(){
            $.ajax({
                url: route.route('frontend.auth.user.notifications'),
                type: "post",
                success: function (response) {
                    $('#notifications-container').html(response);
                    Notifications.loaded = true;
                }
            });
        },
        toggleShowHide: function () {
            var el = $(".header-notifications");
            var btn = $("#notification-button");
            if(el.hasClass("hide")){
                el.removeClass("hide");
                btn.addClass("active");
                var top = btn.offset().top + btn.height();
                var right = $(window).width() - btn.offset().left - btn.width();
                el.css({top: 48, right: right});
                if(!Notifications.loaded || Notifications.count) {
                    Notifications.get();
                }
            } else {
                el.addClass("hide");
                btn.removeClass("active");
            }
        },
        hide: function () {
            var el = $(".header-notifications");
            var btn = $("#notification-button");
            el.addClass("hide");
            btn.removeClass("active");
        }
    };

    window.SideBarFilter = {
        init: function () {
            $('body').delegate("#sidebar-filter", "keyup", function (e) {
                __DEV__ && console.log('SideBar Filter', $(this).val());
                SideBarFilter.show($(this).val())
                e.preventDefault();
            });
            $(document).on("click", "#hide-sidebar-filter", function () {
                $('#sidebar-filter').val('');
                SideBarFilter.show('');
                $('#sidebar-filter-container').toggleClass('hide');
            });
        },
        show: function (term) {
            var listItems = $("#sidebar-friends > div");
            listItems.each(function () {
                if ($(this).find('.headline').text().toLowerCase().includes(term.toLowerCase())) {
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

    $(document).ready(SideBarFilter.init);

    $(document).on('click', '[data-toggle="collaboration"]', function () {
        var action = $(this).data('action');
        var playlist_id = $(this).data('playlist-id');
        var notification_id = $(this).data('notification-id');
        $.ajax({
            url: action === 'accept' ? route.route('frontend.auth.user.playlist.collaboration.accept') : route.route('frontend.auth.user.playlist.collaboration.cancel'),
            data: {
                action: action,
                id: playlist_id
            },
            type: 'post',
            dataType: 'json',
            success: function(response) {
                $('a[data-notification-id="' + notification_id + '"]').fadeOut();
                User.SignIn.me();
            }
        });
    })
    $( document ).ready(function () {
        setInterval(Notifications.getCount, 60000);
    });

    $(document).on("click", "#toggle-sidebar", function () {
        $('body').toggleClass('sidebar-minimum')
    });
    $(document).on("click", "#sidebar-go-online", function () {
        $('#sidebar-offline-msg').addClass('hide');
    });
    $(document).on("click", "#filter-toggle", function () {
        $('#sidebar-filter-container').toggleClass('hide');
        $('.contact-sidebar').toggleClass('filter-on');
    });
    $(window).on("engineWindowSizeChange", Notifications.hide);
    $(window).on("engineHistoryChange", Notifications.hide);

    $(document).on('click', function (e) {
        var target = $(e.target);
        if(!target.is('#notification-button') && !target.is('#notification-button *') && !target.is('.header-notifications *')) {
            Notifications.hide();
        }
        if(target.is('.header-notifications a')) {
            Notifications.hide();
        }
    });
    $( document ).ready(Notifications.init);
    $(document).on('click', '[data-action="remove-service"]', function () {
        var service = $(this);
        bootbox.confirm({
            title: Language.text.POPUP_DELETE_SERVICE_AUTHORIZE_LABEL,
            message: Language.text.POPUP_DELETE_SERVICE_AUTHORIZE_DESC,
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
                        url: route.route('frontend.auth.login.socialite.remove', {service: service.attr('data-service')}),
                        data: {
                        },
                        type: 'post',
                        dataType: 'json',
                        success: function () {
                            $(window).trigger({
                                type: "engineReloadCurrentPage"
                            });
                            Toast.show("success", Language.text.POPUP_DELETED_SERVICE_AUTHORIZE);
                        },
                        error: function () {
                            Toast.show("error", Language.text.POPUP_DELETE_SERVICE_AUTHORIZE_DENIED);
                        }
                    });
                }
            }
        });
    });
});
