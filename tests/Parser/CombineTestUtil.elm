module Parser.CombineTestUtil exposing (..)

import Combine exposing (..)
import AST.Types exposing (..)
import AST.Ranges exposing (emptyRange, Range)
import Parser.State exposing (State, emptyState)
import Tuple2


parseFullStringState : State -> String -> Parser State b -> Maybe b
parseFullStringState state s p =
    case Combine.runParser (p <* Combine.end) state s of
        Ok ( _, _, r ) ->
            Just r

        _ ->
            Nothing


parseFullStringWithNullState : String -> Parser State b -> Maybe b
parseFullStringWithNullState s p =
    case Combine.runParser (p <* Combine.end) emptyState s of
        Ok ( _, _, r ) ->
            Just r

        _ ->
            Nothing


parseFullString : String -> Parser () b -> Maybe b
parseFullString s p =
    case Combine.parse (p <* Combine.end) s of
        Ok ( _, _, r ) ->
            Just r

        _ ->
            Nothing


emptyRanged : InnerExpression -> Expression
emptyRanged =
    (,) emptyRange


noRangeExpression : Expression -> Expression
noRangeExpression ( _, inner ) =
    ( emptyRange, noRangeInnerExpression inner )


noRangeFile : File -> File
noRangeFile file =
    { file
        | moduleDefinition = noRangeModule file.moduleDefinition
        , imports = List.map noRangeImport file.imports
    }


noRangeModule : Module -> Module
noRangeModule m =
    case m of
        NormalModule n ->
            NormalModule { n | exposingList = noRangeExposingList n.exposingList }

        PortModule n ->
            PortModule { n | exposingList = noRangeExposingList n.exposingList }

        EffectModule n ->
            EffectModule { n | exposingList = noRangeExposingList n.exposingList }

        NoModule ->
            NoModule


noRangeImport : Import -> Import
noRangeImport imp =
    { imp
        | range = emptyRange
        , exposingList = noRangeExposingList imp.exposingList
    }


noRangeExposingList : Exposure Expose -> Exposure Expose
noRangeExposingList x =
    case x of
        All r ->
            All emptyRange

        None ->
            None

        Explicit list ->
            list
                |> List.map noRangeExpose
                |> Explicit


noRangePattern : Pattern -> Pattern
noRangePattern p =
    case p of
        QualifiedNamePattern x ->
            QualifiedNamePattern <| unRange x

        RecordPattern ls ->
            RecordPattern <| List.map unRange ls

        VarPattern x ->
            VarPattern <| unRange x

        NamedPattern x y ->
            NamedPattern (unRange x) (List.map noRangePattern y)

        ParentisizedPattern x ->
            ParentisizedPattern <| noRangePattern x

        AsPattern x y ->
            AsPattern (noRangePattern x) (unRange y)

        UnConsPattern x y ->
            UnConsPattern (noRangePattern x) (noRangePattern y)

        CharPattern _ ->
            p

        StringPattern _ ->
            p

        FloatPattern _ ->
            p

        IntPattern _ ->
            p

        AllPattern ->
            AllPattern

        UnitPattern ->
            UnitPattern

        ListPattern x ->
            List.map noRangePattern x |> ListPattern

        TuplePattern x ->
            List.map noRangePattern x |> TuplePattern


unRange : { a | range : Range } -> { a | range : Range }
unRange p =
    { p | range = emptyRange }


noRangeExpose : Expose -> Expose
noRangeExpose l =
    case l of
        InfixExpose s r ->
            InfixExpose s emptyRange

        FunctionExpose s r ->
            FunctionExpose s emptyRange

        TypeOrAliasExpose s _ ->
            TypeOrAliasExpose s emptyRange

        TypeExpose { name, constructors } ->
            let
                newT =
                    case constructors of
                        All r ->
                            All emptyRange

                        None ->
                            None

                        Explicit list ->
                            Explicit <| List.map (Tuple2.mapSecond (always emptyRange)) list
            in
                TypeExpose (ExposedType name newT emptyRange)


noRangeDeclaration : Declaration -> Declaration
noRangeDeclaration decl =
    case decl of
        DestructuringDeclaration d ->
            DestructuringDeclaration
                { d
                    | pattern = noRangePattern d.pattern
                    , expression = noRangeExpression d.expression
                }

        FuncDecl f ->
            FuncDecl <| noRangeFunction f

        TypeDecl d ->
            TypeDecl <| noRangeTypeDeclaration d

        _ ->
            decl


noRangeTypeAlias : TypeAlias -> TypeAlias
noRangeTypeAlias =
    unRange


noRangeTypeDeclaration : Type -> Type
noRangeTypeDeclaration x =
    { x | constructors = List.map noRangeValueConstructor x.constructors }


noRangeValueConstructor : ValueConstructor -> ValueConstructor
noRangeValueConstructor valueConstructor =
    unRange valueConstructor


noRangeFunction : Function -> Function
noRangeFunction f =
    { f
        | declaration = noRangeFunctionDeclaration f.declaration
    }


noRangeFunctionDeclaration : FunctionDeclaration -> FunctionDeclaration
noRangeFunctionDeclaration d =
    { d
        | expression = noRangeExpression d.expression
        , arguments = List.map noRangePattern d.arguments
        , name = unRange d.name
    }


noRangeInnerExpression : InnerExpression -> InnerExpression
noRangeInnerExpression inner =
    case inner of
        Application xs ->
            Application <| List.map noRangeExpression xs

        OperatorApplicationExpression app ->
            OperatorApplicationExpression { app | left = noRangeExpression app.left, right = noRangeExpression app.right }

        ListExpr xs ->
            ListExpr <| List.map noRangeExpression xs

        IfBlock a b c ->
            IfBlock
                (noRangeExpression a)
                (noRangeExpression b)
                (noRangeExpression c)

        RecordExpr fields ->
            RecordExpr <| List.map (Tuple2.mapSecond noRangeExpression) fields

        LambdaExpression lambda ->
            LambdaExpression
                { lambda
                    | expression = noRangeExpression lambda.expression
                    , args = List.map noRangePattern lambda.args
                }

        RecordUpdateExpression update ->
            RecordUpdateExpression { update | updates = List.map (Tuple2.mapSecond noRangeExpression) update.updates }

        CaseExpression { cases, expression } ->
            CaseExpression
                { cases =
                    cases
                        |> List.map (Tuple2.mapFirst noRangePattern)
                        |> List.map (Tuple2.mapSecond noRangeExpression)
                , expression = noRangeExpression expression
                }

        LetExpression { declarations, expression } ->
            LetExpression
                { declarations = List.map noRangeDeclaration declarations
                , expression = noRangeExpression expression
                }

        TupledExpression x ->
            TupledExpression <| List.map noRangeExpression x

        ParenthesizedExpression x ->
            ParenthesizedExpression <| noRangeExpression x

        RecordAccess e n ->
            RecordAccess (noRangeExpression e) n

        _ ->
            inner
