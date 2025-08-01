// document.getElementById('saveBtn').addEventListener('click', () => {
//   const referer = document.getElementById('refererInput').value;
  
//   chrome.runtime.sendMessage(
//     { action: "updateReferer", referer },
//     (response) => {
//       if (response?.success) {
//         alert(`Referer updated to: ${referer}`);
//       }
//     }
//   );
// });

document.getElementById('reloadBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "updateRules" }, (response) => {
    alert("规则已更新！");
  });
});