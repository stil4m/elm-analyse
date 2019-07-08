interface Info {
    config: Config;
}
interface Config {
    format: string | undefined;
    open: boolean;
    port: number;
    elmFormatPath: string;
}

export interface DependencyPointer {
    name: string;
    version: string;
}
export interface DependencyStore {
    dependency: DependencyPointer;
    content: string;
}
export interface HttpDocumentationLoad {
    dependency: DependencyPointer;
    json: any;
}
export interface RawDependencyLoad {
    dependency: DependencyPointer;
    json: JSON | null;
}

export interface DependencyFiles {
    dependency: DependencyPointer;
    files: FileContent[];
}
export interface FileChange {
    event: string;
    file: string;
    content: string | null;
}
export interface FileStore {
    file: string;
    newContent: string;
}
export interface AstStore {
    sha1: string;
    ast: JSON;
}
export interface FixedFile {
    path: string;
    content: string;
}

export interface LogMessage {
    level: string;
    message: string;
}
interface ElmApp {
    ports: {
        log: Subscription<LogMessage>;
        sendReportValue: Subscription<Report>;
        sendState: Subscription<State>;
        sendFixedFile: Subscription<FixedFile>;
        loadContext: Subscription<void>;
        loadDependencyFiles: Subscription<DependencyPointer>;
        loadFile: Subscription<string>;
        storeAstForSha: Subscription<AstStore>;
        storeFile: Subscription<FileStore>;
        loadFileContentWithSha: Subscription<string>;
        loadHttpDocumentation: Subscription<DependencyPointer>;
        storeRawDependency: Subscription<DependencyStore>;
        loadRawDependency: Subscription<DependencyPointer>;

        fileWatch: MailBox<FileChange>;
        onReset: MailBox<boolean>;
        onFixMessage: MailBox<number>;
        onFixQuick: MailBox<number>;
        onLoadedContext: MailBox<Context>;
        onDependencyFiles: MailBox<DependencyFiles>;
        fileContent: MailBox<FileContent>;
        onStoredFiles: MailBox<boolean>;
        onFileContentWithShas: MailBox<FileContentSha>;
        onHttpDocumentation: MailBox<HttpDocumentationLoad>;
        onRawDependency: MailBox<RawDependencyLoad>;
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
    subscribe: (cb: (d: T) => void) => void;
    unsubscribe: (cb: (d: T) => void) => void;
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
    send: (d: T) => void;
}

interface Reporter {
    report: (r: Report) => void;
}

interface Report {
    messages: Message[];
    unusedDependencies: string[];
}

interface FileContent {
    path: string;
    success: boolean;
    sha1: string | null;
    content: string | null;
    ast: string | null;
}

interface State {
    status: string;
    idCount: number;
    queue: any[];
    messages: any[];
    modules: any[];
}

interface FileRef {
    version: string;
    path: string;
}

interface Message {
    id: number;
    status: string;
    file: string;
    type: string;
    data: MessageData;
}

interface MessageData {
    description: string;
    properties: { [key: string]: any };
}

export {
    Config,
    ElmApp,
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
