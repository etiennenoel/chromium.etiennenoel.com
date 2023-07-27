let currentResponse;
const downloadFile = (filename) => {
    document.getElementById("responseOutput").value = "Start file download: '" + filename + "'";
    document.getElementById("blob-management").classList.remove("d-none");

    const url = "https://chromium.etiennenoel.com/js-file-downloads/files/" + filename;

    fetch(url, {method: 'get', mode: "no-cors", referrerPolicy: "no-referrer"}).then(response => {
        console.log(response);

        currentResponse = response;
    });

}

const loadBlob = () => {
    console.log(currentResponse)

    document.getElementById("responseOutput").value += "\nLoading the blob...";

    currentResponse.blob().then(blob => {
        document.getElementById("responseOutput").value += "\nBlob loaded.";
        console.log(blob)

        const href = URL.createObjectURL(blob);
        document.getElementById("responseOutput").value += "\nBlob url:'" + href + "'";

        const aElement = document.createElement('a');
        aElement.setAttribute('download', "file.bin");
        aElement.href = href;
        aElement.setAttribute('target', '_blank');
        aElement.click();
        URL.revokeObjectURL(href);
    })
}

document.getElementById("1gb_file_download_btn").onclick = () => downloadFile("file_1gb.bin");
document.getElementById("2gb_file_download_btn").onclick = () => downloadFile("file_2gb.bin");
document.getElementById("5gb_file_download_btn").onclick = () => downloadFile("file_5gb.bin");

document.getElementById("load_blob").onclick = () => loadBlob();
