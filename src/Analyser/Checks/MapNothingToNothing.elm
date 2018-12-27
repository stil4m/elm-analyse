module Analyser.Checks.MapNothingToNothing exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Expression exposing (Case, Expression(..))
import Elm.Syntax.Node exposing (Node(..))
import Elm.Syntax.Pattern exposing (Pattern(..))
import Elm.Syntax.Range exposing (Range)


checker : Checker
checker =
    { check = scan
    , info =
        { key = "MapNothingToNothing"
        , name = "Map Nothing To Nothing"
        , description = "Do not map a `Nothing` to `Nothing` with a case expression. Use `andThen` or `map` instead."
        , schema = Schema.schema |> Schema.rangeProp "range"
        }
    }


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    Inspector.inspect { defaultConfig | onCase = Inner onCase }
        fileContext.ast
        []


onCase : (List MessageData -> List MessageData) -> Case -> List MessageData -> List MessageData
onCase _ ( Node { start } pattern, Node { end } expression ) context =
    if isNothingPattern pattern && isNothingExpression expression then
        buildMessage { start = start, end = end }
            :: context

    else
        context


isNothingPattern : Pattern -> Bool
isNothingPattern pattern =
    pattern == NamedPattern { moduleName = [], name = "Nothing" } []


isNothingExpression : Expression -> Bool
isNothingExpression expression =
    expression == FunctionOrValue [] "Nothing"


buildMessage : Range -> MessageData
buildMessage r =
    Data.init
        (String.concat
            [ "`Nothing` mapped to `Nothing` in case expression, but instead you can use `Maybe.map` or `Maybe.andThen`. At "
            , Range.rangeToString r
            ]
        )
        |> Data.addRange "range" r
