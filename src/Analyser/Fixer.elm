port module Analyser.Fixer exposing (..)

import Analyser.Messages.Types
    exposing
        ( Message
        , MessageData(UnnecessaryParens, UnusedImportedVariable, UnformattedFile, UnusedImportAlias, UnusedPatternVariable)
        )
import Analyser.Messages.Util as Messages
import Analyser.State as State exposing (State)
import Analyser.Fixes.UnnecessaryParens as UnnecessaryParensFixer
import Analyser.Fixes.UnusedImportedVariable as UnusedImportedVariableFixer
import Analyser.Fixes.UnusedImportAlias as UnusedImportAliasFixer
import Analyser.Fixes.UnusedPatternVariable as UnusedPatternVariableFixer
import Tuple3
import Parser.Parser as Parser
import AST.Types exposing (File)


port storeFiles : List ( String, String ) -> Cmd msg


port onStoredFiles : (Bool -> msg) -> Sub msg


port loadFileContentWithShas : List String -> Cmd msg


port onFileContentWithShas : (List FileTriple -> msg) -> Sub msg


port sendFixResult : FixResult -> Cmd msg


type alias FileTriple =
    ( String, String, String )


type alias FixResult =
    { success : Bool
    , message : String
    }


type Msg
    = LoadedFileContent (List FileTriple)
    | Stored Bool


type alias Model =
    { message : Message
    , fixer : FixCall
    , done : Bool
    , success : Bool
    , touchedFiles : List String
    }


type alias FixCall =
    List ( String, String, File ) -> MessageData -> List ( String, String )


init : Int -> State -> Maybe ( Model, Cmd Msg, State )
init x state =
    State.getMessage x state |> Maybe.andThen (flip initWithMessage state)


initWithMessage : Message -> State -> Maybe ( Model, Cmd Msg, State )
initWithMessage message state =
    getFixer message
        |> Maybe.map
            (\fixer ->
                ( { message = message, fixer = fixer, done = False, success = True, touchedFiles = [] }
                , loadFileContentWithShas (List.map Tuple.second message.files)
                , State.startFixing message state
                )
            )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoadedFileContent reference ->
            if not (fileHashesEqual reference model.message) then
                ( { model | done = True, success = False }
                , sendFixResult { success = False, message = "Sha1 mismatch. Message is outdated for the corresponding file. Maybe refresh the messages." }
                )
            else
                let
                    -- TODO If parse failed?
                    fixData =
                        reference
                            |> List.filterMap
                                (\( _, path, content ) ->
                                    Parser.parse content |> Maybe.map ((,,) path content)
                                )

                    changedFiles =
                        model.fixer fixData model.message.data
                in
                    ( { model | touchedFiles = List.map Tuple.first changedFiles }
                    , storeFiles changedFiles
                    )

        Stored _ ->
            ( { model | done = True }
            , sendFixResult
                { success = True
                , message = "Fixed message: " ++ Messages.asString model.message.data
                }
            )


fileHashesEqual : List FileTriple -> Message -> Bool
fileHashesEqual reference message =
    List.sortBy Tuple.first (List.map Tuple3.init reference) == List.sortBy Tuple.first message.files


getFixer : Message -> Maybe FixCall
getFixer m =
    -- TODO Rewrite this
    case m.data of
        UnnecessaryParens _ _ ->
            Just UnnecessaryParensFixer.fix

        UnusedImportedVariable _ _ _ ->
            Just UnusedImportedVariableFixer.fix

        UnformattedFile _ ->
            Just (\x y -> List.map Tuple3.init x)

        UnusedImportAlias _ _ _ ->
            Just UnusedImportAliasFixer.fix

        UnusedPatternVariable _ _ _ ->
            Just UnusedPatternVariableFixer.fix

        _ ->
            Nothing


subscriptions : Model -> Sub Msg
subscriptions m =
    Sub.batch
        [ onFileContentWithShas LoadedFileContent
        , onStoredFiles Stored
        ]
