module Analyser.Messages exposing (..)


type Message
    = Warning WarningMessage
    | Error ErrorMessage


type ErrorMessage
    = UnreadableSourceFile String


type WarningMessage
    = UnreadableDependencyFile String String


unreadableSourceFile : String -> Message
unreadableSourceFile path =
    Error (UnreadableSourceFile path)


unreadableDependencyFile : String -> String -> Message
unreadableDependencyFile dependency path =
    Warning (UnreadableDependencyFile dependency path)


asString : Message -> String
asString m =
    case m of
        Warning w ->
            warningAsString w

        Error e ->
            errorAsString e


errorAsString : ErrorMessage -> String
errorAsString e =
    (++) "ERROR: " <|
        case e of
            UnreadableSourceFile s ->
                String.concat
                    [ "Could not parse source file: ", s ]


warningAsString : WarningMessage -> String
warningAsString w =
    (++) "WARN:  " <|
        case w of
            UnreadableDependencyFile dependency path ->
                String.concat
                    [ "Could not parse file in dependency"
                    , dependency
                    , ": "
                    , path
                    ]
