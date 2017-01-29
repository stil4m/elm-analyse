module AST.Util exposing (fileExposingList, fileModuleName, rangeFromInts)

import AST.Types exposing (Range, File, Exposure, ModuleName, Expose, Module(NormalModule, PortModule, EffectModule, NoModule))


fileExposingList : File -> Maybe (Exposure Expose)
fileExposingList file =
    case file.moduleDefinition of
        NormalModule x ->
            Just x.exposingList

        PortModule x ->
            Just x.exposingList

        EffectModule x ->
            Just x.exposingList

        NoModule ->
            Nothing


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
