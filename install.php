<?php

class Installer
{
    private $bootStrapped = false;

    private $basePath;

    public function __construct()
    {
        $this->basePath = realpath(__DIR__);
    }

    public function introducing(){
        $view =  view('backend.install.introducing');
        echo $view;
    }

    public function checkRequirements(){
        $requirements = (Object) array();
        $requirements->phpversion = phpversion() < '7.4.0' ? '<p class="mb-0 text-danger">No</p>' : '<p class="mb-0 text-success">' . phpversion() . '</p>';
        $requirements->mysqli_connect = function_exists('mysqli_connect') ? '<p class="mb-0 text-success">Yes</p>' : '<p class="mb-0 text-danger">No</p>';
        $requirements->zlib = extension_loaded('zlib') ? '<p class="mb-0 text-success">Yes</p>' : '<p class="mb-0 text-danger">No</p>';
        $requirements->xml = extension_loaded('xml') ? '<p class="mb-0 text-success">Yes</p>' : '<p class="mb-0 text-danger">No</p>';
        $requirements->iconv = function_exists('iconv') ? '<p class="mb-0 text-success">Yes</p>' : '<p class="mb-0 text-danger">No</p>';
        $requirements->safe_mode = ini_get('safe_mode') ? '<p class="mb-0 text-danger">Enabled</p>' : '<p class="mb-0 text-success">Disabled</p>';
        $requirements->file_uploads = ini_get('file_uploads') ? '<p class="mb-0 text-success">Enabled</p>' : '<p class="mb-0 text-danger">Disabled</p>';
        $requirements->pdo = class_exists("PDO") ? '<p class="mb-0 text-success">Enabled</p>' : '<p class="mb-0 text-danger">Disabled</p>';
        $requirements->mbstring = extension_loaded('mbstring') ? '<p class="mb-0 text-success">Enabled</p>' : '<p class="mb-0 text-danger">Disabled</p>';
        $requirements->openssl = extension_loaded('openssl') ? '<p class="mb-0 text-success">Enabled</p>' : '<p class="mb-0 text-danger">Disabled</p>';
        $requirements->magic_quotes_runtime = ini_get('magic_quotes_runtime') ? '<p class="mb-0 text-danger">Enabled</p>' : '<p class="mb-0 text-success">Disabled</p>';
        $requirements->register_globals = ini_get('register_globals') ? '<p class="mb-0 text-danger">Enabled</p>' : '<p class="mb-0 text-success">Disabled</p>';
        $requirements->session_auto_start = ini_get('session.auto_start') ? '<p class="mb-0 text-danger">Enabled</p>' : '<p class="mb-0 text-success">Disabled</p>';
        $requirements->curl = function_exists('curl_version') ? '<p class="mb-0 text-success">Yes</p>' : '<p class="mb-0 text-danger">No</p>';
        $requirements->exif = extension_loaded('exif') ? '<p class="mb-0 text-success">Yes</p>' : '<p class="mb-0 text-danger">No</p>';

        $view =  view('backend.install.requirements')->with('requirements', $requirements);
        echo $view;
    }

    public function checkCHMOD(){
        $ROOT_DIR = $this->basePath;
        $important_files = array(
            $ROOT_DIR . '/',
            $ROOT_DIR . '/.env.example',
            $ROOT_DIR . '/bootstrap/cache',
            $ROOT_DIR . '/config/settings.php',
            $ROOT_DIR . '/public',
            $ROOT_DIR . '/public/js/route.js',
            $ROOT_DIR . '/storage',
            $ROOT_DIR . '/storage/app',
            $ROOT_DIR . '/storage/app/public',
            $ROOT_DIR . '/storage/framework',
            $ROOT_DIR . '/storage/framework/sessions',
            $ROOT_DIR . '/storage/framework/testing',
            $ROOT_DIR . '/storage/framework/views',
            $ROOT_DIR . '/storage/framework/cache',
            $ROOT_DIR . '/storage/framework/cache/data',
            $ROOT_DIR . '/storage/logs',
        );

        $chmod = array();

        $has_errors = 0;

        foreach($important_files as $file){
            $item = (Object) array();
            $chmod_value = @decoct(@fileperms($file)) % 1000;

            if(!file_exists($file)){
                $item->file = str_replace($ROOT_DIR, '', $file);
                $item->chmodValue = $chmod_value;
                $item->isWritable = false;
                $item->status = 'Not found';
                $chmod[] = $item;
                $has_errors++;
            }elseif(is_writable($file)){
                $item->file = str_replace($ROOT_DIR, '', $file);
                $item->chmodValue = $chmod_value;
                $item->isWritable = true;
                $item->status = 'Found';
                $chmod[] = $item;
            }else{
                @chmod($file, 0777);
                if(is_writable($file)){
                    $item->file = str_replace($ROOT_DIR, '', $file);
                    $item->chmodValue = $chmod_value;
                    $item->isWritable = true;
                    $item->status = 'Found';
                    $chmod[] = $item;
                }else{
                    /**
                     * Try to auto chmod
                     */
                    @chmod("$file", 0755);
                    if(is_writable($file)){
                        $item->file = str_replace($ROOT_DIR, '', $file);
                        $item->chmodValue = $chmod_value;
                        $item->isWritable = true;
                        $item->status = 'Found';
                        $chmod[] = $item;
                    }else{
                        $item->file = str_replace($ROOT_DIR, '', $file);
                        $item->chmodValue = $chmod_value;
                        $item->isWritable = false;
                        $item->status = 'Found';
                        $chmod[] = $item;
                        $has_errors++;
                    }
                }
            }
        }

        $chmod = (Object) $chmod;
        $view =  view('backend.install.chmod')->with('chmod', $chmod)->with('has_errors', $has_errors);
        echo $view;
    }

    public function checkLicense(){
        $request = Illuminate\Http\Request::capture();
        $errors = array();

        if($request->isMethod('post')){
            $validator = Illuminate\Support\Facades\Validator::make($request->all(),
                [
                    'license' => 'required|string',
                ]
            );

            if ($validator->fails())
            {
                foreach ($validator->messages()->getMessages() as $field_name => $messages)
                {
                    $errors[] = $messages;
                }
            } else {
                $personalToken = "vGdSqLV6lfIx8HkxbdBJMrA9rcOXjgV0";
                $userAgent = "Purchase code verification";
                $code = trim($request->input('license'));

                if (!preg_match("/^([a-f0-9]{8})-(([a-f0-9]{4})-){3}([a-f0-9]{12})$/i", $code)) {
                    $error = ("Invalid code");
                    if($error) {
                        $errors[] = array($error);
                    }
                    echo $view =  view('backend.install.license')
                        ->with('request', $request)
                        ->with('errors', $errors);
                    exit();
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
                    $error = ("Error connecting to API: " . curl_error($ch));
                    if($error) {
                        $errors[] = array($error);
                    }
                    echo $view =  view('backend.install.license')
                        ->with('request', $request)
                        ->with('errors', $errors);
                    exit();
                }

                $responseCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

                if ($responseCode === 404) {
                    $error = ("The purchase code was invalid");
                    if($error) {
                        $errors[] = array($error);
                    }
                    echo $view =  view('backend.install.license')
                        ->with('request', $request)
                        ->with('errors', $errors);
                    exit();
                }

                if ($responseCode !== 200) {
                    $error = ("Failed to validate code due to an error: HTTP {$responseCode}");
                    if($error) {
                        $errors[] = array($error);
                    }
                    echo $view =  view('backend.install.license')
                        ->with('request', $request)
                        ->with('errors', $errors);
                    exit();
                }

                $body = @json_decode($response);

                if ($body === false && json_last_error() !== JSON_ERROR_NONE) {
                    $error = ('Error parsing response');
                    if($error) {
                        $errors[] = array($error);
                    }
                    echo $view =  view('backend.install.license')
                        ->with('request', $request)
                        ->with('errors', $errors);
                    exit();
                }

                if($body->item->id == '28641149') {
                    Illuminate\Support\Facades\Cache::put('license', $code);
                    header("Location: " . $_SERVER['PHP_SELF'] . "?step=database");
                } else {
                    $error = ('The purchase code was invalid');
                    if($error) {
                        $errors[] = array($error);
                    }
                    echo $view =  view('backend.install.license')
                        ->with('request', $request)
                        ->with('errors', $errors);
                    exit();
                }
            }
        }

        $view =  view('backend.install.license')
            ->with('request', $request)
            ->with('errors', $errors);

        echo $view;
    }

    public function checkDatabase() {
        $request = Illuminate\Http\Request::capture();

        $errors = array();

        if($request->isMethod('post')){
            $validator = Illuminate\Support\Facades\Validator::make($request->all(),
                [
                    'host' => 'required',
                    'database' => 'required',
                    'username' => 'required',
                    'password' => 'required'
                ]
            );

            if ($validator->fails())
            {
                foreach ($validator->messages()->getMessages() as $field_name => $messages)
                {
                    $errors[] = $messages;
                }
            } else {
                $input = array(
                    'host' => $request->input('host'),
                    'database' => $request->input('database'),
                    'username' => $request->input('username'),
                    'password' => $request->input('password'),
                );
                $error = $this->validateDbCredentials($input, $request);

                if($error) {
                    $errors[] = array($error);
                }
            }
        }



        if(! Illuminate\Support\Facades\Cache::has('license') ) {
            die('No license');
        }

        $view =  view('backend.install.database')
            ->with('request', $request)
            ->with('errors', $errors);

        print $view;
    }

    public function createAdmin(){
        $request = Illuminate\Http\Request::capture();
        $errors = array();

        if($request->isMethod('post')){
            $validator = Illuminate\Support\Facades\Validator::make($request->all(),
                [
                    'name' => 'required|string|max:100',
                    'username' => 'required|string|alpha_dash',
                    'email' => 'required|string|email',
                    'password' => 'required|string|min:5|confirmed'
                ]
            );
            // Validate the arguments.
            if ($validator->fails())
            {
                foreach ($validator->messages()->getMessages() as $field_name => $messages)
                {
                    $errors[] = $messages;
                }
            } else {
                $this->prepareDatabaseForMigration();
                try {
                    $user = new App\Models\User();
                    $user->name = $request->input('name');
                    $user->username = $request->input('username');
                    $user->email = $request->input('email');
                    $user->password = Hash::make($request->input('password'));
                    $user->save();


                    App\Models\RoleUser::updateOrCreate([
                        'user_id' => $user->id,
                    ], [
                        'role_id' => 1,
                    ]);

                    Auth::login($user);
                    header('Location: ' . $_SERVER['PHP_SELF'] . '?step=finalize');
                    exit;

                } catch (\Exception $e) {
                    die("Could not connect to the database.  Please check your configuration. error:" . $e );
                }



            }
        }

        $view =  view('backend.install.admin')
            ->with('request', $request)
            ->with('errors', $errors);

        print $view;
    }

    public function finalize(){
        $request = Illuminate\Http\Request::capture();
        $errors = array();

        if($request->isMethod('post')){
            $validator = Illuminate\Support\Facades\Validator::make($request->all(),
                [
                    'siteUrl' => 'required',
                ]
            );

            if ($validator->fails())
            {
                foreach ($validator->messages()->getMessages() as $field_name => $messages)
                {
                    $errors[] = $messages;
                }
            } else {
                $this->finalizeInstallation($request->input('siteUrl'));
            }
        }

        $view =  view('backend.install.finalize')
            ->with('request', $request)
            ->with('errors', $errors);

        print $view;
    }

    private function validateDbCredentials($input, $request)
    {
        $credentials = array_merge([
            'host' => null,
            'database' => null,
            'username' => null,
            'password' => null,
        ], $input);

        $db = 'mysql:host=' . $credentials['host'] . ';dbname=' . $credentials['database'];

        try {
            $db = new PDO($db, $credentials['username'], $credentials['password'], array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
            $this->createDb($input, $request);
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }

    public function createDb($input, $request)
    {
        $this->insertDBCredentials($input);
        $this->generateAppKey();
        $this->bootFramework();
        Schema::defaultStringLength(191);
        $this->prepareDatabaseForMigration($input);

        $results = \DB::select( DB::raw("select version()") );
        $mysqlVersion =  floatval(preg_replace("/[^0-9.]/", "", $results[0]->{'version()'}));

        if($mysqlVersion < 10) {
            if($mysqlVersion > 5.6) {

            } else {
                $sql = <<<SQL
DROP FUNCTION IF EXISTS `json_extract_c`;

CREATE FUNCTION `json_extract_c`(
details TEXT,
required_field VARCHAR (255)
) RETURNS TEXT CHARSET latin1
BEGIN
SET details = TRIM(LEADING '{' FROM TRIM(details));
SET details = TRIM(TRAILING '}' FROM TRIM(details));
RETURN TRIM(
    BOTH '"' FROM SUBSTRING_INDEX(
        SUBSTRING_INDEX(
            SUBSTRING_INDEX(
                details,
                CONCAT(
                    '"',
                    SUBSTRING_INDEX(required_field,'$.', - 1),
                    '":'
                ),
                - 1
            ),
            ',"',
            1
        ),
        ':',
        -1
    )
) ;
END
SQL;
                \DB::connection()->getPdo()->exec($sql);
            }
        } else {
            if($mysqlVersion > 10.2) {

            } else {
                $sql = <<<SQL
DROP FUNCTION IF EXISTS `json_extract_c`;

CREATE FUNCTION `json_extract_c`(
details TEXT,
required_field VARCHAR (255)
) RETURNS TEXT CHARSET latin1
BEGIN
SET details = TRIM(LEADING '{' FROM TRIM(details));
SET details = TRIM(TRAILING '}' FROM TRIM(details));
RETURN TRIM(
    BOTH '"' FROM SUBSTRING_INDEX(
        SUBSTRING_INDEX(
            SUBSTRING_INDEX(
                details,
                CONCAT(
                    '"',
                    SUBSTRING_INDEX(required_field,'$.', - 1),
                    '":'
                ),
                - 1
            ),
            ',"',
            1
        ),
        ':',
        -1
    )
) ;
END
SQL;
                \DB::connection()->getPdo()->exec($sql);
            }
        }

        Artisan::call('migrate', ['--force' => true]);
        Artisan::call('db:seed', ['--force' => true]);

        header('Location: ' . $request->getSchemeAndHttpHost() . '?step=admin');
        exit;
    }

    private function insertDBCredentials(array $input)
    {
        $content = file_get_contents($this->basePath.'/.env.example');
        foreach ($input as $key => $value) {
            if ( ! $value) $value = '';
            preg_match("/(DB_$key=)(.*?)\\n/msi", $content, $matches);
            $content = str_replace($matches[1].$matches[2], $matches[1].$value, $content);
        }
        file_put_contents($this->basePath.'/.env.example', $content);
    }

    public function prepareDatabaseForMigration($input = [])
    {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '.env.example');
        try {
            $dotenv->load();
        } catch ( Exception $e )  {
            echo $e->getMessage();
        }

        App::detectEnvironment(function () {
            return 'local';
        });

        $default = config('database.default');

        if (empty($input)) {
            $input = array(
                'host' => getenv('DB_HOST') ? getenv('DB_HOST') : env('DB_HOST'),
                'database' => getenv('DB_DATABASE') ? getenv('DB_DATABASE') : env('DB_DATABASE'),
                'username' => getenv('DB_USERNAME') ? getenv('DB_USERNAME') : env('DB_USERNAME'),
                'password' => getenv('DB_PASSWORD') ? getenv('DB_PASSWORD') : env('DB_PASSWORD'),
            );
        }

        DB::purge($default);

        $reflectionClass = new ReflectionClass(DB::connection());
        $reflectionProperty = $reflectionClass->getProperty('config');
        $reflectionProperty->setAccessible(true);
        $reflectionProperty->setValue(DB::connection(), null);

        DB::setDatabaseName($input['database']);

        foreach ($input as $key => $value) {
            if ( ! $value) $value = null;
            Config::set("database.connections.$default.$key", $value);
        }

        DB::reconnect($default);
    }

    private function generateAppKey()
    {
        $content = file_get_contents($this->basePath.'/.env.example');
        $key = 'base64:'.base64_encode($this->randomString(32));
        $content = preg_replace("/(.*?APP_KEY=).*?(.+?)\\n/msi", '${1}' . $key . "\n", $content);

        file_put_contents($this->basePath.'/.env.example', $content);
    }

    private function randomString($length = 6) {
        $str = "";
        $characters = array_merge(range('A','Z'), range('a','z'), range('0','9'));
        $max = count($characters) - 1;
        for ($i = 0; $i < $length; $i++) {
            $rand = mt_rand(0, $max);
            $str .= $characters[$rand];
        }
        return $str;
    }

    private function putAppInProductionEnv($siteUrl)
    {
        $content = file_get_contents($this->basePath.'/.env.example');
        $content = preg_replace("/(.*?INSTALLED=).*?(.+?)\\n/msi", '${1}1' . "\n", $content);
        $content = preg_replace("/(.*?APP_ENV=).*?(.+?)\\n/msi", '${1}production' . "\n", $content);
        $content = preg_replace("/(.*?APP_DEBUG=).*?(.+?)\\n/msi", '${1}false' . "\n", $content);
        $url = isset($siteUrl) ? $siteUrl : url('');
        $content = preg_replace("/(.*APP_URL=).*?(.+?)\\n/msi", '${1}' . rtrim($url, '/') . "\n", $content);
        file_put_contents($this->basePath.'/.env.example', $content);
    }

    public function bootFramework()
    {
        if ( ! $this->bootStrapped) {
            require $this->basePath . '/vendor/autoload.php';
            $app = require_once $this->basePath . '/bootstrap/app.php';
            $kernel = $app->make('Illuminate\Contracts\Console\Kernel');
            $kernel->bootstrap();

            $this->bootStrapped = true;
        }
    }

    public function finalizeInstallation($siteUrl)
    {

        $this->bootFramework();

        $this->putAppInProductionEnv($siteUrl);

        copy($this->basePath.'/.env.example', $this->basePath.'/.env');

        Artisan::call('storage:link');
        Cache::flush();
        config(['app.url' => $siteUrl]);
        Artisan::call('laroute:generate');
        $view =  view('backend.install.completed')->with('siteUrl', $siteUrl);
        echo $view;
        die();
    }
}


if (version_compare(PHP_VERSION, '7.4', '<')) exit('You need at least PHP 7.4 to install this application.');

@set_time_limit(3600);
ini_set('pcre.recursion_limit', '524');

$installer = new Installer();
$installer->bootFramework();

function checkIfAlreadyMigrated(){
    $installer = new Installer();
    try {
        $installer->prepareDatabaseForMigration();

        try {
            DB::connection()->getPdo();

            if(Schema::hasTable('users')){
                $user = DB::table('users')->get();
                $request = Illuminate\Http\Request::capture();

                if(isset($user[0])){
                    header('Location: ' . $request->getSchemeAndHttpHost() . '?step=finalize');
                } else {
                    header('Location: ' . $request->getSchemeAndHttpHost() . '?step=admin');
                }
            }

        } catch (\Exception $e) {

        }
    } catch (\Exception $e) {

    }
}

function checkIfAdminIsExits(){
    $installer = new Installer();
    try {
        $installer->prepareDatabaseForMigration();
        try {
            DB::connection()->getPdo();

            if(Schema::hasTable('users')){
                $request = Illuminate\Http\Request::capture();
                $user = DB::table('users')->get();
                if(isset($user[0])) {
                    header('Location: ' . $request->getSchemeAndHttpHost() . '?step=finalize');
                }
            }

        } catch (\Exception $e) {

        }
    } catch (\Exception $e) {

    }
}


isset($_GET['step']) ? $step = $_GET['step'] : $step = '';

switch ($step) {
    case "requirements":
        checkIfAlreadyMigrated();
        $installer->checkRequirements();
        break;
    case "chmod":
        $installer->checkCHMOD();
        break;
    case "license":
        $installer->checkLicense();
        break;
    case "database":
        checkIfAlreadyMigrated();
        $installer->checkDatabase();
        break;
    case "admin":
        checkIfAdminIsExits();
        $installer->createAdmin();
        break;
    case "finalize":
        $installer->finalize();
        break;
    default:
        checkIfAlreadyMigrated();
        $installer->introducing();
}
