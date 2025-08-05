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
      // Manifest V3 支持的 resourceTypes 列表
      // 1.main_frame
      //    - 顶级页面（如浏览器标签页中直接加载的 HTML 文档）。
      // 2.sub_frame
      //    - 嵌套框架（如 `<iframe>` 或 `<frame>` 加载的内容）。
      // 3.stylesheet
      //    - CSS 样式表（通过 `<link rel="stylesheet">` 加载）。
      // 4.script
      //    - JavaScript 文件（通过 `<script>` 标签或 Worker 加载）。
      // 5.image
      //    - 图片资源（`<img>` 标签或 CSS 背景图）。
      // 6.font
      //    - 网页字体（通过 `@font-face` 加载）。
      // 7.object
      //    - 插件资源（如 `<object>` 或 `<embed>` 加载的内容）。
      // 8.xmlhttprequest
      //    - 通过 `XMLHttpRequest` 或 `fetch()` 发起的请求（但部分 `fetch` 请求可能无法拦截）。
      // 9.ping
      //    - 超链接的 `ping` 属性触发的请求（用于跟踪点击）。
      // 10.csp_report
      //     - 违反内容安全策略（CSP）时发送的报告请求。
      // 11.media
      //     - 音视频资源（`<video>` 或 `<audio>` 标签）。
      // 12.websocket
      //     - WebSocket 连接请求。
      // 13.webtransport
      //     - WebTransport API 发起的请求。
      // 14.other
      //     - 其他未分类的请求类型（如 Beacon API、预加载请求等）。
      "resourceTypes": ["xmlhttprequest"]
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