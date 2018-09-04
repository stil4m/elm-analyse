module Analyser.Checks.UnusedTopLevel exposing (checker)

import AST.Ranges as Range
import ASTUtil.Variables exposing (VariableType(..))
import Analyser.Checks.Base exposing (Checker)
import Analyser.Checks.Variables as Variables exposing (UsedVariableContext)
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
        { key = "UnusedTopLevel"
        , name = "Unused Top Level"
        , description = "Functions and values that are unused in a module and not exported are dead code."
        , schema =
            Schema.schema
                |> Schema.varProp "varName"
                |> Schema.rangeProp "range"
        }
    }


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    let
        x : UsedVariableContext
        x =
            Variables.collect fileContext

        unusedVariables =
            List.filterMap forVariableType (Variables.unusedVariables x)

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
        TopLevel ->
            Just
                (Data.init (String.concat [ "Unused top level definition `", variableName, "` at ", Range.rangeToString range ])
                    |> Data.addVarName "varName" variableName
                    |> Data.addRange "range" range
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
