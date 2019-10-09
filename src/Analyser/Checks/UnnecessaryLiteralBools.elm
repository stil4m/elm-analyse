module Analyser.Checks.UnnecessaryLiteralBools exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Expression exposing (Expression(..))
import Elm.Syntax.Node exposing (Node(..))
import Elm.Syntax.Pattern exposing (Pattern(..))


checker : Checker
checker =
    { check = scan
    , info =
        { key = "UnnecessaryLiteralBools"
        , name = "Unnecessary Literal Booleans"
        , description = "Directly use the boolean you already have."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range"
        }
    }


type alias Context =
    List MessageData


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onExpression = Post onExpression
        }
        fileContext.ast
        []


onExpression : Node Expression -> Context -> Context
onExpression (Node r inner) context =
    let
        withMsg msg =
            (Data.init
                (String.concat
                    [ msg
                    , " "
                    , Range.rangeToString r
                    ]
                )
                |> Data.addRange "range" r
            )
                :: context
    in
    case inner of
        IfBlock (Node _ _) (Node _ (FunctionOrValue _ trueVal)) (Node _ (FunctionOrValue _ falseVal)) ->
            case ( trueVal, falseVal ) of
                ( "True", "True" ) ->
                    withMsg "Replace if-block with True"

                ( "True", "False" ) ->
                    withMsg "Replace if-block with just the if-condition"

                ( "False", "True" ) ->
                    withMsg "Replace if-block with just the negation of the if-condition"

                ( "False", "False" ) ->
                    withMsg "Replace if-block with False"

                _ ->
                    context

        _ ->
            context
