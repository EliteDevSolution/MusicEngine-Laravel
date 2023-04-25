<?php
/**
 * Created by NiNaCoder.
 * Date: 2019-05-25
 * Time: 16:14
 */

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use View;
use Config;
use File;
use Artisan;
use Cache;
use Image;

class AppearanceController
{
    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function index()
    {
        if( ! $handle = opendir(resource_path('views/frontend')) ) {
            die( "Cannot open folder views/frontend in resources folder." );
        }

        $skins = array();

        while ( false !== ($file = readdir( $handle )) ) {
            if( is_dir( resource_path('views/frontend/' . $file)) and ($file != "." and $file != "..") ) {
                $skins[$file] = $file;
            }
        }

        return view('backend.appearance.index')
            ->with('skins', $skins);

    }

    public function save(Request $request)
    {
        $this->request->validate([
            'favicon' => 'nullable|image|mimes:jpeg,png,jpg,gif|dimensions:min_width=64,min_height=64',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|dimensions:min_width=256,min_height=256',
        ]);

        if ($this->request->hasFile('favicon')) {
            $favicon = Image::make($this->request->file('favicon'));
            $favicon->fit(64, 64);
            $favicon->save(public_path('skins/' . config('settings.skin', 'default') . '/images/favicon.png'));
        }

        if ($this->request->hasFile('logo')) {
            $favicon = Image::make($this->request->file('logo'));
            $favicon->fit(256, 256);
            $favicon->save(public_path('skins/' . config('settings.skin', 'default') . '/images/small-logo.png'));
        }

        //skins/default/images/small-logo.png
        //skins/default/images/favicon.png

        $save_con = $request->input('save_con');

        $array = \config('settings');

        foreach ( $save_con as $name => $value ) {
            $array[$name] = $value;
            config(["settings.{$name}" => $value]);
        }

        $data = var_export($array, 1);

        \Cookie::queue(
            \Cookie::forget('darkMode')
        );

        Artisan::call('config:clear');

        if(File::put(config_path('settings.php'), "<?php\n return $data ;")) {
            return redirect()->route('backend.appearance')->with('status', 'success')->with('message', 'Settings successfully updated!');
        } else {
            die('Permission denied! Please set CHMOD config/settings.php to 666');
        }
    }
}