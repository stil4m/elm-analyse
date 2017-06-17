module Client.Highlight exposing (..)

import Analyser.Messages.Range as Range exposing (Range)
import Html exposing (Html, pre, text, span)
import Html.Attributes exposing (style, id)


beforeHighlight : List String -> Range -> String
beforeHighlight targetRows range =
    let
        ( startRow, startColumn, _, _ ) =
            Range.toTuple range

        uiStartRow =
            max 0 (startRow - 3)

        preLines =
            List.take (startRow - uiStartRow) targetRows

        preLineText =
            List.drop (startRow - uiStartRow) targetRows
                |> List.head
                |> Maybe.map (String.left <| startColumn)
                |> Maybe.map List.singleton
                |> Maybe.withDefault []
    in
        String.join "\n" (preLines ++ preLineText)


afterHighlight : List String -> Range -> String
afterHighlight targetRows range =
    let
        ( startRow, _, endRow, endColumn ) =
            Range.toTuple range

        uiStartRow =
            max 0 (startRow - 3)

        endsOnLineEnding =
            False

        postLineText =
            if endsOnLineEnding then
                ""
            else
                List.drop (endRow - uiStartRow) targetRows
                    |> List.head
                    |> Maybe.map (String.dropLeft <| endColumn)
                    |> Maybe.withDefault ""
                    |> flip (++) "\n"

        postLines =
            (endRow - uiStartRow + 1)
                |> flip List.drop targetRows
                |> String.join "\n"
    in
        postLineText ++ postLines


highlightedString : List String -> Range -> String
highlightedString targetRows range =
    let
        ( startRow, startColumn, endRow, endColumn ) =
            Range.toTuple range

        uiStartRow =
            max 0 (startRow - 3)

        endsOnLineEnding =
            False

        highlightedRowsFull =
            targetRows
                |> List.drop (startRow - uiStartRow)
                |> List.take (endRow - startRow + 1)
    in
        case highlightedRowsFull of
            [] ->
                ""

            [ x ] ->
                x
                    |> (String.dropLeft <| startColumn)
                    |> String.left (endColumn - startColumn)

            _ ->
                let
                    midHighlighedRows =
                        highlightedRowsFull
                            |> List.drop 1
                            |> List.take (List.length highlightedRowsFull - 2)

                    firstHighlightedRow =
                        highlightedRowsFull
                            |> List.head
                            |> Maybe.map (String.dropLeft <| startColumn)
                            |> Maybe.map List.singleton
                            |> Maybe.withDefault []

                    lastHighlighedRow =
                        highlightedRowsFull
                            |> List.reverse
                            |> List.head
                            |> Maybe.map
                                (if endsOnLineEnding then
                                    flip (++) "\n"
                                 else
                                    String.left <| endColumn
                                )
                            |> Maybe.map List.singleton
                            |> Maybe.withDefault []
                in
                    String.join "\n" (firstHighlightedRow ++ midHighlighedRows ++ lastHighlighedRow)


highlightedPre : String -> Range -> Html msg
highlightedPre content range =
    let
        ( startRow, _, endRow, _ ) =
            Range.toTuple range

        target =
            String.split "\n" content
                |> List.drop uiStartRow
                |> List.take (endRow - startRow + 7)

        uiStartRow =
            max 0 (startRow - 3)

        preText =
            beforeHighlight target range

        postText =
            afterHighlight target range

        highlighedSection =
            highlightedString target range
    in
        pre []
            [ text preText
            , span [ id "highlight", style [ ( "color", "white" ), ( "background", "red" ) ] ] [ text highlighedSection ]
            , text postText
            ]
