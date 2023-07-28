const downloadFile = (filename) => {
    document.getElementById("responseOutput").value = "File download started: '" + filename + "'";

    const url = "https://chromium.etiennenoel.com/js-file-downloads/files/" + filename;

    fetch(url, {method: 'get', mode: "no-cors", referrerPolicy: "no-referrer"}).then(response => {
        console.log(response);

        response.blob().then(blob => {
            document.getElementById("responseOutput").value += "\nFile downloaded.";
            document.getElementById("responseOutput").value += "\nOpening prompt.";
            console.log(blob)

            const href = URL.createObjectURL(blob);
            const aElement = document.createElement('a');
            aElement.setAttribute('download', "file.bin");
            aElement.href = href;
            aElement.setAttribute('target', '_blank');
            aElement.click();
            URL.revokeObjectURL(href);
        })
    });

}

document.getElementById("10mb_file_download_btn").onclick = () => downloadFile("file_10mb.bin");
document.getElementById("100mb_file_download_btn").onclick = () => downloadFile("file_100mb.bin");
document.getElementById("1gb_file_download_btn").onclick = () => downloadFile("file_1gb.bin");
document.getElementById("2gb_file_download_btn").onclick = () => downloadFile("file_2gb.bin");
document.getElementById("5gb_file_download_btn").onclick = () => downloadFile("file_5gb.bin");
