# Clash Party Override

Clash Party / Mihomo JavaScript override for direct traffic, DNS defaults, and
four selectable service groups:

| Group | Covered services |
| --- | --- |
| 直连 | Private/LAN addresses and mainland China domains (GEOIP CN fallback) |
| Telegram | Telegram |
| Google | Google |
| Meta | Facebook, Instagram, Threads, WhatsApp, Messenger, Oculus, Meta AI, Muse |
| Crypto | Binance, Bybit, OKX, Coinbase, Kraken, Gate, Bitget, HTX, KuCoin, MEXC, CoinGecko, CoinMarketCap |
| AI | Gemini, Grok, ChatGPT/OpenAI, Claude/Anthropic |

## Usage

1. Open Clash Party.
2. Go to the JavaScript override editor.
3. Paste the contents of [`clash-override.js`](clash-override.js).
4. Save and apply the configuration.

The override detects an existing `select` proxy group and reuses it as the
default target. You can choose another node for each group in Clash Party.

## Direct and DNS

- Adds a `直连` group that always contains `DIRECT`.
- Sends local, LAN, and mainland China traffic to `直连`.
- Sends other overseas domains to the existing node-selection group, or the
  first available proxy when no selection group exists.
- Fills missing DNS fields with fake-ip mode, domestic DoH for local resolution,
  and overseas DoH rules for non-China domains.
- Keeps any existing DNS fields and only adds defaults that are absent.
- Each service group contains `节点选择`, every individual node, and `DIRECT`.
- The `直连` group is kept at the bottom of the proxy-group list.
- Does not create automatic-test, fallback, or country/region proxy groups.

## Rule providers

The domain rules use the public
[MetaCubeX/meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat)
`.mrs` rule sets:

- `telegram`
- `google`
- `meta`
- `binance`
- `bybit`
- `private`
- `cn`
- `geolocation-!cn`

## Requirements

- Clash Party, or another Mihomo-compatible client with JavaScript override
  support.
- A configuration containing at least one proxy, or an existing proxy group.

## License

MIT
