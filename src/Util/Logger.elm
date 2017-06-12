port module Util.Logger exposing (info, warning, error)


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
