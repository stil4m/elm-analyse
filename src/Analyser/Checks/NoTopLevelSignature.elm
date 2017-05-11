module Analyser.Checks.NoTopLevelSignature exposing (checker)

import Elm.Syntax.Range exposing (Range)
import Elm.Syntax.Expression exposing (..)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(NoTopLevelSignature), newMessage)
import ASTUtil.Inspector as Inspector exposing (Order(Inner, Skip), defaultConfig)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "NoTopLevelSignature" ]
    }


scan : FileContext -> Configuration -> List Message
scan fileContext _ =
    Inspector.inspect
        { defaultConfig | onFunction = Inner onFunction, onDestructuring = Skip }
        fileContext.ast
        []
        |> List.map (uncurry (NoTopLevelSignature fileContext.path))
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


onFunction : (List ( String, Range ) -> List ( String, Range )) -> Function -> List ( String, Range ) -> List ( String, Range )
onFunction _ function context =
    case function.signature of
        Nothing ->
            ( function.declaration.name.value, function.declaration.name.range ) :: context

        Just _ ->
            context
