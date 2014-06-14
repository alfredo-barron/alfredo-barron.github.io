<?php
require_once 'vendor/flight/autoload.php';
require_once 'vendor/idiorm.php';
use flight\Engine;

//Configuration
/*ORM::configure('mysql:host=localhost;dbname=janko');
ORM::configure('username', 'root');
ORM::configure('password', '110992');
ORM::configure('return_result_sets', true);
ORM::configure('driver_options', array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8')); */

$app = new Engine();
$app->set('root', $app->request()->base."/");
$app->view()->set('root', $app->request()->base."/");
$app->view()->set('rq', $app->request());

//Routes
$app->route('GET /', function() use ($app){
	$app->render('index');
});

$app->route('GET /json', function() use ($app){
	$app->render('ver');
});

$app->route('GET /user', function() use ($app) {
	$app->render('user');
});

$app->route('POST /save', function() use ($app) {
  	$name = (isset($_POST['name']) and !empty($_POST['name'])) ? $_POST['name'] : "";
  	$user = ORM::for_table('users')->create();
    $user->name = $name;
	$user->save();
	$app->redirect($app->get('root'));
});

//Start the engine!
$app->start();
?>
