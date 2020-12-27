import { defaultOptions, sendMessage, getSynced } from './common';

const listEntriesClasses = {
    titleOnly: 'list-entries--layout-u0',
    magagine: 'list-entries--layout-u4',
    cards: 'list-entries--layout-u5',
    article: 'list-entries--layout-u100'
};

const insertStyle = async () => {
    const options = await getSynced('options', defaultOptions);
    const defaultStyle = `
    .fh-badge {
        padding: 0 0 1px 0;
        border-bottom-color: #ff0808;
        height: 15px;
        background-color: #ffcbcb;
        font-family: monospace;
        font-size: 12px;
        color: #ff0808;
        text-shadow: 1px 0 #ff0808;
        line-height: 15px;
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
        if (visible) {
            return '';
        }
        switch (name) {
            case 'titleOnly':
                return `
                    .${listEntriesClasses[name]} .content .fh-badge {
                        display: none;
                    }
                `;
            case 'magagine':
            case 'cards':
                    return `
                    .${listEntriesClasses[name]} .visual .fh-badge,
                    .${listEntriesClasses[name]} .content .fh-badge {
                        display: none;
                    }
                `;
            case 'article':
                return `
                    .entryHeader .metadata .fh-badge {
                        display: none;
                    }
                `;
        }
    }).join('\n');

    const { positions } = options;
    const titleOnlyPositionStyle = visibilities.titleOnly ? ((position) => {
        const listEntriesClass = listEntriesClasses.titleOnly;
        switch (position) {
            case 'left':
                return `
                    .${listEntriesClass} .content .fh-badge {
                        margin: 0 4px 0 0;
                    }
                `;
            case 'right':
                return `
                    .${listEntriesClass} .entry.u0 .content {
                        position: relative;
                    }
                    .${listEntriesClass} .content .fh-badge {
                        position: absolute;
                        right: 0;
                        box-shadow: -4px 0 0 #fff;
                    }
                    .${listEntriesClass} .entry.u0:hover .content .fh-badge {
                        display: none;
                    }
                `;
        }
    })(positions.titleOnly) : '';
    const magaginePositionStyle = visibilities.magagine ? ((position) => {
        const listEntriesClass = listEntriesClasses.magagine;
        const contentSelector = `.${listEntriesClass} .entry.u4 .content`;
        const metaBadgeSelector = `${contentSelector} .metadata .fh-badge`;
        const topBadgeSelector = `${contentSelector} > .fh-badge`;
        const imageBadgeSelector = `.${listEntriesClass} .entry.u4 .visual .fh-badge`;
        switch (position) {
            case 'left':
                return `
                    ${[topBadgeSelector, imageBadgeSelector].join(',')} { display: none; }
                    ${metaBadgeSelector} {
                        margin: 0 12px 0 0;
                    }
                `;
            case 'right':
                return `
                    ${[topBadgeSelector, imageBadgeSelector].join(',')} { display: none; }
                    ${contentSelector} .metadata {
                        display: flex;
                    }
                    ${metaBadgeSelector} {
                        margin: 0 0 0 12px;
                        order: 1;
                    }
                `;
            case 'top':
                return `
                    ${[metaBadgeSelector, imageBadgeSelector].join(',')} { display: none; }
                    ${contentSelector} .title {
                        margin-top: 16px;
                    }
                    ${topBadgeSelector} {
                        position: absolute;
                    }
                `;
            case 'image':
                return `
                    ${[metaBadgeSelector, topBadgeSelector].join(',')} { display: none; }
                    ${imageBadgeSelector} {
                        position: absolute;
                        top: 1px;
                        left: 1px;
                        box-shadow: ${
                            ['0', '1px'].map(x => ['0', '1px'].map(y => `${x} ${y} 0 #fff`).join(',')).join(',')
                        };
                    }
                `;
        }
    })(positions.magagine) : '';
    const cardsPositionStyle = visibilities.cards ? ((position) => {
        const listEntriesClass = listEntriesClasses.cards;
        const contentSelector = `.${listEntriesClass} .entry.u5 .content`;
        const metaBadgeSelector = `${contentSelector} .metadata .fh-badge`;
        const topBadgeSelector = `${contentSelector} > .fh-badge`;
        const imageBadgeSelector = `.${listEntriesClass} .entry.u5 .visual .fh-badge`;
        switch (position) {
            case 'left':
                return `
                    ${[topBadgeSelector, imageBadgeSelector].join(',')} { display: none; }
                    ${metaBadgeSelector} {
                        margin: 0 12px 0 0;
                    }
                `;
            case 'right':
                return `
                    ${[topBadgeSelector, imageBadgeSelector].join(',')} { display: none; }
                    ${contentSelector} .metadata {
                        display: flex;
                    }
                    ${metaBadgeSelector} {
                        margin: 0 0 0　12px;
                        order: 1;
                    }
                `;
            case 'image':
                return `
                    ${[topBadgeSelector, metaBadgeSelector].join(',')} { display: none; }
                    ${imageBadgeSelector} {
                        position: absolute;
                        top: 8px;
                        left: 8px;
                        box-shadow: ${
                            ['-2px', '0', '2px'].map(x => ['-2px', '0', '2px'].map(y => `${x} ${y} 0 #fff`).join(',')).join(',')
                        };
                    }
                `;
        }
    })(positions.cards) : '';
    const articlePositionStyle = visibilities.article ? ((position) => {
        switch (position) {
            case 'left':
                return `
                    .entryHeader .metadata .fh-badge {
                        margin: 0 8px 0 0;
                    }
                `;
            case 'right':
                return `
                    .entryHeader .metadata {
                        display: flex;
                    }
                    .entryHeader .metadata .fh-badge {
                        margin: 0 0 0 8px;
                        order: 1;
                    }
                `;
        }
    })(positions.article) : '';

    const styles = `
        ${defaultStyle}
        ${visibilitiesStyle}
        ${titleOnlyPositionStyle}
        ${magaginePositionStyle}
        ${cardsPositionStyle}
        ${articlePositionStyle}
    `.split(/\s+/).join(' ').replaceAll(/\s*([{}:;,])\s*/g, '$1').trim();

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
    `.split(/\s+/).join(' ').replaceAll(/\s*([{}();=])\s*/g, '$1').trim();;
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

    const metadata = content.querySelector('.metadata');
    if (metadata) {
        const metadataBadge = await getHabetuBadge(url);
        metadata.insertBefore(metadataBadge, metadata.firstChild);
    }

    const visual = entry.querySelector('.visual');
    if (visual) {
        const visualBadge = await getHabetuBadge(url);
        visual.appendChild(visualBadge);
    }
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
