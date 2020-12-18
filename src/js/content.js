const sendMessage = (action, payload) => {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(chrome.runtime.id, {action, payload}, null, resolve);
    });
}

const jsonpScript = document.createElement('script');
const jsonpCallbackName = 'feedlyHatebuJsonpCallback';
const jsonResultIdPrefix = 'feedlyHatebuResult'
jsonpScript.innerHTML = `
const ${jsonpCallbackName} = (json) => {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/json');
    script.setAttribute('id', \`${jsonResultIdPrefix}-\${json.requested_url}\`);
    script.innerHTML = JSON.stringify(json);
    document.head.appendChild(script);
};
`;
document.head.appendChild(jsonpScript);

const waitFor = (msec) => {
    return new Promise(resolve => {
        setTimeout(resolve, msec);
    });
}

const awaitResult = async (url) => {
    const timeout = 2000;
    let msec = 100;
    while (true) {
        await waitFor(msec);
        const resultNode = document.getElementById(`${jsonResultIdPrefix}-${url}`);
        if (resultNode) {
            const result = JSON.parse(resultNode.innerHTML);
            document.head.removeChild(resultNode);
            return result;
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
    const script = document.createElement('script');
    script.setAttribute('src', jsonpUrl);
    script.setAttribute('async', 'async');
    document.head.appendChild(script);
    const result = await awaitResult(url);
    if (!result) {
        return false;
    }
    return await sendMessage('CACHE_HATEBU', {result});
};

const handleEntry = async (entry) => {
    const url = entry.getAttribute('data-alternate-link');
    const hatebu = await getHatebu(url);
    if (!hatebu) {
        console.error(`[Feedlyはてブ] はてブ情報のロードに失敗しました。(${url})`);
        return;
    }
    console.log(hatebu);
};

const handleEntryBody = async (entryBody) => {
    // console.log(entryBody);
    // const results = await sendMessage('DO_SOMETHING', {i: 1});
    // console.log(results);
};

document.addEventListener('DOMNodeInserted', (e) => {
    if (!e.target || !e.target.querySelectorAll) {
        return;
    }
    const entries = e.target.querySelectorAll('.entry');
    const entryBodies = e.target.querySelectorAll('.entryBody');
    if (entries.length === 0 && entryBodies.length === 0) {
        return;
    }
    for (const entry of entries) {
        handleEntry(entry);
    }
    for (const entryBody of entryBodies) {
        handleEntryBody(entryBody);
    }
});
