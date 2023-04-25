<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Console\Command;
use PayPal\Api\Agreement;
use Stripe\StripeClient;

class SubscriptionCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscription:scan';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scan and review auto billing payment';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $subscriptions = Subscription::where('next_billing_date', '<=', Carbon::now()->addDays(1))
            ->limit(5)
            ->get();

        foreach($subscriptions as $subscription) {
            if($subscription->gate == 'stripe') {
                $stripe = new StripeClient(config('settings.payment_stripe_test_mode') ? config('settings.payment_stripe_test_key') : env('STRIPE_SECRET_API'));

                $stripe_subscription = $stripe->subscriptions->retrieve($subscription->token);

                $subscription->payment_status = $stripe_subscription->status == 'active' ? 1 : 0;
                $subscription->next_billing_date = Carbon::parse($stripe_subscription->current_period_end);
                $subscription->amount = $stripe_subscription->plan->amount/100;
                $subscription->currency = config('settings.currency', 'USD');

                if($stripe_subscription->status == 'active') {
                    $subscription->cycles = $stripe_subscription->plan->interval_count;
                    $subscription->last_payment_date = Carbon::now();
                }
                $subscription->save();

                sleep(5);
            } elseif($subscription->gate == 'paypal') {
                $apiContext = new \PayPal\Rest\ApiContext(
                    new \PayPal\Auth\OAuthTokenCredential(
                        env('PAYPAL_APP_CLIENT_ID'),
                        env('PAYPAL_APP_SECRET')
                    )
                );

                try {
                    $agreement = Agreement::get($subscription->token, $apiContext);
                    $subscription->payment_status = Carbon::parse($agreement->getAgreementDetails()->next_billing_date) > Carbon::now() ? 1 : 0;
                    $plan = $agreement->getPlan();
                    $subscription->payment = $plan->getPaymentDefinitions()[0];
                    $subscription->next_billing_date = Carbon::parse($agreement->getAgreementDetails()->next_billing_date);
                    $subscription->cycles = $agreement->getAgreementDetails()->cycles_completed;
                    $subscription->amount = $plan->getPaymentDefinitions()[0]->amount->value;
                    $subscription->currency = $plan->getPaymentDefinitions()[0]->amount->currency;
                    $subscription->save();
                    sleep(5);
                } catch (Exception $ex) {
                    echo "Failed to get activate";
                    var_dump($ex);
                    exit();
                }
            }
            $this->info('Updated subscription for ' . $subscription->user->name);
        }
        $this->info('Subscriptions has been updated!');
    }
}
