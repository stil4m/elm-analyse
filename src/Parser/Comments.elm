module Parser.Comments exposing (..)

import Combine exposing (..)
import Combine.Char exposing (..)
import Parser.Types exposing (..)


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
        <*> while ((==) '\n' >> not)


multilineComment : Parser a String
multilineComment =
    (String.concat
        <$> sequence
                [ (string "{-")
                , (String.fromList <$> manyTill anyChar (string "-}"))
                , succeed "-}"
                ]
    )
