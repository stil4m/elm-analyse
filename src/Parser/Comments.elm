module Parser.Comments exposing (singleLineComment, multilineComment)

import Combine exposing (Parser, string, lazy, sequence, (<$>), manyTill, succeed, (<*>), (>>=), lookAhead, count)
import Combine.Char exposing (anyChar)
import Parser.Whitespace exposing (untilNewlineToken)
import Parser.State exposing (State)


singleLineComment : Parser State String
singleLineComment =
    succeed (++)
        <*> string "--"
        <*> untilNewlineToken


multilineComment : Parser State String
multilineComment =
    lazy
        (\() ->
            String.concat
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
