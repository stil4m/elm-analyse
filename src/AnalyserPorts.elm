port module AnalyserPorts exposing (onFixMessage, onFixQuick, onReset, sendFixedFile, sendReport, sendStateValue)

import Analyser.Report as Report exposing (Report)
import Analyser.State exposing (State, encodeState)
import Json.Encode exposing (Value)


port sendReportValue : Value -> Cmd msg


port sendState : Value -> Cmd msg


port sendFixedFile : { path : String, content : String } -> Cmd msg


port onReset : (Bool -> msg) -> Sub msg


port onFixMessage : (Int -> msg) -> Sub msg


port onFixQuick : (Int -> msg) -> Sub msg


sendReport : Report -> Cmd msg
sendReport =
    sendReportValue << Report.encode


sendStateValue : State -> Cmd msg
sendStateValue =
    sendState << encodeState
