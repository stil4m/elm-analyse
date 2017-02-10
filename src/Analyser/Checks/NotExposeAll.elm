module Analyser.Checks.NotExposeAll exposing (scan)

import AST.Types exposing (Exposure(All, None, Explicit), Expose(TypeExpose), File)
import AST.Ranges exposing (Range)
import AST.Util
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (MessageData(ExposeAll))
import Inspector exposing (defaultConfig, Action(Inner))


type alias ExposeAllContext =
    List Range


scan : FileContext -> List MessageData
scan fileContext =
    let
        x : ExposeAllContext
        x =
            Inspector.inspect
                { defaultConfig | onFile = Inner onFile }
                fileContext.ast
                []
    in
        x |> List.map (ExposeAll fileContext.path)


onFile : (ExposeAllContext -> ExposeAllContext) -> File -> ExposeAllContext -> ExposeAllContext
onFile _ file _ =
    case AST.Util.fileExposingList file |> Maybe.withDefault None of
        None ->
            []

        All x ->
            [ x ]

        Explicit x ->
            x
                |> List.filterMap
                    (\y ->
                        case y of
                            TypeExpose exposedType ->
                                case exposedType.constructors of
                                    All allRange ->
                                        Just allRange

                                    _ ->
                                        Nothing

                            _ ->
                                Nothing
                    )
