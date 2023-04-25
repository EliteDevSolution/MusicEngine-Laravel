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

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.engineComments = {
        commentTemplate: null,
        replyTemplate: null,
        isOnlyEmoji: function (str) {
            var emoji_regex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;
            if (emoji_regex.test(str)) {
                return "<span class='emoji-only'>" + str + "</span>"
            } else {
                return $.engineComments.emojiReplace(str);
            }
        },
        emojiReplace: function (str) {
            return str.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g, "<span class='emoji'>\$&</span>")
        },
        showCommentContainer: function () {
            var target = $($(this).data('target'));
            var type = target.data('commentable-type');
            var id = target.data('commentable-id');
            target.toggleClass('hide');
            if (target.is(':empty')) {
                $.ajax({
                    type: "post",
                    url: route.route('frontend.comments.show'),
                    data: {
                        commentable_type: type,
                        commentable_id: id,
                    },
                    success: function (response) {
                        target.html(response);
                        $.engineComments.load(target.find('[data-comment-init="true"]'));
                    }
                });
            }
        },
        load: function (el) {
            __DEV__ && console.log(el);
            var type = el.data('commentable-type');
            var id = el.data('commentable-id');
            $.ajax({
                type: "post",
                url: route.route('frontend.comments.get'),
                data: {
                    commentable_type: type,
                    commentable_id: id,
                },
                success: function (response) {
                    var mel = el.prev('.more-comments');
                    mel.attr('data-next-page-url', response.next_page_url);
                    mel.attr('data-last-page-url', response.last_page_url);
                    mel.attr('data-per-page', response.per_page);
                    mel.attr('data-last-page', response.last_page);
                    mel.attr('data-current-page', response.current_page);
                    mel.attr('data-total', response.total);
                    mel.attr('data-type', type);
                    mel.attr('data-id', id);
                    mel.attr('data-target-commentable-type', el.attr('data-commentable-type'));
                    mel.attr('data-target-commentable-id', el.attr('data-commentable-id'));
                    el.append($.engineComments.renderComment(response.data));
                    if (response.next_page_url) {
                        mel.removeClass('hide');
                    }
                }
            });
        },
        moreComment: function () {
            var e = $(this);
            var next_page_url = e.attr('data-next-page-url');
            if (next_page_url) {
                $.ajax({
                    type: "post",
                    url: next_page_url,
                    data: {
                        commentable_type: e.data('type'),
                        commentable_id: e.data('id'),
                    },
                    beforeSend: function () {
                        e.addClass('loading');
                    },
                    success: function (response) {
                        e.attr('data-next-page-url', response.next_page_url);
                        e.attr('data-last-page', response.last_page);
                        e.attr('data-current-page', response.current_page);
                        if (!response.next_page_url) {
                            e.addClass('hide');
                        }
                        e.removeClass('loading');
                        var container = $("[data-comment-init='true'][data-commentable-id='" + e.attr('data-target-commentable-id') + "'][data-commentable-type='" + $.escapeSelector(e.attr('data-target-commentable-type')) + "']");
                        container.prepend($.engineComments.renderComment(response.data));
                    }
                });
            }
        },
        moreReplies: function () {
            var e = $(this);
            var next_page_url = e.attr('data-next-page-url');
            var except = e.attr('data-except');
            if (next_page_url) {
                $.ajax({
                    type: "post",
                    url: next_page_url,
                    data: {
                        parent_id: e.data('id'),
                        except: except,
                    },
                    beforeSend: function () {
                        e.addClass('loading');
                    },
                    success: function (response) {
                        e.attr('data-next-page-url', response.next_page_url);
                        e.attr('data-last-page', response.last_page);
                        e.attr('data-current-page', response.current_page);
                        if (!response.next_page_url) {
                            e.addClass('hide');
                        }
                        e.removeClass('loading');
                        $(".comment-responses[data-comment-id='" + e.data('id') + "']").append($.engineComments.renderReplies(response.data));
                        e.find('.view-more-text').html(Language.text.VIEW_MORE_REPLY.replace(':count', response.total - $(".comment-responses[data-comment-id='" + e.data('id') + "'] .response-row").length));
                    }
                });
            }
        },
        renderComment: function (data) {
            var num = data.length;
            var html = [];
            for (var i = 0; i < num; i++) {
                var template = tmpl('tmpl-comment', data[i]);
                html.push(template);
            }
            return html;
        },
        renderReplies: function (data) {
            var num = data.length;
            var html = [];
            for (var i = 0; i < num; i++) {
                var template = tmpl('tmpl-comment-reply', data[i]);
                html.push(template);
            }
            return html;
        },
        emoji: {
            ready: false,
            toggle: function () {
                var el = $(this);
                if (!$.engineComments.emoji.ready) {
                    $.get(route.route('frontend.comments.get.emoji.template'), function (data) {
                        $('body').append(data);
                        $.engineComments.emoji.ready = true;
                        $.engineComments.emoji.showOrHide(el);
                        if ($('#embed-chat-emoji-scroll').length) {
                            new SimpleBar($('#embed-chat-emoji-scroll')[0]);
                        }
                    });
                } else {
                    $.engineComments.emoji.showOrHide(el);
                }
            },
            showOrHide: function (handle) {
                __DEV__ && console.log(handle);
                var el = $(".intercom-emoji-picker");
                if (el.hasClass("hide")) {
                    el.find(".intercom-emoji-picker-emoji").unbind('click');
                    el.removeClass("hide");
                    if (handle.offset().top < (el.height() + 50)) {
                        var top = handle.offset().top + handle.height() + 10;
                    } else {
                        var top = handle.offset().top - el.height() - 10;
                    }
                    var left = handle.offset().left - el.width() + handle.width();
                    el.css({top: top, left: left}).removeClass("hide");
                    el.find(".intercom-emoji-picker-emoji").bind('click', function () {
                        var emoji = $(this).html();
                        handle.parent().find(".comment-feed-msg").html(function (index, val) {
                            return val + emoji;
                        }).focus();
                        $.engineComments.placeCaretAtEnd(handle.parent().find(".comment-feed-msg"));
                    });
                } else {
                    el.addClass("hide");
                }
            }
        },
        hideEmojiPicker: function () {
            $(".emoji-tooltip").addClass("hide");
        },
        add: function (response, $form) {
            __DEV__ && console.log('comment.add.post', response);
            if (response.moderation) {
                Toast.show('moderation', response.message)
            } else {
                var comment = $.engineComments.renderComment([response]);
                comment = $.parseHTML(comment[0]);
                console.log($(comment));
                $(comment).addClass("highlight");
                $("[data-comment-init='true'][data-commentable-id='" + response.commentable_id + "'][data-commentable-type='" + $.escapeSelector(response.commentable_type) + "']").prepend(comment);
                setTimeout(function () {
                    $(comment).removeClass("highlight");
                }, 2000);
            }
            $form.find('.comment-feed-msg').html('').trigger("blur");
            $(".emoji-tooltip").addClass("hide");
        },
        reply: function () {
            if (!User.isLogged()) {
                User.SignIn.show();
                return false;
            }
            var el = $(this);
            var id = el.data("comment-id");
            var count = el.data("comment-count");
            var root = el.parents('.module-comment');
            root.find('.module-item-respond').removeClass('hide');
            var input = root.find('.comment-feed-msg');
            root.find('.module-item-respond').find('.response-author-image').attr("src", User.userInfo.artwork_url);
            if (el.attr('data-author-id')) {
                input.html('<span class="atwho-inserted" contenteditable="false"><tag data-id="' + el.attr('data-author-id') + '" data-username="' + el.attr('data-author-username') + '">' + el.attr('data-author-name') + '</tag></span>&nbsp;');
                input.focus();
                $.engineComments.placeCaretAtEnd(input);
            } else {
                input.focus();
            }
        },
        input: function () {
            if (!$(this).attr('data-initial')) {
                $(this).attr('data-initial', 'true')
                $.engineComments.form($(this).parent('form'));
            } else {
                return false;
            }
            $(this).atwho({
                at: "@",
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
            }).on("shown.atwho", function (event, $li, browser_event) {

                $(this).parent('form').find("[type='submit']").attr("disabled", "disabled");

            }).on("hidden.atwho", function (event, $li, browser_event) {
                var form = $(this).parent('form');
                setTimeout(function () {
                    form.find("[type='submit']").removeAttr("disabled");
                }, 500);
            }).on("inserted.atwho", function (event, $li, browser_event) {
                var form = $(this).parent('form');
                setTimeout(function () {
                    form.find("[type='submit']").removeAttr("disabled");
                }, 500);
            });
            $(this).on('paste', function (e) {
                e.preventDefault();
                const text = (e.originalEvent || e).clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text.replace(/^\s+|\s+$/g, ''));
            });
            $(this).on('keydown', function (e) {
                if (e.ctrlKey && e.keyCode === 13) {
                    document.execCommand('insertLineBreak');
                } else if (e.keyCode === 13) {
                    e.preventDefault();
                    if ($(this).html() !== '') {
                        $(this).parent('form').submit();
                    }
                }
            });
        },
        placeCaretAtEnd: function (el) {
            var input = el.get(0);
            if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(input);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(input);
                textRange.collapse(false);
                textRange.select();
            }
        },
        form: function (el) {
            el.ajaxForm({
                beforeSubmit: function (data, $form, options) {
                    data.push({name: 'content', value: el.find('.comment-feed-msg').html()})
                    if ($form.find('[type="submit"]').prop('disabled')) {
                        return false;
                    }
                    if (!User.isLogged()) {
                        $.engineLightBox.show("lightbox-login");
                        return false;
                    }
                },
                success: function (response, textStatus, xhr, $form) {
                    if ($form.hasClass('comment-edit-form')) {
                        var el = $form.parent();
                        if (response.parent_id !== null && response.parent_id) {
                            el.find('.response-content').removeClass('hide');
                            el.find('.comment-footer').removeClass('hide');
                            el.find('.response-message').html($.engineComments.isOnlyEmoji(response.content));
                            $form.remove();
                        } else {
                            el.find('.comment-details').removeClass('hide');
                            el.find('.comment-footer').removeClass('hide');
                            el.find('.comment-message').html($.engineComments.isOnlyEmoji(response.content));
                            $form.remove();
                        }

                    } else {
                        if (response.parent_id !== null && response.parent_id) {
                            $(".comment-responses[data-comment-id='" + response.parent_id + "']").append($.engineComments.renderReplies([response]));
                            $form.find('.comment-feed-msg').html('').trigger("blur");
                            $(".emoji-tooltip").addClass("hide");
                        } else {
                            $.engineComments.add(response, $form);
                        }
                    }
                },
                error: function (e, textStatus, xhr, $form) {
                    if (e.status === 429) {
                        Toast.show('error', Language.text.POPUP_COMMENT_DISABLED, null);
                    } else {
                        $form.find(".control").removeClass("field-error");
                        var errors = e.responseJSON.errors;
                        $.each(errors, function (key, value) {
                            Toast.show("error", value[0], null);
                        });
                        $form.find('.error').removeClass('hide').html(e.responseJSON.errors[Object.keys(e.responseJSON.errors)[0]][0]);
                        $form.find("[name='" + Object.keys(e.responseJSON.errors)[0] + "']").closest(".control").addClass("field-error");
                    }
                    $form.find("[type='submit']").removeAttr("disabled");
                }
            });
        },
        editReply: function ($trigger, reply) {
            $.post(route.route('frontend.comments.edit.comment'), {id: $trigger.data('id')}, function (data) {
                reply.find('.response-content').addClass('hide');
                reply.find('.comment-footer').addClass('hide');
                reply.append(data);
                reply.find('.comment-feed-msg').focus();
                $.engineComments.placeCaretAtEnd(reply.find('.comment-feed-msg'));
            });
        },
        editComment: function ($trigger, comment) {
            $.post(route.route('frontend.comments.edit.comment'), {id: $trigger.data('id')}, function (data) {
                comment.find('.comment-details').addClass('hide');
                comment.find('.comment-footer:first').addClass('hide');
                $(data).insertBefore(comment.find('.comment-response-container'));
                comment.find('.comment-feed-msg').focus();
                $.engineComments.placeCaretAtEnd(comment.find('.comment-feed-msg'));
            });
        },
        options: function () {
            $('.comment-popover-options').not($(this).find('.comment-popover-options')).addClass('hide');
            $(this).find('.comment-popover-options').toggleClass('hide');
        },
        delete: function ($trigger) {
            bootbox.confirm({
                title: "Delete Comment",
                message: "Are you sure you want to delete this comment?",
                centerVertical: true,
                callback: function (result) {
                    if (result) {
                        $.ajax({
                            url: route.route('frontend.comments.delete.comment'),
                            data: {
                                'id': $trigger.data('id')
                            },
                            type: 'post',
                            dataType: 'json',
                            success: function (response) {
                                $('.module-comment[data-id=' + $trigger.data('id') + ']').remove();
                            }
                        });
                    }
                }
            });
        },
        report: function ($trigger) {
            if (!User.isLogged()) {
                $.engineLightBox.show("lightbox-login");
                return false;
            }
            bootbox.prompt({
                title: "Find support or report comment",
                message: '<p>You can report the comment after selecting a problem.</p>',
                centerVertical: true,
                inputType: 'radio',
                inputOptions: [
                    {
                        text: 'Nudity',
                        value: 'Nudity',
                    },
                    {
                        text: 'Violence',
                        value: 'Violence',
                    },
                    {
                        text: 'Harassment',
                        value: 'Harassment',
                    },
                    {
                        text: 'Suicide or Self-Injury',
                        value: 'Suicide or Self-Injury',
                    },
                    {
                        text: 'Spam',
                        value: 'Spam',
                    },
                    {
                        text: 'Hate Speech',
                        value: 'Hate Speech',
                    },
                    {
                        text: 'Terrorism',
                        value: 'Terrorism',
                    },
                    {
                        text: 'Sexual Exploitation',
                        value: 'Sexual Exploitation',
                    },
                    {
                        text: 'Promoting Drug Use',
                        value: 'Promoting Drug Use',
                    }
                ],
                callback: function (result) {
                    console.log(result);
                }
            });
        }
    };

    $(window).on("enginePageHasBeenLoaded", function () {
        $('[data-comment-init="true"]').each(function (index, el) {
            $.engineComments.load($(el));
        });
    });

    $(document).on("click", ".more-comments", $.engineComments.moreComment);
    $(document).on("click", ".comment-response-more", $.engineComments.moreReplies);
    $(document).on("focus", ".comment-feed-msg", $.engineComments.input);
    $(document).on("click", ".insert-emoji", $.engineComments.emoji.toggle);
    $(document).on("click", ".comment-reply-link", $.engineComments.reply);
    $(document).on("click", ".comment-popover-option-edit-comment", $.engineComments.editComment);
    $(document).on("click", ".comment-popover-option-edit-reply", $.engineComments.editReply);
    $(document).on("click", ".comment-popover-option-report", $.engineComments.report);
    $(document).on("click", "[data-toggle='comments']", $.engineComments.showCommentContainer);
    $(window).on("enginePageHasBeenLoaded", function () {
        if ($('[data-action="trigger"][data-target="comments"]').length) {
            $('[data-toggle="comments"]').trigger('click');
        }
    });
    $(document).ready(function () {
        $.get(route.route('frontend.comments.get.comment.template'), function (data) {
            $('body').append(data);
        });

        $.get(route.route('frontend.comments.get.reply.template'), function (data) {
            $('body').append(data);
        });
    });

    $(document).on("input", ".intercom-composer-popover-input", function (e) {
        var query = this.value;
        if (query !== "") {
            $(".intercom-emoji-picker-emoji:not([title*='" + query + "'])").hide();
        } else {
            $(".intercom-emoji-picker-emoji").show();
        }
    });
    $('.intercom-composer-popover-input').on('input', function () {

    });

    $('body').bind('click', function (e) {
        var target = $(e.target);
        if (!target.is('.intercom-emoji-picker') && !target.is('.intercom-emoji-picker *')) {
            $('.intercom-emoji-picker').addClass('hide');
        }
    });

    //Add event to hide the emoji box when window url is changed
    $(window).on("engineHistoryChange", $.engineComments.hideEmojiPicker);
    $(window).on("engineWindowSizeChange", $.engineComments.hideEmojiPicker);
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

    $.engineReaction = {
        react: function () {
            if (!User.isLogged()) {
                User.SignIn.show();
                return false;
            }
            var reactBox = $(this).parent();
            reactBox.addClass('hide');
            var reaction_type = $(this).attr('data-reaction-type'),
                reaction_able_id = $(this).attr('data-reaction-able-id'),
                reaction_able_type = $(this).attr('data-reaction-able-type');
            $.ajax({
                type: "post",
                url: route.route('frontend.reaction.react'),
                data: {
                    reaction_type: reaction_type,
                    reaction_able_id: reaction_able_id,
                    reaction_able_type: reaction_able_type
                },
                success: function (response) {
                    $.engineReaction.responseReact(reaction_type, reaction_able_type, reaction_able_id);
                    reactBox.removeClass('hide');
                }
            });
        },
        like: function () {
            if (!User.isLogged()) {
                User.SignIn.show();
                return false;
            }
            var reactBox = $(this).parent().find('.reactions-box');
            reactBox.addClass('hide');
            var root = $(this).parent();
            var reaction_type = root.attr('data-reaction-type'),
                reaction_able_id = root.attr('data-reaction-able-id'),
                reaction_able_type = root.attr('data-reaction-able-type');
            if (!root.attr('data-reacted')) {
                $.ajax({
                    type: "post",
                    url: route.route('frontend.reaction.react'),
                    data: {
                        reaction_type: reaction_type,
                        reaction_able_id: reaction_able_id,
                        reaction_able_type: reaction_able_type
                    },
                    success: function (response) {
                        $.engineReaction.responseReact(reaction_type, reaction_able_type, reaction_able_id);
                        setTimeout(function () {
                            reactBox.removeClass('hide');
                        }, 3000);
                    }
                });
            } else {
                $.ajax({
                    type: "post",
                    url: route.route('frontend.reaction.react.revoke'),
                    data: {
                        reaction_type: reaction_type,
                        reaction_able_id: reaction_able_id,
                        reaction_able_type: reaction_able_type
                    },
                    success: function (response) {
                        $.engineReaction.responseRevoke(reaction_type, reaction_able_type, reaction_able_id);
                        setTimeout(function () {
                            reactBox.removeClass('hide');
                        }, 3000);
                    }
                });
            }

        },
        responseReact: function (reaction_type, reaction_able_type, reaction_able_id) {
            var root = $('.label-reactions[data-reaction-able-id="' + reaction_able_id + '"]')
            var prevReact = root.attr('data-reaction-type');
            var reactEl = $(".comment-reactions[data-id='" + reaction_able_id + "']");
            if (reactEl.find('.comment-reactions-emoji')
                .find('img[data-type="' + reaction_type + '"]').length) {
                if (root.attr('data-reacted') && prevReact === reaction_type) {
                    return false;
                } else {
                    var prevReactImg = reactEl.find('.comment-reactions-emoji').find('img[data-type="' + prevReact + '"]');
                    if (parseInt(prevReactImg.attr('data-count')) === 1) {
                        prevReactImg.remove();
                    } else {
                        prevReactImg.attr('data-count', parseInt(prevReactImg.attr('data-count')) - 1);
                    }
                    var nextReactImg = reactEl.find('.comment-reactions-emoji').find('img[data-type="' + reaction_type + '"]');
                    nextReactImg.attr('data-count', parseInt(nextReactImg.attr('data-count')) + 1);
                }
            } else {
                reactEl.find('.comment-reactions-emoji')
                    .prepend($('<img>', {
                        'data-type': reaction_type,
                        'data-count': 1,
                        src: route.route('frontend.homepage') + 'common/reactions/' + reaction_type + '.svg'
                    }));
                if (prevReact && root.attr('data-reacted')) {
                    var prevReactImg = reactEl.find('.comment-reactions-emoji').find('img[data-type="' + prevReact + '"]');
                    if (parseInt(prevReactImg.attr('data-count')) === 1) {
                        prevReactImg.remove();
                    } else {
                        prevReactImg.attr('data-count', parseInt(prevReactImg.attr('data-count')) - 1);
                    }
                }
            }
            if (!root.attr('data-reacted')) {
                reactEl.find('.comment-reactions-count').html(parseInt(reactEl.find('.comment-reactions-count').html()) + 1);
            }
            root.attr('data-reaction-type', reaction_type)
                .attr('data-reacted', true);
            root.find('.react-text-label').html(reaction_type);
            reactEl.removeClass('hide');
        },
        responseRevoke: function (reaction_type, reaction_able_type, reaction_able_id) {
            var reactEl = $(".comment-reactions[data-id='" + reaction_able_id + "']");
            var prevReactImg = reactEl.find('.comment-reactions-emoji').find('img[data-type="' + reaction_type + '"]');
            if (parseInt(prevReactImg.attr('data-count')) === 1) {
                prevReactImg.remove();
            }
            reactEl.find('.comment-reactions-count').html(parseInt(reactEl.find('.comment-reactions-count').html()) - 1);
            if (parseInt(reactEl.find('.comment-reactions-count').html()) === 0) {
                reactEl.addClass('hide');
            }
            var root = $('.label-reactions[data-reaction-able-id="' + reaction_able_id + '"]')
            root.attr('data-reaction-type', 'like')
                .removeAttr('data-reacted');
            root.find('.react-text-label').html('like');
        }
    };
    $(document).on("click", "[class*=\"reaction-\"]", $.engineReaction.react);
    $(document).on("click", ".comment-like-link .react-text-label, .reply-like-link .react-text-label", $.engineReaction.like);
});