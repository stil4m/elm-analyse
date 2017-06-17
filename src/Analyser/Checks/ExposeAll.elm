module Analyser.Checks.ExposeAll exposing (checker)

import Analyser.Messages.Range as Range exposing (Range, RangeContext)
import Elm.Syntax.File exposing (..)
import AST.Util
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(ExposeAll), newMessage)
import ASTUtil.Inspector as Inspector exposing (defaultConfig, Order(Inner))
import Analyser.Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Elm.Syntax.Exposing exposing (..)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "ExposeAll" ]
    }


type alias ExposeAllContext =
    List Range


scan : RangeContext -> FileContext -> Configuration -> List Message
scan rangeContext fileContext _ =
    let
        x : ExposeAllContext
        x =
            Inspector.inspect
                { defaultConfig | onFile = Inner (onFile rangeContext) }
                fileContext.ast
                []
    in
        x
            |> List.map (ExposeAll fileContext.path)
            |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


onFile : RangeContext -> (ExposeAllContext -> ExposeAllContext) -> File -> ExposeAllContext -> ExposeAllContext
onFile rangeContext _ file _ =
    case AST.Util.fileExposingList file |> Maybe.withDefault None of
        None ->
            []

        All x ->
            [ Range.build rangeContext x ]

        Explicit x ->
            x
                |> List.filterMap
                    (\y ->
                        case y of
                            TypeExpose exposedType ->
                                case exposedType.constructors of
                                    All allRange ->
                                        Just (Range.build rangeContext allRange)

                                    _ ->
                                        Nothing

                            _ ->
                                Nothing
                    )
