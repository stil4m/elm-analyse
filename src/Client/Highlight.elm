module Client.Highlight exposing (highlightedPre)

import Elm.Syntax.Range exposing (Range)
import Html exposing (Html, pre, span, text)
import Html.Attributes exposing (id, style)


beforeHighlight : Int -> List String -> Range -> String
beforeHighlight rowsAround targetRows range =
    let
        ( startRow, startColumn ) =
            ( range.start.row, range.start.column )

        uiStartRow =
            max 0 (startRow - rowsAround)

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


afterHighlight : Int -> List String -> Range -> String
afterHighlight rowsAround targetRows range =
    let
        ( startRow, endRow, endColumn ) =
            ( range.start.row, range.end.row, range.end.column )

        uiStartRow =
            max 0 (startRow - rowsAround)

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
                    |> (\a -> (++) a "\n")

        postLines =
            (endRow - uiStartRow + 1)
                |> (\a -> List.drop a targetRows)
                |> String.join "\n"
    in
    postLineText ++ postLines


highlightedString : Int -> List String -> Range -> String
highlightedString rowsAround targetRows range =
    let
        startRow =
            range.start.row

        startColumn =
            range.start.column

        endRow =
            range.end.row

        endColumn =
            range.end.column

        uiStartRow =
            max 0 (startRow - rowsAround)

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
                                \a -> (++) a "\n"

                             else
                                String.left <| endColumn
                            )
                        |> Maybe.map List.singleton
                        |> Maybe.withDefault []
            in
            String.join "\n" (firstHighlightedRow ++ midHighlighedRows ++ lastHighlighedRow)


highlightedPre : Int -> String -> Range -> Html msg
highlightedPre rowsAround content range =
    let
        ( startRow, endRow ) =
            ( range.start.row, range.end.row )

        target =
            String.split "\n" content
                |> List.drop uiStartRow
                |> List.take (endRow - startRow + (1 + 2 * rowsAround))

        uiStartRow =
            max 0 (startRow - rowsAround)

        preText =
            beforeHighlight rowsAround target range

        postText =
            afterHighlight rowsAround target range

        highlighedSection =
            highlightedString rowsAround target range
    in
    pre []
        [ text preText
        , span [ id "highlight", style "color" "white", style "background" "red" ] [ text highlighedSection ]
        , text postText
        ]
