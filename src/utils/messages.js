export {
    extractContent,
    extractData
};

function extractContent(data, callback, filter) {
    data = extractData(data);

    if (!data || (filter && data.type !== filter)) {
        return;
    }

    callback(data);
}

function extractData(data) {
    try {
        return JSON.parse(JSON.parse(data.data).content);
    } catch (e) {
        return null;
    }
}
