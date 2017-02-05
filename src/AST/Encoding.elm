module AST.Encoding exposing (encode, encodeInfix)

import AST.Ranges as Ranges
import AST.Types exposing (..)
import Json.Encode as JE exposing (Value)
import Util.Json exposing (encodeTyped)


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


encodeModule : Module -> Value
encodeModule m =
    case m of
        NormalModule d ->
            encodeTyped "normal" (encodeDefaultModuleData d)

        PortModule d ->
            encodeTyped "port" (encodeDefaultModuleData d)

        EffectModule d ->
            encodeTyped "effect" (encodeEffectModuleData d)

        NoModule ->
            encodeTyped "nomodule" (JE.null)


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
            encodeTyped "infix" <|
                JE.object
                    [ ( "name", JE.string x )
                    , ( "range", Ranges.encode r )
                    ]

        FunctionExpose x r ->
            encodeTyped "function" <|
                JE.object
                    [ ( "name", JE.string x )
                    , ( "range", Ranges.encode r )
                    ]

        TypeOrAliasExpose x r ->
            encodeTyped "typeOrAlias" <|
                JE.object
                    [ ( "name", JE.string x )
                    , ( "range", Ranges.encode r )
                    ]

        TypeExpose x inner r ->
            encodeTyped "typeexpose" <|
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
            encodeTyped "none" <| JE.null

        All r ->
            encodeTyped "all" <| Ranges.encode r

        Explicit l ->
            encodeTyped "explicit" (asList f l)


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
            encodeTyped "function" (encodeFunction function)

        AliasDecl typeAlias ->
            encodeTyped "typeAlias" (encodeTypeAlias typeAlias)

        TypeDecl typeDeclaration ->
            encodeTyped "typedecl" (encodeType typeDeclaration)

        PortDeclaration sig ->
            encodeTyped "port" (encodeSignature sig)

        InfixDeclaration inf ->
            encodeTyped "infix"
                (encodeInfix inf)

        DestructuringDeclaration x ->
            encodeTyped "destrucutring" (encodeDestructuring x)


encodeInfix : Infix -> Value
encodeInfix inf =
    JE.object
        [ ( "direction", encodeInfixDirection inf.direction )
        , ( "precedence", JE.int inf.precedence )
        , ( "operator", JE.string inf.operator )
        ]


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
            encodeTyped "generic" (JE.string name)

        Typed moduleName name args ->
            encodeTyped "typed" <|
                JE.object
                    [ ( "moduleName", encodeModuleName moduleName )
                    , ( "name", JE.string name )
                    , ( "args", asList encodeTypeArg args )
                    ]

        Unit ->
            encodeTyped "unit" (JE.null)

        Tupled t ->
            encodeTyped "tupled" (asList encodeTypeReference t)

        FunctionTypeReference left right ->
            encodeTyped "function" <|
                JE.object
                    [ ( "left", encodeTypeReference left )
                    , ( "right", encodeTypeReference right )
                    ]

        Record recordDefinition ->
            encodeTyped "record" (encodeRecordDefinition recordDefinition)

        GenericRecord name recordDefinition ->
            encodeTyped "genericRecord" <|
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
            encodeTyped "generic" (JE.string name)

        Concrete tr ->
            encodeTyped "concrete" (encodeTypeReference tr)


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
            encodeTyped "all" (JE.null)

        UnitPattern ->
            encodeTyped "unit" (JE.null)

        CharPattern c ->
            encodeTyped "char" (JE.string <| String.fromChar c)

        StringPattern v ->
            encodeTyped "char" (JE.string v)

        IntPattern i ->
            encodeTyped "int" (JE.int i)

        FloatPattern f ->
            encodeTyped "float" (JE.float f)

        TuplePattern patterns ->
            encodeTyped "tuple" (asList encodePattern patterns)

        RecordPattern pointers ->
            encodeTyped "record" (asList encodeVariablePointer pointers)

        UnConsPattern p1 p2 ->
            encodeTyped "uncons"
                (JE.object
                    [ ( "left", encodePattern p1 )
                    , ( "right", encodePattern p2 )
                    ]
                )

        ListPattern patterns ->
            encodeTyped "list" (asList encodePattern patterns)

        VarPattern pointer ->
            encodeTyped "var" (encodeVariablePointer pointer)

        NamedPattern qualifiedNameRef patterns ->
            encodeTyped "named" <|
                JE.object
                    [ ( "qualified", encodeQualifiedNameRef qualifiedNameRef )
                    , ( "patterns", asList encodePattern patterns )
                    ]

        QualifiedNamePattern qualifiedNameRef ->
            encodeTyped "qualifiedName" <| encodeQualifiedNameRef qualifiedNameRef

        AsPattern destructured variablePointer ->
            encodeTyped "as" <|
                JE.object
                    [ ( "name", encodeVariablePointer variablePointer )
                    , ( "pattern", encodePattern destructured )
                    ]

        ParentisizedPattern p1 ->
            encodeTyped "parentisized" (encodePattern p1)


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
                    encodeTyped "unit" JE.null

                Application l ->
                    encodeTyped "application" (asList encodeExpression l)

                OperatorApplicationExpression operatorApplication ->
                    encodeTyped "operatorapplication" (encodeOperatorApplication operatorApplication)

                FunctionOrValue x ->
                    encodeTyped "functionOrValue" (JE.string x)

                IfBlock c t e ->
                    encodeTyped "ifBlock" <|
                        JE.object
                            [ ( "clause", encodeExpression c )
                            , ( "then", encodeExpression t )
                            , ( "else", encodeExpression e )
                            ]

                PrefixOperator x ->
                    encodeTyped "prefixoperator" (JE.string x)

                Operator x ->
                    encodeTyped "operator" (JE.string x)

                Integer x ->
                    encodeTyped "integer" (JE.int x)

                Floatable x ->
                    encodeTyped "float" (JE.float x)

                Literal x ->
                    encodeTyped "literal" (JE.string x)

                CharLiteral c ->
                    encodeTyped "charLiteral" (JE.string <| String.fromChar c)

                TupledExpression xs ->
                    encodeTyped "tupled" (asList encodeExpression xs)

                ListExpr xs ->
                    encodeTyped "list" (asList encodeExpression xs)

                ParenthesizedExpression x ->
                    encodeTyped "parenthesized" (encodeExpression x)

                LetExpression x ->
                    encodeTyped "let" <| encodeLetBlock x

                CaseExpression x ->
                    encodeTyped "case" <| encodeCaseBlock x

                LambdaExpression x ->
                    encodeTyped "lambda" <| encodeLambda x

                QualifiedExpr moduleName name ->
                    encodeTyped "qualified" <|
                        JE.object
                            [ ( "moduleName", encodeModuleName moduleName )
                            , ( "name", JE.string name )
                            ]

                RecordAccess exp name ->
                    encodeTyped "recordAccess" <|
                        JE.object
                            [ ( "expression", encodeExpression exp )
                            , ( "name", JE.string name )
                            ]

                RecordAccessFunction x ->
                    encodeTyped "recordAccessFunction" (JE.string x)

                RecordExpr xs ->
                    encodeTyped "record" (asList encodeRecordSetter xs)

                RecordUpdateExpression recordUpdate ->
                    encodeTyped "recordUpdate" (encodeRecordUpdate recordUpdate)

                GLSLExpression x ->
                    encodeTyped "glsl" (JE.string x)
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
