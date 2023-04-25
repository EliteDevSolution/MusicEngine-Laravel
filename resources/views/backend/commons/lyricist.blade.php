@foreach ($lyricists as $index => $lyricist)
<tr>
    <td class="td-image"><div class="play" data-id="{{ $lyricist->id }}" data-type="lyricist">
            <img src="{{ $lyricist->artwork_url }}"/>
        </div>
    </td>
    <td><a href="{{ route('backend.lyricists.edit', ['id' => $lyricist->id]) }}">{!! $lyricist->name !!}</a></td>
    <td class="desktop">@foreach($lyricist->genres as $genre)<a href="{{ route('backend.genres.edit', ['id' => $genre->id]) }}" title="{{ $genre->name }}">{{$genre->name}}</a>@if(!$loop->last), @endif @endforeach</td>
    <td class="desktop">@foreach($lyricist->moods as $mood)<a href="{{ route('backend.moods.edit', ['id' => $mood->id]) }}" title="{{ $mood->name }}">{{$mood->name}}</a>@if(!$loop->last), @endif @endforeach</td>
    <td class="desktop text-center">{{ $lyricist->song_count }}</td>
    <td class="desktop text-center">{{ $lyricist->album_count }}</td>
    <td class="desktop text-center">{{ $lyricist->comment_count }}</td>
    <td>
        <a class="row-button edit" href="{{ route('backend.lyricists.edit', ['id' => $lyricist->id]) }}"><i class="fas fa-fw fa-edit"></i></a>
        <a class="row-button delete" onclick="return confirm('By deleting this lyricist, all song which linked to this lyricist will be deleted, Are you sure want to delete this lyricist?');" href="{{ route('backend.lyricists.delete', ['id' => $lyricist->id]) }}"><i class="fas fa-fw fa-trash"></i></a>
    </td>
    <td>
        <label class="engine-checkbox">
            <input name="ids[]" class="multi-check-box" type="checkbox" value="{{ $lyricist->id }}">
            <span class="checkmark"></span>
        </label>
    </td>
</tr>
@endforeach