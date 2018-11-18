module Client.Components.ActiveMessageDialog exposing (Model, Msg, init, show, subscriptions, update, view)

import Analyser.Fixers as Fixers
import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Messages.Data as Data
import Analyser.Messages.Types exposing (Message)
import Analyser.Messages.Util as Messages
import Browser.Events
import Client.Dialog as Dialog exposing (Config)
import Client.Highlight as Highlight
import Client.Socket as Socket
import Elm.Syntax.Range exposing (Range)
import Html exposing (Html, button, div, h3, i, text)
import Html.Attributes exposing (class, style)
import Html.Events
import Http exposing (Error)
import Json.Decode as JD
import RemoteData as RD exposing (RemoteData)
import Url exposing (Url)
import Url.Builder


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
    | OnEscape Bool


show : Message -> Model -> ( Model, Cmd Msg )
show m _ =
    ( Just
        { message = m
        , ranges = Data.getRanges m.data
        , codeBlock = RD.Loading
        }
    , Http.request
        { method = "GET"
        , headers = []
        , url = Url.Builder.absolute [ "file" ] [ Url.Builder.string "file" <| Messages.messageFile m ]
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
            Browser.Events.onKeyDown (JD.int |> JD.map ((==) 27) |> JD.map OnEscape)

        Nothing ->
            Sub.none


update : Url -> Msg -> Model -> ( Model, Cmd Msg )
update location msg model =
    case msg of
        Close ->
            ( hide model, Cmd.none )

        OnFile x ->
            model
                |> Maybe.map (\y -> { y | codeBlock = RD.fromResult x })
                |> (\a -> ( a, Cmd.none ))

        Fix ->
            model
                |> Maybe.map
                    (\y ->
                        ( hide (Just y)
                        , Debug.todo "Implement FIX"
                        )
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
    , header = Just <| dialogHeader state
    , body = Just <| dialogBody state
    , footer = Just (footer state.message)
    }


footer : Message -> Html Msg
footer message =
    Fixers.getFixer message
        |> Maybe.map fixableFooter
        |> Maybe.withDefault (i [] [ text "Fix has to be implemented. Pull requests are welcome." ])


fixableFooter : Fixer -> Html Msg
fixableFooter fixer =
    div []
        [ button
            [ class "btn btn-success"
            , Html.Events.onClick Fix
            ]
            [ text fixer.description ]
        ]


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
    div [ style "max-height" "400px", style "overflow" "auto" ]
        [ div []
            (List.map (Highlight.highlightedPre 3 x) state.ranges)
        , text <| Data.description state.message.data
        ]


dialogHeader : State -> Html msg
dialogHeader state =
    let
        filePath =
            state.message.file.path
    in
    h3 [] [ text <| "Message (" ++ filePath ++ ")" ]
