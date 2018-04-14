port module Analyser.Fixer exposing (Model, Msg, init, initWithMessage, isDone, message, subscriptions, succeeded, update)

import Analyser.CodeBase as CodeBase exposing (CodeBase)
import Analyser.FileRef exposing (FileRef)
import Analyser.Fixers
import Analyser.Fixes.Base exposing (Fixer, Patch(..))
import Analyser.Messages.Data as Data
import Analyser.Messages.Types exposing (Message)
import Analyser.State as State exposing (State)
import Elm.Parser as Parser
import Elm.Processing as Processing
import Elm.Syntax.File exposing (File)


port storeFiles : ( String, String ) -> Cmd msg


port onStoredFiles : (Bool -> msg) -> Sub msg


port loadFileContentWithSha : String -> Cmd msg


port onFileContentWithShas : (FileLoad -> msg) -> Sub msg


port sendFixResult : FixResult -> Cmd msg


type alias FileLoad =
    { file : FileRef
    , content : String
    }


type alias FixResult =
    { success : Bool
    , message : String
    }


type Msg
    = LoadedFileContent FileLoad
    | Stored Bool


type Model
    = Model InnerModel


type alias InnerModel =
    { message : Message
    , fixer : Fixer
    , done : Bool
    , success : Bool
    }


init : Int -> State -> Maybe ( Model, Cmd Msg, State )
init x state =
    State.getMessage x state |> Maybe.andThen (flip initWithMessage state)


initWithMessage : Message -> State -> Maybe ( Model, Cmd Msg, State )
initWithMessage message state =
    Analyser.Fixers.getFixer message
        |> Maybe.map
            (\fixer ->
                ( Model { message = message, fixer = fixer, done = False, success = True }
                , loadFileContentWithSha message.file.path
                , State.startFixing message state
                )
            )


isDone : Model -> Bool
isDone (Model m) =
    m.done


succeeded : Model -> Bool
succeeded (Model m) =
    m.success


message : Model -> Message
message (Model m) =
    m.message


update : CodeBase -> Msg -> Model -> ( Model, Cmd Msg )
update codeBase msg (Model model) =
    case msg of
        LoadedFileContent reference ->
            if not (fileHashEqual reference model.message) then
                ( Model { model | done = True, success = False }
                , sendFixResult
                    { success = False
                    , message = "Sha1 mismatch. Message is outdated for the corresponding file. Maybe refresh the messages."
                    }
                )
            else
                let
                    changedContent =
                        reference
                            |> (\fileLoad ->
                                    Parser.parse fileLoad.content
                                        |> Result.map (Processing.process (CodeBase.processContext codeBase))
                                        |> Result.map ((,) fileLoad.content)
                                        |> Result.toMaybe
                               )
                            |> Result.fromMaybe "Could not parse file"
                            |> Result.andThen (\x -> applyFix model x)
                in
                case changedContent of
                    Ok newContent ->
                        ( Model model
                        , storeFiles ( model.message.file.path, newContent )
                        )

                    Err e ->
                        ( Model { model | done = True, success = False }
                        , sendFixResult
                            { success = False
                            , message = e
                            }
                        )

        Stored _ ->
            ( Model { model | done = True }
            , sendFixResult
                { success = True
                , message = "Fixed message: " ++ Data.description model.message.data
                }
            )


applyFix : InnerModel -> ( String, File ) -> Result String String
applyFix model pair =
    case model.fixer.fix pair model.message.data of
        Error e ->
            Err e

        Patched p ->
            Ok p

        IncompatibleData ->
            Err ("Invalid message data for fixer " ++ model.fixer.canFix)


fileHashEqual : FileLoad -> Message -> Bool
fileHashEqual reference message =
    reference.file == message.file


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ onFileContentWithShas LoadedFileContent
        , onStoredFiles Stored
        ]
