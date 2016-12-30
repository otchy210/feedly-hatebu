const includes = (list, arg) => {
    return list && Array.prototype.includes.call(list, arg);
};
const setData = (node, name, value) => {
    node.setAttribute('data-' + name, value);
};
const getData = (node, name) => {
    return node.getAttribute ? node.getAttribute('data-' + name) : '';
};
const newNode = (name, attrs = {}, children = []) => {
    const dom = document.createElement(name);
    Object.entries(attrs).forEach(([k, v]) => {
        dom.setAttribute(k, v);
    });
    children.forEach((c) => {
        dom.appendChild(c);
    })
    return dom;
};
const generateHatebu = (url, className) => {
    const pos = url.indexOf('#');
    if (pos >= 0) {
        url = url.substr(0, pos) + '%23' + url.substr(pos+1);
    }
    return newNode(
        'a', {'href': 'http://b.hatena.ne.jp/entry/' + url, 'target': '_blank', 'class': className}, [newNode(
            'img', {'src': '//b.st-hatena.com/entry/image/' + url}
        )]
    );
};
document.addEventListener('DOMNodeInserted', (e) => {
    const node = e.target;
    if (getData(node, 'fh-done')) {
        return;
    }
    if (includes(node.classList, 'content')) {
        const link = node.querySelector('a');
        const hatebu = generateHatebu(link.getAttribute('href'), 'fh-list');
        node.insertBefore(hatebu, link);
        setData(node, 'fh-done', true);
    } else if (includes(node.classList, 'headerInfo')) {
        console.log(node);
        const header = node.parentNode.parentNode;
        const link = header.querySelector('a');
        const hatebu = generateHatebu(link.getAttribute('href'), 'fh-header');
        const left = node.querySelector('.left');
        left.appendChild(hatebu);
        setData(node, 'fh-done', true);
    }
});
