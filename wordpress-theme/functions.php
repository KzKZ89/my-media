/**
 * COuld inc - functions.php 追記用コード
 * 「外観」→「テーマファイルエディタ」→ functions.php の末尾に追加
 */

// ── Noto Sans JP を読み込み ──
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style(
        'google-fonts-noto',
        'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap',
        [],
        null
    );
});

// ── REST API の CORS 設定（my-media からのアクセスを許可） ──
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $origin = get_http_origin();
        $allowed = [
            'https://my-media.vercel.app',
            'http://localhost:3000',
        ];
        if (in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
        }
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
});

// ── ISR オンデマンド再検証エンドポイント ──
add_action('rest_api_init', function () {
    register_rest_route('could/v1', '/revalidate', [
        'methods'  => 'POST',
        'callback' => function ($request) {
            $secret = $request->get_param('secret');
            if ($secret !== get_option('revalidate_secret', '')) {
                return new WP_Error('forbidden', 'Invalid secret', ['status' => 403]);
            }
            $tag  = sanitize_text_field($request->get_param('tag') ?? 'posts');
            $url  = 'https://my-media.vercel.app/api/revalidate?' . http_build_query([
                'secret' => $secret,
                'tag'    => $tag,
            ]);
            $response = wp_remote_post($url, ['timeout' => 10]);
            if (is_wp_error($response)) {
                return $response;
            }
            return ['revalidated' => true, 'tag' => $tag];
        },
        'permission_callback' => '__return_true',
    ]);
});

// ── 記事公開・更新時に自動再検証 ──
add_action('publish_post', function ($post_id) {
    $secret = get_option('revalidate_secret', '');
    if (empty($secret)) return;

    $post = get_post($post_id);
    $tags  = ['posts', 'post-' . $post->post_name];

    foreach ($tags as $tag) {
        wp_remote_post('https://my-media.vercel.app/api/revalidate?' . http_build_query([
            'secret' => $secret,
            'tag'    => $tag,
        ]), ['timeout' => 5, 'blocking' => false]);
    }
});

// ── アイキャッチ画像をREST APIで常に返す ──
add_action('after_setup_theme', function () {
    add_theme_support('post-thumbnails');
});

// ── 抜粋の文字数を調整 ──
add_filter('excerpt_length', function () {
    return 80;
});
add_filter('excerpt_more', function () {
    return '...';
});
