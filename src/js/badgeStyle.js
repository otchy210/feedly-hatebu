export const designs = ['legacy', 'legacy-no-bold', 'legacy-num-only', 'legacy-num-only-no-bold'];

export const getBadgeStyle = (design, addPrefix = false) => {
    const style = getOriginalStyle(design);
    if (addPrefix) {
        return style.replaceAll(' .fh-badge ', ` .${design} .fh-badge `);
    } else {
        return style;
    }
};

const getOriginalStyle = (design) => {
    switch (design) {
        case 'legacy':
        case 'legacy-no-bold':
        case 'legacy-num-only':
        case 'legacy-num-only-no-bold':
            const noBold = design.includes('no-bold');
            const num = design.includes('num-only');
            return `
            .fh-badge {
                padding: 0 0 1px 0;
                border-bottom-color: #ff0808;
                height: 15px;
                background-color: #ffcbcb;
                font-family: monospace;
                font-size: 12px;
                color: #ff0808;
                ${noBold ? '' : 'text-shadow: 1px 0 #ff0808;'}
                line-height: 15px;
            }
            .fh-badge.fh-badge-one,
            .fh-badge.fh-badge-lt10 {
                border-bottom-color: #ff6565;
                background-color: #ffeeee;
                color: #ff6565;
                ${noBold ? '' : 'text-shadow: 1px 0 #ff6565;'}
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
            ${num ? '' : `
            .fh-badge a::after {
                content: "users";
                margin-left: 2px;
            }
            .fh-badge.fh-badge-one a::after {
                content: "user";
            }
            `}
            `
    }
    return '';
}