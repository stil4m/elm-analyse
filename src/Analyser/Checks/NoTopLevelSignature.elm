module Analyser.Checks.NoTopLevelSignature exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Expression exposing (Expression(..), Function)
import Elm.Syntax.Node as Node exposing (Node(..))


checker : Checker
checker =
    { check = scan
    , info =
        { key = "NoTopLevelSignature"
        , name = "No Top Level Signature"
        , description = "We want our readers to understand our code. Adding a signature is part of this."
        , schema = Schema.schema |> Schema.rangeProp "range" |> Schema.varProp "varName"
        }
    }


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    Inspector.inspect
        { defaultConfig | onFunction = Inner onFunction, onDestructuring = Skip }
        fileContext.ast
        []


onFunction : (List MessageData -> List MessageData) -> Node Function -> List MessageData -> List MessageData
onFunction _ (Node _ function) context =
    case function.signature of
        Nothing ->
            let
                declaration =
                    Node.value function.declaration

                (Node r declarationName) =
                    declaration.name
            in
            (Data.init
                (String.concat
                    [ "No signature for top level definition `"
                    , declarationName
                    , "` at "
                    , Range.rangeToString r
                    ]
                )
                |> Data.addVarName "varName" declarationName
                |> Data.addRange "range" r
            )
                :: context

        Just _ ->
            context
