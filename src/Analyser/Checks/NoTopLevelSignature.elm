module Analyser.Checks.NoTopLevelSignature exposing (checker)

import ASTUtil.Inspector as Inspector exposing (Order(Inner, Skip), defaultConfig)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Range as Range exposing (Range, RangeContext)
import Analyser.Messages.Types exposing (Message, MessageData(NoTopLevelSignature), newMessage)
import Elm.Syntax.Expression exposing (..)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "NoTopLevelSignature" ]
    }


scan : RangeContext -> FileContext -> Configuration -> List Message
scan rangeContext fileContext _ =
    Inspector.inspect
        { defaultConfig | onFunction = Inner (onFunction rangeContext), onDestructuring = Skip }
        fileContext.ast
        []
        |> List.map (uncurry (NoTopLevelSignature fileContext.path))
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


onFunction : RangeContext -> (List ( String, Range ) -> List ( String, Range )) -> Function -> List ( String, Range ) -> List ( String, Range )
onFunction rangeContext _ function context =
    case function.signature of
        Nothing ->
            ( function.declaration.name.value, Range.build rangeContext function.declaration.name.range ) :: context

        Just _ ->
            context
