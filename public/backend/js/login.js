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
    window.Connect = {
        thirdParty: {
            redirect: function (service) {
                window.open(social_redirect.replace(':service', service), '_blank', 'height=450,width=750');
            },
            callback: function (data, service) {
                location.reload();
            }
        }
    };

    $(document).on('click', '[data-action="social-login"]', function () {
        var service = $(this).data('service');
        Connect.thirdParty.redirect(service)
    });
});