// Clash Party / Mihomo JavaScript override.
// Creates direct plus four selectable groups, and supplies DNS defaults.

const GROUP_NAMES = {
  telegram: "Telegram",
  google: "Google",
  meta: "Meta",
  crypto: "Crypto",
};

const DIRECT_GROUP = "直连";

const RULE_PROVIDERS = {
  private: {
    type: "http",
    behavior: "domain",
    format: "mrs",
    interval: 86400,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.mrs",
  },
  cn: {
    type: "http",
    behavior: "domain",
    format: "mrs",
    interval: 86400,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs",
  },
  "geolocation-!cn": {
    type: "http",
    behavior: "domain",
    format: "mrs",
    interval: 86400,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/geolocation-!cn.mrs",
  },
  telegram: {
    type: "http",
    behavior: "domain",
    format: "mrs",
    interval: 86400,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.mrs",
  },
  google: {
    type: "http",
    behavior: "domain",
    format: "mrs",
    interval: 86400,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.mrs",
  },
  meta: {
    type: "http",
    behavior: "domain",
    format: "mrs",
    interval: 86400,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/meta.mrs",
  },
  binance: {
    type: "http",
    behavior: "domain",
    format: "mrs",
    interval: 86400,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/binance.mrs",
  },
  bybit: {
    type: "http",
    behavior: "domain",
    format: "mrs",
    interval: 86400,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/bybit.mrs",
  },
};

const EXTRA_RULES = [
  "DOMAIN-SUFFIX,local,直连",
  "DOMAIN-SUFFIX,lan,直连",
  "DOMAIN-SUFFIX,home.arpa,直连",
  "DOMAIN-SUFFIX,msftconnecttest.com,直连",
  "DOMAIN-SUFFIX,msftncsi.com,直连",
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
];

const DNS_DEFAULTS = {
  enable: true,
  ipv6: true,
  "enhanced-mode": "fake-ip",
  "fake-ip-range": "198.18.0.1/16",
  "fake-ip-filter": [
    "*.lan",
    "*.local",
    "+.msftconnecttest.com",
    "+.msftncsi.com",
    "+.home.arpa",
  ],
  "default-nameserver": ["223.5.5.5", "119.29.29.29"],
  nameserver: ["https://doh.pub/dns-query", "https://dns.alidns.com/dns-query"],
  "proxy-server-nameserver": [
    "https://doh.pub/dns-query",
    "https://dns.alidns.com/dns-query",
  ],
  "direct-nameserver": [
    "https://doh.pub/dns-query",
    "https://dns.alidns.com/dns-query",
  ],
  "nameserver-policy": {
    "rule-set:cn": ["https://doh.pub/dns-query", "https://dns.alidns.com/dns-query"],
    "rule-set:geolocation-!cn": [
      "https://dns.google/dns-query",
      "https://cloudflare-dns.com/dns-query",
    ],
  },
};

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.slice();
  }
  if (value && typeof value === "object") {
    return { ...value };
  }
  return value;
}

function isProxyLike(entry) {
  return Boolean(
    entry &&
      typeof entry === "object" &&
      typeof entry.name === "string" &&
      entry.name &&
      typeof entry.type === "string"
  );
}

function pickDefaultProxy(config) {
  const builtins = new Set(["direct", "reject", "pass", "compatible"]);
  const groups = Array.isArray(config["proxy-groups"]) ? config["proxy-groups"] : [];

  // Reuse the provider's existing node-selection group when available.
  const existingSelect = groups.find(
    (group) =>
      group &&
      typeof group === "object" &&
      group.type === "select" &&
      typeof group.name === "string" &&
      !builtins.has(group.name.toLowerCase()) &&
      group.name !== "GLOBAL" &&
      Array.isArray(group.proxies) &&
      group.proxies.length > 0
  );
  if (existingSelect) {
    return existingSelect.name;
  }

  const proxies = Array.isArray(config.proxies) ? config.proxies.filter(isProxyLike) : [];
  return proxies.length > 0 ? proxies[0].name : "DIRECT";
}

function ensureProvider(config, name, provider) {
  config["rule-providers"] = config["rule-providers"] || {};
  if (!config["rule-providers"][name]) {
    config["rule-providers"][name] = provider;
  }
}

function ensureGroup(config, name, fallback) {
  config["proxy-groups"] = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"]
    : [];

  if (config["proxy-groups"].some((group) => group && group.name === name)) {
    return;
  }

  config["proxy-groups"].push({
    name,
    type: "select",
    proxies: fallback === "DIRECT" ? ["DIRECT"] : [fallback, "DIRECT"],
  });
}

function ensureDirectGroup(config) {
  config["proxy-groups"] = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"]
    : [];

  if (config["proxy-groups"].some((group) => group && group.name === DIRECT_GROUP)) {
    return;
  }

  config["proxy-groups"].push({
    name: DIRECT_GROUP,
    type: "select",
    proxies: ["DIRECT"],
  });
}

function ensureDns(config) {
  const dns =
    config.dns && typeof config.dns === "object" ? config.dns : {};

  // Only fill missing fields so an existing, intentional DNS setup is kept.
  for (const [key, value] of Object.entries(DNS_DEFAULTS)) {
    if (dns[key] === undefined) {
      dns[key] = cloneValue(value);
    }
  }

  if (Array.isArray(dns["fake-ip-filter"])) {
    for (const entry of DNS_DEFAULTS["fake-ip-filter"]) {
      if (!dns["fake-ip-filter"].includes(entry)) {
        dns["fake-ip-filter"].push(entry);
      }
    }
  }

  const policy = dns["nameserver-policy"];
  if (policy && typeof policy === "object" && !Array.isArray(policy)) {
    for (const [key, value] of Object.entries(DNS_DEFAULTS["nameserver-policy"])) {
      if (policy[key] === undefined) {
        policy[key] = value.slice();
      }
    }
  }

  config.dns = dns;
}

function prependRules(config, rules) {
  config.rules = Array.isArray(config.rules) ? config.rules : [];

  const matchIndex = config.rules.findIndex((rule) =>
    /^(MATCH|FINAL)\s*,/i.test(String(rule).trim())
  );
  const at = matchIndex === -1 ? config.rules.length : matchIndex;
  config.rules.splice(at, 0, ...rules);
}

function main(config) {
  if (!config || typeof config !== "object") {
    throw new Error("Invalid Clash config");
  }

  const fallback = pickDefaultProxy(config);

  for (const [key, provider] of Object.entries(RULE_PROVIDERS)) {
    ensureProvider(config, key, provider);
  }

  ensureDirectGroup(config);

  for (const name of Object.values(GROUP_NAMES)) {
    ensureGroup(config, name, fallback);
  }

  ensureDns(config);

  const providerRules = [
    "RULE-SET,private,直连",
    "RULE-SET,geolocation-!cn,__DEFAULT__",
    "RULE-SET,telegram,Telegram",
    "RULE-SET,google,Google",
    "RULE-SET,meta,Meta",
    "RULE-SET,binance,Crypto",
    "RULE-SET,bybit,Crypto",
    "RULE-SET,cn,直连",
    "GEOIP,CN,直连",
  ];

  const resolvedProviderRules = providerRules.map((rule) =>
    rule.replace("__DEFAULT__", fallback)
  );

  const directRules = [
    "IP-CIDR,127.0.0.0/8,直连,no-resolve",
    "IP-CIDR,10.0.0.0/8,直连,no-resolve",
    "IP-CIDR,172.16.0.0/12,直连,no-resolve",
    "IP-CIDR,192.168.0.0/16,直连,no-resolve",
    "IP-CIDR,169.254.0.0/16,直连,no-resolve",
    "IP-CIDR6,::1/128,直连,no-resolve",
    "IP-CIDR6,fc00::/7,直连,no-resolve",
    "IP-CIDR6,fe80::/10,直连,no-resolve",
  ];

  prependRules(config, [...directRules, ...resolvedProviderRules, ...EXTRA_RULES]);
  return config;
}
