const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

/*
mix.js('resources/js/app.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css');
*/

mix.scripts([
    'public/js/core.js',
    'public/js/utils.js',
    'public/js/history.js',
    'public/js/route.js',
    'public/js/common.js',
    'public/js/account.js',
    'public/js/comment.js',
    'public/js/share.js',
    'public/js/nowplaying.js',
    'public/js/contextmenu.js',
    'public/js/player.js',
    'public/js/artist.js',
    'public/js/payment.js',
    'public/js/artistCore.js',
    'public/js/uploadApp.js',
    'public/js/cart.js',
    'public/skins/default/js/custom.js',
], 'public/js/engine.min.js');

mix.scripts([
    'public/embed/embed.js'
], 'public/embed/embed.min.js');