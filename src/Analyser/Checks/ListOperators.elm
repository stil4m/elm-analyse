module Analyser.Checks.ListOperators exposing (scan)

import AST.Types exposing (File, Case, LetBlock, VariablePointer, Destructuring, Pattern, Function, Lambda, Exposure, ModuleName, Expression, InnerExpression(OperatorApplication, ListExpr))
import AST.Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(UseConsOverConcat, DropConcatOfLists, DropConsOfItemAndList), newMessage)
import Inspector exposing (Order(Post), defaultConfig)


type alias Context =
    List ( Deficiency, Range )


type Deficiency
    = DropConcat
    | DropCons
    | UseCons


scan : FileContext -> List Message
scan fileContext =
    Inspector.inspect
        { defaultConfig
            | onExpression = Post onExpression
        }
        fileContext.ast
        []
        |> List.map
            (\( x, y ) ->
                let
                    messageConstructor =
                        case x of
                            DropConcat ->
                                DropConcatOfLists

                            DropCons ->
                                DropConsOfItemAndList

                            UseCons ->
                                UseConsOverConcat
                in
                    messageConstructor fileContext.path y
            )
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


onExpression : Expression -> Context -> Context
onExpression ( r, inner ) context =
    case inner of
        OperatorApplication "++" _ ( _, ListExpr _ ) ( _, ListExpr _ ) ->
            ( DropConcat, r ) :: context

        OperatorApplication "::" _ _ ( _, ListExpr _ ) ->
            ( DropCons, r ) :: context

        OperatorApplication "++" _ ( _, ListExpr [ _ ] ) _ ->
            ( UseCons, r ) :: context

        _ ->
            context
