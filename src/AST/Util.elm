module AST.Util exposing (fileExposingList, fileModuleName, rangeFromInts, getParenthesized, isOperatorApplication, isLambda)

import AST.Types exposing (Range, File, Exposure, ModuleName, Expose, Parenthesized, Module(NormalModule, PortModule, EffectModule, NoModule), Expression(OperatorApplicationExpression, ParenthesizedExpression, LambdaExpression))


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
isLambda e =
    case e of
        LambdaExpression _ ->
            True

        _ ->
            False


isOperatorApplication : Expression -> Bool
isOperatorApplication e =
    case e of
        OperatorApplicationExpression _ ->
            True

        _ ->
            False


getParenthesized : Expression -> Maybe Parenthesized
getParenthesized e =
    case e of
        ParenthesizedExpression p ->
            Just p

        _ ->
            Nothing
