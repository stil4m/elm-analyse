port module Editor exposing (main)

import Analyser.Messages.Range
import Analyser.Messages.Types exposing (Message)
import Analyser.Messages.Util
import Analyser.State exposing (State)
import Dict exposing (Dict)
import Json.Decode as JD
import Json.Encode as JE exposing (Value)


type alias Flags =
    { serverHost : String
    , serverPort : Int
    }


type alias Model =
    { enabled : Bool
    , flags : Flags
    }


port stateListener : (Value -> msg) -> Sub msg


port editorMessages : Value -> Cmd msg


sendEditorData : EditorData -> Cmd msg
sendEditorData x =
    JE.string (toString x) |> editorMessages


encodeEditorData : EditorData -> Value
encodeEditorData editorData =
    JE.object
        [ ( "progress", Analyser.State.encodeStatus editorData.progress )
        , ( "files"
          , editorData.files
                |> Dict.map (\k v -> encodeEditorMessage v)
                |> Dict.toList
                |> JE.object
          )
        ]


encodeEditorMessage : EditorMessage -> JE.Value
encodeEditorMessage editorMessage =
    JE.object
        [ ( "severity", JE.string editorMessage.severity )
        , ( "location"
          , JE.object
                [ ( "file", JE.string editorMessage.location.file )
                , ( "postition", encodePosition editorMessage.location.position )
                ]
          )
        , ( "excerpt", JE.string editorMessage.excerpt )
        , ( "description", JE.string editorMessage.description )
        ]


encodePosition : EditorPosition -> JE.Value
encodePosition ( ( sl, sc ), ( el, ec ) ) =
    JE.list [ JE.list [ JE.int sl, JE.int sc ], JE.list [ JE.int el, JE.int ec ] ]


type Msg
    = OnState (Result String State)


type alias EditorPosition =
    ( ( Int, Int ), ( Int, Int ) )


type alias EditorMessage =
    { severity : String
    , location :
        { file : String
        , position : EditorPosition
        }
    , excerpt : String
    , description : String
    }


type alias EditorData =
    { progress : Analyser.State.Status
    , files : Dict String EditorMessage
    }


main : Program Flags Model Msg
main =
    Platform.programWithFlags
        { init = init
        , update = update
        , subscriptions = subscriptions
        }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { enabled = False, flags = flags }
    , Cmd.none
    )


subscriptions : Model -> Sub Msg
subscriptions model =
    stateListener (JD.decodeValue Analyser.State.decodeState >> OnState)


wsAddress : Flags -> String
wsAddress flags =
    "ws://"
        ++ flags.serverHost
        ++ ":"
        ++ toString flags.serverPort
        ++ "/state"
        |> Debug.log "Url"


editorFileMessages : Message -> List ( String, EditorMessage )
editorFileMessages m =
    let
        editorMessage : String -> Analyser.Messages.Range.Range -> EditorMessage
        editorMessage f r =
            let
                ( r1, r2, r3, r4 ) =
                    Analyser.Messages.Range.toTuple r
            in
            { severity = "info"
            , location =
                { file = f
                , position = ( ( r1, r2 ), ( r3, r4 ) )
                }
            , excerpt = "TODO"
            , description = "TODO"
            }
    in
    m.files
        |> List.concatMap
            (\( sha, f ) ->
                Analyser.Messages.Util.getRanges m.data
                    |> List.map (\r -> ( f, editorMessage f r ))
            )


buildEditorData : State -> EditorData
buildEditorData state =
    let
        editorFiles =
            state.messages
                |> List.concatMap editorFileMessages
                |> Dict.fromList
    in
    { progress = state.status
    , files = editorFiles
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnState newState ->
            case newState of
                Ok state ->
                    ( model
                    , sendEditorData (buildEditorData state)
                    )

                Err _ ->
                    ( model, Cmd.none )
