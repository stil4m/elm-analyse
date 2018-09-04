module Analyser.Checks.UnusedImportedVariable exposing (checker)

import AST.Ranges as Range
import ASTUtil.Variables exposing (VariableType(..))
import Analyser.Checks.Base exposing (Checker)
import Analyser.Checks.Variables as Variables
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Interface as Interface
import Elm.Syntax.Module exposing (Module(..))
import Elm.Syntax.Node as Node
import Elm.Syntax.Range as Syntax exposing (Range)
import Tuple.Extra


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

        unusedVariables =
            Variables.unusedVariables x
                |> List.filterMap forVariableType

        unusedTopLevels =
            Variables.unusedTopLevels x
                |> List.filter (filterByModuleType fileContext)
                |> List.filter (Tuple.Extra.first3 >> (\a -> Interface.exposesFunction a fileContext.interface) >> not)
                |> List.filterMap forVariableType
    in
    unusedVariables ++ unusedTopLevels


forVariableType : ( String, VariableType, Range ) -> Maybe MessageData
forVariableType ( variableName, variableType, range ) =
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


filterByModuleType : FileContext -> ( String, VariableType, Syntax.Range ) -> Bool
filterByModuleType fileContext =
    case Node.value fileContext.ast.moduleDefinition of
        EffectModule _ ->
            filterForEffectModule

        _ ->
            always True


filterForEffectModule : ( String, VariableType, Syntax.Range ) -> Bool
filterForEffectModule ( k, _, _ ) =
    not <| List.member k [ "init", "onEffects", "onSelfMsg", "subMap", "cmdMap" ]
