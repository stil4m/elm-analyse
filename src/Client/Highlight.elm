module Client.Highlight exposing (highlightedPre)

import Elm.Syntax.Range exposing (Range)
import Html exposing (Html, pre, span, text)
import Html.Attributes exposing (id, style)


beforeHighlight : Int -> List String -> Range -> String
beforeHighlight rowsAround targetRows range =
    let
        startColumn =
            range.start.column

        linesToDrop =
            range.start.row - 1 - rowsAround

        linesToKeep =
            min rowsAround (rowsAround + linesToDrop)

        preLines =
            targetRows
                |> List.drop linesToDrop
                |> List.take linesToKeep

        preLineText =
            targetRows
                |> List.drop (range.start.row - 1)
                |> List.head
                |> Maybe.map (String.left <| startColumn - 1)
                |> Maybe.map List.singleton
                |> Maybe.withDefault []
    in
    String.join "\n" (preLines ++ preLineText)


afterHighlight : Int -> List String -> Range -> String
afterHighlight rowsAround targetRows range =
    let
        ( _, endRow, endColumn ) =
            ( range.start.row, range.end.row, range.end.column )

        postLines =
            targetRows
                |> List.drop endRow
                |> List.take rowsAround

        postLineText =
            targetRows
                |> List.drop (endRow - 1)
                |> List.head
                |> Maybe.map (String.dropLeft <| endColumn - 1)
                |> Maybe.withDefault ""
    in
    String.join "\n" <| postLineText :: postLines


highlightedString : List String -> Range -> String
highlightedString targetRows range =
    let
        isMultiRow =
            range.start.row /= range.end.row

        headString : List String
        headString =
            targetRows
                |> List.drop (range.start.row - 1)
                |> List.head
                |> Maybe.map (String.dropLeft (range.start.column - 1))
                |> Maybe.map
                    (\v ->
                        if isMultiRow then
                            v

                        else
                            String.left (range.end.column - range.start.column) v
                    )
                |> Maybe.map List.singleton
                |> Maybe.withDefault []

        bodyString : List String
        bodyString =
            targetRows
                |> List.drop range.start.row
                |> List.take (range.end.row - 1 - range.start.row)

        tailString : List String
        tailString =
            if isMultiRow then
                targetRows
                    |> List.drop (range.end.row - 1)
                    |> List.head
                    |> Maybe.map (String.left range.end.column)
                    |> Maybe.map List.singleton
                    |> Maybe.withDefault []

            else
                []
    in
    String.join "\n" (headString ++ bodyString ++ tailString)


highlightedPre : Int -> String -> Range -> Html msg
highlightedPre rowsAround content range =
    if range == Elm.Syntax.Range.emptyRange then
        pre []
            [ text content
            ]

    else
        let
            lines =
                String.split "\n" content

            _ =
                ( range.start.row, range.end.row )

            preText =
                beforeHighlight rowsAround lines range

            postText =
                afterHighlight rowsAround lines range

            highlighedSection =
                highlightedString lines range
        in
        pre []
            [ text preText
            , span [ id "highlight", style "color" "white", style "background" "red" ] [ text highlighedSection ]
            , text postText
            ]
