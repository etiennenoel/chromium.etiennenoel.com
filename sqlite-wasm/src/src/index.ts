import {SqliteClient, SqliteClientTypeEnum, SqliteClientExtension} from "@magieno/sqlite-client";

const bootstrap = async () => {
    const sqliteWorkerPath = "scripts/sqlite-worker.mjs"; // Must correspond to the path in your final deployed build.
    const filename = "/test.sqlite3"; // This is the name of your database. It corresponds to the path in the OPFS.

    const sqliteClient = new SqliteClient({
        type: SqliteClientTypeEnum.OpfsWorker,
        filename,
        flags: "c",
        sqliteWorkerPath,
        emitEventsToMagienoSqliteChromeExtension: true,
    })
    await sqliteClient.init();

    await sqliteClient.executeSql("CREATE TABLE IF NOT EXISTS test(a,b)");
    await sqliteClient.executeSql("INSERT INTO test VALUES(?, ?)", [6,7]);
    const results = await sqliteClient.executeSql("SELECT * FROM test");
    console.log("Results:", results);

    document.getElementById("run-query").addEventListener("click", async () => {
        // @ts-ignore
        const filename = document.getElementById("sqlite-filename").value;

        const sqliteClient = new SqliteClient({
            type: SqliteClientTypeEnum.OpfsWorker,
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