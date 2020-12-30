let counter = 0;

export const newApiCall = (url) => {
    const [callbackName, resultId] = newIds();

    const callback = newScript();
    callback.innerHTML = `
        const ${callbackName} = (response) => {
            const result = document.getElementById('${resultId}');
            if (!result) {
                return;
            }
            if (response) {
                result.innerHTML = JSON.stringify(response);
            } else {
                result.innerHTML = 'false';
            }
        }
    `;

    const encodedUrl = encodeURIComponent(url);
    const jsonpUrl = `https://b.hatena.ne.jp/entry/jsonlite/?url=${encodedUrl}&callback=${callbackName}`;
    const caller = newScript({async: 'async', src: jsonpUrl});

    const result = newScript({id: resultId, type: 'application/json'});

    const scripts = [callback, caller, result];

    return new Promise((resolve, reject) => {
        let resolved = false;
        result.addEventListener('DOMSubtreeModified', () => {
            const response = JSON.parse(result.innerHTML);
            resolved = true;
            resolve(response);
        });
        scripts.forEach(s => document.head.appendChild(s));
        setTimeout(() => {
            if (!resolved) {
                reject(`Timeout: ${jsonpUrl}`);
            }
            scripts.forEach(s => document.head.removeChild(s));
        }, 3000);
    });
};

const newIds = () => {
    const id = ++counter;
    return [
        `fhJsonpCallback_${id}`,
        `fhJsonpResult_${id}`,
    ]
};

const newScript = (attrs = {}) => {
    const script = document.createElement('script');
    Object.entries(attrs).forEach(([name, value]) => {
        script.setAttribute(name, value);
    })
    return script;
}