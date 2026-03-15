# WordPress（GeneratePress）カスタムテーマファイル

## 適用手順

### 1. カスタムCSS
`style.css` の内容を以下に貼り付け：
- **外観 → カスタマイズ → 追加CSS**

### 2. functions.php
`functions.php` の内容を以下の末尾に追記：
- **外観 → テーマファイルエディタ → functions.php**

追記前に必ずバックアップを取ってください。

### 3. 各ページのHTML
固定ページを作成し、「カスタムHTML」ブロックに対応する `.html` ファイルの内容を貼り付け：

| ファイル | ページ | スラッグ |
|---|---|---|
| `page-home.html` | トップページ | `home` |
| `page-service.html` | サービス紹介 | `service` |
| `page-company.html` | 会社概要 | `company` |
| `page-contact.html` | お問い合わせ | `contact` |
| `page-blog.html` | ブログ・資料一覧 | `blog` |

### 4. Contact Form 7
1. CF7プラグインをインストール
2. `page-contact.html` 内のコメントにあるフォームテンプレートをCF7の編集画面に貼り付け
3. `[contact-form-7 id="YOUR_FORM_ID"]` を実際のフォームIDに書き換え

### 5. GeneratePress設定
- **外観 → カスタマイズ → レイアウト → コンテナ**: 幅を `1152px` に設定
- **外観 → カスタマイズ → タイポグラフィ**: Noto Sans JP を選択
- 固定ページのテンプレートは「全幅」に設定

### 6. 画像の差し替え
HTMLテンプレート内の `/wp-content/uploads/` パスの画像を、
実際にアップロードした画像のURLに書き換えてください。
