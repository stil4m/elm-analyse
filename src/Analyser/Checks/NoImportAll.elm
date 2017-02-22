module Analyser.Checks.NoImportAll exposing (checker)

import AST.Types exposing (Import, Exposure(All, None, Explicit), ModuleName, Expose(TypeExpose))
import AST.Ranges as Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(ImportAll), newMessage)
import Inspector exposing (defaultConfig, Order(Post))
import Analyser.Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "ImportAll" ]
    }


type alias ExposeAllContext =
    List ( ModuleName, Range )


scan : FileContext -> Configuration -> List Message
scan fileContext configuration =
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
