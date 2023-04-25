<?php

namespace App\Modules\Sparco;

use App\Models\Order;
use App\Models\Service;
use Carbon\Carbon;
use Cart;
use Illuminate\Http\Request;
use App\Models\Email;
use App\Models\Subscription;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use View;
use Session;

class Controller
{
    private $endpoint;
    private $_APIKey;
    private $request;

    public function __construct(Request $request, $protocol = 'https')
    {
        $this->endpoint = config('payment.gateway.sparco.endpoint');
        $this->request = $request;
        $this->_APIKey = config('payment.gateway.sparco.public_key');
        View::addLocation(app_path() . '/Modules/Sparco/views');
    }

    public function subscriptionAuthorization()
    {
        $service = Service::findOrFail($this->request->route('id'));


        $response = Http::withBody('
        {
            "transactionName": "'. $service->title .'",
            "amount": "' . $service->price . '",
            "currency": "'. config('settings.currency', 'USD') . '",
            "transactionReference": "' . Str::random(15) . '",
            "customerFirstName": "' . auth()->user()->name . '",
            "customerLastName": "' . auth()->user()->name . '",
            "customerEmail": "' . auth()->user()->email . '",
            "merchantPublicKey": "ca33ba1e71b14954b51160a0a97ecc00",
            "webhookUrl": "https://d8775e19f248.ngrok.io/webhook?src=txn",
            "returnUrl": "' . route('frontend.sparco.subscription.callback', ['id' => $this->request->route('id')]) . '",
            "autoReturn": false
        }', 'application/json')
            ->withOptions([
            ])
            ->post('https://checkout.sparco.io/gateway/api/v1/checkout');

        return response()->redirectTo($response->object()->paymentUrl);
    }

    public function subscriptionCallback()
    {
        if(auth()->user()->subscription) {
            abort(403, 'You are already have a subscription.');
        }


        $service = Service::findOrFail($this->request->route('id'));
        $subscription = new Subscription();
        $subscription->gate = 'sparco';
        $subscription->user_id = auth()->user()->id;
        $subscription->service_id = $service->id;
        $subscription->payment_status = 1;
        $subscription->transaction_id = $this->request->input('transaction_id');
        $subscription->token = $this->request->input('transaction_id');
        $subscription->trial_end = null;

        switch ($service->plan_period_format) {
            case 'D':
                $next_billing_date = Carbon::now()->addDays($service->plan_period)->format('Y-m-d\TH:i:s\Z');
                break;
            case 'W':
                $next_billing_date = Carbon::now()->addWeeks($service->plan_period)->format('Y-m-d\TH:i:s\Z');
                break;
            case 'M':
                $next_billing_date = Carbon::now()->addMonths($service->plan_period)->format('Y-m-d\TH:i:s\Z');
                break;
            case 'Y':
                $next_billing_date = Carbon::now()->addYears($service->plan_period)->format('Y-m-d\TH:i:s\Z');
                break;
            default:
                $next_billing_date = date("Y-m-d\TH:i:s\Z", strtotime('+2 minute'));
        }

        $subscription->next_billing_date = $next_billing_date;
        $subscription->cycles = 1;
        $subscription->amount = $service->price;
        $subscription->currency = config('settings.currency', 'USD');

        if(! $service->trial) {
            $subscription->last_payment_date = Carbon::now();
        }

        $subscription->save();

        (new Email)->subscriptionReceipt(auth()->user(), $subscription);

        echo '<script type="text/javascript">
            var opener = window.opener;
            if(opener) {
                opener.Payment.subscriptionSuccess();
                window.close();
            }
            </script>';

        exit;
    }

    public function purchaseAuthorization()
    {
        Cart::session(auth()->user()->id);

        $items = array();
        foreach (Cart::getContent() as $product) {
            $item = $product->associatedModel->title;
            $items[] = $item;
        }

        $response = Http::withBody('
        {
            "transactionName": "'. implode(', ', $items) .'",
            "amount": "' . round(Cart::getTotal()) . '",
            "currency": "'. config('settings.currency', 'USD') . '",
            "transactionReference": "' . Str::random(15) . '",
            "customerFirstName": "' . auth()->user()->name . '",
            "customerLastName": "' . auth()->user()->name . '",
            "customerEmail": "' . auth()->user()->email . '",
            "merchantPublicKey": "ca33ba1e71b14954b51160a0a97ecc00",
            "webhookUrl": "https://d8775e19f248.ngrok.io/webhook?src=txn",
            "returnUrl": "' . route('frontend.sparco.purchase.callback') . '",
            "autoReturn": false
        }', 'application/json')
            ->withOptions([
            ])
            ->post('https://checkout.sparco.io/gateway/api/v1/checkout');

        return response()->redirectTo($response->object()->paymentUrl);
    }

    public function purchaseCallback()
    {
        Cart::session(auth()->user()->id);

        foreach (Cart::getContent() as $item) {
            $order = new Order();
            $order->user_id = auth()->user()->id;
            $order->orderable_id = $item->attributes->orderable_id;
            $order->orderable_type = $item->attributes->orderable_type;
            $order->payment = 'aim';
            $order->amount = $item->price;
            $order->currency = config('settings.currency', 'USD');
            $order->payment_status = 1;
            $order->transaction_id = $this->request->input('transaction_id');
            $order->save();
        }

        Cart::clear();

        echo '<script type="text/javascript">
        var opener = window.opener;
        if(opener) {
            opener.Payment.purchaseSuccess();
            window.close();
        }
        
     </script>';
        exit();
    }
}
