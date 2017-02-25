module Analyser.Checks.ExposeAll exposing (checker)

import AST.Types exposing (Exposure(All, None, Explicit), Expose(TypeExpose), File)
import AST.Ranges exposing (Range)
import AST.Util
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(ExposeAll), newMessage)
import Inspector exposing (defaultConfig, Order(Inner))
import Analyser.Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "ExposeAll" ]
    }


type alias ExposeAllContext =
    List Range


scan : FileContext -> Configuration -> List Message
scan fileContext _ =
    let
        x : ExposeAllContext
        x =
            Inspector.inspect
                { defaultConfig | onFile = Inner onFile }
                fileContext.ast
                []
    in
        x
            |> List.map (ExposeAll fileContext.path)
            |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


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
