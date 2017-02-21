module Parser.Util exposing (asPointer, unstrictIndentWhitespace, exactIndentWhitespace, moreThanIndentWhitespace, trimmed, commentSequence, multiLineCommentWithTrailingSpaces)

import AST.Types exposing (VariablePointer)
import Combine exposing ((*>), (<$>), (<*), mapError, (<*>), (>>=), choice, fail, map, regex, ParseLocation, Parser, lookAhead, many, many1, maybe, or, sequence, succeed, withState)
import Parser.Comments exposing (multilineComment, singleLineComment)
import Parser.Ranges exposing (withRange)
import Parser.State exposing (State, currentIndent)
import Parser.Whitespace exposing (many1Spaces, manySpaces, nSpaces, realNewLine)


asPointer : Parser State String -> Parser State VariablePointer
asPointer p =
    withRange (VariablePointer <$> p)


unstrictIndentWhitespace : Parser State String
unstrictIndentWhitespace =
    -- or ((regex "(\\n\\t )+" |> map (Debug.log "T") |> mapError (Debug.log "E")) <* (lookAhead (regex "[a-zA-Z0-9]")) |> map (Debug.log "S"))
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
            choice
                [ ((regex ("( *\\n)+ {" ++ toString (currentIndent state) ++ "}")) <* (lookAhead (regex "[a-zA-Z0-9\\(\\+/*\\|\\>]")))
                , (List.concat >> String.concat)
                    <$> many1
                            (sequence
                                [ manySpaces
                                , Maybe.withDefault "" <$> maybe someComment
                                , newLineWithIndentExact state
                                ]
                            )
                ]
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
            choice
                [ (regex ("(( *\\n)+ {" ++ toString (currentIndent state) ++ "} +| +)"))
                    <* (lookAhead (regex "[a-zA-Z0-9\\(\\+/*\\|\\>]"))
                , (String.concat
                    <$> many1
                            (String.concat
                                <$> sequence
                                        [ manySpaces
                                        , commentSequence
                                        , newLineWithIndentPlus state
                                        ]
                            )
                  )
                , (succeed (++)
                    <*> many1Spaces
                    <*> (Maybe.withDefault "" <$> maybe someComment)
                  )
                ]
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
