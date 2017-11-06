module Client.Components.ActiveMessageDialog exposing (Model, Msg, init, show, subscriptions, update, view)

import Analyser.Messages.Range exposing (Range)
import Analyser.Messages.Types exposing (Message, MessageData(MultiLineRecordFormatting, UnformattedFile, UnnecessaryParens, UnusedImportAlias, UnusedImportedVariable, UnusedPatternVariable, UnusedTypeAlias))
import Analyser.Messages.Util as Messages
import Client.Highlight as Highlight
import Client.Socket as Socket
import Dialog exposing (Config)
import Html exposing (Html, button, div, h3, i, text)
import Html.Attributes exposing (class, style)
import Html.Events exposing (onClick)
import Http exposing (Error)
import Keyboard
import Navigation exposing (Location)
import RemoteData as RD exposing (RemoteData)
import WebSocket as WS


type alias Model =
    Maybe State


type alias State =
    { message : Message
    , ranges : List Range
    , codeBlock : RemoteData Error String
    }


type Msg
    = Close
    | OnFile (Result Error String)
    | Fix
    | NoOp
    | OnEscape Bool


show : Message -> Model -> ( Model, Cmd Msg )
show m _ =
    ( Just
        { message = m
        , ranges = Messages.getRanges m.data
        , codeBlock = RD.Loading
        }
    , Http.request
        { method = "GET"
        , headers = []
        , url = "/file?file=" ++ (String.join "," <| List.map Http.encodeUri <| Messages.messageFiles m)
        , body = Http.emptyBody
        , expect = Http.expectString
        , timeout = Nothing
        , withCredentials = False
        }
        |> Http.send OnFile
    )


hide : Model -> Model
hide =
    always Nothing


init : Model
init =
    Nothing


subscriptions : Model -> Sub Msg
subscriptions x =
    case x of
        Just _ ->
            Keyboard.downs ((==) 27 >> OnEscape)

        Nothing ->
            Sub.none


update : Location -> Msg -> Model -> ( Model, Cmd Msg )
update location msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        Close ->
            ( hide model, Cmd.none )

        OnFile x ->
            model
                |> Maybe.map (\y -> { y | codeBlock = RD.fromResult x })
                |> flip (,) Cmd.none

        Fix ->
            model
                |> Maybe.map
                    (\y ->
                        ( hide (Just y), WS.send (Socket.controlAddress location) ("fix:" ++ toString y.message.id) )
                    )
                |> Maybe.withDefault ( model, Cmd.none )

        OnEscape x ->
            if x then
                ( hide model, Cmd.none )
            else
                ( model, Cmd.none )


view : Model -> Html Msg
view model =
    model
        |> Maybe.map dialogConfig
        |> Dialog.view


dialogConfig : State -> Config Msg
dialogConfig state =
    { closeMessage = Just Close
    , containerClass = Just "message-dialog"
    , header = Just dialogHeader
    , body = Just <| dialogBody state
    , footer = footer state
    }


footer : State -> Maybe (Html Msg)
footer state =
    if not (Messages.canFix state.message.data) then
        Nothing
    else
        Just (fixableFooter state.message)


fixableFooter : Message -> Html Msg
fixableFooter message =
    case message.data of
        UnnecessaryParens _ _ ->
            div []
                [ button
                    [ class "btn btn-success"
                    , onClick Fix
                    ]
                    [ text "Remove and format" ]
                ]

        UnusedImportedVariable _ varName _ ->
            div []
                [ button
                    [ class "btn btn-success"
                    , onClick Fix
                    ]
                    [ text ("Remove '" ++ varName ++ "' from import list and format") ]
                ]

        UnformattedFile _ ->
            div []
                [ button
                    [ class "btn btn-success"
                    , onClick Fix
                    ]
                    [ text "Format" ]
                ]

        UnusedImportAlias _ moduleName _ ->
            div []
                [ button
                    [ class "btn btn-success"
                    , onClick Fix
                    ]
                    [ text <| "Remove alias '" ++ String.join "." moduleName ++ "' and format" ]
                ]

        UnusedTypeAlias _ aliasName _ ->
            div []
                [ button
                    [ class "btn btn-success"
                    , onClick Fix
                    ]
                    [ text <| "Remove type alias '" ++ aliasName ++ "' and format" ]
                ]

        UnusedPatternVariable _ _ _ ->
            div []
                [ button
                    [ class "btn btn-success"
                    , onClick Fix
                    ]
                    [ text <| "Optimize pattern and format" ]
                ]

        MultiLineRecordFormatting _ _ ->
            div []
                [ button
                    [ class "btn btn-success"
                    , onClick Fix
                    ]
                    [ text <| "Rewrite over multiple lines and format" ]
                ]

        _ ->
            i [] [ text "Fix has to be implemented. Pull requests are welcome." ]


dialogBody : State -> Html Msg
dialogBody state =
    case state.codeBlock of
        RD.NotAsked ->
            div [] []

        RD.Loading ->
            div []
                [ text "Loading..." ]

        RD.Success x ->
            viewWithFileContent state x

        RD.Failure _ ->
            div [] [ text "Something went wrong." ]


viewWithFileContent : State -> String -> Html msg
viewWithFileContent state x =
    div [ style [ ( "max-height", "400px" ), ( "overflow", "scroll" ) ] ]
        [ div []
            (List.map (Highlight.highlightedPre 3 x) state.ranges)
        , text <| Messages.asString state.message.data
        ]


dialogHeader : Html msg
dialogHeader =
    h3 [] [ text "Message" ]
