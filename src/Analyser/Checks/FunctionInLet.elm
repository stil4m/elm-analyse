module Analyser.Checks.FunctionInLet exposing (checker)

import ASTUtil.Functions
import ASTUtil.Inspector as Inspector exposing (Order(Inner, Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range exposing (RangeContext)
import Analyser.Messages.Schema as Schema
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
    , info =
        { key = "FunctionInLet"
        , name = "Function In Let"
        , description = "In a let statement you can define variables and functions in their own scope. But you are already in the scope of a module. Just define the functions you want on a top-level. There is no not much need to define functions in let statements."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range"
        }
    }


scan : RangeContext -> FileContext -> Configuration -> List MessageData
scan rangeContext fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onLetBlock = Inner onLetBlock
            , onFunction = Post onFunction
        }
        fileContext.ast
        startingContext
        |> .functions
        |> List.map (asMessage rangeContext)


asMessage : RangeContext -> Function -> MessageData
asMessage rangeContext f =
    let
        range =
            Range.build rangeContext f.declaration.name.range
    in
    Data.init
        (String.concat
            [ "Let statement containing functions should be avoided at "
            , Range.asString range
            ]
        )
        |> Data.addRange "range" range


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
