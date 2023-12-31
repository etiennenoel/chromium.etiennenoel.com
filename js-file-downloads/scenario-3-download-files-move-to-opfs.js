const downloadFile = async (filename) => {
    const url = "https://chromium.etiennenoel.com/js-file-downloads/files/" + filename;

    await measureMemoryUsage("Initial (Before download)");

    document.getElementById("responseOutput").value += "File download started: '" + filename + "'";

    fetch(url, {method: 'get', mode: "no-cors", referrerPolicy: "no-referrer"}).then(async response => {
        console.log(response);

        await measureMemoryUsage("After receiving response from fetch");

        response.blob().then(async blob => {
            await measureMemoryUsage("Download completed");

            document.getElementById("responseOutput").value += "\nFile downloaded.";
            console.log(blob)

            const opfs = await navigator.storage.getDirectory();
            const file = await opfs.getFileHandle(filename, {create: true});
            const writable = await file.createWritable();
            await blob.stream().pipeTo(writable);

            await measureMemoryUsage("After writing the blob to OPFS.");

            document.getElementById("responseOutput").value += "\nFile downloaded to OPFS.";
        })
    });

}

const loadFileFromOPFS = async (filename) => {
    const url = "https://chromium.etiennenoel.com/js-file-downloads/files/" + filename;

    await measureMemoryUsage("Initial (Before loading from OPFS)");

    const opfs = await navigator.storage.getDirectory();
    const file = await opfs.getFileHandle(filename, {create: false});

    if(file === null) {
        document.getElementById("responseOutput").value += "\nFile doesn't exist in OPFS. Download it first.";
        return;
    }

    document.getElementById("responseOutput").value += "File retrieved from OPFS";
    await measureMemoryUsage("File retrieved from OPFS");
}

document.getElementById("10mb_file_download_btn").onclick = () => downloadFile("file_10mb.bin");
document.getElementById("100mb_file_download_btn").onclick = () => downloadFile("file_100mb.bin");
document.getElementById("1gb_file_download_btn").onclick = () => downloadFile("file_1gb.bin");
document.getElementById("2gb_file_download_btn").onclick = () => downloadFile("file_2gb.bin");
document.getElementById("5gb_file_download_btn").onclick = () => downloadFile("file_5gb.bin");


document.getElementById("10mb_file_load_from_opfs_btn").onclick = () => loadFileFromOPFS("file_10mb.bin");
document.getElementById("100mb_file_load_from_opfs_btn").onclick = () => loadFileFromOPFS("file_100mb.bin");
document.getElementById("1gb_file_load_from_opfs_btn").onclick = () => loadFileFromOPFS("file_1gb.bin");
document.getElementById("2gb_file_load_from_opfs_btn").onclick = () => loadFileFromOPFS("file_2gb.bin");
document.getElementById("5gb_file_load_from_opfs_btn").onclick = () => loadFileFromOPFS("file_5gb.bin");
