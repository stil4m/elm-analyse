module Analyser.Messages.Util exposing (blockForShas, compareMessageFile, compareMessageLocation, firstRange, markFixing, messageFile)

import AST.Ranges as AstRanges
import Analyser.Messages.Data as Data
import Analyser.Messages.Types exposing (Message, MessageStatus(..))
import Elm.Syntax.Range exposing (Range, emptyRange)


blockForShas : String -> Message -> Message
blockForShas sha message =
    if message.file.version == sha then
        { message | status = Blocked }

    else
        message


markFixing : Int -> Message -> Message
markFixing x message =
    if message.id == x then
        { message | status = Fixing }

    else
        message


messageFile : Message -> String
messageFile m =
    m.file.path


firstRange : Message -> Range
firstRange a =
    Data.firstRange a.data |> Maybe.withDefault emptyRange


compareMessageLocation : Message -> Message -> Order
compareMessageLocation a b =
    AstRanges.orderByStart (firstRange a) (firstRange b)


compareMessageFile : Message -> Message -> Order
compareMessageFile a b =
    compare (messageFile a) (messageFile b)
