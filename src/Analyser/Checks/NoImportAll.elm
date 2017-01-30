module Analyser.Checks.NoImportAll exposing (scan)

import AST.Types exposing (File, Exposure(All, None, Explicit), ModuleName, Expose(TypeExpose))
import AST.Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages exposing (Message(ImportAll))
import Inspector exposing (defaultConfig, Action(Inner))


type alias ExposeAllContext =
    List ( ModuleName, Range )


scan : FileContext -> List Message
scan fileContext =
    let
        x : ExposeAllContext
        x =
            Inspector.inspect
                { defaultConfig
                    | onFile = Inner onFile
                }
                fileContext.ast
                []
    in
        x |> List.map (uncurry (ImportAll fileContext.path))


onFile : (ExposeAllContext -> ExposeAllContext) -> File -> ExposeAllContext -> ExposeAllContext
onFile _ file _ =
    file.imports
        |> List.concatMap
            (\imp ->
                case imp.exposingList of
                    All range ->
                        [ ( imp.moduleName, range ) ]

                    None ->
                        []

                    Explicit explicitList ->
                        explicitList
                            |> List.filterMap
                                (\explicitItem ->
                                    case explicitItem of
                                        TypeExpose _ constructors ->
                                            case constructors of
                                                All range ->
                                                    Just ( imp.moduleName, range )

                                                _ ->
                                                    Nothing

                                        _ ->
                                            Nothing
                                )
            )
