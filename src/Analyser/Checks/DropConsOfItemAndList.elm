module Analyser.Checks.DropConsOfItemAndList exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Expression exposing (Expression(..))
import Elm.Syntax.Node exposing (Node(..))


checker : Checker
checker =
    { check = scan
    , info =
        { key = "DropConsOfItemAndList"
        , name = "Drop Cons Of Item And List"
        , description = "If you cons an item to a literal list (x :: [1, 2, 3]), then you can just put the item into the list."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range"
                |> Schema.rangeProp "head"
                |> Schema.rangeProp "tail"
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
    case inner of
        OperatorApplication "::" _ (Node headRange _) (Node tailRange (ListExpr _)) ->
            let
                range =
                    r
            in
            (Data.init
                (String.concat
                    [ "Adding an item to the front of a literal list, but instead you can just put it in the list. At "
                    , Range.rangeToString range
                    ]
                )
                |> Data.addRange "range" range
                |> Data.addRange "head" headRange
                |> Data.addRange "tail" tailRange
            )
                :: context

        _ ->
            context
