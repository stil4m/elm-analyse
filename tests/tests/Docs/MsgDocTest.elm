module Docs.MsgDocTest exposing (all)

import Docs.MsgDoc as MsgDoc
import Expect
import Test exposing (..)


type alias InnerTest =
    Test


all : Test
all =
    describe "Docs.MsgDoc"
        [ describe "valid message" <|
            (MsgDoc.allMessages
                |> List.map
                    (\message ->
                        test (.key message.info) <|
                            \() ->
                                MsgDoc.getMessage message
                                    |> .id
                                    |> Expect.atLeast 0
                    )
            )
        ]
