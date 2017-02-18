module Parser.Comments exposing (singleLineComment, multilineComment)

import Combine exposing (Parser, string, lazy, sequence, (<$>), manyTill, succeed, (<$>), (<*>), (*>), (>>=), lookAhead, count, modifyState)
import Combine.Char exposing (anyChar)
import Parser.Whitespace exposing (untilNewlineToken)
import Parser.State exposing (State)
import AST.Ranges exposing (Range)
import Parser.Ranges exposing (withRange)
import Parser.State exposing (addComment)


addCommentToState : Parser State ( String, Range ) -> Parser State String
addCommentToState p =
    p
        >>= \(( value, _ ) as pair) ->
                modifyState (addComment pair) *> succeed value


parseComment : Parser State String -> Parser State String
parseComment commentParser =
    withRange
        ((,) <$> commentParser)
        |> addCommentToState


singleLineComment : Parser State String
singleLineComment =
    parseComment
        (succeed (++)
            <*> string "--"
            <*> untilNewlineToken
        )


multilineComment : Parser State String
multilineComment =
    lazy
        (\() ->
            parseComment
                (String.concat
                    <$> sequence
                            [ (string "{-")
                            , String.concat
                                <$> manyTill
                                        (lookAhead (count 2 anyChar)
                                            >>= \x ->
                                                    if x == [ '{', '-' ] then
                                                        multilineComment
                                                    else
                                                        String.fromChar <$> anyChar
                                        )
                                        (string "-}")
                            , succeed "-}"
                            ]
                )
        )
