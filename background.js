// 白名单域名列表（仅允许这些域名的请求携带 Referer）
const WHITELIST_DOMAINS = [
  "http://localhost:8080/*"
];
const DEFAULT_REFERER = "https://cxqjgs.dcyun.com:38120";

// 动态规则ID（避免冲突）
const RULE_ID = 1;

// 初始化规则
chrome.runtime.onInstalled.addListener(() => {
  updateRefererRule(DEFAULT_REFERER);
});

// 更新规则函数
function updateRefererRule(newReferer) {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: [{
      "id": RULE_ID,
      "priority": 1,
      "action": {
        "type": "modifyHeaders",
        "requestHeaders": [
          {
            "header": "Referer",
            "operation": "set",
            "value": newReferer
          }
        ]
      },
      "condition": {
        "urlFilter": "|http*",
        "resourceTypes": [
          "main_frame",
          "sub_frame",
          "xmlhttprequest", // 替换原来的 "fetch"
          "script",        // 可选：覆盖脚本请求
          "image"          // 可选：覆盖图片请求
        ],
        "excludedInitiatorDomains": WHITELIST_DOMAINS // 仅对非白名单域名生效
      }
    }]
  });
}

// 接收来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateReferer") {
    updateRefererRule(request.referer);
    sendResponse({ success: true });
  }
});