module Analyser.Checks.NoSignature exposing (scan)

import AST.Types exposing (Function)
import AST.Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(NoTopLevelSignature), newMessage)
import Inspector exposing (defaultConfig, Action(Inner, Skip))


type alias ExposeAllContext =
    List ( String, Range )


scan : FileContext -> List Message
scan fileContext =
    let
        x : ExposeAllContext
        x =
            Inspector.inspect
                { defaultConfig
                    | onFunction = Inner onFunction
                    , onDestructuring = Skip
                }
                fileContext.ast
                []
    in
        x
            |> List.map (uncurry (NoTopLevelSignature fileContext.path))
            |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


onFunction : (ExposeAllContext -> ExposeAllContext) -> Function -> ExposeAllContext -> ExposeAllContext
onFunction _ function context =
    case function.signature of
        Nothing ->
            ( function.declaration.name.value, function.declaration.name.range ) :: context

        Just _ ->
            context
