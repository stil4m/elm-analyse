module Analyser.Checks.ListOperators exposing (checker)

import AST.Types exposing (File, Case, LetBlock, VariablePointer, Destructuring, Pattern, Function, Lambda, Exposure, ModuleName, Expression, InnerExpression(OperatorApplication, ListExpr))
import AST.Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(UseConsOverConcat, DropConcatOfLists, DropConsOfItemAndList), newMessage)
import Inspector exposing (Order(Post), defaultConfig)
import Analyser.Configuration as Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "DropConcatOfLists", "DropConsOfItemAndList", "UseConsOverConcat" ]
    }


type alias Context =
    List ( Deficiency, Range )


type Deficiency
    = DropConcat
    | DropCons
    | UseCons


scan : FileContext -> Configuration -> List Message
scan fileContext configuration =
    Inspector.inspect
        { defaultConfig
            | onExpression = Post onExpression
        }
        fileContext.ast
        []
        |> List.filterMap (deficiencyToMessageData fileContext.path configuration)
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


deficiencyToMessageData : String -> Configuration -> ( Deficiency, Range ) -> Maybe MessageData
deficiencyToMessageData path configuration ( deficiency, range ) =
    Maybe.map (\messageConstructor -> messageConstructor path range) <|
        case deficiency of
            DropConcat ->
                if Configuration.checkEnabled "DropConcatOfLists" configuration then
                    Just DropConcatOfLists
                else
                    Nothing

            DropCons ->
                if Configuration.checkEnabled "DropConsOfItemAndList" configuration then
                    Just DropConsOfItemAndList
                else
                    Nothing

            UseCons ->
                if Configuration.checkEnabled "UseConsOverConcat" configuration then
                    Just UseConsOverConcat
                else
                    Nothing


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
