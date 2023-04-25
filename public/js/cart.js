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

    $.engineCart = {
        show: function () {
            $('.cart .dropdown-menu').addClass('slide-from-top');
        },
        hide: function () {
            $('.cart .dropdown-menu').removeClass('slide-from-top')
        },
        overview: function(){
            $.ajax({
                type: "post",
                url: route.route('frontend.cart.overview'),
                success: function (data) {
                    $.engineCart.build(data);
                }
            });
        },
        add: function () {
            if (!User.isLogged()) {
                User.SignIn.show();
                return false;
            }
            var orderable_type = $(this).data('orderable-type');
            var orderable_id = $(this).data('orderable-id');
            $.ajax({
                type: "post",
                url: route.route('frontend.cart.add'),
                data: {
                    orderable_type: orderable_type,
                    orderable_id: orderable_id,
                },
                success: function (data) {
                    $.engineCart.build(data);
                    Toast.show('success', 'Successfully added to the cart ...')
                }
            });
        },
        remove: function () {
            var id = $(this).data('id');
            $.ajax({
                type: "post",
                url: route.route('frontend.cart.remove'),
                data: {
                    id: id,
                },
                success: function (data) {
                    $.engineCart.build(data);
                    $(window).trigger({
                        type: "engineReloadCurrentPage"
                    });
                }
            });
        },
        build: function (data) {
            var num = data.items.length;
            var html = [];
            for (var i = 0; i < num; i++) {
                var template = tmpl('tmpl-cart-item', data.items[i]);
                html.push(template);
            }
            $('#cart-items').html(html);
            $('.cart__total').find('span').html(data.currency + ' ' + data.subtotal);
            var el = $(".header-cart-notification-pill")
            el.find('span').html(data.items.length);
            if(data.items.length) {
                el.removeClass('hide')
            } else {
                el.addClass('hide')
            }
        }
    };

    $(window).on('engineNeedHistoryChange', $.engineCart.hide);
    $(document).on("click", '[data-action="buy"]', $.engineCart.add);
    $(document).on("click", '[data-action="remove-from-cart"]', $.engineCart.remove);
    $(document).on("click", '[data-action="show-cart"]', $.engineCart.show);
    $(document).on("click", '[data-action="cart-close"]', $.engineCart.hide);
    $(window).on('engineUserLoggedIn', $.engineCart.overview);
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

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.enginStore = {
        loadFilter: function () {
            $('.filter-items-container').addClass('show-time');
            $('.store-item-list').addClass('show-time');
            $('[data-action="load-filter"]').removeClass('active');
            $(this).addClass('active');
            var type = $(this).attr('data-type');
            var action_url = '';
            if(type === 'genre') {
                action_url = route.route('frontend.store.filter.genres')
            } else if(type === 'mood') {
                action_url = route.route('frontend.store.filter.moods')
            } else if(type === 'artist') {
                action_url = route.route('frontend.store.filter.artists')
            } else {
                return false;
            }
            $.ajax({
                type: "get",
                url: action_url,
                cache: true,
                success: function (data) {
                    var num = data.length;
                    var html = [];
                    for (var i = 0; i < num; i++) {
                        data[i].type = type;
                        var template = tmpl('tmpl-filter-item', data[i]);
                        html.push(template);
                    }
                    $('.filter-items').html(html);
                }
            });
        },
        purchased: function () {
            $(window).trigger({
                type: 'engineNeedHistoryChange',
                href: route.route('frontend.user.purchased', {'username': User.userInfo.username})
            });
        },
        clearPill: function(){
            var query = {};
            query.term = $(this).data('term');
            query.value = $(this).data('value');
            if(query.term === 'genre') {
                const index = $.enginStore.browse.params.genres.indexOf(query.value);
                if (index > -1) {
                    $.enginStore.browse.params.genres.splice(index, 1);
                }
            } else if(query.term === 'mood') {

                const index = $.enginStore.browse.params.moods.indexOf(query.value);
                if (index > -1) {
                    $.enginStore.browse.params.moods.splice(index, 1);
                }
            } else if(query.term === 'artist') {
                const index = $.enginStore.browse.params.artists.indexOf(query.value);
                if (index > -1) {
                    $.enginStore.browse.params.artists.splice(index, 1);
                }
            } else if(query.term === 'term') {
                const index = $.enginStore.browse.params.terms.indexOf(query.value);
                if (index > -1) {
                    $.enginStore.browse.params.terms.splice(index, 1);
                }
            }
            $(this).removeAttr('data-init');
            $('.filter-masks').find('[data-term="' + query.term + '"][data-value="' + query.value + '"]').remove();
            $('[data-action="filter-query"][data-term="' + query.term + '"][data-value="' + query.value + '"]').removeAttr('data-init');
            $.enginStore.browse.build();
        },
        totalFilter: function(){
            return $.enginStore.browse.params.genres.length + $.enginStore.browse.params.moods.length + $.enginStore.browse.params.artists.length + $.enginStore.browse.params.terms.length;
        },
        clearAll: function(){
            $.enginStore.browse.params = {
                genres: [],
                moods: [],
                artists: [],
                terms: []
            };
            $('.eb8kde96').remove();
            $('[data-action="filter-query"]').removeAttr('data-init')
            $.enginStore.browse.build();
        },
        input: function(e){
            if(e.keyCode === 13) {
                if(! $(this).val() ) {
                    return false;
                }
                var query = {};
                query.term = 'term';
                query.value = $(this).val();
                query.mask = $(this).val();

                if(!$.enginStore.browse.params.terms.includes(query.value)) {
                    $.enginStore.browse.params.terms.push(query.value);
                } else {
                    const index = $.enginStore.browse.params.terms.indexOf(query.value);
                    if (index > -1) {
                        $.enginStore.browse.params.terms.splice(index, 1);
                    }
                }
                var mask_template = tmpl('tmpl-mask-item', query);
                $('.filter-masks').prepend(mask_template);
                $(this).attr('data-init', true);
                $.enginStore.browse.build();
                $(this).val('');



            }
        },
        browse: {
            params: {
                genres: [],
                moods: [],
                artists: [],
                terms: []
            },
            query: function () {
                var query = {};
                query.term = $(this).data('term');
                query.value = $(this).data('value');
                query.mask = $(this).data('mask');
                if(query.term === 'genre') {
                    if(!$.enginStore.browse.params.genres.includes(query.value)) {
                        $.enginStore.browse.params.genres.push(query.value);
                    } else {
                        const index = $.enginStore.browse.params.genres.indexOf(query.value);
                        if (index > -1) {
                            $.enginStore.browse.params.genres.splice(index, 1);
                        }
                    }
                } else if(query.term === 'mood') {
                    if(!$.enginStore.browse.params.moods.includes(query.value)) {
                        $.enginStore.browse.params.moods.push(query.value);
                    } else {
                        const index = $.enginStore.browse.params.moods.indexOf(query.value);
                        if (index > -1) {
                            $.enginStore.browse.params.moods.splice(index, 1);
                        }
                    }
                } else if(query.term === 'artist') {
                    if(!$.enginStore.browse.params.artists.includes(query.value)) {
                        $.enginStore.browse.params.artists.push(query.value);
                    } else {
                        const index = $.enginStore.browse.params.artists.indexOf(query.value);
                        if (index > -1) {
                            $.enginStore.browse.params.artists.splice(index, 1);
                        }
                    }
                }
                if($(this).attr('data-init')) {
                    $(this).removeAttr('data-init');
                    $('.filter-masks').find('[data-term="' + query.term + '"][data-value="' + query.value + '"]').remove();
                } else {
                    var mask_template = tmpl('tmpl-mask-item', query);
                    $('.filter-masks').prepend(mask_template);
                    $(this).attr('data-init', true);
                }
                $.enginStore.browse.build();
            },
            build: function () {
                var query = decodeURIComponent($.param($.enginStore.browse.params));
                __DEV__ && console.log(query);
                var url = window.location.href.split("?")[0] + '?' + query;
                if (/^(?:[a-z]+:)?\/\//i.test(url)) {
                    url = new URL(url);
                    if (!url.search && window.location.pathname === url.pathname) {
                    }
                    if (!url.search) {
                        url = url.pathname.substr(1);
                    } else {
                        url = url.pathname.substr(1) + url.search;
                    }
                }

                if(query) {
                    window.history.pushState({
                        href: url
                    }, url, window.location.href.split("?")[0] + '?' + query);
                } else {
                    window.history.pushState({
                        href: url
                    }, url, window.location.href.split("?")[0]);
                }

                var gridEL = $('.store-item-list');
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

                if($.enginStore.totalFilter()) {
                    $('[data-action="clear-filter"]').removeClass('hide');
                } else {
                    $('[data-action="clear-filter"]').addClass('hide');
                }

                $('.total-filter').html($.enginStore.totalFilter());

            }

        }
    };


    $(document).on("click", '[data-action="load-filter"]', $.enginStore.loadFilter);
    $(document).on("click", '[data-action="filter-query"]', $.enginStore.browse.query);
    $(document).on("click", '[data-action="clear-filter-fill"]', $.enginStore.clearPill);
    $(document).on("click", '[data-action="clear-filter"]', $.enginStore.clearAll);
    $(document).on("click", '[data-action="purchased-download"]', $.enginStore.purchased);

    $(document).on("keydown", '#header-filter-search-input', $.enginStore.input);

    $(document).on("click", '[data-action="show-filter"]', function () {
        $('.store-container').toggleClass('active-filter');
    });

    $(document).on("click", '[data-action="apply-filter"]', function () {
        $('.store-container').toggleClass('active-filter');
    });
});