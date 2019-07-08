module Client.Components.ActiveMessageDialog exposing (Info(..), Model, Msg, init, show, update, view)

import Analyser.Fixers as Fixers
import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Messages.Data as Data
import Analyser.Messages.Types exposing (Message)
import Analyser.Messages.Util as Messages
import Client.Highlight as Highlight
import Client.State
import Dialog exposing (Config)
import Elm.Syntax.Range exposing (Range)
import Html exposing (Html, button, div, h3, i, text)
import Html.Attributes exposing (class, style)
import Html.Events
import Http exposing (Error)
import RemoteData as RD exposing (RemoteData)
import Url.Builder


type alias Model =
    Maybe State


type alias State =
    { message : Message
    , ranges : List Range
    , fixing : Bool
    , codeBlock : RemoteData Error String
    }


type Msg
    = Close
    | OnFile (Result Error String)
    | Fix


show : Message -> Model -> ( Model, Cmd Msg )
show m _ =
    ( Just
        { message = m
        , ranges = Data.getRanges m.data
        , codeBlock = RD.Loading
        , fixing = False
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


type Info
    = Fixed Message


update : Msg -> Model -> ( Model, Cmd Msg, Maybe Info )
update msg model =
    case msg of
        Close ->
            ( hide model, Cmd.none, Nothing )

        OnFile x ->
            model
                |> Maybe.map (\y -> { y | codeBlock = RD.fromResult x })
                |> (\a -> ( a, Cmd.none, Nothing ))

        Fix ->
            model
                |> Maybe.map
                    (\y ->
                        ( Just { y | fixing = True }
                        , Client.State.fix y.message
                            |> Cmd.map (always Close)
                        , Just (Fixed y.message)
                        )
                    )
                |> Maybe.withDefault ( model, Cmd.none, Nothing )


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
    , footer = Just (footer state.fixing state.message)
    }


footer : Bool -> Message -> Html Msg
footer fixing message =
    Fixers.getFixer message
        |> Maybe.map (fixableFooter fixing)
        |> Maybe.withDefault (i [] [ text "Fix has to be implemented. Pull requests are welcome." ])


fixableFooter : Bool -> Fixer -> Html Msg
fixableFooter fixing fixer =
    div []
        [ button
            [ class "btn btn-success"
            , Html.Events.onClick Fix
            , Html.Attributes.disabled fixing
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
