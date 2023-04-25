<?php
/**
 * Created by NiNaCoder.
 * Date: 2019-05-25
 * Time: 09:01
 */

namespace App\Http\Controllers\Backend;

use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use View;

class UpgradeController
{
    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }


    public function index(Request $request)
    {
        return view('backend.upgrade.index');
    }


    public function checkingLicense(Request $request)
    {
        $this->request->validate([
            'license' => 'required|string',
        ]);

        $code = $request->input('license');

        $personalToken = "vGdSqLV6lfIx8HkxbdBJMrA9rcOXjgV0";
        $userAgent = "Purchase code verification";
        $code = trim($code);

        if (!preg_match("/^([a-f0-9]{8})-(([a-f0-9]{4})-){3}([a-f0-9]{12})$/i", $code)) {
            return redirect()->back()->with('status', 'failed')->with('message', "Invalid code");
        }

        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_URL => "https://api.envato.com/v3/market/author/sale?code={$code}",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer {$personalToken}",
                "User-Agent: {$userAgent}"
            )
        ));

        $response = @curl_exec($ch);

        if (curl_errno($ch) > 0) {
            return redirect()->back()->with('status', 'failed')->with('message', "Error connecting to API: " . curl_error($ch));
        }

        $responseCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($responseCode === 404) {
            return redirect()->back()->with('status', 'failed')->with('message', "The purchase code was invalid");
        }

        if ($responseCode !== 200) {
            return redirect()->back()->with('status', 'failed')->with('message', "Failed to validate code due to an error: HTTP {$responseCode}");
        }

        $body = @json_decode($response);

        if(Carbon::now()->gt($body->supported_until)) {
            return view('backend.upgrade.expired');
        }

        if ($body === false && json_last_error() !== JSON_ERROR_NONE) {
            return redirect()->back()->with('status', 'failed')->with('message', 'Error parsing response');
        }

        if($body->item->id == '28641149') {
            return view('backend.upgrade.process');
        } else {
            return redirect()->back()->with('status', 'failed')->with('message', 'The purchase code was invalid');
        }
    }
}