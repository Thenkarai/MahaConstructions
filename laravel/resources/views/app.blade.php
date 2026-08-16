<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Maha Construction | Premium Luxury Architectural Masterpieces</title>
    <meta name="description" content="Maha Construction is an enterprise-grade builder of bespoke luxury villas, organic residences, and iconic commercial towers designed with materials integrity." />
    @if(file_exists(public_path('assets')))
      @foreach(scandir(public_path('assets')) as $file)
        @if(str_ends_with($file, '.css'))
          <link rel="stylesheet" href="{{ asset('assets/' . $file) }}">
        @endif
      @endforeach
      @foreach(scandir(public_path('assets')) as $file)
        @if(str_ends_with($file, '.js'))
          <script type="module" src="{{ asset('assets/' . $file) }}"></script>
        @endif
      @endforeach
    @endif
  </head>
  <body class="bg-[#F8F8F8] text-[#071B35]">
    <div id="root"></div>
  </body>
</html>
