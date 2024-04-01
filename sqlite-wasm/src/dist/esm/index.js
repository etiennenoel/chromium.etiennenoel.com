var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SqliteClient } from "@magieno/sqlite-client";
const bootstrap = () => __awaiter(void 0, void 0, void 0, function* () {
    const sqliteWorkerPath = "scripts/sqlite-worker.mjs";
    const filename = "/test.sqlite3";
    const sqliteClient = new SqliteClient({
        type: "OPFS_WORKER",
        filename,
        flags: "c",
        sqliteWorkerPath,
    });
    yield sqliteClient.init();
    yield sqliteClient.executeSql("CREATE TABLE IF NOT EXISTS test(a,b)");
    yield sqliteClient.executeSql("INSERT INTO test VALUES(?, ?)", [6, 7]);
    const results = yield sqliteClient.executeSql("SELECT * FROM test");
    console.log("Results:", results);
    window["magieno"] = window["magieno"] || {};
    window["magieno"]["sqlite"] = window["magieno"]["sqlite"] || {};
    window["magieno"]["sqlite"]["workerPath"] = sqliteWorkerPath;
    window["magieno"]["sqlite"]["client"] = SqliteClient;
    window.addEventListener('MAGIENO_SQLITE_CLIENT_FROM_EXTENSION', (evt) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("In page, received:", evt);
        const detail = evt.detail;
        if (detail.type === "EXECUTE_SQL_QUERY") {
            const client = new window["magieno"]["sqlite"]["client"]({
                type: "OPFS_WORKER",
                filename: detail.filename,
                flags: "c",
                sqliteWorkerPath: window["magieno"]["sqlite"]["workerPath"],
            });
            yield client.init();
            const response = yield client.executeSql(detail.query, [], "resultRows", "object");
            window.dispatchEvent(new CustomEvent("MAGIENO_SQLITE_CLIENT_TO_EXTENSION", {
                detail: { "type": "EXECUTE_SQL_QUERY_RESULT", "uniqueId": detail.uniqueId, "filename": detail.filename, "response": response }
            }));
        }
    }));
    document.getElementById("run-query").addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const filename = document.getElementById("sqlite-filename").value;
        const sqliteClient = new SqliteClient({
            type: "OPFS_WORKER",
            filename,
            flags: "c",
            sqliteWorkerPath,
        });
        yield sqliteClient.init();
        const query = document.getElementById("query").value;
        const response = yield sqliteClient.executeSql(query, [], "resultRows", "object");
        document.getElementById("query-results").textContent = JSON.stringify(response);
    }));
});
bootstrap();
//# sourceMappingURL=index.js.map