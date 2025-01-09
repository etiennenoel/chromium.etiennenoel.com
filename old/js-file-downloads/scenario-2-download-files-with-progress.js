let currentResponse;
const downloadFile = async (filename) => {
    await measureMemoryUsage("Initial (Before download)");

    document.getElementById("responseOutput").value += "Requesting to download file: '" + filename + "'";

    const url = "https://chromium.etiennenoel.com/js-file-downloads/files/" + filename;

    fetch(url, {method: 'get', mode: "no-cors", referrerPolicy: "no-referrer"}).then(async (response) => {
        console.log(response);

        await measureMemoryUsage("After receiving response from fetch");

        document.getElementById("file-download-progress").classList.remove("d-none");

        const reader =  response.body.getReader();

        // Step 2: get total length
        const contentLength = +response.headers.get('Content-Length');

        document.getElementById("responseOutput").value += "\nDownloading file...";

        // Step 3: read the data
        let receivedLength = 0; // received that many bytes at the moment
        while(true) {
            const {done, value} = await reader.read();

            if (done) {
                break;
            }

            receivedLength += value.length;

            const progress =  Math.floor((receivedLength/contentLength) * 100);
            document.getElementById("progressbar").style.width = progress + "%"
            document.getElementById("progressbar").innerText = progress + "%"
        }

        await measureMemoryUsage(filename + " downloaded successfully");
        document.getElementById("responseOutput").value += "\nFile downloaded!";
    });

}

document.getElementById("10mb_file_download_btn").onclick = () => downloadFile("file_10mb.bin");
document.getElementById("100mb_file_download_btn").onclick = () => downloadFile("file_100mb.bin");
document.getElementById("1gb_file_download_btn").onclick = () => downloadFile("file_1gb.bin");
document.getElementById("2gb_file_download_btn").onclick = () => downloadFile("file_2gb.bin");
document.getElementById("5gb_file_download_btn").onclick = () => downloadFile("file_5gb.bin");