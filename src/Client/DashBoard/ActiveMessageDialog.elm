module Client.DashBoard.ActiveMessageDialog exposing (..)

import AST.Ranges exposing (Range)
import Analyser.Messages.Types exposing (MessageData)
import Analyser.Messages.Util as Messages
import Dialog exposing (Config)
import Html exposing (div, pre, text, Html, span, h3)
import Html.Attributes exposing (style)
import Http exposing (Error)
import RemoteData as RD exposing (RemoteData)


type alias Model =
    Maybe State


type alias State =
    { message : MessageData
    , ranges : List Range
    , codeBlock : RemoteData Error String
    }


type Msg
    = Close
    | OnFile (Result Error String)


show : MessageData -> Model -> ( Model, Cmd Msg )
show m _ =
    ( Just
        { message = m
        , ranges = Messages.getRanges m
        , codeBlock = RD.Loading
        }
    , Http.request
        { method = "GET"
        , headers = []
        , url = "http://localhost:3000/file?file=" ++ (String.join "," <| List.map Http.encodeUri (Messages.getFiles m))
        , body = Http.emptyBody
        , expect = Http.expectString
        , timeout = Nothing
        , withCredentials = False
        }
        |> Http.send OnFile
    )


hide : Model -> Model
hide =
    (always Nothing)


init : Model
init =
    Nothing


update : Msg -> Model -> Model
update msg model =
    case msg of
        Close ->
            hide model

        OnFile x ->
            model
                |> Maybe.map (\y -> { y | codeBlock = RD.fromResult x })


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
    , footer = Nothing
    }


dialogBody : State -> Html Msg
dialogBody state =
    case state.codeBlock of
        RD.NotAsked ->
            div [] []

        RD.Loading ->
            div [] [ text "Loading..." ]

        RD.Success x ->
            div []
                [ div []
                    (List.map (renderRange x) state.ranges)
                , text <| Messages.asString state.message
                ]

        RD.Failure _ ->
            div [] [ text "Something went wrong." ]


renderRange : String -> Range -> Html msg
renderRange content range =
    let
        lines =
            String.split "\n" content

        startRow =
            max 0 (range.start.row - 3)

        endRow =
            if range.end.column < 0 then
                range.end.row - 1
            else
                range.end.row

        endsOnLineEnding =
            (range.end.row /= endRow)

        target =
            lines
                |> List.drop startRow
                |> List.take (endRow - range.start.row + 7)

        preLines =
            List.take (range.start.row - startRow) target

        preLineText =
            List.drop (range.start.row - startRow) target
                |> List.head
                |> Maybe.map (String.left <| range.start.column + 1)
                |> Maybe.map List.singleton
                |> Maybe.withDefault []

        preText =
            String.join "\n" (preLines ++ preLineText)

        postLineText =
            if endsOnLineEnding then
                ""
            else
                List.drop (range.end.row - startRow) target
                    |> List.head
                    |> Maybe.map (String.dropLeft <| range.end.column + 1)
                    |> Maybe.withDefault ""
                    |> flip (++) "\n"

        postLines =
            (if endsOnLineEnding then
                range.end.row - startRow
             else
                range.end.row - startRow + 1
            )
                |> flip List.drop target
                |> String.join "\n"

        highlightedRowsFull =
            target
                |> List.drop (range.start.row - startRow)
                |> List.take (endRow - range.start.row + 1)

        highlighedSection =
            case highlightedRowsFull of
                [] ->
                    ""

                [ x ] ->
                    x
                        |> (String.dropLeft <| range.start.column + 1)
                        |> if range.end.row /= endRow then
                            identity >> flip (++) "\n"
                           else
                            String.left (range.end.column - range.start.column)

                _ ->
                    let
                        midHighlighedRows =
                            highlightedRowsFull |> List.drop 1 |> List.take (List.length highlightedRowsFull - 1)

                        firstHighlightedRow =
                            highlightedRowsFull
                                |> List.head
                                |> Maybe.map (String.dropLeft <| range.start.column + 1)
                                |> Maybe.map List.singleton
                                |> Maybe.withDefault []

                        lastHighlighedRow =
                            highlightedRowsFull
                                |> List.reverse
                                |> List.head
                                |> Maybe.map (String.left <| range.start.column + 1)
                                |> Maybe.map List.singleton
                                |> Maybe.withDefault []
                    in
                        String.join "\n" (firstHighlightedRow ++ midHighlighedRows ++ lastHighlighedRow)
    in
        pre []
            [ preText |> text
            , span [ style [ ( "color", "white" ), ( "background", "red" ) ] ] [ text highlighedSection ]
            , span [ style [ ( "color", "" ), ( "background", "" ) ] ] [ text postLineText ]
            , span [ style [ ( "color", "" ), ( "background", "" ) ] ] [ text postLines ]
            ]


dialogHeader : Html msg
dialogHeader =
    h3 [] [ text "Message" ]
