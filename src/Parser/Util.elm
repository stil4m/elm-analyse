module Parser.Util exposing (asPointer, unstrictIndentWhitespace, exactIndentWhitespace, moreThanIndentWhitespace, trimmed, commentSequence, multiLineCommentWithTrailingSpaces)

import Combine exposing (Parser, ParseLocation, succeed, many1, many, sequence, maybe, withState, or, (>>=), (<$>), (<*>), (<*), (*>))
import Parser.Comments exposing (multilineComment, singleLineComment)
import AST.Types exposing (VariablePointer)
import Parser.Whitespace exposing (many1Spaces, manySpaces, nSpaces, realNewLine)
import Parser.State exposing (State, currentIndent)
import Parser.Ranges exposing (withRange)


asPointer : Parser State String -> Parser State VariablePointer
asPointer p =
    withRange (VariablePointer <$> p)


unstrictIndentWhitespace : Parser State String
unstrictIndentWhitespace =
    (List.concat >> String.concat)
        <$> many1
                (sequence
                    [ manySpaces
                    , Maybe.withDefault "" <$> maybe someComment
                    , newLineWithSomeIndent
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
                            , newLineWithIndentExact state
                            ]
                        )
        )


multiLineCommentWithTrailingSpaces : Parser State String
multiLineCommentWithTrailingSpaces =
    succeed (++)
        <*> multilineComment
        <*> manySpaces


someComment : Parser State String
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
        <$> many1 (String.concat <$> sequence [ realNewLine, manySpaces ])


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
