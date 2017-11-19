module Analyser.Messages.Util exposing (..)

import Analyser.Messages.Data as Data
import Analyser.Messages.Range as Ranges exposing (Range, emptyRange)
import Analyser.Messages.Types exposing (..)


type alias CanFix =
    Bool


type alias MessageInfo =
    ( String, List Range, CanFix )


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
    Ranges.orderByStart (firstRange a) (firstRange b)


compareMessageFile : Message -> Message -> Order
compareMessageFile a b =
    compare (messageFile a) (messageFile b)


compareMessage : Message -> Message -> Order
compareMessage a b =
    let
        aFile =
            messageFile a

        bFile =
            messageFile b
    in
    if aFile == bFile then
        Ranges.compareRangeStarts
            (Data.getRanges a.data |> List.head |> Maybe.withDefault Ranges.emptyRange)
            (Data.getRanges b.data |> List.head |> Maybe.withDefault Ranges.emptyRange)
    else
        compare aFile bFile
