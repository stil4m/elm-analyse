module Analyser.Messages exposing (..)

import AST.Types as AST


type Message
    = Warning WarningMessage
    | Error ErrorMessage


type ErrorMessage
    = UnreadableSourceFile String


type alias FileName =
    String


type WarningMessage
    = UnreadableDependencyFile String String
    | UnusedVariable FileName String AST.Range


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


locationToString : AST.Location -> String
locationToString { row, column } =
    "(" ++ toString row ++ "," ++ toString column ++ ")"


rangeToString : AST.Range -> String
rangeToString { start, end } =
    "(" ++ locationToString start ++ "," ++ locationToString end ++ ")"


warningAsString : WarningMessage -> String
warningAsString w =
    (++) "WARN:  " <|
        case w of
            UnusedVariable fileName varName range ->
                String.concat
                    [ "Unused variable `"
                    , varName
                    , "` in file \""
                    , fileName
                    , "\" at "
                    , rangeToString range
                    ]

            UnreadableDependencyFile dependency path ->
                String.concat
                    [ "Could not parse file in dependency"
                    , dependency
                    , ": "
                    , path
                    ]
