<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        if(function_exists('exec')) {
            if (!$this->osProcessIsRunning('queue:work')) {
                $schedule->command('queue:work', [
                    '--timeout' => 0
                ])->everyMinute();
            }
        }

        $schedule->command('subscription:scan')->everyFifteenMinutes();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }

    protected function osProcessIsRunning($needle)
    {
        exec('ps aux -ww', $process_status);

        $result = array_filter($process_status, function($var) use ($needle) {
            return strpos($var, $needle);
        });

        if (!empty($result)) {
            return true;
        }
        return false;
    }
}