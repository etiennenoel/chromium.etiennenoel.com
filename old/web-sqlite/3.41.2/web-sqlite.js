var SqliteMessageTypeEnum;
(function (SqliteMessageTypeEnum) {
    SqliteMessageTypeEnum["CreateDatabase"] = "CREATE_DATABASE";
    SqliteMessageTypeEnum["CreateDatabaseResult"] = "CREATE_DATABASE_RESULT";
    SqliteMessageTypeEnum["ExecuteSql"] = "EXECUTE_SQL";
    SqliteMessageTypeEnum["ExecuteSqlResult"] = "EXECUTE_SQL_RESULT";
})(SqliteMessageTypeEnum || (SqliteMessageTypeEnum = {}));class ExecuteSqlMessage {
    constructor(sqlStatement, bindingParameters = []) {
        this.sqlStatement = sqlStatement;
        this.bindingParameters = bindingParameters;
        this.type = SqliteMessageTypeEnum.ExecuteSql;
        this.uniqueId = crypto.randomUUID();
    }
}class CreateDatabaseMessage {
    constructor(filename) {
        this.filename = filename;
        this.type = SqliteMessageTypeEnum.CreateDatabase;
        this.uniqueId = crypto.randomUUID();
    }
}class WebSqlite {
    constructor(filename, sqliteWorkerPath) {
        this.filename = filename;
        this.sqliteWorkerPath = sqliteWorkerPath;
        this.queuedPromises = {};
    }
    init() {
        this.worker = new Worker(this.sqliteWorkerPath, {
            type: "module",
        });
        this.worker.onmessage = this.messageReceived.bind(this);
        const createDatabaseMessage = new CreateDatabaseMessage(this.filename);
        this.worker.postMessage(createDatabaseMessage);
        return new Promise((resolve, reject) => {
            this.queuedPromises[createDatabaseMessage.uniqueId] = {
                resolve,
                reject,
            };
        });
    }
    messageReceived(message) {
        const sqliteMessage = message.data;
        if (sqliteMessage.uniqueId !== undefined && this.queuedPromises.hasOwnProperty(sqliteMessage.uniqueId)) {
            const promise = this.queuedPromises[sqliteMessage.uniqueId];
            delete this.queuedPromises[sqliteMessage.uniqueId];
            switch (sqliteMessage.type) {
                case SqliteMessageTypeEnum.ExecuteSqlResult:
                    return promise.resolve(sqliteMessage.result);
                case SqliteMessageTypeEnum.CreateDatabaseResult:
                    return promise.resolve();
            }
        }
    }
    executeSql(sqlStatement, bindParameters = []) {
        const executeSqlMessage = new ExecuteSqlMessage(sqlStatement, bindParameters);
        this.worker.postMessage(executeSqlMessage);
        return new Promise((resolve, reject) => {
            this.queuedPromises[executeSqlMessage.uniqueId] = {
                resolve,
                reject,
            };
        });
    }
}export{WebSqlite};