// Clash Party / Mihomo JavaScript override.
// Adds direct plus four service groups, using isolated cp-* providers.

const GROUPS = {
  select: "节点选择",
  direct: "直连",
  telegram: "Telegram",
  google: "Google",
  meta: "Meta",
  crypto: "Crypto",
  ai: "AI",
};

const ICON_ROOT =
  "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color";

const ICONS = {
  select: `${ICON_ROOT}/Proxy.png`,
  direct: `${ICON_ROOT}/Direct.png`,
  telegram: `${ICON_ROOT}/Telegram.png`,
  google: `${ICON_ROOT}/Google.png`,
  meta: `${ICON_ROOT}/Facebook.png`,
  crypto: `${ICON_ROOT}/Cryptocurrency_1.png`,
  ai: `${ICON_ROOT}/ChatGPT.png`,
};

const PROVIDER_ROOT =
  "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite";

function ruleProvider(name) {
  return {
    type: "http",
    behavior: "domain",
    format: "mrs",
    interval: 86400,
    url: `${PROVIDER_ROOT}/${name}.mrs`,
  };
}

const PROVIDER_NAMES = [
  "private",
  "cn",
  "geolocation-!cn",
  "telegram",
  "google",
  "meta",
  "binance",
  "bybit",
  "category-cryptocurrency",
  "category-ai-!cn",
  "openai",
  "google-gemini",
  "anthropic",
  "xai",
];

const PROVIDERS = Object.fromEntries(
  PROVIDER_NAMES.map((name) => [`cp-${name}`, ruleProvider(name)])
);

const EXTRA_RULES = [
  "DOMAIN-SUFFIX,local,DIRECT",
  "DOMAIN-SUFFIX,lan,DIRECT",
  "DOMAIN-SUFFIX,home.arpa,DIRECT",
  "DOMAIN-SUFFIX,msftconnecttest.com,DIRECT",
  "DOMAIN-SUFFIX,msftncsi.com,DIRECT",
  "DOMAIN-SUFFIX,facebook.com,Meta",
  "DOMAIN-SUFFIX,fb.com,Meta",
  "DOMAIN-SUFFIX,instagram.com,Meta",
  "DOMAIN-SUFFIX,threads.net,Meta",
  "DOMAIN-SUFFIX,whatsapp.com,Meta",
  "DOMAIN-SUFFIX,whatsapp.net,Meta",
  "DOMAIN-SUFFIX,messenger.com,Meta",
  "DOMAIN-SUFFIX,oculus.com,Meta",
  "DOMAIN-SUFFIX,meta.com,Meta",
  "DOMAIN-SUFFIX,binance.com,Crypto",
  "DOMAIN-SUFFIX,binance.us,Crypto",
  "DOMAIN-SUFFIX,bnbstatic.com,Crypto",
  "DOMAIN-SUFFIX,bybit.com,Crypto",
  "DOMAIN-SUFFIX,bybit-exchange.com,Crypto",
  "DOMAIN-SUFFIX,okx.com,Crypto",
  "DOMAIN-SUFFIX,coinbase.com,Crypto",
  "DOMAIN-SUFFIX,kraken.com,Crypto",
  "DOMAIN-SUFFIX,gate.io,Crypto",
  "DOMAIN-SUFFIX,bitget.com,Crypto",
  "DOMAIN-SUFFIX,huobi.com,Crypto",
  "DOMAIN-SUFFIX,htx.com,Crypto",
  "DOMAIN-SUFFIX,kucoin.com,Crypto",
  "DOMAIN-SUFFIX,mexc.com,Crypto",
  "DOMAIN-SUFFIX,coingecko.com,Crypto",
  "DOMAIN-SUFFIX,coinmarketcap.com,Crypto",
  "DOMAIN-SUFFIX,chatgpt.com,AI",
  "DOMAIN-SUFFIX,openai.com,AI",
  "DOMAIN-SUFFIX,oaistatic.com,AI",
  "DOMAIN-SUFFIX,oaiusercontent.com,AI",
  "DOMAIN-SUFFIX,gemini.google.com,AI",
  "DOMAIN-SUFFIX,ai.google.dev,AI",
  "DOMAIN-SUFFIX,bard.google.com,AI",
  "DOMAIN-SUFFIX,anthropic.com,AI",
  "DOMAIN-SUFFIX,claude.ai,AI",
  "DOMAIN-SUFFIX,claude.com,AI",
  "DOMAIN-SUFFIX,grok.com,AI",
  "DOMAIN-SUFFIX,x.ai,AI",
];

const DNS_DEFAULTS = {
  enable: true,
  ipv6: true,
  "prefer-h3": true,
  "enhanced-mode": "fake-ip",
  "fake-ip-range": "198.18.0.1/16",
  "fake-ip-filter": [
    "geosite:connectivity-check",
    "Mijia Cloud",
    "dig.io.mi.com",
    "localhost.ptlogin2.qq.com",
    "*.icloud.com",
    "*.stun.*.*",
    "*.stun.*.*.*",
    "*.lan",
    "*.localdomain",
    "*.example",
    "*.invalid",
    "*.localhost",
    "*.test",
    "*.local",
    "*.home.arpa",
    "time.*.com",
    "time.*.gov",
    "time.*.edu.cn",
    "time.*.apple.com",
    "ntp.*.com",
    "*.ntp.org.cn",
    "+.pool.ntp.org",
    "stun.*.*",
    "stun.*.*.*",
    "swscan.apple.com",
    "mesu.apple.com",
    "*.music.163.com",
    "*.126.net",
    "musicapi.taihe.com",
    "music.taihe.com",
    "songsearch.kugou.com",
    "trackercdn.kugou.com",
    "*.kuwo.cn",
    "y.qq.com",
    "*.y.qq.com",
    "*.msftconnecttest.com",
    "*.msftncsi.com",
    "*.music.migu.cn",
    "*.xboxlive.com",
    "xbox.*.*.microsoft.com",
    "*.ipv6.microsoft.com",
    "www.douyu.com",
    "activityapi.huya.com",
    "www.bilibili.com",
    "api.bilibili.com",
  ],
  "default-nameserver": ["223.5.5.5", "119.29.29.29"],
  nameserver: ["system", "223.5.5.5", "119.29.29.29", "180.184.1.1"],
  fallback: [
    "quic://dns0.eu",
    "https://dns.cloudflare.com/dns-query",
    "https://dns.sb/dns-query",
    "tcp://208.67.222.222",
    "tcp://8.26.56.2",
  ],
  "proxy-server-nameserver": [
    "https://doh.pub/dns-query",
    "https://dns.alidns.com/dns-query",
  ],
  "direct-nameserver": [
    "https://doh.pub/dns-query",
    "https://dns.alidns.com/dns-query",
  ],
  "nameserver-policy": {
    "rule-set:cp-cn": [
      "https://doh.pub/dns-query",
      "https://dns.alidns.com/dns-query",
    ],
    "rule-set:cp-geolocation-!cn": [
      "https://dns.google/dns-query",
      "https://cloudflare-dns.com/dns-query",
    ],
  },
};

function clone(value) {
  if (Array.isArray(value)) return value.slice();
  if (value && typeof value === "object") return { ...value };
  return value;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function groupsOf(config) {
  config["proxy-groups"] = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"]
    : [];
  return config["proxy-groups"];
}

function findSelector(config) {
  const reserved = new Set(Object.values(GROUPS));
  return groupsOf(config).find(
    (group) =>
      group &&
      group.type === "select" &&
      typeof group.name === "string" &&
      !reserved.has(group.name) &&
      !["direct", "reject", "pass", "global"].includes(
        group.name.toLowerCase()
      ) &&
      Array.isArray(group.proxies) &&
      group.proxies.length > 0
  );
}

function ensureGroup(config, name, icon, proxies, replaceProxies = false) {
  const group = groupsOf(config).find((item) => item && item.name === name);
  if (group) {
    if (!group.icon) group.icon = icon;
    if (replaceProxies) group.proxies = unique(proxies);
    return;
  }

  groupsOf(config).push({
    name,
    type: "select",
    icon,
    proxies: unique(proxies),
  });
}

function ensureProviders(config) {
  config["rule-providers"] =
    config["rule-providers"] && typeof config["rule-providers"] === "object"
      ? config["rule-providers"]
      : {};

  for (const [name, provider] of Object.entries(PROVIDERS)) {
    if (!config["rule-providers"][name]) {
      config["rule-providers"][name] = clone(provider);
    }
  }
}

function ensureDns(config) {
  config.dns = config.dns && typeof config.dns === "object" ? config.dns : {};
  const dns = config.dns;

  for (const [key, value] of Object.entries(DNS_DEFAULTS)) {
    if (dns[key] === undefined) dns[key] = clone(value);
  }

  if (Array.isArray(dns["fake-ip-filter"])) {
    for (const item of DNS_DEFAULTS["fake-ip-filter"]) {
      if (!dns["fake-ip-filter"].includes(item)) {
        dns["fake-ip-filter"].push(item);
      }
    }
  }

  if (
    dns["nameserver-policy"] &&
    typeof dns["nameserver-policy"] === "object" &&
    !Array.isArray(dns["nameserver-policy"])
  ) {
    for (const [key, value] of Object.entries(
      DNS_DEFAULTS["nameserver-policy"]
    )) {
      if (dns["nameserver-policy"][key] === undefined) {
        dns["nameserver-policy"][key] = value.slice();
      }
    }
  }
}

function replaceRules(config, rules) {
  config.rules = Array.isArray(config.rules) ? config.rules : [];

  const keys = new Set(
    rules.map((rule) => String(rule).split(",").slice(0, 2).join(","))
  );
  const kept = config.rules.filter((rule) => {
    const text = String(rule).trim();
    if (/^(MATCH|FINAL)\s*,/i.test(text)) return false;
    return !keys.has(text.split(",").slice(0, 2).join(","));
  });

  config.rules = [...kept, ...rules];
}

function main(config) {
  if (!config || typeof config !== "object") {
    throw new Error("Invalid Clash config");
  }

  ensureProviders(config);
  ensureDns(config);

  const proxyNames = Array.isArray(config.proxies)
    ? unique(
        config.proxies
          .filter((item) => item && item.name && item.type !== "tailscale")
          .map((item) => item.name)
      )
    : [];

  // Keep every usable node in one manual selection group. Service groups point
  // to this group instead of falling back to the first node only.
  ensureGroup(
    config,
    GROUPS.select,
    ICONS.select,
    proxyNames.length > 0 ? [...proxyNames, "DIRECT"] : ["DIRECT"]
  );

  ensureGroup(
    config,
    GROUPS.direct,
    ICONS.direct,
    ["DIRECT"]
  );

  // Service groups expose every node directly, so each service can be
  // switched independently without opening the nested node-selection group.
  const candidates = [GROUPS.select, GROUPS.direct];

  for (const key of ["telegram", "google", "meta", "crypto"]) {
    ensureGroup(config, GROUPS[key], ICONS[key], candidates, true);
  }
  ensureGroup(config, GROUPS.ai, ICONS.ai, [GROUPS.select, GROUPS.direct], true);

  const rules = [
    "AND,((DST-PORT,443),(NETWORK,UDP)),REJECT",
    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",
    "IP-CIDR,169.254.0.0/16,DIRECT,no-resolve",
    "IP-CIDR6,::1/128,DIRECT,no-resolve",
    "IP-CIDR6,fc00::/7,DIRECT,no-resolve",
    "IP-CIDR6,fe80::/10,DIRECT,no-resolve",
    "GEOIP,private,DIRECT,no-resolve",
    "RULE-SET,cp-private,直连",
    "RULE-SET,cp-category-ai-!cn,AI",
    "RULE-SET,cp-openai,AI",
    "RULE-SET,cp-google-gemini,AI",
    "RULE-SET,cp-anthropic,AI",
    "RULE-SET,cp-xai,AI",
    "DOMAIN-SUFFIX,chatgpt.com,AI",
    "DOMAIN-SUFFIX,openai.com,AI",
    "DOMAIN-SUFFIX,oaistatic.com,AI",
    "DOMAIN-SUFFIX,oaiusercontent.com,AI",
    "DOMAIN-SUFFIX,gemini.google.com,AI",
    "DOMAIN-SUFFIX,ai.google.dev,AI",
    "DOMAIN-SUFFIX,bard.google.com,AI",
    "DOMAIN-SUFFIX,anthropic.com,AI",
    "DOMAIN-SUFFIX,claude.ai,AI",
    "DOMAIN-SUFFIX,claude.com,AI",
    "DOMAIN-SUFFIX,grok.com,AI",
    "DOMAIN-SUFFIX,x.ai,AI",
    "RULE-SET,cp-telegram,Telegram",
    "RULE-SET,cp-google,Google",
    "RULE-SET,cp-meta,Meta",
    "RULE-SET,cp-binance,Crypto",
    "RULE-SET,cp-bybit,Crypto",
    "RULE-SET,cp-category-cryptocurrency,Crypto",
    ...EXTRA_RULES,
    "RULE-SET,cp-geolocation-!cn,节点选择",
    "RULE-SET,cp-cn,直连",
    "GEOIP,CN,直连",
    "MATCH,节点选择",
  ];

  replaceRules(config, rules);
  return config;
}
