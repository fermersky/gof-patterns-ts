`
In plain words:
Simple factory simply generates an instance for client without exposing any instantiation logic to the client

Wikipedia says:
In object-oriented programming (OOP), a factory is an object for creating other objects - formally a factory is a 
function or method that returns objects of a varying prototype or class from some method call, 
which is assumed to be "new".
`;

interface IDBSession {
  connect(): void;
}

class PostgresSession implements IDBSession {
  constructor(private connString: string) {}
  connect(): void {
    console.log("connecting to the Postgres");
  }
}

class MysqlSession implements IDBSession {
  constructor(private connString: string) {}
  connect(): void {
    console.log("connecting to the MySQL");
  }
}

class MongodbSession implements IDBSession {
  constructor(private connString: string) {}
  connect(): void {
    console.log("connecting to the Mongodb");
  }
}

type EngineType = "postgres" | "mysql" | "mongodb";

interface IDBConnectionConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  database?: string;
}

interface IPostgresConnectionConfig extends IDBConnectionConfig {}
interface IMySQLConnectionConfig extends IDBConnectionConfig {}
interface IMongodbConnectionConfig extends IDBConnectionConfig {
  authSource?: string;
}

interface ICreateSessionConfig {
  engine: EngineType;
  postgres?: IPostgresConnectionConfig;
  mysql?: IMySQLConnectionConfig;
  mongodb?: IMongodbConnectionConfig;
}

class DBSessionBuilder {
  constructor() {}

  // Simple Factory method
  public static createSession(config: ICreateSessionConfig): IDBSession {
    const { engine } = config;

    const engineToSessionClass = {
      postgres: PostgresSession,
      mysql: MysqlSession,
      mongodb: MongodbSession,
    };

    const SessionClass = engineToSessionClass[engine];
    let connString = "";

    if (engine == "postgres") {
      connString = this.buildPostgresConnString(config.postgres as IPostgresConnectionConfig);
    } else if (engine == "mysql") {
      connString = this.buildMysqlConnString(config.mysql as IMySQLConnectionConfig);
    } else if (engine == "mongodb") {
      connString = this.buildMongodbConnString(config.mongodb as IMongodbConnectionConfig);
    }

    return new SessionClass(connString);
  }

  private static buildPostgresConnString(config: IPostgresConnectionConfig): string {
    return `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
  }

  private static buildMysqlConnString(config: IMySQLConnectionConfig): string {
    return `mysql://${config.user}@${config.host}:${config.port}/${config.database}`;
  }

  private static buildMongodbConnString(config: IMongodbConnectionConfig): string {
    return `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}?authSource=${
      config.authSource || "admin"
    }`;
  }
}

const connection = DBSessionBuilder.createSession({
  engine: "postgres",
  postgres: {
    host: "127.0.0.1",
    password: "123",
    database: "postgres",
    user: "root",
    port: 5432,
  },
});
connection.connect();
