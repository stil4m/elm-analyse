module Parser.Util exposing (..)

import Combine exposing (..)
import Combine.Char exposing (..)
import Parser.Types exposing (..)
import List.Extra as List
import Parser.Comments exposing (..)


nextChar : Parser a Char
nextChar =
    lazy
        (\() ->
            lookAhead anyChar |> map (Debug.log "Next Char")
        )


exactIndentWhitespace : Parser State String
exactIndentWhitespace =
    withState
        (\state ->
            (List.concat >> List.concat >> String.fromList)
                <$> many1
                        (sequence
                            [ many (char ' ')
                            , Maybe.withDefault [] <$> maybe (String.toList <$> someComment)
                            , List.concat <$> many1 (newLineWithIndentExact state)
                            ]
                        )
        )


someComment : Parser a String
someComment =
    (or singleLineComment multilineComment)


maybeNewLineWithStartOfComment : Parser State String
maybeNewLineWithStartOfComment =
    String.concat
        <$> (sequence
                [ Maybe.withDefault "" <$> maybe (string "\n")
                , String.fromList <$> (many (char ' '))
                , someComment
                ]
            )


commentSequence : Parser State (List Char)
commentSequence =
    List.concat
        <$> (many
                (or (String.toList <$> someComment)
                    (List.concat
                        <$> sequence
                                [ List.singleton <$> char '\n'
                                , many (char ' ')
                                , String.toList <$> someComment
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
                ((List.concat >> List.concat >> String.fromList)
                    <$> (many1
                            (sequence
                                [ many (char ' ')
                                , commentSequence
                                , newLineWithIndentPlus state
                                ]
                            )
                        )
                )
                (String.fromList <$> many1 (char ' '))
        )


newLineWithIndentExact : State -> Parser State (List Char)
newLineWithIndentExact state =
    List.concat
        <$> sequence
                [ List.singleton <$> char '\n'
                , List.concat
                    <$> many
                            (succeed (++)
                                <*> (many (char ' '))
                                <*> (List.singleton <$> char '\n')
                            )
                , count (currentIndent state) (char ' ')
                ]


newLineWithIndentPlus : State -> Parser State (List Char)
newLineWithIndentPlus state =
    List.concat
        <$> many1
                (List.concat
                    <$> sequence
                            [ List.singleton <$> char '\n'
                            , List.concat
                                <$> many
                                        (succeed (++)
                                            <*> (many (char ' '))
                                            <*> (List.singleton <$> char '\n')
                                        )
                            , count (currentIndent state) (char ' ')
                            , many1 (char ' ')
                            ]
                )
