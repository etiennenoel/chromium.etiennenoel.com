import {SqliteClient} from "@magieno/sqlite-client";

const bootstrap = async () => {
    const sqliteWorkerPath = "scripts/sqlite-worker.mjs"; // Must correspond to the path in your final deployed build.
    const filename = "/test.sqlite3"; // This is the name of your database. It corresponds to the path in the OPFS.

    const webSqlite = new SqliteClient({
        // @ts-ignore
        type: "OPFS_WORKER",
        filename,
        flags: "c",
        sqliteWorkerPath,
    })
    await webSqlite.init();

    await webSqlite.executeSql("CREATE TABLE IF NOT EXISTS test(a,b)");
    await webSqlite.executeSql("INSERT INTO test VALUES(?, ?)", [6,7]);
    const results = await webSqlite.executeSql("SELECT * FROM test");
    console.log("Results:", results);
}


bootstrap();