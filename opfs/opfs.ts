// @ts-ignore
const buildFileSystem = async (paths: string[]): Promise<void> => {
    try {
        const root = await navigator.storage.getDirectory();

        for (const path of paths) {

            const splitPath = path.split("/");

            let parent = root;

            let index = 0;
            for (const fileOrFolder of splitPath) {
                if(index === splitPath.length - 1) {
                    await parent.getFileHandle(fileOrFolder, {create: true});
                } else {
                    parent = await parent.getDirectoryHandle(fileOrFolder, {create: true})
                }

                index++;
            }
        }
    } catch (e) {
        console.log(e);
    }

}

const buildTree = async (directory) => {
    let html = "<ul>";

    for await (const handle of directory.values()) {
        if(handle.kind === "directory") {
            html += "<li>" + handle.name + " " + await buildTree(handle) +"</li>";
        } else if(handle.kind === "file") {
            html += "<li>" + handle.name + "</li>";
        }

    }

    html += "</ul>"

    return html;
}


buildFileSystem([
    "test.sqlite",
    "root.txt",
    "a/b/c/d.txt",
    "databases/animals.sqlite3",
    "animals/dogs/peach.txt",
    "animals/dogs/melchior.txt",
    "animals/cats/sir-winston-churchill.txt",
]).then(
// @ts-ignore
    async () => {
    const root = await navigator.storage.getDirectory();

    document.getElementById("filesystem").innerHTML = await buildTree(root);
})

