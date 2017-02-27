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


parseStateToMaybe : State -> String -> Parser State b -> Maybe ( b, State )
parseStateToMaybe state s p =
    case Combine.runParser (p <* Combine.end) state s of
        Ok ( x, _, r ) ->
            Just ( r, x )

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
        QualifiedNamePattern x _ ->
            QualifiedNamePattern x emptyRange

        RecordPattern ls _ ->
            RecordPattern (List.map unRange ls) emptyRange

        VarPattern x _ ->
            VarPattern x emptyRange

        NamedPattern x y _ ->
            NamedPattern x (List.map noRangePattern y) emptyRange

        ParenthesizedPattern x _ ->
            ParenthesizedPattern (noRangePattern x) emptyRange

        AsPattern x y _ ->
            AsPattern (noRangePattern x) (unRange y) emptyRange

        UnConsPattern x y _ ->
            UnConsPattern (noRangePattern x) (noRangePattern y) emptyRange

        CharPattern c _ ->
            CharPattern c emptyRange

        StringPattern s _ ->
            StringPattern s emptyRange

        FloatPattern f _ ->
            FloatPattern f emptyRange

        IntPattern i _ ->
            IntPattern i emptyRange

        AllPattern _ ->
            AllPattern emptyRange

        UnitPattern _ ->
            UnitPattern emptyRange

        ListPattern x _ ->
            ListPattern (List.map noRangePattern x) emptyRange

        TuplePattern x _ ->
            TuplePattern (List.map noRangePattern x) emptyRange


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

        PortDeclaration d ->
            PortDeclaration (noRangeSignature d)

        _ ->
            decl


noRangeTypeAlias : TypeAlias -> TypeAlias
noRangeTypeAlias typeAlias =
    unRange { typeAlias | typeReference = noRangeTypeReference typeAlias.typeReference }


noRangeTypeReference : TypeReference -> TypeReference
noRangeTypeReference typeReference =
    case typeReference of
        GenericType x _ ->
            GenericType x emptyRange

        Typed a b c _ ->
            Typed a b (List.map noRangeTypeArg c) emptyRange

        Unit _ ->
            Unit emptyRange

        Tupled a _ ->
            Tupled (List.map noRangeTypeReference a) emptyRange

        Record a _ ->
            Record (List.map noRangeRecordField a) emptyRange

        GenericRecord a b _ ->
            GenericRecord a (List.map noRangeRecordField b) emptyRange

        FunctionTypeReference a b _ ->
            FunctionTypeReference
                (noRangeTypeReference a)
                (noRangeTypeReference b)
                emptyRange


noRangeTypeArg : TypeArg -> TypeArg
noRangeTypeArg typeArg =
    case typeArg of
        Generic s ->
            Generic s

        Concrete t ->
            Concrete (noRangeTypeReference t)


noRangeRecordField : RecordField -> RecordField
noRangeRecordField =
    Tuple.mapSecond noRangeTypeReference


noRangeTypeDeclaration : Type -> Type
noRangeTypeDeclaration x =
    { x | constructors = List.map noRangeValueConstructor x.constructors }


noRangeValueConstructor : ValueConstructor -> ValueConstructor
noRangeValueConstructor valueConstructor =
    unRange ({ valueConstructor | arguments = List.map noRangeTypeReference valueConstructor.arguments })


noRangeFunction : Function -> Function
noRangeFunction f =
    { f
        | declaration = noRangeFunctionDeclaration f.declaration
        , signature = Maybe.map noRangeSignature f.signature
    }


noRangeSignature : FunctionSignature -> FunctionSignature
noRangeSignature signature =
    { signature | typeReference = noRangeTypeReference signature.typeReference }


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

        OperatorApplication op dir left right ->
            OperatorApplication op dir (noRangeExpression left) (noRangeExpression right)

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
