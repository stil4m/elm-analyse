module Analyser.Checks.UnusedValueConstructor exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Interface as Interface exposing (Interface)
import Elm.Syntax.Expression exposing (Expression(..))
import Elm.Syntax.Range exposing (Range)
import Elm.Syntax.Ranged exposing (Ranged)
import Elm.Syntax.Type exposing (Type)
import Set exposing (Set)


checker : Checker
checker =
    { check = scan
    , info =
        { key = "UnusedValueConstructor"
        , name = "Unused Value Constructor"
        , description = "Value Constructors which are not exposed and used should be eliminated."
        , schema =
            Schema.schema
                |> Schema.varProp "varName"
                |> Schema.rangeProp "range"
        }
    }


type alias Context =
    { unexposedConstructors : List ( String, Range )
    , usedFunctions : Set String
    }


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    let
        result : Context
        result =
            Inspector.inspect
                { defaultConfig
                    | onType = Inner (always (onType fileContext.interface))
                    , onExpression = Post onExpression
                }
                fileContext.ast
                { unexposedConstructors = [], usedFunctions = Set.empty }
    in
    result.unexposedConstructors
        |> List.filter (\x -> not <| Set.member (Tuple.first x) result.usedFunctions)
        |> List.map buildMessageData


buildMessageData : ( String, Range ) -> MessageData
buildMessageData ( varName, range ) =
    Data.init
        (String.concat
            [ "Value constructor `"
            , varName
            , "` is not used. Declared at "
            , Range.rangeToString range
            ]
        )
        |> Data.addVarName "varName" varName
        |> Data.addRange "range" range


onExpression : Ranged Expression -> Context -> Context
onExpression ( _, e ) config =
    case e of
        FunctionOrValue s ->
            { config | usedFunctions = Set.insert s config.usedFunctions }

        _ ->
            config


onType : Interface -> Type -> Context -> Context
onType interface t context =
    let
        nonExposed =
            t.constructors
                |> List.filter (not << (\constructor -> Interface.exposesFunction constructor.name interface))
                |> List.map (\constructor -> ( constructor.name, constructor.range ))
    in
    { context | unexposedConstructors = context.unexposedConstructors ++ nonExposed }
