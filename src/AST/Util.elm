module AST.Util exposing (..)

import AST.Types exposing (..)


fileModuleName : File -> Maybe ModuleName
fileModuleName file =
    case file.moduleDefinition of
        NormalModule x ->
            Just x.moduleName

        PortModule x ->
            Just x.moduleName

        EffectModule x ->
            Just x.moduleName

        NoModule ->
            Nothing


rangeFromInts : ( Int, Int, Int, Int ) -> Range
rangeFromInts ( x, y, z, a ) =
    { start = { row = x, column = y }, end = { row = z, column = a } }
