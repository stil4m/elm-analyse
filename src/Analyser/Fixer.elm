port module Analyser.Fixer exposing (Model, Msg, init, initWithMessage, update, subscriptions)

import Analyser.Messages.Types exposing (Message, MessageData)
import Analyser.Messages.Util as Messages
import Analyser.State as State exposing (State)
import Analyser.Fixes.UnnecessaryParens as UnnecessaryParensFixer
import Analyser.Fixes.UnusedImportedVariable as UnusedImportedVariableFixer
import Analyser.Fixes.UnusedImportAlias as UnusedImportAliasFixer
import Analyser.Fixes.UnusedPatternVariable as UnusedPatternVariableFixer
import Analyser.Fixes.UnformattedFile as UnformattedFileFixer
import Tuple3
import Parser.Parser as Parser
import Analyser.Fixes.Base exposing (Fixer)


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
    , fixer : Fixer
    , done : Bool
    , success : Bool
    , touchedFiles : List String
    }


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
                        model.fixer.fix fixData model.message.data
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


getFixer : Message -> Maybe Fixer
getFixer m =
    List.filter (\x -> x.canFix m.data) fixers
        |> List.head


fixers : List Fixer
fixers =
    [ UnnecessaryParensFixer.fixer
    , UnusedImportedVariableFixer.fixer
    , UnusedImportAliasFixer.fixer
    , UnusedPatternVariableFixer.fixer
    , UnformattedFileFixer.fixer
    ]


subscriptions : Model -> Sub Msg
subscriptions m =
    Sub.batch
        [ onFileContentWithShas LoadedFileContent
        , onStoredFiles Stored
        ]
