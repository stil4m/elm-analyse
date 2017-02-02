module Analyser.Checks.OverriddenVariables exposing (scan)

import AST.Types exposing (File, Exposure(All, None, Explicit), ModuleName, Expose(TypeExpose))
import AST.Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages exposing (Message(ImportAll))
import Dict exposing (Dict)
import Inspector exposing (Action(Post), defaultConfig)


type alias Context =
    ( List Redefine, Dict String Range )


type alias Redefine =
    ( String, Range, Range )


scan : FileContext -> List Message
scan fileContext =
    let
        context : Context
        context =
            Inspector.inspect
                defaultConfig
                fileContext.ast
                ( [], Dict.empty )
    in
        []
