module Analyser.Checks.UnusedImportedVariable exposing (checker)

import AST.Ranges as Range
import ASTUtil.Variables exposing (VariableType(Imported))
import Analyser.Checks.Base exposing (Checker)
import Analyser.Checks.Variables as Variables
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Dict
import Elm.Interface as Interface
import Elm.Syntax.Module exposing (..)
import Elm.Syntax.Range as Syntax exposing (Range)
import Tuple3


checker : Checker
checker =
    { check = scan
    , info =
        { key = "UnusedImportedVariable"
        , name = "Unused Imported Variable"
        , description = "When a function is imported from a module but is unused, it is better to remove it."
        , schema =
            Schema.schema
                |> Schema.varProp "varName"
                |> Schema.rangeProp "range"
        }
    }


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    let
        x =
            Variables.collect fileContext

        onlyUnused : List ( String, ( Int, VariableType, Syntax.Range ) ) -> List ( String, ( Int, VariableType, Syntax.Range ) )
        onlyUnused =
            List.filter (Tuple.second >> Tuple3.first >> (==) 0)

        unusedVariables =
            x.poppedScopes
                |> List.concatMap Dict.toList
                |> onlyUnused
                |> List.filterMap (\( x, ( _, t, y ) ) -> forVariableType t x y)

        unusedTopLevels =
            x.activeScopes
                |> List.head
                |> Maybe.map Tuple.second
                |> Maybe.withDefault Dict.empty
                |> Dict.toList
                |> onlyUnused
                |> List.filter (filterByModuleType fileContext)
                |> List.filter (Tuple.first >> flip Interface.exposesFunction fileContext.interface >> not)
                |> List.filterMap (\( x, ( _, t, y ) ) -> forVariableType t x y)
    in
    unusedVariables ++ unusedTopLevels


forVariableType : VariableType -> String -> Range -> Maybe MessageData
forVariableType variableType variableName range =
    case variableType of
        Imported ->
            Just
                (Data.init
                    (String.concat
                        [ "Unused imported variable `"
                        , variableName
                        , "` at "
                        , Range.rangeToString range
                        ]
                    )
                    |> Data.addRange "range" range
                    |> Data.addVarName "varName" variableName
                )

        _ ->
            Nothing


filterByModuleType : FileContext -> ( String, ( Int, VariableType, Syntax.Range ) ) -> Bool
filterByModuleType fileContext =
    case fileContext.ast.moduleDefinition of
        EffectModule _ ->
            filterForEffectModule

        _ ->
            always True


filterForEffectModule : ( String, ( Int, VariableType, Syntax.Range ) ) -> Bool
filterForEffectModule ( k, _ ) =
    not <| List.member k [ "init", "onEffects", "onSelfMsg", "subMap", "cmdMap" ]
