port module Util.Logger exposing (error, info, warning)


port log : ( String, String ) -> Cmd msg


info : String -> Cmd msg
info =
    (,) "INFO" >> log


warning : String -> Cmd msg
warning =
    (,) "WARN" >> log


error : String -> Cmd msg
error =
    (,) "ERROR" >> log
