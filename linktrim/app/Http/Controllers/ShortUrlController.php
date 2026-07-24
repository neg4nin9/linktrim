<?php

namespace App\Http\Controllers;

use App\Models\ShortUrl;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ShortUrlController extends Controller
{
    public function shorten(Request $request): JsonResponse
    {
        $data = $request->validate([
            'url' => ['required', 'url', 'max:2048'],
        ]);

        $parsed = parse_url($data['url']);
        $appHost = parse_url(config('app.url'), PHP_URL_HOST);

        if (isset($parsed['host']) && $parsed['host'] === $appHost) {
            $code = ltrim($parsed['path'] ?? '', '/');
            $shortUrl = ShortUrl::where('short_code', $code)->first();
            if ($shortUrl) {
                return response()->json($this->format($shortUrl));
            }
        }

        $existing = ShortUrl::where('original_url', $data['url'])->first();

        if ($existing) {
            return response()->json($this->format($existing));
        }

        try {
            $shortUrl = ShortUrl::create([
                'original_url' => $data['url'],
                'short_code'   => ShortUrl::generateUniqueCode(),
            ]);
        } catch (UniqueConstraintViolationException) {
            // Condición de carrera: otro proceso insertó la misma URL primero
            $shortUrl = ShortUrl::where('original_url', $data['url'])->firstOrFail();
        }

        return response()->json($this->format($shortUrl), 201);
    }

    public function runScheduler(Request $request): JsonResponse
    {
        if ($request->query('token') !== config('app.scheduler_token')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $deleted = ShortUrl::where(function ($q) {
            $q->whereNull('last_used_at')->where('created_at', '<', now()->subYear());
        })->orWhere('last_used_at', '<', now()->subYear())->delete();

        return response()->json(['deleted' => $deleted]);
    }

    public function redirect(string $code): RedirectResponse
    {
        $shortUrl = ShortUrl::where('short_code', $code)->firstOrFail();

        $shortUrl->update(['last_used_at' => now()]);

        return redirect()->away($shortUrl->original_url, 302);
    }

    private function format(ShortUrl $shortUrl): array
    {
        return [
            'original_url' => $shortUrl->original_url,
            'short_code'   => $shortUrl->short_code,
            'short_url'    => url($shortUrl->short_code),
        ];
    }
}
