module Analyser.Checks.NoImportAll exposing (scan)

import AST.Types exposing (Import, Exposure(All, None, Explicit), ModuleName, Expose(TypeExpose))
import AST.Ranges as Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(ImportAll), newMessage)
import Inspector exposing (defaultConfig, Action(Post))


type alias ExposeAllContext =
    List ( ModuleName, Range )


scan : FileContext -> List Message
scan fileContext =
    Inspector.inspect
        { defaultConfig | onImport = Post onImport }
        fileContext.ast
        []
        |> List.sortWith (\( _, a ) ( _, b ) -> Ranges.orderByStart a b)
        |> List.map (uncurry (ImportAll fileContext.path))
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


onImport : Import -> ExposeAllContext -> ExposeAllContext
onImport imp context =
    flip List.append context <|
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
                                TypeExpose exposedType ->
                                    case exposedType.constructors of
                                        All range ->
                                            Just ( imp.moduleName, range )

                                        _ ->
                                            Nothing

                                _ ->
                                    Nothing
                        )
