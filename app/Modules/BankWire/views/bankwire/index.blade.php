<!DOCTYPE html>
<html>
<link href="{{ asset('backend/css/style.css') }}" rel="stylesheet">
<style>
    body {
        background: black;
    }
    .card-header {
    }
    .card {
    }
    button {
        background: #F0D68B !important;
        border-color: #F0D68B !important;
        color: black !important;
    }
</style>
<body>
<div class="d-flex justify-content-center align-content-center mt-5">
    <svg fill="white" width="108px" height="108px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 490 490" xml:space="preserve">
        <polygon points="474.417,143.926 245.384,0 15.583,143.711 31.865,169.722 245.353,36.246 458.073,169.922 	"/>
        <rect x="376.297" y="183.073" width="30.691" height="240.45"/>
        <rect x="229.654" y="183.073" width="30.691" height="240.45"/>
        <rect x="83.012" y="183.073" width="30.691" height="240.45"/>
        <rect x="25.021" y="459.309" width="439.943" height="30.691"/>
    </svg>
</div>
<div class='container d-flex justify-content-center align-items-center mt-5'>
    <div class="card" style='min-width: 350px; max-width: 400px'>
        <div class="card-body">
            @if (session('status') && session('status') == 'success')
                <div class="alert alert-success">
                    {{ session('message') }}
                </div>
            @elseif (session('status') && session('status') == 'failed')
                <div class="alert alert-danger">
                    {{ session('message') }}
                </div>
            @endif
            <form method="post" action="{{ $formUrl }}" enctype="multipart/form-data">
                @csrf
                <div class="form-group">
                    <label>Please upload your bank transaction documentation</label>
                    <input type="file" name="artwork" class="form-control" id="form-group" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Submit</button>
            </form>
        </div>
    </div>
</div>
</body>
</html>