import { sendMessage } from './common';

const jsonpScript = document.createElement('script');
const jsonpCallbackName = 'feedlyHatebuJsonpCallback';
const jsonpResultIdPrefix = 'feedlyHatebuResult'
jsonpScript.innerHTML = `
const ${jsonpCallbackName} = (json) => {
    if (!json) {
        return;
    }
    const resultScript = document.getElementById(\`${jsonpResultIdPrefix}-\${json.requested_url}\`);
    resultScript.innerHTML = JSON.stringify(json);
};
`;
document.head.appendChild(jsonpScript);

const waitFor = (msec) => {
    return new Promise(resolve => {
        setTimeout(resolve, msec);
    });
}

const awaitResult = async (url) => {
    const timeout = 1200;
    let msec = 100;
    while (true) {
        await waitFor(msec);
        const resultNode = document.getElementById(`${jsonpResultIdPrefix}-${url}`);
        if (resultNode?.innerHTML?.length > 0) {
            return JSON.parse(resultNode.innerHTML);
        } else if (msec > timeout) {
            return false;
        }
        msec *= 1.2;
    }
};

const getHatebu = async (url) => {
    const chachedHatebu = await sendMessage('GET_HATEBU_CACHE', {url});
    if (chachedHatebu) {
        return chachedHatebu;
    }
    const encodedUrl = encodeURIComponent(url);
    const jsonpUrl = `https://b.hatena.ne.jp/entry/jsonlite/?url=${encodedUrl}&callback=${jsonpCallbackName}`;
    const jsonpCallerScript = document.createElement('script');
    jsonpCallerScript.setAttribute('src', jsonpUrl);
    jsonpCallerScript.setAttribute('async', 'async');
    document.head.appendChild(jsonpCallerScript);
    const jsonpResultScript = document.createElement('script');
    jsonpResultScript.setAttribute('type', 'text/json');
    jsonpResultScript.setAttribute('id', `${jsonpResultIdPrefix}-${url}`);
    document.head.appendChild(jsonpResultScript);
    const result = await awaitResult(url);
    document.head.removeChild(jsonpCallerScript);
    document.head.removeChild(jsonpResultScript);
    if (result) {
        return await sendMessage('CACHE_HATEBU', {result});
    } else {
        return await sendMessage('CACHE_HATEBU', {result: {
            requested_url: url,
            count: 0,
            entry_url: ''
        }});
    }
};

const createBadge = (hatebu) => {
    const {count, entry} = hatebu;
    const badge = document.createElement('span');
    const link = document.createElement('a');
    link.setAttribute('href', entry);
    link.setAttribute('target', '_blank');
    link.innerText = count;
    badge.appendChild(link);
    return badge;
};

const getHabetuBadge = async (url) => {
    const hatebu = await getHatebu(url);
    if (hatebu?.count > 0) {
        return createBadge(hatebu);
    } else {
        return false;
    }
};

const handleEntry = async (entry) => {
    const url = entry.getAttribute('data-alternate-link');
    const badge = await getHabetuBadge(url);
    if (!badge) {
        return;
    }
    const content = entry.querySelector('.content');
    content.insertBefore(badge, content.firstChild);
};

const handleU100Entry = async (entry) => {
    const url = entry.getAttribute('data-alternate-link');
    const badge = await getHabetuBadge(url);
    if (!badge) {
        return;
    }
    const metadata = entry.querySelector('.metadata.EntryMetadata');
    metadata.insertBefore(badge, metadata.firstChild);
};

document.addEventListener('DOMNodeInserted', (e) => {
    const target = e.target;
    if (!target?.querySelectorAll) {
        return;
    }
    if (target.classList.contains('entry')) {
        handleEntry(target);
        return;
    } else if (target.classList.contains('u100Entry')) {
        handleU100Entry(target);
        return;
    }
    const entries = target.querySelectorAll('.entry');
    const u100Entries = target.querySelectorAll('.u100Entry');
    if (entries.length === 0 && u100Entries.length === 0) {
        return;
    }
    for (const entry of entries) {
        handleEntry(entry);
    }
    for (const u100entry of u100Entries) {
        handleU100Entry(u100entry);
    }
});
