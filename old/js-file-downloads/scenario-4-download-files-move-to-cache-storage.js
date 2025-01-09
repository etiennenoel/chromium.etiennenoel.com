const downloadFile = async (filename) => {
    const url = "https://chromium.etiennenoel.com/js-file-downloads/files/" + filename;

    await measureMemoryUsage("Initial (Before download)");

    document.getElementById("responseOutput").value += "File download started: '" + filename + "'";

    const cache = await caches.open("large-binaries");

    fetch(url, {method: 'get', mode: "no-cors", referrerPolicy: "no-referrer"}).then(async response => {
        console.log(response);

        await measureMemoryUsage("After receiving response from fetch");

        await cache.put(url, response);

        await measureMemoryUsage("After writing the response to CacheStorage.");
    });

}

const loadFileFromCacheStorage = async (filename) => {
    const url = "https://chromium.etiennenoel.com/js-file-downloads/files/" + filename;

    await measureMemoryUsage("Initial (Before loading from Cache Storage)");

    const cache = await caches.open("large-binaries");

    const response = await cache.match(url);

    document.getElementById("responseOutput").value += "File retrieved from Cache Storage";
    await measureMemoryUsage("File retrieved from Cache Storage");
}

document.getElementById("10mb_file_download_btn").onclick = () => downloadFile("file_10mb.bin");
document.getElementById("100mb_file_download_btn").onclick = () => downloadFile("file_100mb.bin");
document.getElementById("1gb_file_download_btn").onclick = () => downloadFile("file_1gb.bin");
document.getElementById("2gb_file_download_btn").onclick = () => downloadFile("file_2gb.bin");
document.getElementById("5gb_file_download_btn").onclick = () => downloadFile("file_5gb.bin");

document.getElementById("10mb_file_load_from_cache_storage_btn").onclick = () => loadFileFromCacheStorage("file_10mb.bin");
document.getElementById("100mb_file_load_from_cache_storage_btn").onclick = () => loadFileFromCacheStorage("file_100mb.bin");
document.getElementById("1gb_file_load_from_cache_storage_btn").onclick = () => loadFileFromCacheStorage("file_1gb.bin");
document.getElementById("2gb_file_load_from_cache_storage_btn").onclick = () => loadFileFromCacheStorage("file_2gb.bin");
document.getElementById("5gb_file_load_from_cache_storage_btn").onclick = () => loadFileFromCacheStorage("file_5gb.bin");