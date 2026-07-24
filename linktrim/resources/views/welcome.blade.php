<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LinkTrim API</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #030712;
            color: #fff;
            font-family: ui-sans-serif, system-ui, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }
        h1 { font-size: 3rem; font-weight: 900; letter-spacing: -0.05em; color: #f97316; }
        p { color: #6b7280; font-size: 0.95rem; }
        a {
            margin-top: 0.5rem;
            padding: 0.5rem 1.5rem;
            border: 1px solid #f97316;
            color: #fb923c;
            border-radius: 9999px;
            text-decoration: none;
            font-size: 0.875rem;
            transition: background 0.2s, color 0.2s;
        }
        a:hover { background: #f97316; color: #000; }
    </style>
</head>
<body>
    <h1>LinkTrim</h1>
    <p>This is the API server.</p>
    <a href="{{ env('FRONTEND_URL', 'http://localhost:5173') }}">Go to the app →</a>
</body>
</html>
