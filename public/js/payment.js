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

    window.Payment = {
        isSubmitting: false,
        isStripeLoaded: false,
        isShown: false,
        tab: function () {
            var creditTab = $('.lightbox-payments .lightbox-tab[rel="creditcard"]');
            var paypalTab = $('.lightbox-payments .lightbox-tab[rel="paypal"]');
            var el = $('.lightbox-payments');
            creditTab.on('click', function () {
                $(this).addClass('active');
                paypalTab.removeClass('active');
                $('#credit-card-container').removeClass('hide');
                $('#paypal-container').addClass('hide');
                el.find('.right').removeClass('hide');
            })
            paypalTab.on('click', function () {
                $(this).addClass('active');
                creditTab.removeClass('active');
                $('#credit-card-container').addClass('hide');
                $('#paypal-container').removeClass('hide');
                el.find('.error').addClass('hide');
                el.find('.right').addClass('hide');
            })
        },
        init: function (el) {
            var container = $('#confirm-container');
            var lb = $('.lightbox-payments');
            lb.find('.plan-id').val(el.data('plan-id'));
            if (el.data('trial')) {
                lb.find('.lightbox-trial span').html(el.data('trial-end-at'))
                lb.find('.lightbox-trial').removeClass('hide');
            } else {
                lb.find('.lightbox-trial').addClass('hide');
            }
            if(el.attr('data-should-hide-description')) {
                container.addClass('hide');
                $('#stripe-form').attr('action', route.route('frontend.stripe.purchase.callback'));
                lb.find('.paypal-open').attr('href', route.route('frontend.paypal.purchase'));
                $('.btn-payment').each(function () {
                    $(this).unbind('click');
                    $(this).bind('click', function () {
                        window.open(route.route($(this).attr('data-purchase-uri')));
                    });
                });
            } else {
                container.find('.product .description').text(el.data('description'));
                container.find('.product .price').text(el.data('price'));
                container.find('.total .price').text(el.data('price'));
                container.removeClass('hide');
                $('#stripe-form').attr('action', route.route('frontend.stripe.subscription.callback'));
                lb.find('.paypal-open').attr('href', route.route('frontend.paypal.subscription', {'id': el.data('plan-id')}));
                $('.btn-payment').each(function () {
                    $(this).unbind('click');
                    $(this).bind('click', function () {
                        window.open(route.route($(this).attr('data-subscription-uri'), {'id': el.data('plan-id')}));
                    });
                });
            }
            $.engineLightBox.show("lightbox-payments");

            if(!Payment.isShown) {
                $('.lightbox-payments').find('.nav-item').first().find('.nav-link').addClass('active');
                $('.lightbox-payments').find('.tab-content .tab-pane:first-child').addClass('show').addClass('active');
                Payment.isShown = true;
            }

            if($('#card-element').length) {
                Payment.Stripe.init();
            }
        },
        Stripe: {
            init: function () {
                Payment.isSubmitting = false;
                $("#stripe-form-submit-button").removeClass('btn-loading').removeAttr('disabled');
                if (Payment.isStripeLoaded) {
                    return false;
                }
                $("#stripe-form-submit-button").on('click', function () {
                    $("#stripe-get-token-submit").trigger('click');
                });
                var stripe = Stripe(payment_stripe_publishable_key);
                var elements = stripe.elements();
                var style = {
                    base: {
                        color: '#32325d',
                        lineHeight: '18px',
                        fontSmoothing: 'antialiased',
                        fontSize: '16px',
                        '::placeholder': {
                            color: '#aab7c4'
                        }
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a'
                    }
                };
                var card = elements.create('card', {style: style});
                card.mount('#card-element');
                card.addEventListener('change', function (event) {
                    var displayError = document.getElementById('card-errors');
                    if (event.error) {
                        $(".lightbox-payments .error").html(event.error.message).removeClass("hide");
                    } else {
                        $(".lightbox-payments .error").addClass("hide");
                    }
                });
                var form = document.getElementById('payment-form');
                form.addEventListener('submit', function (event) {
                    event.preventDefault();
                    if (Payment.isSubmitting) {
                        return false;
                    }
                    stripe.createToken(card).then(function (result) {
                        __DEV__ && console.log(result);
                        if (result.error) {
                            // Inform the user if there was an error.
                            var errorElement = document.getElementById('card-errors');
                            $(".lightbox-payments .error").html(result.error.message).removeClass("hide");
                        } else {
                            // Send the token to your server.
                            stripeTokenHandler(result.token);
                            Payment.isSubmitting = true;
                            $("#stripe-form-submit-button").addClass('btn-loading').attr('disabled', 'disabled');
                        }
                    });
                });

                function stripeTokenHandler(token) {
                    var form = $('#stripe-form')
                    form.find('.stripeToken').val(token.id);
                    form.submit();
                }

                Payment.isStripeLoaded = true;
            }
        },
        Paypal: {
            failed: function () {
                $(".lightbox-payments .error").html("Payment failed. Can't process payment thought paypal.").removeClass("hide");
            },
            success: function () {

            }
        },
        cancel: function () {
            $(".lightbox-payments .error").html("Payment failed. Can't process payment thought paypal.").removeClass("hide");
        },
        subscriptionSuccess: function () {
            $.engineLightBox.hide();
            $(window).trigger({
                type: "engineReloadCurrentPage"
            });
            User.SignIn.me();
        },
        purchaseSuccess: function () {
            Toast.show('success', Language.text.PAYMENT_SUCCESS_TIP, Language.text.PAYMENT_SUCCESS);
            $.engineLightBox.hide();
            $.engineCart.overview();
            $.engineUtils.cleanStorage();
            $(window).trigger({
                type: "engineReloadCurrentPage"
            });
            setTimeout(function () {
                $(window).trigger({
                    type: 'engineNeedHistoryChange',
                    href: route.route('frontend.user.purchased', {'username': User.userInfo.username})
                });
            }, 5000);
        }
    };
    $(document).ready(Payment.tab);
});