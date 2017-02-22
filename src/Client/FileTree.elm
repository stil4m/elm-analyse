module Client.FileTree exposing (Model, Msg, init, subscriptions, update, view)

import Navigation exposing (Location)
import Html exposing (Html, text, span, div, a)
import Html.Attributes exposing (class, style)
import Html.Events exposing (onClick)
import Json.Decode as JD exposing (string, list)
import Analyser.State as State exposing (State)
import Analyser.Messages.Types exposing (Message)
import Http
import WebSocket as WS
import Client.Socket exposing (dashboardAddress)
import Time
import Client.Messages as M


type alias Model =
    { hideGoodFiles : Bool
    , tree : Maybe (List String)
    , state : Maybe State
    , fileIndex : Maybe FileIndex
    , selectedFile : Maybe String
    }


type alias FileIndex =
    List ( String, List Message )


type Msg
    = OnFileTree (Result Http.Error (List String))
    | NewState (Result String State)
    | Focus Message
    | OnSelectFile String
    | Tick


init : Location -> ( Model, Cmd Msg )
init location =
    ( { tree = Nothing, hideGoodFiles = True, state = Nothing, fileIndex = Nothing, selectedFile = Nothing }
    , Cmd.batch
        [ Http.get "/tree" (list string) |> Http.send OnFileTree
        , WS.send (dashboardAddress location) "ping"
        ]
    )


subscriptions : Location -> Model -> Sub Msg
subscriptions location model =
    Sub.batch
        [ WS.listen (dashboardAddress location) (JD.decodeString State.decodeState >> NewState)
        , Time.every (Time.second * 10) (always Tick)
        ]


updateFileIndex : Model -> Model
updateFileIndex m =
    let
        messagesForFile file state =
            state.messages
                |> List.filter
                    (\m ->
                        List.map Tuple.second m.files
                            |> List.member file
                    )
                |> Debug.log "Ms"

        buildTree state tree =
            List.map (\file -> ( file, messagesForFile file state )) tree
    in
        { m | fileIndex = Maybe.map2 buildTree m.state m.tree }


update : Location -> Msg -> Model -> ( Model, Cmd Msg )
update location msg model =
    case msg of
        OnFileTree x ->
            case x of
                Ok value ->
                    ( { model | tree = Just value } |> updateFileIndex
                    , Cmd.none
                    )

                Err _ ->
                    ( model
                    , Cmd.none
                    )

        NewState s ->
            ( { model | state = Result.toMaybe s } |> updateFileIndex
            , Cmd.none
            )

        Tick ->
            ( model
            , WS.send (dashboardAddress location) "ping"
            )

        OnSelectFile x ->
            ( { model | selectedFile = Just x }, Cmd.none )

        Focus _ ->
            ( model
            , Cmd.none
            )


view : Model -> Html Msg
view m =
    let
        allowFile ( _, mess ) =
            if m.hideGoodFiles then
                List.length mess > 0
            else
                True

        asItem ( fileName, messages ) =
            a
                [ class "list-group-item", onClick (OnSelectFile fileName) ]
                [ span [ class "badge" ] [ text <| toString (List.length messages) ]
                , text fileName
                ]
    in
        case m.fileIndex of
            Just fileIndex ->
                div [ class "row", style [ ( "padding-top", "10px" ) ] ]
                    [ div [ class "col-md-6 col-sm-6", style [ ( "margin-top", "10px" ) ] ]
                        [ div [ class "list-group" ]
                            (fileIndex
                                |> List.filter allowFile
                                |> List.map asItem
                            )
                        ]
                    , div [ class "col-md-6 col-sm-6" ]
                        [ div [ class "list-group" ]
                            [ fileIndex
                                |> List.filter (Tuple.first >> Just >> (==) m.selectedFile)
                                |> List.head
                                |> Maybe.map (Tuple.second >> M.viewAll Focus)
                                |> Maybe.withDefault (div [] [])
                            ]
                        ]
                    ]

            _ ->
                div [] []
