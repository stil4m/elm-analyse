module Parser.Util exposing (..)

import Combine exposing (..)
import Combine.Char exposing (..)
import Parser.Comments exposing (..)
import AST.Types exposing (..)
import Parser.Whitespace exposing (many1Spaces, manySpaces, nSpaces, realNewLine)


nextChars : Int -> Parser a String
nextChars i =
    lazy
        (\() ->
            lookAhead (String.fromList <$> count i anyChar) |> map (Debug.log "Next Char")
        )


nextChar : Parser a Char
nextChar =
    lazy
        (\() ->
            lookAhead anyChar |> map (Debug.log "Next Char")
        )


printLocation : String -> Parser a String
printLocation s =
    withLocation (Debug.log s >> (always (succeed "")))


unstrictIndentWhitespace : Parser State String
unstrictIndentWhitespace =
    withState
        (\state ->
            (List.concat >> String.concat)
                <$> many1
                        (sequence
                            [ manySpaces
                            , Maybe.withDefault "" <$> maybe (someComment)
                            , (String.concat) <$> many1 newLineWithSomeIndent
                            ]
                        )
        )


exactIndentWhitespace : Parser State String
exactIndentWhitespace =
    withState
        (\state ->
            (List.concat >> String.concat)
                <$> many1
                        (sequence
                            [ manySpaces
                            , Maybe.withDefault "" <$> maybe someComment
                            , String.concat <$> many1 (newLineWithIndentExact state)
                            ]
                        )
        )


multiLineCommentWithTrailingSpaces : Parser s String
multiLineCommentWithTrailingSpaces =
    succeed (++)
        <*> multilineComment
        <*> manySpaces


someComment : Parser a String
someComment =
    or singleLineComment
        multiLineCommentWithTrailingSpaces


maybeNewLineWithStartOfComment : Parser State String
maybeNewLineWithStartOfComment =
    String.concat
        <$> (sequence
                [ Maybe.withDefault "" <$> maybe realNewLine
                , manySpaces
                , someComment
                ]
            )


commentSequence : Parser State String
commentSequence =
    String.concat
        <$> (many
                (or (someComment)
                    (String.concat
                        <$> sequence
                                [ realNewLine
                                , manySpaces
                                , someComment
                                ]
                    )
                )
            )


trimmed : Parser State x -> Parser State x
trimmed x =
    maybe moreThanIndentWhitespace *> x <* maybe moreThanIndentWhitespace


moreThanIndentWhitespace : Parser State String
moreThanIndentWhitespace =
    withState
        (\state ->
            or
                ((List.concat >> String.concat)
                    <$> (many1
                            (sequence
                                [ manySpaces
                                , commentSequence
                                , newLineWithIndentPlus state
                                ]
                            )
                        )
                )
                (succeed (++)
                    <*> many1Spaces
                    <*> (Maybe.withDefault "" <$> (maybe someComment))
                )
        )


newLineWithSomeIndent : Parser State String
newLineWithSomeIndent =
    String.concat
        <$> sequence
                [ realNewLine
                , String.concat
                    <$> many
                            (succeed (++)
                                <*> manySpaces
                                <*> realNewLine
                            )
                , manySpaces
                ]


newLineWithIndentExact : State -> Parser State String
newLineWithIndentExact state =
    String.concat
        <$> sequence
                [ realNewLine
                , String.concat
                    <$> many
                            (succeed (++)
                                <*> (manySpaces)
                                <*> (realNewLine)
                            )
                , nSpaces (currentIndent state)
                ]


newLineWithIndentPlus : State -> Parser State String
newLineWithIndentPlus state =
    String.concat
        <$> many1
                (String.concat
                    <$> sequence
                            [ realNewLine
                            , String.concat
                                <$> many
                                        (succeed (++)
                                            <*> manySpaces
                                            <*> realNewLine
                                        )
                            , nSpaces (currentIndent state)
                            , many1Spaces
                            ]
                )
