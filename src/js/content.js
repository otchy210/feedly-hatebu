import { defaultOptions, sendMessage, getSynced } from './common';
import { getBadgeStyle } from './badgeStyle';

const insertStyle = async () => {
    const options = await getSynced('options', defaultOptions);
    const { visibilities, selectedDesign } = options;

    const badgeStyle = getBadgeStyle(selectedDesign);
    const visibilitiesStyle = Object.entries(visibilities).map(([name, visible]) => {
        if (visible) {
            return '';
        }
        switch (name) {
            case 'titleOnly':
                return `
                    .TitleOnlyLayout__content .fh-badge {
                        display: none;
                    }
                `;
            case 'magagine':
                    return `
                    .MagazineLayout__visual .fh-badge,
                    .MagazineLayout__content .fh-badge {
                        display: none;
                    }
                `;
            case 'cards':
                    return `
                    .CardLayout__visual .fh-badge,
                    .CardLayout__content .fh-badge {
                        display: none;
                    }
                `;
            case 'article':
                return `
                    .entryHeader .EntryMetadata .fh-badge {
                        display: none;
                    }
                `;
        }
    }).join('\n');

    const { positions } = options;
    const titleOnlyPositionStyle = visibilities.titleOnly ? ((position) => {
        switch (position) {
            case 'left':
                return `
                    .TitleOnlyLayout__content .fh-badge {
                        margin: 0 4px 0 0;
                    }
                `;
            case 'right':
                return `
                    .TitleOnlyLayout__content {
                        position: relative;
                    }
                    .TitleOnlyLayout__content .fh-badge {
                        position: absolute;
                        right: 0;
                        box-shadow: -4px 0 0 #fff;
                    }
                    .TitleOnlyLayout:hover .TitleOnlyLayout__content .fh-badge {
                        display: none;
                    }
                `;
        }
    })(positions.titleOnly) : '';
    const magaginePositionStyle = visibilities.magagine ? ((position) => {
        const entrySelector = '.MagazineLayout';
        const contentSelector = `${entrySelector} .MagazineLayout__content`;
        const metadataSelector = `${contentSelector} .EntryMetadata`;
        const metaBadgeSelector = `${metadataSelector} .fh-badge`;
        const topBadgeSelector = `${contentSelector} > .fh-badge`;
        const imageContainerSelector = `${entrySelector} .MagazineLayout__visual`;
        const imageBadgeSelector = `${imageContainerSelector} .fh-badge`;
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
                    ${metadataSelector} {
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
                    ${contentSelector} .EntryTitle {
                        display: block;
                        clear: left;
                        padding-top: 2px;
                    }
                    ${topBadgeSelector} {
                        float: left;
                    }
                `;
            case 'image':
                return `
                    ${[metaBadgeSelector, topBadgeSelector].join(',')} { display: none; }
                    ${imageContainerSelector} {
                        position: relative;
                    }
                    ${imageBadgeSelector} {
                        position: absolute;
                        top: 3px;
                        left: 3px;
                        outline: solid 1px #fff;
                    }
                `;
        }
    })(positions.magagine) : '';
    const cardsPositionStyle = visibilities.cards ? ((position) => {
        const entrySelector = '.CardLayout';
        const contentSelector = `${entrySelector} .CardLayout__content`;
        const metadataSelector = `${contentSelector} .EntryMetadata`;
        const metaBadgeSelector = `${metadataSelector} .fh-badge`;
        const topBadgeSelector = `${contentSelector} > .fh-badge`;
        const imageContainerSelector = `${entrySelector} .CardLayout__visual`;
        const imageBadgeSelector = `${imageContainerSelector} .fh-badge`;
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
                    ${metadataSelector} {
                        display: flex;
                    }
                    ${metaBadgeSelector} {
                        margin: 0 0 0 12px;
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
                        outline: solid 2px #fff;
                    }
                `;
        }
    })(positions.cards) : '';
    const articlePositionStyle = visibilities.article ? ((position) => {
        switch (position) {
            case 'left':
                return `
                    .entryHeader .EntryMetadata .fh-badge {
                        margin: 0 8px 0 0;
                    }
                `;
            case 'right':
                return `
                    .entryHeader .EntryMetadata {
                        display: flex;
                    }
                    .entryHeader .EntryMetadata .fh-badge {
                        margin: 0 0 0 8px;
                        order: 1;
                    }
                `;
        }
    })(positions.article) : '';

    const styles = `
        ${badgeStyle}
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
    badge.addEventListener('click', e => {
        e.stopPropagation();
        window.open(e.target.firstChild.href, '_blank');
    });
    if (count === 1) {
        badge.classList.add('fh-badge-one');
    } else if (count < 10) {
        badge.classList.add('fh-badge-lt10');
    }
    return badge;
};

const getEntryUrl = (headerClass, entry) => {
    const entryTitle = entry.querySelector(`.${headerClass} > a:first-child`);
    const url = entryTitle.getAttribute('href');
    return url;
}

const getHabetuBadge = async (url) => {
    const hatebu = await sendMessage('GET_HATEBU', { url });
    if (hatebu?.count > 0) {
        return createBadge(hatebu);
    } else {
        return false;
    }
};

const handleTitleOnlyLayout = async (entry) => {
    const url = getEntryUrl('TitleOnlyLayout__title', entry);
    const badge = await getHabetuBadge(url);
    if (!badge) {
        return;
    }
    if (entry.querySelector('.fh-badge')) {
        return;
    }
    const content = entry.querySelector('.TitleOnlyLayout__content');
    content.insertBefore(badge, content.firstChild);
}

const handleMagazineLayout = async (entry) => {
    const url = getEntryUrl('MagazineLayout__title', entry);
    const badge = await getHabetuBadge(url);
    if (!badge) {
        return;
    }
    if (entry.querySelector('.fh-badge')) {
        return;
    }
    const content = entry.querySelector('.MagazineLayout__content');
    content.insertBefore(badge, content.firstChild);

    const metadata = entry.querySelector('.EntryMetadata');
    const metadataBadge = await getHabetuBadge(url);
    metadata.insertBefore(metadataBadge, metadata.firstChild);

    const visual = entry.querySelector('.MagazineLayout__visual');
    const visualBadge = await getHabetuBadge(url);
    visual.appendChild(visualBadge);
}

const handleCardLayout = async (entry) => {
    const url = getEntryUrl('CardLayout__title', entry);
    const badge = await getHabetuBadge(url);
    if (!badge) {
        return;
    }
    if (entry.querySelector('.fh-badge')) {
        return;
    }
    const content = entry.querySelector('.CardLayout__content');
    content.insertBefore(badge, content.firstChild);

    const metadata = entry.querySelector('.EntryMetadata');
    const metadataBadge = await getHabetuBadge(url);
    metadata.insertBefore(metadataBadge, metadata.firstChild);

    const visual = entry.querySelector('.CardLayout__visual');
    const visualBadge = await getHabetuBadge(url);
    visual.appendChild(visualBadge);
}

const handleEntry = async (entry) => {
    if (entry.querySelector('.fh-badge')) {
        return;
    }
    const titleOnlyLayout = entry.querySelector('.TitleOnlyLayout');
    if (titleOnlyLayout) {
        handleTitleOnlyLayout(titleOnlyLayout);
        return;
    }
    const magagineLayout = entry.querySelector('.MagazineLayout');
    if (magagineLayout) {
        handleMagazineLayout(magagineLayout);
        return;
    }
    const cardLayout = entry.querySelector('.CardLayout');
    if (cardLayout) {
        handleCardLayout(cardLayout);
        return;
    }
};

const handleU100Entry = async (entry) => {
    if (entry.querySelector('.fh-badge')) {
        return;
    }
    const url = getEntryUrl('entryHeader', entry);
    const badge = await getHabetuBadge(url);
    if (!badge) {
        return;
    }
    if (entry.querySelector('.fh-badge')) {
        return;
    }
    const metadata = entry.querySelector('.EntryMetadata');
    metadata.insertBefore(badge, metadata.firstChild);
};

const watchDomChange = () => {
    const observer = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
            const target = mutation.target;
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
        }
    });
    observer.observe(document.body, {childList: true, subtree: true});
};

// init
insertStyle();
watchDomChange();
