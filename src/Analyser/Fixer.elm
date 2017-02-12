port module Analyser.Fixer exposing (..)

import Analyser.Messages.Types exposing (Message, MessageData(UnnecessaryParens))
import Analyser.State as State exposing (State)
import Analyser.Fixes.UnnecessaryParens as UnnecessaryParensFixer
import Tuple3


port storeFiles : List ( String, String ) -> Cmd msg


port loadFileContentWithShas : List String -> Cmd msg


port onFileContentWithShas : (List FileTriple -> msg) -> Sub msg


port sendFixResult : FixResult -> Cmd msg


type alias FileTriple =
    ( String, String, String )


type alias FixResult =
    { success : Bool, message : String }


type Msg
    = LoadedFileContent (List FileTriple)


type alias Model =
    { message : Message
    , fixer : FixCall
    , done : Bool
    }


type alias FixCall =
    List ( String, String ) -> MessageData -> List ( String, String )


init : Int -> State -> Maybe ( Model, Cmd Msg, State )
init x state =
    State.getMessage x state |> Maybe.andThen (flip initWithMessage state)


initWithMessage : Message -> State -> Maybe ( Model, Cmd Msg, State )
initWithMessage message state =
    getFixer message
        |> Maybe.map
            (\fixer ->
                ( { message = message, fixer = fixer, done = False }
                , loadFileContentWithShas (List.map Tuple.second message.files)
                , state
                )
            )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoadedFileContent reference ->
            let
                isEqual =
                    (List.sortBy Tuple.first (List.map Tuple3.init reference) == List.sortBy Tuple.first model.message.files)
            in
                if not isEqual then
                    ( { model | done = True }
                    , sendFixResult { success = False, message = "Sha1 mismatch. Message is outdated for the corresponding file. Maybe refresh the messages." }
                    )
                else
                    let
                        changedFiles =
                            model.fixer (List.map Tuple3.tail reference) model.message.data
                    in
                        ( { model
                            | done = True
                          }
                        , storeFiles changedFiles
                        )


getFixer : Message -> Maybe FixCall
getFixer m =
    case m.data of
        UnnecessaryParens _ _ ->
            Just UnnecessaryParensFixer.fix

        _ ->
            Nothing


subscriptions : Model -> Sub Msg
subscriptions m =
    onFileContentWithShas LoadedFileContent
