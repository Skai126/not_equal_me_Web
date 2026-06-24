# STYLEGUIDE — ノイミー\_Web

このスタイルガイドは実装可能な最小限のデザインシステムを提供します。

## 使い方

<head>に以下を追加:

<link rel="stylesheet" href="css/design-system.css">

## カラーパレット

- Accent: --accent — 使いどころ: CTA, 強調
- Accent-2: --accent-2 — エラーステートや強い注意
- Surface / Background: --surface / --bg
- Text / Muted: --text / --muted

WCAGコントラストに注意して、背景色と組み合わせて使用してください。

## タイポグラフィ

- H1: --fs-xxl
- H2: --fs-xl
- Body: --fs-base
- Small: --fs-sm

見出しと本文の間に十分な余白を取り、階層を明確化します。

## スペーシング

8pxベース。変数: --space-1..--space-5。

## コンポーネント例

カード:

<div class="card">
  <div class="kicker">カテゴリ</div>
  <h3>カードタイトル</h3>
  <p class="muted">説明文</p>
  <div class="row"><button class="btn btn-primary">アクション</button></div>
</div>

ボタン:

- .btn-primary: 主なCTA
- .btn-ghost: 二次アクション

## レスポンシブ

- .grid-responsive を使って自動レイアウト
- 主要レイアウトは .container で中央寄せ

## ダークモード

prefers-color-scheme による自動切替をサポートします。手動切替を追加する場合は <html data-theme="dark"> を付与してカスタマイズ可能です。

---

必要ならFigmaモックや追加コンポーネント（ナビ、検索、カードのバリエーション）を作ります。
