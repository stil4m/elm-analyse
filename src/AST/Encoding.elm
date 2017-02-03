module AST.Encoding exposing (encode)

import AST.Ranges as Ranges exposing (encode)
import AST.Types exposing (..)
import Json.Encode as JE exposing (Value)


asList : (a -> Value) -> List a -> Value
asList f =
    JE.list << List.map f


encode : File -> Value
encode { moduleDefinition, imports, declarations } =
    JE.object
        [ ( "moduleDefinition", encodeModule moduleDefinition )
        , ( "imports", asList encodeImport imports )
        , ( "declarations", asList encodeDeclaration declarations )
        ]


typed : String -> Value -> Value
typed x v =
    JE.object
        [ ( "type", JE.string x )
        , ( x, v )
        ]


encodeModule : Module -> Value
encodeModule m =
    case m of
        NormalModule d ->
            typed "normal" (encodeDefaultModuleData d)

        PortModule d ->
            typed "port" (encodeDefaultModuleData d)

        EffectModule d ->
            typed "effect" (encodeEffectModuleData d)

        NoModule ->
            typed "nomodule" (JE.null)


encodeEffectModuleData : EffectModuleData -> Value
encodeEffectModuleData { moduleName, exposingList, command, subscription } =
    JE.object
        [ ( "moduleName", encodeModuleName moduleName )
        , ( "exposingList", encodeExposingList exposingList encodeExpose )
        , ( "command", command |> Maybe.map JE.string |> Maybe.withDefault JE.null )
        , ( "subscription", subscription |> Maybe.map JE.string |> Maybe.withDefault JE.null )
        ]


encodeDefaultModuleData : DefaultModuleData -> Value
encodeDefaultModuleData { moduleName, exposingList } =
    JE.object
        [ ( "moduleName", encodeModuleName moduleName )
        , ( "exposingList", encodeExposingList exposingList encodeExpose )
        ]


encodeModuleName : ModuleName -> Value
encodeModuleName =
    List.map JE.string >> JE.list


encodeExpose : Expose -> Value
encodeExpose exp =
    case exp of
        InfixExpose x r ->
            typed "infix" <|
                JE.object
                    [ ( "name", JE.string x )
                    , ( "range", Ranges.encode r )
                    ]

        FunctionExpose x r ->
            typed "function" <|
                JE.object
                    [ ( "name", JE.string x )
                    , ( "range", Ranges.encode r )
                    ]

        TypeOrAliasExpose x r ->
            typed "typeOrAlias" <|
                JE.object
                    [ ( "name", JE.string x )
                    , ( "range", Ranges.encode r )
                    ]

        TypeExpose x inner r ->
            typed "type" <|
                JE.object
                    [ ( "name", JE.string x )
                    , ( "inner", encodeExposingList inner encodeValueConstructorExpose )
                    , ( "range", Ranges.encode r )
                    ]


encodeValueConstructorExpose : ValueConstructorExpose -> Value
encodeValueConstructorExpose ( name, range ) =
    JE.object
        [ ( "name", JE.string name )
        , ( "range", Ranges.encode range )
        ]


encodeExposingList : Exposure a -> (a -> Value) -> Value
encodeExposingList exp f =
    case exp of
        None ->
            typed "none" <| JE.null

        All r ->
            typed "all" <| Ranges.encode r

        Explicit l ->
            typed "explicit" (asList f l)


encodeImport : Import -> Value
encodeImport { moduleName, moduleAlias, exposingList, range } =
    JE.object
        [ ( "moduleName", encodeModuleName moduleName )
        , ( "moduleAlias"
          , moduleAlias
                |> Maybe.map encodeModuleName
                |> Maybe.withDefault JE.null
          )
        , ( "exposingList", encodeExposingList exposingList encodeExpose )
        , ( "range", Ranges.encode range )
        ]


encodeDeclaration : Declaration -> Value
encodeDeclaration decl =
    case decl of
        FuncDecl function ->
            typed "function" (encodeFunction function)

        AliasDecl typeAlias ->
            typed "typeAlias" (encodeTypeAlias typeAlias)

        TypeDecl typeDeclaration ->
            typed "typedecl" (encodeType typeDeclaration)

        PortDeclaration sig ->
            typed "port" (encodeSignature sig)

        InfixDeclaration inf ->
            typed "infix"
                (JE.object
                    [ ( "direction", encodeInfixDirection inf.direction )
                    , ( "precedence", JE.int inf.precedence )
                    , ( "operator", JE.string inf.operator )
                    ]
                )

        DestructuringDeclaration x ->
            typed "destrucutring" (encodeDestructuring x)


encodeDestructuring : Destructuring -> Value
encodeDestructuring { pattern, expression } =
    JE.object
        [ ( "pattern", encodePattern pattern )
        , ( "expression", encodeExpression expression )
        ]


encodeType : Type -> Value
encodeType { name, generics, constructors } =
    JE.object
        [ ( "name", JE.string name )
        , ( "generics", asList JE.string generics )
        , ( "constructors", asList encodeValueConstructor constructors )
        ]


encodeValueConstructor : ValueConstructor -> Value
encodeValueConstructor { name, arguments, range } =
    JE.object
        [ ( "name", JE.string name )
        , ( "arguments", asList encodeTypeReference arguments )
        , ( "range", Ranges.encode range )
        ]


encodeTypeAlias : TypeAlias -> Value
encodeTypeAlias { name, generics, typeReference, range } =
    JE.object
        [ ( "name", JE.string name )
        , ( "generics", asList JE.string generics )
        , ( "typeReference", encodeTypeReference typeReference )
        , ( "range", Ranges.encode range )
        ]


encodeFunction : Function -> Value
encodeFunction { documentation, signature, declaration } =
    JE.object
        [ ( "documentation", Maybe.map JE.string documentation |> Maybe.withDefault JE.null )
        , ( "signature", Maybe.map encodeSignature signature |> Maybe.withDefault JE.null )
        , ( "declaration", encodeFunctionDeclaration declaration )
        ]


encodeSignature : FunctionSignature -> Value
encodeSignature { operatorDefinition, name, typeReference } =
    JE.object
        [ ( "operatorDefinition", JE.bool operatorDefinition )
        , ( "name", JE.string name )
        , ( "typeReference", encodeTypeReference typeReference )
        ]


encodeTypeReference : TypeReference -> Value
encodeTypeReference typeReference =
    case typeReference of
        GenericType name ->
            typed "generic" (JE.string name)

        Typed moduleName name args ->
            typed "typed" <|
                JE.object
                    [ ( "moduleName", encodeModuleName moduleName )
                    , ( "name", JE.string name )
                    , ( "args", asList encodeTypeArg args )
                    ]

        Unit ->
            typed "unit" (JE.null)

        Tupled t ->
            typed "tupled" (asList encodeTypeReference t)

        FunctionTypeReference left right ->
            typed "function" <|
                JE.object
                    [ ( "left", encodeTypeReference left )
                    , ( "right", encodeTypeReference right )
                    ]

        Record recordDefinition ->
            typed "record" (encodeRecordDefinition recordDefinition)

        GenericRecord name recordDefinition ->
            typed "genericRecord" <|
                JE.object
                    [ ( "name", JE.string name )
                    , ( "values", encodeRecordDefinition recordDefinition )
                    ]


encodeRecordDefinition : RecordDefinition -> Value
encodeRecordDefinition =
    JE.list << List.map encodeRecordField


encodeRecordField : RecordField -> Value
encodeRecordField ( name, ref ) =
    JE.object
        [ ( "name", JE.string name )
        , ( "typeReference", encodeTypeReference ref )
        ]


encodeTypeArg : TypeArg -> Value
encodeTypeArg typeArg =
    case typeArg of
        Generic name ->
            typed "generic" (JE.string name)

        Concrete tr ->
            typed "concrete" (encodeTypeReference tr)


encodeFunctionDeclaration : FunctionDeclaration -> Value
encodeFunctionDeclaration { operatorDefinition, name, arguments, expression } =
    JE.object
        [ ( "operatorDefinition", JE.bool operatorDefinition )
        , ( "name", encodeVariablePointer name )
        , ( "arguments", asList encodePattern arguments )
        , ( "expression", encodeExpression expression )
        ]


encodeVariablePointer : VariablePointer -> Value
encodeVariablePointer { value, range } =
    JE.object
        [ ( "value", JE.string value )
        , ( "range", Ranges.encode range )
        ]


encodePattern : Pattern -> Value
encodePattern pattern =
    case pattern of
        AllPattern ->
            typed "all" (JE.null)

        UnitPattern ->
            typed "unit" (JE.null)

        CharPattern c ->
            typed "char" (JE.string <| String.fromChar c)

        StringPattern v ->
            typed "char" (JE.string v)

        IntPattern i ->
            typed "int" (JE.int i)

        FloatPattern f ->
            typed "float" (JE.float f)

        TuplePattern patterns ->
            typed "tuple" (asList encodePattern patterns)

        RecordPattern pointers ->
            typed "record" (asList encodeVariablePointer pointers)

        UnConsPattern p1 p2 ->
            typed "uncons"
                (JE.object
                    [ ( "left", encodePattern p1 )
                    , ( "right", encodePattern p2 )
                    ]
                )

        ListPattern patterns ->
            typed "list" (asList encodePattern patterns)

        VarPattern pointer ->
            typed "var" (encodeVariablePointer pointer)

        NamedPattern qualifiedNameRef patterns ->
            typed "named" <|
                JE.object
                    [ ( "qualified", encodeQualifiedNameRef qualifiedNameRef )
                    , ( "patterns", asList encodePattern patterns )
                    ]

        QualifiedNamePattern qualifiedNameRef ->
            typed "qualifiedName" <| encodeQualifiedNameRef qualifiedNameRef

        AsPattern pattern variablePointer ->
            typed "as" <|
                JE.object
                    [ ( "name", encodeVariablePointer variablePointer )
                    , ( "pattern", encodePattern pattern )
                    ]

        ParentisizedPattern p1 ->
            typed "parentisized" (encodePattern p1)


encodeQualifiedNameRef : QualifiedNameRef -> Value
encodeQualifiedNameRef { moduleName, name, range } =
    JE.object
        [ ( "moduleName", encodeModuleName moduleName )
        , ( "name", JE.string name )
        , ( "range", Ranges.encode range )
        ]


encodeExpression : Expression -> Value
encodeExpression ( range, inner ) =
    JE.object
        [ ( "range", Ranges.encode range )
        , ( "inner"
          , case inner of
                UnitExpr ->
                    typed "unit" JE.null

                Application l ->
                    typed "application" (asList encodeExpression l)

                OperatorApplicationExpression operatorApplication ->
                    typed "operatorapplication" (encodeOperatorApplication operatorApplication)

                FunctionOrValue x ->
                    typed "functionOrValue" (JE.string x)

                IfBlock c t e ->
                    typed "ifBlock" <|
                        JE.object
                            [ ( "clause", encodeExpression c )
                            , ( "then", encodeExpression t )
                            , ( "else", encodeExpression e )
                            ]

                PrefixOperator x ->
                    typed "prefixoperator" (JE.string x)

                Operator x ->
                    typed "operator" (JE.string x)

                Integer x ->
                    typed "integer" (JE.int x)

                Floatable x ->
                    typed "float" (JE.float x)

                Literal x ->
                    typed "literal" (JE.string x)

                CharLiteral c ->
                    typed "charLiteral" (JE.string <| String.fromChar c)

                TupledExpression xs ->
                    typed "tupled" (asList encodeExpression xs)

                ListExpr xs ->
                    typed "list" (asList encodeExpression xs)

                ParenthesizedExpression x ->
                    typed "parenthesized" (encodeExpression x)

                LetExpression x ->
                    typed "let" <| encodeLetBlock x

                CaseExpression x ->
                    typed "case" <| encodeCaseBlock x

                LambdaExpression x ->
                    typed "lambda" <| encodeLambda x

                QualifiedExpr moduleName name ->
                    typed "qualified" <|
                        JE.object
                            [ ( "moduleName", encodeModuleName moduleName )
                            , ( "name", JE.string name )
                            ]

                RecordAccess exp name ->
                    typed "recordAccess" <|
                        JE.object
                            [ ( "expression", encodeExpression exp )
                            , ( "name", JE.string name )
                            ]

                RecordAccessFunction x ->
                    typed "recordAccessFunction" (JE.string x)

                RecordExpr xs ->
                    typed "record" (asList encodeRecordSetter xs)

                RecordUpdateExpression recordUpdate ->
                    typed "recordUpdate" (encodeRecordUpdate recordUpdate)

                GLSLExpression x ->
                    typed "glsl" (JE.string x)
          )
        ]


encodeRecordUpdate : RecordUpdate -> Value
encodeRecordUpdate { name, updates } =
    JE.object
        [ ( "name", JE.string name )
        , ( "updates", asList encodeRecordSetter updates )
        ]


encodeRecordSetter : RecordSetter -> Value
encodeRecordSetter ( field, expression ) =
    JE.object
        [ ( "field", JE.string field )
        , ( "expression", encodeExpression expression )
        ]


encodeLambda : Lambda -> Value
encodeLambda { args, expression } =
    JE.object
        [ ( "patterns", asList encodePattern args )
        , ( "expression", encodeExpression expression )
        ]


encodeCaseBlock : CaseBlock -> Value
encodeCaseBlock { cases, expression } =
    JE.object
        [ ( "cases", asList encodeCase cases )
        , ( "expression", encodeExpression expression )
        ]


encodeCase : Case -> Value
encodeCase ( pattern, expression ) =
    JE.object
        [ ( "pattern", encodePattern pattern )
        , ( "expression", encodeExpression expression )
        ]


encodeLetBlock : LetBlock -> Value
encodeLetBlock { declarations, expression } =
    JE.object
        [ ( "declarations", asList encodeDeclaration declarations )
        , ( "expression", encodeExpression expression )
        ]


encodeOperatorApplication : OperatorApplication -> Value
encodeOperatorApplication { operator, direction, left, right } =
    JE.object
        [ ( "operator", JE.string operator )
        , ( "direction", encodeInfixDirection direction )
        , ( "left", encodeExpression left )
        , ( "right", encodeExpression right )
        ]


encodeInfixDirection : InfixDirection -> Value
encodeInfixDirection d =
    case d of
        Left ->
            JE.string "left"

        Right ->
            JE.string "right"
