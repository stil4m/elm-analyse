module Parser.Util exposing (withRange, asPointer, unstrictIndentWhitespace, exactIndentWhitespace, moreThanIndentWhitespace, trimmed, commentSequence, multiLineCommentWithTrailingSpaces)

import Combine exposing (Parser, ParseLocation, succeed, withLocation, many1, many, sequence, maybe, withState, or, (>>=), (<$>), (<*>), (<*), (*>))
import Parser.Comments exposing (multilineComment, singleLineComment)
import AST.Types exposing (VariablePointer)
import AST.Ranges exposing (Range, Location)
import Parser.Whitespace exposing (many1Spaces, manySpaces, nSpaces, realNewLine)
import Parser.State exposing (State, currentIndent)


asPointerLocation : ParseLocation -> Location
asPointerLocation { line, column } =
    { row = line, column = column }


asPointer : Parser State String -> Parser State VariablePointer
asPointer p =
    withRange (VariablePointer <$> p)


withRange : Parser State (Range -> a) -> Parser State a
withRange p =
    withLocation
        (\start ->
            p
                >>= \pResult ->
                        withLocation
                            (\end ->
                                succeed <|
                                    pResult
                                        { start = asPointerLocation start
                                        , end = asPointerLocation end
                                        }
                            )
        )


unstrictIndentWhitespace : Parser State String
unstrictIndentWhitespace =
    (List.concat >> String.concat)
        <$> many1
                (sequence
                    [ manySpaces
                    , Maybe.withDefault "" <$> maybe someComment
                    , String.concat <$> many1 newLineWithSomeIndent
                    ]
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


commentSequence : Parser State String
commentSequence =
    String.concat
        <$> many
                (or someComment
                    (String.concat
                        <$> sequence
                                [ realNewLine
                                , manySpaces
                                , someComment
                                ]
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
                (String.concat
                    <$> many1
                            (String.concat
                                <$> sequence
                                        [ manySpaces
                                        , commentSequence
                                        , newLineWithIndentPlus state
                                        ]
                            )
                )
                (succeed (++)
                    <*> many1Spaces
                    <*> (Maybe.withDefault "" <$> maybe someComment)
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
                                <*> manySpaces
                                <*> realNewLine
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
