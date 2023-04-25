<?php
/**
 * Created by NiNaCoder.
 * Date: 2019-05-30
 * Time: 11:09
 */

namespace App\Http\Controllers\Frontend;

use App\Models\Album;
use App\Models\Artist;
use App\Models\Playlist;
use Illuminate\Http\Request;
use View;
use App\Models\Mood;
use App\Models\Song;
use App\Models\Slide;
use App\Models\Channel;
use MetaTag;

class MoodController
{
    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    private function getMood(){
        $mood = Mood::where('alt_name',  $this->request->route('slug'))->firstOrFail();
        /** set metatags for mood section */
        MetaTag::set('title', $mood->meta_title ? $mood->meta_title : $mood->name);
        MetaTag::set('description', $mood->meta_description ? $mood->meta_description : $mood->description);
        MetaTag::set('keywords', $mood->meta_keywords);
        MetaTag::set('image', $mood->artwork);

        return $mood;
    }

    public function index()
    {
        $mood = $this->getMood();
        $channels = Channel::where('mood', 'REGEXP', '(^|,)(' . $mood->id . ')(,|$)')->orderBy('priority', 'asc')->get();
        $slides = Slide::where('mood', 'REGEXP', '(^|,)(' . $mood->id . ')(,|$)')->orderBy('priority', 'asc')->get();
        $mood->songs = Song::where('mood', 'REGEXP', '(^|,)(' . $mood->id . ')(,|$)')->paginate(20);

        if( $this->request->is('api*') )
        {
            return response()->json(array(
                'slides' => json_decode(json_encode($slides)),
                'channels' => json_decode(json_encode($channels)),
                'mood' => $mood,
            ));
        }

        $mood->related = Mood::where('id', '!=',  $mood->id);

        $view = View::make('mood.index')
            ->with('slides', json_decode(json_encode($slides)))
            ->with('channels', json_decode(json_encode($channels)))
            ->with('mood', $mood);

        if($this->request->ajax()) {
            $sections = $view->renderSections();

            if($this->request->input('page') && intval($this->request->input('page')) > 1)
            {
                return $sections['pagination'];
            } else {
                return $sections['content'];
            }
        }

        return $view;
    }

    public function songs()
    {
        $mood = $this->getMood();
        $songs = Song::where('mood', 'REGEXP', '(^|,)(' . $mood->id . ')(,|$)');

        if( $this->request->is('api*') )
        {
            return response()->json($songs);
        }
    }

    public function albums()
    {
        $mood = $this->getMood();
        $albums = Album::where('mood', 'REGEXP', '(^|,)(' . $mood->id . ')(,|$)');

        if( $this->request->is('api*') )
        {
            return response()->json($albums);
        }
    }

    public function artists()
    {
        $mood = $this->getMood();
        $artists = Artist::where('mood', 'REGEXP', '(^|,)(' . $mood->id . ')(,|$)');

        if( $this->request->is('api*') )
        {
            return response()->json($artists);
        }
    }

    public function playlists()
    {
        $mood = $this->getMood();
        $playlists = Playlist::where('mood', 'REGEXP', '(^|,)(' . $mood->id . ')(,|$)');

        if( $this->request->is('api*') )
        {
            return response()->json($playlists);
        }
    }
}
