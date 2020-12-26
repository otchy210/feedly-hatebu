import { sendMessage, getSynced } from './common';

const feedly = {
    listEntriesClasses: {
        titleOnly: 'list-entries--layout-u0',
        magagine: 'list-entries--layout-u4',
        cards: 'list-entries--layout-u5',
        article: 'list-entries--layout-u100'
    }
};

const insertStyle = async () => {
    const options = await getSynced('options');
    const defaultStyle = `
    .fh-badge {
        padding: 0 0 2px 0;
        border-bottom-color: #ff0808;
        background-color: #ffcbcb;
        font-family: monospace;
        font-size: 12px;
        color: #ff0808;
        text-shadow: 1px 0 #ff0808;
    }
    .fh-badge.fh-badge-one,
    .fh-badge.fh-badge-lt10 {
        border-bottom-color: #ff6565;
        background-color: #ffeeee;
        color: #ff6565;
        text-shadow: 1px 0 #ff6565;
    }
    .fh-badge a {
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: inherit;
        color: inherit;
    }
    .metadata .fh-badge a:hover,
    .fx .entry .fh-badge a:hover {
        color: inherit;
        text-decoration: none;
    }
    .fh-badge a::after {
        content: "users";
        margin-left: 2px;
    }
    .fh-badge.fh-badge-one a::after {
        content: "user";
    }
    `;

    const { visibilities } = options;
    const visibilitiesStyle = Object.entries(visibilities).map(([name, visible]) => {
        return visible ? '' : `.${feedly.listEntriesClasses[name]} .fh-badge { display: none; }`;
    }).join('\n');

    const { positions } = options;
    const titleOnlyPositionStyle = ((position) => {
        const listEntriesClass = feedly.listEntriesClasses.titleOnly;
        switch (position) {
            case 'left':
                return `
                    .${listEntriesClass} .content .fh-badge {
                        margin: 0 4px 0 0;
                    }
                `;
            case 'right':
                return `
                    .${listEntriesClass} .content .fh-badge {
                        position: absolute;
                        right: 2em;
                        margin: 0 4px 0 0;
                        box-shadow: -4px 0 0 #fff;
                    }
                    .fx .entry.u0:hover .content .fh-badge {
                        display: none;
                    }
                `;
        }
    })(positions.titleOnly);

    const styles = `
        ${defaultStyle}
        ${visibilitiesStyle}
        ${titleOnlyPositionStyle}`.trim()
        .split(/[ \n]+/).join(' ')
        .split(' { ').join('{')
        .split(' } ').join('}')
        .split(': ').join(':')
        .split('; ').join(';')
        .split(', ').join(',');

    const style = document.createElement('style');
    style.innerHTML = styles;
    document.head.appendChild(style);
};

const jsonpCallbackName = 'feedlyHatebuJsonpCallback';
const jsonpResultIdPrefix = 'feedlyHatebuResult'

const insertJsonpScript = () => {
    const jsonpScript = document.createElement('script');
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
};

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
    link.addEventListener('click', e => e.stopPropagation());
    badge.appendChild(link);
    badge.classList.add('fh-badge');
    if (count === 1) {
        badge.classList.add('fh-badge-one');
    } else if (count < 10) {
        badge.classList.add('fh-badge-lt10');
    }
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

const watchDomChange = () => {
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
};

// init
insertJsonpScript();
insertStyle();
watchDomChange();
