const REFERER_RULES = [
  {
    domain: "cxqjgs.dcyun.com:38120",      // 目标域名（发起请求的域名）
    referer: "https://cxqjgs.dcyun.com:38120"  // 要设置的 Referer
  }
];

// 为每个规则生成唯一 ID（避免冲突）
function generateRuleId(index) {
  return index + 1;
}

// 动态更新规则
function updateRefererRules() {
  const rules = REFERER_RULES.map((rule, index) => ({
    "id": generateRuleId(index),
    "priority": 1,
    "action": {
      "type": "modifyHeaders",
      "requestHeaders": [{
        "header": "Referer",
        "operation": "set",
        "value": rule.referer
      }]
    },
    "condition": {
      "urlFilter": `||${rule.domain}/*`, // 仅匹配目标域名
      "resourceTypes": [
        "main_frame",
        "sub_frame",
        "xmlhttprequest",
      ]
    }
  }));

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: REFERER_RULES.map((_, index) => generateRuleId(index)),
    addRules: rules
  });

  // 在 updateRefererRules() 函数末尾添加：
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    console.log("当前生效的规则：", rules);
  });

  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
    console.log("规则匹配详情：", info);
    console.log("Matched request type:", info.request.type);
  });
}

// 初始化规则
chrome.runtime.onInstalled.addListener(() => {
  updateRefererRules();
  chrome.declarativeNetRequest.getDynamicRules(console.log); // 直接打印
});