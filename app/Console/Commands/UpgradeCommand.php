<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Artisan;
use NiNaCoder\Updater\UpdaterManager;

class UpgradeCommand extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'upgrade:latest';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatic upgrade the system';

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
     * @param UpdaterManager $updater
     * @return void
     */
    public function handle(UpdaterManager $updater)
    {
        try {
            ini_set('max_execution_time', 300);
            $versionAvailable = $updater->source()->getVersionAvailable();
            $release = $updater->source()->fetch($versionAvailable);
            $updater->source()->update($release);

            Artisan::call('migrate', ['--force' => true]);
            Artisan::call('cache:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');
            Artisan::call('config:clear');
            Artisan::call('laroute:generate');

            $this->envUpdate ("APP_VERSION", $versionAvailable);

        } catch (\Exception $e) {
            echo json_encode($e->getMessage());
            die();
        }
    }

    /**
     * Update Laravel Env file Key's Value
     * @param string $key
     * @param string $value
     */
    public static function envUpdate($key, $value)
    {
        $path = base_path('.env');

        if (file_exists($path)) {

            file_put_contents($path, str_replace(
                $key . '=' . env($key), $key . '=' . $value, file_get_contents($path)
            ));
        }
    }
}
