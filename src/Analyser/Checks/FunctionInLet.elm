module Analyser.Checks.FunctionInLet exposing (checker)

import AST.Ranges as Range
import ASTUtil.Functions
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Expression exposing (Expression(..), Function, LetBlock)
import Elm.Syntax.Node as Node exposing (Node(..))


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


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onLetBlock = Inner onLetBlock
            , onFunction = Post onFunction
        }
        fileContext.ast
        startingContext
        |> .functions
        |> List.map asMessage


asMessage : Function -> MessageData
asMessage { declaration } =
    let
        range =
            Node.range (Node.value declaration).name
    in
    Data.init
        (String.concat
            [ "Let statement containing functions should be avoided at "
            , Range.rangeToString range
            ]
        )
        |> Data.addRange "range" range


onFunction : Node Function -> Context -> Context
onFunction (Node _ function) context =
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
