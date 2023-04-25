<?php


namespace App\Http\Controllers\Frontend;

use App\Models\Artist;
use App\Models\CountryLanguage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Podcast;
use App\Models\Episode;
use DB;
use View;
use App\Models\Role;

class PodcastController
{
    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;

    }

    public function index()
    {
        $podcast = Podcast::withoutGlobalScopes()->findOrFail($this->request->route('id'));

        if(! $podcast->approved && auth()->check() && Role::getValue('admin_podcasts')) {

        } else {
            if(! isset($podcast->id)) {
                abort(404);
            } elseif(auth()->check() && ! $podcast->visibility && ($podcast->user_id != auth()->user()->id)) {
                abort(404);
            }  elseif(! auth()->check() && ! $podcast->visibility) {
                abort(404);
            } elseif(! $podcast->approved) {
                abort(404);
            }
        }

        if((!$podcast->episode_count && isset($podcast->rss_feed_url)) || Carbon::now()->gt(Carbon::parse($podcast->updated_at)->addDay())) {
            @libxml_use_internal_errors(true);
            $rss = @simplexml_load_file($podcast->rss_feed_url);

            if (false !== $rss) {
                if (isset($rss->channel)) {
                    if(! $podcast->description) {
                        $podcast->description = strip_tags($rss->channel->description);
                    }
                    if(!$this->request->input('language_id') && $rss->channel->language) {
                        $language = CountryLanguage::where('country_code', reset($rss->channel->language))->first();
                        if(isset($language->id)) {
                            $podcast->language_id = $language->id;
                        }
                    }
                    if($rss->channel->copyright) {
                        $podcast->copyright = reset($rss->channel->copyright);
                    }
                    if($rss->channel->link) {
                        $podcast->link = $rss->channel->link;
                    }
                    $podcast->updated_at = Carbon::now();

                    if($rss->channel->children('itunes', true)) {
                        $itunes = $rss->channel->children('itunes', true);
                        if(isset($itunes->type)) {
                            $podcast->type = reset($itunes->type);
                        }
                    }

                    if(! $podcast->getFirstMediaUrl('artwork')) {
                        try {
                            $podcast->artwork_url = reset($rss->channel->image->url) ? reset($rss->channel->image->url) : reset($itunes->image->attributes()->href);
                        } catch (\Exception $exception) {
                            // do nothing
                        }
                    }

                    $podcast->save();
                }

                if (isset($rss->channel->item)) {
                    foreach ($rss->channel->item as $item) {
                        if (!Episode::where('created_at', Carbon::parse($item->pubDate))->where('podcast_id', $podcast->id)->exists()) {
                            $episode = new Episode();

                            $episode->podcast_id = $podcast->id;
                            $episode->title = $item->title;
                            $episode->description = strip_tags($item->description);
                            $episode->created_at = Carbon::parse($item->pubDate);
                            $episode->type = $item->enclosure['type'];
                            $episode->stream_url = $item->enclosure['url'];
                            if($item->link) {
                                $episode->link = $item->link;
                            }

                            if($item->children('itunes', true)) {
                                $itunes = $item->children('itunes', true);
                                $duration = reset($itunes->duration);

                                if(count(explode(':', $duration)) == 2) {
                                    list($hours, $minutes) = explode(':', $duration, 2);
                                    $duration = $minutes * 60 + $hours * 3600;
                                } elseif(count(explode(':', $duration)) == 3) {
                                    list($hours, $minutes, $seconds) = explode(':', $duration, 3);
                                    $duration = $minutes * 60 + $hours * 3600 + $seconds;
                                }
                                $episode->duration = intval($duration);
                                $episode->explicit = (reset($itunes->explicit) == 'clean' || reset($itunes->explicit) == 'no' ) ? 0 : 1;

                                if(isset($itunes->episodeType)) {
                                    $episode->episodeType = reset($itunes->episodeType);
                                }
                                if(isset($itunes->episode)) {
                                    $episode->number = reset($itunes->episode);
                                }
                                if(isset($itunes->season)) {
                                    $episode->season = reset($itunes->season);
                                }
                            } else {
                                $episode->duration = intval($item->enclosure['length']);
                            }
                            $episode->save();
                        }
                    }
                    sleep(1);
                }
            }
        }

        $episodes = Episode::where('podcast_id', $podcast->id)->with('podcast.artist');

        if($this->request->input('season')) {
            $episodes = $episodes->where('season', $this->request->input('season'));
        }

        $episodes = $episodes->paginate(20);

        $podcast->episodes = $episodes;

        if($podcast->type == 'episodic' || $podcast->type == 'serial') {
            $seasons = array();
            $rows = DB::table('episodes')->select('season')->where('podcast_id', $podcast->id)->groupBy('season')->get();
            foreach ($rows as $row) {
                $seasons[] = $row->season;
            }
            $podcast['seasons'] = $seasons;
        }

        if( $this->request->is('api*') )
        {
            if($this->request->get('callback'))
            {
                foreach ($podcast->episodes as $episode) {
                    $episode->artists = [['name' => $episode->podcast->title]];
                    $episode->artwork_url = $episode->podcast->artwork_url;
                }

                return response()->jsonp($this->request->get('callback'), $podcast->episodes)->header('Content-Type', 'application/javascript');
            }
            return response()->json($podcast);
        }

        $view = View::make('podcast.index')
            ->with('podcast',  $podcast);

        if(isset($podcast->artist)) {
            $artist = $podcast->artist;
            $artist->setRelation('similar', $artist->similar()->paginate(5));
        }

        if($this->request->ajax()) {
            $sections = $view->renderSections();
            if($this->request->input('page') && intval($this->request->input('page')) > 1)
            {
                return $sections['pagination'];
            } else {
                return $sections['content'];
            }
        }

        getMetatags($podcast);

        return $view;
    }

    public function subscribers()
    {
        $podcast = Podcast::findOrFail($this->request->route('id'));

        if( $this->request->is('api*') )
        {
            return response()->json($podcast->subscribers);
        }

        $view = View::make('podcast.subscribers')
            ->with('podcast', $podcast);

        if($this->request->ajax()) {
            $sections = $view->renderSections();
            return $sections['content'];
        }

        getMetatags($podcast);

        return $view;
    }

    public function episode()
    {
        $episode = Episode::with('podcast.artist')->findOrFail($this->request->route('epid'));

        if( $this->request->is('api*') )
        {
            if($this->request->get('callback'))
            {
                $episode->artists = [['name' => $episode->podcast->title]];
                $episode->artwork_url = $episode->podcast->artwork_url;

                return response()->jsonp($this->request->get('callback'), [$episode])->header('Content-Type', 'application/javascript');
            }

            return response()->json($episode);
        }

        $view = View::make('podcast.episode')
            ->with('episode', $episode);

        if($this->request->ajax()) {
            $sections = $view->renderSections();
            return $sections['content'];
        }

        getMetatags($episode);

        return $view;
    }
}