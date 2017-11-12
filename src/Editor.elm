port module Editor exposing (main)

import Analyser.State exposing (State)
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


type Msg
    = OnState (Result String State)


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


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnState newState ->
            case newState of
                Ok state ->
                    ( model
                    , editorMessages (JE.string "foo")
                    )

                Err _ ->
                    ( model, Cmd.none )
