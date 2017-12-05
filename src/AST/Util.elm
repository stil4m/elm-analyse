module AST.Util exposing (fileExposingList, fileModuleName, getParenthesized, isCase, isIf, isLambda, isLet, isOperatorApplication, isPortModule, moduleExposingList, patternModuleNames)

import Elm.Syntax.Base exposing (ModuleName)
import Elm.Syntax.Exposing exposing (..)
import Elm.Syntax.Expression exposing (Expression(CaseExpression, IfBlock, LambdaExpression, LetExpression, OperatorApplication, ParenthesizedExpression))
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Module exposing (Module(EffectModule, NormalModule, PortModule))
import Elm.Syntax.Pattern exposing (Pattern(..))
import Elm.Syntax.Range exposing (Range)
import Elm.Syntax.Ranged exposing (Ranged)


moduleExposingList : Module -> Exposing (Ranged TopLevelExpose)
moduleExposingList m =
    case m of
        NormalModule x ->
            x.exposingList

        PortModule x ->
            x.exposingList

        EffectModule x ->
            x.exposingList


isPortModule : File -> Bool
isPortModule file =
    case file.moduleDefinition of
        PortModule _ ->
            True

        _ ->
            False


fileExposingList : File -> Exposing (Ranged TopLevelExpose)
fileExposingList file =
    case file.moduleDefinition of
        NormalModule x ->
            x.exposingList

        PortModule x ->
            x.exposingList

        EffectModule x ->
            x.exposingList


fileModuleName : File -> ModuleName
fileModuleName file =
    case file.moduleDefinition of
        NormalModule x ->
            x.moduleName

        PortModule x ->
            x.moduleName

        EffectModule x ->
            x.moduleName


isLambda : Ranged Expression -> Bool
isLambda ( _, e ) =
    case e of
        LambdaExpression _ ->
            True

        _ ->
            False


isLet : Ranged Expression -> Bool
isLet ( _, e ) =
    case e of
        LetExpression _ ->
            True

        _ ->
            False


isIf : Ranged Expression -> Bool
isIf ( _, e ) =
    case e of
        IfBlock _ _ _ ->
            True

        _ ->
            False


isCase : Ranged Expression -> Bool
isCase ( _, e ) =
    case e of
        CaseExpression _ ->
            True

        _ ->
            False


isOperatorApplication : Ranged Expression -> Bool
isOperatorApplication ( _, e ) =
    case e of
        OperatorApplication _ _ _ _ ->
            True

        _ ->
            False


getParenthesized : Ranged Expression -> Maybe ( Range, Ranged Expression )
getParenthesized ( r, e ) =
    case e of
        ParenthesizedExpression p ->
            Just ( r, p )

        _ ->
            Nothing


patternModuleNames : Ranged Pattern -> List ModuleName
patternModuleNames ( _, p ) =
    case p of
        TuplePattern xs ->
            List.concatMap patternModuleNames xs

        RecordPattern _ ->
            []

        UnConsPattern left right ->
            patternModuleNames left ++ patternModuleNames right

        ListPattern xs ->
            List.concatMap patternModuleNames xs

        NamedPattern qualifiedNameRef subPatterns ->
            qualifiedNameRef.moduleName :: List.concatMap patternModuleNames subPatterns

        QualifiedNamePattern qualifiedNameRef ->
            [ qualifiedNameRef.moduleName ]

        AsPattern inner _ ->
            patternModuleNames inner

        ParenthesizedPattern inner ->
            patternModuleNames inner

        _ ->
            []
