module AST.Util exposing (fileExposingList, isPortModule, fileModuleName, getParenthesized, isOperatorApplication, isLambda, isIf, isCase, moduleExposingList, patternModuleNames)

import AST.Types
    exposing
        ( File
        , Exposure(None)
        , Expose
        , Module(NormalModule, PortModule, EffectModule, NoModule)
        , Exposure
        , ModuleName
        , Expose
        , Expression
        , Pattern(TuplePattern, RecordPattern, UnConsPattern, ListPattern, NamedPattern, QualifiedNamePattern, AsPattern, ParenthesizedPattern)
        , InnerExpression(OperatorApplication, ParenthesizedExpression, LambdaExpression, IfBlock, CaseExpression)
        )
import AST.Ranges exposing (Range)


moduleExposingList : Module -> Exposure Expose
moduleExposingList m =
    case m of
        NormalModule x ->
            x.exposingList

        PortModule x ->
            x.exposingList

        EffectModule x ->
            x.exposingList

        NoModule ->
            None


isPortModule : File -> Bool
isPortModule file =
    case file.moduleDefinition of
        PortModule _ ->
            True

        _ ->
            False


fileExposingList : File -> Maybe (Exposure Expose)
fileExposingList file =
    case file.moduleDefinition of
        NormalModule x ->
            Just x.exposingList

        PortModule x ->
            Just x.exposingList

        EffectModule x ->
            Just x.exposingList

        NoModule ->
            Nothing


fileModuleName : File -> Maybe ModuleName
fileModuleName file =
    case file.moduleDefinition of
        NormalModule x ->
            Just x.moduleName

        PortModule x ->
            Just x.moduleName

        EffectModule x ->
            Just x.moduleName

        NoModule ->
            Nothing


isLambda : Expression -> Bool
isLambda ( _, e ) =
    case e of
        LambdaExpression _ ->
            True

        _ ->
            False


isIf : Expression -> Bool
isIf ( _, e ) =
    case e of
        IfBlock _ _ _ ->
            True

        _ ->
            False


isCase : Expression -> Bool
isCase ( _, e ) =
    case e of
        CaseExpression _ ->
            True

        _ ->
            False


isOperatorApplication : Expression -> Bool
isOperatorApplication ( _, e ) =
    case e of
        OperatorApplication _ _ _ _ ->
            True

        _ ->
            False


getParenthesized : Expression -> Maybe ( Range, Expression )
getParenthesized ( r, e ) =
    case e of
        ParenthesizedExpression p ->
            Just ( r, p )

        _ ->
            Nothing


patternModuleNames : Pattern -> List ModuleName
patternModuleNames p =
    case p of
        TuplePattern xs _ ->
            (List.concatMap patternModuleNames xs)

        RecordPattern _ _ ->
            []

        UnConsPattern left right _ ->
            patternModuleNames left ++ patternModuleNames right

        ListPattern xs _ ->
            (List.concatMap patternModuleNames xs)

        NamedPattern qualifiedNameRef subPatterns _ ->
            qualifiedNameRef.moduleName :: List.concatMap patternModuleNames subPatterns

        QualifiedNamePattern qualifiedNameRef _ ->
            [ qualifiedNameRef.moduleName ]

        AsPattern inner _ _ ->
            patternModuleNames inner

        ParenthesizedPattern inner _ ->
            patternModuleNames inner

        _ ->
            []
