@extends('backend.index')
@section('content')
    <ol class="breadcrumb">
        <li class="breadcrumb-item">
            <a href="{{ config('settings.admin_path') }}">Control Panel</a>
        </li>
        <li class="breadcrumb-item active">Appearance</li>
    </ol>
    <div class="row">
        <div class="col-lg-12">
            <div class="card mb-4 py-3 border-left-info">
                <div class="card-body">
                    Configure Appearance
                </div>
            </div>
            <form method="post" action="" enctype="multipart/form-data">
                @csrf
                <div class="row">
                    <div class="col-lg-12">
                        <div class="form-group row border-bottom mb-0 pt-3 pb-3">
                            <label class="col-sm-8 mb-0">Skin Template
                                <p class="small mb-0">Set the default theme for your site.</p>
                            </label>
                            <div class="col-sm-4">
                                {!! makeDropDown($skins, "save_con[skin]", config('settings.skin') ) !!}
                            </div>
                        </div>
                        <div class="form-group row border-bottom mb-0 pt-3 pb-3">
                            <label class="col-sm-8 mb-0">Color scheme
                                <p class="small mb-0">Set color scheme of the theme, it can be dark or light.</p>
                            </label>
                            <div class="col-sm-4">
                                {!! makeDropDown(array(0 => 'Light Mode', 1 => 'Dark Mode'), "save_con[dark_mode]", config('settings.dark_mode', true) ) !!}
                            </div>
                        </div>
                        <div class="form-group row border-bottom mb-0 pt-3 pb-3">
                            <label class="col-sm-8 mb-0">Favicon
                                <p class="small mb-0">Set the site's favicon to a square image with a minimum resolution of 64x64.</p>
                            </label>
                            <div class="col-sm-4">
                                <div class="input-group col-xs-12">
                                    <input type="file" name="favicon" class="file-selector" accept="image/*">
                                    <span class="input-group-addon"><i class="fas fa-fw fa-image"></i></span>
                                    <input type="text" class="form-control input-lg" disabled placeholder="Upload Image">
                                    <span class="input-group-btn">
                                            <button class="browse btn btn-primary input-lg" type="button"><i class="fas fa-fw fa-image"></i> Browse</button>
                                        </span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group row border-bottom mb-0 pt-3 pb-3">
                            <label class="col-sm-8 mb-0">Logo
                                <p class="small mb-0">Set the site's logo to a square image with a minimum resolution of 256x256.</p>
                            </label>
                            <div class="col-sm-4">
                                <div class="input-group col-xs-12">
                                    <input type="file" name="logo" class="file-selector" accept="image/*">
                                    <span class="input-group-addon"><i class="fas fa-fw fa-image"></i></span>
                                    <input type="text" class="form-control input-lg" disabled placeholder="Upload Image">
                                    <span class="input-group-btn">
                                            <button class="browse btn btn-primary input-lg" type="button"><i class="fas fa-fw fa-image"></i> Browse</button>
                                        </span>
                                </div>
                            </div>
                        </div>
                        <p class="mt-4 font-weight-bold text-danger">Make certain to clear your browser cache after altering the design settings.</p>
                    </div>
                </div>
                <div class="mt-3 clearfix">
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </form>
        </div>
    </div>
@endsection
