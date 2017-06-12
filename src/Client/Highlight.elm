module Client.Highlight exposing (..)

import Elm.Syntax.Range exposing (Range)
import Html exposing (Html, pre, text, span)
import Html.Attributes exposing (style, id)


beforeHighlight : List String -> Range -> String
beforeHighlight targetRows { start } =
    let
        startRow =
            max 0 (start.row - 3)

        preLines =
            List.take (start.row - startRow) targetRows

        preLineText =
            List.drop (start.row - startRow) targetRows
                |> List.head
                |> Maybe.map (String.left <| start.column + 1)
                |> Maybe.map List.singleton
                |> Maybe.withDefault []
    in
        String.join "\n" (preLines ++ preLineText)


afterHighlight : List String -> Range -> String
afterHighlight targetRows { end, start } =
    let
        startRow =
            max 0 (start.row - 3)

        endRow =
            if end.column < 0 then
                end.row - 1
            else
                end.row

        endsOnLineEnding =
            end.row /= endRow

        postLineText =
            if endsOnLineEnding then
                ""
            else
                List.drop (end.row - startRow) targetRows
                    |> List.head
                    |> Maybe.map (String.dropLeft <| end.column + 1)
                    |> Maybe.withDefault ""
                    |> flip (++) "\n"

        postLines =
            (if endsOnLineEnding then
                end.row - startRow
             else
                end.row - startRow + 1
            )
                |> flip List.drop targetRows
                |> String.join "\n"
    in
        postLineText ++ postLines


highlightedString : List String -> Range -> String
highlightedString targetRows range =
    let
        startRow =
            max 0 (range.start.row - 3)

        endRow =
            if range.end.column < 0 then
                range.end.row - 1
            else
                range.end.row

        endsOnLineEnding =
            range.end.row /= endRow

        highlightedRowsFull =
            targetRows
                |> List.drop (range.start.row - startRow)
                |> List.take (endRow - range.start.row + 1)
    in
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
                        highlightedRowsFull
                            |> List.drop 1
                            |> List.take (List.length highlightedRowsFull - 2)

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
                            |> Maybe.map
                                (if endsOnLineEnding then
                                    flip (++) "\n"
                                 else
                                    String.left <| range.end.column + 1
                                )
                            |> Maybe.map List.singleton
                            |> Maybe.withDefault []
                in
                    String.join "\n" (firstHighlightedRow ++ midHighlighedRows ++ lastHighlighedRow)


highlightedPre : String -> Range -> Html msg
highlightedPre content range =
    let
        target =
            String.split "\n" content
                |> List.drop startRow
                |> List.take (endRow - range.start.row + 7)

        startRow =
            max 0 (range.start.row - 3)

        endRow =
            if range.end.column < 0 then
                range.end.row - 1
            else
                range.end.row

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
