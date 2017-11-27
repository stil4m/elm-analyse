module Analyser.Checks.OverriddenVariables exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(Inner), defaultConfig)
import ASTUtil.Variables exposing (getImportsVars, patternToVars)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Dict exposing (Dict)
import Elm.Syntax.Base exposing (..)
import Elm.Syntax.Expression exposing (..)
import Elm.Syntax.Pattern exposing (..)
import Elm.Syntax.Range as Syntax


checker : Checker
checker =
    { check = scan
    , info =
        { key = "RedefineVariable"
        , name = "Redefine Variable"
        , description = "You should not redefine a variable in a new lexical scope. This is confusing and may lead to bugs."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range1"
                |> Schema.rangeProp "range2"
                |> Schema.varProp "varName"
        }
    }


type alias Context =
    ( List Redefine, Dict String Syntax.Range )


type alias Redefine =
    ( String, Syntax.Range, Syntax.Range )


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    let
        topLevels : Dict String Syntax.Range
        topLevels =
            getImportsVars fileContext.ast.imports
                |> List.map (\( x, _ ) -> ( x.value, x.range ))
                |> Dict.fromList
    in
    Inspector.inspect
        { defaultConfig
            | onFunction = Inner onFunction
            , onLambda = Inner onLambda
            , onCase = Inner onCase
            , onDestructuring = Inner onDestructuring
        }
        fileContext.ast
        ( [], topLevels )
        |> Tuple.first
        |> List.map
            (\( n, r1, r2 ) ->
                Data.init
                    (String.concat
                        [ "Variable `"
                        , n
                        , "` is redefined at "
                        , Range.rangeToString r1
                        , " and "
                        , Range.rangeToString r2
                        ]
                    )
                    |> Data.addVarName "varName" n
                    |> Data.addRange "range1" r1
                    |> Data.addRange "range2" r2
            )


visitWithVariablePointers : List VariablePointer -> (Context -> Context) -> Context -> Context
visitWithVariablePointers variablePointers f ( redefines, known ) =
    let
        redefinedPattern : List VariablePointer
        redefinedPattern =
            variablePointers
                |> List.filter (.value >> flip Dict.member known)

        newKnown : Dict String Syntax.Range
        newKnown =
            List.foldl (\a b -> Dict.insert a.value a.range b) known variablePointers

        ( newRedefines, _ ) =
            f ( redefines, newKnown )
    in
    ( newRedefines
        ++ (redefinedPattern
                |> List.filterMap (\x -> Dict.get x.value known |> Maybe.map (\r -> ( x.value, r, x.range )))
           )
    , known
    )


visitWithPatterns : List Pattern -> (Context -> Context) -> Context -> Context
visitWithPatterns patterns f context =
    visitWithVariablePointers (patterns |> List.concatMap patternToVars |> List.map Tuple.first) f context


onDestructuring : (Context -> Context) -> ( Pattern, Expression ) -> Context -> Context
onDestructuring f ( pattern, _ ) context =
    visitWithVariablePointers
        (pattern |> patternToVars |> List.map Tuple.first)
        f
        context


onFunction : (Context -> Context) -> Function -> Context -> Context
onFunction f function context =
    visitWithVariablePointers
        (function.declaration.arguments |> List.concatMap patternToVars |> List.map Tuple.first |> (::) function.declaration.name)
        f
        context


onLambda : (Context -> Context) -> Lambda -> Context -> Context
onLambda f lambda context =
    visitWithPatterns lambda.args f context


onCase : (Context -> Context) -> Case -> Context -> Context
onCase f caze context =
    visitWithVariablePointers (Tuple.first caze |> patternToVars |> List.map Tuple.first) f context
