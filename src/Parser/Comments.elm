module Parser.Comments exposing (..)

import Combine exposing (..)
import Combine.Char exposing (..)
import Parser.Types exposing (..)
import Parser.Whitespace exposing (untilNewlineToken)


documentationComment : Parser State String
documentationComment =
    String.concat
        <$> sequence
                [ string "{-|"
                , String.fromList <$> manyTill anyChar (string "-}")
                ]


singleLineComment : Parser s String
singleLineComment =
    succeed (++)
        <*> string "--"
        <*> untilNewlineToken


multilineComment : Parser a String
multilineComment =
    lazy
        (\() ->
            (String.concat
                <$> sequence
                        [ (string "{-")
                        , String.concat
                            <$> (manyTill
                                    (lookAhead (count 2 anyChar)
                                        >>= (\x ->
                                                if x == [ '{', '-' ] then
                                                    multilineComment
                                                else
                                                    String.fromChar <$> anyChar
                                            )
                                    )
                                    (string "-}")
                                )
                        , succeed "-}"
                        ]
            )
        )
