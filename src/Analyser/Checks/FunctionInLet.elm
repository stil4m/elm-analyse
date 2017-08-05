module Analyser.Checks.FunctionInLet exposing (checker)

import ASTUtil.Functions
import ASTUtil.Inspector as Inspector exposing (Order(Inner, Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Range as Range exposing (RangeContext)
import Analyser.Messages.Types exposing (Message, MessageData(FunctionInLet), newMessage)
import Elm.Syntax.Expression exposing (..)


type alias Context =
    { inLetBlock : Bool
    , functions : List Function
    }


startingContext : Context
startingContext =
    { inLetBlock = False, functions = [] }


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "FunctionInLet" ]
    }


scan : RangeContext -> FileContext -> Configuration -> List Message
scan rangeContext fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onLetBlock = Inner onLetBlock
            , onFunction = Post onFunction
        }
        fileContext.ast
        startingContext
        |> .functions
        |> List.map (asMessage rangeContext fileContext)


asMessage : RangeContext -> FileContext -> Function -> Message
asMessage rangeContext fileContext f =
    newMessage [ ( fileContext.sha1, fileContext.path ) ]
        (FunctionInLet fileContext.path (Range.build rangeContext f.declaration.name.range))


onFunction : Function -> Context -> Context
onFunction function context =
    let
        isStatic =
            ASTUtil.Functions.isStatic function
    in
    if not isStatic && context.inLetBlock then
        { context | functions = function :: context.functions }
    else
        context


onLetBlock : (Context -> Context) -> LetBlock -> Context -> Context
onLetBlock continue _ context =
    { context | inLetBlock = True }
        |> continue
        |> (\after -> { after | inLetBlock = context.inLetBlock })
