import {SqliteClient} from "@magieno/sqlite-client";

const bootstrap = async () => {
    const sqliteWorkerPath = "scripts/sqlite-worker.mjs"; // Must correspond to the path in your final deployed build.
    const filename = "/test.sqlite3"; // This is the name of your database. It corresponds to the path in the OPFS.

    const sqliteClient = new SqliteClient({
        // @ts-ignore
        type: "OPFS_WORKER",
        filename,
        flags: "c",
        sqliteWorkerPath,
    })
    await sqliteClient.init();

    await sqliteClient.executeSql("CREATE TABLE IF NOT EXISTS test(a,b)");
    await sqliteClient.executeSql("INSERT INTO test VALUES(?, ?)", [6,7]);
    const results = await sqliteClient.executeSql("SELECT * FROM test");
    console.log("Results:", results);

    window["magieno"] = window["magieno"] || {};
    window["magieno"]["sqlite"] = window["magieno"]["sqlite"] || {};
    window["magieno"]["sqlite"]["workerPath"] = sqliteWorkerPath;
    window["magieno"]["sqlite"]["client"] = SqliteClient;

    window.addEventListener('MAGIENO_SQLITE_CLIENT_FROM_EXTENSION', async (evt) => {
        console.log("In page, received:", evt);

        // @ts-ignore
        const detail = evt.detail;

        if(detail.type === "EXECUTE_SQL_QUERY") {
            const client = new window["magieno"]["sqlite"]["client"]({
                // @ts-ignore
                type: "OPFS_WORKER",
                filename: detail.filename,
                flags: "c",
                sqliteWorkerPath: window["magieno"]["sqlite"]["workerPath"],
            })

            await client.init();

            const response = await client.executeSql(detail.query, [], "resultRows", "object");
            window.dispatchEvent(new CustomEvent("MAGIENO_SQLITE_CLIENT_TO_EXTENSION", {
                detail: {"type": "EXECUTE_SQL_QUERY_RESULT", "uniqueId": detail.uniqueId, "filename": detail.filename, "response": response}
            }));
        }
    });

    document.getElementById("run-query").addEventListener("click", async () => {
        // @ts-ignore
        const filename = document.getElementById("sqlite-filename").value;

        const sqliteClient = new SqliteClient({
            // @ts-ignore
            type: "OPFS_WORKER",
            filename,
            flags: "c",
            sqliteWorkerPath,
        })
        await sqliteClient.init();

        // @ts-ignore
        const query = document.getElementById("query").value;

        // @ts-ignore
        const response = await sqliteClient.executeSql(query, [], "resultRows", "object");

        document.getElementById("query-results").textContent = JSON.stringify(response);
    });
}


bootstrap();