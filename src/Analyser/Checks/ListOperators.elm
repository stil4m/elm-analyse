module Analyser.Checks.ListOperators exposing (checker)

import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Configuration as Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Range as Range exposing (Range, RangeContext)
import Analyser.Messages.Types exposing (Message, MessageData(DropConcatOfLists, DropConsOfItemAndList, UseConsOverConcat), newMessage)
import Elm.Syntax.Expression exposing (..)


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


scan : RangeContext -> FileContext -> Configuration -> List Message
scan rangeContext fileContext configuration =
    Inspector.inspect
        { defaultConfig
            | onExpression = Post (onExpression rangeContext)
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


onExpression : RangeContext -> Expression -> Context -> Context
onExpression rangeContext ( r, inner ) context =
    case inner of
        OperatorApplication "++" _ ( _, ListExpr _ ) ( _, ListExpr _ ) ->
            ( DropConcat, Range.build rangeContext r ) :: context

        OperatorApplication "::" _ _ ( _, ListExpr _ ) ->
            ( DropCons, Range.build rangeContext r ) :: context

        OperatorApplication "++" _ ( _, ListExpr [ _ ] ) _ ->
            ( UseCons, Range.build rangeContext r ) :: context

        _ ->
            context
