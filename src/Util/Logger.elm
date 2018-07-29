port module Util.Logger exposing (error, info, warning)


port log : LogMessage -> Cmd msg


type alias LogMessage =
    { level : String
    , message : String
    }


info : String -> Cmd msg
info =
    LogMessage "INFO" >> log


warning : String -> Cmd msg
warning =
    LogMessage "WARN" >> log


error : String -> Cmd msg
error =
    LogMessage "ERROR" >> log
