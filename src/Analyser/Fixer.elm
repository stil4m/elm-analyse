port module Analyser.Fixer exposing (Model, Msg, getFixedFile, init, initWithMessage, isDone, message, subscriptions, succeeded, update)

import Analyser.CodeBase as CodeBase exposing (CodeBase)
import Analyser.FileContext exposing (FileContext)
import Analyser.FileRef exposing (FileRef)
import Analyser.Fixers
import Analyser.Fixes.Base exposing (Fixer, Patch(..))
import Analyser.Messages.Data as Data
import Analyser.Messages.Types exposing (Message)
import Analyser.State as State exposing (State)
import Elm.Parser as Parser
import Elm.Processing as Processing
import Elm.Syntax.File exposing (File)
import Util.Logger as Logger


port storeFile : FileStore -> Cmd msg


port onStoredFiles : (Bool -> msg) -> Sub msg


port loadFileContentWithSha : String -> Cmd msg


port onFileContentWithShas : (FileLoad -> msg) -> Sub msg


type alias FileStore =
    { file : String
    , newContent : String
    }


type alias FileLoad =
    { file : FileRef
    , content : String
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
    State.getMessage x state |> Maybe.andThen (\a -> initWithMessage a state)


initWithMessage : Message -> State -> Maybe ( Model, Cmd Msg, State )
initWithMessage mess state =
    Analyser.Fixers.getFixer mess
        |> Maybe.map
            (\fixer ->
                ( Model { message = mess, fixer = fixer, done = False, success = True }
                , loadFileContentWithSha mess.file.path
                , State.startFixing mess state
                )
            )


getFixedFile : Message -> FileContext -> Result String String
getFixedFile mess fileContext =
    Analyser.Fixers.getFixer mess
        |> Maybe.map
            (\fixer ->
                case fixer.fix ( fileContext.content, fileContext.ast ) mess.data of
                    Error e ->
                        Err e

                    Patched p ->
                        Ok p

                    IncompatibleData ->
                        Err ("Invalid message data for fixer, message id: " ++ String.fromInt mess.id)
            )
        |> Maybe.withDefault (Err "Unable to find fixer")


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
                , Logger.warning "Could not fix file: Sha1 mismatch. Message is outdated for the corresponding file. Maybe refresh the messages."
                )

            else
                let
                    changedContent =
                        reference
                            |> (\fileLoad ->
                                    Parser.parse fileLoad.content
                                        |> Result.map (Processing.process (CodeBase.processContext codeBase))
                                        |> Result.map (\b -> ( fileLoad.content, b ))
                                        |> Result.toMaybe
                               )
                            |> Result.fromMaybe "Could not parse file"
                            |> Result.andThen (\x -> applyFix model x)
                in
                case changedContent of
                    Ok newContent ->
                        ( Model model
                        , storeFile
                            { file = model.message.file.path
                            , newContent = newContent
                            }
                        )

                    Err _ ->
                        ( Model { model | done = True, success = False }
                        , Logger.warning "Could not fix file: There was an error while loading the file."
                        )

        Stored _ ->
            ( Model { model | done = True }
            , Logger.info <| "Fixed message: " ++ Data.description model.message.data
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
fileHashEqual reference mess =
    reference.file == mess.file


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ onFileContentWithShas LoadedFileContent
        , onStoredFiles Stored
        ]
