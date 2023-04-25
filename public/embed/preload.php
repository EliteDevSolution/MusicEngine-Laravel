<?php
@session_start ();
@ob_start ();
@ob_implicit_flush ( 0 );

@error_reporting ( E_ALL ^ E_NOTICE );
@ini_set ( 'display_errors', true );
@ini_set ( 'html_errors', false );
@ini_set ( 'error_reporting', E_ALL ^ E_NOTICE );

define ( 'ROOT_DIR', ".." );

define ( 'INCLUDE_DIR', ROOT_DIR . '/includes' );

require_once (INCLUDE_DIR . '/config.inc.php');

require_once INCLUDE_DIR . '/class/_class_mysql.php';

require_once INCLUDE_DIR . '/db.php';

require_once(ROOT_DIR . '/libs/functions.php');

$id = intval($_REQUEST['id']);

$query = $db->query("SELECT albums.id, albums.collectionName,songs.trackId, songs.artistIds, songs.title, artworks.artworkUrl FROM playlist_songs LEFT JOIN songs ON playlist_songs.trackId = songs.trackId LEFT JOIN albums ON songs.album_id = albums.id LEFT JOIN artwork ON songs.artworkId =  artworks.artworkUrl WHERE playlist_songs.playlist_id = '" . $id . "' LIMIT 0, 100");

$songs = handle_songs_query($query);

$buffer['success'] = true;

$buffer['songs'] = $songs;

header ( 'Content-type: text/json' );

header ( 'Content-type: application/json' );

$callback = $_REQUEST['callback'];

echo $callback . "(" . json_encode($buffer) . ");";
