module Analyser.Checks.ExposeAll exposing (checker)

import AST.Util
import ASTUtil.Inspector as Inspector exposing (Order(Inner), defaultConfig)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Range as Range exposing (Range, RangeContext)
import Analyser.Messages.Types exposing (Message, MessageData(ExposeAll), newMessage)
import Elm.Syntax.Exposing exposing (..)
import Elm.Syntax.File exposing (..)


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
