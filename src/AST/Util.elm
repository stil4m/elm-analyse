module AST.Util exposing (fileExposingList, fileModuleName, rangeFromInts, getParenthesized, isOperatorApplication, isLambda, isIf, isCase, moduleExposingList, patternModuleNames)

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
        , Pattern(TuplePattern, RecordPattern, UnConsPattern, ListPattern, NamedPattern, QualifiedNamePattern, AsPattern, ParentisizedPattern)
        , InnerExpression(OperatorApplicationExpression, ParenthesizedExpression, LambdaExpression, IfBlock, CaseExpression)
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


rangeFromInts : ( Int, Int, Int, Int ) -> Range
rangeFromInts ( x, y, z, a ) =
    { start = { row = x, column = y }, end = { row = z, column = a } }


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
        OperatorApplicationExpression _ ->
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
        TuplePattern xs ->
            (List.concatMap patternModuleNames xs)

        RecordPattern _ ->
            []

        UnConsPattern left right ->
            patternModuleNames left ++ patternModuleNames right

        ListPattern xs ->
            (List.concatMap patternModuleNames xs)

        NamedPattern qualifiedNameRef subPatterns ->
            qualifiedNameRef.moduleName :: List.concatMap patternModuleNames subPatterns

        QualifiedNamePattern qualifiedNameRef ->
            [ qualifiedNameRef.moduleName ]

        AsPattern inner _ ->
            patternModuleNames inner

        ParentisizedPattern inner ->
            patternModuleNames inner

        _ ->
            []
