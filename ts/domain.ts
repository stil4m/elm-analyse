interface Info {
    config: Config;
}
interface Config {
    format: string | undefined;
    open: boolean;
    port: number;
    elmFormatPath: string;
}

interface ElmApp {
    ports: {
        log: Subscription<string[]>;
        sendReportValue: Subscription<Report>;
        sendState: Subscription<State>;
        sendFixResult: Subscription<any>;
        loadContext: Subscription<any>;
        loadDependencyFiles: Subscription<string[]>;
        loadFile: Subscription<string>;
        storeAstForSha: Subscription<string[]>;
        storeFiles: Subscription<string[]>;
        loadFileContentWithSha: Subscription<string>;
        loadHttpDocumentation: Subscription<string[]>;
        storeRawDependency: Subscription<string[]>;
        loadRawDependency: Subscription<string[]>;

        fileWatch: MailBox<string[]>;
        onReset: MailBox<boolean>;
        onFixMessage: MailBox<number>;
        onLoadedContext: MailBox<Context>;
        onDependencyFiles: MailBox<any[]>;
        fileContent: MailBox<FileContent>;
        onStoredFiles: MailBox<boolean>;
        onFileContentWithShas: MailBox<FileContentSha>;
        onHttpDocumentation: MailBox<any[]>;
        onRawDependency: MailBox<string[]>;
    };
}

interface EditorData {
    progress: string;
    files: {
        [key: string]: EditorMessage[];
    };
}
interface EditorMessage {
    severity: string;
    location: {
        file: string;
        position: Array<Array<number>>;
    };
    excerpt: string;
    description: string;
}

interface EditorElmApp {
    ports: {
        stateListener: MailBox<State>;
        editorMessages: Subscription<EditorData>;
    };
}

interface Subscription<T> {
    subscribe: ((cb: ((d: T) => void)) => void);
}

interface FileContentSha {
    file: {
        version: string | null;
        path: string;
    };
    content: string | null;
}

interface Context {
    sourceFiles: string[];
    interfaceFiles: Array<string[]>;
    configuration: string;
}
interface MailBox<T> {
    send: ((d: T) => void);
}

interface Reporter {
    report: (r: Report) => void;
}

interface Report {
    messages: Message[];
    unusedDependencies: string[];
}

interface Registry {}

interface FileContent {
    path: string;
    success: boolean;
    sha1: string | null;
    content: string | null;
    ast: string | null;
}
interface State {
    status: String;
    idCount: number;
    queue: any[];
    messages: any[];
    modules: any[];
}

//TODO
interface Message {
    data: any;
}
export {
    Config,
    ElmApp,
    Registry,
    FileContent,
    Report,
    State,
    Info,
    Message,
    Reporter,
    Context,
    FileContentSha,
    EditorElmApp,
    EditorMessage,
    EditorData
};
