// Clash Party / Mihomo JavaScript override.
// Creates four selectable groups: Telegram, Google, Meta, Crypto.

const GROUP_NAMES = {
  telegram: "Telegram",
  google: "Google",
  meta: "Meta",
  crypto: "Crypto",
};

const RULE_PROVIDERS = {
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

  for (const name of Object.values(GROUP_NAMES)) {
    ensureGroup(config, name, fallback);
  }

  const providerRules = [
    "RULE-SET,telegram,Telegram",
    "RULE-SET,google,Google",
    "RULE-SET,meta,Meta",
    "RULE-SET,binance,Crypto",
    "RULE-SET,bybit,Crypto",
  ];

  prependRules(config, [...providerRules, ...EXTRA_RULES]);
  return config;
}
