<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\Album;
use DB;
use View;

class AlbumsController
{
    private $request;
    private $albums;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function index()
    {
        $this->albums = Album::paginate(20);

        if($this->request->is('api*') || $this->request->wantsJson())
        {

            return response()->json($this->albums);
        }

        $view = View::make('albums.index')
            ->with('albums',  $this->albums);

        if($this->request->ajax()) {
            $sections = $view->renderSections();
            return $sections['content'];
        }

        getMetatags();

        return $view;
    }
}