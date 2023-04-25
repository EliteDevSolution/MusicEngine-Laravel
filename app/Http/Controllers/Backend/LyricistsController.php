<?php
/**
 * Created by NiNaCoder.
 * Date: 2019-05-25
 * Time: 09:02
 */

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use DB;
use View;
use Config;
use App\Models\Lyricist;
use App\Models\Song;
use App\Models\Album;
use Auth;
use Image;
use Carbon\Carbon;

class LyricistsController
{
    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function index()
    {
        $lyricists = Lyricist::withoutGlobalScopes();

        if ($this->request->has('term'))
        {
            $lyricists = $lyricists->where('name', 'like', '%' . $this->request->input('term') . '%');
        }

        if ($this->request->input('lyricistIds') && is_array($this->request->input('lyricistIds')))
        {
            $lyricists = $lyricists->where(function ($query) {
                foreach($this->request->input('lyricistIds') as $index => $lyricistId) {
                    if($index == 0) {
                        $query->where('lyricistIds', 'REGEXP', '(^|,)(' . $lyricistId . ')(,|$)');
                    } else {
                        $query->orWhere('lyricistIds', 'REGEXP', '(^|,)(' . $lyricistId . ')(,|$)');
                    }
                }
            });
        }

        if ($this->request->input('userIds') && is_array($this->request->input('userIds')))
        {
            $lyricists = $lyricists->where(function ($query) {
                foreach($this->request->input('userIds') as $index => $userId) {
                    if($index == 0) {
                        $query->where('user_id', '=', $userId);
                    } else {
                        $query->orWhere('user_id', '=', $userId);
                    }
                }
            });
        }

        if ($this->request->input('genre') && is_array($this->request->input('genre')))
        {
            $lyricists = $lyricists->where('genre', 'REGEXP', '(^|,)(' . implode(',', $this->request->input('genre')) . ')(,|$)');
        }

        if ($this->request->input('mood') && is_array($this->request->input('mood')))
        {
            $lyricists = $lyricists->where('mood', 'REGEXP', '(^|,)(' . implode(',', $this->request->input('mood')) . ')(,|$)');
        }

        if ($this->request->input('created_from'))
        {
            $lyricists = $lyricists->where('created_at', '>=', Carbon::parse($this->request->input('created_from')));
        }

        if ($this->request->has('created_until'))
        {
            $lyricists = $lyricists->where('created_at', '<=', Carbon::parse($this->request->input('created_until')));
        }

        if ($this->request->input('comment_count_from'))
        {
            $lyricists = $lyricists->where('comment_count', '>=', intval($this->request->input('comment_count_from')));
        }

        if ($this->request->has('comment_count_until'))
        {
            $lyricists = $lyricists->where('comment_count', '<=', intval($this->request->input('comment_count_until')));
        }

        if ($this->request->has('comment_disabled'))
        {
            $lyricists = $lyricists->where('allow_comments', '=', 0);
        }

        if ($this->request->has('verified'))
        {
            $lyricists = $lyricists->where('verified', '=', 1);
        }

        if ($this->request->has('hidden'))
        {
            $lyricists = $lyricists->where('visibility', '=', 0);
        }

        if ($this->request->has('loves'))
        {
            $lyricists->orderBy('loves', $this->request->input('loves'));
        }

        if ($this->request->has('title'))
        {
            $lyricists->orderBy('title', $this->request->input('title'));
        }

        if ($this->request->has('results_per_page'))
        {
            $lyricists = $lyricists->paginate(intval($this->request->input('results_per_page')));
        } else {
            $lyricists = $lyricists->paginate(20);
        }

        return view('backend.lyricists.index')
            ->with('lyricists', $lyricists);
    }

    public function delete()
    {
        $lyricist = Lyricist::findOrFail($this->request->route('id'));

        $lyricist->delete();

        return redirect()->route('backend.lyricists')->with('status', 'success')->with('message', 'Lyricist successfully deleted!');
    }

    public function add()
    {
        return view('backend.lyricists.add');
    }

    public function addPost()
    {
        $this->request->validate([
            'name' => 'required|string',
            'genre' => 'array',
            'mood' => 'array',
            'artwork' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:' . config('settings.max_image_file_size', 8096)
        ]);

        $lyricist = new Lyricist();

        $lyricist->name = $this->request->input('name');
        $genre = $this->request->input('genre');
        $mood = $this->request->input('mood');

        if(is_array($genre))
        {
            $lyricist->genre = implode(",", $this->request->input('genre'));
        }

        if(is_array($mood))
        {
            $lyricist->mood = implode(",", $this->request->input('mood'));
        }

        $lyricist->bio = $this->request->input('bio');

        if ($this->request->hasFile('artwork'))
        {
            $this->request->validate([
                'artwork' => 'required|image|mimes:jpeg,png,jpg,gif|max:' . config('settings.max_image_file_size', 8096)
            ]);

            $lyricist->clearMediaCollection('artwork');
            $lyricist->addMediaFromBase64(base64_encode(Image::make($this->request->file('artwork'))->orientate()->fit(intval(config('settings.image_artwork_max', 500)),  intval(config('settings.image_artwork_max', 500)))->encode('jpg', config('settings.image_jpeg_quality', 90))->encoded))
                ->usingFileName(time(). '.jpg')
                ->toMediaCollection('artwork', config('settings.storage_artwork_location', 'public'));
        }

        $lyricist->save();

        return redirect()->route('backend.lyricists')->with('status', 'success')->with('message', 'Lyricist successfully added!');
    }

    public function edit()
    {
        $lyricist = Lyricist::findOrFail($this->request->route('id'));

        $lyricist->setRelation('albums', $lyricist->albums()->withoutGlobalScopes()->paginate(20));
        $lyricist->setRelation('songs', $lyricist->songs()->withoutGlobalScopes()->paginate(20));

        return view('backend.lyricists.edit')
            ->with('lyricist', $lyricist);
    }

    public function editPost()
    {
        $this->request->validate([
            'name' => 'required|string',
            'genre' => 'array',
            'mood' => 'array',
        ]);

        $lyricist = Lyricist::findOrFail($this->request->route('id'));

        if ($this->request->hasFile('artwork'))
        {
            $this->request->validate([
                'artwork' => 'required|image|mimes:jpeg,png,jpg,gif|max:' . config('settings.max_image_file_size', 8096)
            ]);

            $lyricist->clearMediaCollection('artwork');
            $lyricist->addMediaFromBase64(base64_encode(Image::make($this->request->file('artwork'))->orientate()->fit(intval(config('settings.image_artwork_max', 500)),  intval(config('settings.image_artwork_max', 500)))->encode('jpg', config('settings.image_jpeg_quality', 90))->encoded))
                ->usingFileName(time(). '.jpg')
                ->toMediaCollection('artwork', config('settings.storage_artwork_location', 'public'));
        }

        $lyricist->name = $this->request->input('name');
        $genre = $this->request->input('genre');

        if(is_array($genre))
        {
            $lyricist->genre = implode(",", $this->request->input('genre'));

        }

        $mood = $this->request->input('mood');

        if(is_array($mood))
        {
            $lyricist->mood = implode(",", $this->request->input('mood'));

        }

        $lyricist->bio = $this->request->input('bio');

        $lyricist->save();

        return redirect()->route('backend.lyricists')->with('status', 'success')->with('message', 'Lyricist successfully updated!');

    }

    public function massAction()
    {
        $this->request->validate([
            'action' => 'required|string',
            'ids' => 'required|array',
        ]);

        if($this->request->input('action') == 'add_genre') {
            $message = 'Add genre';
            $subMessage = 'Add Genre for Chosen Lyricists (<strong>' . count($this->request->input('ids')) . '</strong>)';
            return view('backend.commons.mass_genre')
                ->with('message', $message)
                ->with('subMessage', $subMessage)
                ->with('action', $this->request->input('action'))
                ->with('ids', $this->request->input('ids'));
        } else if($this->request->input('action') == 'save_add_genre') {
            $ids = $this->request->input('ids');
            foreach($ids as $id) {
                $lyricist = Lyricist::find($id);
                if(isset($song->id)){
                    $currentGenre = explode(',', $song->genre);
                    $newGenre = array_unique(array_merge($currentGenre, $this->request->input('genre')));
                    $lyricist->genre = implode(',', $newGenre);
                    $lyricist->save();
                }
            }
            return redirect()->route('backend.lyricists')->with('status', 'success')->with('message', 'Lyricists successfully saved!');
        } elseif($this->request->input('action') == 'change_genre') {
            $message = 'Change genre';
            $subMessage = 'Change Genre for Chosen Lyricists (<strong>' . count($this->request->input('ids')) . '</strong>)';
            return view('backend.commons.mass_genre')
                ->with('message', $message)
                ->with('subMessage', $subMessage)
                ->with('action', $this->request->input('action'))
                ->with('ids', $this->request->input('ids'));
        } else if($this->request->input('action') == 'save_change_genre') {
            $ids = $this->request->input('ids');
            foreach($ids as $id) {
                $lyricist = Lyricist::withoutGlobalScopes()->find($id);
                if(isset($song->id)){
                    $lyricist->genre = implode(',', $this->request->input('genre'));
                    $lyricist->save();
                }
            }
            return redirect()->route('backend.lyricists')->with('status', 'success')->with('message', 'Lyricists successfully saved!');
        } elseif($this->request->input('action') == 'add_mood') {
            $message = 'Add mood';
            $subMessage = 'Add Mood for Chosen Lyricists (<strong>' . count($this->request->input('ids')) . '</strong>)';
            return view('backend.commons.mass_mood')
                ->with('message', $message)
                ->with('subMessage', $subMessage)
                ->with('action', $this->request->input('action'))
                ->with('ids', $this->request->input('ids'));
        } else if($this->request->input('action') == 'save_add_mood') {
            $ids = $this->request->input('ids');
            foreach($ids as $id) {
                $lyricist = Lyricist::withoutGlobalScopes()->find($id);
                if(isset($song->id)){
                    $currentMood = explode(',', $song->mood);
                    $newMood = array_unique(array_merge($currentMood, $this->request->input('mood')));
                    $lyricist->mood = implode(',', $newMood);
                    $lyricist->save();
                }
            }
            return redirect()->route('backend.lyricists')->with('status', 'success')->with('message', 'Lyricists successfully saved!');
        } elseif($this->request->input('action') == 'change_mood') {
            $message = 'Change mood';
            $subMessage = 'Change Mood for Chosen Lyricists (<strong>' . count($this->request->input('ids')) . '</strong>)';
            return view('backend.commons.mass_mood')
                ->with('message', $message)
                ->with('subMessage', $subMessage)
                ->with('action', $this->request->input('action'))
                ->with('ids', $this->request->input('ids'));
        } else if($this->request->input('action') == 'save_change_mood') {
            $ids = $this->request->input('ids');
            foreach($ids as $id) {
                $lyricist = Lyricist::withoutGlobalScopes()->find($id);
                if(isset($song->id)){
                    $lyricist->mood = implode(',', $this->request->input('mood'));
                    $lyricist->save();
                }
            }
            return redirect()->route('backend.lyricists')->with('status', 'success')->with('message', 'Lyricists successfully saved!');
        } else if($this->request->input('action') == 'comments') {
            $ids = $this->request->input('ids');
            foreach($ids as $id) {
                $artist = Lyricist::withoutGlobalScopes()->find($id);
                if(isset($song->id)){
                    $song->allow_comments = 1;
                    $song->save();
                }
            }
            return redirect()->route('backend.artists')->with('status', 'success')->with('message', 'Lyricists successfully saved!');
        } else if($this->request->input('action') == 'not_comments') {
            $ids = $this->request->input('ids');
            foreach($ids as $id) {
                $artist = Lyricist::withoutGlobalScopes()->find($id);
                if(isset($artist->id)){
                    $artist->allow_comments = 0;
                    $artist->save();
                }
            }
            return redirect()->route('backend.artists')->with('status', 'success')->with('message', 'Lyricists successfully saved!');
        } else if($this->request->input('action') == 'delete') {
            $ids = $this->request->input('ids');
            foreach($ids as $id) {
                $artist = Lyricist::withoutGlobalScopes()->where('id', $id)->first();
                $artist->delete();
            }
            return redirect()->route('backend.artists')->with('status', 'success')->with('message', 'Lyricists successfully deleted!');
        }
    }
}