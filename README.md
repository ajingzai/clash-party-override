# Clash Party Override

Clash Party / Mihomo JavaScript override for four selectable proxy groups:

| Group | Covered services |
| --- | --- |
| Telegram | Telegram |
| Google | Google |
| Meta | Facebook, Instagram, Threads, WhatsApp, Messenger, Oculus, Meta AI, Muse |
| Crypto | Binance, Bybit, OKX, Coinbase, Kraken, Gate, Bitget, HTX, KuCoin, MEXC, CoinGecko, CoinMarketCap |

## Usage

1. Open Clash Party.
2. Go to the JavaScript override editor.
3. Paste the contents of [`clash-override.js`](clash-override.js).
4. Save and apply the configuration.

The override detects an existing `select` proxy group and reuses it as the
default target. You can choose another node for each group in Clash Party.

## Rule providers

The domain rules use the public
[MetaCubeX/meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat)
`.mrs` rule sets:

- `telegram`
- `google`
- `meta`
- `binance`
- `bybit`

## Requirements

- Clash Party, or another Mihomo-compatible client with JavaScript override
  support.
- A configuration containing at least one proxy, or an existing proxy group.

## License

MIT
