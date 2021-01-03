import { hatenaBlue } from './components/colors';

export const designs = [
    'legacy',
    'legacy-no-bold',
    'legacy-num-only',
    'legacy-num-only-no-bold',
    'button',
    'button-num-only',
    'feedly',
    'feedly-num-only',
];

const hatebuSvg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path fill="#fff" d="M7.24 6.36a2.37 2.37 0 00-1.66-.75A2.72 2.72 0 007 4.85a2 2 0 00.43-1.35 2.42 2.42 0 00-.33-1.2 2.15 2.15 0 00-.84-.82 3.59 3.59 0 00-1.16-.37A17.41 17.41 0 002.74 1H0v10h2.83a18.33 18.33 0 002.45-.12 4 4 0 001.26-.39 2.31 2.31 0 001-.94 2.86 2.86 0 00.34-1.41 2.57 2.57 0 00-.64-1.78zM2.53 3.22h.59a2.77 2.77 0 011.37.23.88.88 0 01.35.79.82.82 0 01-.38.76 3 3 0 01-1.38.22h-.55zM4.85 9a2.79 2.79 0 01-1.37.24h-1V7h1a2.61 2.61 0 011.36.25 1 1 0 01.37.88.87.87 0 01-.36.87z"/><circle fill="#fff" cx="10.73" cy="9.73" r="1.27"/><path fill="#fff" d="M9.63 1h2.2v6.67h-2.2z"/></svg>');

export const getBadgeStyle = (design, addPrefix = false) => {
    const style = getOriginalStyle(design);
    if (addPrefix) {
        return style.replaceAll(/ (\.fh-badge(:{1,2}[a-z]+)?) /g, ` .${design} $1 `);
    } else {
        return style;
    }
};

const getOriginalStyle = (design) => {
    const noBold = design.includes('no-bold');
    const numOnly = design.includes('num-only');
    switch (design) {
        case 'legacy':
        case 'legacy-no-bold':
        case 'legacy-num-only':
        case 'legacy-num-only-no-bold':
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
                cursor: pointer;
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
            ${numOnly ? '' : `
            .fh-badge a::after {
                content: "users";
                margin-left: 2px;
            }
            .fh-badge.fh-badge-one a::after {
                content: "user";
            }
            `}
            `;
        case 'button':
        case 'button-num-only':
            return `
            .fh-badge {
                display: inline-block;
                padding: 2px;
                border-radius: 3px;
                background-color: ${hatenaBlue};
                line-height: 9px;
                cursor: pointer;
                color: #fff;
            }
            .fh-badge:hover {
                background-color: #0091c5;
                color: #fff;
            }
            .fh-badge a {
                display: inline-block;
                padding: 3px;
                border-radius: 3px;
                font-size: 11px;
                font-family: Helvetica,Arial,"Hiragino Kaku Gothic ProN","ヒラギノ角ゴ ProN W3",Meiryo,"メイリオ",sans-serif;
                font-weight: bold;
                color: inherit;
            }
            .fh-badge a:hover {
                background: #006b92;
                color: #fff;
                text-decoration: none !important;
                color: inherit;
            }
            ${numOnly ? '' : `
            .fh-badge {
                padding-left: 17px;
                background-image: url('data:image/svg+xml,${hatebuSvg}');
                background-repeat: no-repeat;
                background-size: 11px;
                background-position: 5px center;
            }
            `}
           `;
        case 'feedly':
        case 'feedly-num-only':
            return `
            .fh-badge {
                cursor: pointer;
                color: #9e9e9e;
                font-size: 11px;
                font-family: sans-serif;
            }
            .metadata .fh-badge {
                font-size: 13px;
            }
            .visual .fh-badge {
                border-radius: 1px;
                background-color: #fff;
            }
            .fh-badge a {
                color: inherit;
            }
            .fh-badge a:hover {
                color: #636363;
                text-decoration: underline;
            }
            ${numOnly ? '' : `
            .fh-badge::before {
                content: "B!";
                margin-right: 0.25em;
            }
            `}
            `;
    }
    return '';
}