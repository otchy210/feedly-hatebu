document.addEventListener('click', (e) => {
    if (e.target.id == 'save') {
        chrome.storage.sync.set({'showAfterTitle': document.getElementById('showAfterTitle').checked});
    }
});
document.addEventListener('DOMContentLoaded', (e) => {
    chrome.storage.sync.get('showAfterTitle', (v) => {
        if (v.showAfterTitle) {
            document.getElementById('showAfterTitle').checked = true;
        }
    });
});
